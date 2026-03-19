import fs from "node:fs/promises";
import path from "node:path";
import { load, type Cheerio } from "cheerio";
import type { AnyNode, Element } from "domhandler";

type ResumeExperienceItem = {
  company: string;
  companyUrl?: string;
  note?: string;
  role: string;
  period: string;
};

type ResumeSecondarySkillItem =
  | string
  | {
      label: string;
      subitems?: string[];
    };

type ResumeContent = {
  about: string[];
  experience: ResumeExperienceItem[];
  primarySkills: {
    heading: string;
    items: string[];
  };
  secondarySkills: {
    heading: string;
    groups: Array<{
      title: string;
      items: string[] | Array<{ label: string; subitems?: string[] }>;
    }>;
  };
  education: Array<{
    school: string;
    degree: string;
    period: string;
  }>;
  manualReview: string[];
};

type WorkEntry = {
  label: string;
  url?: string;
  details?: WorkEntry[];
  notes?: string[];
};

type WorkContent = {
  categories: Array<{
    title: string;
    entries: WorkEntry[];
  }>;
  manualReview: string[];
};

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function ownText($el: Cheerio<Element>): string {
  const clone = $el.clone();
  clone.children().remove();
  return normalizeText(clone.text());
}

function getLegacyContentRoot(html: string, fileLabel: string) {
  const $ = load(html);
  const root = $(".entry-content .shapely-content").first();

  if (root.length === 0) {
    throw new Error(`Could not find .entry-content .shapely-content in ${fileLabel}`);
  }

  return { $, root };
}

function findLargeHeading(
  $: ReturnType<typeof load>,
  root: Cheerio<Element>,
  heading: string,
): Cheerio<Element> {
  return root
    .find("p.has-large-font-size")
    .filter((_: number, el: Element) => normalizeText($(el).text()) === heading)
    .first();
}

function extractResume(html: string): ResumeContent {
  const { $, root } = getLegacyContentRoot(html, "resume html");
  const manualReview: string[] = [];

  const aboutHeading = findLargeHeading($, root, "About Me");
  const about: string[] = [];
  if (aboutHeading.length > 0) {
    let node = aboutHeading.next();
    while (node.length > 0) {
      if (node.is("p.has-large-font-size")) {
        break;
      }
      if (node.is("p")) {
        const text = normalizeText(node.text());
        if (text) {
          about.push(text);
        }
      }
      node = node.next();
    }
  } else {
    manualReview.push("Missing 'About Me' section heading.");
  }

  const experienceHeading = findLargeHeading($, root, "Experience");
  const experience: ResumeExperienceItem[] = [];
  if (experienceHeading.length > 0) {
    const list = experienceHeading.nextAll("ul.wp-block-list").first();
    if (list.length > 0) {
      list.children("li").each((index: number, li: Element) => {
        const liNode = $(li);
        const link = liNode.children("a").first();
        const companyText = normalizeText(link.length > 0 ? link.text() : ownText(liNode));
        const trailingText = normalizeText(ownText(liNode));
        const rolePeriodItems = liNode
          .children("ul.wp-block-list")
          .first()
          .children("li")
          .map((_: number, childLi: Element) => normalizeText($(childLi).text()))
          .get()
          .filter(Boolean);

        if (rolePeriodItems.length < 2) {
          manualReview.push(
            `Experience item ${index + 1} did not include expected role/period pair: '${companyText}'.`,
          );
          return;
        }

        const item: ResumeExperienceItem = {
          company: companyText,
          role: rolePeriodItems[0],
          period: rolePeriodItems[1],
        };

        if (link.length > 0) {
          const href = link.attr("href");
          if (href) {
            item.companyUrl = href;
          }
        }

        if (trailingText) {
          item.note = trailingText;
        }

        experience.push(item);
      });
    } else {
      manualReview.push("Missing experience list under 'Experience'.");
    }
  } else {
    manualReview.push("Missing 'Experience' section heading.");
  }

  const primarySkillsHeading = findLargeHeading($, root, "Primary Skills");
  let primaryHeadingText = "";
  let primaryItems: string[] = [];
  if (primarySkillsHeading.length > 0) {
    const subheading = primarySkillsHeading.nextAll("p.has-medium-font-size").first();
    const list = subheading.nextAll("ul.wp-block-list").first();
    primaryHeadingText = normalizeText(subheading.text());
    primaryItems = list
      .children("li")
      .map((_: number, li: Element) => normalizeText($(li).text()))
      .get()
      .filter(Boolean);

    if (!primaryHeadingText || primaryItems.length === 0) {
      manualReview.push("Primary skills section appears incomplete.");
    }
  } else {
    manualReview.push("Missing 'Primary Skills' section heading.");
  }

  const secondarySkillsHeading = findLargeHeading($, root, "Secondary Skills");
  const secondaryGroups: Array<{
    title: string;
    items: string[] | Array<{ label: string; subitems?: string[] }>;
  }> = [];

  if (secondarySkillsHeading.length > 0) {
    let node = secondarySkillsHeading.next();
    while (node.length > 0) {
      if (node.is("p.has-large-font-size") && normalizeText(node.text()) === "Education") {
        break;
      }

      if (node.is("p.has-medium-font-size")) {
        const title = normalizeText(node.text());
        const list = node.nextAll("ul.wp-block-list").first();
        const rawItems: ResumeSecondarySkillItem[] = list
          .children("li")
          .map((_: number, li: Element) => {
            const liNode = $(li);
            const nested = liNode.children("ul.wp-block-list").first();
            const label = normalizeText(ownText(liNode));
            if (nested.length > 0) {
              const subitems = nested
                .children("li")
                .map((__: number, nestedLi: Element) => normalizeText($(nestedLi).text()))
                .get()
                .filter(Boolean);
              return {
                label,
                subitems,
              };
            }
            return label;
          })
          .get()
          .filter((item: ResumeSecondarySkillItem) => {
            if (typeof item === "string") {
              return item.length > 0;
            }
            return item.label.length > 0;
          });

        const hasNested = rawItems.some((item: ResumeSecondarySkillItem) => typeof item !== "string");
        const items = hasNested
          ? rawItems.map((item: ResumeSecondarySkillItem) =>
              typeof item === "string" ? { label: item } : item,
            )
          : (rawItems as string[]);

        if (!title || rawItems.length === 0) {
          manualReview.push(`Secondary skills group missing title/items near '${title || "unknown"}'.`);
        } else {
          secondaryGroups.push({ title, items });
        }
      }

      node = node.next();
    }
  } else {
    manualReview.push("Missing 'Secondary Skills' section heading.");
  }

  const educationHeading = findLargeHeading($, root, "Education");
  const education: Array<{ school: string; degree: string; period: string }> = [];
  if (educationHeading.length > 0) {
    const list = educationHeading.nextAll("ul.wp-block-list").first();
    list.children("li").each((index: number, li: Element) => {
      const liNode = $(li);
      const school = normalizeText(ownText(liNode));
      const nestedItems = liNode
        .children("ul.wp-block-list")
        .first()
        .children("li")
        .map((_: number, nestedLi: Element) => normalizeText($(nestedLi).text()))
        .get()
        .filter(Boolean);

      if (!school || nestedItems.length < 2) {
        manualReview.push(
          `Education item ${index + 1} did not include expected school/degree/period structure.`,
        );
        return;
      }

      education.push({
        school,
        degree: nestedItems[0],
        period: nestedItems[1],
      });
    });
  } else {
    manualReview.push("Missing 'Education' section heading.");
  }

  return {
    about,
    experience,
    primarySkills: {
      heading: primaryHeadingText,
      items: primaryItems,
    },
    secondarySkills: {
      heading: "Secondary Skills",
      groups: secondaryGroups,
    },
    education,
    manualReview,
  };
}

function parseWorkEntry($: ReturnType<typeof load>, liNode: Cheerio<Element>, manualReview: string[]): WorkEntry {
  const childList = liNode.children("ul.wp-block-list").first();
  const inlineNode = liNode.clone();
  inlineNode.children("ul.wp-block-list").remove();
  const inlineChildren = inlineNode.contents().toArray();
  const inlineEntries: WorkEntry[] = [];

  for (const node of inlineChildren) {
    const typedNode = node as AnyNode;
    if (typedNode.type === "text") {
      const chunk = normalizeText((typedNode as { data?: string }).data ?? "");
      if (!chunk) {
        continue;
      }
      const parts = chunk
        .split(",")
        .map((part) => normalizeText(part))
        .filter(Boolean);
      for (const part of parts) {
        inlineEntries.push({ label: part });
      }
      continue;
    }

    if ($(node).is("a")) {
      const label = normalizeText($(node).text());
      const url = $(node).attr("href");
      if (!label) {
        continue;
      }
      inlineEntries.push(url ? { label, url } : { label });
      continue;
    }

    const chunk = normalizeText($(node).text());
    if (!chunk) {
      continue;
    }
    const parts = chunk
      .split(",")
      .map((part) => normalizeText(part))
      .filter(Boolean);
    for (const part of parts) {
      inlineEntries.push({ label: part });
    }
  }

  let label = normalizeText(inlineNode.text());
  const firstDirectLink = liNode.children("a").first();
  if (!label && firstDirectLink.length > 0) {
    label = normalizeText(firstDirectLink.text());
  }

  if (!label) {
    label = normalizeText(liNode.text());
    manualReview.push("Work entry had no clear direct label; fell back to full list-item text.");
  }

  const hasChildList = childList.length > 0;
  if (!hasChildList && inlineEntries.length === 1 && !inlineEntries[0].details && !inlineEntries[0].notes) {
    const single = inlineEntries[0];
    if (single.url || single.label === label) {
      return single;
    }
  }

  const entry: WorkEntry = { label };

  if (hasChildList) {
    if (firstDirectLink.length > 0) {
      const href = firstDirectLink.attr("href");
      if (href) {
        entry.url = href;
      }
    }
  } else if (inlineEntries.length > 1) {
    entry.details = inlineEntries;
  } else if (inlineEntries.length === 1 && inlineEntries[0].url) {
    entry.url = inlineEntries[0].url;
  }

  if (hasChildList) {
    const details = childList
      .children("li")
      .map((_: number, childLi: Element) => parseWorkEntry($, $(childLi), manualReview))
      .get();

    if (details.length > 0) {
      entry.details = details;
    }
  }

  return entry;
}

function extractWork(html: string): WorkContent {
  const { $, root } = getLegacyContentRoot(html, "work html");
  const manualReview: string[] = [];
  const categories: WorkContent["categories"] = [];

  root.children().each((_: number, node: Element) => {
    const el = $(node);
    if (!el.is("p.has-large-font-size")) {
      return;
    }

    const title = normalizeText(el.text());
    if (!title) {
      manualReview.push("Encountered an empty category heading in work content.");
      return;
    }

    const list = el.nextAll("ul.wp-block-list").first();
    if (list.length === 0) {
      manualReview.push(`Category '${title}' is missing an entry list.`);
      return;
    }

    const entries = list
      .children("li")
      .map((__: number, li: Element) => parseWorkEntry($, $(li), manualReview))
      .get();

    categories.push({ title, entries });
  });

  if (categories.length === 0) {
    manualReview.push("No work categories were extracted.");
  }

  return {
    categories,
    manualReview,
  };
}

async function run() {
  const repoRoot = process.cwd();
  const resumeHtmlPath = path.resolve(repoRoot, "legacy-site/html/Resume – Matt Motal.html");
  const workHtmlPath = path.resolve(repoRoot, "legacy-site/html/Work – Matt Motal.html");

  const [resumeHtml, workHtml] = await Promise.all([
    fs.readFile(resumeHtmlPath, "utf8"),
    fs.readFile(workHtmlPath, "utf8"),
  ]);

  const resumeContent = extractResume(resumeHtml);
  const workContent = extractWork(workHtml);

  const resumeOutputPath = path.resolve(repoRoot, "content/resume.json");
  const workOutputPath = path.resolve(repoRoot, "content/work.json");

  await Promise.all([
    fs.writeFile(resumeOutputPath, `${JSON.stringify(resumeContent, null, 2)}\n`, "utf8"),
    fs.writeFile(workOutputPath, `${JSON.stringify(workContent, null, 2)}\n`, "utf8"),
  ]);

  const totalResumeReview = resumeContent.manualReview.length;
  const totalWorkReview = workContent.manualReview.length;
  console.log(`Wrote ${path.relative(repoRoot, resumeOutputPath)} (${totalResumeReview} manualReview items).`);
  console.log(`Wrote ${path.relative(repoRoot, workOutputPath)} (${totalWorkReview} manualReview items).`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

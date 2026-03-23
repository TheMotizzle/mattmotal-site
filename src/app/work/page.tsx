import { AnimatedSection } from "@/components/motion/AnimatedSection";
import Link from "next/link";
import { getWorkContent } from "@/lib/content";

interface WorkEntry {
  label: string;
  url?: string;
  details?: WorkEntry[];
}

interface WorkCategory {
  title: string;
  entries: WorkEntry[];
}

interface WorkContent {
  categories: WorkCategory[];
  manualReview: string[];
}

function getSectionId(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const GROUP_LABEL_KEYWORDS = [
  "spots",
  "spot",
  "vfx breakdowns",
  "breakdowns",
  "accolades",
  "campaign",
  "campaigns",
];

function normalizeListToken(value: string): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  const withoutEdgeQuotes = trimmed.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "");
  return withoutEdgeQuotes.toLocaleLowerCase();
}

function getCommaSeparatedTokens(value: string): string[] {
  return value
    .split(",")
    .map((part) => normalizeListToken(part))
    .filter(Boolean);
}

function shouldSkipDuplicateChildren(entry: WorkEntry): boolean {
  if (!entry.details || entry.details.length === 0) {
    return false;
  }

  const parentTokens = getCommaSeparatedTokens(entry.label);
  if (parentTokens.length < 2) {
    return false;
  }

  const childHasUniqueData = entry.details.some(
    (detail) => detail.url || (detail.details && detail.details.length > 0),
  );
  if (childHasUniqueData) {
    return false;
  }

  const childTokens = entry.details.map((detail) => normalizeListToken(detail.label));
  if (childTokens.length !== parentTokens.length) {
    return false;
  }

  return parentTokens.every((token, index) => token === childTokens[index]);
}

function hasSimpleInlineChildren(entry: WorkEntry): entry is WorkEntry & { details: WorkEntry[] } {
  return Boolean(
    entry.details &&
      entry.details.length > 0 &&
      entry.details.every((detail) => !detail.details || detail.details.length === 0),
  );
}

function shouldHideParentForInlineChildren(entry: WorkEntry): boolean {
  if (!hasSimpleInlineChildren(entry)) {
    return false;
  }

  const parentTokens = getCommaSeparatedTokens(entry.label);
  if (parentTokens.length < 2) {
    return false;
  }

  const childTokens = entry.details.map((detail) => normalizeListToken(detail.label));
  if (childTokens.length !== parentTokens.length) {
    return false;
  }

  return parentTokens.every((token, index) => token === childTokens[index]);
}

function isAggregateSpotListNode(entry: WorkEntry): entry is WorkEntry & { details: WorkEntry[] } {
  if (!hasSimpleInlineChildren(entry)) {
    return false;
  }

  if (isGroupLikeLabel(entry.label)) {
    return false;
  }

  const parentTokens = getCommaSeparatedTokens(entry.label);
  if (parentTokens.length < 2) {
    return false;
  }

  const childTokens = entry.details.map((detail) => normalizeListToken(detail.label));
  if (childTokens.length !== parentTokens.length) {
    return false;
  }

  return parentTokens.every((token, index) => token === childTokens[index]);
}

function isGroupLikeLabel(label: string): boolean {
  const normalized = normalizeListToken(label);
  return GROUP_LABEL_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function shouldRenderInlineChildren(entry: WorkEntry): entry is WorkEntry & { details: WorkEntry[] } {
  if (entry.url) {
    return false;
  }

  return isAggregateSpotListNode(entry);
}

function WorkEntryList({
  entries,
  parentLabel,
}: {
  entries: WorkEntry[];
  parentLabel?: string;
}) {
  return (
    <ul className="list-disc list-inside space-y-2 text-gray-300">
      {entries.map((entry, index) => (
        <li key={`${entry.label}-${index}`}>
          {(() => {
            const inlineChildren = shouldRenderInlineChildren(entry) ? entry.details : null;
            const hideParentLabel = inlineChildren ? shouldHideParentForInlineChildren(entry) : false;

            return (
              <>
                {!hideParentLabel ? (
                  entry.url ? (
                    <Link
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {entry.label}
                    </Link>
                  ) : (
                    <span>{entry.label}</span>
                  )
                ) : null}

                {inlineChildren ? (
                  <span>
                    {!hideParentLabel ? " | " : ""}
                    {inlineChildren.map((detail, detailIndex) => (
                      <span key={`${detail.label}-${detailIndex}`}>
                        {detailIndex > 0 ? " | " : ""}
                        {detail.url ? (
                          <Link
                            href={detail.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            {detail.label}
                          </Link>
                        ) : (
                          <span>{detail.label}</span>
                        )}
                      </span>
                    ))}
                  </span>
                ) : null}

                {entry.details &&
                entry.details.length > 0 &&
                !inlineChildren &&
                !shouldSkipDuplicateChildren(entry) ? (
                  <div className="ml-5 mt-2">
                    <WorkEntryList entries={entry.details} parentLabel={entry.label} />
                  </div>
                ) : null}
              </>
            );
          })()}
        </li>
      ))}
    </ul>
  );
}

export default async function WorkPage() {
  const content = (await getWorkContent()) as WorkContent;
  const sectionLinks = content.categories.map((category) => ({
    title: category.title,
    id: getSectionId(category.title),
  }));

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 px-6 bg-neutral-900/50">
        <AnimatedSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Selected Work
          </h1>
          <p className="text-lg text-gray-400">
            A collection of VFX projects and collaborations
          </p>
        </AnimatedSection>
      </section>

      {/* Projects List */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <nav
              aria-label="Work section navigation"
              className="p-6 bg-neutral-900/30 border border-white/5 rounded-lg"
            >
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {sectionLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={`#${link.id}`}
                    className="text-lg font-display font-semibold text-white hover:text-gray-300 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </nav>
          </AnimatedSection>

          {content.categories.map((category, index) => (
            <AnimatedSection
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div
                id={getSectionId(category.title)}
                className="p-6 bg-neutral-900/30 border border-white/5 rounded-lg hover:border-white/20 transition-all hover:bg-neutral-900/50 scroll-mt-28"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">{category.title}</h2>
                <WorkEntryList entries={category.entries} parentLabel={category.title} />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}

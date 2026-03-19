import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getResumeContent } from "@/lib/content";

interface ResumeContent {
  about: string[];
  experience: Array<{
    company: string;
    companyUrl?: string;
    note?: string;
    role: string;
    period: string;
  }>;
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
}

export default async function ResumePage() {
  const content = (await getResumeContent()) as ResumeContent;

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-6 bg-neutral-900/50">
        <AnimatedSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Resume</h1>
          <p className="text-lg text-gray-400">Professional Background & Skills</p>
        </AnimatedSection>
      </section>

      {/* Resume Sections */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">About Me</h2>
            <div className="space-y-4 text-gray-300">
              {content.about.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Experience</h2>
            <div className="space-y-5 text-gray-300">
              {content.experience.map((item, index) => (
                <div key={index}>
                  <p className="text-white font-medium">
                    {item.companyUrl ? (
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition-colors"
                      >
                        {item.company}
                      </a>
                    ) : (
                      item.company
                    )}
                    {item.note ? ` ${item.note}` : ""}
                  </p>
                  <p>{item.role}</p>
                  <p>{item.period}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Primary Skills</h2>
            <p className="text-white mb-3">{content.primarySkills.heading}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {content.primarySkills.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">
              {content.secondarySkills.heading}
            </h2>
            <div className="space-y-6 text-gray-300">
              {content.secondarySkills.groups.map((group, groupIndex) => {
                const hasObjectItems =
                  group.items.length > 0 && typeof group.items[0] !== "string";

                return (
                  <div key={groupIndex}>
                    <p className="text-white mb-2">{group.title}</p>
                    {hasObjectItems ? (
                      <ul className="list-disc list-inside space-y-1">
                        {(group.items as Array<{ label: string; subitems?: string[] }>).map(
                          (item, itemIndex) => (
                            <li key={itemIndex}>
                              {item.label}
                              {item.subitems && item.subitems.length > 0 ? (
                                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                                  {item.subitems.map((subitem, subitemIndex) => (
                                    <li key={subitemIndex}>{subitem}</li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {(group.items as string[]).map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Education</h2>
            <div className="space-y-4 text-gray-300">
              {content.education.map((item, index) => (
                <div key={index}>
                  <p className="text-white font-medium">{item.school}</p>
                  <p>{item.degree}</p>
                  <p>{item.period}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

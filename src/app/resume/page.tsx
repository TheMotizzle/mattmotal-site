import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getResumeContent } from "@/lib/content";

interface ResumeSectionItem {
  title: string;
  details?: string[] | string;
}

interface ResumeSection {
  title: string;
  type: string;
  items: ResumeSectionItem[];
}

interface ResumeContent {
  sections: ResumeSection[];
}

export default async function ResumePage() {
  const content = await getResumeContent();

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
          {content.sections.map((section: ResumeSection, sectionIndex: number) => (
            <AnimatedSection
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index} className="text-gray-300">
                    {typeof item.details === "string" ? (
                      <p>{item.title}: {item.details}</p>
                    ) : Array.isArray(item.details) ? (
                      <div>
                        <span className="font-medium text-white">{item.title}</span>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {item.details.map((detail, dIndex) => (
                            <li key={dIndex}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>{item.title}</p>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}

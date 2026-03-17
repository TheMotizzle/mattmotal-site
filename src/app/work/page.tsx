import { AnimatedSection } from "@/components/motion/AnimatedSection";
import Link from "next/link";
import { getWorkContent } from "@/lib/content";

export default async function WorkPage() {
  const { projects: workItems } = await getWorkContent();
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
        <div className="max-w-4xl mx-auto space-y-6">
          {workItems.map((item: any, index: number) => (
            <AnimatedSection
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={item.link} target="_blank" rel="noopener noreferrer">
                <div className="p-6 bg-neutral-900/30 border border-white/5 rounded-lg hover:border-white/20 transition-all hover:bg-neutral-900/50">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}

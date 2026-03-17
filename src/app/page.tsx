import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getHomeContent, getSiteConfig } from "@/lib/content";

export default async function Home() {
  const content = await getHomeContent();
  const config = await getSiteConfig();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6">
        <AnimatedSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {content.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            {content.hero.subtitle}
          </p>
        </AnimatedSection>
      </section>

      {/* Demo Reel Section */}
      <section className="py-20 px-6 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-12 text-center"
          >
            Demo Reel
          </AnimatedSection>
          <AnimatedSection
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
          >
            <iframe
              src={`https://www.youtube.com/embed/${content.demoReel.youtubeId}`}
              title="Demo Reel"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300 leading-relaxed"
          >
            {content.intro.text}
          </AnimatedSection>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 bg-neutral-900/50">
        <AnimatedSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Interested in collaborating?
          </h2>
          <a
            href={`mailto:${config.email}`}
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Get in Touch
          </a>
        </AnimatedSection>
      </section>
    </div>
  );
}

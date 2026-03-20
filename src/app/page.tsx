import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getHomeContent, getSiteConfig } from "@/lib/content";
import Image from "next/image";

export default async function Home() {
  const content = await getHomeContent();
  const config = await getSiteConfig();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative isolate min-h-[100svh] flex items-center justify-center px-6 overflow-hidden bg-black">
        <Image
          src="/main-bg.avif"
          alt="Cinematic portrait background"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/45" />
        <AnimatedSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-5">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200/90">
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

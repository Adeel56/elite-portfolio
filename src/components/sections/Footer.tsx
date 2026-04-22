"use client";

import { m } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Profile } from "@/lib/content";

export function Footer({ profile }: { profile?: Profile | null }) {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center z-10 px-6 py-32 border-t border-muted/10 bg-[#050505]/80 backdrop-blur-md">
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-col items-center text-center max-w-4xl"
      >
        <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 text-foreground leading-none">
          Let's Build<br />
          <span className="text-muted">The Future.</span>
        </h2>
        
        {profile?.rawMarkdown ? (
          <div className="text-muted font-mono mb-8 max-w-2xl text-sm md:text-base leading-relaxed prose prose-invert prose-p:text-muted" dangerouslySetInnerHTML={{ __html: profile.contentHtml }} />
        ) : (
          <p className="text-muted font-mono mb-16 max-w-lg text-sm md:text-base leading-relaxed">
            <span className="text-accent">[ STATUS: ACCEPTING NEW ALLIANCES ]</span><br /><br />
            If you are building something that challenges the status quo, we should talk.
          </p>
        )}
        
        <a href={`mailto:${profile?.email || 'hello@example.com'}`} className="mt-8 z-50 inline-block">
          <MagneticButton className="px-8 py-4 text-base font-bold">
            Initiate Contact
          </MagneticButton>
        </a>
      </m.div>
      
      <div className="absolute bottom-8 flex justify-between w-full px-6 md:px-12 font-mono text-[10px] md:text-xs text-muted/50 uppercase tracking-widest z-50">
        <span>© {new Date().getFullYear()} Elite Architecture</span>
        <div className="flex gap-4">
          {profile?.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>}
          {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">LinkedIn</a>}
        </div>
      </div>
    </section>
  );
}

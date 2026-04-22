"use client";

import { m } from "framer-motion";
import { Skill } from "@/lib/content";

export function ScanSection({ skills }: { skills?: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 px-6 md:px-24 py-32 bg-background/50 backdrop-blur-sm">
      <div className="w-full max-w-7xl">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-2xl font-mono text-accent mb-16 uppercase tracking-widest"
        >
          // Capabilities Scan
        </m.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, i) => (
            <m.div
              key={skill.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
              className="p-6 border border-muted/20 bg-muted/5 hover:bg-accent/10 hover:border-accent/50 hover:text-accent transition-colors duration-300 font-mono text-sm flex flex-col items-center justify-center text-center group cursor-default h-32 relative overflow-hidden"
            >
              <span className="font-bold group-hover:-translate-y-4 transition-transform duration-300">{skill.name}</span>
              {skill.category && <span className="text-[10px] text-muted/50 uppercase tracking-widest mt-2 group-hover:-translate-y-4 transition-transform duration-300">{skill.category}</span>}
              {skill.description && <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 px-2 text-[#F2F2F2]">{skill.description}</span>}
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

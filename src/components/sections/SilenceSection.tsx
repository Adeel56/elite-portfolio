"use client";

import { m } from "framer-motion";

export function SilenceSection() {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center z-10 pointer-events-none">
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: false, margin: "-40%" }}
        transition={{ duration: 2 }}
        className="text-center"
      >
        <span className="font-mono text-xs md:text-sm tracking-[0.5em] text-muted">
          COGNITIVE REST PROTOCOL ENGAGED
        </span>
      </m.div>
    </section>
  );
}

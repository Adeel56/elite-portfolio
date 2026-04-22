"use client";

import { m } from "framer-motion";
import { useArbitration } from "@/providers/GlobalArbitrationProvider";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/content";

export function EvidenceSection({ projects }: { projects: Project[] }) {
  const { setIntent, clearIntent } = useArbitration();
  const router = useRouter();

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 px-6 md:px-24 py-32 bg-background/40 backdrop-blur-sm">
      <div className="w-full max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex justify-between items-end border-b border-muted/20 pb-8 mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Selected<br />Evidence.
          </h2>
          <span className="font-mono text-muted text-sm hidden md:block uppercase">
            [{projects.length.toString().padStart(2, '0')} ARCHIVES FOUND]
          </span>
        </m.div>

        <div className="flex flex-col w-full">
          {projects.map((project, i) => (
            <m.div
              key={project.metadata.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
              className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-12 border-b border-muted/10 cursor-pointer"
              onMouseEnter={() => setIntent("hover", `proj-${project.metadata.id}`)}
              onMouseLeave={() => clearIntent(`proj-${project.metadata.id}`)}
              onClick={() => {
                setIntent("navigation", `proj-${project.metadata.id}`);
                router.push(`/projects/${project.slug}`);
                setTimeout(() => clearIntent(`proj-${project.metadata.id}`), 500);
              }}
            >
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-accent/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out z-[-1]" />
              
              <div className="flex items-center gap-8 mb-4 md:mb-0">
                <span className="font-mono text-muted text-sm group-hover:text-accent transition-colors">
                  {project.metadata.id}
                </span>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                  {project.metadata.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-8 font-mono text-sm text-muted">
                <span className="uppercase tracking-widest">{project.metadata.tag}</span>
                <span>{project.metadata.year}</span>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

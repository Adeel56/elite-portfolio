import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getAllSkills } from "@/lib/content";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const allSkills = await getAllSkills();

  if (!project) return notFound();

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 px-6 md:px-24 z-10 bg-background/50 backdrop-blur-md">
      <div className="w-full max-w-5xl">
        <Link href="/" className="font-mono text-muted hover:text-accent transition-colors text-sm uppercase tracking-widest mb-12 inline-block">
          {"< Return to Matrix"}
        </Link>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-foreground">
          {project.metadata.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-muted/20 pt-12">
          <div className="col-span-2">
            <p className="text-xl md:text-3xl text-muted leading-relaxed font-mono mb-8">
              {project.metadata.description}
            </p>
            <div 
              className="prose prose-invert prose-lg text-muted/90 prose-headings:text-foreground prose-a:text-accent max-w-none font-mono"
              dangerouslySetInnerHTML={{ __html: project.contentHtml }}
            />
          </div>
          <div className="col-span-1 flex flex-col gap-8 font-mono text-sm">
            <div>
              <span className="text-muted block mb-2 tracking-widest uppercase">Role</span>
              <span className="text-foreground">{project.metadata.role}</span>
            </div>
            <div>
              <span className="text-muted block mb-2 tracking-widest uppercase">Core Stack</span>
              <span className="text-accent uppercase tracking-widest">{project.metadata.tag}</span>
            </div>
            <div>
              <span className="text-muted block mb-2 tracking-widest uppercase">Deployed</span>
              <span className="text-foreground">{project.metadata.year}</span>
            </div>

            {project.metadata.skills && project.metadata.skills.length > 0 && (
              <div className="col-span-2">
                <span className="text-muted block mb-2 tracking-widest uppercase">Associated Skills</span>
                <div className="flex flex-wrap gap-2">
                  {project.metadata.skills.map(slug => {
                    const skill = allSkills.find(s => s.slug === slug);
                    return (
                      <span key={slug} className="border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#CCFF00] font-mono uppercase tracking-wider">
                        {skill ? skill.name : slug}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {(project.metadata.repoLink || project.metadata.liveLink) && (
              <div className="flex flex-col gap-4 mt-4 border-t border-muted/20 pt-8">
                {project.metadata.liveLink && (
                  <a href={project.metadata.liveLink} target="_blank" rel="noreferrer" className="w-full text-center px-6 py-3 bg-accent text-black font-bold tracking-widest uppercase hover:bg-white transition-colors">
                    View Live Protocol
                  </a>
                )}
                {project.metadata.repoLink && (
                  <a href={project.metadata.repoLink} target="_blank" rel="noreferrer" className="w-full text-center px-6 py-3 border border-muted/50 text-muted font-bold tracking-widest uppercase hover:border-accent hover:text-accent transition-colors">
                    Access Source Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Visual Mount Point */}
        <div className="mt-24 w-full h-[60vh] bg-[#0A0A0C] border border-muted/20 flex flex-col items-center justify-center group overflow-hidden relative">
          {project.metadata.imageUrl ? (
            <img src={project.metadata.imageUrl} alt={project.metadata.title} className="w-full h-full object-cover filter brightness-90 hover:brightness-110 transition-all duration-700" />
          ) : (
            <>
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="font-mono text-muted group-hover:text-accent transition-colors z-10">
                [ SECURE ASSET MOUNT POINT ]
              </span>
              <span className="font-mono text-xs text-muted/50 mt-4 z-10">
                NO MEDIA UPLOADED
              </span>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

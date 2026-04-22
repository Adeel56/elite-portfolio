import { Hero } from "@/components/sections/Hero";
import { EvidenceSection } from "@/components/sections/EvidenceSection";
import { SilenceSection } from "@/components/sections/SilenceSection";
import { ScanSection } from "@/components/sections/ScanSection";
import { Footer } from "@/components/sections/Footer";
import { getAllProjects, getAllSkills, getProfile } from "@/lib/content";

export default async function Home() {
  const projects = await getAllProjects();
  const skills = await getAllSkills();
  const profile = await getProfile();

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden selection:bg-accent selection:text-black">
      <Hero profile={profile} />
      <EvidenceSection projects={projects} />
      <SilenceSection />
      <ScanSection skills={skills} />
      <Footer profile={profile} />
    </main>
  );
}

import { getAllProjects, getAllSkills, getProfile } from "@/lib/content";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  const projects = await getAllProjects();
  const skills = await getAllSkills();
  const profile = await getProfile();
  
  return <AdminDashboard initialProjects={projects} initialSkills={skills} initialProfile={profile} />;
}

"use client";

import { useState } from "react";
import { saveProject, saveSkill, saveProfile, uploadImage, deleteProject, deleteSkill } from "./actions";
import { Project, Skill, Profile } from "@/lib/content";

export function AdminDashboard({ 
  initialProjects, 
  initialSkills, 
  initialProfile 
}: { 
  initialProjects: Project[], 
  initialSkills: Skill[], 
  initialProfile: Profile | null 
}) {
  const [tab, setTab] = useState<"projects" | "skills" | "profile">("projects");
  const [saving, setSaving] = useState(false);

  // States
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  
  const [formData, setFormData] = useState<any>({});
  const [content, setContent] = useState("");

  // Selectors
  const selectProject = (p: Project) => {
    setActiveProject(p);
    setFormData(p.metadata);
    setContent(p.rawMarkdown);
  };

  const selectSkill = (s: Skill) => {
    setActiveSkill(s);
    setFormData({ name: s.name, category: s.category, description: s.description });
    setContent(s.rawMarkdown);
  };

  const loadProfile = () => {
    setFormData(initialProfile || {});
    setContent(initialProfile?.rawMarkdown || "");
  };

  const createNewProject = () => {
    const newSlug = `project-${Date.now()}`;
    const newProject: Project = { slug: newSlug, metadata: { id: "99", title: "New Project", tag: "", year: "2026", role: "", description: "" }, contentHtml: "", rawMarkdown: "" };
    setActiveProject(newProject);
    setFormData(newProject.metadata);
    setContent("");
  };

  const createNewSkill = () => {
    const newSlug = `skill-${Date.now()}`;
    const newSkill: Skill = { slug: newSlug, name: "New Skill", category: "Frontend", description: "", contentHtml: "", rawMarkdown: "" };
    setActiveSkill(newSkill);
    setFormData({ name: "New Skill", category: "Frontend", description: "" });
    setContent("");
  };

  const switchTab = (t: any) => {
    setTab(t);
    setFormData({});
    setContent("");
    setActiveProject(null);
    setActiveSkill(null);
    if (t === "profile") loadProfile();
  };

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);
    
    const targetName = tab === 'profile' ? 'profile' : (activeProject ? activeProject.slug : 'temp');
    form.append("targetName", targetName);

    if (formData.removeBg) {
      form.append("removeBg", "true");
    }
    try {
      const res = await uploadImage(form);
      setFormData({ ...formData, [fieldName]: res.url });
    } catch (err) {
      alert("Upload failed.");
    }
  };

  // Save Handlers
  const handleSave = async () => {
    setSaving(true);
    if (tab === "projects" && activeProject) {
      await saveProject(activeProject.slug, formData, content);
    } else if (tab === "skills" && activeSkill) {
      await saveSkill(activeSkill.slug, formData, content);
    } else if (tab === "profile") {
      await saveProfile(formData, content);
    }
    setSaving(false);
    alert("Saved successfully! Refresh main site to see changes.");
  };

  const handleDelete = async () => {
    if (tab === "projects" && activeProject) {
      if (confirm(`Are you sure you want to delete ${activeProject.metadata.title}?`)) {
        await deleteProject(activeProject.slug);
        window.location.reload();
      }
    } else if (tab === "skills" && activeSkill) {
      if (confirm(`Are you sure you want to delete ${activeSkill.name}?`)) {
        await deleteSkill(activeSkill.slug);
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0C] text-[#F2F2F2] font-mono z-50 relative">
      {/* Top Navbar */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-[#CCFF00] mr-8">Elite Admin</h1>
        <button onClick={() => switchTab("projects")} className={`px-4 py-2 ${tab === "projects" ? "bg-white/10 text-[#CCFF00]" : "text-white/50"}`}>Projects</button>
        <button onClick={() => switchTab("skills")} className={`px-4 py-2 ${tab === "skills" ? "bg-white/10 text-[#CCFF00]" : "text-white/50"}`}>Skills</button>
        <button onClick={() => switchTab("profile")} className={`px-4 py-2 ${tab === "profile" ? "bg-white/10 text-[#CCFF00]" : "text-white/50"}`}>Profile & Contact</button>
        <div className="ml-auto flex gap-4 items-center">
          <a href="/" className="text-white/40 hover:text-white text-sm mr-4">{"<- Back to Site"}</a>
          
          {((tab === "projects" && activeProject) || (tab === "skills" && activeSkill)) && (
             <button onClick={handleDelete} className="border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 font-bold transition-colors text-sm">
                Delete {tab === "projects" ? "Project" : "Skill"}
             </button>
          )}

          <button 
            onClick={handleSave} 
            className="bg-[#CCFF00] text-black px-6 py-2 font-bold hover:bg-white transition-colors disabled:opacity-50"
            disabled={saving || (!activeProject && !activeSkill && tab !== "profile")}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Projects/Skills */}
        {tab !== "profile" && (
          <div className="w-64 border-r border-white/10 p-4 flex flex-col gap-2 overflow-y-auto">
            {tab === "projects" && (
              <>
                {initialProjects.map(p => (
                  <button key={p.slug} onClick={() => selectProject(p)} className={`text-left p-3 hover:bg-white/5 border border-transparent ${activeProject?.slug === p.slug ? 'bg-white/10 border-white/20 text-[#CCFF00]' : ''}`}>
                    {p.metadata.id}. {p.metadata.title}
                  </button>
                ))}
                <button onClick={createNewProject} className="mt-4 border border-dashed border-white/20 p-3 text-center text-white/50 hover:text-white hover:border-white/50 transition-colors">+ New Project</button>
              </>
            )}
            {tab === "skills" && (
              <>
                {initialSkills.map(s => (
                  <button key={s.slug} onClick={() => selectSkill(s)} className={`text-left p-3 hover:bg-white/5 border border-transparent ${activeSkill?.slug === s.slug ? 'bg-white/10 border-white/20 text-[#CCFF00]' : ''}`}>
                    {s.name}
                  </button>
                ))}
                <button onClick={createNewSkill} className="mt-4 border border-dashed border-white/20 p-3 text-center text-white/50 hover:text-white hover:border-white/50 transition-colors">+ New Skill</button>
              </>
            )}
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {tab === "projects" && !activeProject && <div className="text-white/50 text-center mt-20">Select a project to edit</div>}
          {tab === "skills" && !activeSkill && <div className="text-white/50 text-center mt-20">Select a skill to edit</div>}

          {((tab === "projects" && activeProject) || (tab === "skills" && activeSkill) || tab === "profile") && (
            <div className="max-w-4xl flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-6">
                {/* PROJECT FIELDS */}
                {tab === "projects" && (
                  <>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">ID</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.id || ""} onChange={e => setFormData({...formData, id: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Title</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Tag</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.tag || ""} onChange={e => setFormData({...formData, tag: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Year</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.year || ""} onChange={e => setFormData({...formData, year: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Role</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.role || ""} onChange={e => setFormData({...formData, role: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Repo Link</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.repoLink || ""} onChange={e => setFormData({...formData, repoLink: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Live URL</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.liveLink || ""} onChange={e => setFormData({...formData, liveLink: e.target.value})} /></label>
                    
                    {/* Skills Relation Checkboxes */}
                    <div className="col-span-2 bg-white/5 p-4 border border-white/10">
                      <span className="text-xs uppercase text-white/50 mb-2 block">Associated Skills</span>
                      {initialSkills.length === 0 ? (
                        <span className="text-white/30 text-sm italic">No skills available. Please create a skill in the Skills tab first.</span>
                      ) : (
                        <div className="flex gap-4 flex-wrap">
                          {initialSkills.map(s => {
                            const isSelected = formData.skills?.includes(s.slug);
                            return (
                              <label key={s.slug} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={!!isSelected} onChange={e => {
                                  const current = formData.skills || [];
                                  setFormData({...formData, skills: e.target.checked ? [...current, s.slug] : current.filter((x: string) => x !== s.slug)});
                                }}/>
                                {s.name}
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* SKILL FIELDS */}
                {tab === "skills" && (
                  <>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Name</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Category</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} /></label>
                    <label className="flex flex-col gap-2 col-span-2"><span className="text-xs uppercase text-white/50">Short Description</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} /></label>
                  </>
                )}

                {/* PROFILE FIELDS */}
                {tab === "profile" && (
                  <>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Name</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Role</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.role || ""} onChange={e => setFormData({...formData, role: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">Email</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">GitHub</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.github || ""} onChange={e => setFormData({...formData, github: e.target.value})} /></label>
                    <label className="flex flex-col gap-2"><span className="text-xs uppercase text-white/50">LinkedIn</span><input className="bg-white/5 p-3 border border-white/10 focus:border-[#CCFF00]" value={formData.linkedin || ""} onChange={e => setFormData({...formData, linkedin: e.target.value})} /></label>
                  </>
                )}

                {/* Image Upload Area with Preview */}
                {(tab === "projects" || tab === "profile") && (
                  <div className="col-span-2 flex flex-col gap-4 bg-white/5 p-6 border border-white/10">
                    <span className="text-xs uppercase text-white/50 block tracking-widest font-bold">Media Management</span>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start mt-2">
                      {/* Left: Preview Square */}
                      <div className="w-48 h-48 shrink-0 border-2 border-dashed border-white/20 flex items-center justify-center bg-black/50 overflow-hidden relative group">
                        {(formData.imageUrl || formData.photoUrl) ? (
                          <img 
                            src={formData.imageUrl || formData.photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-white/30 text-xs font-mono uppercase tracking-widest text-center px-4">No Media<br/>Uploaded</span>
                        )}
                      </div>

                      {/* Right: Controls */}
                      <div className="flex flex-col gap-4 flex-1 w-full">
                        {tab === "profile" && (
                          <label className="flex items-center gap-3 cursor-pointer p-4 border border-white/10 bg-black/40 hover:bg-white/5 transition-colors">
                            <input type="checkbox" checked={!!formData.removeBg} onChange={e => setFormData({...formData, removeBg: e.target.checked})} className="w-5 h-5 accent-[#CCFF00]" />
                            <div className="flex flex-col">
                              <span className="text-sm font-mono text-white/90">AI Background Removal</span>
                              <span className="text-xs font-mono text-white/40 mt-1">Check this BEFORE selecting a file to automatically cut out the subject.</span>
                            </div>
                          </label>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2">
                          <label className="cursor-pointer bg-[#CCFF00] text-black px-6 py-3 font-bold hover:bg-white transition-colors text-sm tracking-wide">
                            Select & Upload File
                            <input type="file" onChange={(e) => handleImageUpload(e, tab === 'profile' ? 'photoUrl' : 'imageUrl')} className="hidden" />
                          </label>
                          
                          {(formData.imageUrl || formData.photoUrl) && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                if (tab === 'profile') {
                                  setFormData({ ...formData, photoUrl: '' });
                                } else {
                                  setFormData({ ...formData, imageUrl: '' });
                                }
                              }}
                              className="text-sm text-red-500 hover:text-red-400 border border-red-500/50 px-6 py-3 bg-red-500/10 font-bold tracking-wide"
                            >
                              Remove Media
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-white/30 mt-4 font-mono leading-relaxed max-w-md">
                          * Best results for AI removal: High contrast between subject and background.<br/>
                          * Image preview scales to fit the container without cropping.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shared Markdown Editor */}
              {tab !== "skills" && (
                <label className="flex flex-col gap-2 mt-4">
                  <span className="text-xs tracking-widest text-white/50 uppercase">Markdown Content</span>
                  <textarea 
                    className="bg-white/5 p-4 border border-white/10 focus:border-[#CCFF00] outline-none h-[400px] font-mono text-sm leading-relaxed" 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                  />
                </label>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

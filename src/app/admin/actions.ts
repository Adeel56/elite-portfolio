"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

const contentDir = path.join(process.cwd(), "src/content");
const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure directories exist
['projects', 'skills', 'profile'].forEach(dir => {
  const p = path.join(contentDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function saveProject(slug: string, data: any, content: string) {
  if (process.env.NODE_ENV === "production") throw new Error("Cannot save files in production environment");
  const fullPath = path.join(contentDir, "projects", `${slug}.md`);
  const fileContent = matter.stringify(content, data);
  fs.writeFileSync(fullPath, fileContent, "utf8");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function saveSkill(slug: string, data: any, content: string) {
  if (process.env.NODE_ENV === "production") throw new Error("Cannot save files in production environment");
  const fullPath = path.join(contentDir, "skills", `${slug}.md`);
  const fileContent = matter.stringify(content, data);
  fs.writeFileSync(fullPath, fileContent, "utf8");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function saveProfile(data: any, content: string) {
  if (process.env.NODE_ENV === "production") throw new Error("Cannot save files in production environment");
  const fullPath = path.join(contentDir, "profile", `about.md`);
  const fileContent = matter.stringify(content, data);
  fs.writeFileSync(fullPath, fileContent, "utf8");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteProject(slug: string) {
  if (process.env.NODE_ENV === "production") throw new Error("Cannot delete in production environment");
  const fullPath = path.join(contentDir, "projects", `${slug}.md`);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteSkill(slug: string) {
  if (process.env.NODE_ENV === "production") throw new Error("Cannot delete in production environment");
  const fullPath = path.join(contentDir, "skills", `${slug}.md`);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  if (process.env.NODE_ENV === "production") throw new Error("Cannot upload in production");
  const file = formData.get("file") as File;
  const shouldRemoveBg = formData.get("removeBg") === "true";
  const targetName = (formData.get("targetName") as string) || "upload";
  
  if (!file) throw new Error("No file uploaded");

  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);

  const baseName = targetName.replace(/[^a-zA-Z0-9.-]/g, "_");
  let finalExtension = file.name.substring(file.name.lastIndexOf("."));
  let filename = `${baseName}${finalExtension}`;
  
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Prevent clutter by deleting any previous uploads for this specific target
  const existingFiles = fs.readdirSync(uploadDir);
  existingFiles.forEach(f => {
    if (f.startsWith(baseName + ".")) {
      try { fs.unlinkSync(path.join(uploadDir, f)); } catch(e) {}
    }
  });

  const fullPath = path.join(uploadDir, filename);
  fs.writeFileSync(fullPath, buffer);

  if (shouldRemoveBg) {
    const { execSync } = require('child_process');
    const bgScript = path.join(process.cwd(), "remove-bg.js");
    const outPath = path.join(uploadDir, `${baseName}.png`);
    
    try {
      execSync(`node "${bgScript}" "${fullPath}" "${outPath}"`);
      // If successful, and if original wasn't png, delete original
      if (fullPath !== outPath) {
        fs.unlinkSync(fullPath);
      }
      filename = `${baseName}.png`;
    } catch (e) {
      console.error("Background removal failed via script:", e);
      // Fallback to original image
    }
  }

  return { success: true, url: `/uploads/${filename}?v=${Date.now()}` };
}

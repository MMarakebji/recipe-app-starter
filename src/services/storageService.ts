import { supabase } from "../lib/supabaseClient";

const BUCKET_NAME = "recipe-images";

export async function uploadRecipeImage(file: File, userId: string) {
  const cleanName = file.name.replace(/\s+/g, "-");
  const filePath = `${userId}/${Date.now()}-${cleanName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return filePath;
}

export function getRecipeImageUrl(path: string | null | undefined) {
  if (!path) return "";
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteRecipeImage(path: string | null | undefined) {
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw error;
  }
}
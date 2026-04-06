import { supabase } from "../lib/supabaseClient";
import type { NewRecipe, Recipe } from "../types/recipe";
import { deleteRecipeImage, uploadRecipeImage } from "./storageService";

export async function createRecipe(recipe: NewRecipe, imageFile?: File | null) {
  let imagePath: string | null = recipe.image_path ?? null;

  if (imageFile) {
    imagePath = await uploadRecipeImage(imageFile, recipe.user_id);
  }

  return await supabase.from("recipes").insert([
    {
      ...recipe,
      image_path: imagePath,
    },
  ]);
}

export async function getAllRecipes() {
  return await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function updateRecipe(
  recipeId: number,
  updatedRecipe: Partial<NewRecipe>,
  newImageFile?: File | null,
  oldImagePath?: string | null
) {
  let nextImagePath = updatedRecipe.image_path ?? oldImagePath ?? null;

  if (newImageFile && updatedRecipe.user_id) {
    const uploadedPath = await uploadRecipeImage(newImageFile, updatedRecipe.user_id);

    if (oldImagePath) {
      await deleteRecipeImage(oldImagePath);
    }

    nextImagePath = uploadedPath;
  }

  return await supabase
    .from("recipes")
    .update({
      ...updatedRecipe,
      image_path: nextImagePath,
    })
    .eq("id", recipeId);
}

export async function deleteRecipe(recipe: Recipe) {
  if (recipe.image_path) {
    await deleteRecipeImage(recipe.image_path);
  }

  return await supabase.from("recipes").delete().eq("id", recipe.id);
}
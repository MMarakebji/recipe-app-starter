import { useEffect, useState } from "react";
import type { NewRecipe, Recipe } from "../types/recipe";
import {
  createRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
} from "../services/recipeService";

// Custom hook for loading and managing all recipes
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadRecipes() {
    setLoading(true);
    setError("");

    const { data, error } = await getAllRecipes();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRecipes((data as Recipe[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadRecipes();
  }, []);

  async function addRecipe(recipe: NewRecipe, imageFile?: File | null) {
    clearMessages();

    const { error } = await createRecipe(recipe, imageFile);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe added successfully.");
    await loadRecipes();
    return true;
  }

  async function editRecipe(
    recipeId: number,
    updatedData: Partial<NewRecipe>,
    imageFile?: File | null,
    oldImagePath?: string | null
  ) {
    clearMessages();

    const { error } = await updateRecipe(
      recipeId,
      updatedData,
      imageFile,
      oldImagePath
    );

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe updated successfully.");
    await loadRecipes();
    return true;
  }

  async function removeRecipe(recipe: Recipe) {
    clearMessages();

    const { error } = await deleteRecipe(recipe);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe deleted successfully.");
    await loadRecipes();
    return true;
  }

  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  return {
    recipes,
    loading,
    error,
    successMessage,
    addRecipe,
    editRecipe,
    removeRecipe,
    refreshRecipes: loadRecipes,
    clearMessages,
  };
}
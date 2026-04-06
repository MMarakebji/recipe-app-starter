import { useState } from "react";
import type { AppUser } from "../types/auth";
import type { Recipe } from "../types/recipe";
import { useCategories } from "../hooks/useCategories";
import { useRecipes } from "../hooks/useRecipes";
import { useFavorites } from "../hooks/useFavorites";

import Header from "../components/Header";
import FilterPanel from "../components/FilterPanel";
import RecipeForm from "../components/RecipeForm";
import MainContent from "../components/MainContent";
import Summary from "../components/Summary";

type DashboardPageProps = {
  user: AppUser | null;
  onSignOut: () => Promise<boolean>;
  onSignInClick: () => void;
};

export default function DashboardPage({
  user,
  onSignOut,
  onSignInClick,
}: DashboardPageProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useCategories();

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    successMessage,
    addRecipe,
    editRecipe,
    removeRecipe,
  } = useRecipes();

  const { favorites, addFavorite, removeFavorite } = useFavorites(user?.id || null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleToggleFavorite = async (recipeId: number, isFavorite: boolean) => {
    if (!user) return;

    if (isFavorite) {
      await removeFavorite(recipeId);
    } else {
      await addFavorite(recipeId);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (recipe: Recipe) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      const ok = await removeRecipe(recipe);
      if (ok && editingRecipe?.id === recipe.id) {
        setEditingRecipe(null);
      }
    }
  };

  const totalCategoryRecipes =
    selectedCategoryId === "All"
      ? recipes.length
      : recipes.filter((r) => r.category_id.toString() === selectedCategoryId).length;

  return (
    <div className="container">
      <Header user={user} onSignOut={onSignOut} onSignInClick={onSignInClick} />

      {categoriesError && <p className="error-msg">Categories error: {categoriesError}</p>}

      <Summary
        totalSystemRecipes={recipes.length}
        totalCategoryRecipes={totalCategoryRecipes}
        favoriteCount={favorites.length}
        isLoggedIn={!!user}
      />

      {!categoriesLoading && !categoriesError && (
        <>
          <FilterPanel
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
          />

          {user && (
            <RecipeForm
  categories={categories}
  userId={user.id}
  editingRecipe={editingRecipe}
  onAddRecipe={addRecipe}
  onEditRecipe={editRecipe}
  onCancelEdit={() => setEditingRecipe(null)}
  error={recipesError}
  successMessage={successMessage}
/>
          )}

          <MainContent
            recipes={recipes}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            currentUser={user}
            favorites={favorites}
            loading={recipesLoading}
            error={recipesError}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />
        </>
      )}
    </div>
  );
}
import type { Category } from "../types/category";
import type { Recipe } from "../types/recipe";
import type { AppUser } from "../types/auth";
import type { Favorite } from "../types/favorite";
import RecipeList from "./RecipeList";

type MainContentProps = {
  recipes: Recipe[];
  categories: Category[];
  selectedCategoryId: string;
  currentUser: AppUser | null;
  favorites: Favorite[];
  loading: boolean;
  error: string;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number, isFavorite: boolean) => void;
};

export default function MainContent({
  recipes,
  categories,
  selectedCategoryId,
  currentUser,
  favorites,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleFavorite,
}: MainContentProps) {
  const filteredRecipes =
    selectedCategoryId === "All"
      ? recipes
      : recipes.filter((r) => r.category_id.toString() === selectedCategoryId);

  return (
    <div>
      <RecipeList
        recipes={filteredRecipes}
        categories={categories}
        currentUser={currentUser}
        favorites={favorites}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
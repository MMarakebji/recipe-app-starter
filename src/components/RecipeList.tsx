import type { Category } from "../types/category";
import type { Recipe } from "../types/recipe";
import type { AppUser } from "../types/auth";
import type { Favorite } from "../types/favorite";
import RecipeCard from "./RecipeCard";

type RecipeListProps = {
  recipes: Recipe[];
  categories: Category[];
  currentUser: AppUser | null;
  favorites: Favorite[];
  loading: boolean;
  error: string;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number, isFavorite: boolean) => void;
};

export default function RecipeList({
  recipes,
  categories,
  currentUser,
  favorites,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleFavorite,
}: RecipeListProps) {
  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.id, c.name])
  ) as Record<number, string>;

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (recipes.length === 0) return <p>No recipes match the selected filter.</p>;

  const favoriteRecipeIds = new Set(favorites.map((f) => f.recipe_id));

  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          categoryName={categoryMap[recipe.category_id] ?? "Unknown"}
          isOwner={currentUser?.id === recipe.user_id}
          isLoggedIn={!!currentUser}
          isFavorite={favoriteRecipeIds.has(recipe.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
import type { Recipe } from "../types/recipe";
import { getRecipeImageUrl } from "../services/storageService";

type RecipeCardProps = {
  recipe: Recipe;
  categoryName: string;
  isOwner: boolean;
  isLoggedIn: boolean;
  isFavorite: boolean;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number, isFavorite: boolean) => void;
};

export default function RecipeCard({
  recipe,
  categoryName,
  isOwner,
  isLoggedIn,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}: RecipeCardProps) {
  const imageUrl = recipe.image_path
    ? getRecipeImageUrl(recipe.image_path)
    : "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="recipe-card">
      <div className="recipe-card-image-wrapper">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="recipe-card-image"
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "1rem",
          }}
        />
      </div>

      <div className="recipe-card-badge">{categoryName}</div>
      <h3 className="recipe-card-title">{recipe.title}</h3>

      <div className="recipe-card-meta">
        <span>By: {recipe.user_id}</span>
        <span>•</span>
        <span>{recipe.prep_time} mins prep</span>
      </div>

      <div className="recipe-card-desc">
        <p>{recipe.description}</p>
      </div>

      <div className="recipe-card-actions">
        {isOwner && (
          <>
            <button className="btn-outline" onClick={() => onEdit(recipe)}>
              Edit Recipe
            </button>
            <button className="btn-danger" onClick={() => onDelete(recipe)}>
              Delete
            </button>
          </>
        )}

        {isLoggedIn ? (
          <button
            className={isFavorite ? "btn-favorite" : "btn-outline"}
            onClick={() => onToggleFavorite(recipe.id, isFavorite)}
          >
            {isFavorite ? "★ Favorited" : "☆ Add Favorite"}
          </button>
        ) : (
          <span
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            Login required for favorite actions
          </span>
        )}
      </div>
    </div>
  );
}
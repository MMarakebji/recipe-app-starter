import { useEffect, useState } from "react";
import type { Category } from "../types/category";
import type { NewRecipe, Recipe, RecipeFormData } from "../types/recipe";

type RecipeFormProps = {
  categories: Category[];
  userId: string;
  editingRecipe: Recipe | null;
  onAddRecipe: (recipe: NewRecipe, imageFile?: File | null) => Promise<boolean>;
  onEditRecipe: (
    recipeId: number,
    recipe: Partial<NewRecipe>,
    imageFile?: File | null,
    oldImagePath?: string | null
  ) => Promise<boolean>;
  onCancelEdit: () => void;
  error: string;
  successMessage: string;
};

const initialForm: RecipeFormData = {
  title: "",
  description: "",
  prep_time: 0,
  category_id: "",
};

export default function RecipeForm({
  categories,
  userId,
  editingRecipe,
  onAddRecipe,
  onEditRecipe,
  onCancelEdit,
  error,
  successMessage,
}: RecipeFormProps) {
  const [form, setForm] = useState<RecipeFormData>(initialForm);
  const [localError, setLocalError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingRecipe) {
      setForm({
        title: editingRecipe.title,
        description: editingRecipe.description,
        prep_time: editingRecipe.prep_time,
        category_id: editingRecipe.category_id.toString(),
      });
      setImageFile(null);
      setLocalError("");
    } else {
      setForm(initialForm);
      setImageFile(null);
    }
  }, [editingRecipe]);

  function updateField<K extends keyof RecipeFormData>(key: K, value: RecipeFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  }

  function validate() {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.prep_time ||
      !String(form.category_id).trim()
    ) {
      setLocalError("All fields are required.");
      return false;
    }

    if (Number(form.prep_time) <= 0) {
      setLocalError("Prep time must be greater than zero.");
      return false;
    }

    setLocalError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (editingRecipe) {
      const ok = await onEditRecipe(
        editingRecipe.id,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          prep_time: Number(form.prep_time),
          category_id: Number(form.category_id),
          user_id: editingRecipe.user_id,
        },
        imageFile,
        editingRecipe.image_path ?? null
      );

      if (ok) {
        setImageFile(null);
        onCancelEdit();
      }
    } else {
      const recipe: NewRecipe = {
        title: form.title.trim(),
        description: form.description.trim(),
        prep_time: Number(form.prep_time),
        category_id: Number(form.category_id),
        user_id: userId,
      };

      const ok = await onAddRecipe(recipe, imageFile);

      if (ok) {
        setForm(initialForm);
        setImageFile(null);
      }
    }
  }

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "1.5rem" }}>
          {editingRecipe ? "Edit Recipe" : "Share a New Recipe"}
        </h2>

        <div className="form-group">
          <label>Recipe Title</label>
          <input
            type="text"
            placeholder="e.g. Grandma's Apple Pie"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description & Instructions</label>
          <textarea
            placeholder="Share the steps and magic behind this recipe..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Prep Time (minutes)</label>
            <input
              type="number"
              min="1"
              value={form.prep_time}
              onChange={(e) => updateField("prep_time", Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ flex: 2 }}>
            <label>Category</label>
            <select
              value={form.category_id}
              onChange={(e) => updateField("category_id", e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>{editingRecipe ? "Replace Recipe Image" : "Recipe Image (optional)"}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {editingRecipe?.image_path && !imageFile && (
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Current image exists. Choose a new file only if you want to replace it.
          </p>
        )}

        {imageFile && (
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Selected file: {imageFile.name}
          </p>
        )}

        {localError && <p className="error-msg">{localError}</p>}
        {error && <p className="error-msg">{error}</p>}
        {successMessage && <p className="success-msg">{successMessage}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button type="submit">{editingRecipe ? "Save Changes" : "Post Recipe"}</button>
          {editingRecipe && (
            <button type="button" className="btn-outline" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
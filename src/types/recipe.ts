export type Recipe = {
  id: number;
  title: string;
  description: string;
  prep_time: number;
  category_id: number;
  user_id: string;
  image_path?: string | null;
  created_at?: string;
};

export type NewRecipe = {
  title: string;
  description: string;
  prep_time: number;
  category_id: number;
  user_id: string;
  image_path?: string | null;
};

export type RecipeFormData = {
  title: string;
  description: string;
  prep_time: number;
  category_id: string;
};RecipeForm.tsx
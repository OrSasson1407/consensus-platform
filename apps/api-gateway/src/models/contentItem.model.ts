// contentItem.model.ts
export interface ContentItemRecord {
  id: string;
  category_type: "MOVIES" | "RESTAURANTS" | "ACTIVITIES";
  title: string;
  image_url?: string;
  meta_data?: Record<string, unknown>;
  created_at: string;
}
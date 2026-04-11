import type { Models } from "appwrite";

export interface PostDocument extends Models.Document {
  caption: string;
  location: string;
  tags: string;
  imageUrl: string | null;
  imageId: string;
}

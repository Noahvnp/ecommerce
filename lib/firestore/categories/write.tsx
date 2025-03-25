import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

interface CategoryData {
  name: string;
  slug: string;
  image: File;
}

export const createCategory = async ({ name, slug, image }: CategoryData) => {
  try {
    const imageUrl = await uploadImageToCloudinary(image);

    // Lưu dữ liệu vào Firestore
    const docRef = await addDoc(collection(db, "categories"), {
      name,
      slug,
      imageUrl,
      createdAt: new Date(),
    });

    console.log("Category created with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create category." };
  }
};

import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

interface CategoryData {
  name: string;
  slug: string;
  image: File;
}

interface UpdateCategoryData {
  id: string;
  name: string;
  slug: string;
  image?: File;
}

export const createCategory = async ({ name, slug, image }: CategoryData) => {
  try {
    const imageUrl = await uploadImageToCloudinary(image);

    // Lưu dữ liệu vào Firestore
    const newId = doc(collection(db, `ids`)).id;

    await setDoc(doc(db, `categories/${newId}`), {
      id: newId,
      name,
      slug,
      imageUrl,
      timestampCreate: Timestamp.now(),
    });

    return { success: true, id: newId };
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create category." };
  }
};

export const updateCategory = async ({
  id,
  name,
  slug,
  image,
}: UpdateCategoryData) => {
  try {
    let imageUrl;

    // Nếu có ảnh mới, upload lên Cloudinary
    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }

    await updateDoc(doc(db, `categories/${id}`), {
      id,
      name,
      slug,
      ...(imageUrl && { imageUrl }), // Chỉ cập nhật ảnh nếu có ảnh mới
      timestampUpdate: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category.",
    };
  }
};

export const deleteCategory = async ({ id }: { id: string }) => {
  // Xóa dữ liệu khỏi Firestore
  if (!id) throw new Error("Category ID is required.");

  await deleteDoc(doc(db, `categories/${id}`));
};

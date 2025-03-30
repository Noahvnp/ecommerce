import axios from "axios";

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!uploadPreset) {
    throw new Error("Cloudinary upload preset not found.");
  }
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      formData,
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image.");
  }
};

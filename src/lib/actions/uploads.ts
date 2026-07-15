"use server";

import { getCurrentUser } from "@/lib/auth/config";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

async function checkAdminAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated");
  }
  if (user.role !== "Admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Server Action: Validates and uploads a file to Cloudinary.
 */
export async function uploadImageAction(formData: FormData) {
  try {
    // Only authenticated admins can upload images
    await checkAdminAuth();

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file was selected for upload." };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File exceeds the maximum size limit of 5MB." };
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: "Invalid file type. Only JPG, JPEG, PNG, and WEBP formats are accepted." };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await uploadImage(buffer);

    return {
      success: true,
      publicId: result.publicId,
      url: result.secureUrl,
      width: result.width,
      height: result.height,
    };
  } catch (error: any) {
    console.error("Upload action failure:", error);
    if (error.message === "Unauthenticated") {
      return { success: false, error: "Authentication required to upload assets." };
    }
    if (error.message === "Unauthorized") {
      return { success: false, error: "Access denied. Admin role required." };
    }
    return { success: false, error: error.message || "Failed to upload image." };
  }
}

/**
 * Server Action: Deletes a media asset from Cloudinary.
 */
export async function deleteImageAction(publicId: string) {
  try {
    await checkAdminAuth();
    const result = await deleteImage(publicId);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete image." };
  }
}

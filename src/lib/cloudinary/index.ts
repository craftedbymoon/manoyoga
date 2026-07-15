import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = !!(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

/**
 * Uploads an image file buffer to Cloudinary.
 */
export async function uploadImage(
  fileBuffer: Buffer,
  folder = "manoyoga"
): Promise<CloudinaryUploadResult> {
  if (!isConfigured) {
    console.warn("[Cloudinary] Credentials not configured. Falling back to mock asset paths.");
    // Return mock details matching standard gallery layout placeholders
    const mockId = `mock_${Date.now()}`;
    return {
      publicId: mockId,
      secureUrl: `/gallery-1.jpg`,
      width: 800,
      height: 600,
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed."));
          }
          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
          });
        }
      )
      .end(fileBuffer);
  });
}

/**
 * Deletes an asset from Cloudinary by its publicId.
 */
export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured) {
    console.warn(`[Cloudinary] Delete skipped for mock ID: ${publicId}`);
    return { success: true };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      return { success: true };
    }
    return { success: false, error: `Cloudinary delete response: ${result.result}` };
  } catch (error: any) {
    return { success: false, error: error.message || "Cloudinary delete error." };
  }
}

/**
 * Generates an optimized image URL.
 */
export function getOptimizedUrl(publicId: string): string {
  if (!isConfigured || publicId.startsWith("mock_")) {
    return publicId.startsWith("mock_") ? "/gallery-1.jpg" : publicId;
  }
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
  });
}

/**
 * Generates a standard thumbnail URL.
 */
export function getThumbnailUrl(publicId: string): string {
  if (!isConfigured || publicId.startsWith("mock_")) {
    return publicId.startsWith("mock_") ? "/gallery-1.jpg" : publicId;
  }
  return cloudinary.url(publicId, {
    width: 200,
    height: 200,
    crop: "thumb",
    fetch_format: "auto",
    quality: "auto",
  });
}

"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";

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
 * Fetch all gallery items. Seeds default items if table is empty.
 */
export async function getGalleryItems() {
  try {
    const count = await prisma.gallery.count();
    if (count === 0) {
      const mockData = [
        {
          id: "GAL-101",
          title: "Vinyasa Flow Class Stretch",
          altText: "Instructor Nistha guiding vinyasa postures",
          category: "Yoga Classes",
          description: "Morning yoga class session focusing on chest opener movements.",
          featured: true,
          status: "Active",
          url: "/gallery-1.jpg",
          fileSize: "245 KB",
          seoTitle: "Morning Vinyasa Flow Classes",
          seoAlt: "Yogis practicing chest extension flow",
          seoCaption: "Fluid alignment guide classes by Nistha."
        },
        {
          id: "GAL-102",
          title: "Deep Breathing Focus",
          altText: "Pranayama concentration student close up",
          category: "Meditation",
          description: "Pranayama and deep breath meditation batch setup.",
          featured: true,
          status: "Active",
          url: "/gallery-2.jpg",
          fileSize: "190 KB",
          seoTitle: "Guided Breathing and Meditation Sessions",
          seoAlt: "Student focusing on breath holds",
          seoCaption: "Slowing down respiratory cycles in studio."
        },
        {
          id: "GAL-103",
          title: "Corporate Desk Stretch Workshop",
          altText: "Office team practicing chair poses",
          category: "Corporate Yoga",
          description: "Corporate yoga break helping employees stretch shoulder segments.",
          featured: false,
          status: "Active",
          url: "/gallery-3.jpg",
          fileSize: "320 KB",
          seoTitle: "Office Team Workspace Stretch Programs",
          seoAlt: "Chair stretches for spine relief",
          seoCaption: "Releasing workspace body fatigue."
        }
      ];

      await prisma.gallery.createMany({
        data: mockData,
      });
    }

    return await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Get gallery items error:", error);
    return [];
  }
}

/**
 * Creates a new gallery entry.
 */
export async function createGalleryItem(data: {
  title: string;
  altText: string;
  category: string;
  description?: string;
  url: string;
  fileSize: string;
  seoTitle?: string;
  seoAlt?: string;
  seoCaption?: string;
  featured?: boolean;
  status?: string;
}) {
  try {
    await checkAdminAuth();

    const item = await prisma.gallery.create({
      data: {
        title: data.title,
        altText: data.altText,
        category: data.category,
        description: data.description,
        url: data.url,
        fileSize: data.fileSize,
        seoTitle: data.seoTitle,
        seoAlt: data.seoAlt,
        seoCaption: data.seoCaption,
        featured: data.featured ?? false,
        status: data.status ?? "Active",
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create gallery item." };
  }
}

/**
 * Updates an existing gallery entry.
 */
export async function updateGalleryItem(
  id: string,
  data: {
    title: string;
    altText: string;
    category: string;
    description?: string;
    featured?: boolean;
    status?: string;
    seoTitle?: string;
    seoAlt?: string;
    seoCaption?: string;
  }
) {
  try {
    await checkAdminAuth();

    const item = await prisma.gallery.update({
      where: { id },
      data: {
        title: data.title,
        altText: data.altText,
        category: data.category,
        description: data.description,
        featured: data.featured,
        status: data.status,
        seoTitle: data.seoTitle,
        seoAlt: data.seoAlt,
        seoCaption: data.seoCaption,
      },
    });

    revalidatePath("/admin/gallery");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update gallery item." };
  }
}

/**
 * Deletes a gallery entry.
 */
export async function deleteGalleryItem(id: string) {
  try {
    await checkAdminAuth();

    await prisma.gallery.delete({
      where: { id },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete gallery item." };
  }
}

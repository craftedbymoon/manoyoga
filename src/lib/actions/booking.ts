"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/config";
import { bookingSchema, BookingInput } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";
import { sendEmail, getAdminEmailAddress } from "@/lib/email/services/resend";
import {
  getBookingConfirmationTemplate,
  getBookingStatusUpdatedTemplate,
  getAdminBookingAlertTemplate
} from "@/lib/email/templates";

// Helper function to check role access
async function checkAuth(allowedRoles: string[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Unauthorized");
  }
  return user;
}

// 1. Create Booking (Public Access)
export async function createBooking(input: BookingInput) {
  // Validate input
  const result = bookingSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid booking inputs." };
  }

  const { name, email, phone, serviceId, date, time, mode, message } = result.data;

  try {
    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return { success: false, error: "Selected service does not exist." };
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        serviceId,
        date,
        time,
        mode,
        message,
        status: "Pending",
        paymentStatus: "Pending",
      },
    });

    // Send confirmation & admin alert emails asynchronously
    const bookingDetails = {
      id: booking.id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      program: service.name,
      date: booking.date,
      time: booking.time,
      mode: booking.mode,
      status: booking.status,
    };

    sendEmail({
      to: booking.email,
      subject: "Booking Confirmation - ManoYoga",
      html: getBookingConfirmationTemplate(bookingDetails),
    }).catch((err) => console.error("Failed to send user confirmation email:", err));

    sendEmail({
      to: getAdminEmailAddress(),
      subject: "New Booking Alert - Admin Panel",
      html: getAdminBookingAlertTemplate(bookingDetails),
    }).catch((err) => console.error("Failed to send admin booking alert email:", err));

    revalidatePath("/admin/bookings");
    revalidatePath("/");

    return { success: true, booking };
  } catch (error: any) {
    console.error("Create booking error:", error);
    return { success: false, error: "Failed to create booking." };
  }
}

// 2. Update Booking (Admin / Support Access)
export async function updateBooking(id: string, input: BookingInput) {
  await checkAuth(["Admin", "Support"]);

  const result = bookingSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid booking inputs." };
  }

  const { name, email, phone, serviceId, date, time, mode, message } = result.data;

  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        serviceId,
        date,
        time,
        mode,
        message,
      },
    });

    revalidatePath("/admin/bookings");
    return { success: true, booking: updated };
  } catch (error) {
    return { success: false, error: "Failed to update booking." };
  }
}

// 3. Delete Booking (Admin / Support Access)
export async function deleteBooking(id: string) {
  await checkAuth(["Admin", "Support"]);

  try {
    await prisma.booking.delete({
      where: { id },
    });

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete booking." };
  }
}

// 4. Get Booking By ID (Admin / Support Access)
export async function getBookingById(id: string) {
  await checkAuth(["Admin", "Support"]);

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    return booking;
  } catch (error) {
    return null;
  }
}

// 5. Get All Bookings (Admin / Support Access)
export async function getBookings() {
  await checkAuth(["Admin", "Support"]);

  try {
    const bookings = await prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });
    return bookings;
  } catch (error) {
    console.error("Get bookings error:", error);
    return [];
  }
}

// 6. Change Status (Admin / Support Access)
export async function updateBookingStatus(id: string, status: "Pending" | "Confirmed" | "Completed" | "Cancelled") {
  await checkAuth(["Admin", "Support"]);

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { service: true },
    });

    // Send status update email asynchronously
    const bookingDetails = {
      id: booking.id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      program: booking.service?.name || "Yoga Session",
      date: booking.date,
      time: booking.time,
      mode: booking.mode,
      status: booking.status,
    };

    sendEmail({
      to: booking.email,
      subject: "Booking Status Update - ManoYoga",
      html: getBookingStatusUpdatedTemplate(bookingDetails),
    }).catch((err) => console.error("Failed to send status update email:", err));

    revalidatePath("/admin/bookings");
    return { success: true, booking };
  } catch (error) {
    return { success: false, error: "Failed to update booking status." };
  }
}

// 7. Get Active Services (Public & Admin Access)
export async function getActiveServices() {
  try {
    const count = await prisma.service.count();
    if (count === 0) {
      // Auto seed default services if table is empty
      const mockServices = [
        { id: "SRV-101", name: "Beginner Yoga", slug: "beginner-yoga", shortDesc: "Foundational postures for flexibility and alignment.", fullDesc: "Learn the basics of Hatha yoga.", category: "Hatha", duration: "60 mins", level: "Beginner", price: 15, featured: true, status: "Active" },
        { id: "SRV-102", name: "Power Yoga Core", slug: "power-yoga", shortDesc: "High-intensity athletic flow targeting core strength.", fullDesc: "An energetic fitness vinyasa class.", category: "Vinyasa", duration: "75 mins", level: "Intermediate", price: 20, featured: true, status: "Active" },
        { id: "SRV-103", name: "Deep Meditation & Breathing", slug: "deep-meditation", shortDesc: "Pranayama concentration and mindfulness.", fullDesc: "A peaceful meditation class.", category: "Meditation", duration: "45 mins", level: "All Levels", price: 12, featured: false, status: "Active" }
      ];
      await prisma.service.createMany({
        data: mockServices,
      });
    }

    const services = await prisma.service.findMany({
      where: { status: "Active" },
      orderBy: { name: "asc" },
    });
    return services;
  } catch (error) {
    console.error("Get active services error:", error);
    return [];
  }
}

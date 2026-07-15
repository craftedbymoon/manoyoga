import * as z from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  serviceId: z.string().min(1, "Please select a program/service"),
  date: z.string().min(1, "Please select a preferred date"),
  time: z.string().min(1, "Please select a preferred time slot"),
  mode: z.enum(["Online", "Offline"]),
  message: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

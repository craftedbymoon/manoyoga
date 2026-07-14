export type UserRole = "Admin" | "Editor" | "Support";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Session {
  user: User;
  expires: string;
}

export type Permission =
  | "view_dashboard"
  | "manage_bookings"
  | "manage_services"
  | "manage_blog"
  | "manage_gallery"
  | "manage_testimonials"
  | "manage_faq"
  | "manage_newsletter"
  | "manage_messages"
  | "manage_users"
  | "manage_settings"
  | "view_analytics";

import { UserRole, Permission } from "@/types/auth";

// Permissions mapping registry for ManoYoga Admin Panel
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    "view_dashboard",
    "manage_bookings",
    "manage_services",
    "manage_blog",
    "manage_gallery",
    "manage_testimonials",
    "manage_faq",
    "manage_newsletter",
    "manage_messages",
    "manage_users",
    "manage_settings",
    "view_analytics",
  ],
  Editor: [
    "view_dashboard",
    "manage_blog",
    "manage_gallery",
    "manage_testimonials",
    "manage_faq",
  ],
  Support: [
    "view_dashboard",
    "manage_bookings",
    "manage_messages",
  ],
};

// Map URL routes to required permissions
export const ROUTE_PERMISSIONS_MAP: Record<string, Permission> = {
  "/admin/dashboard": "view_dashboard",
  "/admin/bookings": "manage_bookings",
  "/admin/services": "manage_services",
  "/admin/blog": "manage_blog",
  "/admin/gallery": "manage_gallery",
  "/admin/testimonials": "manage_testimonials",
  "/admin/faq": "manage_faq",
  "/admin/newsletter": "manage_newsletter",
  "/admin/messages": "manage_messages",
  "/admin/users": "manage_users",
  "/admin/settings": "manage_settings",
  "/admin/analytics": "view_analytics",
};

/**
 * Checks if a user role has the required permission for a specific route.
 */
export function hasAccessToPath(role: UserRole, path: string): boolean {
  // Direct matches
  let requiredPermission = ROUTE_PERMISSIONS_MAP[path];

  // If no direct match, check base prefix (e.g. /admin/blog/create)
  if (!requiredPermission) {
    const matchingKey = Object.keys(ROUTE_PERMISSIONS_MAP).find(
      (key) => path === key || path.startsWith(key + "/")
    );
    if (matchingKey) {
      requiredPermission = ROUTE_PERMISSIONS_MAP[matchingKey];
    }
  }

  // If no specific permission mapped, allow by default
  if (!requiredPermission) return true;

  const allowedPermissions = ROLE_PERMISSIONS[role] || [];
  return allowedPermissions.includes(requiredPermission);
}

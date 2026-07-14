"use server";

import { cookies } from "next/headers";
import { Session, User, UserRole } from "@/types/auth";
import { AUTH_COOKIE_NAME, SESSION_DURATION_SECONDS } from "./constants";

// Mock User Accounts database registry
export const MOCK_USERS = [
  {
    id: "usr_1",
    email: "admin@manoyoga.com",
    name: "Nistha (Admin)",
    role: "Admin" as UserRole,
    password: "Admin@123"
  },
  {
    id: "usr_2",
    email: "editor@manoyoga.com",
    name: "Jane (Editor)",
    role: "Editor" as UserRole,
    password: "Editor@123"
  },
  {
    id: "usr_3",
    email: "support@manoyoga.com",
    name: "Alex (Support)",
    role: "Support" as UserRole,
    password: "Support@123"
  }
];

/**
 * Server Action: Validates user credentials and sets mock session cookie.
 * Matches signIn method signatures in Auth.js.
 */
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const userRecord = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!userRecord) {
    return { success: false, error: "Invalid credentials provided." };
  }

  const sessionData: Session = {
    user: {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role
    },
    expires: new Date(Date.now() + SESSION_DURATION_SECONDS * 1000).toISOString()
  };

  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: JSON.stringify(sessionData),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/"
  });

  return { success: true };
}

/**
 * Server Action: Deletes session cookie to log user out.
 */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Retrieves the current mock session.
 * Matches getSession/auth method signatures in Auth.js.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const session: Session = JSON.parse(sessionCookie.value);
    
    // Check if session has expired
    if (new Date(session.expires).getTime() < Date.now()) {
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current authenticated user details.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session ? session.user : null;
}

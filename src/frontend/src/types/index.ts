/**
 * Shared TypeScript types for SIMS application.
 * These mirror the backend Motoko data structures.
 */

/** A student record as returned from the backend */
export interface Student {
  prn: string; // Unique PRN (Permanent Registration Number)
  name: string;
  mobile: string;
  email: string;
  address: string;
  // Password hash is never returned to frontend
}

/** Input for registering a new student */
export interface RegisterInput {
  prn: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  hashedPassword: string; // SHA-256 hashed password (hashed client-side)
}

/** Input for updating a student's profile (email is not updatable per backend) */
export interface UpdateProfileInput {
  name: string;
  mobile: string;
  address: string;
}

/** Result of a registration attempt */
export type RegisterResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Result of an update operation */
export type UpdateResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Result of a delete operation */
export type DeleteResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/** Admin session token — stored in localStorage */
export type SessionToken = string;

/** Result of admin login attempt */
export type AdminLoginResult =
  | { ok: true; token: SessionToken }
  | { ok: false; error: string };

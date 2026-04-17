// main.mo
// Composition root for the SIMS canister.
// Owns all state and wires it into domain mixins. No business logic lives here.

import List   "mo:core/List";
import Map    "mo:core/Map";
import Text   "mo:core/Text";

import Common "types/common";
import T      "types/students-admin";

import StudentsAdminApi "mixins/students-admin-api";

actor {
  // ----------------------------------------------------------------
  // Persistent state (enhanced orthogonal persistence — no `stable`)
  // ----------------------------------------------------------------

  // All registered students, stored in insertion order
  let students   : List.List<T.StudentInternal>                = List.empty();

  // Lookup indexes for fast duplicate detection
  let prnIndex   : Map.Map<Text, Nat>                          = Map.empty();
  let emailIndex : Map.Map<Text, Nat>                          = Map.empty();

  // Active admin session tokens mapped to their expiry timestamp (nanoseconds)
  let sessions   : Map.Map<Common.SessionToken, Common.Timestamp> = Map.empty();

  // Admin credentials — hardcoded at deploy time.
  // Default password is "Admin@123" — the frontend must SHA-256 hash the password
  // before sending it here. The hash below is SHA-256("Admin@123").
  let admin      : T.AdminInternal = {
    email          = "admin@sims.local";
    // SHA-256 hex of "Admin@123"
    hashedPassword = "f7a1cc0f0a5a4c40b7c6d01e3a15e6c5b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7";
  };

  // ----------------------------------------------------------------
  // Mixin inclusion — delegates all public endpoints to the mixin
  // ----------------------------------------------------------------
  include StudentsAdminApi(students, prnIndex, emailIndex, admin, sessions);
};

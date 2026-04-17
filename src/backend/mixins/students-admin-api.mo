// mixins/students-admin-api.mo
// Public API surface for the Student Information Management System.
// All state slices are injected — no global state lives here.

import List    "mo:core/List";
import Map     "mo:core/Map";
import Time    "mo:core/Time";

import Common  "../types/common";
import T       "../types/students-admin";
import Lib     "../lib/students-admin";

mixin (
  students   : List.List<T.StudentInternal>,
  prnIndex   : Map.Map<Text, Nat>,
  emailIndex : Map.Map<Text, Nat>,
  admin      : T.AdminInternal,
  sessions   : Map.Map<Common.SessionToken, Common.Timestamp>,
) {

  // ============================================================
  // Student Registration
  // ============================================================

  /// Register a new student account.
  /// The caller's Internet Identity principal is stored as the student's identity.
  public shared ({ caller }) func registerStudent(input : T.RegisterInput) : async T.RegisterResult {
    let now = Time.now();
    Lib.registerStudent(students, prnIndex, emailIndex, input, caller, now);
  };

  // ============================================================
  // Student Self-Service (requires authenticated principal)
  // ============================================================

  /// Get the logged-in student's own profile.
  public shared query ({ caller }) func getMyProfile() : async ?T.Student {
    Lib.getOwnProfile(students, caller);
  };

  /// Update the logged-in student's own profile (name, mobile, address).
  public shared ({ caller }) func updateMyProfile(input : T.UpdateProfileInput) : async T.UpdateResult {
    Lib.updateOwnProfile(students, caller, input);
  };

  // ============================================================
  // Admin Authentication
  // ============================================================

  /// Admin login — validates credentials and returns a session token.
  /// On success, the token is stored in the sessions map with the current timestamp.
  public shared func adminLogin(email : Text, hashedPassword : Text) : async T.AdminLoginResult {
    let now = Time.now();
    let result = Lib.adminLogin(admin, email, hashedPassword, now);
    switch (result) {
      case (#ok(token)) {
        // Store token issuance time so we can check expiry later
        sessions.add(token, now);
      };
      case (#err(_)) {};
    };
    result;
  };

  // ============================================================
  // Admin — Student Management (all require valid session token)
  // ============================================================

  /// Get all students with optional pagination (admin only).
  public shared func getAllStudents(token : Common.SessionToken, offset : Nat, limit : Nat) : async [T.Student] {
    let now = Time.now();
    // Reject requests with an invalid or expired token
    if (not Lib.isValidAdminToken(sessions, token, now)) {
      return [];
    };
    Lib.getAllStudents(students, offset, limit);
  };

  /// Search students by PRN (exact match) or name (substring, case-insensitive) (admin only).
  public shared func searchStudents(token : Common.SessionToken, searchQuery : Text) : async [T.Student] {
    let now = Time.now();
    if (not Lib.isValidAdminToken(sessions, token, now)) {
      return [];
    };
    Lib.searchStudents(students, searchQuery);
  };

  /// Update any student's profile by PRN (admin only).
  public shared func adminUpdateStudent(token : Common.SessionToken, prn : Text, input : T.UpdateProfileInput) : async T.UpdateResult {
    let now = Time.now();
    if (not Lib.isValidAdminToken(sessions, token, now)) {
      return #err("unauthorized");
    };
    Lib.adminUpdateStudent(students, prnIndex, prn, input);
  };

  /// Delete a student by PRN (admin only).
  public shared func deleteStudent(token : Common.SessionToken, prn : Text) : async T.DeleteResult {
    let now = Time.now();
    if (not Lib.isValidAdminToken(sessions, token, now)) {
      return #err("unauthorized");
    };
    Lib.deleteStudent(students, prnIndex, emailIndex, prn);
  };
};

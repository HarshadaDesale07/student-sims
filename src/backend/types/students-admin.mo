// types/students-admin.mo
// Domain-specific type definitions for the Student Information Management System.

import Common "common";

module {
  // -----------------------------------------------------------
  // Student record — stored internally with mutable fields
  // -----------------------------------------------------------
  public type StudentInternal = {
    prn           : Text;           // Unique PRN number (e.g. "PRN2024001")
    var name      : Text;           // Full name of the student
    var mobile    : Text;           // Mobile number
    email         : Text;           // Email address (unique, used for login)
    var address   : Text;           // Residential address
    hashedPassword: Text;           // Bcrypt-style hashed password
    principal     : Common.UserId;  // Internet Identity principal
    createdAt     : Common.Timestamp;
  };

  // Public-facing student record (no var fields, safe to share over the wire)
  public type Student = {
    prn       : Text;
    name      : Text;
    mobile    : Text;
    email     : Text;
    address   : Text;
    principal : Common.UserId;
    createdAt : Common.Timestamp;
  };

  // -----------------------------------------------------------
  // Registration input — sent by the frontend when signing up
  // -----------------------------------------------------------
  public type RegisterInput = {
    prn           : Text;
    name          : Text;
    mobile        : Text;
    email         : Text;
    address       : Text;
    hashedPassword: Text;  // Client-side hashed password (SHA-256 hex)
  };

  // -----------------------------------------------------------
  // Profile update input — only mutable fields
  // -----------------------------------------------------------
  public type UpdateProfileInput = {
    name    : Text;
    mobile  : Text;
    address : Text;
  };

  // -----------------------------------------------------------
  // Admin record — stored internally
  // -----------------------------------------------------------
  public type AdminInternal = {
    email         : Text;
    hashedPassword: Text;  // Hashed admin password
  };

  // -----------------------------------------------------------
  // Result variants used across the domain
  // -----------------------------------------------------------
  public type RegisterResult = {
    #ok  : Student;
    #err : Text;    // "prn_taken" | "email_taken" | "invalid_input"
  };

  public type AdminLoginResult = {
    #ok  : Common.SessionToken;
    #err : Text;    // "invalid_credentials"
  };

  public type UpdateResult = {
    #ok  : Student;
    #err : Text;    // "not_found" | "unauthorized"
  };

  public type DeleteResult = {
    #ok;
    #err : Text;    // "not_found" | "unauthorized"
  };
};

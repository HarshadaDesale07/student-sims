// lib/students-admin.mo
// Domain logic for the Student Information Management System.
// Stateless module — all state is injected as parameters.

import Int       "mo:core/Int";
import List      "mo:core/List";
import Map       "mo:core/Map";
import Principal "mo:core/Principal";
import Text      "mo:core/Text";

import Common  "../types/common";
import T       "../types/students-admin";

module {

  // -----------------------------------------------------------
  // Internal helper: convert internal student to public type
  // -----------------------------------------------------------

  /// Convert an internal student record to its public (shared) representation.
  /// Strips mutable var fields and exposes a clean immutable record.
  public func toPublic(s : T.StudentInternal) : T.Student {
    {
      prn       = s.prn;
      name      = s.name;
      mobile    = s.mobile;
      email     = s.email;
      address   = s.address;
      principal = s.principal;
      createdAt = s.createdAt;
    };
  };

  // -----------------------------------------------------------
  // Student registration
  // -----------------------------------------------------------

  /// Register a new student. Returns #err if PRN or email already exists.
  /// Uses index maps for O(1) duplicate detection.
  public func registerStudent(
    students   : List.List<T.StudentInternal>,
    prnIndex   : Map.Map<Text, Nat>,   // PRN -> list index
    emailIndex : Map.Map<Text, Nat>,   // email -> list index
    input      : T.RegisterInput,
    caller     : Common.UserId,
    now        : Common.Timestamp,
  ) : T.RegisterResult {
    // Check for duplicate PRN
    switch (prnIndex.get(input.prn)) {
      case (?_) { return #err("prn_taken") };
      case null {};
    };

    // Check for duplicate email
    switch (emailIndex.get(input.email)) {
      case (?_) { return #err("email_taken") };
      case null {};
    };

    // Validate that required fields are non-empty
    if (input.prn == "" or input.name == "" or input.email == "") {
      return #err("invalid_input");
    };

    // Build the internal record with mutable fields
    let newStudent : T.StudentInternal = {
      prn            = input.prn;
      var name       = input.name;
      var mobile     = input.mobile;
      email          = input.email;
      var address    = input.address;
      hashedPassword = input.hashedPassword;
      principal      = caller;
      createdAt      = now;
    };

    // Record the current index before adding (size == next index)
    let idx = students.size();
    students.add(newStudent);

    // Update both indexes
    prnIndex.add(input.prn, idx);
    emailIndex.add(input.email, idx);

    #ok(toPublic(newStudent));
  };

  // -----------------------------------------------------------
  // Student self-service (authenticated by principal)
  // -----------------------------------------------------------

  /// Get a student's own profile by their principal. Returns null if not registered.
  public func getOwnProfile(
    students : List.List<T.StudentInternal>,
    caller   : Common.UserId,
  ) : ?T.Student {
    // Find the student whose principal matches the caller
    switch (students.find(func(s : T.StudentInternal) : Bool {
      Principal.equal(s.principal, caller)
    })) {
      case (?s) { ?toPublic(s) };
      case null { null };
    };
  };

  /// Update a student's own mutable fields (name, mobile, address).
  public func updateOwnProfile(
    students : List.List<T.StudentInternal>,
    caller   : Common.UserId,
    input    : T.UpdateProfileInput,
  ) : T.UpdateResult {
    // Find the student by principal
    switch (students.find(func(s : T.StudentInternal) : Bool {
      Principal.equal(s.principal, caller)
    })) {
      case (?s) {
        // Mutate the fields in place
        s.name    := input.name;
        s.mobile  := input.mobile;
        s.address := input.address;
        #ok(toPublic(s));
      };
      case null { #err("not_found") };
    };
  };

  // -----------------------------------------------------------
  // Admin operations
  // -----------------------------------------------------------

  /// Validate admin credentials. Returns a session token on success.
  /// The token is derived from the current timestamp — sessions last 24 hours.
  public func adminLogin(
    admin    : T.AdminInternal,
    email    : Text,
    password : Text,  // Client-side hashed password
    now      : Common.Timestamp,
  ) : T.AdminLoginResult {
    // Compare email and password against stored admin credentials
    if (admin.email == email and admin.hashedPassword == password) {
      // Generate a simple session token from timestamp
      // Format: "session_<nanosecond_timestamp>"
      let token : Common.SessionToken = "session_" # now.toText();
      #ok(token);
    } else {
      #err("invalid_credentials");
    };
  };

  /// Check whether a session token is currently valid (not expired).
  /// Sessions are valid for 24 hours (24 * 60 * 60 * 1_000_000_000 ns).
  public func isValidAdminToken(
    sessions : Map.Map<Common.SessionToken, Common.Timestamp>,
    token    : Common.SessionToken,
    now      : Common.Timestamp,
  ) : Bool {
    let twentyFourHoursNs : Int = 24 * 60 * 60 * 1_000_000_000;

    switch (sessions.get(token)) {
      case (?issuedAt) {
        // Token is valid if it was issued less than 24 hours ago
        (now - issuedAt) < twentyFourHoursNs;
      };
      case null { false };
    };
  };

  /// Retrieve all registered students (paginated).
  /// offset: how many records to skip; limit: max records to return.
  public func getAllStudents(
    students : List.List<T.StudentInternal>,
    offset   : Nat,
    limit    : Nat,
  ) : [T.Student] {
    // Collect the students in the requested window
    let result = List.empty<T.Student>();
    var idx = 0;
    var count = 0;

    students.forEach(func(s : T.StudentInternal) {
      if (idx >= offset and count < limit) {
        result.add(toPublic(s));
        count += 1;
      };
      idx += 1;
    });

    result.toArray();
  };

  /// Search students by PRN (exact) or name (case-insensitive substring).
  public func searchStudents(
    students    : List.List<T.StudentInternal>,
    searchQuery : Text,
  ) : [T.Student] {
    let lowerQuery = searchQuery.toLower();

    // Filter: match exact PRN OR name containing the query (case-insensitive)
    students
      .filter(func(s : T.StudentInternal) : Bool {
        s.prn == searchQuery or
        s.name.toLower().contains(#text lowerQuery)
      })
      .map<T.StudentInternal, T.Student>(func(s) { toPublic(s) })
      .toArray();
  };

  /// Admin updates any student's mutable fields by PRN.
  public func adminUpdateStudent(
    students   : List.List<T.StudentInternal>,
    prnIndex   : Map.Map<Text, Nat>,
    prn        : Text,
    input      : T.UpdateProfileInput,
  ) : T.UpdateResult {
    // Look up the student's index via PRN index for O(1) access
    switch (prnIndex.get(prn)) {
      case (?idx) {
        // at() traps on OOB — safe here because idx came from our own index map
        let s = students.at(idx);
        s.name    := input.name;
        s.mobile  := input.mobile;
        s.address := input.address;
        #ok(toPublic(s));
      };
      case null { #err("not_found") };
    };
  };

  /// Admin deletes a student record by PRN.
  /// Note: removal shifts list indices so index maps are rebuilt after deletion.
  public func deleteStudent(
    students   : List.List<T.StudentInternal>,
    prnIndex   : Map.Map<Text, Nat>,
    emailIndex : Map.Map<Text, Nat>,
    prn        : Text,
  ) : T.DeleteResult {
    // Check that the student exists
    switch (prnIndex.get(prn)) {
      case null { return #err("not_found") };
      case (?_idx) {
        // Remove the student from the list by rebuilding without matching PRN
        let remaining = students.filter(func(st : T.StudentInternal) : Bool {
          st.prn != prn
        });

        // Clear the current list and repopulate with remaining students
        students.clear();
        remaining.forEach(func(st : T.StudentInternal) {
          students.add(st);
        });

        // Rebuild both index maps from scratch to keep indices correct
        prnIndex.clear();
        emailIndex.clear();
        var newIdx = 0;
        students.forEach(func(st : T.StudentInternal) {
          prnIndex.add(st.prn, newIdx);
          emailIndex.add(st.email, newIdx);
          newIdx += 1;
        });

        #ok;
      };
    };
  };

};

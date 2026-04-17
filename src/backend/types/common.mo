// types/common.mo
// Cross-cutting types shared across all domains in the SIMS application.

module {
  // A student's unique identifier (their Internet Identity principal)
  public type UserId = Principal;

  // Unix-style timestamp in nanoseconds (from Time.now())
  public type Timestamp = Int;

  // Session token issued to admin after successful login
  public type SessionToken = Text;
};

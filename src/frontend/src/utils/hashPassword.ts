/**
 * Client-side password hashing using the browser's SubtleCrypto API.
 * This hashes the password before sending it to the backend,
 * so the plain-text password never leaves the browser.
 */

/**
 * Hashes a plain-text password using SHA-256.
 * Returns a lowercase hex string of the hash.
 */
export async function hashPassword(plainText: string): Promise<string> {
  // Encode the string as a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);

  // Use the SubtleCrypto API to compute SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hexHash;
}

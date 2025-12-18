const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 *  Generates a random id. It is not cryptographic
 *
 * @param length length of ID (default is 8)
 * @returns string
 */

export function randomID(length: number = 8): string {
  // Get a crypto-safe random number generator.
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let hash = "";
  for (let i = 0; i < length; i++) {
    // Use the random byte value to pick a character from the defined set.
    // The modulo operator ensures we stay within the bounds of the characters array.
    hash += characters[randomBytes[i] % characters.length];
  }
  return hash;
}

/**
 * Cryptographically secure random number selection.
 * Uses rejection sampling to ensure uniform distribution.
 */
export function getSecureRandom(remaining: number[]): number {
  if (remaining.length === 0) {
    throw new Error("No numbers remaining");
  }

  if (remaining.length === 1) {
    return remaining[0];
  }

  const maxValid =
    Math.floor(256 / remaining.length) * remaining.length - 1;

  let randomByte: number;
  do {
    const array = new Uint8Array(1);
    crypto.getRandomValues(array);
    randomByte = array[0];
  } while (randomByte > maxValid);

  const index = randomByte % remaining.length;
  return remaining[index];
}

/**
 * Get the color for a ball based on its number range.
 */
export function getBallColor(num: number): string {
  if (num <= 19) return "var(--color-red)";
  if (num <= 39) return "var(--color-gold)";
  if (num <= 59) return "var(--color-green)";
  if (num <= 79) return "var(--color-orange)";
  return "var(--color-white)";
}

export function getBallColorHex(num: number): string {
  if (num <= 19) return "#DC143C";
  if (num <= 39) return "#FFD700";
  if (num <= 59) return "#10B981";
  if (num <= 79) return "#F97316";
  return "#F1F5F9";
}

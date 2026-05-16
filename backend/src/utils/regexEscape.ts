/** Escape arbitrary user input before embedding it in `$regex`. */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

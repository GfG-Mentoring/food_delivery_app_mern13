const OBJECT_ID_HEX = /^[a-f\d]{24}$/i;

export function isValidObjectIdString(id: string): boolean {
  return OBJECT_ID_HEX.test(id);
}

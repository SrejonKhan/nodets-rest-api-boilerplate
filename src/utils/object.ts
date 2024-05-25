// Exclude keys from an object (credit: https://github.com/prisma/prisma/issues/5042#issuecomment-2058531353)
export function excludeFromObject<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;
}

// Exclude keys from objects in a list (credit: https://github.com/prisma/prisma/issues/5042#issuecomment-2058531353)
export function excludeFromList<T, K extends keyof T>(objects: T[], keysToDelete: K[]): Omit<T, K>[] {
  return objects.map((obj) => excludeFromObject(obj, keysToDelete)) as Omit<T, K>[];
}

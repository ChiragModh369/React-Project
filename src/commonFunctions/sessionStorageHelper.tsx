export const sessionStorageHelper = {
  // Store any object or value
  set: (key: string, value: unknown): void => {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  },

  // Retrieve and parse as a specific type
  get: <T = unknown>(key: string): T | null => {
    const item = sessionStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing sessionStorage item for key "${key}":`, error);
      return null;
    }
  },

  // Remove a specific item
  remove: (key: string): void => {
    sessionStorage.removeItem(key);
  },

  // Clear all sessionStorage
  clear: (): void => {
    sessionStorage.clear();
  },
};

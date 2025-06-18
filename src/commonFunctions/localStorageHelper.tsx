export const localStorageHelper = {
  // Store any object or value
  set: (key: string, value: unknown): void => {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  },

  // Retrieve and parse as a specific type
  get: <T = unknown>(key: string): T | null => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage item for key "${key}":`, error);
      return null;
    }
  },

  // Remove a specific item
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // Clear all localStorage
  clear: (): void => {
    localStorage.clear();
  },
};

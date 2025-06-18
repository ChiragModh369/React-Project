
/**
 * Simple cache utility for persisting data in localStorage
 * with TTL (time to live) support
 */

interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export const CACHE_KEYS = {
  CYBERSECURITY_JOBS: 'cybersecurity_jobs',
  SECURITY_ARCHITECTURE_JOBS: 'security_architecture_jobs',
};

export const cacheData = <T>(key: string, data: T, ttlMinutes: number = 60): void => {
  try {
    const now = Date.now();
    const item: CachedData<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
    console.log(`Data cached with key: ${key}`);
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = <T>(key: string): T | null => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) {
      return null;
    }
    
    const item: CachedData<T> = JSON.parse(cachedItem);
    const now = Date.now();
    
    // Check if cache has expired
    if (now > item.expiresAt) {
      console.log(`Cache expired for key: ${key}`);
      localStorage.removeItem(key);
      return null;
    }
    
    console.log(`Cache hit for key: ${key}, age: ${Math.round((now - item.timestamp) / 1000 / 60)} minutes`);
    return item.data;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const clearCache = (key: string): void => {
  localStorage.removeItem(key);
  console.log(`Cache cleared for key: ${key}`);
};

export const clearAllJobsCache = (): void => {
  clearCache(CACHE_KEYS.CYBERSECURITY_JOBS);
  clearCache(CACHE_KEYS.SECURITY_ARCHITECTURE_JOBS);
  console.log('All jobs cache cleared');
};

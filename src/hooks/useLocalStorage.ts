import { useState, useEffect, useCallback } from 'react';
import type { Student } from '../components/FileUpload';


export type LSStudents = {
    students: Student[] | null;
    fileName: string
}

export const lsStudentsDefault: LSStudents = {
    students: null,
    fileName: "",
  }

export const localStorageKeys = {
    students: 'students',
    storeInLocalStorage: 'storeInLocalStorage',
}

/**
 * A custom hook to synchronize component state with localStorage.
 * @param key The key in localStorage to store the value.
 * @param initialValue The default value if no item is found in localStorage.
 * @returns A stateful value, and a function to update it and localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Function to get the initial value from localStorage or use the provided initialValue
  const getInitialValue = useCallback((): T => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // useEffect to update localStorage whenever the state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  const removeItem = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue); // Reset state to initial value
      } catch (error) {
        console.error(error);
      }
    }
  }, [])

  // Return the stateful value and the setter function
  return [storedValue, setStoredValue, removeItem];
}
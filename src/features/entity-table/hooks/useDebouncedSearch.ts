import { useState, useEffect, useCallback } from "react";

/**
 * Хук для debounce поиска
 * @param initialValue - начальное значение
 * @param delay - задержка в мс (по умолчанию 300)
 * @returns [debouncedValue, setValue] - debounced значение и функция установки
 */
export function useDebouncedSearch<T>(
  initialValue: T,
  delay: number = 300,
): [T, (v: T) => void] {
  const [debounced, setDebounced] = useState<T>(initialValue);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return [debounced, setValue];
}

/**
 * Альтернативная версия хука с колбэком
 * @param callback - колбэк, вызываемый при изменении debounced значения
 * @param delay - задержка в мс (по умолчанию 300)
 * @returns handleSearch - функция для установки значения
 */
export const useDebouncedSearchWithCallback = (
  callback: (value: string) => void,
  delay: number = 300,
) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  useEffect(() => {
    callback(debouncedSearchTerm);
  }, [debouncedSearchTerm, callback]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearch,
  };
};

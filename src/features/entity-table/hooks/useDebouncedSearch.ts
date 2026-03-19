import { useState, useEffect, useCallback } from "react";

export const useDebouncedSearch = (
  callback: (value: string) => void,
  delay: number = 500,
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
    handleSearch,
  };
};

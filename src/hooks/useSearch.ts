import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSearchOptions {
  debounceMs?: number;
  initialValue?: string;
  onSearch?: (value: string) => void;
}

interface UseSearchResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  debouncedSearch: string;
  reset: () => void;
}

export function useSearch(
  options: UseSearchOptions = {}
): UseSearchResult {
  const {
    debounceMs = 300,
    initialValue = '',
    onSearch
  } = options;

  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      onSearch?.(searchTerm);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, debounceMs, onSearch]);

  const reset = useCallback(() => {
    setSearchTerm(initialValue);
    setDebouncedSearch(initialValue);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, [initialValue]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    reset
  };
}


import { useState, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
  onChange: (page: number, size: number) => void;
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationResult {
  const {
    initialPage = 1,
    initialPageSize = DEFAULT_PAGE_SIZE,
    onPageChange
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page, pageSize);
    }
  }, [pageSize, onPageChange]);

  const setPageSizeWithCallback = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (onPageChange) {
      onPageChange(1, size);
    }
  }, [onPageChange]);

  const onChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    if (onPageChange) {
      onPageChange(page, size);
    }
  }, [onPageChange]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    currentPage,
    pageSize,
    setPage,
    setPageSize: setPageSizeWithCallback,
    reset,
    onChange
  };
}


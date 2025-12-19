import { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  defaultValue?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Rechercher...', 
  debounceMs = 300,
  defaultValue = ''
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(() => defaultValue);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const onSearchRef = useRef(onSearch);
  const isInitialMount = useRef(true);
  const previousSearchTerm = useRef(defaultValue);
  const searchTermRef = useRef(defaultValue);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousSearchTerm.current = searchTerm;
      return;
    }

    if (searchTerm === previousSearchTerm.current) {
      return;
    }

    previousSearchTerm.current = searchTerm;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearchRef.current(searchTerm);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    searchTermRef.current = newValue;
  };

  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={handleChange}
      allowClear
      style={{ maxWidth: '400px', marginBottom: '16px' }}
    />
  );
}


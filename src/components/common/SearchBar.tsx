// Composant de barre de recherche avec debounce

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
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Nettoyer le timer précédent
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Créer un nouveau timer
    debounceTimer.current = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, onSearch, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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


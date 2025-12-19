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
  // Utiliser une fonction d'initialisation pour éviter les réinitialisations
  const [searchTerm, setSearchTerm] = useState(() => defaultValue);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const onSearchRef = useRef(onSearch);
  const isInitialMount = useRef(true);
  const previousSearchTerm = useRef(defaultValue);
  // Garder une référence stable de la valeur pour éviter les pertes d'état
  const searchTermRef = useRef(defaultValue);

  // Mettre à jour la référence de onSearch sans déclencher l'effet
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Synchroniser la ref avec l'état
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    // Ne pas appeler onSearch au montage initial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousSearchTerm.current = searchTerm;
      return;
    }

    // Ne pas appeler onSearch si la valeur n'a pas changé
    if (searchTerm === previousSearchTerm.current) {
      return;
    }

    previousSearchTerm.current = searchTerm;

    // Nettoyer le timer précédent
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Créer un nouveau timer
    debounceTimer.current = setTimeout(() => {
      onSearchRef.current(searchTerm);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Mettre à jour immédiatement pour que l'utilisateur voie ce qu'il tape
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


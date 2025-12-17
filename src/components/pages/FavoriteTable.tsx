// Tableau des favoris avec pagination et recherche

import { useState, useEffect, useCallback } from 'react';
import { Space, message } from 'antd';
import DataTable from '../common/DataTable';
import type { DataTableColumn } from '../common/DataTable';
import { getFavorites } from '../../API/favorites.api';
import type { IFavorite } from '../../model/IFavorite';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiError } from '../../utils/errorHandler';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export default function FavoriteTable() {
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFavorites = useCallback(async (page: number, limit: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const favorites = await getFavorites({ page, limit, search });
      setFavorites(favorites);
      setTotal(favorites.length);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchFavorites]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const columns: DataTableColumn<IFavorite>[] = [
    {
      title: 'ID Utilisateur',
      dataIndex: 'userId',
      key: 'userId',
      width: 120,
    },
    {
      title: 'Utilisateur',
      dataIndex: ['user', 'email'],
      key: 'userEmail',
      render: (_, record) => record.user?.email || `User ${record.userId}`,
    },
    {
      title: 'ID Emplacement',
      dataIndex: 'transportLocationId',
      key: 'transportLocationId',
      width: 150,
    },
    {
      title: 'Adresse',
      dataIndex: ['transportLocation', 'address'],
      key: 'locationAddress',
      render: (_, record) => record.transportLocation?.address || '-',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <h2>Favoris</h2>
        <DataTable
          columns={columns}
          data={favorites}
          loading={loading}
          error={error}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          onSearch={handleSearch}
          searchPlaceholder="Rechercher un favori..."
          showActions={false}
          rowKey={(record) => `${record.userId}-${record.transportLocationId}`}
          onRetry={() => fetchFavorites(currentPage, pageSize, searchTerm)}
        />
      </Space>
    </div>
  );
}


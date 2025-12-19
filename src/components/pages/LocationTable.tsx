// Tableau des emplacements de transport avec pagination et recherche

import { useState, useEffect, useCallback } from 'react';
import { Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import type { DataTableColumn } from '../common/DataTable';
import { getLocations, deleteLocation } from '../../API/locations.api';
import type { ILocation } from '../../model/ILocation';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiError } from '../../utils/errorHandler';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export default function LocationTable() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchLocations = useCallback(async (page: number, limit: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const locations = await getLocations({ page, limit, search });
      setLocations(locations);
      
      // Calculer le total approximatif basé sur la pagination
      // Si on a moins d'éléments que le limit, on est à la dernière page
      if (locations.length < limit) {
        setTotal((page - 1) * limit + locations.length);
      } else {
        // On suppose qu'il y a au moins une page de plus
        setTotal(page * limit + 1); // +1 pour indiquer qu'il y a plus
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchLocations]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm((prevSearchTerm) => {
      // Ne réinitialiser la page que si le terme de recherche a réellement changé
      if (prevSearchTerm !== value) {
        setCurrentPage(1);
      }
      return value;
    });
  }, []);

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleDelete = async (location: ILocation) => {
    try {
      await deleteLocation(location.id);
      message.success('Emplacement supprimé avec succès');
      fetchLocations(currentPage, pageSize, searchTerm);
    } catch (err) {
      const apiError = handleApiError(err);
      message.error(apiError.message);
    }
  };

  const columns: DataTableColumn<ILocation>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Adresse',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Catégorie',
      dataIndex: ['category', 'name'],
      key: 'categoryName',
      render: (_, record) => record.category?.name || '-',
    },
    {
      title: 'Véhicule',
      dataIndex: ['vehicle', 'brand'],
      key: 'vehicleBrand',
      render: (_, record) => record.vehicle ? `${record.vehicle.brand || ''} ${record.vehicle.model || ''}`.trim() || '-' : '-',
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      key: 'latitude',
      render: (lat) => lat !== null ? lat.toString() : '-',
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      key: 'longitude',
      render: (lng) => lng !== null ? lng.toString() : '-',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Emplacements de transport</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/locations/new')}
          >
            Ajouter un emplacement
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={locations}
          loading={loading}
          error={error}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          onSearch={handleSearch}
          searchPlaceholder="Rechercher un emplacement..."
          onDelete={handleDelete}
          editPath={(location) => `/locations/${location.id}/edit`}
          rowKey="id"
          onRetry={() => fetchLocations(currentPage, pageSize, searchTerm)}
        />
      </Space>
    </div>
  );
}


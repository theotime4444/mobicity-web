import { useState, useEffect, useCallback } from 'react';
import { Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import type { DataTableColumn } from '../common/DataTable';
import { getVehicles, deleteVehicle } from '../../API/vehicles.api';
import type { IVehicle } from '../../model/IVehicle';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiError } from '../../utils/errorHandler';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchVehicles = useCallback(async (page: number, limit: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const vehicles = await getVehicles({ page, limit, search });
      setVehicles(vehicles);
      
      if (vehicles.length < limit) {
        setTotal((page - 1) * limit + vehicles.length);
      } else {
        setTotal(page * limit + 1);
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
    fetchVehicles(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchVehicles]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm((prevSearchTerm) => {
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

  const handleDelete = async (vehicle: IVehicle) => {
    try {
      await deleteVehicle(vehicle.id);
      message.success('Véhicule supprimé avec succès');
      fetchVehicles(currentPage, pageSize, searchTerm);
    } catch (err) {
      const apiError = handleApiError(err);
      message.error(apiError.message);
    }
  };

  const columns: DataTableColumn<IVehicle>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Marque',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Modèle',
      dataIndex: 'model',
      key: 'model',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Véhicules</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/vehicles/new')}
          >
            Ajouter un véhicule
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={vehicles}
          loading={loading}
          error={error}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          onSearch={handleSearch}
          searchPlaceholder="Rechercher un véhicule..."
          onDelete={handleDelete}
          editPath={(vehicle) => `/vehicles/${vehicle.id}/edit`}
          rowKey="id"
          onRetry={() => fetchVehicles(currentPage, pageSize, searchTerm)}
        />
      </Space>
    </div>
  );
}


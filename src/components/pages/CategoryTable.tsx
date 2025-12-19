// Tableau des catégories avec pagination et recherche

import { useState, useEffect, useCallback } from 'react';
import { Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import type { DataTableColumn } from '../common/DataTable';
import { getCategories, deleteCategory } from '../../API/categories.api';
import type { ICategory } from '../../model/ICategory';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiError } from '../../utils/errorHandler';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export default function CategoryTable() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchCategories = useCallback(async (page: number, limit: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const categories = await getCategories({ page, limit, search });
      setCategories(categories);
      
      // Calculer le total approximatif basé sur la pagination
      // Si on a moins d'éléments que le limit, on est à la dernière page
      if (categories.length < limit) {
        setTotal((page - 1) * limit + categories.length);
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
    fetchCategories(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchCategories]);

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

  const handleDelete = async (category: ICategory) => {
    try {
      await deleteCategory(category.id);
      message.success('Catégorie supprimée avec succès');
      fetchCategories(currentPage, pageSize, searchTerm);
    } catch (err) {
      const apiError = handleApiError(err);
      message.error(apiError.message);
    }
  };

  const columns: DataTableColumn<ICategory>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Catégories</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/categories/new')}
          >
            Ajouter une catégorie
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          error={error}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          onSearch={handleSearch}
          searchPlaceholder="Rechercher une catégorie..."
          onDelete={handleDelete}
          editPath={(category) => `/categories/${category.id}/edit`}
          rowKey="id"
          onRetry={() => fetchCategories(currentPage, pageSize, searchTerm)}
        />
      </Space>
    </div>
  );
}


import { useState, useEffect, useCallback } from 'react';
import { Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '../common/DataTable';
import type { DataTableColumn } from '../common/DataTable';
import { getUsers, deleteUser } from '../../API/users.api';
import type { IUser } from '../../model/IUser';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiError } from '../../utils/errorHandler';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

export default function UserTable() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (page: number, limit: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const users = await getUsers({ page, limit, search });
      setUsers(users);
      
      if (users.length < limit) {
        setTotal((page - 1) * limit + users.length);
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
    fetchUsers(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm, fetchUsers]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm((prevSearchTerm) => {
      if (prevSearchTerm !== value) {
        setCurrentPage(1);
      }
      return value;
    });
  }, []);

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleDelete = async (user: IUser) => {
    try {
      await deleteUser(user.id);
      message.success('Utilisateur supprimé avec succès');
      fetchUsers(currentPage, pageSize, searchTerm);
    } catch (err) {
      const apiError = handleApiError(err);
      message.error(apiError.message);
    }
  };

  const handleEdit = (user: IUser) => {
    navigate(`/users/${user.id}/edit`);
  };

  const columns: DataTableColumn<IUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Prénom',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Nom',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Adresse mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Administrateur',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (isAdmin ? 'Oui' : 'Non'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: '16px', width: '100%', justifyContent: 'space-between' }}>
        <h2>Gestion des utilisateurs</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/new')}
        >
          Ajouter un utilisateur
        </Button>
      </Space>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        pagination={{
          current: currentPage,
          total,
          pageSize,
        }}
        onPaginationChange={handlePaginationChange}
        onSearch={handleSearch}
        searchPlaceholder="Rechercher par nom, prénom ou email..."
        onDelete={handleDelete}
        editPath={(user) => `/users/${user.id}/edit`}
        onRetry={() => fetchUsers(currentPage, pageSize, searchTerm)}
        rowKey="id"
      />
    </div>
  );
}

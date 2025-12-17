// Composant de tableau générique réutilisable

import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type { ApiError } from '../../utils/errorHandler';

export interface DataTableColumn<T> extends Omit<TableColumnsType<T>[number], 'key'> {
  key: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: ApiError | null;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  onSearch: (searchTerm: string) => void;
  searchPlaceholder?: string;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => Promise<void> | void;
  editPath?: (record: T) => string;
  rowKey?: string | ((record: T) => React.Key);
  showActions?: boolean;
  onRetry?: () => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  error,
  pagination,
  onPaginationChange,
  onSearch,
  searchPlaceholder = 'Rechercher...',
  onEdit,
  onDelete,
  editPath,
  rowKey = 'id',
  showActions = true,
  onRetry
}: DataTableProps<T>) {
  const navigate = useNavigate();

  // Ajouter la colonne d'actions si nécessaire
  const finalColumns = [...columns];
  
  if (showActions && (onEdit || onDelete || editPath)) {
    finalColumns.push({
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: unknown, record: T) => (
        <Space size="middle">
          {(onEdit || editPath) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                if (onEdit) {
                  onEdit(record);
                } else if (editPath) {
                  navigate(editPath(record));
                }
              }}
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cet élément ?"
              onConfirm={() => onDelete(record)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              >
                Supprimer
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    });
  }

  if (loading) {
    return <LoadingSpinner message="Chargement des données..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} fullWidth />;
  }

  return (
    <div>
      <SearchBar
        onSearch={onSearch}
        placeholder={searchPlaceholder}
      />
      <Table
        columns={finalColumns}
        dataSource={data}
        rowKey={rowKey}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      <Pagination
        current={pagination.current}
        total={pagination.total}
        pageSize={pagination.pageSize}
        onChange={onPaginationChange}
      />
    </div>
  );
}


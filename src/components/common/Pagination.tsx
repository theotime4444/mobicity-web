// Composant de pagination (wrapper autour de Pagination d'Ant Design)

import { Pagination as AntPagination } from 'antd';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';

interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showTotal?: boolean;
}

export default function Pagination({
  current,
  total,
  pageSize = DEFAULT_PAGE_SIZE,
  onChange,
  showSizeChanger = true,
  showTotal = true
}: PaginationProps) {
  const handleChange = (page: number, size: number) => {
    onChange(page, size);
  };

  return (
    <AntPagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={handleChange}
      onShowSizeChange={handleChange}
      showSizeChanger={showSizeChanger}
      pageSizeOptions={PAGE_SIZE_OPTIONS.map(String)}
      showTotal={showTotal ? (total, range) => 
        `${range[0]}-${range[1]} sur ${total} éléments` 
        : undefined
      }
      style={{ marginTop: '16px', textAlign: 'right' }}
    />
  );
}


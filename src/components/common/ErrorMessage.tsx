import { Alert, Button, Space } from 'antd';
import type { ApiError } from '../../utils/errorHandler';

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
  fullWidth?: boolean;
}

export default function ErrorMessage({ error, onRetry, fullWidth = false }: ErrorMessageProps) {
  const isServerError = error.isServerError;
  const alertType = error.isClientError ? 'error' : 'warning';

  return (
    <Alert
      title={error.message}
      type={alertType}
      description={
        isServerError && onRetry
          ? 'Une erreur serveur est survenue. Vous pouvez réessayer.'
          : undefined
      }
      action={
        isServerError && onRetry ? (
          <Space>
            <Button size="small" onClick={onRetry}>
              Réessayer
            </Button>
          </Space>
        ) : null
      }
      showIcon
      style={fullWidth ? { width: '100%' } : undefined}
    />
  );
}


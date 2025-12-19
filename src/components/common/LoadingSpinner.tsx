import { Spin } from 'antd';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  message = 'Chargement...', 
  size = 'large',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '16px',
      ...(fullScreen ? { 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      } : { padding: '40px' })
    }}>
      <Spin size={size} />
      {message && <p>{message}</p>}
    </div>
  );

  return content;
}


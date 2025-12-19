import type { TabsProps } from 'antd';
import { Flex, Tabs, Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserTable from './pages/UserTable';
import VehicleTable from './pages/VehicleTable';
import CategoryTable from './pages/CategoryTable';
import LocationTable from './pages/LocationTable';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Utilisateurs',
    children: <UserTable />,
  },
  {
    key: '2',
    label: 'Véhicules',
    children: <VehicleTable />,
  },
  {
    key: '3',
    label: 'Catégories',
    children: <CategoryTable />,
  },
  {
    key: '4',
    label: 'Emplacements',
    children: <LocationTable />,
  },
];

export default function MainPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
        <Typography.Title level={1} style={{ margin: 0 }}>
          Back-Office Mobicity
        </Typography.Title>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Déconnexion
        </Button>
      </Flex>
      <Flex justify="center" align="flex-start">
        <Tabs defaultActiveKey="1" items={items} style={{ width: '100%' }} />
      </Flex>
    </div>
  );
}
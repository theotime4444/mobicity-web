import type { TabsProps } from 'antd';
import { Flex, Tabs, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserTable from './pages/UserTable';
import VehicleTable from './pages/VehicleTable';
import CategoryTable from './pages/CategoryTable';
import LocationTable from './pages/LocationTable';
import FavoriteTable from './pages/FavoriteTable';

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
    label: 'Locations',
    children: <LocationTable />,
  },
  {
    key: '5',
    label: 'Favoris',
    children: <FavoriteTable />,
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
        <h1>Back-Office Mobicity</h1>
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
import type { TabsProps } from "antd";
import { Flex, Tabs } from "antd";
import Login from "./Login";
import UserTable from "./pages/UserTable";
import UserForm from "./pages/UserForm";

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Utilisateurs',
        children: <UserTable/>
    },
    {
        key: '2',
        label: 'Vehicule',
        children: <Login/>
    },
    {
        key: '3',
        label: 'Category',
        children: <UserForm/>
    },
    {
        key: '4',
        label: 'Location',
        children: 'future table Location'
    },
    {
        key: '5',
        label: 'Favorite',
        children: 'future table Favorite'
    },
];

export default function MainPage() {
    
    return (
        <Flex justify="center" align="flex-start">
            <Tabs
                defaultActiveKey="1"
                items={items}
            />
        </Flex>
        
    )
}
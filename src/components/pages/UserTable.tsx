import { Radio, Table, Flex, type TableColumnsType } from "antd";
import type { IUser } from "../../model/IUser";

const UserTable : React.FC = () => {
    const columns : TableColumnsType<IUser> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Prénom',
            dataIndex: 'firstname',
        },
        {
            title: 'Nom',
            dataIndex: 'lastname',
        },
        {
            title: 'Adresse mail',
            dataIndex: 'email',
        },
        {
            title: 'Mot de passe',
            dataIndex: 'password',
        },
        {
            title: 'Administrateur',
            dataIndex: 'isAdmin',
        },
    ];

    const dataSource : IUser[] = [
        {
            id: 1,
            firstname: "Admin1",
            lastname: "Admin1",
            email: "Admin1@mail.com",
            password: "root",
            isAdmin: true,
        },
        {
            id: 2,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
        {
            id: 3,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
        {
            id: 4,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
        {
            id: 5,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
        {
            id: 6,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
        {
            id: 7,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
        {
            id: 8,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdmin: false,
        },
    ];

    return (
        <Table
            rowSelection={{}}
            rowKey={'id'}
            pagination={{defaultPageSize: 5}}
            dataSource={dataSource}
            columns={columns}
        />
    );
}

export default UserTable;
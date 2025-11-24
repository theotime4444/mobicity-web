import { Radio, Table, type TableColumnsType } from "antd";
import type { IUser } from "../model/IUser";

const Tables : React.FC = () => {
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
            title: 'Email',
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
            isAdming: true,
        },
        {
            id: 2,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
        },
        {
            id: 3,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
        },
        {
            id: 4,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
        },
        {
            id: 5,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
        },
        {
            id: 6,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
        },
        {
            id: 7,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
        },
        {
            id: 8,
            firstname: "Mathias",
            lastname: "Van der Cuylen",
            email: "Mathias@mail.com",
            password: "password123",
            isAdming: false,
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

export default Tables;
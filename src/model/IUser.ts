export interface IUser {
    id: React.Key;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean
}
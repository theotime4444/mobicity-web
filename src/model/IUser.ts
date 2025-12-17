export interface IUser {
    id: React.Key;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Optionnel car pas toujours présent dans les réponses API
    isAdmin: boolean;
}
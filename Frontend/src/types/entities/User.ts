export interface User {
    email: string;
    name: string;
    lastName: string;
    phone: string | null;
    birthDate: string | null;
    preferences: string | null;
    role: string;
}

export type User = {
    id: string;
    email: string;
    name: string;
    profilePicture: string;
    password: string;
}

export type UserAuth = {
    email: string;
    password: string;
}

export type UserRegister = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    profilePicture?: string;
}


interface StoreState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

interface TokenState {
    token: string | null;
    setToken: (user: string) => void;
    clearToken: () => void;
}



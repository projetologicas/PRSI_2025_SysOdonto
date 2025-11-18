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
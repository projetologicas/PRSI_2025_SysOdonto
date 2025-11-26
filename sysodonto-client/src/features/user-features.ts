import type {StoreState, TokenState, UserAuth, UserRegister} from "../types/user";
import {z} from "zod";
import {create} from "zustand/index";

export const defaultUserAuthValues: UserAuth = {
    email: '',
    password: '',
}

export const defaultUserReqisterValues: UserRegister = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
}

export const userAuthZodSchema = z.object({
    email: z.string()
        .min(1, "O email é obrigatório")
        .email("Formato de email inválido"),
    password: z.string().nonempty("A senha é obrigatória"),
})

export const userRegisterZodSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z.string().min(1, "O email é obrigatório").email("Formato de email inválido"),
    password: z.string().min(3, "A senha deve conter no minimo 3 digitos"),
    confirmPassword: z.string().nonempty("confirme a senha para prosseguir"),
    profilePicture: z.string().optional()
})

export const useStoreLoggedUser = create<StoreState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));

export const useStoreToken = create<TokenState>((set) => ({
    token: '',
    setToken: (token) => set({ token }),
    clearToken: () => set({ token: null }),
}));
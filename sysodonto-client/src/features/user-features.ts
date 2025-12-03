import type {StoreState, TokenState, UserAuth, UserRecoverPassword, UserRegister} from "../types/user";
import {z} from "zod";
import {create} from "zustand/index";
import Cookies from 'js-cookie';

export const defaultUserAuthValues: UserAuth = {
    email: '',
    password: '',
}

export const defaultUserRecoverPassword: UserRecoverPassword = {
    password: '',
    confirmPassword: '',
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

export const userRecoverPasswordSchema = z.object({
    password: z.string().min(3, "A senha deve conter no minimo 3 digitos"),
    confirmPassword: z.string().nonempty("confirme a senha para prosseguir"),
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
    token: null,
    setToken: (token: string | null) => set({ token }),
    clearToken: () => set({ token: null }),
}));

export const clearStore = () => {
    useStoreLoggedUser.getState().clearUser();
    useStoreToken.getState().clearToken();
    Cookies.remove("jwt");
};

export const getSetUser = () => useStoreLoggedUser.getState().setUser;
export const getSetToken = () => useStoreToken.getState().setToken;

// export const userRegisterRefinedSchema = userRegisterZodSchema.refine(
//     (data) => data.password === data.confirmPassword,
//     {
//         message: "As senhas não coincidem",
//         path: ["confirmPassword"]
//     }
// );
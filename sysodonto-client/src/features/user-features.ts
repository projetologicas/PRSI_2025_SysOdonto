import type {UserAuth} from "../types/user";
import {z} from "zod";

export const defaultUserAuthValues: UserAuth = {
    email: '',
    password: '',
}

export const userAuthZodSchema = z.object({
    email: z.string()
        .min(1, "O email é obrigatório")
        .email("Formato de email inválido"),
    password: z.string().nonempty("A senha é obrigatória"),
})
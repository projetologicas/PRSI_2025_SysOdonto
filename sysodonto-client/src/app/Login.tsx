import '../index.css'
import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import {
    defaultUserAuthValues,
    userAuthZodSchema,
    useStoreLoggedUser,
    useStoreToken
} from "../features/user-features.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "primereact/button";
import {Message} from "primereact/message";
import {Link, useNavigate} from "react-router-dom";
import {IconDental, IconLogin} from "@tabler/icons-react";
import {Toast} from "primereact/toast";
import {useRef} from 'react';
import type {UserAuth} from "../types/user";
import Cookies from "js-cookie";


export function Login() {

    const {handleSubmit, register, formState: {errors}} = useForm<UserAuth>({
        defaultValues: defaultUserAuthValues,
        resolver: zodResolver(userAuthZodSchema)
    });

    const toast = useRef<Toast>(null);
    const {setUser} = useStoreLoggedUser();
    const {setToken} = useStoreToken();
    const navigate = useNavigate();


    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-10rem">
            <div className="flex mt-5 align-items-center justify-content-center">
                <IconDental size={40} stroke={2}/>
                <h1 className="text-primary font-bold m-0">SysOdonto</h1>
            </div>
            <p className="text-50 m-0">Faça login em sua conta</p>
        </div>
    )

    const footer = (
        <div className="text-center mt-3 text-500">
            Não possui uma conta? <Link to="/register" className="text-primary font-bold">Cadastre-se</Link>
        </div>
    )

    const onSubmit = (dados: UserAuth) => {
        fetch("http://localhost:8000/view/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados),
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    setUser(data.loggedUser)
                    setToken(Cookies.get("jwt") || null)
                    navigate("/home")
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: data.error || 'Erro na ação solicitada.',
                        life: 4000
                    });
                }
            })
            .catch(() => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha na comunicação com o servidor.',
                    life: 4000
                });
            });
    };

    return (

        <div className="flex  justify-content-center align-items-center min-h-screen bg-gradient w-full">
            <Toast ref={toast}/>
            <Card className="w-25rem" header={header} footer={footer}>
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <FloatLabel>
                        <InputText id="email" className="w-full" placeholder="seu@email.com" {...register('email')} />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                    {errors.email && <Message severity="error" text={errors.email.message}/>}

                    <FloatLabel className="mt-5">
                        <InputText id="password" type="password" className="w-full"
                                   placeholder="Digite sua senha" {...register('password')} />
                        <label htmlFor="password">Senha</label>
                    </FloatLabel>
                    {errors.password && <Message severity="error" text={errors.password.message}/>}


                    <Button
                        type="submit"
                        label="Entrar"
                        icon={<IconLogin size={18}/>}
                        className=" mt-5 flex align-items-center justify-content-center"
                    />


                </form>
            </Card>
        </div>

    );
}

export default Login

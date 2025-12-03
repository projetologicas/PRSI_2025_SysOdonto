import {Toast} from "primereact/toast";
import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {IconDental, IconLogin} from "@tabler/icons-react";
import {useEffect, useRef} from "react";
import {useForm} from "react-hook-form";
import type {UserRecoverPassword} from "../../types/user";
import {defaultUserRecoverPassword, userRecoverPasswordSchema} from "../../features/user-features.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLocation, useNavigate} from "react-router-dom";

export function FormRecoveryPassword() {
    const toast = useRef<Toast>(null);
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();

    const {handleSubmit, register, formState: {errors}} = useForm<UserRecoverPassword>({
        defaultValues: defaultUserRecoverPassword,
        resolver: zodResolver(userRecoverPasswordSchema)
    });


    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-10rem">
            <div className="flex mt-5 align-items-center justify-content-center">
                <IconDental size={40} stroke={2} />
                <h1 className="text-primary font-bold m-0">Recuperar Senha</h1>
            </div>
        </div>
    );

    const onSubmit = (dados: UserRecoverPassword) => {
        fetch("http://localhost:8000/view/user/recovery-password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
                password: dados.password,
                confirmPassword: dados.confirmPassword,
            })
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    navigate("/");
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

    useEffect(() => {
        if (errors.password || errors.confirmPassword) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errors.password?.message || errors.confirmPassword?.message,
                life: 4000
            });
        }
    }, [errors]);

    return (
        <div className="flex  justify-content-center align-items-center min-h-screen bg-gradient w-full">
            <Toast ref={toast}/>
            <Card className="w-25rem" header={header} >
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <FloatLabel className="mt-5">
                        <InputText id="password" type="password" className="w-full"
                                   placeholder="Digite uma nova senha" {...register("password")}  />
                        <label htmlFor="password">Nova Senha</label>
                    </FloatLabel>

                    <FloatLabel className="mt-5">
                        <InputText id="confirmPassword" type="password" className="w-full"
                                   placeholder="Digite a senha novamente" {...register("confirmPassword")} />
                        <label htmlFor="confirmPassword">Senha</label>
                    </FloatLabel>

                    <Button
                        type="submit"
                        label="Salvar"
                        icon={<IconLogin size={18}/>}
                        className=" mt-5 flex align-items-center justify-content-center"
                    />


                </form>
            </Card>
        </div>
    );
}
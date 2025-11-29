import {IconDental, IconDeviceFloppy, IconPlus, IconReplace, IconX} from "@tabler/icons-react";
import {Link, useNavigate} from "react-router-dom";
import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {Message} from "primereact/message";
import {Button} from "primereact/button";
import {useForm} from "react-hook-form";
import type {UserRegister} from "../types/user"
import {defaultUserReqisterValues, userRegisterZodSchema, useStoreLoggedUser} from "../features/user-features.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRef, useState} from "react";
import {Toast} from "primereact/toast";

export function Register() {

    const {handleSubmit, setValue, register, formState: {errors}} = useForm<UserRegister>({
        defaultValues: defaultUserReqisterValues,
        resolver: zodResolver(userRegisterZodSchema)
    });

    const toast = useRef<Toast>(null);
    const {setUser} = useStoreLoggedUser();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setValue('profilePicture', base64String);
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };


    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-7rem">
            <div className="flex mt-2 align-items-center justify-content-center">
                <IconDental size={40} stroke={2}/>
                <h1 className="text-primary font-bold m-0">SysOdonto</h1>
            </div>
            <p className="text-50 m-0">Cadastre-se na plataforma</p>
        </div>
    )

    const footer = (
        <div className="text-center mt-1 text-500">
            Ja possui cadastro? <Link to="/" className="text-primary font-bold">Entrar</Link>
        </div>
    )

    const onSubmit = (dados: UserRegister) => {

        fetch("http://localhost:8000/view/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados)
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    setUser(data.loggedUser)
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: data.message,
                        life: 3000
                    });
                    navigate("/formpacient")
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


    }

    return (

        <div className="flex justify-content-center align-items-center bg-gradient w-full">
            <Toast ref={toast}/>
            <Card className="w-8" header={header} footer={footer}>
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-column align-items-center">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="preview"
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #ccc'
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}
                            >
                                Sem imagem
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{display: 'none'}}
                            onChange={handleImageChange}
                        />


                        <div className="flex justify-content-center mt-2 gap-1">
                            <Button
                                type="button"
                                severity="success"
                                icon={!previewImage ? <IconPlus size={18}/> : <IconReplace size={18}/>}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            />
                            {previewImage && (
                                <Button
                                    type="button"
                                    icon={<IconX size={18}/>}
                                    severity="danger"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        setValue('profilePicture', '');
                                    }}
                                />
                            )}
                        </div>

                    </div>

                    <div className="flex flex-row gap-3 mt-5 align-items-center justify-content-center">
                        <FloatLabel className="w-5">
                            <InputText id="name" className="w-full"
                                       placeholder="digite seu nome" {...register('name')} />
                            <label htmlFor="name">Nome</label>
                        </FloatLabel>
                        {errors.name && <Message severity="error" text={errors.name.message}/>}


                        <FloatLabel className="w-5">
                            <InputText id="email" className="w-full "
                                       placeholder="seu@email.com" {...register('email')} />
                            <label htmlFor="email">Email</label>
                        </FloatLabel>
                        {errors.email && <Message severity="error" text={errors.email.message}/>}
                    </div>

                    <div className="flex flex-row gap-3 mt-5 align-items-center justify-content-center">
                        <FloatLabel className="w-5">
                            <InputText id="password" className="w-full" type="password"
                                       placeholder="digite a senha" {...register('password')} />
                            <label htmlFor="password">Senha</label>
                        </FloatLabel>
                        {errors.password && <Message severity="error" text={errors.password.message}/>}

                        <FloatLabel className="w-5">
                            <InputText id="confirmPassword" className="w-full " type="password"
                                       placeholder="digite a senha novamente" {...register('confirmPassword')} />
                            <label htmlFor="confirmPassword">Confirmação de Senha</label>
                        </FloatLabel>
                        {errors.confirmPassword && <Message severity="error" text={errors.confirmPassword.message}/>}
                    </div>

                    <div className="flex flex-row gap-3 mt-5 align-items-center justify-content-center">
                        <Button
                            type="submit"
                            label="Cadastrar"
                            icon={<IconDeviceFloppy size={18}/>}
                            className="w-2 mt-3 flex align-items-center justify-content-center"
                        />
                    </div>

                </form>
            </Card>
        </div>

    )
}
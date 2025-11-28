import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {IconDeviceFloppy, IconPlus, IconReplace, IconX} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputTextarea} from "primereact/inputtextarea";
import {Calendar} from "primereact/calendar";
import {useStoreToken} from "../features/user-features.ts";
import type {PatientRequest} from "../types/patient";
import {Controller, useForm} from "react-hook-form";
import {defaultPatientValues, patientZodSchema} from "../features/patient-features.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Message} from "primereact/message";
import {Toast} from "primereact/toast";
import {InputMask} from "primereact/inputmask";
import {useNavigate} from "react-router-dom";


//Implementar posteriormente os botoes de salvar e cancelar para voltar para Home
export function FormPacient() {

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();
    const {token} = useStoreToken();
    const toast = useRef<Toast>(null);


    const {handleSubmit, setValue, register, formState: {errors}, control} = useForm<PatientRequest>({
        defaultValues: defaultPatientValues,
        resolver: zodResolver(patientZodSchema)
    })


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setValue('picture', base64String);
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        if (errors.name || errors.cpf || errors.telephone) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errors.name?.message || errors.cpf?.message || errors.telephone?.message,
                life: 4000
            });
        }
    }, [errors])

    const onSubmit = (dados: PatientRequest) => {
        fetch("http://localhost:8000/view/patients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: data.message || 'Erro na ação solicitada.',
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
        <div className="flex justify-content-center align-items-center w-full"
             style={{backgroundColor: '#ccfaf7', height: '100vh'}}>
            <Toast ref={toast}/>
            <Card
                className="w-8"
            >
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-row w-full">
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
                                            setValue('picture', '');
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-column gap-1 justify-content-center align-items-center w-full">

                            <div className="flex flex-column w-full ml-5">
                                <FloatLabel className="w-full">
                                    <InputText id="name" className="w-full"
                                               placeholder="digite seu nome" {...register('name')} />
                                    <label htmlFor="name">Nome</label>
                                </FloatLabel>
                            </div>


                            <div
                                className="ml-5 mt-5 flex flex-row gap-3 align-items-center justify-content-center w-full">
                                <div className="flex flex-column w-full ">
                                    <FloatLabel className="w-full">
                                        <InputMask id="cpf" className="w-full"
                                                   mask={'999.999.999-99'} {...register('cpf')} />
                                        <label htmlFor="cpf">CPF</label>
                                    </FloatLabel>
                                </div>

                                <div className="flex flex-column w-full ml-5">
                                    <FloatLabel className="w-full">
                                        <InputMask id="telephone" keyfilter="pnum" className="w-full "
                                                   mask={'99 99999-9999'}
                                                   {...register('telephone')} />
                                        <label htmlFor="telephone">Telefone</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div
                                className="flex flex-row gap-3 ml-5 mt-5 align-items-center justify-content-center w-full">
                                <FloatLabel className="w-8">
                                    <Controller
                                        name="birthDate"
                                        control={control}
                                        render={({field}) => (
                                            <Calendar
                                                id="birthDay"
                                                className="w-full"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                    <label htmlFor="birthDay">Data de Nascimento</label>
                                </FloatLabel>
                                {errors.birthDate && <Message severity="error" text={errors.birthDate.message}/>}


                                <FloatLabel className="w-8">

                                    <Controller
                                        name="startTreatmentDate"
                                        control={control}
                                        render={({field}) => (
                                            <Calendar
                                                id="startTreatmentDate"
                                                className="w-full"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                    <label htmlFor="startTreatmentDate">Inicio do Tratamento</label>
                                </FloatLabel>
                                {errors.startTreatmentDate &&
                                    <Message severity="error" text={errors.startTreatmentDate.message}/>}

                            </div>
                        </div>
                    </div>
                    <FloatLabel className="mt-5">
                        <InputTextarea id="observations" className="w-full" {...register('observations')}/>
                        <label htmlFor="observations">Observação</label>
                    </FloatLabel>
                    {errors.observations && <Message severity="error" text={errors.observations.message}/>}

                    <div className="flex flex-row gap-3 mt-5 justify-content-end align-items-end">
                        <Button
                            type="button"
                            label="Cancelar"
                            severity="danger"
                            onClick={() => {
                                navigate("/")
                            }}
                            icon={<IconDeviceFloppy size={18}/>}
                            className="w-2 mt-3 flex align-items-center justify-content-center"
                        />
                        <Button
                            type="submit"
                            label="Salvar"
                            icon={<IconDeviceFloppy size={18}/>}
                            className="w-2 mt-3 flex align-items-center justify-content-center"
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}

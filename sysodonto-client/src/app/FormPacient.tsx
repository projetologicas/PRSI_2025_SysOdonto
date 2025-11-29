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
import {useNavigate, useParams} from "react-router-dom";

export function FormPacient() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {token} = useStoreToken();
    const toast = useRef<Toast>(null);

    const {handleSubmit, setValue, register, formState: {errors}, control, reset} = useForm<PatientRequest>({
        defaultValues: defaultPatientValues,
        resolver: zodResolver(patientZodSchema)
    });

    useEffect(() => {
        if (isEdit && token) {
            setLoading(true);
            fetch(`http://localhost:8000/view/patients/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(async res => {
                if (res.ok) {
                    const patient = await res.json();
                    reset({
                        name: patient.name || '',
                        cpf: patient.cpf || '',
                        telephone: patient.telephone || '',
                        birthDate: patient.birthDate ? new Date(patient.birthDate) : undefined,
                        startTreatmentDate: patient.startTreatmentDate ? new Date(patient.startTreatmentDate) : undefined,
                        observations: patient.observations || '',
                        picture: patient.picture || ''
                    });

                    if (patient.picture) {
                        setPreviewImage(patient.picture);
                    }
                } else {
                    throw new Error('Erro ao carregar paciente');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar paciente:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do paciente.',
                    life: 4000
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id, token, reset]);

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
    }, [errors]);

    const onSubmit = (dados: PatientRequest) => {
        setLoading(true);

        const url = isEdit
            ? `http://localhost:8000/view/patients/update/${id}`
            : "http://localhost:8000/view/patients";

        const method = isEdit ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Erro na ação solicitada.');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: isEdit ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!',
                life: 4000
            });

            setTimeout(() => {
                navigate("/patients");
            }, 1500);
        })
        .catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.message || 'Falha na comunicação com o servidor.',
                life: 4000
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const header = (
        <div className="flex align-items-center justify-content-center">
            <h2 className="text-2xl font-bold text-900 m-0">
                {isEdit ? 'Editar Paciente' : 'Cadastrar Paciente'}
            </h2>
        </div>
    );

    return (
        <div className="flex justify-content-center align-items-center w-full"
             style={{backgroundColor: '#ccfaf7', minHeight: '100vh', padding: '2rem 0'}}>
            <Toast ref={toast}/>
            <Card className="w-10 lg:w-6" header={header}>
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-column md:flex-row w-full gap-5">
                        <div className="flex flex-column align-items-center w-full md:w-4">
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
                                    disabled={loading}
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
                                        disabled={loading}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-column gap-3 w-full md:w-8">
                            <div className="flex flex-column">
                                <FloatLabel>
                                    <InputText
                                        id="name"
                                        className="w-full"
                                        placeholder="Digite o nome"
                                        {...register('name')}
                                        disabled={loading}
                                    />
                                    <label htmlFor="name">Nome</label>
                                </FloatLabel>
                                {errors.name && <Message severity="error" text={errors.name.message} className="mt-1"/>}
                            </div>

                            <div className="flex flex-column md:flex-row gap-3">
                                <div className="flex flex-column w-full">
                                    <FloatLabel>
                                        <InputMask
                                            id="cpf"
                                            className="w-full"
                                            mask={'999.999.999-99'}
                                            {...register('cpf')}
                                            disabled={loading}
                                        />
                                        <label htmlFor="cpf">CPF</label>
                                    </FloatLabel>
                                    {errors.cpf && <Message severity="error" text={errors.cpf.message} className="mt-1"/>}
                                </div>

                                <div className="flex flex-column w-full">
                                    <FloatLabel>
                                        <InputMask
                                            id="telephone"
                                            keyfilter="pnum"
                                            className="w-full"
                                            mask={'99 99999-9999'}
                                            {...register('telephone')}
                                            disabled={loading}
                                        />
                                        <label htmlFor="telephone">Telefone</label>
                                    </FloatLabel>
                                    {errors.telephone && <Message severity="error" text={errors.telephone.message} className="mt-1"/>}
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row gap-3">
                                <div className="flex flex-column w-full">
                                    <FloatLabel>
                                        <Controller
                                            name="birthDate"
                                            control={control}
                                            render={({field}) => (
                                                <Calendar
                                                    id="birthDate"
                                                    className="w-full"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    dateFormat="dd/mm/yy"
                                                    showIcon
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                        <label htmlFor="birthDate">Data de Nascimento</label>
                                    </FloatLabel>
                                    {errors.birthDate && <Message severity="error" text={errors.birthDate.message} className="mt-1"/>}
                                </div>

                                <div className="flex flex-column w-full">
                                    <FloatLabel>
                                        <Controller
                                            name="startTreatmentDate"
                                            control={control}
                                            render={({field}) => (
                                                <Calendar
                                                    id="startTreatmentDate"
                                                    className="w-full"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    dateFormat="dd/mm/yy"
                                                    showIcon
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                        <label htmlFor="startTreatmentDate">Início do Tratamento</label>
                                    </FloatLabel>
                                    {errors.startTreatmentDate && <Message severity="error" text={errors.startTreatmentDate.message} className="mt-1"/>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-column mt-4">
                        <FloatLabel>
                            <InputTextarea
                                id="observations"
                                className="w-full"
                                rows={4}
                                {...register('observations')}
                                disabled={loading}
                                placeholder="Digite observações sobre o paciente"
                            />
                            <label htmlFor="observations">Observações</label>
                        </FloatLabel>
                        {errors.observations && <Message severity="error" text={errors.observations.message} className="mt-1"/>}
                    </div>

                    <div className="flex flex-row gap-3 mt-5 justify-content-end">
                        <Button
                            type="button"
                            label="Cancelar"
                            severity="secondary"
                            onClick={() => navigate("/patients")}
                            icon={<IconDeviceFloppy size={18}/>}
                            className="w-3"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label={isEdit ? "Atualizar" : "Salvar"}
                            icon={<IconDeviceFloppy size={18}/>}
                            className="w-3"
                            loading={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}
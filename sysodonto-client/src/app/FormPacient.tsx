import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {IconDeviceFloppy, IconPlus, IconReplace, IconX, IconArrowLeft} from "@tabler/icons-react";
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
        <div className="flex align-items-center justify-content-between">
            <Button
                icon={<IconArrowLeft size={20} />}
                severity="secondary"
                rounded
                text
                tooltip="Voltar para Pacientes"
                tooltipOptions={{ position: 'top' }}
                onClick={() => navigate("/patients")}
            />
            <h2 className="text-2xl font-bold text-900 m-0">
                {isEdit ? 'Editar Paciente' : 'Cadastrar Paciente'}
            </h2>
            <div style={{width: '40px'}}></div>
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
                                <label htmlFor="name" className="font-bold block mb-2">
                                    Nome *
                                </label>
                                <InputText
                                    id="name"
                                    className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                    placeholder="Digite o nome completo"
                                    {...register('name')}
                                    disabled={loading}
                                />
                                {errors.name && <small className="p-error mt-1">{errors.name.message}</small>}
                            </div>

                            <div className="flex flex-column md:flex-row gap-3">
                                <div className="flex flex-column w-full">
                                    <label htmlFor="cpf" className="font-bold block mb-2">
                                        CPF *
                                    </label>
                                    <InputMask
                                        id="cpf"
                                        className={`w-full ${errors.cpf ? 'p-invalid' : ''}`}
                                        mask={'999.999.999-99'}
                                        {...register('cpf')}
                                        disabled={loading}
                                        placeholder="000.000.000-00"
                                    />
                                    {errors.cpf && <small className="p-error mt-1">{errors.cpf.message}</small>}
                                </div>

                                <div className="flex flex-column w-full">
                                    <label htmlFor="telephone" className="font-bold block mb-2">
                                        Telefone *
                                    </label>
                                    <InputMask
                                        id="telephone"
                                        className={`w-full ${errors.telephone ? 'p-invalid' : ''}`}
                                        mask={'99 99999-9999'}
                                        {...register('telephone')}
                                        disabled={loading}
                                        placeholder="11 99999-9999"
                                    />
                                    {errors.telephone && <small className="p-error mt-1">{errors.telephone.message}</small>}
                                </div>
                            </div>

                            <div className="flex flex-column md:flex-row gap-3">
                                <div className="flex flex-column w-full">
                                    <label htmlFor="birthDate" className="font-bold block mb-2">
                                        Data de Nascimento
                                    </label>
                                    <Controller
                                        name="birthDate"
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <>
                                                <Calendar
                                                    id="birthDate"
                                                    className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    dateFormat="dd/mm/yy"
                                                    showIcon
                                                    disabled={loading}
                                                    placeholder="Selecione a data"
                                                />
                                                {fieldState.error && <small className="p-error mt-1">{fieldState.error.message}</small>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-column w-full">
                                    <label htmlFor="startTreatmentDate" className="font-bold block mb-2">
                                        Início do Tratamento
                                    </label>
                                    <Controller
                                        name="startTreatmentDate"
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <>
                                                <Calendar
                                                    id="startTreatmentDate"
                                                    className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    dateFormat="dd/mm/yy"
                                                    showIcon
                                                    disabled={loading}
                                                    placeholder="Selecione a data"
                                                />
                                                {fieldState.error && <small className="p-error mt-1">{fieldState.error.message}</small>}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-column mt-4">
                        <label htmlFor="observations" className="font-bold block mb-2">
                            Observações
                        </label>
                        <InputTextarea
                            id="observations"
                            className={`w-full ${errors.observations ? 'p-invalid' : ''}`}
                            rows={4}
                            {...register('observations')}
                            disabled={loading}
                            placeholder="Digite observações sobre o paciente"
                        />
                        {errors.observations && <small className="p-error mt-1">{errors.observations.message}</small>}
                    </div>

                    <div className="flex flex-row gap-3 mt-5 justify-content-end">
                        <Button
                            type="button"
                            label="Cancelar"
                            severity="secondary"
                            onClick={() => navigate("/patients")}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label={isEdit ? "Atualizar" : "Salvar"}
                            icon={<IconDeviceFloppy size={18}/>}
                            loading={loading}
                            disabled={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}
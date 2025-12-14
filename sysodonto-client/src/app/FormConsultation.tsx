import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {IconDental, IconDeviceFloppy, IconArrowLeft, IconHome} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import {useStoreToken} from "../features/user-features.ts";
import type {Patient} from "../types/patient";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Toast} from "primereact/toast";
import {Dropdown} from "primereact/dropdown";
import type {ConsultationRequest} from "../types/consultation";
import {consultationZodSchema, defaultConsultationValues} from "../features/consultation-features.ts";
import {Calendar} from "primereact/calendar";
import {useNavigate, useParams, useLocation} from "react-router-dom";

export function FormConsultation() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const location = useLocation();
    const {token} = useStoreToken();
    const toast = useRef<Toast>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [consultationPatientId, setConsultationPatientId] = useState<string | null>(null);

    const fromHome = location.state?.fromHome || false;

    const {handleSubmit, register, formState: {errors}, control, reset, watch} = useForm<ConsultationRequest>({
        defaultValues: defaultConsultationValues,
        resolver: zodResolver(consultationZodSchema)
    });

    const selectedPatient = watch("patient");

    useEffect(() => {
        console.log("Selected patient:", selectedPatient);
    }, [selectedPatient]);

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (isEdit && token && patients.length > 0 && !initialLoadDone) {
            loadConsultationForEdit();
        }
    }, [isEdit, token, patients, initialLoadDone]);

    const loadPatients = () => {
        setLoading(true);
        fetch("http://localhost:8000/view/patients", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json();
            setPatients(data.patients || []);
        })
        .catch(error => {
            console.error('Erro ao carregar pacientes:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar pacientes.',
                life: 4000
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const loadConsultationForEdit = () => {
        setLoading(true);
        fetch(`http://localhost:8000/view/consultations/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Erro ao carregar consulta');
            }
            const consultation = await res.json();
            console.log("Consulta carregada:", consultation);
            console.log("Patient ID da consulta:", consultation.patientId);

            setConsultationPatientId(consultation.patientId);

            const patientObj = patients.find(p => p.id === consultation.patientId);
            console.log("Paciente encontrado:", patientObj);

            const dateTimeValue = consultation.dateTime ? new Date(consultation.dateTime) : new Date();

            reset({
                patient: patientObj || null,
                dateTime: dateTimeValue,
                observations: consultation.observations || ''
            });

            setInitialLoadDone(true);
        })
        .catch(error => {
            console.error('Erro ao carregar consulta:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar dados da consulta.',
                life: 4000
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const onSubmit = (dados: ConsultationRequest) => {
        setLoading(true);

        const url = isEdit
            ? `http://localhost:8000/view/consultations/update/${id}`
            : "http://localhost:8000/view/consultations";

        const method = isEdit ? "PUT" : "POST";

        const requestBody = {
            patientId: dados.patient?.id,
            patientName: dados.patient?.name,
            dateTime: dados.dateTime.toISOString(),
            observations: dados.observations
        };

        console.log("Enviando dados:", requestBody);

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody),
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || data.error || 'Erro na ação solicitada.');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: isEdit ? 'Consulta atualizada com sucesso!' : 'Consulta cadastrada com sucesso!',
                life: 4000
            });

            setTimeout(() => {
                navigate(fromHome ? "/home" : "/consultations");
            }, 1500);
        })
        .catch((error) => {
            console.error('Erro:', error);
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

    useEffect(() => {
        if (errors.patient || errors.dateTime) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errors.patient?.message || errors.dateTime?.message || 'Campos obrigatórios não preenchidos',
                life: 4000
            });
        }
    }, [errors]);

    const handleBack = () => {
        if (fromHome) {
            navigate("/home");
        } else {
            navigate("/consultations");
        }
    };

    const backTooltip = fromHome ? "Voltar para Home" : "Voltar para Consultas";

    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-8rem">
            <div className="flex align-items-center justify-content-between mb-3">
                <Button
                    icon={fromHome ? <IconHome size={20} /> : <IconArrowLeft size={20} />}
                    severity="secondary"
                    rounded
                    text
                    tooltip={backTooltip}
                    tooltipOptions={{ position: 'top' }}
                    onClick={handleBack}
                />
                <div className="flex align-items-center justify-content-center gap-2">
                    <IconDental size={30} stroke={2}/>
                    <h1 className="text-primary font-bold m-0">
                        {isEdit ? 'Editar Consulta' : 'Cadastro de Consulta'}
                    </h1>
                </div>
                <div style={{width: '40px'}}></div>
            </div>
        </div>
    );

    return (
        <div className="flex justify-content-center align-items-center w-full"
             style={{backgroundColor: '#ccfaf7', minHeight: '100vh'}}>
            <Toast ref={toast}/>
            <Card
                className="w-8"
                header={header}
            >
                <form className="flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-column md:flex-row gap-3 w-full mb-4">
                        <div className="flex-1">
                            <label htmlFor="patient" className="font-bold block mb-2">
                                Paciente *
                            </label>
                            <Controller
                                name="patient"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Dropdown
                                            id="patient"
                                            options={patients}
                                            value={field.value}
                                            optionLabel="name"
                                            filter
                                            className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                            onChange={(e) => field.onChange(e.value)}
                                            disabled={loading}
                                            placeholder="Selecione um paciente"
                                            filterPlaceholder="Buscar paciente..."
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="dateTime" className="font-bold block mb-2">
                                Data e Hora *
                            </label>
                            <Controller
                                name="dateTime"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Calendar
                                            id="dateTime"
                                            className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                            showTime
                                            hourFormat='24'
                                            dateFormat="dd/mm/yy"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            disabled={loading}
                                            placeholder="Selecione data e hora"
                                            showIcon
                                        />
                                        {fieldState.error && (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="observations" className="font-bold block mb-2">
                            Observações
                        </label>
                        <div className="relative">
                            <InputTextarea
                                id="observations"
                                className="w-full h-15rem"
                                {...register('observations')}
                                disabled={loading}
                                placeholder="Digite as observações da consulta"
                                style={{minHeight: '120px'}}
                            />
                        </div>
                        {errors.observations && (
                            <small className="p-error">{errors.observations.message}</small>
                        )}
                    </div>

                    <div className="flex flex-row gap-3 mt-5 justify-content-end">
                        <Button
                            type="button"
                            label="Cancelar"
                            severity="secondary"
                            onClick={handleBack}
                            className="w-3"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label={isEdit ? "Atualizar" : "Salvar"}
                            icon={<IconDeviceFloppy size={18}/>}
                            className="w-3"
                            loading={loading}
                            disabled={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}
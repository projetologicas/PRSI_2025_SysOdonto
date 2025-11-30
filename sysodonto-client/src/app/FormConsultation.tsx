import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {IconDental, IconDeviceFloppy} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {FloatLabel} from "primereact/floatlabel";
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
import {useNavigate, useParams} from "react-router-dom";

export function FormConsultation() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const {token} = useStoreToken();
    const toast = useRef<Toast>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    const {handleSubmit, register, formState: {errors}, control, reset} = useForm<ConsultationRequest>({
        defaultValues: defaultConsultationValues,
        resolver: zodResolver(consultationZodSchema)
    });

    useEffect(() => {
        loadPatients();

        if (isEdit && token) {
            loadConsultationForEdit();
        }
    }, [isEdit, token]);

    const loadPatients = () => {
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
            if (res.ok) {
                const consultation = await res.json();
                const patient = patients.find(p => p.id === consultation.patientId);

                reset({
                    patient: patient || null,
                    dateTime: consultation.dateTime ? new Date(consultation.dateTime) : new Date(),
                    observations: consultation.observations || ''
                });
            } else {
                throw new Error('Erro ao carregar consulta');
            }
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

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                patientId: dados.patient.id,
                patientName: dados.patient.name,
                dateTime: dados.dateTime.toISOString(),
                observations: dados.observations
            }),
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
                navigate("/consultations");
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

    useEffect(() => {
        if (errors.patient || errors.dateTime) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errors.dateTime?.message || 'Paciente é obrigatório',
                life: 4000
            });
        }
    }, [errors]);

    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-8rem">
            <div className="flex mt-5 align-items-center justify-content-center">
                <IconDental size={40} stroke={2}/>
                <h1 className="text-primary font-bold m-0">
                    {isEdit ? 'Editar Consulta' : 'Cadastro de Consulta'}
                </h1>
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
                    <div className="flex flex-row w-full">
                        <div className="flex flex-row gap-1 justify-content-center align-items-center w-full">
                            <div className="card flex justify-content-center w-full">
                                <FloatLabel className="w-full">
                                    <Controller
                                        name="patient"
                                        control={control}
                                        render={({field}) => (
                                            <Dropdown
                                                options={patients}
                                                value={field.value}
                                                optionLabel="name"
                                                filter
                                                className="w-full"
                                                onChange={(e) => field.onChange(e.value)}
                                                disabled={loading}
                                                placeholder="Selecione um paciente"
                                            />
                                        )}
                                    />
                                    <label htmlFor="patient">Paciente</label>
                                </FloatLabel>
                            </div>

                            <div className="card flex justify-content-center w-full">
                                <FloatLabel className="w-full">
                                    <Controller
                                        name="dateTime"
                                        control={control}
                                        render={({field}) => (
                                            <Calendar
                                                id="dateTime"
                                                className="w-full"
                                                showTime
                                                hourFormat='24'
                                                dateFormat="dd/mm/yy"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                disabled={loading}
                                            />
                                        )}
                                    />
                                    <label htmlFor="dateTime">Data e Hora</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                    <FloatLabel className="mt-5">
                        <InputTextarea
                            id="observations"
                            className="w-full h-20rem"
                            {...register('observations')}
                            disabled={loading}
                            placeholder="Digite as observações da consulta"
                        />
                        <label htmlFor="observations">Observações</label>
                    </FloatLabel>

                    <div className="flex flex-row gap-3 mt-5 justify-content-end align-items-end">
                        <Button
                            type="button"
                            label="Cancelar"
                            severity="secondary"
                            icon={<IconDeviceFloppy size={18}/>}
                            onClick={() => navigate("/consultations")}
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
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
import {useMountEffect} from "primereact/hooks";
import {Dropdown} from "primereact/dropdown";
import type {ConsultationRequest} from "../types/consultation";
import {consultationZodSchema, defaultConsultationValues} from "../features/consultation-features.ts";
import {Calendar} from "primereact/calendar";
import {useNavigate} from "react-router-dom";

//Implementar posteriormente os botoes de salvar e cancelar para voltar para Home
export function FormConsultation() {

    const navigate = useNavigate();
    const {token} = useStoreToken();
    const toast = useRef<Toast>(null);
    const [patients, setPatient] = useState<Patient[]>([]);

    const {handleSubmit, register, formState: {errors}, control} = useForm<ConsultationRequest>({
        defaultValues: defaultConsultationValues,
        resolver: zodResolver(consultationZodSchema)
    })


    const handlePatients = () => {
        fetch("http://localhost:8000/view/patients", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(async res => {
                const data = await res.json();
                setPatient(data.patients)
            })
    }

    useMountEffect(
        handlePatients,
    )


    const onSubmit = (dados: ConsultationRequest) => {

        fetch("http://localhost:8000/view/consultations", {
            method: "POST",
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

    useEffect(() => {
        if (errors.patient || errors.dateTime) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errors.dateTime?.message || 'Paciente é obrigatório',
                life: 4000
            });
        }
    }, [errors])

    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-8rem">
            <div className="flex mt-5 align-items-center justify-content-center">
                <IconDental size={40} stroke={2}/>
                <h1 className="text-primary font-bold m-0">Cadastro de Consulta</h1>
            </div>
        </div>
    )

    return (
        <div className="flex justify-content-center align-items-center w-full"
             style={{backgroundColor: '#ccfaf7', height: '100vh'}}>
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
                                                optionLabel="name" filter
                                                className="w-full"
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                    <label htmlFor="patient">Selecione o Paciente</label>
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
                                            />
                                        )}
                                    />
                                    <label htmlFor="dateTime">Inicio do Tratamento</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <FloatLabel className="mt-5">
                        <InputTextarea id="observations" className="w-full h-20rem" {...register('observations')}/>
                        <label htmlFor="observations">Observação</label>
                    </FloatLabel>

                    <div className="flex flex-row gap-3 mt-5 justify-content-end align-items-end">
                        <Button
                            type="button"
                            label="Cancelar"
                            severity="danger"
                            icon={<IconDeviceFloppy size={18}/>}
                            onClick={() => {
                                navigate("/")
                            }}
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

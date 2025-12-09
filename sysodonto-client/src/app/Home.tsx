import {useEffect, useRef, useState} from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {IconArrowRight, IconCalendar, IconClock, IconUsers} from "@tabler/icons-react";
import {useStoreToken} from "../features/user-features.ts";
import {useNavigate} from "react-router-dom";
import type {Consultation} from "../types/consultation";
import type {User} from "../types/user";

interface HomeStats {
    totalPatients: number;
    totalConsultations: number;
    todayConsultations: number;
}

export function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<HomeStats>({
        totalPatients: 0,
        totalConsultations: 0,
        todayConsultations: 0
    });
    const [todayConsultations, setTodayConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const {token} = useStoreToken();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    console.warn(token)

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        setLoading(true);
        try {
            const userRes = await fetch("http://localhost:8000/view/user/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }

            const statsRes = await fetch("http://localhost:8000/view/home/stats", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            const todayRes = await fetch("http://localhost:8000/view/home/consultations/today", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (todayRes.ok) {
                const todayData = await todayRes.json();
                setTodayConsultations(todayData.consultations || []);
            }

        } catch (error) {
            console.error('Erro ao carregar dados da home:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar dados da página inicial.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateTime: Date | string | undefined) => {
        if (!dateTime) return '-';
        const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        return dateObj.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateTime: Date | string | undefined) => {
        if (!dateTime) return '-';
        const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        return dateObj.toLocaleDateString('pt-BR');
    };

    const goToConsultations = () => {
        navigate("/consultations");
    };

    const goToPatients = () => {
        navigate("/patients");
    };

    const editConsultation = (consultation: Consultation) => {
        navigate(`/consultations/update/${consultation.id}`, {
            state: { fromHome: true }
        });
    };

    const actionBodyTemplate = (rowData: Consultation) => {
        return (
            <Button
                icon={<IconArrowRight size={16}/>}
                severity="info"
                rounded
                text
                tooltip="Ver consulta"
                tooltipOptions={{position: 'top'}}
                onClick={() => editConsultation(rowData)}
            />
        );
    };

    return (
        <div className="flex justify-content-center w-full p-4"
             style={{backgroundColor: '#ccfaf7', minHeight: '100vh'}}>
            <Toast ref={toast}/>

            <div className="w-full lg:w-11">
                <Card className="mb-4">
                    <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between">
                        <div className="flex align-items-center gap-3">
                            <div
                                className="cursor-pointer"
                                onClick={() => navigate("/profile")}
                                style={{cursor: 'pointer'}}
                                title="Ver perfil"
                            >
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="border-circle"
                                        style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                    />
                                ) : (
                                    <div
                                        className="border-circle flex align-items-center justify-content-center"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            backgroundColor: '#e0e0e0',
                                            color: '#666'
                                        }}
                                    >
                                        <IconUsers size={32}/>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-900 m-0">Olá, {user?.name || 'Usuário'}</h1>
                                <p className="text-600 m-0 mt-1">Bem-vindo(a) ao seu painel odontológico</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                            <Button
                                label="Consultas"
                                icon={<IconCalendar size={18}/>}
                                severity="info"
                                className="p-button-outlined"
                                onClick={goToConsultations}
                            />
                            <Button
                                label="Pacientes"
                                icon={<IconUsers size={18}/>}
                                severity="success"
                                className="p-button-outlined"
                                onClick={goToPatients}
                            />
                        </div>
                    </div>
                </Card>

                <div className="grid mb-4">
                    <div className="col-12 md:col-4">
                        <Card className="h-full">
                            <div className="flex flex-column align-items-center text-center">
                                <div className="p-3 border-circle mb-2" style={{backgroundColor: '#e3f2fd'}}>
                                    <IconUsers size={24} color="#1976d2"/>
                                </div>
                                <h2 className="text-5xl font-bold text-900 m-0">{stats.totalPatients}</h2>
                                <p className="text-600 m-0">Pacientes</p>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card className="h-full">
                            <div className="flex flex-column align-items-center text-center">
                                <div className="p-3 border-circle mb-2" style={{backgroundColor: '#e8f5e9'}}>
                                    <IconCalendar size={24} color="#388e3c"/>
                                </div>
                                <h2 className="text-5xl font-bold text-900 m-0">{stats.totalConsultations}</h2>
                                <p className="text-600 m-0">Consultas</p>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card className="h-full">
                            <div className="flex flex-column align-items-center text-center">
                                <div className="p-3 border-circle mb-2" style={{backgroundColor: '#fff3e0'}}>
                                    <IconClock size={24} color="#f57c00"/>
                                </div>
                                <h2 className="text-5xl font-bold text-900 m-0">{stats.todayConsultations}</h2>
                                <p className="text-600 m-0">Consultas Hoje</p>
                            </div>
                        </Card>
                    </div>
                </div>

                <Card>
                    <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <h2 className="text-2xl font-bold text-900 m-0">Você tem {stats.todayConsultations} consultas
                            hoje</h2>
                        <Button
                            label="Ver todas as consultas"
                            icon={<IconCalendar size={18}/>}
                            severity="secondary"
                            className="p-button-outlined"
                            onClick={goToConsultations}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center p-4">
                            <i className="pi pi-spin pi-spinner text-4xl"></i>
                            <p className="mt-2">Carregando consultas...</p>
                        </div>
                    ) : todayConsultations.length > 0 ? (
                        <DataTable
                            value={todayConsultations}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} consultas"
                            emptyMessage="Nenhuma consulta agendada para hoje."
                        >
                            <Column
                                field="patientName"
                                header="Paciente"
                                sortable
                                style={{minWidth: '200px'}}
                            />
                            <Column
                                field="dateTime"
                                header="Data"
                                body={(rowData) => formatDate(rowData.dateTime)}
                                style={{minWidth: '120px'}}
                            />
                            <Column
                                field="dateTime"
                                header="Horário"
                                body={(rowData) => formatTime(rowData.dateTime)}
                                style={{minWidth: '100px'}}
                            />
                            <Column
                                field="observations"
                                header="Observações"
                                body={(rowData) => rowData.observations || '-'}
                                style={{minWidth: '200px'}}
                            />
                            <Column
                                body={actionBodyTemplate}
                                header="Ações"
                                style={{minWidth: '80px', width: '80px'}}
                                bodyStyle={{textAlign: 'center'}}
                            />
                        </DataTable>
                    ) : (
                        <div className="text-center p-6 border-1 border-round" style={{backgroundColor: '#f8f9fa'}}>
                            <IconCalendar size={48} className="text-400 mb-3"/>
                            <h3 className="text-900 font-medium mb-1">Nenhuma consulta hoje</h3>
                            <p className="text-600 mb-4">Você não tem consultas agendadas para hoje.</p>
                            <Button
                                label="Agendar nova consulta"
                                icon={<IconCalendar size={18}/>}
                                severity="success"
                                onClick={() => navigate("/consultations/new")}
                            />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
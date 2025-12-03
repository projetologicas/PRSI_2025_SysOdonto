import {useEffect, useRef, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {IconEdit, IconFilter, IconHome, IconPlus, IconSearch, IconX} from "@tabler/icons-react";
import {useStoreToken} from "../features/user-features.ts";
import {useNavigate} from "react-router-dom";
import type {Consultation} from "../types/consultation";

interface FilterConsultation {
  patientName?: string;
  patientCpf?: string;
  patientPhone?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
}

export function ConsultationList() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filter, setFilter] = useState<FilterConsultation>({});
    const { token } = useStoreToken();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadConsultations();
    }, []);

    const loadConsultations = () => {
        setLoading(true);
        fetch("http://localhost:8000/view/consultations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Erro ao carregar consultas');
            }
            const data = await res.json();
            setConsultations(data.consultations || []);
        })
        .catch((error) => {
            console.error('Erro:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar lista de consultas.',
                life: 4000
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleFilter = () => {
        setLoading(true);

        const filterData = {
            patientName: filter.patientName || null,
            patientCpf: filter.patientCpf || null,
            patientPhone: filter.patientPhone || null,
            startDate: filter.startDate ? new Date(filter.startDate.setHours(0, 0, 0, 0)) : null,
            endDate: filter.endDate ? new Date(filter.endDate.setHours(23, 59, 59, 999)) : null,
            startTime: filter.startTime || null,
            endTime: filter.endTime || null
        };

        Object.keys(filterData).forEach(key => {
            if (filterData[key] === null || filterData[key] === '') {
                delete filterData[key];
            }
        });


        fetch("http://localhost:8000/view/consultations/filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(filterData)
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erro ao filtrar consultas: ${errorText}`);
            }
            const data = await res.json();
            setConsultations(data.consultations || []);
            setFilterVisible(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Filtro Aplicado',
                detail: `Encontradas ${data.consultations?.length || 0} consultas.`,
                life: 3000
            });
        })
        .catch((error) => {
            console.error('Erro:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao aplicar filtros.',
                life: 4000
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const clearFilters = () => {
        setFilter({});
        loadConsultations();
        setFilterVisible(false);
        toast.current?.show({
            severity: 'info',
            summary: 'Filtros Limpos',
            detail: 'Todos os filtros foram removidos.',
            life: 3000
        });
    };

    const formatDateTime = (dateTime: Date | string | undefined) => {
        if (!dateTime) return '-';
        const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        return dateObj.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text: string, maxLength: number = 30) => {
        if (!text) return '-';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const editConsultation = (consultation: Consultation) => {
        navigate(`/consultations/update/${consultation.id}`);
    };

    const goToHome = () => {
        navigate("/home");
    };

    const actionBodyTemplate = (rowData: Consultation) => {
        return (
            <Button
                icon={<IconEdit size={18} />}
                severity="info"
                rounded
                text
                tooltip="Editar consulta"
                tooltipOptions={{ position: 'top' }}
                onClick={() => editConsultation(rowData)}
            />
        );
    };

    const patientNameBodyTemplate = (rowData: Consultation) => {
        return (
            <span title={rowData.patientName}>
                {truncateText(rowData.patientName ?? '')}
            </span>
        );
    };

    const observationsBodyTemplate = (rowData: Consultation) => {
        return (
            <span title={rowData.observations}>
                {truncateText(rowData.observations ?? '', 50)}
            </span>
        );
    };

    const filterFooter = (
        <div className="flex justify-content-between gap-2 w-full">
            <Button
                label="Limpar"
                icon={<IconX size={18} />}
                severity="danger"
                onClick={clearFilters}
            />
            <div className="flex gap-2">
                <Button
                    label="Cancelar"
                    severity="secondary"
                    onClick={() => setFilterVisible(false)}
                />
                <Button
                    label="Aplicar"
                    icon={<IconSearch size={18} />}
                    onClick={handleFilter}
                />
            </div>
        </div>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
            <div className="flex align-items-center gap-3">
                <Button
                    icon={<IconHome size={40} />}
                    severity="secondary"
                    rounded
                    text
                    tooltip="Voltar para Home"
                    tooltipOptions={{ position: 'top' }}
                    onClick={goToHome}
                />
                <h2 className="text-2xl font-bold text-900 m-0">Minhas Consultas</h2>
            </div>
            <div className="flex gap-2">
                <Button
                    label="Filtrar"
                    icon={<IconFilter size={18} />}
                    severity="secondary"
                    className="p-button-outlined"
                    onClick={() => setFilterVisible(true)}
                />
                <Button
                    label="Nova Consulta"
                    icon={<IconPlus size={18} />}
                    severity="success"
                    onClick={() => navigate("/consultations/new")}
                />
            </div>
        </div>
    );

    return (
        <div className="flex justify-content-center w-full p-4" style={{ backgroundColor: '#ccfaf7', minHeight: '100vh' }}>
            <Toast ref={toast} />

            <Dialog
                header="Filtrar Consultas"
                visible={filterVisible}
                style={{ width: '500px' }}
                footer={filterFooter}
                onHide={() => setFilterVisible(false)}
            >
                <div className="flex flex-column gap-3 mt-3">
                    <div className="field">
                        <label htmlFor="patientName" className="font-bold block mb-2">
                            Nome do Paciente
                        </label>
                        <InputText
                            id="patientName"
                            value={filter.patientName || ''}
                            onChange={(e) => setFilter({...filter, patientName: e.target.value})}
                            placeholder="Digite o nome do paciente..."
                            className="w-full"
                        />
                    </div>

                    <div className="grid">
                        <div className="col-6">
                            <div className="field">
                                <label htmlFor="startDate" className="font-bold block mb-2">
                                    Data Inicial
                                </label>
                                <Calendar
                                    id="startDate"
                                    value={filter.startDate || null}
                                    onChange={(e) => setFilter({...filter, startDate: e.value as Date})}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="field">
                                <label htmlFor="endDate" className="font-bold block mb-2">
                                    Data Final
                                </label>
                                <Calendar
                                    id="endDate"
                                    value={filter.endDate || null}
                                    onChange={(e) => setFilter({...filter, endDate: e.value as Date})}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-6">
                            <div className="field">
                                <label htmlFor="startTime" className="font-bold block mb-2">
                                    Horário Inicial
                                </label>
                                <Calendar
                                    id="startTime"
                                    value={filter.startTime || null}
                                    onChange={(e) => setFilter({...filter, startTime: e.value as Date})}
                                    timeOnly
                                    showIcon
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="field">
                                <label htmlFor="endTime" className="font-bold block mb-2">
                                    Horário Final
                                </label>
                                <Calendar
                                    id="endTime"
                                    value={filter.endTime || null}
                                    onChange={(e) => setFilter({...filter, endTime: e.value as Date})}
                                    timeOnly
                                    showIcon
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Card className="w-full lg:w-11" header={header}>
                <DataTable
                    value={consultations}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} consultas"
                    emptyMessage="Nenhuma consulta encontrada."
                    resizableColumns
                    columnResizeMode="expand"
                    showGridlines
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <Column
                        field="patientName"
                        header="Paciente"
                        sortable
                        body={patientNameBodyTemplate}
                        style={{ minWidth: '200px', maxWidth: '250px' }}
                    />
                    <Column
                        field="dateTime"
                        header="Data e Hora"
                        sortable
                        body={(rowData) => formatDateTime(rowData.dateTime)}
                        style={{ minWidth: '180px', maxWidth: '200px' }}
                    />
                    <Column
                        field="observations"
                        header="Observações"
                        body={observationsBodyTemplate}
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                    />
                    <Column
                        body={actionBodyTemplate}
                        header="Ações"
                        style={{ minWidth: '100px', maxWidth: '120px', textAlign: 'center' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
}
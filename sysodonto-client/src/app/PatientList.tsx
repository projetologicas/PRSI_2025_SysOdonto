import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { IconFilter, IconPlus, IconEdit, IconSearch, IconX, IconHome, IconDental } from "@tabler/icons-react";
import { useStoreToken } from "../features/user-features.ts";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../types/patient";

interface FilterPatient {
  name?: string;
  cpf?: string;
  telephone?: string;
  birthDate?: Date | null;
  treatmentDate?: Date | null;
}

export function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filter, setFilter] = useState<FilterPatient>({});
    const { token } = useStoreToken();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadPatients();
    }, []);

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
            if (!res.ok) {
                throw new Error('Erro ao carregar pacientes');
            }
            const data = await res.json();
            setPatients(data.patients || []);
        })
        .catch((error) => {
            console.error('Erro:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar lista de pacientes.',
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
            name: filter.name || null,
            cpf: filter.cpf ? filter.cpf.replace(/\D/g, '') : null,
            telephone: filter.telephone ? filter.telephone.replace(/\D/g, '') : null,
            birthDate: filter.birthDate || null,
            treatmentDate: filter.treatmentDate || null
        };

        Object.keys(filterData).forEach(key => {
            if (filterData[key] === null || filterData[key] === '') {
                delete filterData[key];
            }
        });

        console.log('Enviando filtro:', filterData);

        fetch("http://localhost:8000/view/patients/filter", {
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
                throw new Error(`Erro ao filtrar pacientes: ${errorText}`);
            }
            const data = await res.json();
            setPatients(data.patients || []);
            setFilterVisible(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Filtro Aplicado',
                detail: `Encontrados ${data.patients?.length || 0} pacientes.`,
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
        loadPatients();
        setFilterVisible(false);
        toast.current?.show({
            severity: 'info',
            summary: 'Filtros Limpos',
            detail: 'Todos os filtros foram removidos.',
            life: 3000
        });
    };

    const formatCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return '-';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('pt-BR');
    };

    const truncateName = (name: string, maxLength: number = 30) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    };

    const editPatient = (patient: Patient) => {
        navigate(`/patients/update/${patient.id}`);
    };

    const goToOdontograma = (patient: Patient) => {
        navigate(`/odontograma/${patient.id}`);
    };

    const goToHome = () => {
        navigate("/home");
    };

    const actionBodyTemplate = (rowData: Patient) => {
        return (
            <div className="flex gap-1 justify-content-center">
                <Button
                    icon={<IconDental size={25} />}
                    severity="help"
                    rounded
                    text
                    tooltip="Odontograma"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => goToOdontograma(rowData)}
                />
                <Button
                    icon={<IconEdit size={25} />}
                    severity="info"
                    rounded
                    text
                    tooltip="Editar paciente"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editPatient(rowData)}
                />
            </div>
        );
    };

    const nameBodyTemplate = (rowData: Patient) => {
        return (
            <span title={rowData.name}>
                {truncateName(rowData.name)}
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
                <h2 className="text-2xl font-bold text-900 m-0">Meus Pacientes</h2>
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
                    label="Novo Paciente"
                    icon={<IconPlus size={18} />}
                    severity="success"
                    onClick={() => navigate("/patients/new")}
                />
            </div>
        </div>
    );

    return (
        <div className="flex justify-content-center w-full p-4" style={{ backgroundColor: '#ccfaf7', minHeight: '100vh' }}>
            <Toast ref={toast} />

            <Dialog
                header="Filtrar Pacientes"
                visible={filterVisible}
                style={{ width: '500px' }}
                footer={filterFooter}
                onHide={() => setFilterVisible(false)}
            >
                <div className="flex flex-column gap-3 mt-3">
                    <div className="field">
                        <label htmlFor="name" className="font-bold block mb-2">
                            Nome
                        </label>
                        <InputText
                            id="name"
                            value={filter.name || ''}
                            onChange={(e) => setFilter({...filter, name: e.target.value})}
                            placeholder="Digite o nome do paciente..."
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="cpf" className="font-bold block mb-2">
                            CPF
                        </label>
                        <InputMask
                            id="cpf"
                            value={filter.cpf || ''}
                            onChange={(e) => setFilter({...filter, cpf: e.value || ''})}
                            mask="999.999.999-99"
                            placeholder="000.000.000-00"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="telephone" className="font-bold block mb-2">
                            Telefone
                        </label>
                        <InputMask
                            id="telephone"
                            value={filter.telephone || ''}
                            onChange={(e) => setFilter({...filter, telephone: e.value || ''})}
                            mask="99 99999-9999"
                            placeholder="00 00000-0000"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="birthDate" className="font-bold block mb-2">
                            Data de Nascimento
                        </label>
                        <Calendar
                            id="birthDate"
                            value={filter.birthDate || null}
                            onChange={(e) => setFilter({...filter, birthDate: e.value as Date})}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="treatmentDate" className="font-bold block mb-2">
                            Início do Tratamento
                        </label>
                        <Calendar
                            id="treatmentDate"
                            value={filter.treatmentDate || null}
                            onChange={(e) => setFilter({...filter, treatmentDate: e.value as Date})}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>

            <Card className="w-full lg:w-11" header={header}>
                <DataTable
                    value={patients}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} pacientes"
                    emptyMessage="Nenhum paciente encontrado."
                    resizableColumns
                    columnResizeMode="expand"
                    showGridlines
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <Column
                        field="name"
                        header="Nome"
                        sortable
                        body={nameBodyTemplate}
                        style={{ minWidth: '200px', maxWidth: '250px' }}
                    />
                    <Column
                        field="cpf"
                        header="CPF"
                        sortable
                        body={(rowData) => formatCPF(rowData.cpf)}
                        style={{ minWidth: '150px', maxWidth: '170px' }}
                    />
                    <Column
                        field="telephone"
                        header="Telefone"
                        body={(rowData) => rowData.telephone ? formatPhone(rowData.telephone) : '-'}
                        style={{ minWidth: '150px', maxWidth: '170px' }}
                    />
                    <Column
                        field="birthDate"
                        header="Data de Nascimento"
                        body={(rowData) => formatDate(rowData.birthDate)}
                        style={{ minWidth: '160px', maxWidth: '180px' }}
                    />
                    <Column
                        field="startTreatmentDate"
                        header="Início do Tratamento"
                        body={(rowData) => formatDate(rowData.startTreatmentDate)}
                        style={{ minWidth: '160px', maxWidth: '180px' }}
                    />
                    <Column
                        body={actionBodyTemplate}
                        header="Ações"
                        style={{ minWidth: '140px', maxWidth: '160px', textAlign: 'center' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
}
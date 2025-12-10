import { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Tooltip } from "primereact/tooltip";
import { IconArrowLeft, IconDental, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { useStoreToken } from "../features/user-features.ts";
import { useNavigate, useParams } from "react-router-dom";
import type { Patient } from "../types/patient";
import type { ToothProcedure, ToothProcedureRequest } from "../types/tooth-procedure";

// Importe a imagem diretamente (ajuste o caminho conforme necessário)
import odontogramImage from "../assets/ImagemOdontograma.png";

interface ToothInfo {
    number: number;
    name: string;
    isUpper: boolean;
}

const TOOTH_MAP: ToothInfo[] = [
    { number: 18, name: "3º Molar Superior Direito", isUpper: true },
    { number: 17, name: "2º Molar Superior Direito", isUpper: true },
    { number: 16, name: "1º Molar Superior Direito", isUpper: true },
    { number: 15, name: "2º Pré-Molar Superior Direito", isUpper: true },
    { number: 14, name: "1º Pré-Molar Superior Direito", isUpper: true },
    { number: 13, name: "Canino Superior Direito", isUpper: true },
    { number: 12, name: "Incisivo Lateral Superior Direito", isUpper: true },
    { number: 11, name: "Incisivo Central Superior Direito", isUpper: true },

    { number: 21, name: "Incisivo Central Superior Esquerdo", isUpper: true },
    { number: 22, name: "Incisivo Lateral Superior Esquerdo", isUpper: true },
    { number: 23, name: "Canino Superior Esquerdo", isUpper: true },
    { number: 24, name: "1º Pré-Molar Superior Esquerdo", isUpper: true },
    { number: 25, name: "2º Pré-Molar Superior Esquerdo", isUpper: true },
    { number: 26, name: "1º Molar Superior Esquerdo", isUpper: true },
    { number: 27, name: "2º Molar Superior Esquerdo", isUpper: true },
    { number: 28, name: "3º Molar Superior Esquerdo", isUpper: true },

    { number: 38, name: "3º Molar Inferior Direito", isUpper: false },
    { number: 37, name: "2º Molar Inferior Direito", isUpper: false },
    { number: 36, name: "1º Molar Inferior Direito", isUpper: false },
    { number: 35, name: "2º Pré-Molar Inferior Direito", isUpper: false },
    { number: 34, name: "1º Pré-Molar Inferior Direito", isUpper: false },
    { number: 33, name: "Canino Inferior Direito", isUpper: false },
    { number: 32, name: "Incisivo Lateral Inferior Direito", isUpper: false },
    { number: 31, name: "Incisivo Central Inferior Direito", isUpper: false },

    { number: 41, name: "Incisivo Central Inferior Esquerdo", isUpper: false },
    { number: 42, name: "Incisivo Lateral Inferior Esquerdo", isUpper: false },
    { number: 43, name: "Canino Inferior Esquerdo", isUpper: false },
    { number: 44, name: "1º Pré-Molar Inferior Esquerdo", isUpper: false },
    { number: 45, name: "2º Pré-Molar Inferior Esquerdo", isUpper: false },
    { number: 46, name: "1º Molar Inferior Esquerdo", isUpper: false },
    { number: 47, name: "2º Molar Inferior Esquerdo", isUpper: false },
    { number: 48, name: "3º Molar Inferior Esquerdo", isUpper: false },
];

export function Odontograma() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { token } = useStoreToken();
    const toast = useRef<Toast>(null);

    const [patient, setPatient] = useState<Patient | null>(null);
    const [procedures, setProcedures] = useState<ToothProcedure[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [editingProcedure, setEditingProcedure] = useState<ToothProcedure | null>(null);

    const [formData, setFormData] = useState<ToothProcedureRequest>({
        toothNumber: 0,
        procedureName: "",
        description: "",
        procedureDate: new Date()
    });

    useEffect(() => {
        if (patientId) {
            loadPatientAndProcedures();
        }
    }, [patientId]);

    const loadPatientAndProcedures = async () => {
        setLoading(true);
        try {
            const patientRes = await fetch(`http://localhost:8000/view/patients/${patientId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (patientRes.ok) {
                const patientData = await patientRes.json();
                setPatient(patientData);
            }

            const proceduresRes = await fetch(`http://localhost:8000/view/tooth-procedures/patient/${patientId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (proceduresRes.ok) {
                const proceduresData = await proceduresRes.json();
                setProcedures(proceduresData.procedures || []);
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar dados do odontograma.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToothClick = (toothNumber: number) => {
        setSelectedTooth(toothNumber);
        const toothProcedures = procedures.filter(p => p.toothNumber === toothNumber);

        if (toothProcedures.length > 0) {
            const lastProcedure = toothProcedures[toothProcedures.length - 1];
            setEditingProcedure(lastProcedure);
            setFormData({
                toothNumber,
                procedureName: lastProcedure.procedureName,
                description: lastProcedure.description,
                procedureDate: new Date(lastProcedure.procedureDate)
            });
        } else {
            setEditingProcedure(null);
            setFormData({
                toothNumber,
                procedureName: "",
                description: "",
                procedureDate: new Date()
            });
        }
        setDialogVisible(true);
    };

    const handleSubmit = async () => {
        if (!formData.procedureName.trim() || !formData.description.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Preencha todos os campos obrigatórios.',
                life: 4000
            });
            return;
        }

        setDialogLoading(true);
        try {
            const url = editingProcedure
                ? `http://localhost:8000/view/tooth-procedures/${editingProcedure.id}`
                : `http://localhost:8000/view/tooth-procedures/patient/${patientId}`;

            const method = editingProcedure ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: data.message,
                    life: 4000
                });

                setDialogVisible(false);
                loadPatientAndProcedures();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar procedimento');
            }
        } catch (error) {
            console.error('Erro:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.message || 'Falha ao salvar procedimento.',
                life: 4000
            });
        } finally {
            setDialogLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editingProcedure) return;

        setDialogLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/view/tooth-procedures/${editingProcedure.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Procedimento excluído com sucesso!',
                    life: 4000
                });

                setDialogVisible(false);
                loadPatientAndProcedures();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao excluir procedimento');
            }
        } catch (error) {
            console.error('Erro:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.message || 'Falha ao excluir procedimento.',
                life: 4000
            });
        } finally {
            setDialogLoading(false);
        }
    };

    const getToothProcedures = (toothNumber: number): ToothProcedure[] => {
        return procedures.filter(p => p.toothNumber === toothNumber);
    };

    const getToothColor = (toothNumber: number): string => {
        const toothProcedures = getToothProcedures(toothNumber);
        if (toothProcedures.length > 0) {
            return '#4CAF50';
        }
        return '#e0e0e0';
    };

    const getToothBorderColor = (toothNumber: number): string => {
        const toothProcedures = getToothProcedures(toothNumber);
        if (toothProcedures.length > 0) {
            return '#2E7D32';
        }
        return '#666';
    };

    const dialogFooter = (
        <div className="flex justify-content-between gap-2 w-full">
            {editingProcedure && (
                <Button
                    label="Excluir"
                    icon={<IconTrash size={18} />}
                    severity="danger"
                    onClick={handleDelete}
                    loading={dialogLoading}
                />
            )}
            <div className="flex gap-2">
                <Button
                    label="Cancelar"
                    severity="secondary"
                    onClick={() => setDialogVisible(false)}
                    disabled={dialogLoading}
                />
                <Button
                    label={editingProcedure ? "Atualizar" : "Cadastrar"}
                    icon={<IconCheck size={18} />}
                    severity="success"
                    onClick={handleSubmit}
                    loading={dialogLoading}
                />
            </div>
        </div>
    );

    const header = (
        <div className="flex flex-column lg:flex-row lg:align-items-center lg:justify-content-between gap-3">
            <div className="flex align-items-center gap-3 flex-1">
                <Button
                    icon={<IconArrowLeft size={20} />}
                    severity="secondary"
                    rounded
                    text
                    tooltip="Voltar para Pacientes"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => navigate("/patients")}
                />
                <div className="flex align-items-center gap-2">
                    <IconDental size={30} stroke={2} />
                    <h1 className="text-xl lg:text-2xl font-bold text-900 m-0">Odontograma</h1>
                </div>
            </div>

            {patient && (
                <div className="flex flex-column text-right flex-shrink-0" style={{
                    maxWidth: '400px',
                    marginRight: '1.5rem',
                    minWidth: '200px'
                }}>
                    <Tooltip target=".patient-name" />
                    <div
                        className="text-lg font-bold patient-name"
                        data-pr-tooltip={patient.name}
                        data-pr-position="left"
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%'
                        }}
                    >
                        {patient.name}
                    </div>
                    <div className="text-sm text-600" style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%'
                    }}>
                        CPF: {patient.cpf}
                    </div>
                </div>
            )}
        </div>
    );

    const renderTooth = (tooth: ToothInfo, index: number, isUpper: boolean) => {
        const toothProcedures = getToothProcedures(tooth.number);
        const hasProcedures = toothProcedures.length > 0;

        return (
            <div
                key={tooth.number}
                className="flex flex-column align-items-center"
                style={{ margin: '0 3px' }}
            >
                <div
                    className="cursor-pointer border-1 border-round"
                    style={{
                        width: '50px',
                        height: '60px',
                        backgroundColor: getToothColor(tooth.number),
                        borderColor: getToothBorderColor(tooth.number),
                        borderWidth: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        borderRadius: '5px',
                        transform: isUpper ? 'rotate(180deg)' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleToothClick(tooth.number)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = isUpper ? 'rotate(180deg) scale(1.05)' : 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = isUpper ? 'rotate(180deg)' : 'none';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    title={`Dente ${tooth.number}: ${tooth.name}\n${hasProcedures ? `${toothProcedures.length} procedimento(s)` : 'Sem procedimentos'}`}
                >
                    <span
                        className="font-bold"
                        style={{
                            fontSize: '16px',
                            color: hasProcedures ? 'white' : '#333',
                            transform: isUpper ? 'rotate(180deg)' : 'none'
                        }}
                    >
                        {tooth.number}
                    </span>

                    {hasProcedures && (
                        <div
                            className="absolute"
                            style={{
                                top: '3px',
                                right: '3px',
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#2E7D32',
                                borderRadius: '50%'
                            }}
                        />
                    )}
                </div>
                <div className="mt-1">
                    <small className="text-500 text-xs">
                        {tooth.number}
                    </small>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center w-full p-4" style={{ backgroundColor: '#ccfaf7', minHeight: '100vh' }}>
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-4xl"></i>
                    <p className="mt-2">Carregando odontograma...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-content-center w-full p-2 md:p-4" style={{ backgroundColor: '#ccfaf7', minHeight: '100vh' }}>
            <Toast ref={toast} />

            <Dialog
                header={editingProcedure ? "Editar Procedimento" : "Cadastrar Procedimento"}
                visible={dialogVisible}
                style={{ width: '90vw', maxWidth: '500px' }}
                footer={dialogFooter}
                onHide={() => setDialogVisible(false)}
            >
                <div className="flex flex-column gap-3 mt-3">
                    {selectedTooth && (
                        <div className="mb-2">
                            <label className="font-bold">Dente:</label>
                            <div className="text-lg">
                                {selectedTooth} - {TOOTH_MAP.find(t => t.number === selectedTooth)?.name}
                            </div>
                        </div>
                    )}

                    <div className="field">
                        <label htmlFor="procedureName" className="font-bold block mb-2">
                            Procedimento *
                        </label>
                        <InputText
                            id="procedureName"
                            value={formData.procedureName}
                            onChange={(e) => setFormData({...formData, procedureName: e.target.value})}
                            className="w-full"
                            placeholder="Ex: Restauração, Extração, Limpeza..."
                            disabled={dialogLoading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="description" className="font-bold block mb-2">
                            Descrição *
                        </label>
                        <InputTextarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full"
                            rows={3}
                            placeholder="Descreva o procedimento realizado..."
                            disabled={dialogLoading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="procedureDate" className="font-bold block mb-2">
                            Data do Procedimento
                        </label>
                        <Calendar
                            id="procedureDate"
                            value={formData.procedureDate}
                            onChange={(e) => setFormData({...formData, procedureDate: e.value as Date})}
                            dateFormat="dd/mm/yy"
                            showIcon
                            className="w-full"
                            disabled={dialogLoading}
                        />
                    </div>

                    {editingProcedure && (
                        <div className="mt-2 p-2 border-1 border-round" style={{ backgroundColor: '#f8f9f8' }}>
                            <small className="text-500">
                                Última atualização: {new Date(editingProcedure.updatedAt).toLocaleDateString('pt-BR')}
                            </small>
                        </div>
                    )}
                </div>
            </Dialog>

            <div className="w-full lg:w-11">
                <Card className="mb-4" header={header}>
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-900 mb-1">Diagrama Odontológico</h3>

                        <div className="flex justify-content-center gap-4 mt-3 flex-wrap">
                            <div className="flex align-items-center gap-2">
                                <div style={{ width: '20px', height: '20px', backgroundColor: '#4CAF50', borderRadius: '4px' }}></div>
                                <span>Com procedimento</span>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <div style={{ width: '20px', height: '20px', backgroundColor: '#e0e0e0', border: '1px solid #666', borderRadius: '4px' }}></div>
                                <span>Sem procedimento</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div style={{
                            border: '2px solid #666',
                            borderRadius: '10px',
                            backgroundColor: 'white',
                            padding: '10px',
                            display: 'inline-block',
                            marginBottom: '20px',
                            maxWidth: '800px',
                            width: '100%'
                        }}>
                            <img
                                src={odontogramImage}
                                alt="Diagrama Odontológico"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '350px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    console.error('Erro ao carregar imagem do odontograma:', e);
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div className="odontograma-container" style={{
                        border: '2px solid #666',
                        borderRadius: '15px',
                        backgroundColor: 'white',
                        padding: '20px',
                        position: 'relative',
                        overflowX: 'auto',
                        marginTop: '20px'
                    }}>
                        <div className="text-center mb-4">
                            <div className="text-lg font-bold text-600 mb-3">ARCADA SUPERIOR</div>
                            <div className="flex justify-content-center flex-wrap">
                                {TOOTH_MAP
                                    .filter(t => t.isUpper && t.number >= 11 && t.number <= 18)
                                    .sort((a, b) => b.number - a.number)
                                    .map((tooth, index) => renderTooth(tooth, index, true))}
                            </div>
                            <div className="flex justify-content-center flex-wrap mt-2">
                                {TOOTH_MAP
                                    .filter(t => t.isUpper && t.number >= 21 && t.number <= 28)
                                    .sort((a, b) => a.number - b.number)
                                    .map((tooth, index) => renderTooth(tooth, index, true))}
                            </div>
                        </div>

                        <div style={{
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#999',
                            margin: '30px 0'
                        }}></div>

                        <div className="text-center">
                            <div className="text-lg font-bold text-600 mb-3">ARCADA INFERIOR</div>
                            <div className="flex justify-content-center flex-wrap">
                                {TOOTH_MAP
                                    .filter(t => !t.isUpper && t.number >= 31 && t.number <= 38)
                                    .sort((a, b) => a.number - b.number)
                                    .map((tooth, index) => renderTooth(tooth, index, false))}
                            </div>
                            <div className="flex justify-content-center flex-wrap mt-2">
                                {TOOTH_MAP
                                    .filter(t => !t.isUpper && t.number >= 41 && t.number <= 48)
                                    .sort((a, b) => b.number - a.number)
                                    .map((tooth, index) => renderTooth(tooth, index, false))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-900 mb-3">Procedimentos Registrados</h3>

                        {procedures.length === 0 ? (
                            <div className="text-center p-6 border-1 border-round" style={{ backgroundColor: '#f8f9f8' }}>
                                <IconDental size={48} className="text-400 mb-3" />
                                <h4 className="text-900 font-medium mb-1">Nenhum procedimento cadastrado</h4>
                                <p className="text-600 mb-4">
                                    Clique em um dente no diagrama acima para cadastrar o primeiro procedimento.
                                </p>
                            </div>
                        ) : (
                            <div className="grid">
                                {procedures.map((procedure) => (
                                    <div key={procedure.id} className="col-12 md:col-6 lg:col-4 mb-3">
                                        <Card className="h-full" style={{
                                            backgroundColor: '#e0e0e0',
                                            borderColor: '#e0e0e0'
                                        }}>
                                            <div className="flex justify-content-between align-items-start mb-2">
                                                <div style={{ maxWidth: 'calc(100% - 40px)' }}>
                                                    <h4 className="text-lg font-bold text-900 m-0">
                                                        Dente {procedure.toothNumber}
                                                    </h4>
                                                    <small className="text-500" style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: 'block'
                                                    }}>
                                                        {TOOTH_MAP.find(t => t.number === procedure.toothNumber)?.name}
                                                    </small>
                                                </div>
                                                <Button
                                                    icon={<IconEdit size={16} />}
                                                    severity="info"
                                                    rounded
                                                    text
                                                    tooltip="Editar"
                                                    onClick={() => {
                                                        setSelectedTooth(procedure.toothNumber);
                                                        setEditingProcedure(procedure);
                                                        setFormData({
                                                            toothNumber: procedure.toothNumber,
                                                            procedureName: procedure.procedureName,
                                                            description: procedure.description,
                                                            procedureDate: new Date(procedure.procedureDate)
                                                        });
                                                        setDialogVisible(true);
                                                    }}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <label className="font-bold block mb-1">Procedimento:</label>
                                                <p className="text-600 m-0" style={{ wordBreak: 'break-word' }}>
                                                    {procedure.procedureName}
                                                </p>
                                            </div>

                                            <div className="mb-2">
                                                <label className="font-bold block mb-1">Descrição:</label>
                                                <p className="text-600 m-0" style={{ wordBreak: 'break-word' }}>
                                                    {procedure.description}
                                                </p>
                                            </div>

                                            <div className="mb-2">
                                                <label className="font-bold block mb-1">Data:</label>
                                                <p className="text-600 m-0">
                                                    {new Date(procedure.procedureDate).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>

                                            <small className="text-500">
                                                Cadastrado em: {new Date(procedure.createdAt).toLocaleDateString('pt-BR')}
                                            </small>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
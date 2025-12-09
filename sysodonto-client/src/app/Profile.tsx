import { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { IconArrowLeft, IconCamera, IconLogout, IconUser, IconLock, IconCheck, IconX, IconEdit } from "@tabler/icons-react";
import { useStoreToken, useStoreLoggedUser, clearStore } from "../features/user-features.ts";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";

export function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [logoutConfirmDialog, setLogoutConfirmDialog] = useState(false); // NOVO: Diálogo de confirmação
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const { token } = useStoreToken();
    const { user: loggedUser, setUser: setLoggedUser } = useStoreLoggedUser();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/view/user/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                setNewName(userData.name);
                setProfilePicture(userData.profilePicture);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar perfil.',
                    life: 4000
                });
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar dados do perfil.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmLogout = () => {
        setLogoutConfirmDialog(true);
    };

    const handleLogoutConfirmed = () => {
        clearStore();
        setLogoutConfirmDialog(false);
        navigate("/");
    };

    const handleBackToHome = () => {
        navigate("/home");
    };

    const handleUpdateName = async () => {
        if (!user || !newName.trim() || newName.trim() === user.name) {
            setEditingName(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/view/user/profile/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newName.trim(),
                    profilePicture: profilePicture || user.profilePicture
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                setLoggedUser(updatedUser);
                setEditingName(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Nome atualizado com sucesso!',
                    life: 3000
                });
            } else {
                const errorData = await res.json();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorData.error || 'Falha ao atualizar nome.',
                    life: 4000
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao atualizar nome.',
                life: 4000
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingImage(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;

                try {
                    const res = await fetch(`http://localhost:8000/view/user/profile/update`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: user?.name,
                            profilePicture: base64String
                        })
                    });

                    if (res.ok) {
                        const updatedUser = await res.json();
                        setUser(updatedUser);
                        setLoggedUser(updatedUser);
                        setProfilePicture(base64String);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Foto atualizada com sucesso!',
                            life: 3000
                        });
                    }
                } catch (error) {
                    console.error('Erro ao atualizar foto:', error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Falha ao atualizar foto.',
                        life: 4000
                    });
                } finally {
                    setUploadingImage(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'As senhas não coincidem.',
                life: 4000
            });
            return;
        }

        if (newPassword.length < 6) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'A senha deve ter pelo menos 6 caracteres.',
                life: 4000
            });
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/view/user/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (res.ok) {
                setChangePasswordDialog(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Senha alterada com sucesso!',
                    life: 3000
                });
            } else {
                const errorData = await res.json();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorData.error || 'Falha ao alterar senha.',
                    life: 4000
                });
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao alterar senha.',
                life: 4000
            });
        }
    };

    // NOVO: Footer do diálogo de confirmação de logout
    const logoutConfirmFooter = (
        <div className="flex justify-content-between gap-2 w-full">
            <Button
                label="Cancelar"
                severity="secondary"
                icon={<IconX size={18} />}
                onClick={() => setLogoutConfirmDialog(false)}
            />
            <Button
                label="Sair"
                severity="danger"
                icon={<IconLogout size={18} />}
                onClick={handleLogoutConfirmed}
            />
        </div>
    );

    const changePasswordFooter = (
        <div className="flex justify-content-between gap-2">
            <Button
                label="Cancelar"
                severity="secondary"
                onClick={() => {
                    setChangePasswordDialog(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }}
            />
            <Button
                label="Alterar Senha"
                severity="success"
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
            />
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center w-full p-4" style={{ backgroundColor: '#ccfaf7', minHeight: '100vh' }}>
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-4xl"></i>
                    <p className="mt-2">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-content-center w-full p-4" style={{ backgroundColor: '#ccfaf7', minHeight: '100vh' }}>
            <Toast ref={toast} />

            {/* NOVO: Diálogo de confirmação de logout */}
            <Dialog
                header="Confirmar Logout"
                visible={logoutConfirmDialog}
                style={{ width: '400px' }}
                footer={logoutConfirmFooter}
                onHide={() => setLogoutConfirmDialog(false)}
            >
                <div className="flex align-items-center gap-3 mt-3">
                    <i className="pi pi-exclamation-triangle text 3xl" style={{ fontSize: '2rem', color: '#f0ad4e' }}></i>
                    <div>
                        <h4 className="m-0 mb-1">Tem certeza que deseja sair?</h4>
                        <p className="text-600 m-0">
                            Você será desconectado da sua conta e redirecionado para a página de login.
                        </p>
                    </div>
                </div>
            </Dialog>

            {/* Diálogo para alterar senha */}
            <Dialog
                header="Alterar Senha"
                visible={changePasswordDialog}
                style={{ width: '400px' }}
                footer={changePasswordFooter}
                onHide={() => {
                    setChangePasswordDialog(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }}
            >
                <div className="flex flex-column gap-3 mt-3">
                    <div className="field">
                        <label htmlFor="currentPassword" className="font-bold block mb-2">
                            Senha Atual
                        </label>
                        <Password
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                            className="w-full"
                            placeholder="Digite sua senha atual"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="newPassword" className="font-bold block mb-2">
                            Nova Senha
                        </label>
                        <Password
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            toggleMask
                            className="w-full"
                            placeholder="Digite a nova senha"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="confirmPassword" className="font-bold block mb-2">
                            Confirmar Nova Senha
                        </label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                            className="w-full"
                            placeholder="Confirme a nova senha"
                        />
                    </div>
                </div>
            </Dialog>

            <div className="w-full lg:w-8">
                <Card className="mb-4">
                    <div className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center gap-3">
                            <Button
                                icon={<IconArrowLeft size={20} />}
                                severity="secondary"
                                rounded
                                text
                                tooltip="Voltar para Home"
                                tooltipOptions={{ position: 'top' }}
                                onClick={handleBackToHome}
                            />
                            <h1 className="text-2xl font-bold text-900 m-0">Meu Perfil</h1>
                        </div>
                        {/* MODIFICADO: Agora chama confirmLogout em vez de handleLogout direto */}
                        <Button
                            label="Sair"
                            icon={<IconLogout size={18} />}
                            severity="danger"
                            onClick={confirmLogout}
                        />
                    </div>
                </Card>

                <Card>
                    <div className="flex flex-column align-items-center mb-6">
                        <div className="relative mb-3">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt={user?.name}
                                    className="border-circle"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    className="border-circle flex align-items-center justify-content-center"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        backgroundColor: '#e0e0e0',
                                        color: '#666'
                                    }}
                                >
                                    <IconUser size={48} />
                                </div>
                            )}

                            <Button
                                icon={<IconCamera size={16} />}
                                className="absolute"
                                style={{ bottom: '0', right: '0' }}
                                rounded
                                severity="info"
                                onClick={() => fileInputRef.current?.click()}
                                loading={uploadingImage}
                            />

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-900 m-0 mb-1">{user?.name}</h2>
                            <p className="text-600 m-0">{user?.email}</p>
                        </div>
                    </div>

                    {/* Informações do usuário */}
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <Card className="h-full">
                                <div className="flex flex-column gap-4">
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center gap-2">
                                            <div className="p-2 border-circle" style={{ backgroundColor: '#e3f2fd' }}>
                                                <IconUser size={20} color="#1976d2" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-900 m-0">Nome</h3>
                                                {editingName ? (
                                                    <div className="flex align-items-center gap-2 mt-1">
                                                        <InputText
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            className="w-full"
                                                            autoFocus
                                                        />
                                                        <Button
                                                            icon={<IconCheck size={16} />}
                                                            severity="success"
                                                            rounded
                                                            onClick={handleUpdateName}
                                                        />
                                                        <Button
                                                            icon={<IconX size={16} />}
                                                            severity="secondary"
                                                            rounded
                                                            onClick={() => {
                                                                setEditingName(false);
                                                                setNewName(user?.name || "");
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex align-items-center gap-2">
                                                        <p className="text-600 m-0 mt-1">{user?.name}</p>
                                                        <Button
                                                            icon={<IconEdit size={16} />}
                                                            severity="info"
                                                            rounded
                                                            text
                                                            onClick={() => setEditingName(true)}
                                                            tooltip="Editar nome"
                                                            tooltipOptions={{ position: 'top' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="col-12 md:col-6">
                            <Card className="h-full">
                                <div className="flex flex-column gap-4">
                                    <div className="flex align-items-center justify-content-between">
                                        <div className="flex align-items-center gap-2">
                                            <div className="p-2 border-circle" style={{ backgroundColor: '#e8f5e9' }}>
                                                <IconLock size={20} color="#388e3c" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-900 m-0">Senha</h3>
                                                <p className="text-600 m-0 mt-1">••••••••</p>
                                            </div>
                                        </div>
                                        <Button
                                            label="Alterar Senha"
                                            icon={<IconLock size={16} />}
                                            severity="warning"
                                            className="p-button-outlined"
                                            onClick={() => setChangePasswordDialog(true)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="grid mt-4">
                        <div className="col-12">
                            <Card>
                                <h3 className="text-xl font-bold text-900 m-0 mb-3">Informações da Conta</h3>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="font-bold block mb-1">Email</label>
                                            <p className="text-600 m-0">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
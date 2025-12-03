import {Card} from "primereact/card";
import {IconDental, IconLogin} from "@tabler/icons-react";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {useRef, useState} from "react";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";

export function FormEmailToRecovery() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    // const [patients, setPatients] = useState<Patient[]>([]);


    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-10rem">
            <div className="flex mt-5 align-items-center justify-content-center">
                <IconDental size={40} stroke={2}/>
                <h1 className="text-primary font-bold m-0">Recuperar Senha</h1>
            </div>
        </div>
    );


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        fetch("http://localhost:8000/view/user/getRecoveryPasswordCode", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(async res => {
                const data = await res.json();
                const code = data.code;
                if (!res.ok) {
                    throw new Error(data.message || data.error || 'Erro na ação solicitada.');
                }
                navigate("/formCodeEmail", {
                    state: {
                        code: code,
                        email: email,
                    }
                });

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

    console.warn(loading)

    return (
        <div className="flex justify-content-center align-items-center min-h-screen bg-gradient w-full">
            <Toast ref={toast}/>
            <Card className="w-25rem" header={header}>
                <form className="flex flex-column" onSubmit={onSubmit}>
                    <FloatLabel>
                        <InputText
                            id="email"
                            className="w-full"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Insira seu email</label>
                    </FloatLabel>
                    <Button
                        type="submit"
                        label="Entrar"
                        icon={<IconLogin size={18}/>}
                        loading={loading}
                        className=" mt-5 flex align-items-center justify-content-center"
                    />

                </form>
            </Card>
        </div>
    );
}

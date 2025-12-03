import {useLocation, useNavigate} from "react-router-dom";
import {IconDental, IconLogin} from "@tabler/icons-react";
import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useRef, useState} from "react";
import {Toast} from "primereact/toast";

export function FormCodeEmail() {

    const location = useLocation();
    const code = location.state?.code;
    const email = location.state?.email;
    const [inputCode, setInputCode] = useState<string>("");
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();



    const header = (
        <div className="header-container text-center align-items-center justify-content-center w-full h-10rem">
            <div className="flex mt-5 align-items-center justify-content-center">
                <IconDental size={40} stroke={2} />
                <h1 className="text-primary font-bold m-0">Recuperar Senha</h1>
            </div>
        </div>
    );

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (code === inputCode) {

            navigate("/formRecoveryPassword", {
                state: {
                    email: email
                }
            });
            return;
        }

        toast.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Código Inválido',
            life: 4000
        });

    }


    return (
        <div className="flex justify-content-center align-items-center min-h-screen bg-gradient w-full">
            <Toast ref={toast}/>
            <Card className="w-25rem" header={header}>
                <form className="flex flex-column" onSubmit={onSubmit}>
                    <FloatLabel>
                        <InputText
                            id="inputCode"
                            keyfilter="pnum"
                            className="w-full"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                        />
                        <label htmlFor="inputCode">Insira o codigo enviado</label>
                    </FloatLabel>
                    <Button
                        type="submit"
                        label="Validar"
                        icon={<IconLogin size={18}/>}
                        className=" mt-5 flex align-items-center justify-content-center"
                    />

                </form>
            </Card>
        </div>
    );

}
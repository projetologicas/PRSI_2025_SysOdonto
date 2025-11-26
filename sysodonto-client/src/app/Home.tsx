import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {IconDeviceFloppy, IconPlus, IconReplace, IconX} from "@tabler/icons-react";
import {useState} from "react";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {InputTextarea} from "primereact/inputtextarea";
import {Calendar} from "primereact/calendar";

export function Home() {

    const [previewImage, setPreviewImage] = useState<string | null>(null);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="flex justify-content-center align-items-center w-full" style={{backgroundColor: '#ccfaf7', height:'100vh' }}>
            <Card
                className="w-8"
            >
                <form className="flex flex-column">
                    <div className="flex flex-row w-full">
                        <div className="flex flex-column align-items-center">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    style={{
                                        width: '180px',
                                        height: '180px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #ccc'
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '180px',
                                        height: '180px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#999'
                                    }}
                                >
                                    Sem imagem
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                id="fileInput"
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                            />


                            <div className="flex justify-content-center mt-2 gap-1">
                                <Button
                                    type="button"
                                    severity="success"
                                    icon={!previewImage ? <IconPlus size={18}/> : <IconReplace size={18}/>}
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                />
                                {previewImage && (
                                    <Button
                                        type="button"
                                        icon={<IconX size={18}/>}
                                        severity="danger"
                                        onClick={() => {
                                            setPreviewImage(null);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                       <div className="flex flex-column gap-1 justify-content-center align-items-center w-full">
                           <FloatLabel className="w-full ml-5">
                               <InputText id="name" className="w-full"
                                          placeholder="digite seu nome"  />
                               <label htmlFor="name">Nome</label>
                           </FloatLabel>
                           <div className="ml-5 mt-5 flex flex-row gap-3 align-items-center justify-content-center w-full">
                               <FloatLabel className="w-7">
                                   <InputText id="cpf" className="w-full"
                                              placeholder="xxx.xxx.xxx.xx"  />
                                   <label htmlFor="cpf">CPF</label>
                               </FloatLabel>


                               <FloatLabel className="w-7">
                                   <InputText id="telephone" keyfilter="pnum" className="w-full "
                                              placeholder="xx xxxxx-xxxx"  />
                                   <label htmlFor="telephone">Telefone</label>
                               </FloatLabel>
                           </div>
                           <div className="flex flex-row gap-3 ml-5 mt-5 align-items-center justify-content-center w-full">
                               <FloatLabel className="w-8">
                                   <Calendar id="birthDay" className="w-full"  />
                                   <label htmlFor="birthDay">Data de Nascimento</label>
                               </FloatLabel>


                               <FloatLabel className="w-8">
                                   <Calendar id="startTreatmentDate" className="w-full "/>
                                   <label htmlFor="startTreatmentDate">Inicio do Tratamento</label>
                               </FloatLabel>
                           </div>
                       </div>
                    </div>
                    <FloatLabel className="mt-5">
                        <InputTextarea  id="observations" className="w-full"/>
                        <label htmlFor="observations">Observação</label>
                    </FloatLabel>
                    <div className="flex flex-row gap-3 mt-5 justify-content-end align-items-end">
                        <Button
                            type="submit"
                            label="Cancelar"
                            severity="success"
                            icon={<IconDeviceFloppy size={18}/>}
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

export type Patient = {
    id: string;
    userId?: string;
    name: string;
    cpf: string;
    picture?: string;
    telephone?: string;
    birthDate?: Date;
    startTreatmentDate?: Date;
    observations?: string;
};

export type PatientRequest = {
    name: string;
    cpf: string;
    picture?: string;
    telephone?: string;
    birthDate?: Date;
    startTreatmentDate?: Date;
    observations?: string;
}


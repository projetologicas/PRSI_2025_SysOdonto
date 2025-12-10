export type ToothProcedure = {
    id: string;
    userId: string;
    patientId: string;
    toothNumber: number;
    toothName: string;
    procedureName: string;
    description: string;
    procedureDate: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
};

export type ToothProcedureRequest = {
    toothNumber: number;
    procedureName: string;
    description: string;
    procedureDate: Date;
};
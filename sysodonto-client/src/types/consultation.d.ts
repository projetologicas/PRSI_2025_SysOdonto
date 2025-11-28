export type Consultation = {
    id: string;
    userId: string;
    patientId: string;
    dateTime?: Date;
    patientName?: string;
    observations?: string;
}

export type ConsultationRequest = {
    dateTime: Date;
    observations?: string;
    patient: Patient;
}
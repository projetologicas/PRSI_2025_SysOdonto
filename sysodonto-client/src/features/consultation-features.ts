import type {ConsultationRequest} from "../types/consultation";
import {z} from "zod";


export const defaultConsultationValues: ConsultationRequest = {
    dateTime: new Date(),
    observations: '',
    patient: undefined,
    sendReminder: false
}


export const consultationZodSchema = z.object({
    patient: z.object({
        birthDate: z.string().optional(),
        cpf: z.string().nonempty(),
        id: z.string().nonempty(),
        name: z.string().nonempty(),
        observations: z.string().optional(),
        picture: z.string().optional(),
        startTreatmentDate: z.string().optional(),
        telephone: z.string().optional(),
        userId: z.string().optional(),
    }),
    dateTime: z.date().nonoptional(),
    observations: z.string().optional()
});

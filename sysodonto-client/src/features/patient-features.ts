import type {PatientRequest} from "../types/patient";
import {z} from "zod";

export const defaultPatientValues: PatientRequest = {
    name: '',
    cpf: '',
    picture: '',
    telephone: '',
    birthDate: undefined,
    startTreatmentDate: undefined,
    observations: '',
}

export const patientZodSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    cpf: z.string().nonempty("O cpf é obrigatório"),
    picture: z.string().optional(),
    telephone: z.string().nonempty("O telefone é obrigatório"),
    birthDate: z.date().optional(),
    startTreatmentDate: z.date().optional(),
    observations: z.string().optional()
})
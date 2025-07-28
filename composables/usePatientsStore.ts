import type { Patient } from "~/server/database/schema";
import { PatientsRepository } from "~/repositories/PatientsRepository";

const patientsRepository = new PatientsRepository()
export const usePatientsStore = createEntityStore<Patient, PatientsRepository>(
    'patients',
    patientsRepository,
)
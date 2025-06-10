import type { Patient } from "~/models/patients";
import { PatientsRepository } from "~/repositories/PatientsRepository";

const patientsRepository = new PatientsRepository()
export const usePatientsStore = createEntityStore<Patient>(
    'patients',
    patientsRepository,
)
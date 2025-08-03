// ~/repositories/PatientsRepository.ts
import type { Patient, PatientStatistics, Visit, AdverseEvent, GdprConsent, AuditLog, Trial, Site, VitalSigns } from '~/server/database/schema'
import type { PatientStatus } from '~/server/database/schema/enums'
import type { ServerResponse } from '~/models/utils'
import { type BasePaginatedResponse, ResourceRepository, type BaseRepositoryFilters, type REPOSITORY_TYPE } from './ResourceRepository'

export interface PatientFilters extends BaseRepositoryFilters {
    status?: PatientStatus
    trialId?: string
    siteId?: string
    dateOfBirthFrom?: string
    dateOfBirthTo?: string
    enrollmentDateFrom?: string
    enrollmentDateTo?: string
}

export interface PatientsPaginatedResponse {
    patients: Patient[]
    total: number
    page: number
    limit: number
}

export class PatientsRepository extends ResourceRepository<Patient> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('patients', type)
    }

    async findByPatientId(patientId: string): Promise<Patient | undefined> {
        return this.findById(patientId)
    }

    async findByTrialId(trialId: string): Promise<BasePaginatedResponse<Patient>> {
        const filter: PatientFilters = {
            search: '',
            trialId,
            page: 1,
            limit: 1000, // Adjust limit as needed
            sortBy: 'id',
            sortOrder: 'asc'
        }

        return this.findWithFilters(filter)

    }

    async findBySiteId(siteId: string): Promise<Patient[]> {
        const filters: PatientFilters = {
            search: '',
            siteId,
            page: 1,
            limit: 1000, // Adjust limit as needed
            sortBy: 'id',
            sortOrder: 'asc'
        }

        const response = await this.findWithFilters(filters)
        return response.items
    }

    async updateStatus(id: string, patientStatus: PatientStatus): Promise<Patient> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Patient>>(`${this.apiUrl}/${id}/status`, {
            method: 'PATCH',
            body: { patientStatus }
        })

        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    throw createError({
                        statusCode,
                        statusMessage: 'Patient not found'
                    })
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while updating patient status: ${message || statusText}`
                    })
            }
        }

        return data
    }

    async updateGDPRConsent(id: string, consent: {
        dataProcessingConsent: boolean
        communicationConsent: boolean
        consentDate: string
    }): Promise<Patient> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Patient>>(`${this.apiUrl}/${id}/gdpr-consent`, {
            method: 'PATCH',
            body: consent
        })
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    throw createError({
                        statusCode,
                        statusMessage: 'Patient not found'
                    })
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while updating GDPR consent: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getPatientStatistics(trialId?: string): Promise<PatientStatistics> {
        const url = trialId
            ? `${this.apiUrl}/statistics?trialId=${trialId}`
            : `${this.apiUrl}/statistics`

        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<PatientStatistics>>(url)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return { totalPatients: 0, activePatients: 0, completedPatients: 0, withdrawnPatients: 0, patientsByStatus: {} } // No statistics found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching patient statistics: ${message || statusText}`
                    })
            }
        }
        return data
    }

    // Related data methods
    async getPatientVisits(patientUuid: string): Promise<Visit[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Visit[]>>(`${this.apiUrl}/${patientUuid}/visits`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching visits for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getPatientAdverseEvents(patientUuid: string): Promise<AdverseEvent[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<AdverseEvent[]>>(`${this.apiUrl}/${patientUuid}/adverse-events`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching adverse events for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getPatientVitalSigns(patientUuid: string): Promise<VitalSigns[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<VitalSigns[]>>(`${this.apiUrl}/${patientUuid}/vital-signs`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching vital signs for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getPatientGdprConsents(patientUuid: string): Promise<GdprConsent[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<GdprConsent[]>>(`${this.apiUrl}/${patientUuid}/gdpr-consents`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching GDPR consents for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getPatientAuditLogs(patientUuid: string, limit: number = 10): Promise<AuditLog[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<AuditLog[]>>(`${this.apiUrl}/${patientUuid}/audit-logs?limit=${limit}`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching audit logs for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getPatientTrial(patientUuid: string): Promise<Trial> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/${patientUuid}/trial`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getPatientSite(patientUuid: string): Promise<Site> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Site>>(`${this.apiUrl}/${patientUuid}/site`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching site for patient ${patientUuid}: ${message || statusText}`
            })
        }
        return data
    }
}

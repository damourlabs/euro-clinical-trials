// ~/repositories/TrialsRepository.ts
import type { Trial, Site, Patient, RegulatoryApproval, ProtocolDeviation, Document, StudyDesign, EligibilityCriteria, ComplianceStatus } from '~/server/database/schema'
import type { TrialStatus, TrialPhase } from '~/server/database/schema/enums'
import type { ServerResponse } from '~/models/utils'
import type { PatientStatistics } from '~/models/patients'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export interface TrialFilters {
    search?: string
    status?: TrialStatus
    phase?: TrialPhase
    sponsorId?: string
    indication?: string
    page?: number
    limit?: number
    sortBy?: 'title' | 'startDate' | 'status' | 'phase'
    sortOrder?: 'asc' | 'desc'
}

export interface TrialsPaginatedResponse {
    trials: Trial[]
    total: number
    page: number
    limit: number
}

export class TrialsRepository extends ResourceRepository<Trial> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('trials', type)
    }

    async findByEudraCTNumber(eudraCTNumber: string): Promise<Trial | null> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/eudract/${eudraCTNumber}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return null // Trial not found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while fetching the trial',
                        message: message || 'An error occurred while fetching the trial'
                    })
            }
        }
        return data

    }

    async findByProtocolNumber(protocolNumber: string): Promise<Trial | undefined> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/protocol/${protocolNumber}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return undefined // Trial not found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while fetching the trial',
                        message: message || 'An error occurred while fetching the trial'
                    })
            }
        }
        return data
    }

    async findBySponsorId(sponsorId: string): Promise<Trial[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial[]>>(`${this.apiUrl}/sponsor/${sponsorId}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No trials found for this sponsor
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching trials for sponsor: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async updateStatus(id: string, trialStatus: TrialStatus): Promise<Trial> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/${id}/status`, {
            method: 'PATCH',
            body: { trialStatus }
        })
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while updating trial status: ${message || statusText}`
            })
        }
        return data
    }

    async updateEnrollment(id: string, enrollment: {
        currentEnrollment: number
        targetEnrollment?: number
    }): Promise<Trial> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/${id}/enrollment`, {
            method: 'PATCH',
            body: enrollment
        })
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while updating trial enrollment: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialStatistics(): Promise<PatientStatistics> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<PatientStatistics>>(`${this.apiUrl}/statistics`)

        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial statistics: ${message || statusText}`
            })
        }
        return data
    }

    // Custom methods for trial relations
    async getTrialSites(trialId: string): Promise<Site[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Site[]>>(`${this.apiUrl}/${trialId}/sites`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial sites: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialPatients(trialId: string): Promise<Patient[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Patient[]>>(`${this.apiUrl}/${trialId}/patients`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial patients: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialRegulatoryApprovals(trialId: string): Promise<RegulatoryApproval[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApproval[]>>(`${this.apiUrl}/${trialId}/regulatory-approvals`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial regulatory approvals: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialProtocolDeviations(trialId: string): Promise<ProtocolDeviation[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<ProtocolDeviation[]>>(`${this.apiUrl}/${trialId}/protocol-deviations`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial protocol deviations: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialDocuments(trialId: string): Promise<Document[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Document[]>>(`${this.apiUrl}/${trialId}/documents`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial documents: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialStudyDesign(trialId: string): Promise<StudyDesign | null> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<StudyDesign | null>>(`${this.apiUrl}/${trialId}/study-design`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial study design: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialEligibilityCriteria(trialId: string): Promise<EligibilityCriteria[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<EligibilityCriteria[]>>(`${this.apiUrl}/${trialId}/eligibility-criteria`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial eligibility criteria: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialComplianceStatus(trialId: string): Promise<ComplianceStatus | null> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<ComplianceStatus | null>>(`${this.apiUrl}/${trialId}/compliance-status`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial compliance status: ${message || statusText}`
            })
        }
        return data
    }
}

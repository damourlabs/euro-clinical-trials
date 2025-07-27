// import { generateUUID } from "@damourlabs-portfolio/utils"
import { today, getLocalTimeZone } from "@internationalized/date"
import type { GDPRConsent } from "~/models/regulations"
import { WithdrawalReasonEnum, type DataCategories, type ConsentType, type Purpose } from "~/server/database/schema/enums";


export const useGDPR = () => {
  const consentRecords = ref<GDPRConsent[]>()
  const { auditLog } = useAuditLogger()

  const recordConsent = async (patientId: string, consentType: ConsentType, purpose: Purpose, trialId: string,
    dataCategories: DataCategories[] = ['Health_data', 'Identification_data', 'Contact_data'],
    dataProcessingDetails: string = 'Data will be processed for clinical trial management and regulatory compliance.'
  ) => {
    const consent: GDPRConsent = {
      id: crypto.randomUUID(), // Generate a unique ID for the consent record
      trialId: trialId, // Generate a new trial ID if not provided
      patientId,
      consentGiven: true,
      consentDate: today(getLocalTimeZone()).toString(),
      legalBasis: 'Consent',
      withdrawalDate: undefined,
      withdrawalMethod: 'Patient_portal',
      withdrawalReason: WithdrawalReasonEnum.Enum.Other,
      consentType,
      purpose,
      userAgent: navigator.userAgent,
      consentStatus: 'Consented',
      dataCategories: dataCategories,
      retentionPeriod: calculateRetentionPeriod(consentType),
      dataProcessingDetails: dataProcessingDetails,
      timestamp: today(getLocalTimeZone()).toString()
    }

    await $fetch('/api/gdpr/consent', {
      method: 'POST',
      body: consent
    })

    if (!consentRecords.value) {
      consentRecords.value = []
    }

    consentRecords.value.push(consent)

    // Audit log for GDPR compliance
    await auditLog('Create',
      'GDPRConsent',
      {
        consentId: consent.id,
        legalBasis: consent.legalBasis,
        patientId: consent.patientId,
      }
    )
  }

  const withdrawConsent = async (consentId: string, reason?: string) => {
    if (!consentRecords.value) {
      console.error('No consent records available')
      return
    }
    const consent = consentRecords.value.find(c => c.id === consentId)
    if (!consent) return

    consent.consentStatus = 'Withdrawn'
    consent.withdrawalDate = today(getLocalTimeZone()).toString()

    if (!reason) {
      reason = 'No reason provided'
    }
    consent.withdrawalReason = reason

    await $fetch(`/api/gdpr/consent/${consentId}/withdraw`, {
      method: 'PATCH',
      body: { reason, timestamp: new Date() }
    })
  }

  const generateDataPortabilityReport = async (patientId: string) => {
    return await $fetch(`/api/gdpr/data-export/${patientId}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
  }


  const calculateRetentionPeriod = (consentType: ConsentType) => {
    switch (consentType) {
      case 'Data_processing':
        return 24 // 2 years
      case 'Data_transfer':
        return 12 // 1 year
      case 'Marketing':
        return 6 // 6 months
      default:
        return 12 // Default to 1 year for other types
    }
  }

  return {
    consentRecords: readonly(consentRecords),
    recordConsent,
    withdrawConsent,
    generateDataPortabilityReport
  }
}

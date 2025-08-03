<template>
  <ResourceCard
    :size="size"
    resource-type="gdpr-consent"
    :data="gdprConsent"
    :loading="loading"
    :error="error"
    :on-retry="onRetry"
    :clickable="clickable"
    :detail-url="detailUrl"
    :actions="actions"
    :popover-fields="popoverFields"
    :preview-fields="previewFields"
    :medium-fields="mediumFields"
    :detail-fields="detailFields"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ResourceCard, { type CardAction, type CardField } from '~/components/common/ResourceCard.vue'

interface GDPRConsent {
  uuid: string
  trialUuid: string
  patientUuid: string
  consentGiven: boolean
  consentDate: string
  legalBasis: string
  withdrawalDate?: string
  withdrawalMethod?: string
  withdrawalReason?: string
  consentType: string
  purpose: string
  consentStatus: string
  dataCategories: string[]
  retentionPeriod: number
  dataProcessingDetails: string
  timestamp: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  gdprConsent?: GDPRConsent
  loading?: boolean
  error?: boolean
  onRetry?: () => void
  clickable?: boolean
  detailUrl?: string
  actions?: CardAction[]
  // Custom field overrides
  customFields?: {
    popover?: CardField[]
    preview?: CardField[]
    medium?: CardField[]
    detail?: CardField[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  gdprConsent: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

const getConsentStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'consented': return 'green'
    case 'withdrawn': return 'red'
    case 'not consented': return 'gray'
    default: return 'gray'
  }
}

const popoverFields = computed<CardField[]>(() => 
  props.customFields?.popover || [
    { key: 'consentStatus', label: 'Status', type: 'badge', colorScheme: getConsentStatusColor(props.gdprConsent?.consentStatus || '') },
    { key: 'consentType', label: 'Type', type: 'text' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'consentStatus', label: 'Consent Status', type: 'badge', colorScheme: getConsentStatusColor(props.gdprConsent?.consentStatus || '') },
    { key: 'consentType', label: 'Consent Type', type: 'badge', colorScheme: 'teal' },
    { key: 'consentDate', label: 'Consent Date', type: 'date' },
    { key: 'purpose', label: 'Purpose', type: 'text', truncate: true },
    { key: 'legalBasis', label: 'Legal Basis', type: 'text' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'consentStatus', label: 'Consent Status', type: 'badge', colorScheme: getConsentStatusColor(props.gdprConsent?.consentStatus || '') },
    { key: 'consentType', label: 'Consent Type', type: 'badge', colorScheme: 'teal' },
    { key: 'consentDate', label: 'Consent Date', type: 'date' },
    { key: 'purpose', label: 'Purpose', type: 'text' },
    { key: 'legalBasis', label: 'Legal Basis', type: 'text' },
    { key: 'retentionPeriod', label: 'Retention Period', type: 'text', format: (v) => `${v} years` },
    { key: 'withdrawalDate', label: 'Withdrawal Date', type: 'date' }
  ]
)

const detailFields = computed<CardField[]>(() => {

  if(props.customFields?.detail !== undefined) {
    return props.customFields.detail
  }

  const formatFn = (value: unknown) => {
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value)
  }
  
  const defaultDetailFields: CardField[] = [
    ...mediumFields.value,
    { key: 'withdrawalMethod', label: 'Withdrawal Method', type: 'text' },
    { key: 'withdrawalReason', label: 'Withdrawal Reason', type: 'text' },
    { key: 'dataCategories', label: 'Data Categories', type: 'text', format: formatFn },
    { key: 'dataProcessingDetails', label: 'Processing Details', type: 'text'},
    { key: 'createdAt', label: 'Created', type: 'date' }
  ]

  return defaultDetailFields
  }
)
</script>

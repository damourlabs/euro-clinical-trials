<template>
  <ResourceCard
    :size="size"
    resource-type="patient"
    :data="patient"
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
import type { Patient } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  patient?: Patient
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
  patient: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

// Enhanced field configurations for patients
const defaultPatientFields = {
  popover: [
    { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'consentStatus', label: 'Consent', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'enrollmentDate', label: 'Enrolled', type: 'date' as const },
    { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const }
  ],
  preview: [
    { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'consentStatus', label: 'Consent', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'enrollmentDate', label: 'Enrolled', type: 'date' as const }
  ],
  medium: [
    { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'consentStatus', label: 'Consent', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'enrollmentDate', label: 'Enrolled', type: 'date' as const },
    { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const },
    { key: 'randomizationGroup', label: 'Group', type: 'text' as const }
  ],
  detail: [
    { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
    { key: 'status', label: 'Patient Status', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'consentStatus', label: 'Consent Status', type: 'badge' as const, colorScheme: 'purple' },
    { key: 'enrollmentDate', label: 'Enrollment Date', type: 'date' as const },
    { key: 'randomizationDate', label: 'Randomization Date', type: 'date' as const },
    { key: 'randomizationGroup', label: 'Randomization Group', type: 'text' as const },
    { key: 'dataCompleteness', label: 'Data Completeness', type: 'percentage' as const },
    { key: 'withdrawalDate', label: 'Withdrawal Date', type: 'date' as const },
    { key: 'lastVisitDate', label: 'Last Visit', type: 'date' as const },
    { key: 'nextVisitDate', label: 'Next Visit', type: 'date' as const }
  ]
}

const popoverFields = computed(() => props.customFields.popover || defaultPatientFields.popover)
const previewFields = computed(() => props.customFields.preview || defaultPatientFields.preview)
const mediumFields = computed(() => props.customFields.medium || defaultPatientFields.medium)
const detailFields = computed(() => props.customFields.detail || defaultPatientFields.detail)

const detailUrl = computed(() => {
  if (props.detailUrl) return props.detailUrl
  if (!props.patient) return '#'
  return `/patients/${props.patient.uuid}`
})
</script>

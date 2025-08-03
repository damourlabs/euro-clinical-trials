<template>
  <ResourceCard
    :size="size"
    resource-type="site"
    :data="site"
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
import type { Site } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  site?: Site
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
  site: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

// Enhanced field configurations for sites
const defaultSiteFields = {
  popover: [
    { key: 'name', label: 'Site Name', type: 'text' as const },
    { key: 'address', label: 'Address', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'green' },
    { key: 'patientsEnrolled', label: 'Patients', type: 'number' as const },
    { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const }
  ],
  preview: [
    { key: 'name', label: 'Site Name', type: 'text' as const },
    { key: 'address', label: 'Address', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'green' },
    { key: 'patientsEnrolled', label: 'Patients', type: 'number' as const }
  ],
  medium: [
    { key: 'name', label: 'Site Name', type: 'text' as const },
    { key: 'address', label: 'Address', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'green' },
    { key: 'patientsEnrolled', label: 'Patients Enrolled', type: 'number' as const },
    { key: 'targetEnrollment', label: 'Target Enrollment', type: 'number' as const },
    { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const }
  ],
  detail: [
    { key: 'name', label: 'Site Name', type: 'text' as const },
    { key: 'address', label: 'Site Address', type: 'text' as const },
    { key: 'country', label: 'Country', type: 'text' as const },
    { key: 'status', label: 'Site Status', type: 'badge' as const, colorScheme: 'green' },
    { key: 'facilityType', label: 'Facility Type', type: 'text' as const },
    { key: 'patientsEnrolled', label: 'Patients Enrolled', type: 'number' as const },
    { key: 'targetEnrollment', label: 'Target Enrollment', type: 'number' as const },
    { key: 'dataCompleteness', label: 'Data Completeness', type: 'percentage' as const },
    { key: 'dataSubmissionStatus', label: 'Data Submission', type: 'badge' as const, colorScheme: 'green' },
    { key: 'activationDate', label: 'Activation Date', type: 'date' as const },
    { key: 'protocolDeviations', label: 'Protocol Deviations', type: 'number' as const },
    { key: 'adverseEventsReported', label: 'Adverse Events', type: 'number' as const }
  ]
}

const popoverFields = computed(() => props.customFields.popover || defaultSiteFields.popover)
const previewFields = computed(() => props.customFields.preview || defaultSiteFields.preview)
const mediumFields = computed(() => props.customFields.medium || defaultSiteFields.medium)
const detailFields = computed(() => props.customFields.detail || defaultSiteFields.detail)

const detailUrl = computed(() => {
  if (props.detailUrl) return props.detailUrl
  if (!props.site) return '#'
  return `/sites/${props.site.uuid}`
})
</script>

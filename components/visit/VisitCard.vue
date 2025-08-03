<template>
  <ResourceCard
    :size="size"
    resource-type="visit"
    :data="visit"
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
import type { Visit } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  visit?: Visit
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
  visit: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

const getVisitStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'green'
    case 'scheduled': return 'blue'
    case 'missed': return 'red'
    case 'cancelled': return 'gray'
    case 'rescheduled': return 'yellow'
    default: return 'gray'
  }
}

const popoverFields = computed<CardField[]>(() => 
  props.customFields?.popover || [
    { key: 'visitType', label: 'Type', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge', colorScheme: getVisitStatusColor(props.visit?.status || '') }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'visitType', label: 'Visit Type', type: 'badge', colorScheme: 'emerald' },
    { key: 'visitNumber', label: 'Visit #', type: 'text', format: (v) => `Visit ${v}` },
    { key: 'status', label: 'Status', type: 'badge', colorScheme: getVisitStatusColor(props.visit?.status || '') },
    { key: 'scheduledDate', label: 'Scheduled', type: 'date' },
    { key: 'actualDate', label: 'Actual', type: 'date' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'visitType', label: 'Visit Type', type: 'badge', colorScheme: 'emerald' },
    { key: 'visitNumber', label: 'Visit Number', type: 'text', format: (v) => `Visit ${v}` },
    { key: 'status', label: 'Status', type: 'badge', colorScheme: getVisitStatusColor(props.visit?.status || '') },
    { key: 'scheduledDate', label: 'Scheduled Date', type: 'date' },
    { key: 'actualDate', label: 'Actual Date', type: 'date' },
    { key: 'window', label: 'Visit Window', type: 'text' },
    { key: 'notes', label: 'Notes', type: 'text', truncate: true }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'missedVisitReason', label: 'Missed Reason', type: 'text' },
    { key: 'patientUuid', label: 'Patient ID', type: 'text' },
    { key: 'siteUuid', label: 'Site ID', type: 'text' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

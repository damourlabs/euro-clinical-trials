<template>
  <ResourceCard
    :size="size"
    resource-type="trial"
    :data="trial"
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
import type { Trial } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  trial?: Trial
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
  trial: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

// Enhanced field configurations for trials
const defaultTrialFields = {
  popover: [
    { key: 'title', label: 'Title', type: 'text' as const },
    { key: 'indication', label: 'Indication', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
    { key: 'phase', label: 'Phase', type: 'text' as const, format: (value: unknown) => `Phase ${value}` },
    { key: 'startDate', label: 'Start Date', type: 'date' as const }
  ],
  preview: [
    { key: 'title', label: 'Title', type: 'text' as const },
    { key: 'indication', label: 'Indication', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
    { key: 'phase', label: 'Phase', type: 'text' as const, format: (value: unknown) => `Phase ${value}` }
  ],
  medium: [
    { key: 'title', label: 'Title', type: 'text' as const },
    { key: 'indication', label: 'Indication', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
    { key: 'phase', label: 'Phase', type: 'text' as const, format: (value: unknown) => `Phase ${value}` },
    { key: 'startDate', label: 'Start Date', type: 'date' as const },
    { key: 'estimatedEndDate', label: 'Est. End Date', type: 'date' as const }
  ],
  detail: [
    { key: 'title', label: 'Trial Title', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'indication', label: 'Indication', type: 'text' as const },
    { key: 'eudractNumber', label: 'EudraCT Number', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
    { key: 'phase', label: 'Phase', type: 'text' as const, format: (value: unknown) => `Phase ${value}` },
    { key: 'blinding', label: 'Blinding', type: 'text' as const },
    { key: 'targetEnrollment', label: 'Target Enrollment', type: 'number' as const },
    { key: 'currentEnrollment', label: 'Current Enrollment', type: 'number' as const },
    { key: 'startDate', label: 'Start Date', type: 'date' as const },
    { key: 'estimatedEndDate', label: 'Estimated End Date', type: 'date' as const },
    { key: 'actualEndDate', label: 'Actual End Date', type: 'date' as const }
  ]
}

const popoverFields = computed(() => props.customFields.popover || defaultTrialFields.popover)
const previewFields = computed(() => props.customFields.preview || defaultTrialFields.preview)
const mediumFields = computed(() => props.customFields.medium || defaultTrialFields.medium)
const detailFields = computed(() => props.customFields.detail || defaultTrialFields.detail)

const detailUrl = computed(() => {
  if (props.detailUrl) return props.detailUrl
  if (!props.trial) return '#'
  return `/trials/${props.trial.uuid}`
})
</script>

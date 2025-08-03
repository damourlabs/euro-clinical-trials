<template>
  <ResourceCard
    generic="Endpoint"
    :size="size"
    resource-type="endpoint"
    :data="endpoint"
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

interface Endpoint {
  uuid: string
  trialUuid: string
  name: string
  type: string
  description: string
  measurementUnit?: string
  timeFrame: string
  isPrimary: boolean
  methodOfAssessment: string
  population?: string
  targetValue?: number
  actualValue?: number
  pValue?: number
  confidenceInterval?: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  endpoint?: Endpoint
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
  endpoint: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

const popoverFields = computed<CardField[]>(() => 
  props.customFields?.popover || [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'isPrimary', label: 'Type', type: 'badge', colorScheme: 'violet', format: (v) => v ? 'Primary' : 'Secondary' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'name', label: 'Endpoint Name', type: 'text' },
    { key: 'isPrimary', label: 'Type', type: 'badge', colorScheme: 'violet', format: (v) => v ? 'Primary' : 'Secondary' },
    { key: 'type', label: 'Measurement Type', type: 'badge', colorScheme: 'pink' },
    { key: 'timeFrame', label: 'Time Frame', type: 'text' },
    { key: 'description', label: 'Description', type: 'text', truncate: true }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'name', label: 'Endpoint Name', type: 'text' },
    { key: 'isPrimary', label: 'Type', type: 'badge', colorScheme: 'violet', format: (v) => v ? 'Primary' : 'Secondary' },
    { key: 'type', label: 'Measurement Type', type: 'badge', colorScheme: 'pink' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'timeFrame', label: 'Time Frame', type: 'text' },
    { key: 'measurementUnit', label: 'Unit', type: 'text' },
    { key: 'methodOfAssessment', label: 'Assessment Method', type: 'text' }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'population', label: 'Population', type: 'text' },
    { key: 'targetValue', label: 'Target Value', type: 'text' },
    { key: 'actualValue', label: 'Actual Value', type: 'text' },
    { key: 'pValue', label: 'P-Value', type: 'text' },
    { key: 'confidenceInterval', label: 'Confidence Interval', type: 'text' },
    { key: 'createdAt', label: 'Created', type: 'date' }
  ]
)
</script>

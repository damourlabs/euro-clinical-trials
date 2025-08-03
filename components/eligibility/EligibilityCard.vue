<template>
  <ResourceCard
    :size="size"
    resource-type="eligibility"
    :data="eligibilityCriteria"
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
import type { EligibilityCriteria } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  eligibilityCriteria?: EligibilityCriteria
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
  eligibilityCriteria: undefined,
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
    { key: 'isInclusion', label: 'Type', type: 'badge', colorScheme: 'slate', format: (v) => v ? 'Inclusion' : 'Exclusion' },
    { key: 'category', label: 'Category', type: 'text' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'isInclusion', label: 'Type', type: 'badge', colorScheme: 'slate', format: (v) => v ? 'Inclusion' : 'Exclusion' },
    { key: 'category', label: 'Category', type: 'badge', colorScheme: 'rose' },
    { key: 'description', label: 'Description', type: 'text', truncate: true },
    { key: 'priority', label: 'Priority', type: 'text' },
    { key: 'type', label: 'Criteria Type', type: 'text' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'isInclusion', label: 'Criteria Type', type: 'badge', colorScheme: 'slate', format: (v) => v ? 'Inclusion' : 'Exclusion' },
    { key: 'category', label: 'Category', type: 'badge', colorScheme: 'rose' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'criteriaText', label: 'Criteria Text', type: 'text', truncate: true },
    { key: 'priority', label: 'Priority', type: 'text' },
    { key: 'minAge', label: 'Min Age', type: 'text' },
    { key: 'maxAge', label: 'Max Age', type: 'text' }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'gender', label: 'Gender', type: 'text' },
    { key: 'healthCondition', label: 'Health Condition', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

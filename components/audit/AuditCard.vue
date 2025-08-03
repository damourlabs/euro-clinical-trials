<template>
  <ResourceCard
    :size="size"
    resource-type="audit"
    :data="audit"
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
import type { AuditLog } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  audit?: AuditLog
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
  audit: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

// Define field configurations for different card sizes
const popoverFields = computed<CardField[]>(() => 
  props.customFields?.popover || [
    { key: 'action', label: 'Action' },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'timestamp', label: 'Timestamp', type: 'date' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'action', label: 'Action' },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'timestamp', label: 'Timestamp', type: 'date' }
  ]
)

const mediumFields = computed<CardField[]>(() => {
  if (props.customFields?.medium !== undefined) {
    return props.customFields.medium
  } 
  
  const defaultMeidumField: CardField[] = [
    { key: 'action', label: 'Action' },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'entityUuid', label: 'Entity ID', type: 'uuid' },
    { key: 'userUuid', label: 'User ID', type: 'uuid' },
    { key: 'timestamp', label: 'Timestamp', type: 'date' }] 

    return defaultMeidumField
})

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    { key: 'action', label: 'Action' },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'entityUuid', label: 'Entity ID', type: 'uuid' },
    { key: 'userUuid', label: 'User ID', type: 'uuid' },
    { key: 'trialUuid', label: 'Trial ID', type: 'uuid' },
    { key: 'timestamp', label: 'Timestamp', type: 'date' },
    { key: 'ipAddress', label: 'IP Address' },
    { key: 'userAgent', label: 'User Agent' },
    { key: 'sessionId', label: 'Session ID', type: 'uuid' }
  ]
)
</script>

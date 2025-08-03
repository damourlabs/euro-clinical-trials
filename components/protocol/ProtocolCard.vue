<template>
  <ResourceCard
    :size="size"
    resource-type="protocol"
    :data="protocol"
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
import type { Protocol } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  protocol?: Protocol
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
  protocol: undefined,
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
    { key: 'name', label: 'Name' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'name', label: 'Name' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created', type: 'date' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

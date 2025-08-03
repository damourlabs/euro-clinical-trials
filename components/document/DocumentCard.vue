c<template>
  <ResourceCard
    :size="size"
    resource-type="document"
    :data="document"
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
import type { Document } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  document?: Document
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
  document: undefined,
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
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'documentType', label: 'Type', type: 'badge', colorScheme: 'purple' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'documentType', label: 'Type', type: 'badge', colorScheme: 'purple' },
    { key: 'uploadDate', label: 'Uploaded', type: 'date' },
    { key: 'description', label: 'Description', type: 'text', truncate: true }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'title', label: 'Document Title', type: 'text' },
    { key: 'documentType', label: 'Type', type: 'badge', colorScheme: 'purple' },
    { key: 'uploadDate', label: 'Upload Date', type: 'date' },
    { key: 'description', label: 'Description', type: 'text', truncate: true },
    { key: 'url', label: 'File', type: 'link', format: () => 'Download/View' }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'uploadedByUuid', label: 'Uploaded By', type: 'text' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

<template>
  <ResourceCard
    :size="size"
    resource-type="regulatory-approval"
    :data="regulatoryApproval"
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
import type { RegulatoryApproval } from '~/server/database/schema'
import ResourceCard, { type CardAction, type CardField } from '~/components/common/ResourceCard.vue'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  regulatoryApproval?: RegulatoryApproval
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
  regulatoryApproval: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

const getApprovalStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'green'
    case 'pending': return 'yellow'
    case 'rejected': return 'red'
    case 'expired': return 'gray'
    default: return 'gray'
  }
}

const popoverFields = computed<CardField[]>(() => 
  props.customFields?.popover || [
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge', colorScheme: getApprovalStatusColor(props.regulatoryApproval?.status || '') }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'type', label: 'Approval Type', type: 'badge', colorScheme: 'cyan' },
    { key: 'status', label: 'Status', type: 'badge', colorScheme: getApprovalStatusColor(props.regulatoryApproval?.status || '') },
    { key: 'authority', label: 'Authority', type: 'text' },
    { key: 'approvalDate', label: 'Approval Date', type: 'date' },
    { key: 'approvalNumber', label: 'Approval Number', type: 'text' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'type', label: 'Approval Type', type: 'badge', colorScheme: 'cyan' },
    { key: 'status', label: 'Status', type: 'badge', colorScheme: getApprovalStatusColor(props.regulatoryApproval?.status || '') },
    { key: 'authority', label: 'Regulatory Authority', type: 'text' },
    { key: 'approvalDate', label: 'Approval Date', type: 'date' },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { key: 'approvalNumber', label: 'Approval Number', type: 'text' },
    { key: 'conditions', label: 'Conditions', type: 'text', truncate: true }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'notes', label: 'Notes', type: 'text' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

<template>
  <ResourceCard
    :size="size"
    resource-type="user"
    :data="user"
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
import type { User } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  user?: User
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
  user: undefined,
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
    { key: 'role', label: 'Role', type: 'badge', colorScheme: 'indigo' }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge', colorScheme: 'indigo' },
    { key: 'institution', label: 'Institution', type: 'text' },
    { key: 'isActive', label: 'Status', type: 'badge', colorScheme: 'green', format: (v) => v ? 'Active' : 'Inactive' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge', colorScheme: 'indigo' },
    { key: 'institution', label: 'Institution', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phoneNumber', label: 'Phone', type: 'text' },
    { key: 'isActive', label: 'Status', type: 'badge', colorScheme: 'green', format: (v) => v ? 'Active' : 'Inactive' },
    { key: 'lastLoginAt', label: 'Last Login', type: 'date' }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'emailVerified', label: 'Email Verified', type: 'badge', colorScheme: 'blue', format: (v) => v ? 'Verified' : 'Unverified' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

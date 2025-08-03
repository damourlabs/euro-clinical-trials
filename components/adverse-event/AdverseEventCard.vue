<template>
  <ResourceCard
    :size="size"
    resource-type="adverse-event"
    :data="adverseEvent"
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
import type { AdverseEvent } from '~/server/database/schema'

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  adverseEvent?: AdverseEvent
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
  adverseEvent: undefined,
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  customFields: () => ({})
})

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'mild': return 'green'
    case 'moderate': return 'yellow'
    case 'severe': return 'red'
    case 'life-threatening': return 'red'
    default: return 'gray'
  }
}

const popoverFields = computed<CardField[]>(() => 
  props.customFields?.popover || [
    { key: 'eventDescription', label: 'Event', type: 'text', truncate: true },
    { key: 'severity', label: 'Severity', type: 'badge', colorScheme: getSeverityColor(props.adverseEvent?.severity || '') }
  ]
)

const previewFields = computed<CardField[]>(() => 
  props.customFields?.preview || [
    { key: 'eventDescription', label: 'Event Description', type: 'text', truncate: true },
    { key: 'severity', label: 'Severity', type: 'badge', colorScheme: getSeverityColor(props.adverseEvent?.severity || '') },
    { key: 'outcome', label: 'Outcome', type: 'badge', colorScheme: 'blue' },
    { key: 'onsetDate', label: 'Onset Date', type: 'date' },
    { key: 'relatedToTrial', label: 'Trial Related', type: 'badge', colorScheme: 'orange', format: (v) => v ? 'Yes' : 'No' }
  ]
)

const mediumFields = computed<CardField[]>(() => 
  props.customFields?.medium || [
    { key: 'eventDescription', label: 'Event Description', type: 'text' },
    { key: 'severity', label: 'Severity', type: 'badge', colorScheme: getSeverityColor(props.adverseEvent?.severity || '') },
    { key: 'outcome', label: 'Outcome', type: 'badge', colorScheme: 'blue' },
    { key: 'onsetDate', label: 'Onset Date', type: 'date' },
    { key: 'resolutionDate', label: 'Resolution Date', type: 'date' },
    { key: 'relatedToTrial', label: 'Trial Related', type: 'badge', colorScheme: 'orange', format: (v) => v ? 'Yes' : 'No' },
    { key: 'reportedDate', label: 'Reported', type: 'date' }
  ]
)

const detailFields = computed<CardField[]>(() => 
  props.customFields?.detail || [
    ...mediumFields.value,
    { key: 'patientUuid', label: 'Patient ID', type: 'text' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ]
)
</script>

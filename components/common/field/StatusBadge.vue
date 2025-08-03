<template>
  <Badge :class="statusClasses">
    {{ status }}
  </Badge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '~ui/components/ui/badge'

interface Props {
  status: string
  type?: 'trial' | 'patient' | 'site' | 'user' | 'document' | 'adverse-event' | 'gdpr-consent' | 'regulatory-approval' | 'visit' | 'endpoint' | 'eligibility' | 'protocol' | 'audit' | 'protocol-deviation' | 'generic'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'generic'
})

// Single source of truth for status colors
const STATUS_COLORS = {
  // Patient statuses
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  withdrawn: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  screenfailed: 'bg-orange-100 text-orange-800 border-orange-200',
  
  // Trial statuses
  planning: 'bg-purple-100 text-purple-800 border-purple-200',
  recruiting: 'bg-green-100 text-green-800 border-green-200',
  ongoing: 'bg-blue-100 text-blue-800 border-blue-200',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  terminated: 'bg-red-100 text-red-800 border-red-200',
  
  // Consent statuses
  consented: 'bg-green-100 text-green-800 border-green-200',
  notconsented: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  
  // Site statuses
  initiated: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-red-100 text-red-800 border-red-200',
  
  // Default
  default: 'bg-gray-100 text-gray-800 border-gray-200'
} as const

const statusClasses = computed(() => {
  const normalizedStatus = props.status.toLowerCase().replace(/[\s_-]/g, '')
  return STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
})
</script>

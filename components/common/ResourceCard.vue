<template>
  <component
    :is="cardComponent"
    v-bind="cardProps"
    class="resource-card"
    :class="[sizeClasses, colorClasses, { 'cursor-pointer': clickable }]"
    @click="handleClick"
  >
    <!-- Loading State -->
    <div 
      v-if="loading" 
      class="animate-pulse">
      <CommonResourceCardSkeleton 
        :size="size" 
        :resource-type="resourceType" />
    </div>

    <!-- Error State -->
    <div 
      v-else-if="error" 
      class="flex flex-col justify-center items-center p-4 text-center">
      <div class="mb-2 text-red-500">
        <svg 
          class="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-red-600 text-sm">Failed to load {{ resourceType }}</p>
      <button 
        v-if="onRetry" 
        class="mt-2 text-red-500 hover:text-red-700 text-xs underline"
        @click.stop="onRetry"
      >
        Retry
      </button>
    </div>

    <!-- Content -->
    <div 
      v-else 
      class="resource-card-content">
      <!-- Micro Size - Compact with Popover -->
      <Popover 
        v-if="size === 'micro'" 
        v-model:open="popoverOpen">
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            class="px-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 font-mono text-xs text-center"
            :class="triggerClasses"
          >
            {{ displayId }}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          class="p-0 w-80" 
          align="center">
          <div class="p-4">
            <CommonResourceCardContent 
              :data="data"
              :resource-type="resourceType"
              :fields="popoverFields"
              size="popover"
            />
            <div class="mt-3 pt-2 border-gray-100 border-t">
              <NuxtLink
                :to="detailUrl"
                class="block px-3 py-2 rounded w-full font-medium text-xs text-center transition-colors"
                :class="actionButtonClasses"
              >
                View {{ resourceType.charAt(0).toUpperCase() + resourceType.slice(1) }} Details
              </NuxtLink>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <!-- Small Size - Preview Card -->
      <NuxtLink 
        v-else-if="size === 'small'" 
        :to="detailUrl" 
        class="block">
        <CommonResourceCardContent 
          :data="data"
          :resource-type="resourceType"
          :fields="previewFields"
          size="small"
        />
      </NuxtLink>

      <!-- Medium Size - Feature/Stats Card -->
      <div v-else-if="size === 'medium'">
        <CommonResourceCardContent 
          :data="data"
          :resource-type="resourceType"
          :fields="mediumFields"
          size="medium"
        />
        <div 
          v-if="actions && actions.length > 0" 
          class="mt-4 pt-4 pl-4 border-gray-100 border-t">
          <div class="flex gap-2">
            <Button
              v-for="action in actions"
              :key="action.label"
              :variant="action.variant || 'outline'"
              :size="action.size || 'sm'"
              @click="action.onClick"
            >
              {{ action.label }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Large Size - Detailed View -->
      <div v-else-if="size === 'large'">
        <ResourceCardContent 
          :data="data"
          :resource-type="resourceType"
          :fields="detailFields"
          size="large"
        />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts" generic="T extends { uuid?: string, id?: string }">
import { computed, ref } from 'vue'
import { Card } from '~ui/components/ui/card'
import { Button } from '~ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~ui/components/ui/popover'

export interface CardAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'destructive' | 'ghost'
  size?: 'sm' | 'lg'
}

export interface CardField {
  key: string
  label: string
  type?: 'text' | 'badge' | 'date' | 'number' | 'percentage' | 'link' | 'uuid'
  colorScheme?: string
  format?: (value: unknown) => string
}

interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  resourceType: 'trial' | 'patient' | 'site' | 'user' | 'document' | 'adverse-event' | 'gdpr-consent' | 'regulatory-approval' | 'visit' | 'endpoint' | 'eligibility' | 'protocol' | 'audit'
  data?: T
  loading?: boolean
  error?: boolean
  onRetry?: () => void
  clickable?: boolean
  detailUrl?: string
  actions?: CardAction[]
  // Field configurations for different sizes
  popoverFields?: CardField[]
  previewFields?: CardField[]
  mediumFields?: CardField[]
  detailFields?: CardField[]
}

const props = withDefaults(defineProps<Props>(), {
  // @ts-expect-error generic type
  data: () => ({}),
  loading: false,
  error: false,
  onRetry: undefined,
  clickable: true,
  detailUrl: '',
  actions: () => [],
  popoverFields: () => [],
  previewFields: () => [],
  mediumFields: () => [],
  detailFields: () => []
})

const popoverOpen = ref(false)

// Color scheme mapping
const colorSchemes = {
  trial: {
    primary: 'blue',
    classes: 'text-blue-600 hover:text-blue-800',
    focus: 'focus:ring-blue-500',
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-700'
  },
  patient: {
    primary: 'purple',
    classes: 'text-purple-600 hover:text-purple-800',
    focus: 'focus:ring-purple-500',
    bg: 'bg-purple-50 hover:bg-purple-100',
    text: 'text-purple-700'
  },
  site: {
    primary: 'green',
    classes: 'text-green-600 hover:text-green-800',
    focus: 'focus:ring-green-500',
    bg: 'bg-green-50 hover:bg-green-100',
    text: 'text-green-700'
  },
  user: {
    primary: 'indigo',
    classes: 'text-indigo-600 hover:text-indigo-800',
    focus: 'focus:ring-indigo-500',
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    text: 'text-indigo-700'
  },
  document: {
    primary: 'orange',
    classes: 'text-orange-600 hover:text-orange-800',
    focus: 'focus:ring-orange-500',
    bg: 'bg-orange-50 hover:bg-orange-100',
    text: 'text-orange-700'
  },
  'adverse-event': {
    primary: 'red',
    classes: 'text-red-600 hover:text-red-800',
    focus: 'focus:ring-red-500',
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-700'
  },
  'gdpr-consent': {
    primary: 'teal',
    classes: 'text-teal-600 hover:text-teal-800',
    focus: 'focus:ring-teal-500',
    bg: 'bg-teal-50 hover:bg-teal-100',
    text: 'text-teal-700'
  },
  'regulatory-approval': {
    primary: 'cyan',
    classes: 'text-cyan-600 hover:text-cyan-800',
    focus: 'focus:ring-cyan-500',
    bg: 'bg-cyan-50 hover:bg-cyan-100',
    text: 'text-cyan-700'
  },
  visit: {
    primary: 'emerald',
    classes: 'text-emerald-600 hover:text-emerald-800',
    focus: 'focus:ring-emerald-500',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-700'
  },
  endpoint: {
    primary: 'violet',
    classes: 'text-violet-600 hover:text-violet-800',
    focus: 'focus:ring-violet-500',
    bg: 'bg-violet-50 hover:bg-violet-100',
    text: 'text-violet-700'
  },
  eligibility: {
    primary: 'rose',
    classes: 'text-rose-600 hover:text-rose-800',
    focus: 'focus:ring-rose-500',
    bg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-700'
  },
  protocol: {
    primary: 'gray',
    classes: 'text-gray-600 hover:text-gray-800',
    focus: 'focus:ring-gray-500',
    bg: 'bg-gray-50 hover:bg-gray-100',
    text: 'text-gray-700'
  },
  audit: {
    primary: 'slate',
    classes: 'text-slate-600 hover:text-slate-800',
    focus: 'focus:ring-slate-500',
    bg: 'bg-slate-50 hover:bg-slate-100',
    text: 'text-slate-700'
  }
}

// Computed properties
const cardComponent = computed(() => {
  return props.size === 'micro' ? 'div' : Card
})

const cardProps = computed(() => {
  if (props.size === 'micro') return {}
  return {
    class: 'overflow-hidden'
  }
})

const sizeClasses = computed(() => {
  const classes = {
    micro: '',
    small: 'w-full max-w-sm hover:shadow-md transition-shadow',
    medium: 'w-full max-w-md',
    large: 'w-full'
  }
  return classes[props.size]
})

const colorClasses = computed(() => {
  const scheme = colorSchemes[props.resourceType]
  if (props.size === 'micro') return ''
  
  return props.clickable && props.size === 'small' 
    ? `hover:border-${scheme.primary}-200` 
    : ''
})

const triggerClasses = computed(() => {
  const scheme = colorSchemes[props.resourceType]
  return `${scheme.classes} ${scheme.focus}`
})

const actionButtonClasses = computed(() => {
  const scheme = colorSchemes[props.resourceType]
  return `${scheme.bg} ${scheme.text}`
})

const displayId = computed(() => {
  if (!props.data) return '...'
  return (props.data.uuid as string)?.slice(-8) || (props.data.id as string)?.slice(-8) || '...'
})

const detailUrl = computed(() => {
  if (props.detailUrl) return props.detailUrl
  if (!props.data) return '#'
  
  const baseUrls = {
    trial: '/trials',
    patient: '/patients', 
    site: '/sites',
    user: '/users',
    document: '/documents',
    'adverse-event': '/adverse-events',
    'gdpr-consent': '/gdpr-consent',
    'regulatory-approval': '/regulatory-approvals',
    visit: '/visits',
    endpoint: '/endpoints',
    eligibility: '/eligibility',
    protocol: '/protocols',
    audit: '/audits'
  }
  
  const id = props.data.uuid || props.data.id
  return `${baseUrls[props.resourceType]}/${id}`
})

// Default field configurations
const defaultFields = computed(() => {
  const common = {
    trial: {
      popover: [
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'indication', label: 'Indication', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
        { key: 'phase', label: 'Phase', type: 'text' as const },
        { key: 'startDate', label: 'Start Date', type: 'date' as const }
      ],
      preview: [
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'indication', label: 'Indication', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
        { key: 'phase', label: 'Phase', type: 'text' as const }
      ],
      medium: [
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'indication', label: 'Indication', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'blue' },
        { key: 'phase', label: 'Phase', type: 'text' as const },
        { key: 'startDate', label: 'Start Date', type: 'date' as const },
        { key: 'estimatedEndDate', label: 'Est. End Date', type: 'date' as const }
      ]
    },
    patient: {
      popover: [
        { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'purple' },
        { key: 'consentStatus', label: 'Consent', type: 'badge' as const, colorScheme: 'purple' },
        { key: 'enrollmentDate', label: 'Enrolled', type: 'date' as const }
      ],
      preview: [
        { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'purple' },
        { key: 'consentStatus', label: 'Consent', type: 'badge' as const, colorScheme: 'purple' }
      ],
      medium: [
        { key: 'subjectId', label: 'Subject ID', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'purple' },
        { key: 'consentStatus', label: 'Consent', type: 'badge' as const, colorScheme: 'purple' },
        { key: 'enrollmentDate', label: 'Enrolled', type: 'date' as const },
        { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const }
      ]
    },
    site: {
      popover: [
        { key: 'name', label: 'Site Name', type: 'text' as const },
        { key: 'address', label: 'Address', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'green' },
        { key: 'patientsEnrolled', label: 'Patients', type: 'number' as const }
      ],
      preview: [
        { key: 'name', label: 'Site Name', type: 'text' as const },
        { key: 'address', label: 'Address', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'green' }
      ],
      medium: [
        { key: 'name', label: 'Site Name', type: 'text' as const },
        { key: 'address', label: 'Address', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'green' },
        { key: 'patientsEnrolled', label: 'Patients', type: 'number' as const },
        { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const }
      ]
    },
    user: {
      popover: [
        { key: 'name', label: 'Name', type: 'text' as const },
        { key: 'email', label: 'Email', type: 'text' as const },
        { key: 'role', label: 'Role', type: 'badge' as const, colorScheme: 'indigo' }
      ],
      preview: [
        { key: 'name', label: 'Name', type: 'text' as const },
        { key: 'email', label: 'Email', type: 'text' as const },
        { key: 'role', label: 'Role', type: 'badge' as const, colorScheme: 'indigo' }
      ],
      medium: [
        { key: 'name', label: 'Name', type: 'text' as const },
        { key: 'email', label: 'Email', type: 'text' as const },
        { key: 'role', label: 'Role', type: 'badge' as const, colorScheme: 'indigo' },
        { key: 'lastLogin', label: 'Last Login', type: 'date' as const }
      ]
    },
    document: {
      popover: [
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'type', label: 'Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const    , colorScheme: 'orange' },
        { key: 'uploadedAt', label: 'Uploaded', type: 'date' as const } 

      ],
      preview: [
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'type', label: 'Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'orange' }
      ],
      medium: [
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'type', label: 'Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'orange' },
        { key: 'uploadedAt', label: 'Uploaded', type: 'date' as const },
        { key: 'size', label: 'Size', type: 'text' as const, format: (value: unknown) => `${value} MB` }
      ]
    },
    'adverse-event': {  
      popover: [
        { key: 'eventType', label: 'Event Type', type: 'text' as const },
        { key: 'severity', label: 'Severity', type: 'badge' as const, colorScheme: 'red' },
        { key: 'reportedAt', label: 'Reported', type: 'date' as const }
      ],
      preview: [
        { key: 'eventType', label: 'Event Type', type: 'text' as const },
        { key: 'severity', label: 'Severity', type: 'badge' as const, colorScheme: 'red' }
      ],
      medium: [
        { key: 'eventType', label: 'Event Type', type: 'text' as const },
        { key: 'severity', label: 'Severity', type: 'badge' as const, colorScheme: 'red' },
        { key: 'reportedAt', label: 'Reported', type: 'date' as const }
      ]
    },
    'gdpr-consent': {
      popover: [
        { key: 'consentType', label: 'Consent Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'teal' },
        { key: 'grantedAt', label: 'Granted', type: 'date' as const }
      ],  
      preview: [
        { key: 'consentType', label: 'Consent Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'teal' }
      ],
      medium: [
        { key: 'consentType', label: 'Consent Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge ' as const, colorScheme: 'teal' },
        { key: 'grantedAt', label: 'Granted', type: 'date' as const }
      ]
    },
    'regulatory-approval': {
      popover: [
        { key: 'approvalType', label: 'Approval Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'cyan' },
        { key: 'approvedAt', label: 'Approved', type: 'date' as const }
      ],
      preview: [
        { key: 'approvalType', label: 'Approval Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'cyan' }
      ],
      medium: [
        { key: 'approvalType', label: 'Approval Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'cyan' },
        { key: 'approvedAt', label: 'Approved', type: 'date' as const }
      ]
    },
    visit: {
      popover: [
        { key: 'visitNumber', label: 'Visit #', type: 'number' as const },
        { key: 'date', label: 'Date', type: 'date' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'emerald' }
      ],
      preview: [
        { key: 'visitNumber', label: 'Visit #', type: 'number' as const },
        { key: 'date', label: 'Date', type: 'date' as const }
      ],
      medium: [
        { key: 'visitNumber', label: 'Visit #', type: 'number' as const },
        { key: 'date', label: 'Date', type: 'date' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'emerald' }
      ]
    },
    endpoint: {
      popover: [
        { key: 'name', label: 'Endpoint', type: 'text' as const },
        { key: 'type', label: 'Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'violet' }
      ],
      preview: [
        { key: 'name', label: 'Endpoint', type: 'text' as const },
        { key: 'type', label: 'Type', type: 'text' as const }
      ],
      medium: [
        { key: 'name', label: 'Endpoint', type: 'text' as const },
        { key: 'type', label: 'Type', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'violet' }
      ]
    },
    eligibility: {
      popover: [
        { key: 'criteria', label: 'Criteria', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'rose' }
      ],
      preview: [
        { key: 'criteria', label: 'Criteria', type: 'text' as const }
      ],
      medium: [
        { key: 'criteria', label: 'Criteria', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'rose' }
      ]
    },
    protocol: {
      popover: [
        { key: 'protocolNumber', label: 'Protocol #', type: 'text' as const },
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'gray' }
      ],
      preview: [
        { key: 'protocolNumber', label: 'Protocol #', type: 'text' as const },
        { key: 'title', label: 'Title', type: 'text' as const }
      ],
      medium: [
        { key: 'protocolNumber', label: 'Protocol #', type: 'text' as const },
        { key: 'title', label: 'Title', type: 'text' as const },
        { key: 'status', label: 'Status', type: 'badge' as const, colorScheme: 'gray' }
      ]
    },
    audit: {
      popover: [
        { key: 'action', label: 'Action', type: 'text' as const },
        { key: 'entityType', label: 'Entity Type', type: 'text' as const },
        { key: 'timestamp', label: 'Timestamp', type: 'date' as const }
      ],
      preview: [
        { key: 'action', label: 'Action', type: 'text' as const },
        { key: 'entityType', label: 'Entity Type', type: 'text' as const }
      ],
      medium: [
        { key: 'action', label: 'Action', type: 'text' as const },
        { key: 'entityType', label: 'Entity Type', type: 'text' as const },
        { key: 'timestamp', label: 'Timestamp', type: 'date' as const }
      ]
    }
  }
  return common[props.resourceType] || { popover: [], preview: [], medium: [] }
})

const popoverFields = computed(() => props.popoverFields.length > 0 ? props.popoverFields : defaultFields.value.popover)
const previewFields = computed(() => props.previewFields.length > 0 ? props.previewFields : defaultFields.value.preview)
const mediumFields = computed(() => props.mediumFields.length > 0 ? props.mediumFields : defaultFields.value.medium)
const detailFields = computed(() => props.detailFields || [])

const handleClick = () => {
  if (props.clickable && props.size !== 'micro' && props.detailUrl) {
    navigateTo(props.detailUrl)
  }
}
</script>

<style scoped>
.resource-card {
  transition: all 0.2s ease;
}

.resource-card:hover {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>

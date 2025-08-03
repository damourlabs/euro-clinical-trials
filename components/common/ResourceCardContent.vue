<template>
  <div class="resource-card-content">
    <!-- Popover Size -->
    <div v-if="size === 'popover'">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 text-sm truncate">
            {{ getFieldValue(fields[0]) }}
          </h3>
          <p 
            v-if="fields[1]" 
            class="mt-1 text-gray-500 text-xs">
            {{ getFieldValue(fields[1]) }}
          </p>
        </div>
        <div
          v-if="statusField"
          class="ml-2">
          <StatusBadge 
            :status="getFieldValue(statusField)"
            :type="resourceType"
            :color-scheme="statusField.colorScheme"
          />
        </div>
      </div>
      
      <div class="space-y-2">
        <div 
          v-for="field in remainingFields" 
          :key="field.key" 
          class="flex justify-between text-xs">
          <span class="text-gray-600">{{ field.label }}:</span>
          <span class="font-medium">{{ formatFieldValue(field, getFieldValue(field)) }}</span>
        </div>
      </div>
    </div>

    <!-- Small Size -->
    <div
      v-else-if="size === 'small'"
      class="p-4">
      <div class="flex justify-between items-start">
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-gray-900 text-sm truncate">
            {{ getFieldValue(fields[0]) }}
          </h4>
          <p 
            v-if="fields[1]" 
            class="mt-1 text-gray-500 text-xs line-clamp-1">
            {{ getFieldValue(fields[1]) }}
          </p>
        </div>
        <div
          v-if="statusField"
          class="ml-2">
          <StatusBadge 
            :status="getFieldValue(statusField)"
            :type="resourceType"
            :color-scheme="statusField.colorScheme"
          />
        </div>
      </div>
      
      <div
        v-if="remainingFields.length > 0"
        class="flex justify-between mt-3 text-gray-500 text-xs">
        <span v-if="remainingFields[0]">{{ formatFieldValue(remainingFields[0], getFieldValue(remainingFields[0])) }}</span>
        <span v-if="remainingFields[1]">{{ formatFieldValue(remainingFields[1], getFieldValue(remainingFields[1])) }}</span>
      </div>
    </div>

    <!-- Medium Size -->
    <CardContent
      v-else-if="size === 'medium'"
      class="p-6">
      <div class="space-y-4">
        <div class="flex justify-between items-start">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-lg truncate">
              {{ getFieldValue(fields[0]) }}
            </h3>
            <p 
              v-if="fields[1]" 
              class="mt-1 text-gray-600 text-sm">
              {{ getFieldValue(fields[1]) }}
            </p>
          </div>
          <div
            v-if="statusField"
            class="ml-4">
            <StatusBadge 
              :status="getFieldValue(statusField)"
              :type="resourceType"
              :color-scheme="statusField.colorScheme"
            />
          </div>
        </div>

        <div 
          v-if="remainingFields.length > 0" 
          class="gap-4 grid grid-cols-2">
          <div 
            v-for="field in remainingFields" 
            :key="field.key">
            <Label class="font-medium text-gray-600 text-sm">{{ field.label }}</Label>
            <p class="mt-1 text-sm">{{ formatFieldValue(field, getFieldValue(field)) }}</p>
          </div>
        </div>
      </div>
    </CardContent>

    <!-- Large Size -->
    <div
      v-else-if="size === 'large'"
      class="space-y-6">
      <div 
        v-for="section in groupedFields" 
        :key="section.title">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">{{ section.title }}</h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="field in section.fields" 
            :key="field.key">
            <Label class="font-medium text-gray-600 text-sm">{{ field.label }}</Label>
            <div class="mt-1">
              <component 
                :is="getFieldComponent(field)"
                v-bind="getFieldProps(field)"
                :value="getFieldValue(field)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CardContent } from '~ui/components/ui/card'
import { Label } from '~ui/components/ui/label'
import StatusBadge from './field/StatusBadge.vue'

export interface CardField {
  key: string
  label: string
  type?: 'text' | 'badge' | 'date' | 'number' | 'percentage' | 'link'
  colorScheme?: string
  format?: (value: unknown) => string
}

interface Props {
  data: Record<string, unknown>
  resourceType: 'trial' | 'patient' | 'site' | 'user' | 'document' | 'adverse-event' | 'gdpr-consent' | 'regulatory-approval' | 'visit' | 'endpoint' | 'eligibility' | 'protocol' | 'audit'
  fields: CardField[]
  size: 'popover' | 'small' | 'medium' | 'large'
}

const props = defineProps<Props>()

const statusField = computed(() => {
  return props.fields.find(field => field.key === 'status' || field.type === 'badge')
})

const remainingFields = computed(() => {
  const statusKey = statusField.value?.key
  return props.fields.slice(2).filter(field => field.key !== statusKey)
})

const groupedFields = computed(() => {
  // For large size, group fields into logical sections
  return [
    {
      title: 'Basic Information',
      fields: props.fields
    }
  ]
})

const getFieldValue = (field: CardField | undefined): string => {
  if (!field || !props.data) return 'N/A'
  const value = props.data[field.key]
  if (value === null || value === undefined) return 'N/A'
  return String(value)
}

const formatFieldValue = (field: CardField, value: string): string => {
  if (!field || !value || value === 'N/A') return 'N/A'
  
  if (field.format) {
    return field.format(value)
  }
  
  switch (field.type) {
    case 'date':
      return formatDate(value)
    case 'percentage':
      return `${value}%`
    case 'number':
      return value
    default:
      return value
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

const getFieldComponent = (field: CardField): string => {
  switch (field.type) {
    case 'badge':
      return 'Badge'
    case 'percentage':
      return 'div' // We'll handle percentage display inline
    default:
      return 'p'
  }
}

const getFieldProps = (field: CardField) => {
  switch (field.type) {
    case 'badge':
      return {
        class: getBadgeClasses(field.colorScheme || props.resourceType)
      }
    default:
      return {
        class: 'text-sm'
      }
  }
}

const getBadgeClasses = (colorScheme: string): string => {
  const schemes = {
    trial: 'bg-blue-100 text-blue-800',
    patient: 'bg-purple-100 text-purple-800',
    site: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    audit: 'bg-slate-100 text-slate-800'
  }
  return schemes[colorScheme as keyof typeof schemes] || schemes.gray
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
</style>

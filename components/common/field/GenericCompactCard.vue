<template>
  <Popover v-model:open="isOpen">
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
      align="center"
    >
      <div
        v-if="loading"
        class="p-4 text-gray-500 text-center"
      >
        <div class="mx-auto border-gray-500 border-b-2 rounded-full w-6 h-6 animate-spin" />
        <p class="mt-2">Loading {{ entityType }} information...</p>
      </div>
      
      <div
        v-else-if="error"
        class="p-4 text-red-500 text-center"
      >
        <p>Failed to load {{ entityType }} information</p>
      </div>
      
      <div
        v-else-if="entity"
        class="p-4"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-sm truncate">
              {{ entity[titleField] }}
            </h3>
            <p 
              v-if="entity[subtitleField]"
              class="mt-1 text-gray-500 text-xs"
            >
              {{ entity[subtitleField] }}
            </p>
          </div>
          <StatusBadge 
            v-if="statusField && entity[statusField]"
            :status="entity[statusField]"
            :type="entityType"
            class="ml-2"
          />
        </div>

        <!-- Content -->
        <div class="space-y-2">
          <div 
            v-for="field in displayFields" 
            :key="field.key"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">{{ field.label }}:</span>
            <span class="font-medium text-gray-900">
              <component 
                :is="getFieldComponent(field)"
                v-bind="getFieldProps(field, entity[field.key])"
              >
                {{ getFieldValue(field, entity[field.key]) }}
              </component>
            </span>
          </div>
        </div>

        <!-- Footer with action button to go see in more detail -->
        <div class="mt-3 pt-3 border-gray-200 border-t">
          <Button 
            variant="outline" 
            class="w-full"
          >
            <NuxtLink
              :to="`/${entityType}s/${entityUuid}`"
              class="w-full">
              View Details
            </NuxtLink>
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, watch } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '~ui/components/ui/popover'
import { Button } from '~ui/components/ui/button'
import StatusBadge from './StatusBadge.vue'
import FieldDate from './FieldDate.vue'
import PercentageField from './PercentageField.vue'

interface DisplayField {
  key: keyof { [K in keyof T as T[K] extends string ? K : never]: T[K] }
  label: string
  type?: 'text' | 'date' | 'percentage' | 'status'
  format?: string
}

interface Props {
  entityUuid: string
  entityType: 'trial' | 'site' | 'patient' | 'user' | 'protocol' | 'document' | 'adverse-event' | 'gdpr-consent' | 'regulatory-approval' | 'visit' | 'endpoint' | 'eligibility' | 'audit' | 'protocol-deviation' | 'generic'
  fetchFunction: (uuid: string) => Promise<T>
  titleField: keyof T
  subtitleField: keyof T
  statusField?: keyof { [K in keyof T as T[K] extends string ? K : never]: T[K] }
  displayFields?: DisplayField[]
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal'
}

const props = withDefaults(defineProps<Props>(), {
    statusField: undefined,
  colorScheme: 'blue',
  displayFields: () => []
})

const isOpen = ref(false)
const entity = ref<T>()
const loading = ref(false)
const error = ref(false)

const displayId = computed(() => props.entityUuid.slice(-8))

const triggerClasses = computed(() => {
  const colorClasses = {
    blue: 'focus:ring-blue-500 text-blue-600 hover:text-blue-800',
    green: 'focus:ring-green-500 text-green-600 hover:text-green-800',
    purple: 'focus:ring-purple-500 text-purple-600 hover:text-purple-800',
    orange: 'focus:ring-orange-500 text-orange-600 hover:text-orange-800',
    red: 'focus:ring-red-500 text-red-600 hover:text-red-800',
    teal: 'focus:ring-teal-500 text-teal-600 hover:text-teal-800'
  }
  return colorClasses[props.colorScheme]
})

// watch(isOpen, async (newValue) => {
//   if (newValue && !entity.value && !loading.value) {
//     await fetchEntity()
//   }
// })

onBeforeMount(() => {
  if (props.entityUuid) {
    fetchEntity()
  }
})

async function fetchEntity() {
  if (!props.entityUuid) return
  
  loading.value = true
  error.value = false
  
  try {
    entity.value = await props.fetchFunction(props.entityUuid)
  } catch (err) {
    console.error(`Failed to fetch ${props.entityType}:`, err)
    error.value = true
  } finally {
    loading.value = false
  }
}

function getFieldComponent(field: DisplayField) {
  switch (field.type) {
    case 'date':
      return FieldDate
    case 'percentage':
      return PercentageField
    case 'status':
      return StatusBadge
    default:
      return 'span'
  }
}

function getFieldProps(field: DisplayField, value: unknown) {
  switch (field.type) {
    case 'date':
      return {
        date: value,
        format: field.format || 'short',
        align: 'right'
      }
    case 'percentage':
      return {
        value: value,
        showProgressBar: false,
        align: 'right'
      }
    case 'status':
      return {
        status: value,
        type: props.entityType
      }
    default:
      return {}
  }
}

function getFieldValue(field: DisplayField, value: unknown) {
  if (['date', 'percentage', 'status'].includes(field.type || '')) {
    return '' // Component will handle display
  }
  return value || 'N/A'
}
</script>

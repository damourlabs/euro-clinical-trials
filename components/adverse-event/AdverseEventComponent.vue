<template>
  <div 
    v-if="adverseEvent" 
    class="space-y-6">
    <!-- Main Adverse Event Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">Adverse Event #{{ adverseEvent.uuid.slice(-8) }}</h1>
          <p class="mb-4 text-gray-600">{{ adverseEvent.description }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Severity:</span>
              <StatusBadge 
                :status="adverseEvent.severity" 
                :variant="getSeverityVariant(adverseEvent.severity)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Outcome:</span>
              <StatusBadge 
                :status="adverseEvent.outcome" 
                :variant="getOutcomeVariant(adverseEvent.outcome)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Trial Related:</span>
              <StatusBadge 
                :status="adverseEvent.relatedToTrial ? 'Yes' : 'No'" 
                :variant="adverseEvent.relatedToTrial ? 'warning' : 'default'"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Patient:</span>
              <UuidField 
                :uuid="adverseEvent.patientUuid" 
                :detail-url="`/patients/${adverseEvent.patientUuid}`"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Date Occurred:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(adverseEvent.eventDate) }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Reported At:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(adverseEvent.reportedAt) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in adverseEventActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Timeline</h2>
      
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="bg-blue-100 p-2 rounded-full">
            <Icon 
              name="i-heroicons-calendar" 
              class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="font-medium text-gray-900">Event Occurred</p>
            <p class="text-gray-600 text-sm">{{ formatDate(adverseEvent.eventDate) }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="bg-yellow-100 p-2 rounded-full">
            <Icon 
              name="i-heroicons-exclamation-triangle" 
              class="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p class="font-medium text-gray-900">Reported</p>
            <p class="text-gray-600 text-sm">{{ formatDate(adverseEvent.reportedAt) }}</p>
          </div>
        </div>
        
        <div 
          v-if="adverseEvent.resolvedAt"
          class="flex items-center gap-4">
          <div class="bg-green-100 p-2 rounded-full">
            <Icon 
              name="i-heroicons-check-circle" 
              class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="font-medium text-gray-900">Resolved</p>
            <p class="text-gray-600 text-sm">{{ formatDate(adverseEvent.resolvedAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Details -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Additional Information</h2>
      
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 text-sm">
        <div>
          <span class="font-medium text-gray-700">Created At:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(adverseEvent.createdAt) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Last Updated:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(adverseEvent.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdverseEvent } from '~/server/database/schema'
import { StatusBadge, UuidField } from '~/components/common/field'

interface Props {
  adverseEventId: string
}

const props = defineProps<Props>()

// Fetch adverse event data
const adverseEventStore = useAdverseEventsStore()
const adverseEvent = ref<AdverseEvent>()

onMounted(async () => {
  try {
    const result = await adverseEventStore.fetchById(props.adverseEventId)
    if (result) {
      adverseEvent.value = result
    }
  } catch (error) {
    console.error('Failed to fetch adverse event:', error)
  }
})

// Helper functions
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString()
}

function getSeverityVariant(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'mild':
      return 'default'
    case 'moderate':
      return 'warning'
    case 'severe':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getOutcomeVariant(outcome: string): string {
  switch (outcome?.toLowerCase()) {
    case 'resolved':
      return 'success'
    case 'ongoing':
      return 'warning'
    case 'fatal':
      return 'destructive'
    case 'resolved with sequelae':
      return 'secondary'
    default:
      return 'default'
  }
}

// Action buttons
const adverseEventActions = computed(() => [
  {
    label: 'Edit',
    variant: 'outline' as const,
    onClick: () => navigateTo(`/adverse-events/${props.adverseEventId}/edit`)
  },
  {
    label: 'Delete',
    variant: 'destructive' as const,
    onClick: () => {
      // Add delete confirmation logic
      console.log('Delete adverse event:', props.adverseEventId)
    }
  }
])
</script>

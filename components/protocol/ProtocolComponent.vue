<template>
  <div 
    v-if="protocol" 
    class="space-y-6">
    <!-- Main Protocol Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">{{ protocol.name }}</h1>
          <p class="mb-4 text-gray-600">{{ protocol.description || 'No description provided' }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Name:</span>
              <span class="ml-2 text-gray-900">{{ protocol.name }}</span>
            </div>
            <div v-if="protocol.version">
              <span class="font-medium text-gray-700">Version:</span>
              <span class="ml-2 text-gray-900">{{ protocol.version }}</span>
            </div>
            <div v-if="protocol.status">
              <span class="font-medium text-gray-700">Status:</span>
              <StatusBadge 
                :status="protocol.status" 
                :variant="getStatusVariant(protocol.status)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Created:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(protocol.createdAt) }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Last Updated:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(protocol.updatedAt) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in protocolActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Protocol Details -->
    <div 
      v-if="protocol.description"
      class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Protocol Description</h2>
      
      <div class="max-w-none prose">
        <p class="text-gray-700">{{ protocol.description }}</p>
      </div>
    </div>

    <!-- Version History -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Version Information</h2>
      
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 text-sm">
        <div>
          <span class="font-medium text-gray-700">Current Version:</span>
          <span class="ml-2 text-gray-900">{{ protocol.version || '1.0' }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Status:</span>
          <StatusBadge 
            :status="protocol.status || 'Active'" 
            :variant="getStatusVariant(protocol.status)"
            class="ml-2" />
        </div>
        <div>
          <span class="font-medium text-gray-700">Created:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(protocol.createdAt) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Last Modified:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(protocol.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Related Trials -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Related Trials</h2>
      
      <div class="text-gray-600 text-sm">
        <!-- This would be populated with actual trial data in a real implementation -->
        <p>Trials using this protocol will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Protocol } from '~/server/database/schema'

interface Props {
  protocolId: string
}

const props = defineProps<Props>()

// Fetch protocol data
const protocolStore = useProtocolsStore()
const protocol = ref<Protocol>()

onMounted(async () => {
  try {
    const result = await protocolStore.fetchById(props.protocolId)
    if (result) {
      protocol.value = result
    }
  } catch (error) {
    console.error('Failed to fetch protocol:', error)
  }
})

// Helper functions
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString()
}

function getStatusVariant(status: string): string {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success'
    case 'draft':
      return 'warning'
    case 'archived':
      return 'secondary'
    case 'inactive':
      return 'destructive'
    default:
      return 'default'
  }
}

// Action buttons
const protocolActions = computed(() => [
  {
    label: 'Edit',
    variant: 'outline' as const,
    onClick: () => navigateTo(`/protocols/${props.protocolId}/edit`)
  },
  {
    label: 'Archive',
    variant: 'secondary' as const,
    onClick: () => {
      // Add archive logic
      console.log('Archive protocol:', props.protocolId)
    }
  },
  {
    label: 'Delete',
    variant: 'destructive' as const,
    onClick: () => {
      // Add delete confirmation logic
      console.log('Delete protocol:', props.protocolId)
    }
  }
])
</script>

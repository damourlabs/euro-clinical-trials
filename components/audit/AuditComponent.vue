<template>
  <div 
    v-if="audit" 
    class="space-y-6">
    <!-- Main Audit Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">Audit Log #{{ audit.uuid.slice(-8) }}</h1>
          <p class="mb-4 text-gray-600">{{ audit.action }} action on {{ audit.entityType }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Action:</span>
              <StatusBadge 
                :status="audit.action" 
                :variant="getActionVariant(audit.action)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Entity Type:</span>
              <span class="ml-2 text-gray-900">{{ audit.entityType }}</span>
            </div>
            <div v-if="audit.entityUuid">
              <span class="font-medium text-gray-700">Entity ID:</span>
              <UuidField 
                :uuid="audit.entityUuid" 
                class="ml-2" />
            </div>
            <div v-if="audit.userUuid">
              <span class="font-medium text-gray-700">User:</span>
              <UuidField 
                :uuid="audit.userUuid" 
                :detail-url="`/users/${audit.userUuid}`"
                class="ml-2" />
            </div>
            <div v-if="audit.trialUuid">
              <span class="font-medium text-gray-700">Trial:</span>
              <UuidField 
                :uuid="audit.trialUuid" 
                :detail-url="`/trials/${audit.trialUuid}`"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Timestamp:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(audit.timestamp) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in auditActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Technical Details -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Technical Details</h2>
      
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 text-sm">
        <div v-if="audit.ipAddress">
          <span class="font-medium text-gray-700">IP Address:</span>
          <span class="ml-2 font-mono text-gray-900">{{ audit.ipAddress }}</span>
        </div>
        <div v-if="audit.sessionId">
          <span class="font-medium text-gray-700">Session ID:</span>
          <UuidField 
            :uuid="audit.sessionId" 
            class="ml-2" />
        </div>
        <div 
          v-if="audit.userAgent" 
          class="md:col-span-2">
          <span class="font-medium text-gray-700">User Agent:</span>
          <span class="ml-2 text-gray-900 break-all">{{ audit.userAgent }}</span>
        </div>
      </div>
    </div>

    <!-- Changes Details -->
    <div 
      v-if="audit.changes || audit.oldValues || audit.newValues"
      class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Change Details</h2>
      
      <div class="space-y-4">
        <div v-if="audit.changes">
          <h3 class="mb-2 font-medium text-gray-700">Summary:</h3>
          <pre class="bg-gray-50 p-3 rounded overflow-x-auto text-sm">{{ JSON.stringify(audit.changes, null, 2) }}</pre>
        </div>
        
        <div 
          v-if="audit.oldValues" 
          class="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div>
            <h3 class="mb-2 font-medium text-gray-700">Old Values:</h3>
            <pre class="bg-red-50 p-3 rounded overflow-x-auto text-sm">{{ JSON.stringify(audit.oldValues, null, 2) }}</pre>
          </div>
          
          <div v-if="audit.newValues">
            <h3 class="mb-2 font-medium text-gray-700">New Values:</h3>
            <pre class="bg-green-50 p-3 rounded overflow-x-auto text-sm">{{ JSON.stringify(audit.newValues, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuditLog } from '~/server/database/schema'
import { StatusBadge, UuidField } from '~/components/common/field'

interface Props {
  auditId: string
}

const props = defineProps<Props>()

// Fetch audit data
const auditStore = useAuditsStore()
const audit = ref<AuditLog>()

onMounted(async () => {
  try {
    const result = await auditStore.fetchById(props.auditId)
    if (result) {
      audit.value = result
    }
  } catch (error) {
    console.error('Failed to fetch audit:', error)
  }
})

// Helper functions
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString()
}

function getActionVariant(action: string): string {
  switch (action?.toLowerCase()) {
    case 'create':
      return 'success'
    case 'update':
      return 'warning'
    case 'delete':
      return 'destructive'
    case 'view':
      return 'default'
    default:
      return 'secondary'
  }
}

// Action buttons
const auditActions = computed(() => [
  {
    label: 'Edit',
    variant: 'outline' as const,
    onClick: () => navigateTo(`/audits/${props.auditId}/edit`)
  },
  {
    label: 'Delete',
    variant: 'destructive' as const,
    onClick: () => {
      // Add delete confirmation logic
      console.log('Delete audit:', props.auditId)
    }
  }
])
</script>

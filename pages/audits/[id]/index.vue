<!-- pages/audits/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <template v-if="doWeHaveData">
      <AuditComponent :audit-id="auditId" />
    </template>

    <ResourceDetailLoadingFallback 
      v-else
      resource-type="audit" />
  </div>
</template>

<script setup lang="ts">
import type { AuditLog } from '~/server/database/schema'
import { ResourceDetailLoadingFallback } from '~/components/common'

// Route params
const route = useRoute()
const auditId = route.params.id as string

// Composables
const { fetchById } = useAuditsStore()

const audit = ref<AuditLog>()

onMounted(async () => {
    try {
        const val = await fetchById(auditId)
        if (val) {
            audit.value = val
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'Audit not found',
                message: `Audit with ID ${auditId} not found`
            })
        }
    } catch {
        throw createError({
            statusCode: 404,
            statusMessage: 'Audit not found',
            message: `Audit with ID ${auditId} not found`
        })
    }
})

definePageMeta({
  layout: 'simple',
  title: computed(() => audit.value ? `Audit ${audit.value.uuid} - CTMS` : 'Audit Details - CTMS'),
  meta: [
    { name: 'description', content: 'View detailed information about a specific audit log.' },
    { name: 'robots', content: 'noindex' }
  ]
})

const doWeHaveData = computed(() => { 
    return audit.value !== undefined && Object.keys(audit.value).length > 0
})
</script>

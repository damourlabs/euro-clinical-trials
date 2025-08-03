 <!-- pages/adverse-events/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <template v-if="doWeHaveData">
      <AdverseEventComponent :adverse-event-id="adverseEventId" />
    </template>

    <ResourceDetailLoadingFallback 
      v-else
      resource-type="adverse event" />
  </div>
</template>

<script setup lang="ts">
import type { AdverseEvent } from '~/server/database/schema'
import { ResourceDetailLoadingFallback } from '~/components/common'

// Route params
const route = useRoute()
const adverseEventId = route.params.id as string

// Composables
const { fetchById } = useAdverseEventsStore()

const adverseEvent = ref<AdverseEvent>()

onMounted(async () => {
    try {
        const val = await fetchById(adverseEventId)
        if (val) {
            adverseEvent.value = val
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'Adverse event not found',
                message: `Adverse event with ID ${adverseEventId} not found`
            })
        }
    } catch {
        throw createError({
            statusCode: 404,
            statusMessage: 'Adverse event not found',
            message: `Adverse event with ID ${adverseEventId} not found`
        })
    }
})

definePageMeta({
  layout: 'simple',
  title: computed(() => adverseEvent.value ? `Adverse Event ${adverseEvent.value.uuid} - CTMS` : 'Adverse Event Details - CTMS'),
  meta: [
    { name: 'description', content: 'View detailed information about a specific adverse event.' },
    { name: 'robots', content: 'noindex' }
  ]
})

const doWeHaveData = computed(() => { 
    return adverseEvent.value !== undefined && Object.keys(adverseEvent.value).length > 0
})
</script>

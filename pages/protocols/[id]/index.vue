<!-- pages/protocols/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <template v-if="doWeHaveData">
      <ProtocolComponent :protocol-id="protocolId" />
    </template>

    <ResourceDetailLoadingFallback 
      v-else
      resource-type="protocol" />
  </div>
</template>

<script setup lang="ts">
import type { Protocol } from '~/server/database/schema'
import { ResourceDetailLoadingFallback } from '~/components/common'

// Route params
const route = useRoute()
const protocolId = route.params.id as string

// Composables
const { fetchById } = useProtocolsStore()

const protocol = ref<Protocol>()

onMounted(async () => {
    try {
        const val = await fetchById(protocolId)
        if (val) {
            protocol.value = val
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'Protocol not found',
                message: `Protocol with ID ${protocolId} not found`
            })
        }
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Protocol not found',
            message: `Protocol with ID ${protocolId} not found`
        })
    }
})

const doWeHaveData = computed(() => { 
    return protocol.value !== undefined && Object.keys(protocol.value).length > 0
})

definePageMeta({
  layout: 'simple'
})
</script>

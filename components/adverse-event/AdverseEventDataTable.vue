<template>
  <DataTable
    v-if="adverseEvents && adverseEvents.length > 0"
    :columns="ADVERSE_EVENT_COLUMNS"
    :data="adverseEvents" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { ADVERSE_EVENT_COLUMNS } from '~/models/columns/adverse-events-column'
import type { AdverseEvent } from '~/server/database/schema'

defineProps<{
  adverseEvents: AdverseEvent[] | undefined
}>()
</script>

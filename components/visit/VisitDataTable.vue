<template>
  <DataTable
    v-if="visits && visits.length > 0"
    :columns="VISIT_COLUMNS_SIMPLE"
    :data="visits" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { VISIT_COLUMNS_SIMPLE } from '~/models/columns/visits-column-simple'
import type { Visit } from '~/server/database/schema'

defineProps<{
  visits: Visit[] | undefined
}>()
</script>

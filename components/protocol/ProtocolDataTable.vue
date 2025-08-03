<template>
  <DataTable
    v-if="protocols && protocols.length > 0"
    :columns="PROTOCOL_COLUMNS"
    :data="protocols" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { PROTOCOL_COLUMNS } from '~/models/columns/protocols-column';
import type { Protocol } from '~/server/database/schema'

defineProps<{
  protocols: Protocol[] | undefined
}>()
</script>

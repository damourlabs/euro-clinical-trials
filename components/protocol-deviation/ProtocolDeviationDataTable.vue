<template>
  <ResourceListComponent
    :columns="PROTOCOL_DEVIATION_COLUMNS  "
    :data="data"
  />
</template>

<script setup lang="ts">
import type { ProtocolDeviation } from '~/server/database/schema/regulatory'
import { PROTOCOL_DEVIATION_COLUMNS } from '~/models/columns/protocol-deviations-column'

defineProps<{
  data: ProtocolDeviation[]
}>()
</script>

<template>
  <DataTable
    v-if="audits && audits.length > 0"
    :columns="AUDIT_COLUMNS"
    :data="audits" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { AUDIT_COLUMNS } from '~/models/columns/audits-column'
import type { AuditLog } from '~/server/database/schema'

defineProps<{
  audits: AuditLog[] | undefined
}>()
</script>

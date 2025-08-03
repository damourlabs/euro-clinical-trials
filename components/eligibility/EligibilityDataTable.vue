<template>
  <DataTable
    v-if="eligibilityCriteria && eligibilityCriteria.length > 0"
    :columns="ELIGIBILITY_COLUMNS_SIMPLE"
    :data="eligibilityCriteria" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { ELIGIBILITY_COLUMNS_SIMPLE } from '~/models/columns/eligibility-column-simple'
import type { EligibilityCriteria } from '~/server/database/schema'

defineProps<{
  eligibilityCriteria: EligibilityCriteria[] | undefined
}>()
</script>

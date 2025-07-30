<template>
  <DataTable
    v-if="patients && patients.length > 0"
    :columns="PATIENT_COLUMNS"
    :data="patients" class="mb-6" />
</template>

<script setup lang="ts">
import { PATIENT_COLUMNS } from '~/models/columns/patients-column';
import type { Patient } from '~/server/database/schema';

defineProps<{
  patients: Patient[] | undefined
}>()




</script>


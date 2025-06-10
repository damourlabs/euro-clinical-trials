<template>
  <DataTable
    v-if="trials && trials.length > 0"
    :columns="TRIAL_COLUMNS"
    :data="trials" class="mb-6" />
</template>

<script setup lang="ts">
import { TRIAL_COLUMNS } from '~/models/columns/trials-column';
import type { Trial } from '~/models/trials';


defineProps<{
  trials: Trial[] | undefined
}>()




</script>


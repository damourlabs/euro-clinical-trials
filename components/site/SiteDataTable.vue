<template>
  <DataTable
    v-if="sites && sites.length > 0"
    :columns="SITE_COLUMNS"
    :data="sites" class="mb-6" />
</template>

<script setup lang="ts">
import { SITE_COLUMNS } from '~/models/columns/sites-column';
import type { Site } from '~/models/admin';

defineProps<{
  sites: Site[] | undefined
}>()




</script>


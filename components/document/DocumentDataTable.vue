<template>
  <DataTable
    v-if="documents && documents.length > 0"
    :columns="DOCUMENT_COLUMNS"
    :data="documents" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { DOCUMENT_COLUMNS } from '~/models/columns/documents-column'
import type { Document } from '~/server/database/schema'

defineProps<{
  documents: Document[] | undefined
}>()
</script>

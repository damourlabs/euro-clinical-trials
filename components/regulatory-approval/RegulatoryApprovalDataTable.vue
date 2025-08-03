<template>
  <DataTable
    v-if="regulatoryApprovals && regulatoryApprovals.length > 0"
    :columns="REGULATORY_APPROVAL_COLUMNS"
    :data="regulatoryApprovals" class="mb-6" />
</template>

<script setup lang="ts">
import { REGULATORY_APPROVAL_COLUMNS } from '~/models/columns/regulatory-approvals-column';
import type { RegulatoryApproval } from '~/server/database/schema';

defineProps<{
  regulatoryApprovals: RegulatoryApproval[] | undefined
}>()

</script>
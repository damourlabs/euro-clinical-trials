<template>
  <CommonResourceListComponent
    :items="regulatoryApprovals"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Regulatory Approvals</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/regulatory-approvals/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Approval
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <RegulatoryApprovalDataTable :regulatory-approvals="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No regulatory approvals found</template>
    <template #empty-description>
      Get started by adding your first regulatory approval. Click the "New Approval" button above.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/regulatory-approvals/create"
        icon="i-heroicons-plus">
        Add Approval
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading regulatory approvals...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading regulatory approvals</template>
    <template #error-message="{ error: errorMsg }">
      {{ errorMsg || 'There was an error loading regulatory approvals. Please try again.' }}
    </template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch regulatory approvals data asynchronously
const regulatoryApprovalsStore = useRegulatoryApprovalsStore()
const { items: regulatoryApprovals, hasItems, isEmpty, loading, hasError, error } = storeToRefs(regulatoryApprovalsStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await regulatoryApprovalsStore.fetchAll()
}
</script>

<template>
  <CommonResourceListComponent
    :items="audits"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Audit Logs</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/audits/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Audit
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <AuditDataTable :audits="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No audit logs found</template>
    <template #empty-description>
      Audit logs will appear here as actions are performed in the system. This helps maintain compliance and track changes.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/audits/create"
        icon="i-heroicons-plus">
        Add audit entry
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading audit logs...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading audit logs</template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch audits data asynchronously
const auditStore = useAuditsStore()
const { items: audits, hasItems, isEmpty, loading, hasError, error } = storeToRefs(auditStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await auditStore.fetchAll()
}
</script>

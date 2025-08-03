<template>
  <CommonResourceListComponent
    :items="protocols"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Protocols</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/protocols/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Protocol
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <ProtocolDataTable :protocols="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No protocols found</template>
    <template #empty-description>
      Get started by adding your first protocol. Protocols define the study procedures and requirements for clinical trials.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/protocols/create"
        icon="i-heroicons-plus">
        Add your first protocol
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading protocols...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading protocols</template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch protocols data asynchronously
const protocolStore = useProtocolsStore()
const { items: protocols, hasItems, isEmpty, loading, hasError, error } = storeToRefs(protocolStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await protocolStore.fetchAll()
}
</script>

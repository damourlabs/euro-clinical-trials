<template>
  <CommonResourceListComponent
    :items="adverseEvents"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Adverse Events</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/adverse-events/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Adverse Event
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <AdverseEventDataTable :adverse-events="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No adverse events found</template>
    <template #empty-description>
      Adverse events will appear here when reported. This helps track patient safety and trial compliance.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/adverse-events/create"
        icon="i-heroicons-plus">
        Report adverse event
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading adverse events...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading adverse events</template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch adverse events data asynchronously
const adverseEventStore = useAdverseEventsStore()
const { items: adverseEvents, hasItems, isEmpty, loading, hasError, error } = storeToRefs(adverseEventStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await adverseEventStore.fetchAll()
}
</script>

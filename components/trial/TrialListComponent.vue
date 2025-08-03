<template>
  <CommonResourceListComponent
    :items="trials"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Clinical Trials</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/trials/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Trial
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <TrialDataTable :trials="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No trials found</template>
    <template #empty-description>
      Get started by creating your first clinical trial. Click the "New Trial" button above.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/trials/create"
        icon="i-heroicons-plus">
        Create your first trial
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading trials...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading trials</template>
    <template #error-message="{ error: errorMsg }">
      {{ errorMsg || 'There was an error loading trials. Please try again.' }}
    </template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch trials data asynchronously
const trialStore = useTrialsStore()
const { items: trials, hasItems, isEmpty, loading, hasError, error } = storeToRefs(trialStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await trialStore.fetchAll()
}
</script>

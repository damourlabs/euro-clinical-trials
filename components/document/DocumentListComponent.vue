<template>
  <CommonResourceListComponent
    :items="documents"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Documents</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/documents/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Document
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <DocumentDataTable :documents="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No documents found</template>
    <template #empty-description>
      Get started by uploading your first document. Click the "New Document" button above.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/documents/create"
        icon="i-heroicons-plus">
        Upload Document
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading documents...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading documents</template>
    <template #error-message="{ error: errorMsg }">
      {{ errorMsg || 'There was an error loading documents. Please try again.' }}
    </template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch documents data asynchronously
const documentStore = useDocumentsStore()
const { items: documents, hasItems, isEmpty, loading, hasError, error } = storeToRefs(documentStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await documentStore.fetchAll()
}
</script>

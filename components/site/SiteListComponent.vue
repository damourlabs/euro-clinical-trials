<template>
  <CommonResourceListComponent
    :items="sites"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Clinical Sites</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/sites/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Site
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <SiteDataTable :sites="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No sites found</template>
    <template #empty-description>
      Get started by adding your first clinical site. Sites are locations where trials are conducted.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/sites/create"
        icon="i-heroicons-plus">
        Add your first site
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading sites...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading sites</template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">

// import ResourceListComponent from "~/components/common/ResourceListComponent.vue"

// Fetch sites data asynchronously
const siteStore = useSitesStore()
const { items: sites, hasItems, isEmpty, loading, hasError, error } = storeToRefs(siteStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await siteStore.fetchAll()
}
</script>

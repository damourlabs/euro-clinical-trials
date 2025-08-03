<template>
  <CommonResourceListComponent
    :items="users"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="loading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Users</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/users/create"
        icon="i-heroicons-plus" 
        size="lg">
        New User
      </UiCommonNavLink>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <UserDataTable :users="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No users found</template>
    <template #empty-description>
      Get started by adding your first user. Users can be assigned to trials and sites to manage clinical data.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/users/create"
        icon="i-heroicons-plus">
        Add your first user
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading users...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading users</template>
  </CommonResourceListComponent>
</template>

<script setup lang="ts">
// Fetch users data asynchronously
const userStore = useUsersStore()
const { items: users, hasItems, isEmpty, loading, hasError, error } = storeToRefs(userStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await userStore.fetchAll()
}
</script>

<!-- pages/users/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <UserListComponent />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'simple'
})

// Composables
const store = useUsersStore()

onMounted(async () => {
  await store.fetchAll()
})
</script>

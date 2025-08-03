<!-- pages/audits/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    {{error}}
    <AuditListComponent />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'simple'
})

// Composables
const store = useAuditsStore()

const { items, error } = storeToRefs(store)

onMounted(async () => {
  await store.fetchAll()
  await useUsersStore().fetchAll()
  await useTrialsStore().fetchAll()
})
</script>

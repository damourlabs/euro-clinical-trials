<!-- pages/adverse-events/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <AdverseEventListComponent />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'simple'
})

// Composables
const store = useAdverseEventsStore()

const { items } = storeToRefs(store)

onMounted(async () => {
  await store.fetchAll()
  await usePatientsStore().fetchAll()
  await useTrialsStore().fetchAll()
})
</script>

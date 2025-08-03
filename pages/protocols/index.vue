<!-- pages/protocols/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <ProtocolListComponent />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'simple'
})

// Composables
const store = useProtocolsStore()

const { items } = storeToRefs(store)

onMounted(async () => {
  await store.fetchAll()
  await useTrialsStore().fetchAll()
})
</script>
<!-- pages/trials/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">

    <div class="flex justify-between items-center mb-6">
      <h1 class="font-bold text-gray-900 text-3xl">Clinical Trials</h1>
      <UiCommonNavLink
        to="/trials/create"
        icon="i-heroicons-plus" size="lg">
        New Trial
      </UiCommonNavLink>
    </div>
    <div
      v-show="isLoading"
      class="flex justify-center items-center h-64">
      Loading trials...
    </div>

    <TrialDataTable :trials="items" />  

  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: 'simple'
})



// Auth check
// const { user, isAuthenticated } = useAuth()
// if (!isAuthenticated.value) {
//   await navigateTo('/login')
// }
// Composables
const store = useTrialsStore()
const { items } = storeToRefs(store)
const { fetchAll, isLoading } = store

// const trials = ref<Trial[]>()
// Reactive data
// const searchQuery = ref('')
// const statusFilter = ref('')
// const phaseFilter = ref('')


onMounted(async () => {

  console.log('Fetching trials...')
  await fetchAll()
  console.log('Trials fetched:', items)

})



// SEO
useHead({
  title: 'Clinical Trials - CTMS'
})
</script>
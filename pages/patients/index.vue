<!-- pages/trials/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">

    <div class="flex justify-between items-center mb-6">
      <h1 class="font-bold text-gray-900 text-3xl">Patients</h1>
      <UiCommonNavLink
        to="/patients/create"
        icon="i-heroicons-plus" size="lg">
        New patient
      </UiCommonNavLink>
    </div>
    <div
      v-show="isLoading"
      class="flex justify-center items-center h-64">
      Loading patients...
    </div>

    <PatientDataTable :patients="items" />  

  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: 'simple'
})


// Composables
const store = usePatientsStore()
const { items } = storeToRefs(store)
const { fetchAll, isLoading } = store


onMounted(async () => {

  console.log('Fetching patients...')
  await fetchAll()
  console.log('Patients fetched:', items)

})



// SEO
useHead({
    title: 'Patients - Euro Clinical Trials',
    meta: [
        { name: 'description', content: 'List of patients involved in clinical trials.' },
        { name: 'keywords', content: 'patients, clinical trials, healthcare' }
    ]
})
</script>
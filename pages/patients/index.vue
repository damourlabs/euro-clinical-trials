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
      v-if="loading"
      class="flex justify-center items-center h-64">
      Loading patients...
    </div>

    <PatientDataTable
      v-else
      :patients="items" />  

  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: 'simple'
})


// Composables
const patientStore = usePatientsStore()
const siteStore = useSitesStore()
const trialStore = useTrialsStore()

const { items, loading } = storeToRefs(patientStore)

onMounted(async () => {

  await patientStore.fetchAll()
  
  // TODO: Fetch filtered data based on patient data
  await trialStore.fetchAll()
  await siteStore.fetchAll()

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
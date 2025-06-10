<!-- pages/trials/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">

    <div class="flex justify-between items-center mb-6">
      <h1 class="font-bold text-gray-900 text-3xl">Sites</h1>
      <UiCommonNavLink
        to="/sites/create"
        icon="i-heroicons-plus" size="lg">
        New site
      </UiCommonNavLink>
    </div>
    <div
      v-show="isLoading"
      class="flex justify-center items-center h-64">
      Loading sites...
    </div>

    <SiteDataTable :sites="items" />  

  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: 'simple'
})


// Composables
const store = useSitesStore()
const { items } = storeToRefs(store)
const { fetchAll, isLoading } = store


onMounted(async () => {

  console.log('Fetching sites...')
  await fetchAll()
  console.log('Sites fetched:', items)

})



// SEO
useHead({
    title: 'Sites - Euro Clinical Trials',
    meta: [
        { name: 'description', content: 'List of sites involved in clinical trials.' },
        { name: 'keywords', content: 'sites, clinical trials, healthcare' }
    ]
})
</script>
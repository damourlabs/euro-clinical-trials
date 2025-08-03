<!-- pages/sites/index.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <SiteListComponent />
    <!-- <div class="flex justify-between items-center mb-6">
      <h1 class="font-bold text-gray-900 text-3xl">Sites</h1>
      <UiCommonNavLink
        to="/sites/create"
        icon="i-heroicons-plus" size="lg">
        New site
      </UiCommonNavLink>
    </div>
    
    <ResourceListLoadingFallback 
      v-if="loading" 
      resource-type="sites"
      :columns="4" />

    <SiteDataTable 
      v-else
      :sites="items" />   -->

  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'simple'
})


// Composables
const store = useSitesStore()

const { items } = storeToRefs(store)


onMounted(async () => {

  
  await store.fetchAll()
  await useTrialsStore().fetchAll()
  await useUsersStore().fetchAll()
  // await useProtocolsStore().fetchAll()


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
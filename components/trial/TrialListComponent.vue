<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="font-bold text-gray-900 text-3xl">Clinical Trials</h1>
      <UiCommonNavLink
        to="/trials/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Trial
      </UiCommonNavLink>
    </div>

    <div v-if="hasItems">
      <TrialDataTable :trials="trials" />
    </div>
    
    <div 
      v-else-if="isEmpty" 
      class="flex flex-col justify-center items-center py-16 text-center">
      <div class="bg-gray-100 mb-4 p-6 rounded-full">
        <svg 
          class="w-12 h-12 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1" 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </div>
      <h3 class="mb-2 font-semibold text-gray-900 text-lg">No trials found</h3>
      <p class="mb-6 max-w-sm text-gray-600 text-sm">
        Get started by creating your first clinical trial. Click the "New Trial" button above.
      </p>
      <UiCommonNavLink
        to="/trials/create"
        icon="i-heroicons-plus">
        Create your first trial
      </UiCommonNavLink>
    </div>
  </div>
</template>

<script setup lang="ts">


// Fetch trials data asynchronously
const trialStore = useTrialsStore()
const { items: trials, hasItems, isEmpty } = storeToRefs(trialStore)

</script>

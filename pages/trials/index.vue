<!-- pages/trials/index.vue -->
<template>
  <div>
    
    <NuxtErrorBoundary .value@error="handleError">
      <TrialListLoadingFallback v-if="!isLoading" />
      <TrialListComponent v-else/>
      
      <template #error="{ error, clearError }">
        <TrialErrorBoundary
          :title="getErrorTitle(error)"
          :message="getErrorMessage(error)"
          :status-code="getErrorStatusCode(error)"
          @retry="clearError"
        />
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<script setup lang="ts">

interface AppError {
  statusCode?: number
  statusMessage?: string
  message?: string
}

const trialStore = useTrialsStore()
const { isLoading } = storeToRefs(trialStore)

// Fetch trials data asynchronously
await trialStore.fetchAll()




// Error handling utilities
const handleError = (error: AppError | Error | unknown) => {
  console.error('Trials list page error:', error)
}

const getErrorTitle = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 403) {
    return 'Access Denied'
  }
  return 'Something went wrong'
}

const getErrorMessage = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 403) {
    return 'You do not have permission to view trials.'
  }
  return appError?.message || (error as Error)?.message || 'We encountered an error while loading the trials data. Please try again.'
}

const getErrorStatusCode = (error: AppError | Error | unknown): number => {
  const appError = error as AppError
  return appError?.statusCode || 500
}


definePageMeta({
  layout: 'simple'
})


// SEO
useHead({
  title: 'Clinical Trials - CTMS',
  meta: [
    {
      name: 'description',
      content: 'Browse and manage clinical trials in the Clinical Trial Management System'
    }
  ]
})
</script>
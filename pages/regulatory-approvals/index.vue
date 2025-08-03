<!-- pages/regulatory-approvals/index.vue -->
<template>
  <div>
    
    <NuxtErrorBoundary @error="handleError">
      <ResourceListLoadingFallback 
        v-if="loading" 
        resource-type="regulatory-approvals"
        :columns="6" />
      <RegulatoryApprovalListComponent v-else />
      
      <template #error="{ error, clearError }">
        <div class="mx-auto p-6 max-w-md text-center">
          <h2 class="mb-4 font-bold text-red-600 text-xl">{{ getErrorTitle(error) }}</h2>
          <p class="mb-4 text-gray-600">{{ getErrorMessage(error) }}</p>
          <Button @click="clearError">Try Again</Button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { ResourceListLoadingFallback } from '~/components/common'

interface AppError {
  statusCode?: number
  statusMessage?: string
  message?: string
}

const regulatoryApprovalsStore = useRegulatoryApprovalsStore()
const trialsStore = useTrialsStore()
const { loading } = storeToRefs(regulatoryApprovalsStore)

onMounted(async () => {
  // Fetch regulatory approvals data asynchronously
  await regulatoryApprovalsStore.fetchAll()
  
  // TODO: Filter by data in regulatory approvals
  await trialsStore.fetchAll()
})

// Error handling utilities
const handleError = (error: AppError | Error | unknown) => {
  console.error('Regulatory approvals list page error:', error)
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
    return 'You do not have permission to view regulatory approvals.'
  }
  return appError?.message || (error as Error)?.message || 'We encountered an error while loading the regulatory approvals data. Please try again.'
}

const _getErrorStatusCode = (error: AppError | Error | unknown): number => {
  const appError = error as AppError
  return appError?.statusCode || 500
}

definePageMeta({
  layout: 'simple'
})

// SEO
useHead({
  title: 'Regulatory Approvals - CTMS',
  meta: [
    {
      name: 'description',
      content: 'Browse and manage regulatory approvals in the Clinical Trial Management System'
    }
  ]
})
</script>

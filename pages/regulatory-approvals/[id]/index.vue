<!-- pages/regulatory-approvals/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <NuxtErrorBoundary @error="handleError">
      <Suspense>
        <RegulatoryApprovalComponent :regulatory-approval-id="regulatoryApprovalId" />
        
        <template #fallback>
          <ResourceDetailLoadingFallback resource-type="regulatory-approval" />
        </template>
      </Suspense>
      
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
import { ResourceDetailLoadingFallback } from '~/components/common'

// Define error interface for better type safety
interface AppError {
  statusCode?: number
  statusMessage?: string
  message?: string
}

// Route params
const route = useRoute()
const regulatoryApprovalId = route.params.id as string

// Validate that we have a regulatory approval ID
if (!regulatoryApprovalId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'Regulatory Approval ID is required'
  })
}

// Error handling utilities
const handleError = (error: AppError | Error | unknown) => {
  console.error('Regulatory approval page error:', error)
}

const getErrorTitle = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 404) {
    return 'Regulatory Approval Not Found'
  }
  if (appError?.statusCode === 403) {
    return 'Access Denied'
  }
  return 'Something went wrong'
}

const getErrorMessage = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 404) {
    return `The regulatory approval with ID "${regulatoryApprovalId}" could not be found. It may have been deleted or the ID might be incorrect.`
  }
  if (appError?.statusCode === 403) {
    return 'You do not have permission to view this regulatory approval.'
  }
  return appError?.message || (error as Error)?.message || 'We encountered an error while loading the regulatory approval data. Please try again.'
}

const _getErrorStatusCode = (error: AppError | Error | unknown): number => {
  const appError = error as AppError
  return appError?.statusCode || 500
}

// SEO - We'll set dynamic title in the component since it has the regulatory approval data
useHead({
  title: 'Regulatory Approval Details - CTMS',
  meta: [
    {
      name: 'description',
      content: 'Details of the regulatory approval'
    }
  ]
})

definePageMeta({
  layout: 'simple',
  title: 'Regulatory Approval Details - CTMS'
})
</script>

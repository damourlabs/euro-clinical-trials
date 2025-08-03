<!-- pages/trials/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <NuxtErrorBoundary @error="handleError">
      <Suspense>
        <TrialComponent :trial-id="trialId" />
        
        <template #fallback>
          <ResourceDetailLoadingFallback resource-type="trial" />
        </template>
      </Suspense>
      
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
import { ResourceDetailLoadingFallback } from '~/components/common'

// Define error interface for better type safety
interface AppError {
  statusCode?: number
  statusMessage?: string
  message?: string
}

// Route params
const route = useRoute()
const trialId = route.params.id as string

// Validate that we have a trial ID
if (!trialId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'Trial ID is required'
  })
}

// Error handling utilities
const handleError = (error: AppError | Error | unknown) => {
  console.error('Trial page error:', error)
}

const getErrorTitle = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 404) {
    return 'Trial Not Found'
  }
  if (appError?.statusCode === 403) {
    return 'Access Denied'
  }
  return 'Something went wrong'
}

const getErrorMessage = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 404) {
    return `The trial with ID "${trialId}" could not be found. It may have been deleted or the ID might be incorrect.`
  }
  if (appError?.statusCode === 403) {
    return 'You do not have permission to view this trial.'
  }
  return appError?.message || (error as Error)?.message || 'We encountered an error while loading the trial data. Please try again.'
}

const getErrorStatusCode = (error: AppError | Error | unknown): number => {
  const appError = error as AppError
  return appError?.statusCode || 500
}

// SEO - We'll set dynamic title in the component since it has the trial data
useHead({
  title: 'Trial Details - CTMS',
  meta: [
    {
      name: 'description',
      content: 'Details of the clinical trial'
    }
  ]
})

definePageMeta({
  layout: 'simple',
  title: 'Trial Details - CTMS'
})
</script>
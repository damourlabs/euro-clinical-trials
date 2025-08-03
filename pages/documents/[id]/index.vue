<!-- pages/documents/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <NuxtErrorBoundary @error="handleError">
      <Suspense>
        <DocumentComponent :document-id="documentId" />
        
        <template #fallback>
          <ResourceDetailLoadingFallback resource-type="document" />
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
const documentId = route.params.id as string

// Validate that we have a document ID
if (!documentId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'Document ID is required'
  })
}

// Error handling utilities
const handleError = (error: AppError | Error | unknown) => {
  console.error('Document page error:', error)
}

const getErrorTitle = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 404) {
    return 'Document Not Found'
  }
  if (appError?.statusCode === 403) {
    return 'Access Denied'
  }
  return 'Something went wrong'
}

const getErrorMessage = (error: AppError | Error | unknown): string => {
  const appError = error as AppError
  if (appError?.statusCode === 404) {
    return `The document with ID "${documentId}" could not be found. It may have been deleted or the ID might be incorrect.`
  }
  if (appError?.statusCode === 403) {
    return 'You do not have permission to view this document.'
  }
  return appError?.message || (error as Error)?.message || 'We encountered an error while loading the document data. Please try again.'
}

const _getErrorStatusCode = (error: AppError | Error | unknown): number => {
  const appError = error as AppError
  return appError?.statusCode || 500
}

// SEO - We'll set dynamic title in the component since it has the document data
useHead({
  title: 'Document Details - CTMS',
  meta: [
    {
      name: 'description',
      content: 'Details of the document'
    }
  ]
})

definePageMeta({
  layout: 'simple',
  title: 'Document Details - CTMS'
})
</script>

<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="flex justify-between items-center mb-6">
      <slot name="header">
        <h1 class="font-bold text-gray-900 text-3xl">
          <slot name="title">Resources</slot>
        </h1>
      </slot>
      <slot name="create-button">
        <UiCommonNavLink
          to="#"
          icon="i-heroicons-plus" 
          size="lg">
          New Item
        </UiCommonNavLink>
      </slot>
    </div>

    <div v-if="hasItems">
      <slot 
        name="data-table" 
        :items="items">
        <!-- Fallback if no data table slot is provided -->
        <div class="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div class="p-4">
            <p class="text-gray-500">No data table component provided</p>
          </div>
        </div>
      </slot>
    </div>
    
    <div 
      v-else-if="isEmpty" 
      class="flex flex-col justify-center items-center py-16 text-center">
      <slot name="empty-state">
        <div class="bg-gray-100 mb-4 p-6 rounded-full">
          <slot name="empty-icon">
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
          </slot>
        </div>
        <h3 class="mb-2 font-semibold text-gray-900 text-lg">
          <slot name="empty-title">No items found</slot>
        </h3>
        <p class="mb-6 max-w-sm text-gray-600 text-sm">
          <slot name="empty-description">
            Get started by creating your first item. Click the button above.
          </slot>
        </p>
        <slot name="empty-action">
          <UiCommonNavLink
            to="#"
            icon="i-heroicons-plus">
            Create your first item
          </UiCommonNavLink>
        </slot>
      </slot>
    </div>

    <div 
      v-else-if="isLoading"
      class="flex justify-center items-center py-16">
      <slot name="loading">
        <!-- Default loading state -->
        <div class="flex flex-col items-center">
          <div class="border-4 border-gray-300 border-t-blue-600 rounded-full w-8 h-8 animate-spin" />
          <p class="mt-4 text-gray-600">
            <slot name="loading-text">Loading...</slot>
          </p>
        </div>
      </slot>
    </div>

    <div 
      v-else-if="hasError"
      class="flex flex-col justify-center items-center py-16 text-center">
      <slot name="error-state">
        <div class="bg-red-100 mb-4 p-6 rounded-full">
          <slot name="error-icon">
            <svg 
              class="w-12 h-12 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="1" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </slot>
        </div>
        <h3 class="mb-2 font-semibold text-gray-900 text-lg">
          <slot name="error-title">Error loading data</slot>
        </h3>
        <p class="mb-6 max-w-sm text-gray-600 text-sm">
          <slot 
            name="error-message" 
            :error="errorMessage">
            There was an error loading data. Please try again.
          </slot>
        </p>
        <slot name="error-action">
          <button 
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-white transition-colors"
            @click="$emit('retry')">
            Try Again
          </button>
        </slot>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T = Record<string, any>">
interface Props {
  // Data state
  items?: T[]
  hasItems: boolean
  isEmpty: boolean
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  errorMessage: ''
})

defineEmits<{
  retry: []
}>()
</script>

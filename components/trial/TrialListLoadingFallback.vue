<!-- components/trial/TrialListLoadingFallback.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="flex justify-between items-center mb-6">
      <div class="space-y-2">
        <div class="bg-gray-200 rounded-md w-48 h-8 animate-pulse" />
        <div class="bg-gray-100 rounded w-32 h-4 animate-pulse" />
      </div>
      <div class="bg-gray-200 rounded-md w-24 h-10 animate-pulse" />
    </div>

    <div class="space-y-4">
      <!-- Loading table header -->
      <div class="bg-gray-50 p-4 border border-gray-200 rounded-lg">
        <div class="gap-4 grid grid-cols-6">
          <div class="bg-gray-200 rounded w-20 h-4 animate-pulse" />
          <div class="bg-gray-200 rounded w-24 h-4 animate-pulse" />
          <div class="bg-gray-200 rounded w-16 h-4 animate-pulse" />
          <div class="bg-gray-200 rounded w-20 h-4 animate-pulse" />
          <div class="bg-gray-200 rounded w-18 h-4 animate-pulse" />
          <div class="bg-gray-200 rounded w-16 h-4 animate-pulse" />
        </div>
      </div>

      <!-- Loading table rows -->
      <div 
        v-for="i in 5" 
        :key="i" 
        class="bg-white p-4 border border-gray-200 rounded-lg">
        <div class="gap-4 grid grid-cols-6">
          <div class="bg-gray-100 rounded w-full h-4 animate-pulse" />
          <div class="bg-gray-100 rounded w-full h-4 animate-pulse" />
          <div class="bg-gray-100 rounded w-full h-4 animate-pulse" />
          <div class="bg-gray-100 rounded w-full h-4 animate-pulse" />
          <div class="bg-gray-100 rounded w-full h-4 animate-pulse" />
          <div class="bg-gray-100 rounded w-full h-4 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Loading message -->
    <div class="flex justify-center items-center mt-8">
      <div class="flex items-center space-x-3 text-gray-600">
        <div class="border-primary border-b-2 rounded-full w-6 h-6 animate-spin" />
        <span class="text-sm">Loading trials...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this loading component
</script>

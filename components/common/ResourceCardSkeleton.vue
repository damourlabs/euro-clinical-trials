<template>
  <div class="resource-card-skeleton">
    <!-- Micro Size Skeleton -->
    <div 
      v-if="size === 'micro'" 
      class="inline-block">
      <div class="bg-gray-200 rounded w-16 h-6 animate-pulse" />
    </div>

    <!-- Small Size Skeleton -->
    <div 
      v-else-if="size === 'small'" 
      class="space-y-3 p-4">
      <div class="flex justify-between items-start">
        <div class="flex-1 space-y-2">
          <div class="bg-gray-200 rounded w-3/4 h-4 animate-pulse" />
          <div class="bg-gray-100 rounded w-1/2 h-3 animate-pulse" />
        </div>
        <div class="bg-gray-200 rounded-full w-16 h-5 animate-pulse" />
      </div>
      <div class="flex justify-between">
        <div class="bg-gray-100 rounded w-20 h-3 animate-pulse" />
        <div class="bg-gray-100 rounded w-24 h-3 animate-pulse" />
      </div>
    </div>

    <!-- Medium Size Skeleton -->
    <div 
      v-else-if="size === 'medium'" 
      class="space-y-4 p-6">
      <div class="flex justify-between items-start">
        <div class="flex-1 space-y-2">
          <div class="bg-gray-200 rounded w-2/3 h-5 animate-pulse" />
          <div class="bg-gray-100 rounded w-1/2 h-4 animate-pulse" />
        </div>
        <div class="bg-gray-200 rounded-full w-20 h-6 animate-pulse" />
      </div>
      <div class="gap-4 grid grid-cols-2">
        <div 
          v-for="i in 4" 
          :key="i" 
          class="space-y-1">
          <div class="bg-gray-100 rounded w-1/2 h-3 animate-pulse" />
          <div class="bg-gray-200 rounded w-3/4 h-4 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Large Size Skeleton -->
    <div 
      v-else-if="size === 'large'" 
      class="space-y-6">
      <div class="space-y-4">
        <div class="bg-gray-200 rounded w-48 h-6 animate-pulse" />
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="i in 6" 
            :key="i" 
            class="space-y-2">
            <div class="bg-gray-100 rounded w-1/2 h-3 animate-pulse" />
            <div class="bg-gray-200 rounded w-full h-4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size: 'micro' | 'small' | 'medium' | 'large'
  resourceType: 'trial' | 'patient' | 'site' | 'user' | 'document' | 'adverse-event' | 'gdpr-consent' | 'regulatory-approval' | 'visit' | 'endpoint' | 'eligibility' | 'protocol' | 'audit'
}

defineProps<Props>()
</script>

<style scoped>
/* Component styles are handled via Tailwind classes */
</style>

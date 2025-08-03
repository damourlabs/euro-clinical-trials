<!-- components/common/ResourceListLoadingFallback.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <!-- Header Loading -->
    <div class="flex justify-between items-center mb-6">
      <div class="space-y-2">
        <div 
          class="bg-gray-200 rounded-md animate-pulse" 
          :style="{ width: `${titleWidth}px`, height: '32px' }" />
        <div 
          class="bg-gray-100 rounded animate-pulse" 
          :style="{ width: `${subtitleWidth}px`, height: '16px' }" />
      </div>
      <div class="bg-gray-200 rounded-md w-24 h-10 animate-pulse" />
    </div>

    <div class="space-y-4">
      <!-- Loading table header -->
      <div class="bg-gray-50 p-4 border border-gray-200 rounded-lg">
        <div 
          class="gap-4 grid" 
          :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
          <div 
            v-for="i in columns" 
            :key="`header-${i}`"
            class="bg-gray-200 rounded h-4 animate-pulse"
            :style="{ width: `${getRandomWidth(60, 120)}px` }" />
        </div>
      </div>

      <!-- Loading table rows -->
      <div 
        v-for="i in rows" 
        :key="`row-${i}`" 
        class="bg-white p-4 border border-gray-200 rounded-lg">
        <div 
          class="gap-4 grid" 
          :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
          <div 
            v-for="j in columns" 
            :key="`cell-${i}-${j}`"
            class="bg-gray-100 rounded h-4 animate-pulse"
            :style="{ width: `${getRandomWidth(40, 100)}%` }" />
        </div>
      </div>
    </div>

    <!-- Loading message -->
    <div class="flex justify-center items-center mt-8">
      <div class="flex items-center space-x-3 text-gray-600">
        <div class="border-primary border-b-2 rounded-full w-6 h-6 animate-spin" />
        <span class="text-sm">{{ loadingMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** Resource type being loaded (e.g., 'trials', 'sites', 'patients', 'users', 'protocols') */
  resourceType?: string
  /** Number of columns to show in the loading table */
  columns?: number
  /** Number of rows to show in the loading table */
  rows?: number
  /** Custom loading message */
  message?: string
  /** Width of the title skeleton in pixels */
  titleWidth?: number
  /** Width of the subtitle skeleton in pixels */
  subtitleWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  resourceType: 'items',
  columns: 6,
  rows: 5,
  message: '',
  titleWidth: 192, // w-48
  subtitleWidth: 128, // w-32
})

// Computed loading message based on resource type
const loadingMessage = computed(() => {
  if (props.message) return props.message
  
  const resourceNames: Record<string, string> = {
    trials: 'Loading trials...',
    sites: 'Loading sites...',
    patients: 'Loading patients...',
    users: 'Loading users...',
    protocols: 'Loading protocols...',
    documents: 'Loading documents...',
    visits: 'Loading visits...',
    audits: 'Loading audit logs...',
    adverse_events: 'Loading adverse events...',
    studies: 'Loading studies...',
    regulations: 'Loading regulations...',
  }
  
  return resourceNames[props.resourceType] || `Loading ${props.resourceType}...`
})

// Generate random width for skeleton elements to create more realistic loading appearance
function getRandomWidth(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<template>
  <div :class="containerClass">
    {{ formattedDate }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  date?: string | Date | null
  format?: 'short' | 'long' | 'iso' | 'relative'
  fallback?: string
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  date: null,
  format: 'short',
  fallback: 'N/A',
  align: 'right'
})

const containerClass = computed(() => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[props.align]
  
  return alignClass
})

const formattedDate = computed(() => {
  if (!props.date) return props.fallback
  
  const date = new Date(props.date)
  if (isNaN(date.getTime())) return props.fallback
  
  switch (props.format) {
    case 'short':
      return date.toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      })
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    case 'iso':
      return date.toISOString().split('T')[0]
    case 'relative':
      return getRelativeTime(date)
    default:
      return date.toLocaleDateString()
  }
})

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays === -1) return 'Tomorrow'
  if (diffDays > 0) return `${diffDays} days ago`
  return `In ${Math.abs(diffDays)} days`
}
</script>

<template>
  <div :class="containerClass">
    <div class="flex items-center space-x-2">
      <div class="flex-1">
        <div class="bg-gray-200 rounded-full w-full h-2">
          <div 
            class="rounded-full h-2 transition-all duration-300"
            :class="progressBarColor"
            :style="{ width: `${percentage}%` }"
          />
        </div>
      </div>
      <span 
        class="font-medium text-sm" 
        :class="textColor"
      >
        {{ displayValue }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: string | number
  showProgressBar?: boolean
  align?: 'left' | 'center' | 'right'
  suffix?: string
  thresholds?: {
    low: number
    medium: number
    high: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  showProgressBar: true,
  align: 'right',
  suffix: '%',
  thresholds: () => ({
    low: 30,
    medium: 70,
    high: 90
  })
})

const percentage = computed(() => {
  const num = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  return Math.min(Math.max(num, 0), 100)
})

const displayValue = computed(() => {
  return `${percentage.value}${props.suffix}`
})

const containerClass = computed(() => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[props.align]
  
  return alignClass
})

const progressBarColor = computed(() => {
  if (percentage.value >= props.thresholds.high) {
    return 'bg-green-500'
  } else if (percentage.value >= props.thresholds.medium) {
    return 'bg-yellow-500'
  } else if (percentage.value >= props.thresholds.low) {
    return 'bg-orange-500'
  } else {
    return 'bg-red-500'
  }
})

const textColor = computed(() => {
  if (percentage.value >= props.thresholds.high) {
    return 'text-green-700'
  } else if (percentage.value >= props.thresholds.medium) {
    return 'text-yellow-700'
  } else if (percentage.value >= props.thresholds.low) {
    return 'text-orange-700'
  } else {
    return 'text-red-700'
  }
})
</script>

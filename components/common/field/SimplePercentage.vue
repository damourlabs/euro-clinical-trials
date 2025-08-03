<template>
  <div :class="containerClass">
    <span 
      class="font-medium text-sm" 
      :class="textColor"
    >
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: string | number
  align?: 'left' | 'center' | 'right'
  suffix?: string
  thresholds?: {
    low: number
    medium: number
    high: number
  }
}

const props = withDefaults(defineProps<Props>(), {
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

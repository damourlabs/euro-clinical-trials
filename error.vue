<script setup lang="ts">
import type { NuxtError } from '#app'

definePageMeta({
  layout: 'error'
})

const props = defineProps<{
  error: NuxtError
}>()

// Pass error data to the layout
const errorData = computed(() => ({
  statusCode: props.error?.statusCode || 500,
  statusMessage: props.error?.statusMessage || 'Internal Server Error',
  message: props.error?.message || 'An unexpected error occurred',
  stack: props.error?.stack
}))
</script>

<template>
  <div>
    <NuxtLayout 
      name="error" 
      :error="errorData"
    >
    <!-- The error layout will handle the display -->
    </NuxtLayout>
  </div>
</template>

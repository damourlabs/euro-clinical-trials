<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <Card class="mx-auto border-red-200 w-full max-w-md">
      <CardContent class="pt-6">
        <div class="space-y-6 text-center">
          <!-- Error icon -->
          <div class="flex justify-center">
            <div class="bg-red-100 p-3 rounded-full">
              <svg 
                class="w-8 h-8 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
          </div>
          
          <!-- Error content -->
          <div class="space-y-2">
            <h3 class="font-semibold text-red-900 text-lg">
              {{ title }}
            </h3>
            <p class="text-red-700 text-sm">
              {{ message }}
            </p>
          </div>
          
          <!-- Action buttons -->
          <div class="flex sm:flex-row flex-col sm:justify-center gap-3">
            <Button 
              variant="outline" 
              @click="retry"
            >
              Try Again
            </Button>
            <Button 
              variant="secondary" 
              @click="goBack"
            >
              Go Back
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  statusCode?: number
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'We encountered an error while loading the trial data. Please try again.',
  statusCode: 500
})

const emit = defineEmits<{
  retry: []
}>()

const retry = () => {
  emit('retry')
  // Force a page refresh as fallback
  if (import.meta.client) {
    window.location.reload()
  }
}

const goBack = () => {
  // Try to go back in history, fallback to trials list
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/trials')
  }
}
</script>

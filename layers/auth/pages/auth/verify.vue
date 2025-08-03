<template>
  <div class="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
    <div class="space-y-8 w-full max-w-md">
      <div>
        <h2 class="mt-6 font-extrabold text-gray-900 text-3xl text-center">
          Verify Your Access
        </h2>
        <p class="mt-2 text-gray-600 text-sm text-center">
          Click the link in your email or enter your verification code
        </p>
      </div>

      <!-- Auto-verification message -->
      <div
        v-if="isAutoVerifying"
        class="text-center">
        <Icon
          name="i-heroicons-arrow-path"
          class="mx-auto w-8 h-8 text-indigo-600 animate-spin" />
        <p class="mt-4 text-gray-600 text-sm">Verifying your access...</p>
      </div>

      <!-- Manual verification form -->
      <div
        v-else-if="!isAutoVerifying && !verified"
        class="space-y-6">
        <UiFormsDynamicForm
          ref="verificationForm"
          :sections="false"
          :schema="verificationFormSchema"
          :submit-fn="handleVerification"
        />

        <div class="text-center">
          <UiCommonNavLink 
            to="/auth/login" 
            class="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            ← Back to login
          </UiCommonNavLink>
        </div>
      </div>

      <!-- Success State -->
      <div
        v-if="verified"
        class="space-y-4 text-center">
        <div class="flex justify-center items-center bg-green-100 mx-auto rounded-full w-12 h-12">
          <Icon
            name="i-heroicons-check"
            class="w-6 h-6 text-green-600" />
        </div>
        <h3 class="font-medium text-gray-900 text-lg">Verification Successful!</h3>
        <p class="text-gray-600 text-sm">
          You have been successfully authenticated. Redirecting...
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <Icon
            name="i-heroicons-x-circle"
            class="w-5 h-5 text-red-400" />
          <div class="ml-3">
            <p class="font-medium text-red-800 text-sm">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
  auth: false
})

// Form schema
const verificationFormSchema = createDynamicForm(z.object({
  verificationCode: z.string().min(1, 'Please enter the verification code').describe('Verification code from your email')
}))

// Reactive state
const isAutoVerifying = ref(false)
const verified = ref(false)
const errorMessage = ref('')

// Form reference
const verificationForm = ref()

// Handle manual verification
const handleVerification = async (formData: { verificationCode: string }) => {
  const route = useRoute()
  const email = route.query.email as string

  if (!email) {
    errorMessage.value = 'Email parameter is missing'
    return
  }

  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: {
        token: formData.verificationCode,
        email: email
      }
    })

    verified.value = true
    
    // Redirect after success
    setTimeout(() => {
      navigateTo('/')
    }, 2000)

  } catch (error: unknown) {
    console.error('Verification error:', error)
    const errorData = error && typeof error === 'object' && 'data' in error ? error.data : null
    errorMessage.value = (errorData && typeof errorData === 'object' && 'message' in errorData ? errorData.message : 'Verification failed. Please try again.') as string
  }
}

// Auto-verify if token is in URL
onMounted(async () => {
  const route = useRoute()
  const token = route.query.token as string
  const email = route.query.email as string

  if (token && email) {
    isAutoVerifying.value = true

    try {
      await $fetch('/api/auth/verify', {
        method: 'POST',
        body: {
          token,
          email
        }
      })

      verified.value = true
      
      // Redirect after success
      setTimeout(() => {
        navigateTo('/')
      }, 2000)

    } catch (error: unknown) {
      console.error('Auto-verification error:', error)
      const errorData = error && typeof error === 'object' && 'data' in error ? error.data : null
      errorMessage.value = (errorData && typeof errorData === 'object' && 'message' in errorData ? errorData.message : 'Verification failed. Please try the manual verification below.') as string
    } finally {
      isAutoVerifying.value = false
    }
  }
})
</script>

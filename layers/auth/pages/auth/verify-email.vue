<template>
  <div class="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
    <div class="space-y-8 w-full max-w-md">
      <div>
        <h2 class="mt-6 font-extrabold text-gray-900 text-3xl text-center">
          Email Verification
        </h2>
        <p class="mt-2 text-gray-600 text-sm text-center">
          Verify your email address to complete registration
        </p>
      </div>

      <!-- Auto-verification -->
      <div
        v-if="isVerifying"
        class="text-center">
        <Icon
          name="i-heroicons-arrow-path"
          class="mx-auto w-8 h-8 text-indigo-600 animate-spin" />
        <p class="mt-4 text-gray-600 text-sm">Verifying your email address...</p>
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
        <h3 class="font-medium text-gray-900 text-lg">Email Verified!</h3>
        <p class="text-gray-600 text-sm">
          Your email has been successfully verified. You can now sign in to your account.
        </p>
        <UiCommonNavLink
          to="/auth/login?verified=true"
          variant="primary"
          class="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md font-medium text-white text-sm"
        >
          Continue to Sign In
        </UiCommonNavLink>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="space-y-4">
        <div class="bg-red-50 p-4 rounded-md">
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

        <div class="text-center">
          <UiCommonNavLink 
            to="/auth/register" 
            class="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            ← Back to registration
          </UiCommonNavLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: false
})

// Reactive state
const isVerifying = ref(false)
const verified = ref(false)
const errorMessage = ref('')

// Auto-verify email on page load
onMounted(async () => {
  const route = useRoute()
  const token = route.query.token as string
  const email = route.query.email as string

  if (!token || !email) {
    errorMessage.value = 'Invalid verification link. Please check your email for the correct link.'
    return
  }

  isVerifying.value = true

  try {
    await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: {
        token,
        email
      }
    })

    verified.value = true

  } catch (error: unknown) {
    console.error('Email verification error:', error)
    const errorData = error && typeof error === 'object' && 'data' in error ? error.data : null
    errorMessage.value = (errorData && typeof errorData === 'object' && 'message' in errorData ? errorData.message : 'Email verification failed. The link may have expired or already been used.') as string
  } finally {
    isVerifying.value = false
  }
})
</script>

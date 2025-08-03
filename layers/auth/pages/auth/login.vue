<template>
  <div class="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
    <div class="space-y-8 w-full max-w-md">
      <div>
        <h2 class="mt-6 font-extrabold text-gray-900 text-3xl text-center">
          Sign in to Clinical Trials
        </h2>
        <p class="mt-2 text-gray-600 text-sm text-center">
          Access your clinical trial management system
        </p>
      </div>

      <!-- Login Form -->
      <UiFormsDynamicForm
        v-if="!showTwoFactor"
        ref="loginForm"
        :sections="false"
        :schema="loginFormSchema"
        :submit-fn="handleLogin"
        class="space-y-6 mt-8"
      />

      <!-- Two-Factor Authentication Form -->
      <UiFormsDynamicForm
        v-if="showTwoFactor"
        ref="twoFactorForm"
        :sections="false"
        :schema="twoFactorFormSchema"
        :submit-fn="handleTwoFactorVerify"
        class="space-y-6 mt-8"
      />

      <!-- OAuth Options -->
      <div 
        v-if="authConfig.enableOAuth"
        class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="border-gray-300 border-t w-full" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-gray-50 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="mt-6">
          <UiCommonNavLink
            to="/auth/github"
            variant="outline"
            class="flex justify-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md w-full font-medium text-gray-700 text-sm"
          >
            <Icon
              name="i-simple-icons-github"
              class="mr-2 w-5 h-5" />
            Sign in with GitHub
          </UiCommonNavLink>
        </div>
      </div>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-gray-600 text-sm">
          Don't have an account?
          <UiCommonNavLink 
            to="/auth/register" 
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </UiCommonNavLink>
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="bg-green-50 p-4 rounded-md">
        <div class="flex">
          <Icon
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-green-400" />
          <div class="ml-3">
            <p class="font-medium text-green-800 text-sm">
              {{ successMessage }}
            </p>
          </div>
        </div>
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

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="text-center">
        <Icon
          name="i-heroicons-arrow-path"
          class="mx-auto w-5 h-5 text-indigo-600 animate-spin" />
        <p class="mt-2 text-gray-600 text-sm">Processing...</p>
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

// Get auth configuration from runtime config
const { public: { auth: authConfig } } = useRuntimeConfig()

// Form schemas
const loginFormSchema = createDynamicForm(z.object({
  email: z.string().email('Please enter a valid email address').describe('Email address'),
  requestTwoFactor: z.boolean().default(authConfig.enableTwoFactor).describe('Request two-factor authentication (recommended for clinical staff)')
}))

const twoFactorFormSchema = createDynamicForm(z.object({
  twoFactorCode: z.string().min(6, 'Please enter the 6-digit code').max(6, 'Code must be 6 digits').describe('Two-factor authentication code from your email')
}))

// Reactive state
const showTwoFactor = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const userEmail = ref('')

// Form references
const loginForm = ref()
const twoFactorForm = ref()

// Handle login form submission
const handleLogin = async (formData: { email: string; requestTwoFactor: boolean }) => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { data } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: formData
    })

    userEmail.value = formData.email

    if (data.requiresTwoFactor) {
      showTwoFactor.value = true
      successMessage.value = data.message
    } else {
      successMessage.value = data.message
      // Wait a moment to show the success message, then redirect
      setTimeout(() => {
        navigateTo('/')
      }, 2000)
    }
  } catch (error: unknown) {
    console.error('Login error:', error)
    const errorData = error && typeof error === 'object' && 'data' in error ? error.data : null
    errorMessage.value = (errorData && typeof errorData === 'object' && 'message' in errorData ? errorData.message : 'Login failed. Please try again.') as string
  } finally {
    isLoading.value = false
  }
}

// Handle two-factor verification
const handleTwoFactorVerify = async (formData: { twoFactorCode: string }) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: {
        email: userEmail.value,
        token: '', // Not used for 2FA
        twoFactorCode: formData.twoFactorCode
      }
    })

    successMessage.value = 'Authentication successful! Redirecting...'
    
    // Wait a moment then redirect
    setTimeout(() => {
      navigateTo('/')
    }, 1500)
  } catch (error: unknown) {
    console.error('2FA verification error:', error)
    const errorData = error && typeof error === 'object' && 'data' in error ? error.data : null
    errorMessage.value = (errorData && typeof errorData === 'object' && 'message' in errorData ? errorData.message : 'Verification failed. Please try again.') as string
  } finally {
    isLoading.value = false
  }
}

// Handle URL parameters (for magic link redirects, etc.)
onMounted(() => {
  const route = useRoute()
  
  if (route.query.error === 'oauth_failed') {
    errorMessage.value = 'GitHub authentication failed. Please try again.'
  }
  
  if (route.query.verified === 'true') {
    successMessage.value = 'Email verification successful! You can now sign in.'
  }
})
</script>

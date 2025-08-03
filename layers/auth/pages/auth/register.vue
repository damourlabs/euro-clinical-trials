<template>
  <div class="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
    <div class="space-y-8 w-full max-w-md">
      <div>
        <h2 class="mt-6 font-extrabold text-gray-900 text-3xl text-center">
          Register for Euro Clinical Trials
        </h2>
        <p class="mt-2 text-gray-600 text-sm text-center">
          Join our clinical trial management system
        </p>
      </div>

      <!-- Role Selection -->
      <div
        v-if="!selectedRole"
        class="space-y-4">
        <h3 class="font-medium text-gray-900 text-lg">
          Select your role
        </h3>
        <div class="gap-3 grid grid-cols-1 sm:grid-cols-2">
          <button
            v-for="role in availableRoles"
            :key="role.value"
            class="relative bg-white shadow-sm px-6 py-4 border border-gray-300 hover:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="selectRole(role.value)"
          >
            <div class="flex items-center">
              <Icon
                :name="role.icon"
                class="w-6 h-6 text-indigo-600" />
              <div class="ml-3 text-left">
                <h4 class="font-medium text-gray-900 text-sm">
                  {{ role.label }}
                </h4>
                <p class="text-gray-500 text-xs">
                  {{ role.description }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Registration Form -->
      <UiFormsDynamicForm
        v-if="selectedRole"
        ref="registrationForm"
        :sections="false"
        :schema="registrationFormSchema"
        :submit-fn="handleRegistration"
        class="space-y-6 mt-8"
      />

      <!-- Back Button -->
      <div
        v-if="selectedRole"
        class="text-center">
        <button
          class="text-indigo-600 hover:text-indigo-500 text-sm"
          @click="selectedRole = null"
        >
          ← Back to role selection
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <p class="text-gray-600 text-sm">
          Already have an account?
          <UiCommonNavLink 
            to="/auth/login" 
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
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
        <p class="mt-2 text-gray-600 text-sm">Creating account...</p>
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

// Available roles with descriptions
const availableRoles = [
  {
    value: 'Patient',
    label: 'Patient',
    description: 'Participate in clinical trials',
    icon: 'i-heroicons-user'
  },
  {
    value: 'Investigator',
    label: 'Principal Investigator',
    description: 'Lead clinical research',
    icon: 'i-heroicons-academic-cap'
  },
  {
    value: 'Coordinator',
    label: 'Study Coordinator',
    description: 'Manage trial operations',
    icon: 'i-heroicons-clipboard-document-list'
  },
  {
    value: 'Monitor',
    label: 'Clinical Monitor',
    description: 'Oversee trial compliance',
    icon: 'i-heroicons-shield-check'
  },
  {
    value: 'Nurse',
    label: 'Clinical Nurse',
    description: 'Provide patient care',
    icon: 'i-heroicons-heart'
  },
  {
    value: 'Sponsor',
    label: 'Sponsor Representative',
    description: 'Represent trial sponsor',
    icon: 'i-heroicons-building-office'
  }
]

// Reactive state
const selectedRole = ref<string | null>(null)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form reference
const registrationForm = ref()

// Base registration schema
const baseRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address').describe('Email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').describe('Full name'),
  phoneNumber: z.string().optional().describe('Phone number (optional)'),
  institution: z.string().min(1, 'Institution is required').max(100, 'Institution must be less than 100 characters').describe('Institution or organization'),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required').describe('I consent to the processing of my personal data in accordance with GDPR regulations'),
})

// Role-specific schemas
const patientRegistrationSchema = baseRegistrationSchema.extend({
  reason: z.string().optional().describe('Why are you interested in participating in clinical trials? (optional)')
})

const professionalRegistrationSchema = baseRegistrationSchema.extend({
  specialization: z.string().min(1, 'Specialization is required').describe('Medical specialization or area of expertise'),
  licenseNumber: z.string().optional().describe('Medical license number (if applicable)'),
  experience: z.string().min(1, 'Experience description is required').describe('Years of experience and relevant background'),
  reason: z.string().min(1, 'Please explain your interest').describe('Why do you want to join our clinical trials platform?')
})

// Computed form schema based on selected role
const registrationFormSchema = computed(() => {
  if (!selectedRole.value) return createDynamicForm(baseRegistrationSchema)
  
  const isPatient = selectedRole.value === 'Patient'
  const schema = isPatient ? patientRegistrationSchema : professionalRegistrationSchema
  
  return createDynamicForm(schema)
})

// Select role
const selectRole = (role: string) => {
  selectedRole.value = role
  errorMessage.value = ''
}

// Handle registration form submission
const handleRegistration = async (formData: Record<string, unknown>) => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const registrationData = {
      ...formData,
      requestedRole: selectedRole.value
    }

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: registrationData
    })

    successMessage.value = 'Registration successful! Please check your email to verify your account.'
    
    // Reset form
    selectedRole.value = null
    
    // Redirect to login after a delay
    setTimeout(() => {
      navigateTo('/auth/login?registered=true')
    }, 3000)

  } catch (error: unknown) {
    console.error('Registration error:', error)
    const errorData = error && typeof error === 'object' && 'data' in error ? error.data : null
    errorMessage.value = (errorData && typeof errorData === 'object' && 'message' in errorData ? errorData.message : 'Registration failed. Please try again.') as string
  } finally {
    isLoading.value = false
  }
}
</script>

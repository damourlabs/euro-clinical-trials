<template>
  <div class="mx-auto px-4 py-8 max-w-4xl container">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="flex items-center gap-3 mb-2 font-bold text-gray-900 text-3xl">
        <Cog class="w-8 h-8 text-blue-600" />
        Settings
      </h1>
      <p class="text-gray-600 text-lg">
        Manage your account preferences and application settings
      </p>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white shadow-sm border rounded-lg">
      <!-- Tab Headers -->
      <div class="border-gray-200 border-b">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            <component
              :is="tab.icon"
              class="w-4 h-4"
            />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Profile Settings -->
        <div
          v-if="activeTab === 'profile'"
          class="space-y-6">
          <h3 class="font-semibold text-gray-900 text-lg">Profile Information</h3>
          
          <form
            class="space-y-4"
            @submit.prevent="saveProfile">
            <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label class="block mb-2 font-medium text-gray-700 text-sm">Full Name</label>
                <input
                  v-model="profileSettings.name"
                  type="text"
                  class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                  placeholder="Enter your full name"
                >
              </div>
              <div>
                <label class="block mb-2 font-medium text-gray-700 text-sm">Email Address</label>
                <input
                  v-model="profileSettings.email"
                  type="email"
                  class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                  placeholder="Enter your email"
                >
              </div>
            </div>
            
            <div>
              <label class="block mb-2 font-medium text-gray-700 text-sm">Job Title</label>
              <input
                v-model="profileSettings.jobTitle"
                type="text"
                class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                placeholder="e.g., Clinical Research Coordinator"
              >
            </div>

            <div>
              <label class="block mb-2 font-medium text-gray-700 text-sm">Institution</label>
              <input
                v-model="profileSettings.institution"
                type="text"
                class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                placeholder="Your institution or organization"
              >
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingProfile"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-white transition-colors"
              >
                <Save class="w-4 h-4" />
                {{ savingProfile ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Preferences -->
        <div
          v-if="activeTab === 'preferences'"
          class="space-y-6">
          <h3 class="font-semibold text-gray-900 text-lg">Application Preferences</h3>
          
          <form
            class="space-y-6"
            @submit.prevent="savePreferences">
            <!-- Theme -->
            <div>
              <label class="block mb-3 font-medium text-gray-700 text-sm">Theme</label>
              <div class="space-y-2">
                <label
                  v-for="theme in themeOptions"
                  :key="theme.value" class="flex items-center gap-3">
                  <input
                    v-model="preferences.theme"
                    :value="theme.value"
                    type="radio"
                    class="border-gray-300 focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">{{ theme.label }}</span>
                </label>
              </div>
            </div>

            <!-- Language -->
            <div>
              <label class="block mb-2 font-medium text-gray-700 text-sm">Language</label>
              <select
                v-model="preferences.language"
                class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full max-w-xs"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
              </select>
            </div>

            <!-- Notifications -->
            <div>
              <label class="block mb-3 font-medium text-gray-700 text-sm">Notifications</label>
              <div class="space-y-3">
                <label class="flex items-center gap-3">
                  <input
                    v-model="preferences.emailNotifications"
                    type="checkbox"
                    class="border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">Email notifications for trial updates</span>
                </label>
                <label class="flex items-center gap-3">
                  <input
                    v-model="preferences.adverseEventAlerts"
                    type="checkbox"
                    class="border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">Alerts for adverse events</span>
                </label>
                <label class="flex items-center gap-3">
                  <input
                    v-model="preferences.complianceReminders"
                    type="checkbox"
                    class="border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">GDPR compliance reminders</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingPreferences"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-white transition-colors"
              >
                <Save class="w-4 h-4" />
                {{ savingPreferences ? 'Saving...' : 'Save Preferences' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Clinical Settings -->
        <div
          v-if="activeTab === 'clinical'"
          class="space-y-6">
          <h3 class="font-semibold text-gray-900 text-lg">Clinical Trial Settings</h3>
          
          <form
            class="space-y-6"
            @submit.prevent="saveClinicalSettings">
            <!-- Default Values -->
            <div>
              <label class="block mb-2 font-medium text-gray-700 text-sm">Default Trial Phase</label>
              <select
                v-model="clinicalSettings.defaultPhase"
                class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full max-w-xs"
              >
                <option value="">Select default phase</option>
                <option value="I">Phase I</option>
                <option value="II">Phase II</option>
                <option value="III">Phase III</option>
                <option value="IV">Phase IV</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 font-medium text-gray-700 text-sm">Default Study Type</label>
              <select
                v-model="clinicalSettings.defaultStudyType"
                class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full max-w-xs"
              >
                <option value="">Select default type</option>
                <option value="interventional">Interventional</option>
                <option value="observational">Observational</option>
                <option value="expanded-access">Expanded Access</option>
              </select>
            </div>

            <!-- Compliance Settings -->
            <div>
              <label class="block mb-3 font-medium text-gray-700 text-sm">Compliance Checks</label>
              <div class="space-y-3">
                <label class="flex items-center gap-3">
                  <input
                    v-model="clinicalSettings.autoGdprCheck"
                    type="checkbox"
                    class="border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">Automatic GDPR compliance validation</span>
                </label>
                <label class="flex items-center gap-3">
                  <input
                    v-model="clinicalSettings.mandatoryConsentForms"
                    type="checkbox"
                    class="border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">Require consent forms for all patients</span>
                </label>
                <label class="flex items-center gap-3">
                  <input
                    v-model="clinicalSettings.auditTrailEnabled"
                    type="checkbox"
                    class="border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  >
                  <span class="text-gray-700 text-sm">Enable detailed audit trails</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingClinicalSettings"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-white transition-colors"
              >
                <Save class="w-4 h-4" />
                {{ savingClinicalSettings ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Security -->
        <div
          v-if="activeTab === 'security'"
          class="space-y-6">
          <h3 class="font-semibold text-gray-900 text-lg">Security Settings</h3>
          
          <div class="space-y-6">
            <!-- Change Password -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="mb-3 font-medium text-gray-900">Change Password</h4>
              <form
                class="space-y-4"
                @submit.prevent="changePassword">
                <div>
                  <label class="block mb-2 font-medium text-gray-700 text-sm">Current Password</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full max-w-md"
                  >
                </div>
                <div>
                  <label class="block mb-2 font-medium text-gray-700 text-sm">New Password</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full max-w-md"
                  >
                </div>
                <div>
                  <label class="block mb-2 font-medium text-gray-700 text-sm">Confirm New Password</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full max-w-md"
                  >
                </div>
                <button
                  type="submit"
                  :disabled="changingPassword"
                  class="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-md font-medium text-white transition-colors"
                >
                  <Shield class="w-4 h-4" />
                  {{ changingPassword ? 'Updating...' : 'Update Password' }}
                </button>
              </form>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="mb-3 font-medium text-gray-900">Two-Factor Authentication</h4>
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                  <p class="mt-1 text-gray-500 text-xs">
                    {{ securitySettings.twoFactorEnabled ? 'Currently enabled' : 'Currently disabled' }}
                  </p>
                </div>
                <button
                  :disabled="togglingTwoFactor"
                  :class="[
                    'px-4 py-2 rounded-md font-medium transition-colors',
                    securitySettings.twoFactorEnabled
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  ]"
                  @click="toggleTwoFactor"
                >
                  {{ togglingTwoFactor ? 'Processing...' : (securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cog, User, Settings, Shield, Stethoscope, Save } from 'lucide-vue-next'

// Page metadata
definePageMeta({
    layout: 'simple',
  title: 'Settings',
  description: 'Manage your account preferences and application settings'
})


// Reactive data
const activeTab = ref('profile')
const savingProfile = ref(false)
const savingPreferences = ref(false)
const savingClinicalSettings = ref(false)
const changingPassword = ref(false)
const togglingTwoFactor = ref(false)

// Tab configuration
const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'preferences', name: 'Preferences', icon: Settings },
  { id: 'clinical', name: 'Clinical', icon: Stethoscope },
  { id: 'security', name: 'Security', icon: Shield }
]

// Theme options
const themeOptions = [
  { value: 'light', label: 'Light mode' },
  { value: 'dark', label: 'Dark mode' },
  { value: 'system', label: 'System preference' }
]

// Settings data
const profileSettings = ref({
  name: '',
  email: '',
  jobTitle: '',
  institution: ''
})

const preferences = ref({
  theme: 'light',
  language: 'en',
  emailNotifications: true,
  adverseEventAlerts: true,
  complianceReminders: true
})

const clinicalSettings = ref({
  defaultPhase: '',
  defaultStudyType: '',
  autoGdprCheck: true,
  mandatoryConsentForms: true,
  auditTrailEnabled: true
})

const securitySettings = ref({
  twoFactorEnabled: false
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Methods
const saveProfile = async () => {
  savingProfile.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    // TODO: Replace with actual toast/notification system
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Error saving profile. Please try again.')
  } finally {
    savingProfile.value = false
  }
}

const savePreferences = async () => {
  savingPreferences.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Apply theme changes
    // TODO: Implement theme switching logic
    
    alert('Preferences saved successfully!')
  } catch (error) {
    console.error('Error saving preferences:', error)
    alert('Error saving preferences. Please try again.')
  } finally {
    savingPreferences.value = false
  }
}

const saveClinicalSettings = async () => {
  savingClinicalSettings.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Clinical settings saved successfully!')
  } catch (error) {
    console.error('Error saving clinical settings:', error)
    alert('Error saving clinical settings. Please try again.')
  } finally {
    savingClinicalSettings.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match!')
    return
  }

  changingPassword.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    alert('Password updated successfully!')
  } catch (error) {
    console.error('Error changing password:', error)
    alert('Error changing password. Please try again.')
  } finally {
    changingPassword.value = false
  }
}

const toggleTwoFactor = async () => {
  togglingTwoFactor.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    securitySettings.value.twoFactorEnabled = !securitySettings.value.twoFactorEnabled
    
    const action = securitySettings.value.twoFactorEnabled ? 'enabled' : 'disabled'
    alert(`Two-factor authentication ${action} successfully!`)
  } catch (error) {
    console.error('Error toggling two-factor authentication:', error)
    alert('Error updating two-factor authentication. Please try again.')
  } finally {
    togglingTwoFactor.value = false
  }
}

// Load user data on mount
onMounted(async () => {
  try {
    // TODO: Replace with actual API calls to load user settings
    // This is placeholder data
    profileSettings.value = {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      jobTitle: 'Clinical Research Coordinator',
      institution: 'European Medical Research Center'
    }
  } catch (error) {
    console.error('Error loading user settings:', error)
  }
})
</script>

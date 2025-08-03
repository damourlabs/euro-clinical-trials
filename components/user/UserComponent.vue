<template>
  <div 
    v-if="user" 
    class="space-y-6">
    <!-- Main User Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">{{ user.name }}</h1>
          <p class="mb-4 text-gray-600">{{ user.email }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Name:</span>
              <span class="ml-2 text-gray-900">{{ user.name }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Email:</span>
              <span class="ml-2 text-gray-900">{{ user.email }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Role:</span>
              <StatusBadge 
                :status="user.role" 
                :variant="getRoleVariant(user.role)"
                class="ml-2" />
            </div>
            <!-- TODO: Fix user schema - phone property is missing from user type -->
            <!-- <div v-if="user.phone">
              <span class="font-medium text-gray-700">Phone:</span>
              <span class="ml-2 text-gray-900">{{ user.phone }}</span>
            </div> -->
            <!-- TODO: Fix user schema - department property is missing from user type -->
            <!-- <div v-if="user.department">
              <span class="font-medium text-gray-700">Department:</span>
              <span class="ml-2 text-gray-900">{{ user.department }}</span>
            </div> -->
            <div>
              <span class="font-medium text-gray-700">Status:</span>
              <StatusBadge 
                :status="user.isActive ? 'Active' : 'Inactive'" 
                :variant="user.isActive ? 'success' : 'destructive'"
                class="ml-2" />
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in userActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <!-- TODO: Fix user schema - phone and address properties are missing from user type -->
    <!-- <div 
      v-if="user.phone || user.address"
      class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Contact Information</h2>
      
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 text-sm">
        <div v-if="user.phone">
          <span class="font-medium text-gray-700">Phone:</span>
          <span class="ml-2 text-gray-900">{{ user.phone }}</span>
        </div>
        <div v-if="user.address">
          <span class="font-medium text-gray-700">Address:</span>
          <span class="ml-2 text-gray-900">{{ user.address }}</span>
        </div>
      </div>
    </div> -->

    <!-- Account Details -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h2 class="mb-4 font-semibold text-gray-900 text-lg">Account Details</h2>
      
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 text-sm">
        <div>
          <span class="font-medium text-gray-700">Created At:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(user.createdAt) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Last Updated:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(user.updatedAt) }}</span>
        </div>
        <div v-if="user.lastLoginAt">
          <span class="font-medium text-gray-700">Last Login:</span>
          <span class="ml-2 text-gray-900">{{ formatDate(user.lastLoginAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/server/database/schema'
import { StatusBadge } from '~/components/common/field'

interface Props {
  userId: string
}

const props = defineProps<Props>()

// Fetch user data
const userStore = useUsersStore()
const user = ref<User>()

onMounted(async () => {
  try {
    const result = await userStore.fetchById(props.userId)
    if (result) {
      user.value = result
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
})

// Helper functions
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString()
}

function getRoleVariant(role: string): string {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'destructive'
    case 'principal_investigator':
      return 'warning'
    case 'coordinator':
      return 'default'
    case 'monitor':
      return 'secondary'
    default:
      return 'default'
  }
}

// Action buttons
const userActions = computed(() => [
  {
    label: 'Edit',
    variant: 'outline' as const,
    onClick: () => navigateTo(`/users/${props.userId}/edit`)
  },
  {
    label: 'Delete',
    variant: 'destructive' as const,
    onClick: () => {
      // Add delete confirmation logic
      console.log('Delete user:', props.userId)
    }
  }
])
</script>

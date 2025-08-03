<!-- pages/audits/create.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h1 class="mb-6 font-bold text-gray-900 text-2xl">Create New Audit Entry</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Action</label>
            <select 
              v-model="form.action" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
              <option value="">Select action</option>
              <option value="Create">Create</option>
              <option value="Update">Update</option>
              <option value="Delete">Delete</option>
              <option value="View">View</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Entity Type</label>
            <select 
              v-model="form.entityType" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
              <option value="">Select entity type</option>
              <option value="Trial">Trial</option>
              <option value="Patient">Patient</option>
              <option value="Site">Site</option>
              <option value="User">User</option>
              <option value="AdverseEvent">Adverse Event</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Entity ID</label>
            <input 
              v-model="form.entityUuid" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Enter entity UUID">
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">User ID</label>
            <input 
              v-model="form.userUuid" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Enter user UUID">
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            @click="$router.go(-1)">
            Cancel
          </Button>
          <Button 
            type="submit" 
            :disabled="loading">
            {{ loading ? 'Creating...' : 'Create Audit' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const auditStore = useAuditsStore()
const { loading } = storeToRefs(auditStore)

const form = ref({
  action: '',
  entityType: '',
  entityUuid: '',
  userUuid: ''
})

const handleSubmit = async () => {
  try {
    await auditStore.create(form.value)
    await navigateTo('/audits')
  } catch (error) {
    console.error('Failed to create audit:', error)
  }
}
</script>

<!-- pages/protocols/create.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h1 class="mb-6 font-bold text-gray-900 text-2xl">Create New Protocol</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Enter protocol name">
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Version</label>
            <input 
              v-model="form.version" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Enter version (e.g., 1.0)">
          </div>

          <div class="md:col-span-2">
            <label class="block mb-2 font-medium text-gray-700 text-sm">Description</label>
            <textarea 
              v-model="form.description" 
              rows="4"
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Describe the protocol"/>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Status</label>
            <select 
              v-model="form.status" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
              <option value="">Select status</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>
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
            {{ loading ? 'Creating...' : 'Create Protocol' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const protocolStore = useProtocolsStore()
const { loading } = storeToRefs(protocolStore)

const form = ref({
  name: '',
  version: '',
  description: '',
  status: 'Draft'
})

const handleSubmit = async () => {
  try {
    await protocolStore.create(form.value)
    await navigateTo('/protocols')
  } catch (error) {
    console.error('Failed to create protocol:', error)
  }
}
</script>

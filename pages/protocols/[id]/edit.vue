<!-- pages/protocols/[id]/edit.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h1 class="mb-6 font-bold text-gray-900 text-2xl">Edit Protocol</h1>
      
      <form 
        v-if="form.name !== undefined" 
        @submit.prevent="handleSubmit">
        <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Version</label>
            <input 
              v-model="form.version" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
          </div>

          <div class="md:col-span-2">
            <label class="block mb-2 font-medium text-gray-700 text-sm">Description</label>
            <textarea 
              v-model="form.description" 
              rows="4"
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"/>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Status</label>
            <select 
              v-model="form.status" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
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
            {{ loading ? 'Updating...' : 'Update Protocol' }}
          </Button>
        </div>
      </form>

      <div 
        v-else 
        class="py-8 text-center">
        <p class="text-gray-500">Loading protocol data...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const protocolId = route.params.id as string

const protocolStore = useProtocolsStore()
const { loading } = storeToRefs(protocolStore)

const form = ref({
  name: undefined as string | undefined,
  version: '',
  description: '',
  status: ''
})

onMounted(async () => {
  try {
    const protocol = await protocolStore.fetchById(protocolId)
    if (protocol) {
      form.value = {
        name: protocol.name,
        version: protocol.version || '',
        description: protocol.description || '',
        status: protocol.status || 'Draft'
      }
    }
  } catch (error) {
    console.error('Failed to fetch protocol:', error)
  }
})

const handleSubmit = async () => {
  try {
    await protocolStore.update(protocolId, form.value)
    await navigateTo(`/protocols/${protocolId}`)
  } catch (error) {
    console.error('Failed to update protocol:', error)
  }
}
</script>

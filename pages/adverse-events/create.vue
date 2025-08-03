<!-- pages/adverse-events/create.vue -->
<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h1 class="mb-6 font-bold text-gray-900 text-2xl">Report New Adverse Event</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="block mb-2 font-medium text-gray-700 text-sm">Description</label>
            <textarea 
              v-model="form.description" 
              rows="3"
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Describe the adverse event"/>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Patient ID</label>
            <input 
              v-model="form.patientUuid" 
              type="text" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
              placeholder="Enter patient UUID">
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Severity</label>
            <select 
              v-model="form.severity" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
              <option value="">Select severity</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Outcome</label>
            <select 
              v-model="form.outcome" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
              <option value="">Select outcome</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Resolved">Resolved</option>
              <option value="Resolved with sequelae">Resolved with sequelae</option>
              <option value="Fatal">Fatal</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700 text-sm">Date Occurred</label>
            <input 
              v-model="form.dateOccurred" 
              type="date" 
              class="border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full">
          </div>

          <div class="flex items-center">
            <input 
              id="relatedToTrial"
              v-model="form.relatedToTrial" 
              type="checkbox" 
              class="mr-2 border-gray-300 rounded focus:ring-blue-500">
            <label 
              for="relatedToTrial" 
              class="font-medium text-gray-700 text-sm">
              Related to trial
            </label>
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
            {{ loading ? 'Reporting...' : 'Report Adverse Event' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const adverseEventStore = useAdverseEventsStore()
const { loading } = storeToRefs(adverseEventStore)

const form = ref({
  description: '',
  patientUuid: '',
  severity: '',
  outcome: '',
  dateOccurred: '',
  relatedToTrial: false
})

const handleSubmit = async () => {
  try {
    await adverseEventStore.create(form.value)
    await navigateTo('/adverse-events')
  } catch (error) {
    console.error('Failed to create adverse event:', error)
  }
}
</script>

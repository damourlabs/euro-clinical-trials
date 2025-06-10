<!-- pages/patients/[id]/index.vue -->
<template>
  <div>
    <template v-if="doWeHaveData">
      <PatientComponent :patient="patient" />
    </template>

    <div
      v-show="patient === undefined"
      class="flex justify-center items-center h-32">
      <p class="text-muted-foreground">Loading patient data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Patient } from '~/models/patients'

// Route params
const route = useRoute()
const patientId = route.params.id as string

// Composables
const { fetchById } = usePatientsStore()

const patient = ref<Patient>()

onMounted(async () => {
    try {
        const val = await fetchById(patientId)
        if (val) {
            patient.value = val
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'Patient not found',
                message: `Patient with ID ${patientId} not found`
            })
        }
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found',
            message: `Patient with ID ${patientId} not found`
        })
    }
})

const doWeHaveData = computed(() => { 
    return patient.value !== undefined && Object.keys(patient.value).length > 0
})

// SEO
useHead({
    title: computed(() => patient.value !== undefined ? `Patient ${patient.value.subjectId} - CTMS` : 'Patient Details - CTMS')
})

definePageMeta({
    layout: 'simple',
    title: computed(() => patient.value !== undefined ? `Patient ${patient.value.subjectId} - CTMS` : 'Patient Details - CTMS'),
    meta: [
        {
            name: 'description',
            content: computed(() => patient.value !== undefined ? `Details for patient ${patient.value.subjectId} in trial ${patient.value.trialId}` : 'Details of the patient')
        }
    ]
})
</script>
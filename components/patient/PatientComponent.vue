<template>
  <div 
    v-if="patient" 
    class="space-y-6">
    <!-- Main Patient Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">Patient {{ patient.subjectId }}</h1>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Subject ID:</span>
              <span class="ml-2 text-gray-900">{{ patient.subjectId }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Status:</span>
              <span class="ml-2 text-gray-900 capitalize">{{ patient.status }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Enrollment Date:</span>
              <span class="ml-2 text-gray-900">{{ patient.enrollmentDate ? new Date(patient.enrollmentDate).toLocaleDateString() : 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Randomization Group:</span>
              <span class="ml-2 text-gray-900">{{ patient.randomizationGroup || 'N/A' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in patientActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Related Data Sections -->
    
    <!-- Visits Section -->
    <section v-if="visits && visits.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Patient Visits ({{ visits.length }})
      </h3>
      <VisitDataTable :visits="visits" />
    </section>

    <!-- Adverse Events Section -->
    <section v-if="adverseEvents && adverseEvents.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Adverse Events ({{ adverseEvents.length }})
      </h3>
      <AdverseEventDataTable :adverse-events="adverseEvents" />
    </section>

    <!-- GDPR Consents Section -->
    <section v-if="gdprConsents && gdprConsents.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        GDPR Consents ({{ gdprConsents.length }})
      </h3>
      <GDPRConsentDataTable :gdpr-consents="gdprConsents" />
    </section>

    <!-- Single-Entity Information Cards -->
    
    <!-- Trial and Site Information -->
    <section>
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Trial Information
      </h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div v-if="trial">
          <Label class="block mb-2 font-medium text-gray-600 text-sm">Trial</Label>
          <TrialCard
            size="medium"
            :trial="trial" />
        </div>
        <div v-if="site">
          <Label class="block mb-2 font-medium text-gray-600 text-sm">Site</Label>
          <SiteCard
            size="medium"
            :site="site" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { Visit, AdverseEvent, GdprConsent } from '~/server/database/schema'
import { VisitDataTable } from '~/components/visit'
import { AdverseEventDataTable } from '~/components/adverse-event'
import { GDPRConsentDataTable } from '~/components/gdpr-consent'
import { TrialCard } from '~/components/trial'
import { SiteCard } from '~/components/site'

interface Props {
  patientId: string
}

const props = defineProps<Props>()

// Composables
const patientsStore = usePatientsStore()
const trialsStore = useTrialsStore()
const sitesStore = useSitesStore()

// Reactive references
const patient = computed(() => patientsStore.getById(props.patientId))
const visits = ref<Visit[]>([])
const adverseEvents = ref<AdverseEvent[]>([])
const gdprConsents = ref<GdprConsent[]>([])

// Computed properties for related entities
const trial = computed(() => {
  if (!patient.value?.trialUuid) return null
  return trialsStore.getById(patient.value.trialUuid)
})

const site = computed(() => {
  if (!patient.value?.siteUuid) return null
  return sitesStore.getById(patient.value.siteUuid)
})

// Patient actions for the component
const patientActions = computed(() => [
  {
    label: 'Edit',
    onClick: () => navigateTo(`/patients/${patient.value?.uuid}/edit`),
    variant: 'outline' as const
  },
  {
    label: 'Delete',
    onClick: deletePatient,
    variant: 'destructive' as const
  }
])

onMounted(async () => {
  try {
    // Fetch patient data
    await patientsStore.fetchById(props.patientId)
    
    // Fetch related trial and site
    if (patient.value?.trialUuid) {
      await trialsStore.fetchById(patient.value.trialUuid)
    }
    if (patient.value?.siteUuid) {
      await sitesStore.fetchById(patient.value.siteUuid)
    }
    
    visits.value = await patientsStore.customMethods.getPatientVisits(props.patientId)
    adverseEvents.value = await patientsStore.customMethods.getPatientAdverseEvents(props.patientId)
    gdprConsents.value = await patientsStore.customMethods.getPatientGdprConsents(props.patientId)

  } catch (error) {
    console.error('Error fetching patient data:', error)
  }
})

// Set dynamic SEO based on the patient data
useHead({
  title: `Patient ${patient.value?.subjectId} - CTMS`,
  meta: [
    {
      name: 'description',
      content: `Patient details for ${patient.value?.subjectId}`
    }
  ]
})

const deletePatient = async () => {
  if (!patient.value) return
  
  console.log('Deleting patient:', patient.value.uuid)
  await patientsStore.remove(patient.value.uuid)
  console.log('Patient deleted:', patient.value.uuid)

  // Navigate back to patients list after deletion
  await navigateTo('/patients', {
    replace: true
  })
}
</script>

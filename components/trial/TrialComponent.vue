<template>
  <div
    v-if="trial"
    class="space-y-6">
    <!-- Main Trial Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">{{ trial.title }}</h1>
          <p class="mb-4 text-gray-600">{{ trial.description }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Trial ID:</span>
              <span class="ml-2 text-gray-900">{{ trial.uuid }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Status:</span>
              <span class="ml-2 text-gray-900 capitalize">{{ trial.status }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Phase:</span>
              <span class="ml-2 text-gray-900">{{ trial.phase }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Start Date:</span>
              <span class="ml-2 text-gray-900">{{ trial.startDate ? new Date(trial.startDate).toLocaleDateString() : 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">End Date:</span>
              <span class="ml-2 text-gray-900">{{ trial.actualEndDate ? new Date(trial.actualEndDate).toLocaleDateString() : 'N/A' }}</span>
            </div>s
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in trialActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <!-- <div class="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        @click="navigateTo(`/trials/${trial.uuid}/edit`)">
        Edit Trial
      </Button>
      <Button
        variant="destructive"
        size="sm"
        @click="deleteTrial">
        Delete Trial
      </Button>
    </div> -->

    <!-- Related Data Sections -->
    
    <!-- Sites Section -->
    <section  v-if="sites && sites.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Clinical Sites ({{ sites.length }})
      </h3>
      <SiteDataTable
        :sites="sites"/>
    </section>
    <CommonResourceListLoadingFallback
      v-else
      resource-type="sites"
      :rows="2"
      :columns="10" />

    <!-- Patients Section -->
    <section v-if="patients && patients.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Enrolled Patients ({{ patients.length }})
      </h3>
      <PatientDataTable :patients="patients" />
    </section>
    <CommonResourceListLoadingFallback
      v-else
      resource-type="patients"
      :rows="5"
      :columns="10" />

    <!-- Eligibility Criteria Section -->
    <section v-if="eligibilityCriteria && eligibilityCriteria.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Eligibility Criteria ({{ eligibilityCriteria.length }})
      </h3>
      <EligibilityDataTable :eligibility-criteria="eligibilityCriteria" />
    </section>

    <!-- Documents Section -->
    <section v-if="documents && documents.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Trial Documents ({{ documents.length }})
      </h3>
      <DocumentDataTable :documents="documents" />
    </section>

    <!-- Single-Entity Information Cards -->
    
    <!-- Trial Team Section -->
    <section>
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Trial Team
      </h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div v-if="sponsor">
          <Label class="block mb-2 font-medium text-gray-600 text-sm">Sponsor</Label>
          <UserCard
            size="medium"
            :user="sponsor" />
        </div>
        <div v-if="principalInvestigator">
          <Label class="block mb-2 font-medium text-gray-600 text-sm">Principal Investigator</Label>
          <UserCard
            size="medium"
            :user="principalInvestigator" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { Site, Patient, EligibilityCriteria, Document, StudyDesign, ComplianceStatus, RegulatoryApproval, ProtocolDeviation } from '~/server/database/schema'
import { SiteDataTable } from '~/components/site'
import { PatientDataTable } from '~/components/patient'
import { EligibilityDataTable } from '~/components/eligibility'
import { DocumentDataTable } from '~/components/document'
import { UserCard } from '~/components/user'

interface Props {
  trialId: string
}

const props = defineProps<Props>()

// Composables
const trialsStore = useTrialsStore()
const usersStore = useUsersStore()

// Reactive references
const trial = computed(() => trialsStore.getById(props.trialId))
const sites = ref<Site[]>([])
const patients = ref<Patient[]>([])
const eligibilityCriteria = ref<EligibilityCriteria[]>([])
const documents = ref<Document[]>([])
const studyDesign = ref<StudyDesign | null>(null)
const complianceStatus = ref<ComplianceStatus | null>(null)
const regulatoryApprovals = ref<RegulatoryApproval[]>([])
const protocolDeviations = ref<ProtocolDeviation[]>([])
// const users = ref<User[]>([])

// Computed properties for trial team
const sponsor = computed(() => {
  if (!trial.value?.sponsorUuid) return null
  return usersStore.getById(trial.value.sponsorUuid)
})

const principalInvestigator = computed(() => {
  if (!trial.value?.principalInvestigatorUuid) return null
  return usersStore.getById(trial.value.principalInvestigatorUuid)
})

// Trial actions for the component
const trialActions = computed(() => [
  {
    label: 'Edit',
    onClick: () => navigateTo(`/trials/${trial.value?.uuid}/edit`),
    variant: 'outline' as const
  },
  {
    label: 'Delete',
    onClick: deleteTrial,
    variant: 'destructive' as const
  }
])

onMounted(async () => {
  try {
    // Fetch trial data
    await trialsStore.fetchById(props.trialId)
    
    // Fetch related users
    if (trial.value?.sponsorUuid) {
      await usersStore.fetchById(trial.value.sponsorUuid)
    }
    if (trial.value?.principalInvestigatorUuid) {
      await usersStore.fetchById(trial.value.principalInvestigatorUuid)
    }
    
    // Fetch related data using custom methods
    console.log("Fetching trial related data...")
    
    sites.value = await trialsStore.customMethods.getTrialSites(props.trialId)
    patients.value = await trialsStore.customMethods.getTrialPatients(props.trialId)
    regulatoryApprovals.value = await trialsStore.customMethods.getTrialRegulatoryApprovals(props.trialId)
    protocolDeviations.value = await trialsStore.customMethods.getTrialProtocolDeviations(props.trialId)
    documents.value = await trialsStore.customMethods.getTrialDocuments(props.trialId)
    studyDesign.value = await trialsStore.customMethods.getTrialStudyDesign(props.trialId)
    eligibilityCriteria.value = await trialsStore.customMethods.getTrialEligibilityCriteria(props.trialId)
    complianceStatus.value = await trialsStore.customMethods.getTrialComplianceStatus(props.trialId)
    
  } catch (error) {
    console.error('Error fetching trial data:', error)
  }
})

// Set dynamic SEO based on the trial data
useHead({
  title: `${trial.value?.title} - CTMS`,
  meta: [
    {
      name: 'description',
      content: trial.value?.description || 'Clinical Trial Details'
    }
  ]
})

const deleteTrial = async () => {
  if (!trial.value) return
  
  console.log('Deleting trial:', trial.value.uuid)
  await trialsStore.remove(trial.value.uuid)
  console.log('Trial deleted:', trial.value.uuid)

  // Navigate back to trials list after deletion
  await navigateTo('/trials', {
    replace: true
  })
}
</script>

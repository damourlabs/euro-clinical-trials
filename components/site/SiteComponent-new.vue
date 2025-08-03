<template>
  <div 
    v-if="site" 
    class="space-y-6">
    
    <!-- Main Site Information (Large Card) -->
    <SiteCard
      size="large"
      :site="site"
      :clickable="false"
      :actions="siteActions"
      class="mb-6"
    />
    
    <!-- Action Buttons -->
    <div class="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        @click="navigateTo(`/sites/${site.uuid}/edit`)">
        Edit Site
      </Button>
      <Button
        variant="destructive"
        size="sm"
        @click="deleteSite">
        Delete Site
      </Button>
    </div>

    <!-- Site Overview Cards (Medium Size) -->
    <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      
      <!-- Site Statistics Card -->
      <div class="space-y-2">
        <h4 class="font-medium text-gray-700 text-sm">Site Statistics</h4>
        <SiteCard
          size="medium"
          :site="siteWithStats"
          :clickable="false"
          :custom-fields="statsFields"
        />
      </div>

      <!-- Trial Information Card -->
      <div 
        v-if="trial" 
        class="space-y-2">
        <h4 class="font-medium text-gray-700 text-sm">Associated Trial</h4>
        <TrialCard
          size="medium"
          :trial="trial"
          :clickable="true"
        />
      </div>

      <!-- Site Team Card -->
      <div class="space-y-2">
        <h4 class="font-medium text-gray-700 text-sm">Site Team</h4>
        <div class="space-y-2">
          <UserCard
            v-if="principalInvestigator"
            size="small"
            :user="principalInvestigator"
            :clickable="true"
          />
          <UserCard
            v-if="studyCoordinator"
            size="small"
            :user="studyCoordinator"
            :clickable="true"
          />
        </div>
      </div>
    </div>

    <!-- Related Data Sections -->
    
    <!-- Patients at this Site -->
    <section v-if="patients && patients.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Patients at Site ({{ patients.length }})
      </h3>
      <PatientDataTable :patients="patients" />
    </section>

    <!-- Visits at this Site -->
    <section v-if="visits && visits.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Visits at Site ({{ visits.length }})
      </h3>
      <VisitDataTable :visits="visits" />
    </section>

    <!-- Site Documents -->
    <section v-if="documents && documents.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Site Documents ({{ documents.length }})
      </h3>
      <DocumentDataTable :documents="documents" />
    </section>

    <!-- Protocol Deviations -->
    <section v-if="protocolDeviations && protocolDeviations.length > 0">
      <h3 class="mb-3 font-semibold text-gray-800 text-lg">
        Protocol Deviations ({{ protocolDeviations.length }})
      </h3>
      <div class="space-y-3">
        <div 
          v-for="deviation in protocolDeviations" 
          :key="deviation.uuid"
          class="p-4 border border-l-4 border-l-yellow-200 rounded-lg">
          <div class="gap-4 grid grid-cols-1 md:grid-cols-3">
            <div class="md:col-span-2">
              <Label class="font-medium text-gray-600 text-sm">Description</Label>
              <p class="mt-1 text-sm">{{ deviation.description }}</p>
            </div>
            <div>
              <Label class="font-medium text-gray-600 text-sm">Severity</Label>
              <Badge class="mt-1">{{ deviation.severity }}</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { Patient, Visit, Document, ProtocolDeviation } from '~/server/database/schema'
import { SiteCard } from '~/components/site'
import { TrialCard } from '~/components/trial'
import { UserCard } from '~/components/user'
import { PatientDataTable } from '~/components/patient'
import { VisitDataTable } from '~/components/visit'
import { DocumentDataTable } from '~/components/document'

interface Props {
  siteId: string
}

const props = defineProps<Props>()

// Composables
const sitesStore = useSitesStore()
const trialsStore = useTrialsStore()
const usersStore = useUsersStore()

// Reactive references
const site = computed(() => sitesStore.getById(props.siteId))
const patients = ref<Patient[]>([])
const visits = ref<Visit[]>([])
const documents = ref<Document[]>([])
const protocolDeviations = ref<ProtocolDeviation[]>([])

// Computed properties for related entities
const trial = computed(() => {
  if (!site.value?.trialUuid) return null
  return trialsStore.getById(site.value.trialUuid)
})

const principalInvestigator = computed(() => {
  if (!site.value?.principalInvestigatorUuid) return null
  return usersStore.getById(site.value.principalInvestigatorUuid)
})

const studyCoordinator = computed(() => {
  if (!site.value?.studyCoordinatorUuid) return null
  return usersStore.getById(site.value.studyCoordinatorUuid)
})

// Enhanced site data for statistics card
const siteWithStats = computed(() => {
  if (!site.value) return null
  return {
    ...site.value,
    totalPatients: patients.value.length,
    totalVisits: visits.value.length,
    deviationsCount: protocolDeviations.value.length
  }
})

// Custom field configurations for different card contexts
const statsFields = {
  medium: [
    { key: 'patientsEnrolled', label: 'Patients Enrolled', type: 'number' as const },
    { key: 'targetEnrollment', label: 'Target Enrollment', type: 'number' as const },
    { key: 'dataCompleteness', label: 'Data Complete', type: 'percentage' as const },
    { key: 'totalVisits', label: 'Total Visits', type: 'number' as const },
    { key: 'deviationsCount', label: 'Deviations', type: 'number' as const }
  ]
}

// Site actions for the ResourceCard
const siteActions = computed(() => [
  {
    label: 'Edit',
    onClick: () => navigateTo(`/sites/${site.value?.uuid}/edit`),
    variant: 'secondary' as const
  },
  {
    label: 'Delete',
    onClick: deleteSite,
    variant: 'destructive' as const
  }
])

onMounted(async () => {
  try {
    // Fetch site data
    await sitesStore.fetchById(props.siteId)
    
    // Fetch related trial
    if (site.value?.trialUuid) {
      await trialsStore.fetchById(site.value.trialUuid)
    }
    
    // Fetch related users
    if (site.value?.principalInvestigatorUuid) {
      await usersStore.fetchById(site.value.principalInvestigatorUuid)
    }
    if (site.value?.studyCoordinatorUuid) {
      await usersStore.fetchById(site.value.studyCoordinatorUuid)
    }
    
    // Fetch related data using custom methods
    console.log("Fetching site related data...")
    
    patients.value = await sitesStore.customMethods.getSitePatients(props.siteId)
    visits.value = await sitesStore.customMethods.getSiteVisits(props.siteId)
    documents.value = await sitesStore.customMethods.getSiteDocuments(props.siteId)
    protocolDeviations.value = await sitesStore.customMethods.getSiteProtocolDeviations(props.siteId)
    
  } catch (error) {
    console.error('Error fetching site data:', error)
  }
})

// Set dynamic SEO based on the site data
useHead({
  title: `${site.value?.name} - CTMS`,
  meta: [
    {
      name: 'description',
      content: `Site details for ${site.value?.name}`
    }
  ]
})

const deleteSite = async () => {
  if (!site.value) return
  
  console.log('Deleting site:', site.value.uuid)
  await sitesStore.remove(site.value.uuid)
  console.log('Site deleted:', site.value.uuid)

  // Navigate back to sites list after deletion
  await navigateTo('/sites', {
    replace: true
  })
}
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
    <!-- Hero Section -->
    <section class="flex flex-col items-center gap-2 mx-auto py-8 md:py-12 lg:py-24 md:pb-8 lg:pb-20 max-w-[980px]">
      <UiCommonHero v-bind="heroProps">
        <template #title>
          Euro Clinical Trials
        </template>
        <template #description>
          Comprehensive Clinical Trial Management System designed for European regulatory compliance.
          Manage trials, patients, and sites with built-in GDPR compliance and EudraCT integration.
        </template>
      </UiCommonHero>
      
      <!-- Quick Stats -->
      <div class="gap-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-16">
        <UiCommonStatCard 
          :value="totalTrials" 
          label="Total Trials" 
          :icon="FlaskConical" 
          color="blue" />
        <UiCommonStatCard 
          :value="activeTrials" 
          label="Active Trials" 
          :icon="Activity" 
          color="green" />
        <UiCommonStatCard 
          :value="totalEnrolled || 0" 
          label="Enrolled Patients" 
          :icon="Users" 
          color="purple" /> -->
        <UiCommonStatCard 
          :value="gdprCompliantTrials" 
          label="GDPR Compliant" 
          :icon="Shield" 
          color="teal" />
      </div>
      
    </section>

    <!-- Features Section -->
    <section class="bg-white px-4 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 text-center">
          <h2 class="mb-4 font-bold text-gray-900 text-3xl">Key Features</h2>
          <p class="mx-auto max-w-2xl text-gray-600 text-lg">
            Everything you need to manage clinical trials efficiently and compliantly
          </p>
        </div>

        <div class="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <UiCommonFeatureCard 
            title="Trial Management"
            description="Complete lifecycle management of clinical trials with protocol tracking and phase management"
            :icon="Microscope"
            link="/trials" />
            
          <UiCommonFeatureCard 
            title="Patient Management"
            description="GDPR-compliant patient enrollment, monitoring, and adverse event tracking"
            :icon="UserCheck"
            link="/patients" />
            
          <UiCommonFeatureCard 
            title="Site Management"
            description="Manage multiple trial sites with role-based access and real-time coordination"
            :icon="MapPin"
            link="/sites" />
            
          <UiCommonFeatureCard 
            title="Document Management"
            description="Centralized document storage and management with trial and site associations"
            :icon="FileText"
            link="/documents" />
            
          <UiCommonFeatureCard 
            title="Regulatory Approvals"
            description="Track regulatory approvals, compliance status, and expiry dates across authorities"
            :icon="Shield"
            link="/regulatory-approvals" />
            
          <UiCommonFeatureCard 
            title="User Management"
            description="Manage trial staff, roles, and permissions with comprehensive access control"
            :icon="Users"
            link="/users" />
        </div>
      </div>
    </section>

    <!-- Recent Activity Section -->
    <section class="bg-gray-50 px-4 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 text-center">
          <h2 class="mb-4 font-bold text-gray-900 text-3xl">Recent Activity</h2>
          <p class="text-gray-600 text-lg">Latest updates from your clinical trials</p>
        </div>

        <div class="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <!-- Recent Trials -->
          <Card class="p-6">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Clock class="w-5 h-5 text-indigo-600" />
                Recent Trials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                v-if="isLoading" 
                class="flex justify-center items-center h-32">
                <div class="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin" />
              </div>
              <div 
                v-else-if="recentTrials.length > 0" 
                class="space-y-3">
                <TrialCard
                  v-for="trial in recentTrials.slice(0, 3)"
                  :key="trial.uuid"
                  :trial="trial"
                  size="small" />
              </div>
              <div 
                v-else 
                class="py-8 text-gray-500 text-center">
                No trials found. <UiCommonNavLink 
                  to="/trials/create" 
                  class="text-blue-600">Create your first trial</UiCommonNavLink>
              </div>
            </CardContent>
          </Card>

          <!-- Recent Patients -->
          <Card class="p-6">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Users class="w-5 h-5 text-purple-600" />
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                v-if="isLoadingPatients" 
                class="flex justify-center items-center h-32">
                <div class="border-purple-600 border-b-2 rounded-full w-8 h-8 animate-spin" />
              </div>
              <div 
                v-else-if="recentPatients.length > 0" 
                class="space-y-3">
                <PatientCard
                  v-for="patient in recentPatients.slice(0, 3)"
                  :key="patient.uuid"
                  :patient="patient"
                  size="small" />
              </div>
              <div 
                v-else 
                class="py-8 text-gray-500 text-center">
                No patients enrolled. <UiCommonNavLink 
                  to="/patients/create" 
                  class="text-purple-600">Enroll first patient</UiCommonNavLink>
              </div>
            </CardContent>
          </Card>

          <!-- Quick Actions -->
          <Card class="p-6">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Zap class="w-5 h-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <UiCommonNavLink 
                  to="/trials/create" 
                  variant="outline" 
                  class="flex justify-between items-center hover:bg-blue-50 p-3 rounded-lg w-full transition-colors">
                  <div class="flex items-center gap-3">
                    <Plus class="w-4 h-4" />
                    <span>Create New Trial</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </UiCommonNavLink>
                
                <UiCommonNavLink 
                  to="/patients/create" 
                  variant="outline" 
                  class="flex justify-between items-center hover:bg-green-50 p-3 rounded-lg w-full transition-colors">
                  <div class="flex items-center gap-3">
                    <UserPlus class="w-4 h-4" />
                    <span>Enroll New Patient</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </UiCommonNavLink>
                
                <UiCommonNavLink 
                  to="/sites/create" 
                  variant="outline" 
                  class="flex justify-between items-center hover:bg-purple-50 p-3 rounded-lg w-full transition-colors">
                  <div class="flex items-center gap-3">
                    <Building class="w-4 h-4" />
                    <span>Add New Site</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </UiCommonNavLink>
                
                <UiCommonNavLink 
                  to="/dashboard/trials" 
                  variant="outline" 
                  class="flex justify-between items-center hover:bg-indigo-50 p-3 rounded-lg w-full transition-colors">
                  <div class="flex items-center gap-3">
                    <BarChart3 class="w-4 h-4" />
                    <span>View Analytics</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </UiCommonNavLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    
  </div>
</template>

<script setup lang="ts">
import { 
  FlaskConical, 
  Activity, 
  Microscope, 
  UserCheck, 
  MapPin,   
  Clock, 
  Zap, 
  Plus, 
  UserPlus, 
  Building, 
  BarChart3, 
  ChevronRight,
  ChartBarIcon,
  Users,
  FileText,
  Shield
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { CardContent, CardHeader, CardTitle } from '~ui/components/ui/card'
import { TrialCard } from '~/components/trial'
import { PatientCard } from '~/components/patient'
import type { HeroProps } from '~ui/components/common/Hero.vue'

definePageMeta({
  layout: 'simple'
})

// SEO
useHead({
  title: 'Euro Clinical Trials - Clinical Trial Management System',
  meta: [
    { name: 'description', content: 'Comprehensive Clinical Trial Management System for European regulatory compliance. Manage trials, patients, and sites with GDPR compliance and EudraCT integration.' },
    { name: 'keywords', content: 'clinical trials, CTMS, EudraCT, GDPR, regulatory compliance, trial management' }
  ]
})

// Stores and data
const trialsStore = useTrialsStore()
const patientsStore = usePatientsStore()
const { items: trials } = storeToRefs(trialsStore)
const { items: patients } = storeToRefs(patientsStore)
const { fetchAll, isLoading } = trialsStore
const { loading: isLoadingPatients } = patientsStore

const heroProps: HeroProps = {
  actions: [
  {
    name: 'View Dashboard',
    to: '/dashboard/trials',
    variant: 'default',
    leftIcon: ChartBarIcon
  },
  {
    name: 'Create New Trial',
    to: '/trials/create',
    variant: 'outline',
    leftIcon: Plus
  }
]
}

// Computed statistics
const totalTrials = computed(() => trials.value?.length || 0)
const activeTrials = computed(() => 
  trials.value?.filter(trial => trial.status === 'Active').length || 0
)

// const totalPatients = computed(() => patients.value?.length || 0)
// const activePatients = computed(() => 
//   patients.value?.filter(patient => patient.status === 'Active').length || 0
// )

// Recent items
const recentTrials = computed(() => {
  if (!trials.value) return []
  return [...trials.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const recentPatients = computed(() => {
  if (!patients.value) return []
  return [...patients.value]
    .sort((a, b) => new Date(b.enrollmentDate || '').getTime() - new Date(a.enrollmentDate || '').getTime())
    .slice(0, 5)
})

const totalEnrolled = computed(() => 
  patients.value?.filter(patient => patient.status === 'Enrolled').length || 0
)

const gdprCompliantTrials = computed(() => 
  trials.value?.filter(trial => trial.regulatoryCompliance.complianceStatus.gdprCompliant).length || 0
)

const { navigationConfig, updateNavigationConfig } = useNavigation();
// Update the navigation configuration with the provided props
onMounted(async () => {
  // Fetch data
  await fetchAll()
  await patientsStore.fetchAll()
  
  updateNavigationConfig({
    ...navigationConfig.value,
    hasBreadcrumbs: false,
  });
});

// onU(() => {
//   updateNavigationConfig({
//     ...navigationConfig.value,
//     hasBreadcrumbs: false,
//   });
// });



// onUpdated(() => {
//   updateNavigationConfig({
//     ...navigationConfig.value,
//     hasBreadcrumbs: false,
//   });
// });


onBeforeRouteLeave(() => {
  console.log('Leaving the page, resetting navigation config')
  // Reset the navigation configuration when leaving the page
  updateNavigationConfig({
    ...navigationConfig.value,
    hasBreadcrumbs: true,
  });
})

// Load data on mount
onMounted(async () => {
  await fetchAll()
})
</script>
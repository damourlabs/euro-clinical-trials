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
          :value="totalEnrolled" 
          label="Enrolled Patients" 
          :icon="Users" 
          color="purple" />
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

        <div class="gap-8 grid grid-cols-1 lg:grid-cols-2">
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
                <div 
                  v-for="trial in recentTrials.slice(0, 3)" 
                  :key="trial.id"
                  class="flex justify-between items-start hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ trial.basicInfo.title }}</h4>
                    <p class="text-gray-500 text-sm">{{ trial.basicInfo.indication }}</p>
                  </div>
                  <Badge :class="getStatusColor(trial.timeline.status)">
                    {{ trial.timeline.status }}
                  </Badge>
                </div>
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
  Users, 
  Shield, 
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
  ChartBarIcon
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { CardContent, CardHeader, CardTitle } from '~ui/components/ui/card'
import { Badge } from '~ui/components/ui/badge'
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

// Store and data
const store = useTrialsStore()
const { items: trials } = storeToRefs(store)
const { fetchAll, isLoading } = store

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
  trials.value?.filter(trial => trial.timeline.status === 'Active').length || 0
)
const totalEnrolled = computed(() => {
  if (!trials.value) return 0
  return trials.value.reduce((sum, trial) => {
    return sum + (trial.participantEnrollment.currentEnrollment || 0)
  }, 0)
})
const gdprCompliantTrials = computed(() => 
  trials.value?.filter(trial => trial.regulatoryCompliance.complianceStatus.gdprCompliant).length || 0
)

const recentTrials = computed(() => {
  if (!trials.value) return []
  return [...trials.value]
    .sort((a, b) => new Date(b.timeline.startDate).getTime() - new Date(a.timeline.startDate).getTime())
    .slice(0, 5)
})

// Helper functions
const getStatusColor = (status: string) => {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Planning': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-gray-100 text-gray-800',
    'Paused': 'bg-yellow-100 text-yellow-800',
    'Terminated': 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}


const { navigationConfig, updateNavigationConfig } = useNavigation();
// Update the navigation configuration with the provided props
onMounted(() => {
  
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
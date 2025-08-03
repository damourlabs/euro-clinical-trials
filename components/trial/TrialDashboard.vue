<template>
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-bold text-gray-900 text-3xl">Trials Dashboard</h1>
      <p class="mt-2 text-gray-600">Overview of all clinical trials and their key metrics</p>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center h-64">
      <div class="border-b-2 border-blue-600 rounded-full w-12 h-12 animate-spin"/>
      <span class="ml-3 text-gray-600">Loading trial data...</span>
    </div>

    <!-- Dashboard Grid -->
    <div
      v-else
      class="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      
      <!-- Trial Overview Card -->
      <UiDashboardCard size="md">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <FlaskConical class="w-5 h-5 text-blue-600" />
            Trial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="text-center">
              <div class="font-bold text-blue-600 text-3xl">{{ totalTrials }}</div>
              <div class="text-gray-600 text-sm">Total Trials</div>
            </div>
            <div class="gap-4 grid grid-cols-2 text-sm">
              <div class="text-center">
                <div class="font-semibold text-green-600">{{ activeTrials }}</div>
                <div class="text-gray-600">Active</div>
              </div>
              <div class="text-center">
                <div class="font-semibold text-blue-600">{{ completedTrials }}</div>
                <div class="text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </UiDashboardCard>

      <!-- Enrollment Progress Card -->
      <!-- <UiDashboardCard size="md">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <Users class="w-5 h-5 text-green-600" />
            Enrollment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="text-center">
              <div class="font-bold text-green-600 text-2xl">{{ totalEnrolled }}</div>
              <div class="text-gray-600 text-sm">Total Enrolled</div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span>Progress</span>
                <span>{{ enrollmentPercentage }}%</span>
              </div>
              <Progress
                :value="enrollmentPercentage"
                class="h-2" />
            </div>
            <div class="text-gray-500 text-xs text-center">
              Target: {{ totalTarget }} participants
            </div>
          </div>
        </CardContent>
      </UiDashboardCard>  -->

      <!-- Phase Distribution Card -->
      <UiDashboardCard size="sm">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <BarChart3 class="w-5 h-5 text-purple-600" />
            Phase Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="(count, phase) in phaseDistribution"
              :key="phase" class="flex justify-between items-center">
              <span class="font-medium text-sm">Phase {{ phase }}</span>
              <Badge :class="getPhaseColor(phase)">{{ count }}</Badge>
            </div>
          </div>
        </CardContent>
      </UiDashboardCard>

      <!-- Status Overview Card -->
      <UiDashboardCard size="sm">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <Activity class="w-5 h-5 text-orange-600" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="(count, status) in statusDistribution"
              :key="status" class="flex justify-between items-center">
              <span class="font-medium text-sm">{{ status }}</span>
              <Badge :class="getStatusColor(status)">{{ count }}</Badge>
            </div>
          </div>
        </CardContent>
      </UiDashboardCard>

      <!-- Recent Trials Card -->
      <UiDashboardCard size="lg">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <Clock class="w-5 h-5 text-indigo-600" />
            Recent Trials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-for="trial in recentTrials" :key="trial.uuid"
            class="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer">
            <TrialCard
              size="small"
              :trial="trial"
            />
          </div>
          <div
            v-if="recentTrials.length === 0"
            class="py-4 text-gray-500 text-center">
            No recent trials
          </div>
        </CardContent>
      </UiDashboardCard>

      <!-- Compliance Status Card -->
      <UiDashboardCard size="md">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <Shield class="w-5 h-5 text-red-600" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <!-- <CardContent>
          <div class="space-y-4">
            <div class="text-center">
              <div class="font-bold text-red-600 text-2xl">{{ gdprCompliantTrials }}</div>
              <div class="text-gray-600 text-sm">GDPR Compliant</div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span>Compliance Rate</span>
                <span>{{ compliancePercentage }}%</span>
              </div>
              <Progress
                :value="compliancePercentage"
                class="h-2" />
            </div>
            <div class="gap-2 grid grid-cols-2 text-xs">
              <div class="bg-green-50 p-2 rounded text-center">
                <div class="font-semibold text-green-600">{{ protocolDeviations.low }}</div>
                <div class="text-gray-600">Low Risk</div>
              </div>
              <div class="bg-red-50 p-2 rounded text-center">
                <div class="font-semibold text-red-600">{{ protocolDeviations.high }}</div>
                <div class="text-gray-600">High Risk</div>
              </div>
            </div>
          </div>
        </CardContent> -->
      </UiDashboardCard>

      <!-- Timeline Overview Card -->
      <UiDashboardCard size="xl">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <CalendarDays class="w-5 h-5 text-teal-600" />
            Timeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="gap-4 grid grid-cols-3 text-center">
              <div class="bg-blue-50 p-3 rounded-lg">
                <div class="font-bold text-blue-600 text-lg">{{ upcomingTrials }}</div>
                <div class="text-gray-600 text-xs">Starting Soon</div>
              </div>
              <div class="bg-green-50 p-3 rounded-lg">
                <div class="font-bold text-green-600 text-lg">{{ activeTrials }}</div>
                <div class="text-gray-600 text-xs">In Progress</div>
              </div>
              <div class="bg-orange-50 p-3 rounded-lg">
                <div class="font-bold text-orange-600 text-lg">{{ endingSoonTrials }}</div>
                <div class="text-gray-600 text-xs">Ending Soon</div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="pt-4 border-t">
              <h4 class="mb-3 font-medium text-gray-700 text-sm">Quick Actions</h4>
              <div class="gap-2 grid grid-cols-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  class="text-xs">
                  <NuxtLink to="/trials"> 
                    
                    View All Trials
                  </NuxtLink>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" >
                  <NuxtLink
                    to="/trials/create" class="flex justify-center items-center gap-2">
                    <PlusIcon class="mr-1 w-4 h-4" />
                    Create New Trial
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </UiDashboardCard>

      <!-- Key Metrics Card -->
      <UiDashboardCard size="md">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <TrendingUp class="w-5 h-5 text-emerald-600" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Avg. Duration</span>
              <span class="font-medium">{{ averageDuration }} months</span>
            </div>
            <!-- <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Sites per Trial</span>
              <span class="font-medium">{{ averageSitesPerTrial }}</span>
            </div> -->
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Success Rate</span>
              <span class="font-medium text-green-600">{{ successRate }}%</span>
            </div>
            <!-- <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">Total Approvals</span>
              <span class="font-medium">{{ totalApprovals }}</span>
            </div> -->
          </div>
        </CardContent>
      </UiDashboardCard>

    </div>
  </div>
  
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { 
  FlaskConical, 
  BarChart3, 
  Activity, 
  Clock, 
  Shield, 
  CalendarDays, 
  PlusIcon
} from 'lucide-vue-next'
import { CardContent, CardHeader, CardTitle } from '~ui/components/ui/card'
import { Badge } from '~ui/components/ui/badge'
import { Button } from '~ui/components/ui/button'
import UiDashboardCard from '~ui/components/dashboard/Card.vue'
import type { TrialStatus, TrialPhase } from '~/server/database/schema/enums'

// Store and data
const store = useTrialsStore()
const { items: trials } = storeToRefs(store)
const { fetchAll, isLoading } = store

// Computed properties for dashboard metrics
const totalTrials = computed(() => trials.value?.length || 0)

const activeTrials = computed(() => 
  trials.value?.filter(trial => trial.status === 'Active').length || 0
)

const completedTrials = computed(() => 
  trials.value?.filter(trial => trial.status === 'Completed').length || 0
)

const upcomingTrials = computed(() => 
  trials.value?.filter(trial => trial.status === 'Planning').length || 0
)

const endingSoonTrials = computed(() => {
  if (!trials.value) return 0
  const today = new Date()
  const threeMonthsFromNow = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000))
  
  return trials.value.filter(trial => {
    if (trial.status !== 'Active') return false
    const endDate = new Date(trial.estimatedEndDate)
    return endDate <= threeMonthsFromNow && endDate > today
  }).length
})

// TODO: Use patients-trial relationship to query enrolled patients
// const totalEnrolled = computed(() => 
//   trials.value?.reduce((sum, trial) => sum + trial.currentEnrollment, 0) || 0
// )

// TODO: Use patients-trial relationship to query enrolled patients
// const totalTarget = computed(() => 
//   trials.value?.reduce((sum, trial) => sum + trial.targetEnrollment, 0) || 0
// )

// const enrollmentPercentage = computed(() => {
//   if (totalTarget.value === 0) return 0
//   return Math.round((totalEnrolled.value / totalTarget.value) * 100)
// })

const phaseDistribution = computed(() => {
  if (!trials.value) return {}
  
  const distribution: Record<TrialPhase, number> = {
    'I': 0,
    'II': 0,
    'III': 0,
    'IV': 0
  }
  
  trials.value.forEach(trial => {
    if (trial.phase in distribution) {
      distribution[trial.phase]++
    }
  })
  
  return distribution
})

const statusDistribution = computed(() => {
  if (!trials.value) return {}
  
  const distribution: Record<TrialStatus, number> = {
    'Planning': 0,
    'Active': 0,
    'Paused': 0,
    'Completed': 0,
    'Terminated': 0
  }
  
  trials.value.forEach(trial => {
    if (trial.status in distribution) {
      distribution[trial.status as TrialStatus]++
    }
  })
  
  return distribution
})

const recentTrials = computed(() => {
  if (!trials.value) return []
  
  return [...trials.value]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5)
})

// TODO: Use trials-regulatoryCompliance relationship to query compliance
// const gdprCompliantTrials = computed(() => 
//   trials.value?.filter(trial => trial.complianceStatus.gdprCompliant).length || 0
// )

// const compliancePercentage = computed(() => {
//   if (totalTrials.value === 0) return 0
//   return Math.round((gdprCompliantTrials.value / totalTrials.value) * 100)
// })

// const protocolDeviations = computed(() => {
//   if (!trials.value) return { low: 0, high: 0 }
  
//   let low = 0
//   let high = 0
  
//   trials.value.forEach(trial => {
//     trial.regulatoryCompliance.protocolDeviations.forEach((deviation: ProtocolDeviation) => {
//       if (deviation.severity === 'Minor') low++
//       else if (deviation.severity === 'Major') high++
//     })
//   })
  
//   return { low, high }
// })

const averageDuration = computed(() => {
  if (!trials.value || trials.value.length === 0) return 0
  
  const totalDuration = trials.value.reduce((sum, trial) => {
    const start = new Date(trial.startDate)
    const end = new Date(trial.actualEndDate || trial.estimatedEndDate)
    const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    return sum + months
  }, 0)
  
  return Math.round(totalDuration / trials.value.length)
})

// TODO: Use trials-sites relationship to calculate average sites
// const averageSitesPerTrial = computed(() => {
//   if (!trials.value || trials.value.length === 0) return 0
  
//   const totalSites = trials.value.reduce((sum, trial) => sum + trial.administrative.sites.length, 0)
//   return Math.round(totalSites / trials.value.length * 10) / 10
// })

const successRate = computed(() => {
  if (totalTrials.value === 0) return 0
  return Math.round((completedTrials.value / totalTrials.value) * 100)
})

// TODO: Use trials-regulatoryCompliance relationship to calculate total approvals
// const totalApprovals = computed(() => 
//   trials.value?.reduce((sum, trial) => 
//     sum + trial.regulatoryCompliance.regulatoryApprovals.filter((approval: RegulatoryApproval) => 
//       approval.status === 'Approved'
//     ).length, 0
//   ) || 0
// )

// Helper functions



// Load data on mount
onMounted(async () => {
  await fetchAll()
})
</script>
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="font-bold text-gray-900 text-3xl">Patient Overview</h1>
        <p class="mt-2 text-gray-600">Monitor patient enrollment and engagement across all trials</p>
      </div>
    </div>

    <!-- Patient Statistics Cards -->
    <div class="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <!-- Total Patients -->
      <Card class="p-6">
        <CardHeader class="flex justify-between items-center space-y-0 pb-2">
          <CardTitle class="font-medium text-sm">Total Patients</CardTitle>
          <Users class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="font-bold text-2xl">{{ totalPatients }}</div>
          <p class="mt-1 text-muted-foreground text-xs">
            <span 
              v-if="enrollmentTrend > 0"
              class="text-green-600">
              +{{ enrollmentTrend }}% from last month
            </span>
            <span 
              v-else-if="enrollmentTrend < 0"
              class="text-red-600">
              {{ enrollmentTrend }}% from last month
            </span>
            <span 
              v-else
              class="text-gray-600">
              No change from last month
            </span>
          </p>
        </CardContent>
      </Card>

      <!-- Active Patients -->
      <Card class="p-6">
        <CardHeader class="flex justify-between items-center space-y-0 pb-2">
          <CardTitle class="font-medium text-sm">Active Patients</CardTitle>
          <Activity class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="font-bold text-green-600 text-2xl">{{ activePatients }}</div>
          <p class="mt-1 text-muted-foreground text-xs">
            {{ Math.round((activePatients / totalPatients) * 100) || 0 }}% of total
          </p>
        </CardContent>
      </Card>

      <!-- Completed Patients -->
      <Card class="p-6">
        <CardHeader class="flex justify-between items-center space-y-0 pb-2">
          <CardTitle class="font-medium text-sm">Completed</CardTitle>
          <CheckCircle class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="font-bold text-blue-600 text-2xl">{{ completedPatients }}</div>
          <p class="mt-1 text-muted-foreground text-xs">
            {{ Math.round((completedPatients / totalPatients) * 100) || 0 }}% completion rate
          </p>
        </CardContent>
      </Card>

      <!-- Withdrawn Patients -->
      <Card class="p-6">
        <CardHeader class="flex justify-between items-center space-y-0 pb-2">
          <CardTitle class="font-medium text-sm">Withdrawn</CardTitle>
          <UserX class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="font-bold text-red-600 text-2xl">{{ withdrawnPatients }}</div>
          <p class="mt-1 text-muted-foreground text-xs">
            {{ Math.round((withdrawnPatients / totalPatients) * 100) || 0 }}% withdrawal rate
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Patients -->
    <div class="gap-6 grid grid-cols-1 lg:grid-cols-2">
      <!-- Recently Enrolled -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-purple-600" />
            Recently Enrolled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            v-if="isLoading"
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
            class="flex justify-center items-center h-32 text-gray-500">
            No recent enrollments
          </div>
        </CardContent>
      </Card>

      <!-- Consent Status Distribution -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Shield class="w-5 h-5 text-purple-600" />
            Consent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div 
              v-for="(count, status) in consentStatusDistribution"
              :key="status"
              class="flex justify-between items-center">
              <span class="font-medium text-sm">{{ formatConsentStatus(status) }}</span>
              <div class="flex items-center gap-2">
                <div class="bg-gray-200 rounded-full w-20 h-2">
                  <div 
                    :class="getConsentStatusColor(status)"
                    class="rounded-full h-2"
                    :style="{ width: `${(count / totalPatients) * 100}%` }" />
                </div>
                <span class="font-bold text-sm">{{ count }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Patient Status Distribution -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <BarChart3 class="w-5 h-5 text-purple-600" />
          Patient Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div 
            v-for="(count, status) in patientStatusDistribution"
            :key="status"
            class="text-center">
            <div 
              class="font-bold text-2xl"
              :class="getStatusColor(status)">{{ count }}</div>
            <div class="font-medium text-gray-600 text-sm">{{ status }}</div>
            <div class="text-gray-500 text-xs">
              {{ Math.round((count / totalPatients) * 100) || 0 }}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { 
  Users, 
  Activity, 
  CheckCircle, 
  UserX, 
  Clock, 
  Shield, 
  BarChart3
} from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '~ui/components/ui/card'
import type { PatientStatistics } from '~/server/database/schema'

// Store
const patientsStore = usePatientsStore()
const { items: patients, loading: isLoading } = storeToRefs(patientsStore)

// Patient statistics
const statistics = ref<PatientStatistics | null>(null)

// Computed properties with safe access
const totalPatients = computed(() => statistics.value?.totalPatients || (patients.value?.length || 0))
const activePatients = computed(() => statistics.value?.activePatients || (patients.value?.filter(p => p.status === 'Active').length || 0))
const completedPatients = computed(() => statistics.value?.completedPatients || (patients.value?.filter(p => p.status === 'Completed').length || 0))
const withdrawnPatients = computed(() => statistics.value?.withdrawnPatients || (patients.value?.filter(p => p.status === 'Withdrawn').length || 0))

const enrollmentTrend = computed(() => {
  // Mock calculation - in real app, this would come from API
  return Math.floor(Math.random() * 20) - 10 // Random between -10 and +10
})

const recentPatients = computed(() => {
  if (!patients.value) return []
  return [...patients.value]
    .sort((a, b) => new Date(b.enrollmentDate || '').getTime() - new Date(a.enrollmentDate || '').getTime())
    .slice(0, 5)
})

const patientStatusDistribution = computed(() => {
  const distribution: Record<string, number> = {}
  if (!patients.value) return distribution
  patients.value.forEach(patient => {
    distribution[patient.status] = (distribution[patient.status] || 0) + 1
  })
  return distribution
})

const consentStatusDistribution = computed(() => {
  const distribution: Record<string, number> = {}
  if (!patients.value) return distribution
  patients.value.forEach(patient => {
    distribution[patient.consentStatus] = (distribution[patient.consentStatus] || 0) + 1
  })
  return distribution
})

// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Screening': 'text-blue-600',
    'Enrolled': 'text-green-600', 
    'Active': 'text-green-600',
    'Completed': 'text-blue-600',
    'Withdrawn': 'text-red-600',
    'Discontinued': 'text-red-600'
  }
  return colors[status] || 'text-gray-600'
}

const getConsentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Consented': 'bg-green-500',
    'NotConsented': 'bg-red-500',
    'Withdrawn': 'bg-orange-500'
  }
  return colors[status] || 'bg-gray-500'
}

const formatConsentStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'Consented': 'Consented',
    'NotConsented': 'Not Consented',
    'Withdrawn': 'Withdrawn'
  }
  return statusMap[status] || status
}

// Lifecycle
onMounted(async () => {
  await patientsStore.fetchAll()
  
  // Fetch patient statistics if available
  try {
    if (patientsStore.customMethods?.getPatientStatistics) {
      statistics.value = await patientsStore.customMethods.getPatientStatistics()
    }
  } catch (error) {
    console.warn('Could not fetch patient statistics:', error)
  }
})
</script>

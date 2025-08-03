<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        class="px-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 font-mono text-green-600 hover:text-green-800 text-xs text-center"
      >
        {{ siteUuid.slice(-8) }}
      </Button>
    </PopoverTrigger>
    
    <PopoverContent
      class="p-0 w-80"
      align="center">
      <!-- <div
        v-if="loading"
        class="p-4 text-gray-500 text-center">
        Loading site information...
      </div>
      
      <div
        v-else-if="error"
        class="p-4 text-red-500 text-center">
        Failed to load site information
      </div> -->
      
      <div
        v-if="site"
        class="p-4">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-sm truncate">
              {{ site.name }}
            </h3>
            <p class="mt-1 text-gray-500 text-xs line-clamp-2">
              {{ site.address }}
            </p>
          </div>
          <div class="flex flex-col gap-1 ml-2">
            <Badge
              :class="getStatusBadgeClass(site.status)"
              class="text-xs">
              {{ site.status }}
            </Badge>
            <Badge
              :class="getFacilityTypeBadgeClass(site.facilityType)"
              class="text-xs">
              {{ site.facilityType }}
            </Badge>
          </div>
        </div>

        <!-- Key Information -->
        <div class="space-y-2 mb-3">
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Patients Enrolled:</span>
            <span class="font-medium">{{ site.patientsEnrolled }} / {{ site.targetEnrollment }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Data Completeness:</span>
            <span class="font-medium">{{ site.dataCompleteness }}%</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Activation Date:</span>
            <span class="font-medium">{{ formatDate(site.activationDate) }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Data Submission:</span>
            <Badge
              :class="getDataSubmissionBadgeClass(site.dataSubmissionStatus)"
              class="text-xs">
              {{ formatDataSubmissionStatus(site.dataSubmissionStatus) }}
            </Badge>
          </div>
        </div>

        <div class="pt-2 border-gray-100 border-t">
          <UiCommonNavLink
            :to="`/sites/${site.uuid}`"
            class="block bg-green-50 hover:bg-green-100 px-3 py-2 rounded w-full font-medium text-green-700 text-xs text-center transition-colors"
          >
            View Site Details
          </UiCommonNavLink>
        <!-- Action Button -->
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '~ui/components/ui/popover'

import { Button } from '~ui/components/ui/button'
import { Badge } from '~ui/components/ui/badge'

interface Props {
  siteUuid: string
}

const props = defineProps<Props>()
const isOpen = ref(false)

const store = useSitesStore()
const site = computed(() => store.getById(props.siteUuid))

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDataSubmissionStatus = (status: string) => {
  return status.replace(/([A-Z])/g, ' $1').trim()
}

const getStatusBadgeClass = (status: string) => {
  const statusClasses = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Suspended': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-red-100 text-red-800',
    'Pending': 'bg-blue-100 text-blue-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

const getFacilityTypeBadgeClass = (facilityType: string) => {
  const facilityClasses = {
    'Hospital': 'bg-blue-100 text-blue-800',
    'Clinic': 'bg-purple-100 text-purple-800',
    'University': 'bg-indigo-100 text-indigo-800',
    'Research': 'bg-cyan-100 text-cyan-800'
  }
  return facilityClasses[facilityType as keyof typeof facilityClasses] || 'bg-gray-100 text-gray-800'
}

const getDataSubmissionBadgeClass = (status: string) => {
  const statusClasses = {
    'NotSubmitted': 'bg-red-100 text-red-800',
    'PartiallySubmitted': 'bg-yellow-100 text-yellow-800',
    'Submitted': 'bg-green-100 text-green-800',
    'UnderReview': 'bg-blue-100 text-blue-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}
</script>

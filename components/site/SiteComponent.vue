<template>
  <Card
    v-if="site"
    class="p-6">
    <CardHeader>
      <div class="flex justify-between items-start">
        <div>
          <CardTitle class="font-bold text-2xl">
            {{ site.name }}
          </CardTitle>
          <CardDescription class="mt-1 text-gray-600 text-sm">
            Site ID: {{ site.id }}
          </CardDescription>
          <CardDescription class="text-gray-600 text-sm">
            Trial: {{ site.trialId }}
          </CardDescription>
        </div>
        <div class="flex gap-2">
          <Badge 
            :class="getStatusBadgeClass(site.status)"
            class="px-3 py-1 text-sm">
            {{ site.status }}
          </Badge>
          <Badge 
            :class="getDataSubmissionBadgeClass(site.dataSubmissionStatus)"
            class="px-3 py-1 text-sm">
            {{ formatDataSubmissionStatus(site.dataSubmissionStatus) }}
          </Badge>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          @click="navigateTo(`/sites/${site.id}/edit`)">
          Edit Site
        </Button>
        <Button
          variant="destructive"
          size="sm"
          @click="deleteSite">
          Delete Site
        </Button>
      </div>
    </CardHeader>
    
    <CardContent class="space-y-6">
      <!-- Basic Information Section -->
      <section>
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Basic Information
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Site Name</Label>
            <p class="mt-1 text-sm">
              {{ site.name }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Address</Label>
            <p class="mt-1 text-sm">
              {{ site.address }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Status</Label>
            <Badge 
              :class="getStatusBadgeClass(site.status)" 
              class="mt-1">
              {{ site.status }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Facility Type</Label>
            <p class="mt-1 text-sm">
              {{ formatFacilityType(site.facilityType) }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Activation Date</Label>
            <p class="mt-1 text-sm">
              {{ formatDate(site.activationDate) }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Data Submission Status</Label>
            <Badge 
              :class="getDataSubmissionBadgeClass(site.dataSubmissionStatus)" 
              class="mt-1">
              {{ formatDataSubmissionStatus(site.dataSubmissionStatus) }}
            </Badge>
          </div>
        </div>
      </section>

      <!-- Enrollment & Performance Section -->
      <section>
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Enrollment & Performance
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Patients Enrolled</Label>
            <p class="mt-1 font-semibold text-sm">
              {{ site.patientsEnrolled }} / {{ site.targetEnrollment }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Enrollment Progress</Label>
            <div class="flex items-center gap-2 mt-1">
              <div class="bg-gray-200 rounded-full w-full h-2">
                <div 
                  class="bg-green-600 rounded-full h-2" 
                  :style="{ width: `${getEnrollmentProgress()}%` }" />
              </div>
              <span class="font-medium text-sm">{{ getEnrollmentProgress() }}%</span>
            </div>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Data Completeness</Label>
            <div class="flex items-center gap-2 mt-1">
              <div class="bg-gray-200 rounded-full w-full h-2">
                <div 
                  class="bg-blue-600 rounded-full h-2" 
                  :style="{ width: `${site.dataCompleteness}%` }" />
              </div>
              <span class="font-medium text-sm">{{ site.dataCompleteness }}%</span>
            </div>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Protocol Deviations</Label>
            <p
              class="mt-1 text-sm"
              :class="site.protocolDeviations > 0 ? 'text-orange-600' : 'text-green-600'">
              {{ site.protocolDeviations }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Adverse Events Reported</Label>
            <p
              class="mt-1 text-sm"
              :class="site.adverseEventsReported > 0 ? 'text-red-600' : 'text-green-600'">
              {{ site.adverseEventsReported }}
            </p>
          </div>
        </div>
      </section>

      <!-- Staff Information Section -->
      <section>
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Staff Information
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div class="p-4 border rounded-lg">
            <Label class="font-medium text-gray-600 text-sm">Principal Investigator</Label>
            <div class="space-y-1 mt-2">
              <p class="font-medium text-sm">{{ site.principalInvestigator.name }}</p>
              <p class="text-gray-600 text-sm">{{ site.principalInvestigator.email }}</p>
              <p class="text-gray-600 text-sm">{{ site.principalInvestigator.institution }}</p>
              <Badge
                variant="outline"
                class="text-xs">
                {{ formatUserRole(site.principalInvestigator.role) }}
              </Badge>
            </div>
          </div>
          <div class="p-4 border rounded-lg">
            <Label class="font-medium text-gray-600 text-sm">Contact Person</Label>
            <div class="space-y-1 mt-2">
              <p class="font-medium text-sm">{{ site.contactPerson.name }}</p>
              <p class="text-gray-600 text-sm">{{ site.contactPerson.email }}</p>
              <p class="text-gray-600 text-sm">{{ site.contactPerson.institution }}</p>
              <Badge
                variant="outline"
                class="text-xs">
                {{ formatUserRole(site.contactPerson.role) }}
              </Badge>
            </div>
          </div>
          <div
            v-if="site.studyCoordinator"
            class="p-4 border rounded-lg">
            <Label class="font-medium text-gray-600 text-sm">Study Coordinator</Label>
            <div class="space-y-1 mt-2">
              <p class="font-medium text-sm">{{ site.studyCoordinator.name }}</p>
              <p class="text-gray-600 text-sm">{{ site.studyCoordinator.email }}</p>
              <p class="text-gray-600 text-sm">{{ site.studyCoordinator.institution }}</p>
              <Badge
                variant="outline"
                class="text-xs">
                {{ formatUserRole(site.studyCoordinator.role) }}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <!-- Monitoring & Visits Section -->
      <section>
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Monitoring & Visits
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Last Monitoring Visit</Label>
            <p class="mt-1 text-sm">
              {{ site.lastMonitoringVisit ? formatDate(site.lastMonitoringVisit) : 'No visits recorded' }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Next Scheduled Visit</Label>
            <p class="mt-1 text-sm">
              {{ site.nextScheduledVisit ? formatDate(site.nextScheduledVisit) : 'Not scheduled' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Certifications Section -->
      <section v-if="site.certifications && site.certifications.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Certifications & Accreditations
        </h3>
        <div class="flex flex-wrap gap-2">
          <Badge 
            v-for="certification in site.certifications" 
            :key="certification"
            variant="outline"
            class="text-xs">
            {{ certification }}
          </Badge>
        </div>
      </section>

      <!-- Documents Section -->
      <section v-if="site.documents && site.documents.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Site Documents ({{ site.documents.length }})
        </h3>
        <div class="space-y-3">
          <div 
            v-for="document in site.documents" 
            :key="document.id"
            class="p-4 border rounded-lg">
            <div class="gap-4 grid grid-cols-1 md:grid-cols-4">
              <div>
                <Label class="font-medium text-gray-600 text-sm">Title</Label>
                <p class="mt-1 font-medium text-sm">
                  {{ document.title }}
                </p>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Type</Label>
                <Badge
                  variant="outline"
                  class="mt-1">
                  {{ formatDocumentType(document.documentType) }}
                </Badge>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Upload Date</Label>
                <p class="mt-1 text-sm">
                  {{ formatDate(document.uploadDate) }}
                </p>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Uploaded By</Label>
                <p class="mt-1 text-sm">
                  {{ document.uploadedBy.name }}
                </p>
              </div>
            </div>
            <div
              v-if="document.description"
              class="mt-3">
              <Label class="font-medium text-gray-600 text-sm">Description</Label>
              <p class="mt-1 text-sm">
                {{ document.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty States -->
      <section v-if="!site.certifications || site.certifications.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Certifications & Accreditations
        </h3>
        <div class="py-4 text-gray-500 text-center">
          <p>No certifications recorded for this site</p>
        </div>
      </section>

      <section v-if="!site.documents || site.documents.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Site Documents
        </h3>
        <div class="py-4 text-gray-500 text-center">
          <p>No documents uploaded for this site</p>
        </div>
      </section>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Site } from '~/models/admin'
import { Badge } from '~ui/components/ui/badge'
import { Button } from '~ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~ui/components/ui/card'
import { Label } from '~ui/components/ui/label'

const { site } = defineProps<{site: Site | undefined}>()

const { remove } = useSitesStore()

const deleteSite = async () => {
  if (!site) return
  
  console.log('Deleting site:', site.id)
  await remove(site.id)
  console.log('Site deleted:', site.id)

  // Navigate back to sites list
  await navigateTo('/sites', {
    replace: true
  })
}

// Helper functions for badge styling
const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-red-100 text-red-800',
    'Closed': 'bg-gray-100 text-gray-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getDataSubmissionBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'onTime': 'bg-green-100 text-green-800',
    'delayed': 'bg-yellow-100 text-yellow-800',
    'notSubmitted': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Helper functions for formatting
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not specified'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

const formatDataSubmissionStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'onTime': 'On Time',
    'delayed': 'Delayed',
    'notSubmitted': 'Not Submitted'
  }
  return statusMap[status] || status
}

const formatFacilityType = (type: string) => {
  const typeMap: Record<string, string> = {
    'hospital': 'Hospital',
    'clinic': 'Clinic',
    'university': 'University',
    'research_center': 'Research Center'
  }
  return typeMap[type] || type
}

const formatUserRole = (role: string) => {
  return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDocumentType = (type: string) => {
  const typeMap: Record<string, string> = {
    'protocol': 'Protocol',
    'informedConsent': 'Informed Consent',
    'regulatoryApproval': 'Regulatory Approval',
    'other': 'Other'
  }
  return typeMap[type] || type
}

const getEnrollmentProgress = () => {
  if (!site || site.targetEnrollment === 0) return 0
  return Math.min(100, Math.round((site.patientsEnrolled / site.targetEnrollment) * 100))
}
</script>
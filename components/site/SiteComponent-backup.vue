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
            Site ID: {{ site.uuid }}
          </CardDescription>
          <CardDescription class="text-gray-600 text-sm">
            Trial: {{ site.trialUuid }}
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
                  :style="{ width: `${parseFloat(site.dataCompleteness)}%` }" />
              </div>
              <span class="font-medium text-sm">{{ parseFloat(site.dataCompleteness).toFixed(1) }}%</span>
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
              <p class="font-medium text-sm">{{ principalInvestigator?.name || 'Not assigned' }}</p>
              <p class="text-gray-600 text-sm">{{ principalInvestigator?.email || 'No email' }}</p>
              <p class="text-gray-600 text-sm">{{ principalInvestigator?.institution || 'No institution' }}</p>
              <Badge
                v-if="principalInvestigator?.role"
                variant="outline"
                class="text-xs">
                {{ formatUserRole(principalInvestigator.role) }}
              </Badge>
            </div>
          </div>
          <div class="p-4 border rounded-lg">
            <Label class="font-medium text-gray-600 text-sm">Contact Person</Label>
            <div class="space-y-1 mt-2">
              <p class="font-medium text-sm">{{ contactPerson?.name || 'Not assigned' }}</p>
              <p class="text-gray-600 text-sm">{{ contactPerson?.email || 'No email' }}</p>
              <p class="text-gray-600 text-sm">{{ contactPerson?.institution || 'No institution' }}</p>
              <Badge
                v-if="contactPerson?.role"
                variant="outline"
                class="text-xs">
                {{ formatUserRole(contactPerson.role) }}
              </Badge>
            </div>
          </div>
          <div
            v-if="studyCoordinator"
            class="p-4 border rounded-lg">
            <Label class="font-medium text-gray-600 text-sm">Study Coordinator</Label>
            <div class="space-y-1 mt-2">
              <p class="font-medium text-sm">{{ studyCoordinator.name }}</p>
              <p class="text-gray-600 text-sm">{{ studyCoordinator.email }}</p>
              <p class="text-gray-600 text-sm">{{ studyCoordinator.institution }}</p>
              <Badge
                variant="outline"
                class="text-xs">
                {{ formatUserRole(studyCoordinator.role) }}
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
      <section v-if="certifications && certifications.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Certifications & Accreditations
        </h3>
        <div class="space-y-3">
          <div 
            v-for="certification in certifications" 
            :key="certification.uuid"
            class="p-4 border rounded-lg">
            <div class="gap-4 grid grid-cols-1 md:grid-cols-3">
              <div>
                <Label class="font-medium text-gray-600 text-sm">Certification Name</Label>
                <p class="mt-1 font-medium text-sm">
                  {{ certification.certificationName }}
                </p>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Issued Date</Label>
                <p class="mt-1 text-sm">
                  {{ formatDate(certification.issuedDate) }}
                </p>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Expiry Date</Label>
                <p class="mt-1 text-sm">
                  {{ formatDate(certification.expiryDate) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Documents Section -->
      <section v-if="documents && documents.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Site Documents ({{ documents.length }})
        </h3>
        <div class="space-y-3">
          <div 
            v-for="document in documents" 
            :key="document.uuid"
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
                  {{ uploadedByUser(document.uploadedBy)?.name || 'Unknown' }}
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
            <div class="mt-3">
              <Button
                variant="outline"
                size="sm"
                @click="viewDocument(document.url)">
                View Document
              </Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty States -->
      <section v-if="!certifications || certifications.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Certifications & Accreditations
        </h3>
        <div class="py-4 text-gray-500 text-center">
          <p>No certifications recorded for this site</p>
        </div>
      </section>

      <section v-if="!documents || documents.length === 0">
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
import type { SiteCertification, User, Document } from '~/server/database/schema'
import { Badge } from '~ui/components/ui/badge'
import { Button } from '~ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~ui/components/ui/card'
import { Label } from '~ui/components/ui/label'

interface Props {
  siteId: string
}

const { 
  siteId
} = defineProps<Props>()

const siteStore = useSitesStore()



const site = computed(() => {
  return siteStore.getById(siteId)
})

const userStore = useUsersStore()
const principalInvestigator = computed(() => {
  return userStore.getById(site.value?.principalInvestigatorUuid || '')
})
const contactPerson = computed(() => {
  return userStore.getById(site.value?.contactPersonUuid || '')
})
const studyCoordinator = computed(() => {
  return userStore.getById(site.value?.studyCoordinatorUuid || '')
})

// Reactive data for certifications and documents
const certifications = ref<SiteCertification[]>([])
const documents = ref<Document[]>([])
const users = ref<User[]>([])

// Helper function to get user by ID
const uploadedByUser = (userId: string) => {
  return users.value.find(user => user.uuid === userId)
}




onMounted(async () => {
  await siteStore.fetchById(siteId)
  if(site.value?.principalInvestigatorUuid){
    await userStore.fetchById(site.value?.principalInvestigatorUuid)
  }
  if(site.value?.contactPersonUuid){
    await userStore.fetchById(site.value?.contactPersonUuid)
  }
  if(site.value?.studyCoordinatorUuid){
    await userStore.fetchById(site.value?.studyCoordinatorUuid)
  } 
  console.log("Fetching additional data...")
  certifications.value = await siteStore.customMethods.getSiteCertifications(siteId)
  documents.value = await siteStore.customMethods.getSiteDocuments(siteId)
  
  // Fetch site certifications and documents
  try {
    
    // const uploaderIds = [...new Set(siteDocuments.data.map((doc: Document) => doc.uploadedBy))]
    // const fetchedUsers = await Promise.all(
    //   uploaderIds.map((userId: string) => userStore.fetchById(userId))
    // )
    // users.value = fetchedUsers.filter(Boolean) as User[]
  
  } catch (error) {
    console.error('Error fetching site certifications and documents:', error)
  }
})


const deleteSite = async () => {
  if (!site.value) return
  
  console.log('Deleting site:', site.value.uuid)
  await siteStore.remove(site.value.uuid)
  console.log('Site deleted:', site.value.uuid)

  // Navigate back to sites list
  await navigateTo('/sites', {
    replace: true
  })
}

// Helper function to view document
const viewDocument = (url: string) => {
  window.open(url, '_blank')
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
    'OnTime': 'bg-green-100 text-green-800',
    'Delayed': 'bg-yellow-100 text-yellow-800',
    'NotSubmitted': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Helper functions for formatting
const formatDate = (dateString: string | undefined | null) => {
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
    'OnTime': 'On Time',
    'Delayed': 'Delayed',
    'NotSubmitted': 'Not Submitted'
  }
  return statusMap[status] || status
}

const formatFacilityType = (type: string) => {
  const typeMap: Record<string, string> = {
    'Hospital': 'Hospital',
    'Clinic': 'Clinic',
    'University': 'University',
    'ResearchCenter': 'Research Center'
  }
  return typeMap[type] || type
}

const formatUserRole = (role: string) => {
  return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDocumentType = (type: string) => {
  const typeMap: Record<string, string> = {
    'Protocol': 'Protocol',
    'InformedConsent': 'Informed Consent',
    'RegulatoryApproval': 'Regulatory Approval',
    'Other': 'Other'
  }
  return typeMap[type] || type
}

const getEnrollmentProgress = () => {
  if (!site.value || site.value.targetEnrollment === 0) return 0
  return Math.min(100, Math.round((site.value.patientsEnrolled / site.value.targetEnrollment) * 100))
}
</script>
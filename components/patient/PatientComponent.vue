<template>
  <Card
    v-if="patient"
    class="p-6">
    <CardHeader>
      <div class="flex justify-between items-start">
        <div>
          <CardTitle class="font-bold text-2xl">
            Patient {{ patient.subjectId }}
          </CardTitle>
          <CardDescription class="mt-1 text-gray-600 text-sm">
            Enrolled in trial: {{ patient.trialId }}
          </CardDescription>
        </div>
        <div class="flex gap-2">
          <Badge 
            :class="getStatusBadgeClass(patient.status)"
            class="px-3 py-1 text-sm">
            {{ patient.status }}
          </Badge>
          <Badge 
            :class="getConsentBadgeClass(patient.consentStatus)"
            class="px-3 py-1 text-sm">
            {{ formatConsentStatus(patient.consentStatus) }}
          </Badge>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          @click="navigateTo(`/patients/${patient.id}/edit`)">
          Edit Patient
        </Button>
        <Button
          variant="destructive"
          size="sm"
          @click="deletePatient">
          Delete Patient
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
            <Label class="font-medium text-gray-600 text-sm">Patient ID</Label>
            <p class="mt-1 text-sm">
              {{ patient.id }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Subject ID</Label>
            <p class="mt-1 text-sm">
              {{ patient.subjectId }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Trial ID</Label>
            <p class="mt-1 text-sm">
              {{ patient.trialId }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Status</Label>
            <Badge 
              :class="getStatusBadgeClass(patient.status)" 
              class="mt-1">
              {{ patient.status }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Enrollment Date</Label>
            <p class="mt-1 text-sm">
              {{ formatDate(patient.enrollmentDate) }}
            </p>
          </div>
          <div v-if="patient.randomizationGroup">
            <Label class="font-medium text-gray-600 text-sm">Randomization Group</Label>
            <p class="mt-1 text-sm">
              {{ patient.randomizationGroup }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Data Completeness</Label>
            <div class="flex items-center gap-2 mt-1">
              <div class="bg-gray-200 rounded-full w-full h-2">
                <div 
                  class="bg-blue-600 rounded-full h-2" 
                  :style="{ width: `${patient.dataCompleteness}%` }" />
              </div>
              <span class="font-medium text-sm">{{ patient.dataCompleteness }}%</span>
            </div>
          </div>
          <div v-if="patient.withdrawalDate">
            <Label class="font-medium text-gray-600 text-sm">Withdrawal Date</Label>
            <p class="mt-1 text-red-600 text-sm">
              {{ formatDate(patient.withdrawalDate) }}
            </p>
          </div>
        </div>
      </section>

      <!-- GDPR Consent Section -->
      <section v-if="patient.gdprConsent">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          GDPR Consent Information
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Consent Status</Label>
            <Badge 
              :class="getConsentBadgeClass(patient.consentStatus)" 
              class="mt-1">
              {{ formatConsentStatus(patient.consentStatus) }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Consent Given</Label>
            <p class="mt-1 text-sm">
              {{ patient.gdprConsent.consentGiven ? 'Yes' : 'No' }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Consent Date</Label>
            <p class="mt-1 text-sm">
              {{ formatDate(patient.gdprConsent.consentDate) }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Legal Basis</Label>
            <p class="mt-1 text-sm">
              {{ patient.gdprConsent.legalBasis }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Consent Type</Label>
            <p class="mt-1 text-sm">
              {{ formatConsentType(patient.gdprConsent.consentType) }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Retention Period</Label>
            <p class="mt-1 text-sm">
              {{ patient.gdprConsent.retentionPeriod }} years
            </p>
          </div>
          <div v-if="patient.gdprConsent.withdrawalDate">
            <Label class="font-medium text-gray-600 text-sm">Withdrawal Date</Label>
            <p class="mt-1 text-red-600 text-sm">
              {{ formatDate(patient.gdprConsent.withdrawalDate) }}
            </p>
          </div>
          <div v-if="patient.gdprConsent.withdrawalMethod">
            <Label class="font-medium text-gray-600 text-sm">Withdrawal Method</Label>
            <p class="mt-1 text-sm">
              {{ formatWithdrawalMethod(patient.gdprConsent.withdrawalMethod) }}
            </p>
          </div>
        </div>
        <div 
          v-if="patient.gdprConsent.dataCategories && patient.gdprConsent.dataCategories.length > 0" 
          class="mt-4">
          <Label class="font-medium text-gray-600 text-sm">Data Categories</Label>
          <div 
            class="flex flex-wrap gap-2 mt-2">
            <Badge 
              v-for="category in patient.gdprConsent.dataCategories" 
              :key="category"
              variant="outline"
              class="text-xs">
              {{ formatDataCategory(category) }}
            </Badge>
          </div>
        </div>
      </section>

      <!-- Visits Section -->
      <section v-if="patient.visits && patient.visits.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Patient Visits ({{ patient.visits.length }})
        </h3>
        <div class="space-y-3">
          <div 
            v-for="visit in patient.visits" 
            :key="visit.id"
            class="bg-gray-50 p-4 border rounded-lg">
            <div class="gap-4 grid grid-cols-1 md:grid-cols-4">
              <div>
                <Label class="font-medium text-gray-600 text-sm">Visit Date</Label>
                <p class="mt-1 text-sm">
                  {{ formatDate(visit.visitDate) }}
                </p>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Visit Type</Label>
                <Badge 
                  variant="outline" 
                  class="mt-1">
                  {{ formatVisitType(visit.visitType) }}
                </Badge>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Site ID</Label>
                <p class="mt-1 text-sm">
                  {{ visit.siteId }}
                </p>
              </div>
              <div v-if="visit.notes">
                <Label class="font-medium text-gray-600 text-sm">Notes</Label>
                <p class="mt-1 text-sm">
                  {{ visit.notes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Adverse Events Section -->
      <section v-if="patient.adverseEvents && patient.adverseEvents.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Adverse Events ({{ patient.adverseEvents.length }})
        </h3>
        <div class="space-y-3">
          <div 
            v-for="event in patient.adverseEvents" 
            :key="event.id"
            class="p-4 border rounded-lg"
            :class="getAdverseEventBorderClass(event.severity)">
            <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label class="font-medium text-gray-600 text-sm">Event Date</Label>
                <p class="mt-1 text-sm">
                  {{ formatDate(event.eventDate) }}
                </p>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Severity</Label>
                <Badge 
                  :class="getSeverityBadgeClass(event.severity)" 
                  class="mt-1">
                  {{ event.severity }}
                </Badge>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Outcome</Label>
                <Badge 
                  :class="getOutcomeBadgeClass(event.outcome)" 
                  class="mt-1">
                  {{ event.outcome }}
                </Badge>
              </div>
              <div>
                <Label class="font-medium text-gray-600 text-sm">Related to Trial</Label>
                <p class="mt-1 text-sm">
                  {{ event.relatedToTrial ? 'Yes' : 'No' }}
                </p>
              </div>
            </div>
            <div class="mt-3">
              <Label class="font-medium text-gray-600 text-sm">Description</Label>
              <p class="mt-1 text-sm">
                {{ event.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty States -->
      <section v-if="!patient.visits || patient.visits.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Patient Visits
        </h3>
        <div class="py-8 text-gray-500 text-center">
          <p>No visits recorded for this patient</p>
        </div>
      </section>

      <section v-if="!patient.adverseEvents || patient.adverseEvents.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Adverse Events
        </h3>
        <div class="py-8 text-gray-500 text-center">
          <p>No adverse events reported for this patient</p>
        </div>
      </section>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Patient } from '~/models/patients'
import type { PatientStatus, ConsentStatus, AESeverity, AEOutcome } from '~/server/database/schema/enums'
import { Badge } from '~ui/components/ui/badge'
import { Button } from '~ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~ui/components/ui/card'
import { Label } from '~ui/components/ui/label'

const { patient } = defineProps<{patient: Patient | undefined}>()

const { remove } = usePatientsStore()

const deletePatient = async () => {
  if (!patient) return
  
  console.log('Deleting patient:', patient.id)
  await remove(patient.id)
  console.log('Patient deleted:', patient.id)

  // Navigate back to patients list
  await navigateTo('/patients', {
    replace: true
  })
}

// Helper functions for badge styling
const getStatusBadgeClass = (status: PatientStatus) => {
  const classes: Record<PatientStatus, string> = {
    'Screening': 'bg-blue-100 text-blue-800',
    'Enrolled': 'bg-green-100 text-green-800',
    'Active': 'bg-green-100 text-green-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Withdrawn': 'bg-red-100 text-red-800',
    'Discontinued': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getConsentBadgeClass = (status: ConsentStatus) => {
  const classes: Record<ConsentStatus, string> = {
    'Consented': 'bg-green-100 text-green-800',
    'NotConsented': 'bg-red-100 text-red-800',
    'Withdrawn': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getSeverityBadgeClass = (severity: AESeverity) => {
  const classes: Record<AESeverity, string> = {
    'Mild': 'bg-yellow-100 text-yellow-800',
    'Moderate': 'bg-orange-100 text-orange-800',
    'Severe': 'bg-red-100 text-red-800'
  }
  return classes[severity] || 'bg-gray-100 text-gray-800'
}

const getOutcomeBadgeClass = (outcome: AEOutcome) => {
  const classes: Record<AEOutcome, string> = {
    'Resolved': 'bg-green-100 text-green-800',
    'Ongoing': 'bg-yellow-100 text-yellow-800',
    'Fatal': 'bg-red-100 text-red-800'
  }
  return classes[outcome] || 'bg-gray-100 text-gray-800'
}

const getAdverseEventBorderClass = (severity: AESeverity) => {
  const classes: Record<AESeverity, string> = {
    'Mild': 'border-yellow-200 bg-yellow-50',
    'Moderate': 'border-orange-200 bg-orange-50',
    'Severe': 'border-red-200 bg-red-50'
  }
  return classes[severity] || 'border-gray-200 bg-gray-50'
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

const formatConsentStatus = (status: ConsentStatus) => {
  const statusMap: Record<ConsentStatus, string> = {
    'Consented': 'Consented',
    'NotConsented': 'Not Consented',
    'Withdrawn': 'Withdrawn'
  }
  return statusMap[status] || status
}

const formatConsentType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatWithdrawalMethod = (method: string) => {
  return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDataCategory = (category: string) => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatVisitType = (type: string) => {
  return type.replace(/([A-Z])/g, ' $1').trim()
}
</script>
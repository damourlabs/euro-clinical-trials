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
            Patient ID: {{ patient.uuid }}
          </CardDescription>
          <CardDescription class="text-gray-600 text-sm">
            Trial: {{ patient.trialUuid }}
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
          @click="navigateTo(`/patients/${patient.uuid}/edit`)">
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
            <Label class="font-medium text-gray-600 text-sm">Subject ID</Label>
            <p class="mt-1 text-sm">
              {{ patient.subjectId }}
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
            <Label class="font-medium text-gray-600 text-sm">Consent Status</Label>
            <Badge 
              :class="getConsentBadgeClass(patient.consentStatus)" 
              class="mt-1">
              {{ formatConsentStatus(patient.consentStatus) }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Trial UUID</Label>
            <p class="mt-1 text-sm">
              {{ patient.trialUuid }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Site UUID</Label>
            <p class="mt-1 text-sm">
              {{ patient.siteUuid }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Randomization Group</Label>
            <p class="mt-1 text-sm">
              {{ patient.randomizationGroup }}
            </p>
          </div>
        </div>
      </section>

      <!-- Enrollment & Status Section -->
      <section>
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Enrollment & Status
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Enrollment Date</Label>
            <p class="mt-1 text-sm">
              {{ formatDate(patient.enrollmentDate) }}
            </p>
          </div>
          <div v-if="patient.withdrawalDate">
            <Label class="font-medium text-gray-600 text-sm">Withdrawal Date</Label>
            <p class="mt-1 text-red-600 text-sm">
              {{ formatDate(patient.withdrawalDate) }}
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
        </div>
      </section>

      <!-- Visits Section -->
      <section v-if="visits && visits.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Visits ({{ visits.length }})
        </h3>
        <div class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit Date</TableHead>
                <TableHead>Visit Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="visit in visits" 
                :key="visit.uuid">
                <TableCell>{{ formatDate(visit.visitDate) }}</TableCell>
                <TableCell>{{ visit.visitType }}</TableCell>
                <TableCell>
                  <Badge 
                    :class="getVisitStatusBadgeClass(visit.status)"
                    class="text-xs">
                    {{ visit.status }}
                  </Badge>
                </TableCell>
                <TableCell class="max-w-xs truncate">{{ visit.notes || 'No notes' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- Adverse Events Section -->
      <section v-if="adverseEvents && adverseEvents.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Adverse Events ({{ adverseEvents.length }})
        </h3>
        <div class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Trial Related</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="event in adverseEvents" 
                :key="event.uuid">
                <TableCell>{{ formatDate(event.eventDate) }}</TableCell>
                <TableCell class="max-w-xs truncate">{{ event.description }}</TableCell>
                <TableCell>
                  <Badge 
                    :class="getSeverityBadgeClass(event.severity)"
                    class="text-xs">
                    {{ event.severity }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    :class="getOutcomeBadgeClass(event.outcome)"
                    class="text-xs">
                    {{ event.outcome }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    :class="event.relatedToTrial ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'"
                    class="text-xs">
                    {{ event.relatedToTrial ? 'Yes' : 'No' }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- GDPR Consents Section -->
      <section v-if="gdprConsents && gdprConsents.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          GDPR Consents ({{ gdprConsents.length }})
        </h3>
        <div class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Consent Given</TableHead>
                <TableHead>Consent Date</TableHead>
                <TableHead>Withdrawal Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="consent in gdprConsents" 
                :key="consent.uuid">
                <TableCell>{{ consent.purpose }}</TableCell>
                <TableCell>
                  <Badge 
                    :class="consent.consentGiven ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="text-xs">
                    {{ consent.consentGiven ? 'Yes' : 'No' }}
                  </Badge>
                </TableCell>
                <TableCell>{{ formatDate(consent.consentDate) }}</TableCell>
                <TableCell>{{ consent.withdrawalDate ? formatDate(consent.withdrawalDate) : 'N/A' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- Vital Signs Section -->
      <section v-if="vitalSigns && vitalSigns.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Vital Signs ({{ vitalSigns.length }})
        </h3>
        <div class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recorded At</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Respiratory Rate</TableHead>
                <TableHead>Oxygen Saturation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="vital in vitalSigns" 
                :key="vital.uuid">
                <TableCell>{{ formatDateTime(vital.recordedAt) }}</TableCell>
                <TableCell>{{ vital.heartRate ? `${vital.heartRate} bpm` : 'N/A' }}</TableCell>
                <TableCell>
                  {{ vital.systolicBp && vital.diastolicBp ? `${vital.systolicBp}/${vital.diastolicBp} mmHg` : 'N/A' }}
                </TableCell>
                <TableCell>{{ vital.temperature ? `${vital.temperature}°C` : 'N/A' }}</TableCell>
                <TableCell>{{ vital.respiratoryRate ? `${vital.respiratoryRate} /min` : 'N/A' }}</TableCell>
                <TableCell>{{ vital.oxygenSaturation ? `${vital.oxygenSaturation}%` : 'N/A' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- Trial Information Section -->
      <section v-if="trialInfo">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Trial Information
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Trial Title</Label>
            <p class="mt-1 text-sm">
              {{ trialInfo.title }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Phase</Label>
            <Badge class="mt-1">
              Phase {{ trialInfo.phase }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Status</Label>
            <Badge class="mt-1">
              {{ trialInfo.status }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Indication</Label>
            <p class="mt-1 text-sm">
              {{ trialInfo.indication }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Start Date</Label>
            <p class="mt-1 text-sm">
              {{ formatDate(trialInfo.startDate) }}
            </p>
          </div>
        </div>
      </section>

      <!-- Site Information Section -->
      <section v-if="siteInfo">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Site Information
        </h3>
        <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label class="font-medium text-gray-600 text-sm">Site Name</Label>
            <p class="mt-1 text-sm">
              {{ siteInfo.name }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Address</Label>
            <p class="mt-1 text-sm">
              {{ siteInfo.address }}
            </p>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Status</Label>
            <Badge class="mt-1">
              {{ siteInfo.status }}
            </Badge>
          </div>
          <div>
            <Label class="font-medium text-gray-600 text-sm">Facility Type</Label>
            <p class="mt-1 text-sm">
              {{ siteInfo.facilityType }}
            </p>
          </div>
        </div>
      </section>

      <!-- Audit Logs Section -->
      <section v-if="auditLogs && auditLogs.length > 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Recent Activity ({{ auditLogs.length }})
        </h3>
        <div class="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="log in auditLogs.slice(0, 5)" 
                :key="log.uuid">
                <TableCell>{{ formatDateTime(log.timestamp) }}</TableCell>
                <TableCell>
                  <Badge 
                    :class="getActionBadgeClass(log.action)"
                    class="text-xs">
                    {{ log.action }}
                  </Badge>
                </TableCell>
                <TableCell>{{ log.userUuid }}</TableCell>
                <TableCell class="max-w-xs truncate">{{ log.details || 'No details' }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- No Data Sections -->
      <section v-if="!visits || visits.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Visits
        </h3>
        <div class="bg-gray-50 p-8 rounded-lg text-center">
          <p class="text-gray-500">No visits recorded for this patient</p>
        </div>
      </section>

      <section v-if="!adverseEvents || adverseEvents.length === 0">
        <h3 class="mb-3 font-semibold text-gray-800 text-lg">
          Adverse Events
        </h3>
        <div class="bg-gray-50 p-8 rounded-lg text-center">
          <p class="text-gray-500">No adverse events reported for this patient</p>
        </div>
      </section>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import type { PatientStatus, ConsentStatus } from '~/server/database/schema/enums'
import type { Patient, Trial, Site, Visit, AdverseEvent, GdprConsent, VitalSigns, AuditLog } from '~/server/database/schema'

// Define props
const props = defineProps<{
  patientId: string
}>()

// Stores and composables
const store = usePatientsStore()
const { error } = storeToRefs(store)

// Reactive data
const patient = ref<Patient>()
const visits = ref<Visit[]>([])
const adverseEvents = ref<AdverseEvent[]>([])
const gdprConsents = ref<GdprConsent[]>([])
const auditLogs = ref<AuditLog[]>([])
const vitalSigns = ref<VitalSigns[]>([])
const trialInfo = ref<Trial>()
const siteInfo = ref<Site>()

// Fetch patient data and related information
onMounted(async () => {
  await store.fetchById(props.patientId)
  patient.value = store.getById(props.patientId)

  if (!patient.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Patient not found',
      message: `Patient with ID ${props.patientId} not found, ${error.value}`,
      data: error.value
    })
  }

  // Fetch related data using store custom methods
  try {
    visits.value = await store.customMethods.getPatientVisits(props.patientId)
    adverseEvents.value = await store.customMethods.getPatientAdverseEvents(props.patientId)
    gdprConsents.value = await store.customMethods.getPatientGdprConsents(props.patientId)
    vitalSigns.value = await store.customMethods.getPatientVitalSigns(props.patientId)
    trialInfo.value = await store.customMethods.getPatientTrial(props.patientId)
    siteInfo.value = await store.customMethods.getPatientSite(props.patientId)
  } catch (fetchError) {
    console.warn('Some related data could not be fetched:', fetchError)
    // Continue with patient display even if some related data fails to load
  }
})

// Actions
const deletePatient = async () => {
  await store.remove(props.patientId)
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

const getVisitStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'Scheduled': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'NoShow': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getSeverityBadgeClass = (severity: string) => {
  const classes: Record<string, string> = {
    'Mild': 'bg-green-100 text-green-800',
    'Moderate': 'bg-yellow-100 text-yellow-800',
    'Severe': 'bg-red-100 text-red-800'
  }
  return classes[severity] || 'bg-gray-100 text-gray-800'
}

const getOutcomeBadgeClass = (outcome: string) => {
  const classes: Record<string, string> = {
    'Resolved': 'bg-green-100 text-green-800',
    'Ongoing': 'bg-yellow-100 text-yellow-800',
    'Fatal': 'bg-red-100 text-red-800'
  }
  return classes[outcome] || 'bg-gray-100 text-gray-800'
}

const getActionBadgeClass = (action: string) => {
  const classes: Record<string, string> = {
    'CREATE': 'bg-green-100 text-green-800',
    'UPDATE': 'bg-blue-100 text-blue-800',
    'DELETE': 'bg-red-100 text-red-800',
    'VIEW': 'bg-gray-100 text-gray-800'
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

// Helper functions for formatting
const formatDate = (dateString: string | null | undefined) => {
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

const formatDateTime = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'Not specified'
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
</script>
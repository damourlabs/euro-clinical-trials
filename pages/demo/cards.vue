<!-- Example usage of the new unified ResourceCard system -->
<template>
  <div class="space-y-8 mx-auto px-4 py-8 container">
    <div class="mb-8">
      <h1 class="mb-4 font-bold text-gray-900 text-3xl">Comprehensive Resource Card System Demo</h1>
      <p class="text-gray-600">Unified card components with consistent sizing and behavior across all resource types in the Clinical Trial Management System. Each resource type has a distinct color scheme for easy visual identification.</p>
    </div>

    <!-- Micro Cards (for table cells) -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Micro Cards (Table Cell Usage)</h2>
      <div class="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <span class="text-gray-600 text-sm">Related Trial:</span>
        <TrialCard 
          size="micro" 
          :trial="sampleTrial" />
        
        <span class="text-gray-600 text-sm">Related Patient:</span>
        <PatientCard 
          size="micro" 
          :patient="samplePatient" />
        
        <span class="text-gray-600 text-sm">Related Site:</span>
        <SiteCard 
          size="micro" 
          :site="sampleSite" />

        <span class="text-gray-600 text-sm">Principal Investigator:</span>
        <UserCard 
          size="micro" 
          :user="sampleUser" />

        <span class="text-gray-600 text-sm">Protocol Document:</span>
        <DocumentCard 
          size="micro" 
          :document="sampleDocument" />

        <span class="text-gray-600 text-sm">Recent AE:</span>
        <AdverseEventCard 
          size="micro" 
          :adverse-event="sampleAdverseEvent" />
      </div>
    </section>

    <!-- Small Cards (Preview/List items) -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Small Cards (Preview/List Items)</h2>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <TrialCard 
          size="small" 
          :trial="sampleTrial" />
        <PatientCard 
          size="small" 
          :patient="samplePatient" />
        <SiteCard 
          size="small" 
          :site="sampleSite" />
        <UserCard 
          size="small" 
          :user="sampleUser" />
        <DocumentCard 
          size="small" 
          :document="sampleDocument" />
        <AdverseEventCard 
          size="small" 
          :adverse-event="sampleAdverseEvent" />
        <GDPRConsentCard 
          size="small" 
          :gdpr-consent="sampleGDPRConsent" />
        <RegulatoryApprovalCard 
          size="small" 
          :regulatory-approval="sampleRegulatoryApproval" />
        <VisitCard 
          size="small" 
          :visit="sampleVisit" />
        <EndpointCard 
          size="small" 
          :endpoint="sampleEndpoint" />
        <EligibilityCard 
          size="small" 
          :eligibility-criteria="sampleEligibility" />
      </div>
    </section>

    <!-- Medium Cards (Dashboard/Feature cards) -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Medium Cards (Dashboard/Feature Cards)</h2>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
        <TrialCard 
          size="medium" 
          :trial="sampleTrial"
          :actions="[
            { label: 'Edit Trial', onClick: () => console.log('Edit trial'), variant: 'outline' },
            { label: 'View Details', onClick: () => console.log('View details') }
          ]" />
        <PatientCard 
          size="medium" 
          :patient="samplePatient"
          :actions="[
            { label: 'Schedule Visit', onClick: () => console.log('Schedule visit'), variant: 'outline' },
            { label: 'View Profile', onClick: () => console.log('View profile') }
          ]" />
        <SiteCard
          size="medium" 
          :site="sampleSite"
          :actions="[
            { label: 'View Site', onClick: () => console.log('View site'), variant: 'outline' },
            { label: 'Contact Site', onClick: () => console.log('Contact site') }
          ]" />
        <UserCard
          size="medium" 
          :user="sampleUser"
          :actions="[
            { label: 'Edit Profile', onClick: () => console.log('Edit profile'), variant: 'outline' },
            { label: 'Contact User', onClick: () => console.log('Contact user') }
          ]" />
        <DocumentCard
          size="medium" 
          :document="sampleDocument"
          :actions="[
            { label: 'Download', onClick: () => console.log('Download document'), variant: 'outline' },
            { label: 'Preview', onClick: () => console.log('Preview document') }
          ]" />
        <AdverseEventCard
          size="medium" 
          :adverse-event="sampleAdverseEvent"
          :actions="[
            { label: 'Review', onClick: () => console.log('Review AE'), variant: 'outline' },
            { label: 'Update Status', onClick: () => console.log('Update AE') }
          ]" />
      </div>
    </section>

    <!-- Additional Resource Types -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Regulatory & Compliance Cards</h2>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
        <GDPRConsentCard
          size="medium" 
          :gdpr-consent="sampleGDPRConsent"
          :actions="[
            { label: 'View Details', onClick: () => console.log('View consent'), variant: 'outline' },
            { label: 'Update Status', onClick: () => console.log('Update consent') }
          ]" />
        <RegulatoryApprovalCard
          size="medium" 
          :regulatory-approval="sampleRegulatoryApproval"
          :actions="[
            { label: 'View Documents', onClick: () => console.log('View reg docs'), variant: 'outline' },
            { label: 'Renew', onClick: () => console.log('Renew approval') }
          ]" />
      </div>
    </section>

    <!-- Study Management Cards -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Study Management Cards</h2>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
        <VisitCard
          size="medium" 
          :visit="sampleVisit"
          :actions="[
            { label: 'Edit Visit', onClick: () => console.log('Edit visit'), variant: 'outline' },
            { label: 'Schedule Follow-up', onClick: () => console.log('Schedule follow-up') }
          ]" />
        <EndpointCard
          size="medium" 
          :endpoint="sampleEndpoint"
          :actions="[
            { label: 'View Analysis', onClick: () => console.log('View analysis'), variant: 'outline' },
            { label: 'Update Results', onClick: () => console.log('Update results') }
          ]" />
        <EligibilityCard
          size="medium" 
          :eligibility-criteria="sampleEligibility"
          :actions="[
            { label: 'Edit Criteria', onClick: () => console.log('Edit criteria'), variant: 'outline' },
            { label: 'View Protocol', onClick: () => console.log('View protocol') }
          ]" />
      </div>
    </section>

    <!-- Loading States -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Loading States</h2>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <TrialCard 
          size="micro" 
          :loading="true" />
        <PatientCard 
          size="small" 
          :loading="true" />
        <UserCard 
          size="small" 
          :loading="true" />
        <DocumentCard 
          size="medium" 
          :loading="true" />
        <AdverseEventCard 
          size="small" 
          :loading="true" />
        <GDPRConsentCard 
          size="small" 
          :loading="true" />
        <VisitCard 
          size="small" 
          :loading="true" />
        <EndpointCard 
          size="small" 
          :loading="true" />
      </div>
    </section>

    <!-- Error States -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Error States</h2>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <TrialCard 
          size="medium" 
          :error="true"
          :on-retry="() => console.log('Retry loading trial')" />
        <PatientCard 
          size="small" 
          :error="true"
          :on-retry="() => console.log('Retry loading patient')" />
        <UserCard 
          size="small" 
          :error="true"
          :on-retry="() => console.log('Retry loading user')" />
        <DocumentCard 
          size="small" 
          :error="true"
          :on-retry="() => console.log('Retry loading document')" />
        <AdverseEventCard 
          size="small" 
          :error="true"
          :on-retry="() => console.log('Retry loading adverse event')" />
        <RegulatoryApprovalCard 
          size="small" 
          :error="true"
          :on-retry="() => console.log('Retry loading regulatory approval')" />
      </div>
    </section>

    <!-- Custom Field Configuration -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Custom Field Configuration</h2>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
        <TrialCard 
          size="medium" 
          :trial="sampleTrial"
          :custom-fields="{
            medium: [
              { key: 'title', label: 'Study Title', type: 'text' },
              { key: 'status', label: 'Current Status', type: 'badge', colorScheme: 'blue' },
              { key: 'phase', label: 'Trial Phase', type: 'text', format: (v) => `Phase ${v} Study` },
              { key: 'startDate', label: 'Initiated', type: 'date' }
            ]
          }" />
        <EndpointCard 
          size="medium" 
          :endpoint="sampleEndpoint"
          :custom-fields="{
            medium: [
              { key: 'name', label: 'Primary Endpoint', type: 'text' },
              { key: 'isPrimary', label: 'Type', type: 'badge', colorScheme: 'violet', format: (v) => v ? 'Primary' : 'Secondary' },
              { key: 'actualValue', label: 'Result', type: 'text', format: (v) => `${v} months` },
            ]
          }" />
      </div>
    </section>

    <!-- Color Scheme Overview -->
    <section class="space-y-4">
      <h2 class="font-semibold text-gray-800 text-2xl">Resource Type Color Schemes</h2>
      <p class="text-gray-600">Each resource type has a distinct color scheme for easy visual identification:</p>
      <div class="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div class="flex items-center gap-2 bg-blue-50 p-3 border rounded">
          <div class="bg-blue-500 rounded-full w-3 h-3" />
          <span class="font-medium text-blue-700 text-sm">Trial - Blue</span>
        </div>
        <div class="flex items-center gap-2 bg-purple-50 p-3 border rounded">
          <div class="bg-purple-500 rounded-full w-3 h-3" />
          <span class="font-medium text-purple-700 text-sm">Patient - Purple</span>
        </div>
        <div class="flex items-center gap-2 bg-green-50 p-3 border rounded">
          <div class="bg-green-500 rounded-full w-3 h-3" />
          <span class="font-medium text-green-700 text-sm">Site - Green</span>
        </div>
        <div class="flex items-center gap-2 bg-indigo-50 p-3 border rounded">
          <div class="bg-indigo-500 rounded-full w-3 h-3" />
          <span class="font-medium text-indigo-700 text-sm">User - Indigo</span>
        </div>
        <div class="flex items-center gap-2 bg-orange-50 p-3 border rounded">
          <div class="bg-orange-500 rounded-full w-3 h-3" />
          <span class="font-medium text-orange-700 text-sm">Document - Orange</span>
        </div>
        <div class="flex items-center gap-2 bg-red-50 p-3 border rounded">
          <div class="bg-red-500 rounded-full w-3 h-3" />
          <span class="font-medium text-red-700 text-sm">Adverse Event - Red</span>
        </div>
        <div class="flex items-center gap-2 bg-teal-50 p-3 border rounded">
          <div class="bg-teal-500 rounded-full w-3 h-3" />
          <span class="font-medium text-teal-700 text-sm">GDPR Consent - Teal</span>
        </div>
        <div class="flex items-center gap-2 bg-cyan-50 p-3 border rounded">
          <div class="bg-cyan-500 rounded-full w-3 h-3" />
          <span class="font-medium text-cyan-700 text-sm">Regulatory - Cyan</span>
        </div>
        <div class="flex items-center gap-2 bg-emerald-50 p-3 border rounded">
          <div class="bg-emerald-500 rounded-full w-3 h-3" />
          <span class="font-medium text-emerald-700 text-sm">Visit - Emerald</span>
        </div>
        <div class="flex items-center gap-2 bg-violet-50 p-3 border rounded">
          <div class="bg-violet-500 rounded-full w-3 h-3" />
          <span class="font-medium text-violet-700 text-sm">Endpoint - Violet</span>
        </div>
        <div class="flex items-center gap-2 bg-rose-50 p-3 border rounded">
          <div class="bg-rose-500 rounded-full w-3 h-3" />
          <span class="font-medium text-rose-700 text-sm">Eligibility - Rose</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { TrialCard } from '~/components/trial'
import { PatientCard } from '~/components/patient'
import { SiteCard } from '~/components/site'
import { UserCard } from '~/components/user'
import { DocumentCard } from '~/components/document'
import { AdverseEventCard } from '~/components/adverse-event'
import { GDPRConsentCard } from '~/components/gdpr-consent'
import { RegulatoryApprovalCard } from '~/components/regulatory-approval'
import { VisitCard } from '~/components/visit'
import { EndpointCard } from '~/components/endpoint'
import { EligibilityCard } from '~/components/eligibility'
import type { AdverseEvent, Document, EligibilityCriteria, Endpoint, GdprConsent, Patient, RegulatoryApproval, Site, Trial, User, Visit } from '~/server/database/schema'

// Sample data for demonstration
const sampleTrial: Trial = {
  uuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  title: 'Phase III Oncology Study',
  indication: 'Non-small cell lung cancer',
  status: 'Active',
  phase: 'III',
  startDate: '2024-01-15',
  estimatedEndDate: '2025-12-31',
  description: 'A randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of investigational drug in patients with advanced NSCLC.',
  principalInvestigatorUuid: 'user-123e4567-e89b-12d3-a456-426614174003',
  protocolUuid: 'protocol-123e4567-e89b-12d3-a456-426614174003',
  sponsorUuid: 'user-123e4567-e89b-12d3-a456-426614174002',
}

const samplePatient: Patient = {
  uuid: 'patient-123e4567-e89b-12d3-a456-426614174001',
  subjectId: 'SUBJ-001',
  status: 'Active',
  consentStatus: 'Consented',
  enrollmentDate: '2024-02-01',
  randomizationGroup: 'Treatment Arm A',
  dataCompleteness: '90.11',
  siteUuid: 'site-123e4567-e89b-12d3-a456-426614174002',
  trialUuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date();
}

const sampleSite: Site = {
  uuid: 'site-123e4567-e89b-12d3-a456-426614174002',
  name: 'University Medical Center',
  address: '123 Medical Drive, Research City, RC 12345',
  status: 'Active',
  facilityType: 'Hospital',
  patientsEnrolled: 24,
  targetEnrollment: 50,
  dataCompleteness: "90",
  activationDate: '2024-01-01',
  adverseEventsReported: 2,
  trialUuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  contactPersonUuid: '',
  principalInvestigatorUuid: '',
  studyCoordinatorUuid: null,
  dataSubmissionStatus: 'OnTime',
  lastMonitoringVisit: null,
  nextScheduledVisit: null,
  protocolDeviations: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

const sampleUser: User = {
  uuid: 'user-123e4567-e89b-12d3-a456-426614174003',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@medcenter.com',
  role: 'Principal Investigator',
  institution: 'University Medical Center',
  phoneNumber: '+1-555-123-4567',
  isActive: true,
  emailVerified: true,
  
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
}

const sampleDocument: Document = {
  uuid: 'doc-123e4567-e89b-12d3-a456-426614174004',
  title: 'Study Protocol Version 2.1',
  url: '/documents/protocol-v2.1.pdf',
  documentType: 'Protocol',
  siteUuid: 'site-123e4567-e89b-12d3-a456-426614174002',
  uploadedBy: 'user-123e4567-e89b-12d3-a456-426614174003',
  description: 'Updated study protocol with amendments for inclusion criteria',
  uploadDate: '2024-07-20',
  trialUuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date('2024-07-20'),
}

const sampleAdverseEvent: AdverseEvent = {
  uuid: 'ae-123e4567-e89b-12d3-a456-426614174005',
  patientUuid: 'patient-123e4567-e89b-12d3-a456-426614174001',
  description: 'Mild nausea and fatigue following treatment administration',
  severity: 'Mild',
  outcome: 'Resolved',
  relatedToTrial: true,
  eventDate: '2024-07-26',
  reportedAt: new Date('2024-07-26'),
  resolvedAt: new Date('2024-08-01'),
  createdAt: new Date('2024-07-26'),
  updatedAt: new Date()
}

const sampleGDPRConsent: GdprConsent = {
  uuid: 'gdpr-123e4567-e89b-12d3-a456-426614174006',
  trialUuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  patientUuid: 'patient-123e4567-e89b-12d3-a456-426614174001',
  consentGiven: true,
  consentDate: '2024-02-01',
  legalBasis: 'Consent',
  consentType: 'Data_processing',
  purpose: 'Clinical_trial_management',
  consentStatus: 'Consented',
  retentionPeriod: 5,
  dataProcessingDetails: 'Data will be processed for clinical trial management and regulatory compliance',
  timestamp: '2024-02-01',
  createdAt: new Date('2024-02-01'),
  updatedAt: new Date()
}

const sampleRegulatoryApproval:RegulatoryApproval = {
  uuid: 'reg-123e4567-e89b-12d3-a456-426614174007',
  status: 'Approved',
  type: 'Clinical Trial',
  trialUuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  authority: 'FDA',
  approvalDate: '2023-12-15',
  approvalNumber: 'IND-123456',
  expiryDate: '2025-12-15',
  conditions: 'Submit quarterly safety reports',
  notes: 'Approved with standard monitoring requirements',
  createdAt: new Date('2023-12-15'),
  updatedAt: new Date()
}

const sampleVisit: Visit = {
  uuid: 'visit-123e4567-e89b-12d3-a456-426614174008',
  patientUuid: 'patient-123e4567-e89b-12d3-a456-426614174001',
  siteUuid: 'site-123e4567-e89b-12d3-a456-426614174002',
  visitType: 'Screening',
  visitDate: '2024-08-15',
  actualDate: '2024-08-15',
  status: 'Completed',
  visitNumber: 1,
  window: '±3 days',
  notes: 'All screening procedures completed successfully',
  createdAt: new Date('2024-08-15'),
  updatedAt: new Date()
}

const sampleEndpoint: Endpoint = {
  uuid: 'endpoint-123e4567-e89b-12d3-a456-426614174009',
  description: 'Time from randomization to death from any cause',
  targetValue: "18.5",
  createdAt: new Date('2024-01-15')
}

const sampleEligibility: EligibilityCriteria = {
  uuid: 'elig-123e4567-e89b-12d3-a456-426614174010',
  trialUuid: 'trial-123e4567-e89b-12d3-a456-426614174000',
  minAge: 18,
  maxAge: 75,
  sex: 'All',
  createdAt: new Date('2024-01-15')
}

definePageMeta({
  layout: 'simple'
})

useHead({
  title: 'Resource Card Demo - CTMS',
  meta: [
    {
      name: 'description',
      content: 'Demonstration of the unified resource card system'
    }
  ]
})
</script>

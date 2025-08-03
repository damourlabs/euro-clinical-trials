<template>
  <div class="mx-auto px-4 py-8 container">
    <div class="mb-8">
      <h1 class="mb-4 font-bold text-gray-900 text-3xl">Patient Cards Demo</h1>
      <p class="text-gray-600 text-lg">Demonstration of all Patient card sizes and states using the unified ResourceCard system</p>
    </div>

    <!-- Sample Patient Data -->
    <div class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Sample Patient</h2>
      <div class="bg-gray-50 p-4 rounded-lg">
        <pre class="text-sm">{{ JSON.stringify(samplePatient, null, 2) }}</pre>
      </div>
    </div>

    <!-- Micro Cards -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Micro Cards (Table Cells)</h2>
      <p class="mb-4 text-gray-600">Compact representation for table cells with popover preview</p>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PatientCard
          :patient="samplePatient"
          size="micro" />
        <PatientCard
          :patient="samplePatient"
          size="micro" />
        <PatientCard
          :patient="samplePatient"
          size="micro" />
      </div>
    </section>

    <!-- Small Cards -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Small Cards (Previews)</h2>
      <p class="mb-4 text-gray-600">Preview cards for sidebars and recent activity sections</p>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PatientCard
          :patient="samplePatient"
          size="small" />
        <PatientCard
          :patient="samplePatient"
          size="small" />
        <PatientCard
          :patient="samplePatient"
          size="small" />
      </div>
    </section>

    <!-- Medium Cards -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Medium Cards (Dashboard)</h2>
      <p class="mb-4 text-gray-600">Dashboard cards for grid layouts and main content areas</p>
      <div class="gap-6 grid grid-cols-1 lg:grid-cols-2">
        <PatientCard
          :patient="samplePatient"
          size="medium" />
        <PatientCard
          :patient="samplePatient"
          size="medium" />
      </div>
    </section>

    <!-- Large Cards -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Large Cards (Detail Views)</h2>
      <p class="mb-4 text-gray-600">Comprehensive cards for detail pages and full information display</p>
      <div class="gap-6 grid grid-cols-1">
        <PatientCard
          :patient="samplePatient"
          size="large" />
      </div>
    </section>

    <!-- Loading States -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Loading States</h2>
      <p class="mb-4 text-gray-600">Skeleton loading states for all card sizes</p>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <PatientCard
          :patient="undefined"
          size="micro" />
        <PatientCard
          :patient="undefined"
          size="small" />
        <PatientCard
          :patient="undefined"
          size="medium" />
        <PatientCard
          :patient="undefined"
          size="large" />
      </div>
    </section>

    <!-- Status Variations -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Status Variations</h2>
      <p class="mb-4 text-gray-600">Different patient statuses with appropriate color coding</p>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PatientCard 
          :patient="{ ...samplePatient, status: 'Active' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, status: 'Completed' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, status: 'Withdrawn' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, status: 'Screening' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, status: 'Enrolled' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, status: 'Discontinued' }" 
          size="medium" />
      </div>
    </section>

    <!-- Consent Status Variations -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Consent Status Variations</h2>
      <p class="mb-4 text-gray-600">Different consent statuses with appropriate indicators</p>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PatientCard 
          :patient="{ ...samplePatient, consentStatus: 'Consented' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, consentStatus: 'NotConsented' }" 
          size="medium" />
        <PatientCard 
          :patient="{ ...samplePatient, consentStatus: 'Withdrawn' }" 
          size="medium" />
      </div>
    </section>

    <!-- Interactive Features -->
    <section class="mb-8">
      <h2 class="mb-4 font-semibold text-xl">Interactive Features</h2>
      <p class="mb-4 text-gray-600">Cards with click-to-navigate and hover effects</p>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
        <PatientCard 
          :patient="samplePatient" 
          size="medium" 
          class="hover:scale-105 transition-transform" />
        <PatientCard 
          :patient="samplePatient" 
          size="medium" 
          class="hover:shadow-lg transition-shadow" />
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { PatientCard } from '~/components/patient'
import type { Patient } from '~/server/database/schema'

definePageMeta({
  layout: 'simple',
  title: 'Patient Cards Demo'
})

// Sample patient data for demonstration
const samplePatient: Patient = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  trialUuid: '550e8400-e29b-41d4-a716-446655440001',
  siteUuid: '550e8400-e29b-41d4-a716-446655440002',
  subjectId: 'PT-001-2024',
  status: 'Active',
  consentStatus: 'Consented',
  dataCompleteness: '85.5',
  enrollmentDate: '2024-01-15',
  randomizationGroup: 'Treatment Group A',
  withdrawalDate: null,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-07-30T15:45:00Z')
}

// SEO
useHead({
  title: 'Patient Cards Demo - Euro Clinical Trials',
  meta: [
    { name: 'description', content: 'Demonstration of Patient card components in all sizes and states.' },
    { name: 'keywords', content: 'patient cards, demo, UI components, clinical trials' }
  ]
})
</script>

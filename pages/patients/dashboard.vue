<template>
  <div class="mx-auto px-4 py-8 container">
    <PatientDashboard />
  </div>
</template>

<script setup lang="ts">
import { PatientDashboard } from '~/components/patient'

definePageMeta({
  layout: 'simple',
  title: 'Patient Dashboard - Euro Clinical Trials'
})

// SEO
useHead({
  title: 'Patient Dashboard - Euro Clinical Trials',
  meta: [
    { name: 'description', content: 'Monitor patient enrollment, status, and engagement across all clinical trials.' },
    { name: 'keywords', content: 'patients, clinical trials, dashboard, enrollment, healthcare analytics' }
  ]
})
</script>

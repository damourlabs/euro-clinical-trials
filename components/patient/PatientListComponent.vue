<template>
  <ResourceListComponent
    :items="patients"
    :has-items="hasItems"
    :is-empty="isEmpty"
    :is-loading="isLoading"
    :has-error="hasError"
    :error-message="error"
    @retry="handleRetry">
    
    <!-- Header Section -->
    <template #title>Patients</template>
    
    <template #create-button>
      <UiCommonNavLink
        to="/patients/create"
        icon="i-heroicons-plus" 
        size="lg">
        New Patient
      </UiCommonNavLink>
    </template>

    <!-- Patient Cards Grid -->
    <template #card-grid="{ items }">
      <div class="gap-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <PatientCard
          v-for="patient in items"
          :key="patient.uuid"
          :patient="patient"
          size="medium" />
      </div>
    </template>

    <!-- Data Table -->
    <template #data-table="{ items }">
      <PatientDataTable :patients="items" />
    </template>

    <!-- Empty State Customization -->
    <template #empty-title>No patients registered</template>
    <template #empty-description>
      Start by registering your first patient. Patients can then be enrolled in clinical trials.
    </template>
    <template #empty-action>
      <UiCommonNavLink
        to="/patients/create"
        icon="i-heroicons-plus">
        Register first patient
      </UiCommonNavLink>
    </template>

    <!-- Loading State Customization -->
    <template #loading-text>Loading patients...</template>

    <!-- Error State Customization -->
    <template #error-title>Error loading patients</template>
  </ResourceListComponent>
</template>

<script setup lang="ts">
// Fetch patients data asynchronously
const patientStore = usePatientsStore()
const { items: patients, hasItems, isEmpty, isLoading, hasError, error } = storeToRefs(patientStore)

const handleRetry = async () => {
  // Add retry logic here if needed
  await patientStore.fetchAll()
}
</script>

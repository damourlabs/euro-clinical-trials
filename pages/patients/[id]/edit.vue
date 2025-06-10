<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Edit Patient
        </CardTitle>
        <CardDescription>
          Update the details of the clinical patient below.
        </CardDescription>
      </div>
    </CardHeader>
    
    <CardContent>
      <UiFormsDynamicForm
        v-if="patient"
        ref="form"
        :schema="{
          ...testDynamicFormSchema,
          initialValues: patient ? patient : testDynamicFormSchema.initialValues
        }"
        :on-submit="onFormSubmit" />
    </CardContent>
    
    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/patients"
          variant="secondary" icon="i-heroicons-x-mark">
          Cancel
        </UiCommonNavLink>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import type { RuleExpression } from "vee-validate";
import type { FormSchema } from '~ui/components/forms';
import { PatientSchema, type Patient  } from '~/models/patients'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~ui/components/ui/card'

const testDynamicFormSchema = createDynamicForm(PatientSchema)
const { update: updatePatient, getById } = usePatientsStore()


const patient = ref<Patient | undefined>(undefined)
const testDynamicFormSchemaWithEditPatient = ref<FormSchema<RuleExpression<unknown>>>(testDynamicFormSchema)
const loading = ref(true)

const route = useRoute()
const patientId = route.params.id as string

onMounted(async () => {
    // Fetch the current patient data
    loading.value = true
  
   const res = getById(patientId)
    if (res) {
        patient.value = res
            testDynamicFormSchemaWithEditPatient.value = {
        ...testDynamicFormSchema,
        initialValues: patient.value
    }
    } else {
        createError({
            statusCode: 404,
            statusMessage: 'Patient not found',
            message: `Patient with ID ${patientId} not found`
        })
    }



})



const form = ref()
async function onFormSubmit(values: Record<string, unknown>) {
    if (!patient.value) {
        console.error('No patient data available for editing')
        return
    }
    try {
        await updatePatient(patient.value.id, values)
        // Optionally redirect or show success message
        console.log('Patient updated successfully:', values)
    } catch (error) {
        console.error('Error updating patient:', error)
    }

    // Navigate back to the patient page
    navigateTo(`/patients/${patient.value.id}`)
}

definePageMeta({
  layout: 'simple',
  title: computed(() => patient.value ? `${patient.value.subjectId} - Edit Patient` : 'Edit Patient'),
  meta: [
    {
      name: 'description',
      content: computed(() => patient.value ? `Edit details for the clinical patient: ${patient.value.subjectId}` : 'Edit details of the clinical patient')
    }
  ]
})
</script>


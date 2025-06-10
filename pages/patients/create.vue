<!-- pages/trials/create.vue -->
<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">

        <CardTitle class="text-3xl">
          Register New Patient
        </CardTitle>

        <CardDescription>
          Fill out the form below to register a new patient for the clinical trial.
        </CardDescription>
      </div>
    </CardHeader>


    <CardContent>
      <UiFormsDynamicForm
        ref="form"
        :sections="false" :schema="testDynamicFormSchema" :on-submit="onFormSubmit" />
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

  import { PatientSchema } from '~/models/patients'


  definePageMeta({
    layout: 'simple'
  })

  // Auth check
  // const { user, isAuthenticated } = useAuth()
  // if (!isAuthenticated.value) {
  //   await navigateTo('/login')
  // }


  const testDynamicFormSchema = createDynamicForm(PatientSchema, ["patient", "trial", "site"])
  console.log('Dynamic Form Schema:', testDynamicFormSchema)
  const { create: createPatient } = usePatientsStore()


  const onFormSubmit = async (formValues: Record<string, unknown>) => {


    try {

      // We can validate the form values here if needed
      const { success, data: validatedValues, error } = await PatientSchema.spa(formValues)

      if (!success) {
        throw createError({
          statusCode: 400,
          message: 'Validation failed',
          data: error.errors
        })

        return
      }

      if (!validatedValues) {
        throw createError({
          statusCode: 400,
          message: 'Invalid form data'
        })
      }


      const patient = await createPatient(validatedValues)
      if (!patient) {
        throw createError({
          statusCode: 500,
          message: 'Failed to create patient'
        })
      }



      // Redirect to the patient details page or another appropriate page
      navigateTo(`/patients/${patient.id}`, {
        replace: true
      })

    } catch (error) {
      console.error('Error creating trial:', error)
      // Handle error (show toast, etc.)
      if (error instanceof Error) {
        throw createError({
          statusCode: 500,
          message: error.message
        })
      } else {
        throw createError({
          statusCode: 500,
          message: 'An unexpected error occurred'
        })
      }
    }

  }


  // SEO
  useHead({
    title: 'Create Trial - CTMS'
  })
</script>
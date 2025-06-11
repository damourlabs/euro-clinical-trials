<!-- pages/trials/create.vue -->
<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">

        <CardTitle class="text-3xl">
          Create New Trial
        </CardTitle>

        <CardDescription>
          Fill out the form below to create a new clinical trial.
        </CardDescription>
      </div>
    </CardHeader>


    <CardContent>
      <UiFormsDynamicForm
        ref="form"
        :schema="testDynamicFormSchema" 
        sections
        :on-submit="onFormSubmit" />
    </CardContent>

    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/trials"
          variant="secondary" icon="i-heroicons-x-mark">
          Cancel
        </UiCommonNavLink>

      </div>
    </CardFooter>


  </Card>
</template>

<script setup lang="ts">

import { TrialSchema  } from '~/models/trials'



definePageMeta({
  layout: 'simple'
})
// Auth check
// const { user, isAuthenticated } = useAuth()
// if (!isAuthenticated.value) {
//   await navigateTo('/login')
// }


const testDynamicFormSchema = createDynamicForm(TrialSchema)


const { create: createTrial } = useTrialsStore()


const onFormSubmit = async (formValues: Record<string, unknown>) => {
  // alert(JSON.stringify(formValues, null, 2))
  console.log('Form Values:', formValues)
  try {

    // We can validate the form values here if needed
    const { success, data: validatedValues, error} = await TrialSchema.safeParse(formValues)

    if (!success) {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error.errors  
      })
      // Handle validation error (show toast, etc.)
      return
    }

    if (!validatedValues) {
      throw createError({
        statusCode: 400,
        message: 'Invalid form data'
      })
    }

    console.log('Validated Values:', validatedValues) 

    const trial = await createTrial(validatedValues)
    if (!trial) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create trial'
      })
    }
    // Handle success (show toast, redirect, etc.)
    console.log('Trial created successfully:', trial)

    // Redirect to the trial details page or another appropriate page
    navigateTo(`/trials/${trial.id}`, {
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
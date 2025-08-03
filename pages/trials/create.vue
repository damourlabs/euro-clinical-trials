<!-- pages/trials/create.vue -->
<template>
  <Card class="p-6">
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
      <ClientOnly>
        <UiFormsDynamicForm
          :schema="trialForm" 
          :sections="false"
          :submit-fn="onFormSubmit" />
      </ClientOnly>
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

import { trialSchema } from '~/server/database/schema/trials'

definePageMeta({
  layout: 'simple'
})


const trialForm = createDynamicForm(trialSchema, {
  fieldsToIgnore: [
    // "uuid", 
    "updatedAt",
    "createdAt",
    "actualEndDate",
  ],
  resourceFields: [
    {
    field: 'protocolUuid',
    store: 'protocolsStore',
    displayField: 'name'
  },
    {
    field: 'sponsorUuid',
    store: 'usersStore',
    displayField: 'name'
  },
    {
    field: 'principalInvestigatorUuid',
    store: 'usersStore',
    displayField: 'name'
  },   
]})

const { create: createTrial } = useTrialsStore()

const onFormSubmit = async (formValues: Record<string, unknown>,) => {
  try {

    // We can validate the form values here if needed
    const { success, data: validatedValues, error} = await trialSchema.safeParseAsync(formValues)

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

    const trial = await createTrial({
      ...validatedValues,
      actualEndDate: null, // Set to null initially
    })
    if (!trial) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create trial'
      })
    }
    // Handle success (show toast, redirect, etc.)
    console.log('Trial created successfully:', trial)

    // Redirect to the trial details page or another appropriate page
    navigateTo(`/trials/${trial.uuid}`, {
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
<!-- pages/adverse-events/create.vue -->
<template>
  <Card class="p-6">
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Create New Adverse Event
        </CardTitle>
        <CardDescription>
          Fill out the form below to report a new adverse event.
        </CardDescription>
      </div>
    </CardHeader>

    <CardContent>
      <UiFormsDynamicForm
        :schema="adverseEventForm"
        :sections="false"
        :submit-fn="onFormSubmit" />
    </CardContent>

    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/adverse-events"
          variant="secondary" icon="i-heroicons-x-mark">
          Cancel
        </UiCommonNavLink>
      </div>
    </CardFooter>
  </Card>  
</template>

<script setup lang="ts">
import { AdverseEventSchema } from '~/server/database/schema/adverse-events'

const adverseEventForm = createDynamicForm(AdverseEventSchema, {
  fieldsToIgnore: [
    "uuid", 
    "createdAt",
    "updatedAt",
    "reportedAt",
    "resolvedAt"
  ],
  resourceFields: [
    {
      field: 'patientUuid',
      store: 'patientsStore',
      displayField: 'fullName',
    }
  ]
})

const { create: createAdverseEvent } = useAdverseEventsStore()
const onFormSubmit = async (formData: Partial<typeof AdverseEventSchema>) => {
  try {
   // We can validate the form values here if needed
    const { success, data: validatedValues, error} = await AdverseEventSchema.safeParseAsync(formData)

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


    const adverseEvent = await createAdverseEvent({
      ...validatedValues,
    })

    if (!adverseEvent) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create adverse event'
      })
    }

    // Redirect to the adverse event details page or another appropriate page
    navigateTo(`/adverse-events/${adverseEvent.uuid}`, {
      replace: true
    }) 
  }
  catch (error) {
    if(!isNuxtError(error)) {
      throw createError({
        status: 500,
        statusMessage: 'Failed to create adverse event',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
    throw error
  }
}

</script>

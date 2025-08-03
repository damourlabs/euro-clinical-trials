<!-- pages/protocols/create.vue -->
<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">

        <CardTitle class="text-3xl">
          Register New Protocol
        </CardTitle>

        <CardDescription>
          Fill out the form below to register a new protocol.
        </CardDescription>
      </div>
    </CardHeader>


    <CardContent>
      <UiFormsDynamicForm
        ref="form"
        :sections="false" :schema="protocolForm" :submit-fn="onFormSubmit" />
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
import { protocolsSchema } from '~/server/database/schema'

const protocolForm = createDynamicForm(protocolsSchema, {
  fieldsToIgnore: [
    "uuid", 
    "createdAt",
    "updatedAt",
    "actualEndDate",
  ],
  resourceFields: [
    {
      field: 'trialUuid',
      store: 'trialsStore',
      displayField: 'title',
    },
    {
      field: 'siteUuid',
      store: 'sitesStore',
      displayField: 'name',
    }
  ]
})


const onFormSubmit = async (formValues: Record<string, unknown>) => {
  try {
    // Validate the form values
    const { success, data: validatedValues, error } = await protocolsSchema.safeParseAsync(formValues)

    if (!success) {
      throw createError({
        statusCode: 400,
        message: 'Invalid form data',
        data: error
      })
    }

    // Create the protocol
    await useProtocolsStore().create(validatedValues)

    // Redirect to the protocols list page
    navigateTo('/protocols')
  } catch (error) {
    console.error('Error creating protocol:', error)
  }
}

definePageMeta({
  layout: 'simple'
})
</script>

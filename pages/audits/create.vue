<!-- pages/audits/create.vue -->
<template>
  <Card class="p-6">
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Create New Audit
        </CardTitle>
        <CardDescription>
          Fill out the form below to create a new audit log entry.
        </CardDescription>
      </div>
    </CardHeader>

    <CardContent>
      <UiFormsDynamicForm
        :schema="auditForm"
        :sections="false"
        :submit-fn="onFormSubmit" />
    </CardContent>

    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/audits"
          variant="secondary" icon="i-heroicons-x-mark">
          Cancel
        </UiCommonNavLink>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">

import { auditLogsSchema } from '~/server/database/schema';

const auditForm = createDynamicForm(auditLogsSchema, {
  fieldsToIgnore: [
    "uuid", 
    "createdAt",
    "updatedAt",
  ],
  resourceFields: [
    {
      field: 'entityUuid',
      store: 'auditsStore',
      displayField: 'entityUuid',
    },
    {
      field: 'userUuid',
      store: 'usersStore',
      displayField: 'name',
    }
  ]
})

definePageMeta({
  layout: 'simple'
})

const { create: createAudit } = useAuditsStore()

const onFormSubmit = async (formData: Record<string, unknown>) => {
  try {

    const { success, data: validatedValues, error } = await auditLogsSchema.safeParseAsync(formData)
    if (!success) {
      throw createError({
        status: 400,
        statusMessage: 'Validation Error',

        message: error?.message || 'Invalid form data'
      })
    }

    await createAudit(validatedValues)
    
    navigateTo('/audits')
  } catch (error) {
    if(!isNuxtError(error)) {
      throw createError({
        status: 500,
        statusMessage: 'Failed to create audit',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
    throw error
  }
}




</script>

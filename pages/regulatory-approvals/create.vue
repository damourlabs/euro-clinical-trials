<!-- pages/regulatory-approvals/create.vue -->
<template>
  <Card class="p-6">
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Create New Regulatory Approval
        </CardTitle>
        <CardDescription>
          Fill out the form below to create a new regulatory approval record.
        </CardDescription>
      </div>
    </CardHeader>

    <CardContent>
      <ClientOnly>
        <UiFormsDynamicForm
          :schema="regulatoryApprovalForm" 
          :sections="false"
          :submit-fn="onFormSubmit" />
      </ClientOnly>
    </CardContent>
      
    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/regulatory-approvals"
          variant="secondary" icon="i-heroicons-x-mark">
          Cancel
        </UiCommonNavLink>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { regulatoryApprovalsSchema } from '~/server/database/schema/regulatory'

definePageMeta({
  layout: 'simple'
})

// Create the dynamic form based on the regulatory approval schema
const regulatoryApprovalForm = createDynamicForm(regulatoryApprovalsSchema, {
  fieldsToIgnore: [
    "uuid", 
    "createdAt"
  ],
  resourceFields: [
    {
      field: 'trialUuid',
      store: 'trialsStore',
      displayField: 'title'
    }
  ]
})

const { create: createRegulatoryApproval } = useRegulatoryApprovalsStore()

const onFormSubmit = async (formValues: Record<string, unknown>) => {
  try {
    // We can validate the form values here if needed
    const { success, data: validatedValues, error } = await regulatoryApprovalsSchema.safeParseAsync(formValues)

    if (!success) {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error.errors  
      })
    }

    if (!validatedValues) {
      throw createError({
        statusCode: 400,
        message: 'Invalid form data'
      })
    }

    console.log('Validated Values:', validatedValues) 

    const regulatoryApproval = await createRegulatoryApproval(validatedValues)
    
    if (!regulatoryApproval) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create regulatory approval'
      })
    }
    
    // Handle success (show toast, redirect, etc.)
    console.log('Regulatory approval created successfully:', regulatoryApproval)

    // Redirect to the regulatory approval details page or another appropriate page
    navigateTo(`/regulatory-approvals/${regulatoryApproval.uuid}`, {
      replace: true
    })
    
  } catch (error) {
    console.error('Error creating regulatory approval:', error)
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
  title: 'Create Regulatory Approval - CTMS'
})
</script>

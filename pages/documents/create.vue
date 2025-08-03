<!-- pages/documents/create.vue -->
<template>
  <Card class="p-6">
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Upload New Document
        </CardTitle>
        <CardDescription>
          Fill out the form below to upload a new document.
        </CardDescription>
      </div>
    </CardHeader>

    <CardContent>
      <ClientOnly>
        <UiFormsDynamicForm
          :schema="documentForm" 
          :sections="false"
          :submit-fn="onFormSubmit" />
      </ClientOnly>
    </CardContent>
      
    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/documents"
          variant="secondary" icon="i-heroicons-x-mark">
          Cancel
        </UiCommonNavLink>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { documentsSchema } from '~/server/database/schema/documents'

definePageMeta({
  layout: 'simple'
})

// Create the dynamic form based on the document schema
const documentForm = createDynamicForm(documentsSchema, {
  fieldsToIgnore: [
    "uuid", 
    "createdAt",
    "uploadedBy" // Will be set automatically based on current user
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

const { create: createDocument } = useDocumentsStore()

const onFormSubmit = async (formValues: Record<string, unknown>) => {
  try {
    // We can validate the form values here if needed
    const { success, data: validatedValues, error } = await documentsSchema.safeParseAsync(formValues)

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

    // TODO: Get current user ID and set as uploadedBy
    const currentUserId = "temp-user-id" // This should come from auth context
    
    const document = await createDocument({
      ...validatedValues,
      uploadedBy: currentUserId
    })
    
    if (!document) {
      throw createError({
        statusCode: 500,
        message: 'Failed to upload document'
      })
    }
    
    // Handle success (show toast, redirect, etc.)
    console.log('Document uploaded successfully:', document)

    // Redirect to the document details page or another appropriate page
    navigateTo(`/documents/${document.uuid}`, {
      replace: true
    })
    
  } catch (error) {
    console.error('Error uploading document:', error)
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
  title: 'Upload Document - CTMS'
})
</script>

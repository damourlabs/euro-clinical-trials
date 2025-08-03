<!-- pages/documents/[id]/edit.vue -->
<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Edit Document
        </CardTitle>
        <CardDescription>
          Update the details of the document below.
        </CardDescription>
      </div>
    </CardHeader>
    
    <CardContent>
      <UiFormsDynamicForm
        v-if="document"
        ref="form"
        :schema="{
          ...documentFormSchema,
          initialValues: document ? document : documentFormSchema.initialValues
        }"
        :submit-fn="onFormSubmit" />
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
import type { RuleExpression } from "vee-validate";
import type { FormSchema } from '~ui/components/forms';
import { documentsSchema, type Document } from '~/server/database/schema/documents'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~ui/components/ui/card'

const documentFormSchema = createDynamicForm(documentsSchema, {
  fieldsToIgnore: [
    "uuid", 
    "createdAt",
    "uploadedBy"
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

const { update: updateDocument, getById } = useDocumentsStore()

const document = ref<Document | undefined>(undefined)
const documentFormSchemaWithEditDocument = ref<FormSchema<RuleExpression<unknown>>>(documentFormSchema)
const loading = ref(true)

const route = useRoute()
const documentId = route.params.id as string

onMounted(async () => {
    // Fetch the current document data
    loading.value = true
  
   const res = await getById(documentId)
    if (res) {
        document.value = res
        documentFormSchemaWithEditDocument.value = {
        ...documentFormSchema,
        initialValues: document.value
    }
    } else {
        createError({
            statusCode: 404,
            statusMessage: 'Document not found',
            message: `Document with ID ${documentId} not found`
        })
    }

    loading.value = false
})

const form = ref()
async function onFormSubmit(values: Record<string, unknown>) {
    if (!document.value) {
        console.error('No document data available for editing')
        return
    }
    try {
        await updateDocument(document.value.uuid, values)
        // Optionally redirect or show success message
        console.log('Document updated successfully:', values)
        
        // Redirect to document details page
        navigateTo(`/documents/${document.value.uuid}`, {
          replace: true
        })
    } catch (error) {
        console.error('Error updating document:', error)
    }
}

definePageMeta({
  layout: 'simple',
  title: computed(() => document.value ? `${document.value.title} - Edit Document` : 'Edit Document'),
  meta: [
    {
      name: 'description',
      content: computed(() => document.value ? `Edit details for the document: ${document.value.title}` : 'Edit details of the document')
    }
  ]
})
</script>

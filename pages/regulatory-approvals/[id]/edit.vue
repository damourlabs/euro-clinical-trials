<!-- pages/regulatory-approvals/[id]/edit.vue -->
<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Edit Regulatory Approval
        </CardTitle>
        <CardDescription>
          Update the details of the regulatory approval below.
        </CardDescription>
      </div>
    </CardHeader>
    
    <CardContent>
      <UiFormsDynamicForm
        v-if="regulatoryApproval"
        ref="form"
        :schema="{
          ...regulatoryApprovalFormSchema,
          initialValues: regulatoryApproval ? regulatoryApproval : regulatoryApprovalFormSchema.initialValues
        }"
        :submit-fn="onFormSubmit" />
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
import type { RuleExpression } from "vee-validate";
import type { FormSchema } from '~ui/components/forms';
import { regulatoryApprovalsSchema, type RegulatoryApproval } from '~/server/database/schema/regulatory'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~ui/components/ui/card'

const regulatoryApprovalFormSchema = createDynamicForm(regulatoryApprovalsSchema, {
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

const { update: updateRegulatoryApproval, getById } = useRegulatoryApprovalsStore()

const regulatoryApproval = ref<RegulatoryApproval | undefined>(undefined)
const regulatoryApprovalFormSchemaWithEdit = ref<FormSchema<RuleExpression<unknown>>>(regulatoryApprovalFormSchema)
const loading = ref(true)

const route = useRoute()
const regulatoryApprovalId = route.params.id as string

onMounted(async () => {
    // Fetch the current regulatory approval data
    loading.value = true
  
   const res = await getById(regulatoryApprovalId)
    if (res) {
        regulatoryApproval.value = res
        regulatoryApprovalFormSchemaWithEdit.value = {
        ...regulatoryApprovalFormSchema,
        initialValues: regulatoryApproval.value
    }
    } else {
        createError({
            statusCode: 404,
            statusMessage: 'Regulatory approval not found',
            message: `Regulatory approval with ID ${regulatoryApprovalId} not found`
        })
    }

    loading.value = false
})

const form = ref()
async function onFormSubmit(values: Record<string, unknown>) {
    if (!regulatoryApproval.value) {
        console.error('No regulatory approval data available for editing')
        return
    }
    try {
        await updateRegulatoryApproval(regulatoryApproval.value.uuid, values)
        // Optionally redirect or show success message
        console.log('Regulatory approval updated successfully:', values)
        
        // Redirect to regulatory approval details page
        navigateTo(`/regulatory-approvals/${regulatoryApproval.value.uuid}`, {
          replace: true
        })
    } catch (error) {
        console.error('Error updating regulatory approval:', error)
    }
}

definePageMeta({
  layout: 'simple',
  title: computed(() => regulatoryApproval.value ? `${regulatoryApproval.value.authority} - Edit Regulatory Approval` : 'Edit Regulatory Approval'),
  meta: [
    {
      name: 'description',
      content: computed(() => regulatoryApproval.value ? `Edit details for the regulatory approval: ${regulatoryApproval.value.authority}` : 'Edit details of the regulatory approval')
    }
  ]
})
</script>

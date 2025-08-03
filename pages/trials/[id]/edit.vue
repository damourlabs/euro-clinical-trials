<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Edit Trial
        </CardTitle>
        <CardDescription>
          Update the details of the clinical trial below.
        </CardDescription>
      </div>
    </CardHeader>
    
    <CardContent>
      <UiFormsDynamicForm
        v-if="trial"
        ref="form"
        :schema="{
          ...testDynamicFormSchema,
          initialValues: trial ? trial : testDynamicFormSchema.initialValues
        }"
        :submit-fn="onFormSubmit" />
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
import type { RuleExpression } from "vee-validate";
import type { FormSchema } from '~ui/components/forms';
import { TrialSchema, type Trial  } from '~/models/trials'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~ui/components/ui/card'

const testDynamicFormSchema = createDynamicForm(TrialSchema)
const { update: updateTrial, getById } = useTrialsStore()


const trial = ref<Trial | undefined>(undefined)
const testDynamicFormSchemaWithEditTrial = ref<FormSchema<RuleExpression<unknown>>>(testDynamicFormSchema)
const loading = ref(true)

const route = useRoute()
const trialId = route.params.id as string

onMounted(async () => {
    // Fetch the current trial data
    loading.value = true
  
   const res = await getById(trialId)
    if (res) {
        trial.value = res
            testDynamicFormSchemaWithEditTrial.value = {
        ...testDynamicFormSchema,
        initialValues: trial.value
    }
    } else {
        createError({
            statusCode: 404,
            statusMessage: 'Trial not found',
            message: `Trial with ID ${trialId} not found`
        })
    }



})



const form = ref()
async function onFormSubmit(values: Record<string, unknown>) {
    if (!trial.value) {
        console.error('No trial data available for editing')
        return
    }
    try {
        await updateTrial(trial.value.id, values)
        // Optionally redirect or show success message
        console.log('Trial updated successfully:', values)
    } catch (error) {
        console.error('Error updating trial:', error)
    }
}

definePageMeta({
  layout: 'simple',
  title: computed(() => trial.value ? `${trial.value.basicInfo.title} - Edit Trial` : 'Edit Trial'),
  meta: [
    {
      name: 'description',
      content: computed(() => trial.value ? `Edit details for the clinical trial: ${trial.value.basicInfo.title}` : 'Edit details of the clinical trial')
    }
  ]
})
</script>


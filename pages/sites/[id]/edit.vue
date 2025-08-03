<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">
        <CardTitle class="text-3xl">
          Edit Site
        </CardTitle>
        <CardDescription>
          Update the details of the clinical site below.
        </CardDescription>
      </div>
    </CardHeader>
    
    <CardContent>
      <UiFormsDynamicForm
        v-if="site"
        ref="form"
        :schema="{
          ...testDynamicFormSchema,
          initialValues: site ? site : testDynamicFormSchema.initialValues
        }"
        :submit-fn="onFormSubmit" />
    </CardContent>
    
    <CardFooter>
      <div class="flex justify-end space-x-4">
        <UiCommonNavLink
          to="/sites"
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
import { SiteSchema, type Site  } from '~/models/admin'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~ui/components/ui/card'

const testDynamicFormSchema = createDynamicForm(SiteSchema)
const { update: updateSite, getById } = useSitesStore()


const site = ref<Site | undefined>(undefined)
const testDynamicFormSchemaWithEditSite = ref<FormSchema<RuleExpression<unknown>>>(testDynamicFormSchema)
const loading = ref(true)

const route = useRoute()
const siteId = route.params.id as string

onMounted(async () => {
    // Fetch the current site data
    loading.value = true
  
   const res = getById(siteId)
    if (res) {
        site.value = res
            testDynamicFormSchemaWithEditSite.value = {
        ...testDynamicFormSchema,
        initialValues: site.value
    }
    } else {
        createError({
            statusCode: 404,
            statusMessage: 'Site not found',
            message: `Site with ID ${siteId} not found`
        })
    }



})



const form = ref()
async function onFormSubmit(values: Record<string, unknown>) {
    if (!site.value) {
        console.error('No site data available for editing')
        return
    }
    try {
        await updateSite(site.value.id, values)
        // Optionally redirect or show success message
        console.log('Site updated successfully:', values)
    } catch (error) {
        console.error('Error updating site:', error)
    }

    // Navigate back to the site page
    navigateTo(`/sites/${site.value.id}`)
}

definePageMeta({
  layout: 'simple',
  title: computed(() => site.value ? `${site.value.name} - Edit Site` : 'Edit Site'),
  meta: [
    {
      name: 'description',
      content: computed(() => site.value ? `Edit details for the clinical site: ${site.value.name}` : 'Edit details of the clinical site')
    }
  ]
})
</script>


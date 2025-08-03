<!-- pages/trials/create.vue -->
<template>
  <Card class="p-6">
    <!-- Header -->
    <CardHeader>
      <div class="mb-8">

        <CardTitle class="text-3xl">
          Register New Site
        </CardTitle>

        <CardDescription>
          Fill out the form below to register a new site for the clinical trial.
        </CardDescription>
      </div>
    </CardHeader>


    <CardContent>
      <UiFormsDynamicForm
        ref="form"
        :sections="false" :schema="testDynamicFormSchema" :submit-fn="onFormSubmit" />
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

  import { sitesSchema } from '~/server/database/schema'

  const testDynamicFormSchema = createDynamicForm(sitesSchema)

  const { create: createSite } = useSitesStore()

  const onFormSubmit = async (formValues: Record<string, unknown>) => {


    try {

      // We can validate the form values here if needed
      const { success, data: validatedValues, error } = await SiteSchema.safeParse(formValues)

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


      const site = await createSite(validatedValues)
      if (!site) {
        throw createError({
          statusCode: 500,
          message: 'Failed to create site'
        })
      }



      // Redirect to the site details page or another appropriate page
      navigateTo(`/sites/${site.id}`, {
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

  definePageMeta({
    layout: 'simple'
  })


  // SEO
  useHead({
    title: 'Create Trial - CTMS'
  })
</script>
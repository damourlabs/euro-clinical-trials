<!-- pages/sites/[id]/index.vue -->
<template>
  <div>
    <template v-if="doWeHaveData">
      <SiteComponent :site="site" />
    </template>

    <div
      v-show="site === undefined"
      class="flex justify-center items-center h-32">
      <p class="text-muted-foreground">Loading site data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Site } from '~/models/admin'

// Route params
const route = useRoute()
const siteId = route.params.id as string

// Composables
const { fetchById } = useSitesStore()

const site = ref<Site>()

onMounted(async () => {
    try {
        const val = await fetchById(siteId)
        if (val) {
            site.value = val
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'Site not found',
                message: `Site with ID ${siteId} not found`
            })
        }
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found',
            message: `Site with ID ${siteId} not found`
        })
    }
})

const doWeHaveData = computed(() => { 
    return site.value !== undefined && Object.keys(site.value).length > 0
})

// SEO
useHead({
    title: computed(() => site.value !== undefined ? `Site ${site.value.name} - CTMS` : 'Site Details - CTMS')
})

definePageMeta({
    layout: 'simple',
    title: computed(() => site.value !== undefined ? `Site ${site.value.name} - CTMS` : 'Site Details - CTMS'),
    meta: [
        {
            name: 'description',
            content: computed(() => site.value !== undefined ? `Details for site ${site.value.name} in trial ${site.value.name}` : 'Details of the site')
        }
    ]
})
</script>
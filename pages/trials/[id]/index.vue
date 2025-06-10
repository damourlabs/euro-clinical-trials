<!-- pages/trials/[id].vue -->
<template>
  <div>


    <template v-if="doWeHaveData">
      <TrialComponent :trial="trial" />
    </template>


    <div
      v-show="trial === undefined"
      class="flex justify-center items-center h-32">
      <p class="text-muted-foreground">Loading trial data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trial } from '~/models/trials'


// Route params
const route = useRoute()
const trialId = route.params.id as string

// Composables
const { getById  } = useTrialsStore()

const trial = ref<Trial>()


onMounted(async () => {
    const val = await getById(trialId)
    if (val) {
        trial.value = val
    } else {
        createError({
            statusCode: 404,
            statusMessage: 'Trial not found',
            message: `Trial with ID ${trialId} not found`
        })
    }
})

const doWeHaveData = computed(() => { 
    return trial.value !== undefined && Object.keys(trial).length > 0
})


// SEO
useHead({
    title: computed(() => trial.value !== undefined ? `${trial.value.basicInfo.title} - CTMS` : 'Trial Details - CTMS')
})

definePageMeta({
    layout: 'simple',
    title: computed(() => trial.value !== undefined ? `${trial.value.basicInfo.title} - CTMS` : 'Trial Details - CTMS'),
    meta: [
        {
            name: 'description',
            content: computed(() => trial.value !== undefined ? trial.value.basicInfo.description : 'Details of the clinical trial')
        }
    ]
})
</script>
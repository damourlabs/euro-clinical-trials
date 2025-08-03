<!-- components/common/ResourceDetailLoadingFallback.vue -->
<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <Card class="mx-auto w-full max-w-md">
      <CardContent class="pt-6">
        <div class="space-y-6 text-center">
          <!-- Loading spinner -->
          <div class="flex justify-center">
            <div class="border-primary border-b-2 rounded-full w-12 h-12 animate-spin" />
          </div>
          
          <!-- Loading text -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">{{ title }}</h3>
            <p class="text-muted-foreground text-sm">
              {{ subtitle }}
            </p>
          </div>
          
          <!-- Loading progress bars -->
          <div class="space-y-3">
            <div class="space-y-2">
              <div class="flex justify-between text-muted-foreground text-xs">
                <span>{{ progressLabel }}</span>
                <span>●●●</span>
              </div>
              <div class="bg-gray-200 rounded-full w-full h-1.5">
                <div 
                  class="bg-primary rounded-full h-1.5 animate-pulse" 
                  :style="{ width: `${progressWidth}%` }" 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~ui/components/ui/card'

interface Props {
  /** Resource type being loaded (e.g., 'trial', 'site', 'patient', 'user') */
  resourceType?: string
  /** Custom title for the loading card */
  title?: string
  /** Custom subtitle for the loading card */
  subtitle?: string
  /** Custom progress label */
  progressLabel?: string
  /** Progress bar width percentage */
  progressWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  resourceType: 'item',
  title: '',
  subtitle: '',
  progressLabel: '',
  progressWidth: 75,
})

// Computed title based on resource type
const title = computed(() => {
  if (props.title) return props.title
  
  const resourceTitles: Record<string, string> = {
    trial: 'Loading Trial Details',
    site: 'Loading Site Details',
    patient: 'Loading Patient Details',
    user: 'Loading User Details',
    protocol: 'Loading Protocol Details',
    document: 'Loading Document Details',
    visit: 'Loading Visit Details',
    audit: 'Loading Audit Details',
    adverse_event: 'Loading Adverse Event Details',
    study: 'Loading Study Details',
    regulation: 'Loading Regulation Details',
  }
  
  return resourceTitles[props.resourceType] || `Loading ${props.resourceType.charAt(0).toUpperCase() + props.resourceType.slice(1)} Details`
})

// Computed subtitle based on resource type
const subtitle = computed(() => {
  if (props.subtitle) return props.subtitle
  
  const resourceSubtitles: Record<string, string> = {
    trial: 'Please wait while we fetch the trial information...',
    site: 'Please wait while we fetch the site information...',
    patient: 'Please wait while we fetch the patient information...',
    user: 'Please wait while we fetch the user information...',
    protocol: 'Please wait while we fetch the protocol information...',
    document: 'Please wait while we fetch the document information...',
    visit: 'Please wait while we fetch the visit information...',
    audit: 'Please wait while we fetch the audit information...',
    adverse_event: 'Please wait while we fetch the adverse event information...',
    study: 'Please wait while we fetch the study information...',
    regulation: 'Please wait while we fetch the regulation information...',
  }
  
  return resourceSubtitles[props.resourceType] || `Please wait while we fetch the ${props.resourceType} information...`
})

// Computed progress label based on resource type
const progressLabel = computed(() => {
  if (props.progressLabel) return props.progressLabel
  
  const resourceProgressLabels: Record<string, string> = {
    trial: 'Loading trial data',
    site: 'Loading site data',
    patient: 'Loading patient data',
    user: 'Loading user data',
    protocol: 'Loading protocol data',
    document: 'Loading document data',
    visit: 'Loading visit data',
    audit: 'Loading audit data',
    adverse_event: 'Loading adverse event data',
    study: 'Loading study data',
    regulation: 'Loading regulation data',
  }
  
  return resourceProgressLabels[props.resourceType] || `Loading ${props.resourceType} data`
})
</script>

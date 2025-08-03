<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        class="px-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 font-mono text-blue-600 hover:text-blue-800 text-xs text-center"
      >
        {{ trialUuid.slice(-8) }}
      </Button>
    </PopoverTrigger>
    
    <PopoverContent
      class="p-0 w-80"
      align="center">
      <div
        v-if="trial"
        class="p-4">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-sm truncate">
              {{ trial.title }}
            </h3>
            <p class="mt-1 text-gray-500 text-xs">
              {{ trial.indication }}
            </p>
          </div>
          <Badge
            :class="getStatusBadgeClass(trial.status)"
            class="ml-2 text-xs">
            {{ trial.status }}
          </Badge>
        </div>

        <!-- Key Information -->
        <div class="space-y-2 mb-3">
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Phase:</span>
            <span class="font-medium">{{ trial.phase }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Start Date:</span>
            <span class="font-medium">{{ formatDate(trial.startDate) }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-2 border-gray-100 border-t">
          <UiCommonNavLink
            :to="`/trials/${trial.uuid}`"
            class="block bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded w-full font-medium text-blue-700 text-xs text-center transition-colors"
          >
            View Trial Details
          </UiCommonNavLink>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '~ui/components/ui/popover'
import { Button } from '~ui/components/ui/button'
import { Badge } from '~ui/components/ui/badge'

interface Props {
  trialUuid: string
}

const props = defineProps<Props>()

const isOpen = ref(false)

const trialStore = useTrialsStore()

const trial = computed(() => {
  return trialStore.getById(props.trialUuid)
})

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status: string) => {
  const statusClasses = {
    'Planning': 'bg-gray-100 text-gray-800',
    'Active': 'bg-green-100 text-green-800',
    'Recruiting': 'bg-blue-100 text-blue-800',
    'Suspended': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-purple-100 text-purple-800',
    'Terminated': 'bg-red-100 text-red-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <NuxtLink
    :to="`/trials/${trial.id}`" class="flex justify-between items-center hover:bg-gray-50 focus:bg-gray-50 p-3 rounded-lg w-full h-full">
    

    <div class="flex-0">
      <h4 class="font-medium text-gray-900 text-sm truncate">{{ trial.basicInfo.title }}</h4>
      <p class="mt-1 text-gray-500 text-xs">{{ trial.basicInfo.indication }}</p>
    </div>
    
    <Badge
      :class="getStatusColor(trial.timeline.status)"
      class="ml-2">
      {{ trial.timeline.status }}
    </Badge>

      
    <div class="flex justify-between items-center mt-2">
      <span class="text-gray-500 text-xs">Phase {{ trial.basicInfo.phase }}</span>
      <span class="text-gray-500 text-xs">{{ formatDate(trial.timeline.startDate) }}</span>
    </div>
    
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Trial } from '~/models/trials';
import NavLink from '~ui/components/common/NavLink.vue';

	defineProps<{ 
		trial: Trial;
	}>()
</script>

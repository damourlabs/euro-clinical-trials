<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '~ui/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~ui/components/ui/dropdown-menu'
import type { Trial } from '@/models/trials'

defineProps<{
  trial: Trial
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="p-0 w-8 h-8">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(trial.id)">
        Copy trial ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <NuxtLink :to="`/trials/${trial.id}`">
          View trial details
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NuxtLink :to="`/trials/${trial.id}/edit`">
          Edit trial
        </NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
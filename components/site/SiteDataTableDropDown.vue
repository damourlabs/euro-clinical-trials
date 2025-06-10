<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '~ui/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~ui/components/ui/dropdown-menu'

defineProps<{
  siteId: string
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
      <DropdownMenuItem @click="copy(siteId)">
        Copy site ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <NuxtLink :to="`/sites/${siteId}`">
          View site details
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NuxtLink :to="`/sites/${siteId}/edit`">
          Edit site
        </NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
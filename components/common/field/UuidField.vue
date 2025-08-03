<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        class="hover:bg-gray-100 p-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 h-auto font-mono text-xs"
        :class="containerClass"
        @click="copyToClipboard"
      >
        {{ displayValue }}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <div class="space-y-1">
        <p class="font-mono text-xs">{{ uuid }}</p>
        <p class="text-gray-500 text-xs">Click to copy</p>
      </div>
    </TooltipContent>
  </Tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~ui/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '~ui/components/ui/tooltip'

interface Props {
  uuid: string
  displayLength?: number
  align?: 'left' | 'center' | 'right'
  showPrefix?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  displayLength: 8,
  align: 'right',
  showPrefix: false
})

const copied = ref(false)

const containerClass = computed(() => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[props.align]
  
  return alignClass
})

const displayValue = computed(() => {
  const shortUuid = props.uuid.slice(-props.displayLength)
  return props.showPrefix ? `...${shortUuid}` : shortUuid
})

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.uuid)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy UUID:', err)
  }
}
</script>

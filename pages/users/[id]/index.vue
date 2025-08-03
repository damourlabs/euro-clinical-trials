<!-- pages/users/[id]/index.vue -->
<template>
  <div class="mx-auto p-4 container">
    <template v-if="doWeHaveData">
      <UserComponent :user-id="userId" />
    </template>

    <ResourceDetailLoadingFallback 
      v-else
      resource-type="user" />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/server/database/schema'
import { ResourceDetailLoadingFallback } from '~/components/common'

// Route params
const route = useRoute()
const userId = route.params.id as string

// Composables
const { fetchById } = useUsersStore()

const user = ref<User>()

onMounted(async () => {
    try {
        const val = await fetchById(userId)
        if (val) {
            user.value = val
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found',
                message: `User with ID ${userId} not found`
            })
        }
    } catch {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
            message: `User with ID ${userId} not found`
        })
    }
})

definePageMeta({
  layout: 'simple',
  title: computed(() => user.value ? `User ${user.value.name} - CTMS` : 'User Details - CTMS'),
  meta: [
    { name: 'description', content: 'View detailed information about a specific user.' },
    { name: 'robots', content: 'noindex' }
  ]
})

const doWeHaveData = computed(() => { 
    return user.value !== undefined && Object.keys(user.value).length > 0
})
</script>

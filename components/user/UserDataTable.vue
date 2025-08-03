<template>
  <DataTable
    v-if="users && users.length > 0"
    :columns="USER_COLUMNS"
    :data="users" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { USER_COLUMNS } from '~/models/columns/users-column'
import type { User } from '~/server/database/schema'

defineProps<{
  users: User[] | undefined
}>()
</script>

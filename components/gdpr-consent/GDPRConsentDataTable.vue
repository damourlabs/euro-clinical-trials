<template>
  <DataTable
    v-if="gdprConsents && gdprConsents.length > 0"
    :columns="GDPR_CONSENT_COLUMNS_SIMPLE"
    :data="gdprConsents" 
    class="mb-6" 
  />
</template>

<script setup lang="ts">
import { GDPR_CONSENT_COLUMNS_SIMPLE } from '~/models/columns/gdpr-consents-column-simple'
import type { GDPRConsent } from '~/server/database/schema'

defineProps<{
  gdprConsents: GDPRConsent[] | undefined
}>()
</script>

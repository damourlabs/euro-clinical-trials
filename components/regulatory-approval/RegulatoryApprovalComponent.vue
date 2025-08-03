<template>
  <div
    v-if="regulatoryApproval"
    class="space-y-6">
    <!-- Main Regulatory Approval Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">{{ regulatoryApproval.authority }}</h1>
          <p class="mb-4 text-gray-600">{{ getApprovalTypeDescription(regulatoryApproval.approvalType) }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Approval Type:</span>
              <StatusBadge 
                :status="regulatoryApproval.approvalType" 
                :variant="getApprovalTypeVariant(regulatoryApproval.approvalType)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Status:</span>
              <StatusBadge 
                :status="regulatoryApproval.status" 
                :variant="getStatusVariant(regulatoryApproval.status)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Authority:</span>
              <span class="ml-2 text-gray-900">{{ regulatoryApproval.authority }}</span>
            </div>
            <div v-if="regulatoryApproval.approvalDate">
              <span class="font-medium text-gray-700">Approval Date:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(regulatoryApproval.approvalDate) }}</span>
            </div>
            <div v-if="regulatoryApproval.expiryDate">
              <span class="font-medium text-gray-700">Expiry Date:</span>
              <span 
                class="ml-2 text-gray-900" 
                :class="getExpiryClass(regulatoryApproval.expiryDate)">
                {{ formatDate(regulatoryApproval.expiryDate) }}
              </span>
            </div>
            <div v-if="associatedTrial">
              <span class="font-medium text-gray-700">Associated Trial:</span>
              <NuxtLink 
                :to="`/trials/${regulatoryApproval.trialUuid}`"
                class="ml-2 text-blue-600 hover:text-blue-800">
                {{ associatedTrial.title }}
              </NuxtLink>
            </div>
            <div>
              <span class="font-medium text-gray-700">Created:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(regulatoryApproval.createdAt) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in regulatoryApprovalActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Status Overview -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h3 class="mb-4 font-semibold text-gray-800 text-lg">Approval Status Overview</h3>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-3">
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center mb-2">
            <CheckCircle class="mr-2 w-5 h-5 text-green-600" />
            <h4 class="font-medium text-gray-700">Current Status</h4>
          </div>
          <StatusBadge 
            :status="regulatoryApproval.status" 
            :variant="getStatusVariant(regulatoryApproval.status)"
            size="lg" />
        </div>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center mb-2">
            <Calendar class="mr-2 w-5 h-5 text-blue-600" />
            <h4 class="font-medium text-gray-700">Timeline</h4>
          </div>
          <div class="space-y-1 text-sm">
            <div v-if="regulatoryApproval.approvalDate">
              <span class="text-gray-600">Approved:</span>
              <span class="ml-1">{{ formatDate(regulatoryApproval.approvalDate) }}</span>
            </div>
            <div v-if="regulatoryApproval.expiryDate">
              <span class="text-gray-600">Expires:</span>
              <span 
                class="ml-1" 
                :class="getExpiryClass(regulatoryApproval.expiryDate)">
                {{ formatDate(regulatoryApproval.expiryDate) }}
              </span>
            </div>
            <div v-if="getDaysUntilExpiry(regulatoryApproval.expiryDate) !== null">
              <span class="text-gray-600">Days until expiry:</span>
              <span 
                class="ml-1 font-medium" 
                :class="getExpiryClass(regulatoryApproval.expiryDate)">
                {{ getDaysUntilExpiry(regulatoryApproval.expiryDate) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-center mb-2">
            <Building class="mr-2 w-5 h-5 text-purple-600" />
            <h4 class="font-medium text-gray-700">Regulatory Authority</h4>
          </div>
          <div class="text-sm">
            <div class="font-medium">{{ regulatoryApproval.authority }}</div>
            <div class="text-gray-600">{{ getAuthorityDescription(regulatoryApproval.authority) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compliance Information -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h3 class="mb-4 font-semibold text-gray-800 text-lg">Compliance Information</h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <h4 class="mb-2 font-medium text-gray-700">Approval Details</h4>
          <div class="space-y-2 text-sm">
            <div>
              <span class="text-gray-600">Type:</span>
              <span class="ml-2">{{ regulatoryApproval.approvalType }}</span>
            </div>
            <div>
              <span class="text-gray-600">Status:</span>
              <span class="ml-2">{{ regulatoryApproval.status }}</span>
            </div>
            <div v-if="regulatoryApproval.approvalDate">
              <span class="text-gray-600">Valid From:</span>
              <span class="ml-2">{{ formatDate(regulatoryApproval.approvalDate) }}</span>
            </div>
            <div v-if="regulatoryApproval.expiryDate">
              <span class="text-gray-600">Valid Until:</span>
              <span class="ml-2">{{ formatDate(regulatoryApproval.expiryDate) }}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="mb-2 font-medium text-gray-700">Associated Trial</h4>
          <div class="space-y-2 text-sm">
            <div v-if="associatedTrial">
              <span class="text-gray-600">Trial:</span>
              <NuxtLink 
                :to="`/trials/${regulatoryApproval.trialUuid}`"
                class="ml-2 text-blue-600 hover:text-blue-800">
                {{ associatedTrial.title }}
              </NuxtLink>
            </div>
            <div v-if="associatedTrial">
              <span class="text-gray-600">Phase:</span>
              <span class="ml-2">{{ associatedTrial.phase }}</span>
            </div>
            <div v-if="associatedTrial">
              <span class="text-gray-600">Status:</span>
              <span class="ml-2">{{ associatedTrial.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trial } from '~/server/database/schema'
import { Button } from '~ui/components/ui/button'
import { StatusBadge } from '~/components/common/field'
import { CheckCircle, Calendar, Building } from 'lucide-vue-next'

// Props
const props = defineProps<{
  regulatoryApprovalId: string
}>()

// Stores
const regulatoryApprovalsStore = useRegulatoryApprovalsStore()
const trialsStore = useTrialsStore()

// Reactive references
const regulatoryApproval = computed(() => regulatoryApprovalsStore.getById(props.regulatoryApprovalId))
const associatedTrial = ref<Trial | null>(null)

// Regulatory approval actions
const regulatoryApprovalActions = computed(() => [
  {
    label: 'Edit',
    onClick: () => navigateTo(`/regulatory-approvals/${regulatoryApproval.value?.uuid}/edit`),
    variant: 'outline' as const
  },
  {
    label: 'Delete',
    onClick: deleteRegulatoryApproval,
    variant: 'destructive' as const
  }
])

// Helper functions
const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString()
}

const getApprovalTypeVariant = (type: string) => {
  const variants: Record<string, string> = {
    'ClinicalTrial': 'default',
    'MarketingAuthorization': 'secondary',
    'EthicsCommittee': 'outline',
    'CompetentAuthority': 'destructive'
  }
  return variants[type] || 'secondary'
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    'Approved': 'default',
    'Pending': 'secondary',
    'Rejected': 'destructive',
    'Withdrawn': 'outline',
    'Expired': 'destructive'
  }
  return variants[status] || 'secondary'
}

const getApprovalTypeDescription = (type: string) => {
  const descriptions: Record<string, string> = {
    'ClinicalTrial': 'Clinical Trial Authorization',
    'MarketingAuthorization': 'Marketing Authorization Approval',
    'EthicsCommittee': 'Ethics Committee Approval',
    'CompetentAuthority': 'Competent Authority Approval'
  }
  return descriptions[type] || 'Regulatory Approval'
}

const getAuthorityDescription = (authority: string) => {
  const descriptions: Record<string, string> = {
    'EMA': 'European Medicines Agency',
    'FDA': 'Food and Drug Administration',
    'MHRA': 'Medicines and Healthcare products Regulatory Agency',
    'BfArM': 'Federal Institute for Drugs and Medical Devices'
  }
  return descriptions[authority] || 'Regulatory Authority'
}

const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getExpiryClass = (expiryDate: string | null): string => {
  const days = getDaysUntilExpiry(expiryDate)
  if (days === null) return ''
  
  if (days < 0) return 'text-red-600 font-medium' // Expired
  if (days <= 30) return 'text-orange-600 font-medium' // Expiring soon
  if (days <= 90) return 'text-yellow-600' // Warning
  return 'text-green-600' // Good
}

const deleteRegulatoryApproval = async () => {
  if (!regulatoryApproval.value) return
  
  console.log('Deleting regulatory approval:', regulatoryApproval.value.uuid)
  await regulatoryApprovalsStore.remove(regulatoryApproval.value.uuid)
  console.log('Regulatory approval deleted:', regulatoryApproval.value.uuid)
  
  // Navigate back to regulatory approvals list after deletion
  await navigateTo('/regulatory-approvals', {
    replace: true
  })
}

onMounted(async () => {
  try {
    // Fetch regulatory approval data
    await regulatoryApprovalsStore.fetchById(props.regulatoryApprovalId)
    
    // Fetch related trial data
    if (regulatoryApproval.value?.trialUuid) {
      associatedTrial.value = await trialsStore.fetchById(regulatoryApproval.value.trialUuid)
    }
    
  } catch (error) {
    console.error('Error fetching regulatory approval data:', error)
  }
})

// Set dynamic SEO based on the regulatory approval data
useHead({
  title: `${regulatoryApproval.value?.authority} Approval - CTMS`,
  meta: [
    {
      name: 'description',
      content: `Regulatory approval details for ${regulatoryApproval.value?.authority}`
    }
  ]
})
</script>

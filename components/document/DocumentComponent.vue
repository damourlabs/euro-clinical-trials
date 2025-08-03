<template>
  <div
    v-if="document"
    class="space-y-6">
    <!-- Main Document Information -->
    <div class="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h1 class="mb-2 font-bold text-gray-900 text-2xl">{{ document.title }}</h1>
          <p class="mb-4 text-gray-600">{{ document.description || 'No description provided' }}</p>
          
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span class="font-medium text-gray-700">Document Type:</span>
              <StatusBadge 
                :status="document.documentType" 
                :variant="getDocumentTypeVariant(document.documentType)"
                class="ml-2" />
            </div>
            <div>
              <span class="font-medium text-gray-700">Upload Date:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(document.uploadDate) }}</span>
            </div>
            <div v-if="uploader">
              <span class="font-medium text-gray-700">Uploaded By:</span>
              <span class="ml-2 text-gray-900">{{ uploader.name }}</span>
            </div>
            <div v-if="document.trialUuid && associatedTrial">
              <span class="font-medium text-gray-700">Associated Trial:</span>
              <NuxtLink 
                :to="`/trials/${document.trialUuid}`"
                class="ml-2 text-blue-600 hover:text-blue-800">
                {{ associatedTrial.title }}
              </NuxtLink>
            </div>
            <div v-if="document.siteUuid && associatedSite">
              <span class="font-medium text-gray-700">Associated Site:</span>
              <NuxtLink 
                :to="`/sites/${document.siteUuid}`"
                class="ml-2 text-blue-600 hover:text-blue-800">
                {{ associatedSite.name }}
              </NuxtLink>
            </div>
            <div v-if="document.createdAt">
              <span class="font-medium text-gray-700">Created:</span>
              <span class="ml-2 text-gray-900">{{ formatDate(document.createdAt) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 ml-4">
          <Button
            v-for="action in documentActions"
            :key="action.label"
            :variant="action.variant"
            size="sm"
            @click="action.onClick">
            {{ action.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Document Viewer/Download Section -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h3 class="mb-4 font-semibold text-gray-800 text-lg">Document Access</h3>
      <div class="flex items-center gap-4">
        <Button
          variant="default"
          @click="viewDocument">
          <ExternalLink class="mr-2 w-4 h-4" />
          View Document
        </Button>
        <Button
          variant="outline"
          @click="downloadDocument">
          <Download class="mr-2 w-4 h-4" />
          Download
        </Button>
        <div class="text-gray-600 text-sm">
          <FileText class="inline mr-1 w-4 h-4" />
          {{ getFileTypeFromUrl(document.url) }} Document
        </div>
      </div>
    </div>

    <!-- Document Metadata -->
    <div class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
      <h3 class="mb-4 font-semibold text-gray-800 text-lg">Document Details</h3>
      <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
        <div>
          <h4 class="mb-2 font-medium text-gray-700">File Information</h4>
          <div class="space-y-2 text-sm">
            <div>
              <span class="text-gray-600">URL:</span>
              <a 
                :href="document.url" 
                target="_blank" 
                rel="noopener noreferrer"
                class="ml-2 text-blue-600 hover:text-blue-800 break-all">
                {{ document.url }}
              </a>
            </div>
            <div>
              <span class="text-gray-600">File Type:</span>
              <span class="ml-2">{{ getFileTypeFromUrl(document.url) }}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="mb-2 font-medium text-gray-700">Associations</h4>
          <div class="space-y-2 text-sm">
            <div v-if="document.trialUuid">
              <span class="text-gray-600">Trial:</span>
              <NuxtLink 
                :to="`/trials/${document.trialUuid}`"
                class="ml-2 text-blue-600 hover:text-blue-800">
                {{ associatedTrial?.title || document.trialUuid }}
              </NuxtLink>
            </div>
            <div v-if="document.siteUuid">
              <span class="text-gray-600">Site:</span>
              <NuxtLink 
                :to="`/sites/${document.siteUuid}`"
                class="ml-2 text-blue-600 hover:text-blue-800">
                {{ associatedSite?.name || document.siteUuid }}
              </NuxtLink>
            </div>
            <div v-if="!document.trialUuid && !document.siteUuid">
              <span class="text-gray-500">No specific associations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trial, Site, User } from '~/server/database/schema'
import { Button } from '~ui/components/ui/button'
import { StatusBadge } from '~/components/common/field'
import { ExternalLink, Download, FileText } from 'lucide-vue-next'

// Props
const props = defineProps<{
  documentId: string
}>()

// Stores
const documentsStore = useDocumentsStore()
const trialsStore = useTrialsStore()
const sitesStore = useSitesStore()
const usersStore = useUsersStore()

// Reactive references
const document = computed(() => documentsStore.getById(props.documentId))
const uploader = ref<User | null>(null)
const associatedTrial = ref<Trial | null>(null)
const associatedSite = ref<Site | null>(null)

// Document actions
const documentActions = computed(() => [
  {
    label: 'Edit',
    onClick: () => navigateTo(`/documents/${document.value?.uuid}/edit`),
    variant: 'outline' as const
  },
  {
    label: 'Delete',
    onClick: deleteDocument,
    variant: 'destructive' as const
  }
])

// Helper functions
const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString()
}

const getDocumentTypeVariant = (type: string) => {
  const variants: Record<string, string> = {
    'Protocol': 'default',
    'InformedConsent': 'secondary',
    'CaseReportForm': 'outline',
    'RegulatorySubmission': 'destructive',
    'Other': 'secondary'
  }
  return variants[type] || 'secondary'
}

const getFileTypeFromUrl = (url: string) => {
  const extension = url.split('.').pop()?.toUpperCase()
  return extension || 'Unknown'
}

const viewDocument = () => {
  if (document.value?.url) {
    window.open(document.value.url, '_blank', 'noopener,noreferrer')
  }
}

const downloadDocument = () => {
  if (document.value?.url) {
    const link = window.document.createElement('a')
    link.href = document.value.url
    link.download = document.value.title
    link.target = '_blank'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }
}

const deleteDocument = async () => {
  if (!document.value) return
  
  console.log('Deleting document:', document.value.uuid)
  await documentsStore.remove(document.value.uuid)
  console.log('Document deleted:', document.value.uuid)
  
  // Navigate back to documents list after deletion
  await navigateTo('/documents', {
    replace: true
  })
}

onMounted(async () => {
  try {
    // Fetch document data
    await documentsStore.fetchById(props.documentId)
    
    // Fetch related data
    if (document.value?.uploadedBy) {
      uploader.value = await usersStore.fetchById(document.value.uploadedBy)
    }
    
    if (document.value?.trialUuid) {
      associatedTrial.value = await trialsStore.fetchById(document.value.trialUuid)
    }
    
    if (document.value?.siteUuid) {
      associatedSite.value = await sitesStore.fetchById(document.value.siteUuid)
    }
    
  } catch (error) {
    console.error('Error fetching document data:', error)
  }
})

// Set dynamic SEO based on the document data
useHead({
  title: `${document.value?.title} - Document - CTMS`,
  meta: [
    {
      name: 'description',
      content: document.value?.description || 'Document Details'
    }
  ]
})
</script>

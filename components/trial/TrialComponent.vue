<template>
  <div>
    <Card class="p-6">
      <CardHeader>
        <div class="mb-8">
          <CardTitle class="text-3xl">
            {{ trial.title }}
          </CardTitle>
          <CardDescription>
            {{ trial.description }}
          </CardDescription>
          <div class="flex justify-end space-x-4 mb-6">
            <Button
              variant="default"
              @click="deleteTrial">Delete</Button>
            <UiCommonNavLink
              class="p-0"
              :to="`/trials/${trial.uuid}/edit`">Edit
            </UiCommonNavLink>
          </div>
        </div>
      </CardHeader>
    
      <CardContent>      
        <div
          class="space-y-6">
          <!-- Status Badge and Basic Info -->
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <Badge :class="getStatusBadgeClass(trial.status)">
                {{ trial.status }}
              </Badge>
              <Badge :class="getPhaseClass(trial.phase)">
                Phase {{ trial.phase }}
              </Badge>
            </div>
            <!-- <div class="text-muted-foreground text-sm">
              Protocol: {{ trialProtocol?.name }}
            </div> -->
          </div>

          <!-- Tabs for detailed information -->
          <Tabs
            default-value="overview"
            class="w-full">
            <TabsList class="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="study-design">Study Design</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="administrative">Administrative</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <!-- Overview Tab -->
            <TabsContent
              value="overview"
              class="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle class="text-lg">Trial Overview</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <!-- <div>
                    <Label class="font-medium text-muted-foreground text-sm">EudraCT Number</Label>
                    <p class="text-sm">{{ trial.basicInfo.eudraCTNumber }}</p>
                  </div> -->
                    <div>
                      <Label class="font-medium text-muted-foreground text-sm">Indication</Label>
                      <p class="text-sm">{{ trial.indication }}</p>
                    </div>
                  </div>
                
                  <Separator />
                
                <!-- <div>
                  <Label class="font-medium text-muted-foreground text-sm">Enrollment Progress</Label>
                  <div class="space-y-2 mt-2">
                    <div class="flex justify-between text-sm">
                      <span>Current: {{ trial.currentEnrollment }}</span>
                      <span>Target: {{ trial.targetEnrollment }}</span>
                    </div>
                    <Progress 
                      :value="getEnrollmentProgress(trial)" 
                      class="w-full"
                    />
                    <p class="text-muted-foreground text-xs">
                      {{ getEnrollmentProgress(trial) }}% complete
                    </p>
                  </div>
                </div> -->
                </CardContent>
              </Card>
            </TabsContent>

          <!-- Study Design Tab -->
          <!-- <TabsContent
            value="study-design"
            class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">Study Design</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label class="font-medium text-muted-foreground text-sm">Blinding</Label>
                    <p class="text-sm">{{ formatBlinding(trial) }}</p>
                  </div>
                  <div>
                    <Label class="font-medium text-muted-foreground text-sm">Randomization Strategy</Label>
                    <p class="text-sm">{{ trial.studyDesign.randomizationStrategy.type }}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label class="font-medium text-muted-foreground text-sm">Primary Endpoint</Label>
                  <Card class="mt-2">
                    <CardContent class="pt-4">
                      <p class="text-sm">{{ trial.studyDesign.primaryEndpoint.description }}</p>
                      <div class="mt-2 text-muted-foreground text-xs">
                        <span>Method: {{ trial.studyDesign.primaryEndpoint.measurementMethod }}</span>
                        <span class="ml-4">Target: {{ trial.studyDesign.primaryEndpoint.targetValue }} {{ trial.studyDesign.primaryEndpoint.unit }}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div v-if="trial.studyDesign.secondaryEndpoints.length > 0">
                  <Label class="font-medium text-muted-foreground text-sm">Secondary Endpoints</Label>
                  <div class="space-y-2 mt-2">
                    <Card
                      v-for="endpoint in trial.studyDesign.secondaryEndpoints"
                      :key="endpoint.id" class="border-l-4 border-l-blue-200">
                      <CardContent class="pt-4">
                        <p class="text-sm">{{ endpoint.description }}</p>
                        <div class="mt-1 text-muted-foreground text-xs">
                          Method: {{ endpoint.measurementMethod }}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> -->

          <!-- Timeline Tab -->
          <!-- <TabsContent
            value="timeline"
            class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">Trial Timeline</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-4">
                  <div class="flex items-center space-x-4">
                    <div class="bg-green-500 rounded-full w-3 h-3"/>
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <Label class="font-medium text-sm">Start Date</Label>
                        <span class="text-sm">{{ formatDate(trial.timeline.startDate) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-4">
                    <div class="bg-blue-500 rounded-full w-3 h-3"/>
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <Label class="font-medium text-sm">Estimated End Date</Label>
                        <span class="text-sm">{{ formatDate(trial.timeline.estimatedEndDate) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    v-if="trial.timeline.actualEndDate"
                    class="flex items-center space-x-4">
                    <div class="bg-red-500 rounded-full w-3 h-3"/>
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <Label class="font-medium text-sm">Actual End Date</Label>
                        <span class="text-sm">{{ formatDate(trial.timeline.actualEndDate) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label class="font-medium text-muted-foreground text-sm">Duration</Label>
                  <p class="mt-1 text-sm">{{ calculateDuration(trial.timeline) }}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent> -->

          <!-- Administrative Tab -->
          <!-- <TabsContent
            value="administrative"
            class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">Administrative Information</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label class="font-medium text-muted-foreground text-sm">Sponsor ID</Label>
                    <p class="font-mono text-sm">{{ trial.administrative.sponsorId }}</p>
                  </div>
                  <div>
                    <Label class="font-medium text-muted-foreground text-sm">Principal Investigator ID</Label>
                    <p class="font-mono text-sm">{{ trial.administrative.principalInvestigatorId }}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div v-if="trial.administrative.sites.length > 0">
                  <Label class="font-medium text-muted-foreground text-sm">Clinical Sites ({{ trial.administrative.sites.length }})</Label>
                  <div class="space-y-2 mt-2">
                    <Card
                      v-for="site in trial.administrative.sites"
                      :key="site.id" class="border-l-4 border-l-green-200">
                      <CardContent class="pt-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-medium text-sm">{{ site.name }}</p>
                            <p class="text-muted-foreground text-xs">{{ site.address }}</p>
                          </div>
                          <span
                            class="inline-flex items-center px-2 py-1 rounded-md text-xs"
                            :class="getSiteStatusClass(site.status)">
                            {{ site.status }}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> -->

          <!-- Compliance Tab -->
          <!-- <TabsContent
            value="compliance"
            class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label class="font-medium text-muted-foreground text-sm">GDPR Compliance</Label>
                    <div class="flex items-center space-x-2 mt-1">
                      <div
                        class="rounded-full w-2 h-2" 
                        :class="trial.regulatoryCompliance.complianceStatus.gdprCompliant ? 'bg-green-500' : 'bg-red-500'"/>
                      <span class="text-sm">{{ trial.regulatoryCompliance.complianceStatus.gdprCompliant ? 'Compliant' : 'Non-compliant' }}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div v-if="trial.regulatoryCompliance.regulatoryApprovals.length > 0">
                  <Label class="font-medium text-muted-foreground text-sm">Regulatory Approvals</Label>
                  <div class="space-y-2 mt-2">
                    <Card
                      v-for="approval in trial.regulatoryCompliance.regulatoryApprovals"
                      :key="approval.id">
                      <CardContent class="pt-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-medium text-sm">{{ approval.authority }}</p>
                            <p class="text-muted-foreground text-xs">{{ approval.type }}</p>
                          </div>
                          <div class="text-right">
                            <span
                              class="inline-flex items-center px-2 py-1 rounded-md text-xs"
                              :class="getApprovalStatusClass(approval.status)">
                              {{ approval.status }}
                            </span>
                            <p class="mt-1 text-muted-foreground text-xs">{{ formatDate(approval.approvalDate) }}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div v-if="trial.regulatoryCompliance.protocolDeviations.length > 0">
                  <Label class="font-medium text-muted-foreground text-sm">Protocol Deviations ({{ trial.regulatoryCompliance.protocolDeviations.length }})</Label>
                  <div class="space-y-2 mt-2">
                    <Card
                      v-for="deviation in trial.regulatoryCompliance.protocolDeviations"
                      :key="deviation.id" class="border-l-4 border-l-yellow-200">
                      <CardContent class="pt-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-medium text-sm">{{ deviation.description }}</p>
                            <p class="text-muted-foreground text-xs">{{ formatDate(deviation.dateOccurred) }}</p>
                          </div>
                          <span
                            class="inline-flex items-center px-2 py-1 rounded-md text-xs"
                            :class="getSeverityClass(deviation.severity)">
                            {{ deviation.severity }}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> -->
          </Tabs>
        </div>    
      
      </CardContent>
    </Card>
  </div>
</template>


<script setup lang="ts">
import type { TrialStatus } from '~/server/database/schema/enums'
import { Badge } from '~ui/components/ui/badge'

// Get trial ID from props instead of the trial object
const props = defineProps<{
  trialId: string
}>()

// Fetch trial data asynchronously
const { getById, remove } = useTrialsStore()

// Use await to make this component async
const trial = await getById(props.trialId)

// Handle case where trial is not found
if (!trial) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Trial not found',
    message: `Trial with ID ${props.trialId} not found`
  })
}

// Set dynamic SEO based on the trial data
useHead({
  title: `${trial.title} - CTMS`,
  meta: [
    {
      name: 'description',
      content: trial.description
    }
  ]
})

const deleteTrial = async () => {
  console.log('Deleting trial:', trial.uuid)
  await remove(trial.uuid)
  console.log('Trial deleted:', trial.uuid)

  // Navigate back to trials list after deletion
  await navigateTo('/trials', {
    replace: true
  })
}

// Helper functions
const getStatusBadgeClass = (status: TrialStatus) => {
  const classes: Record<TrialStatus, string> = {
    'Planning': 'bg-gray-100 text-gray-800',
    'Active': 'bg-green-100 text-green-800',
    'Paused': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Terminated': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPhaseClass = (phase: string) => {
  const classes: Record<string, string> = {
    'I': 'bg-blue-100 text-blue-800',
    'II': 'bg-green-100 text-green-800',
    'III': 'bg-yellow-100 text-yellow-800',
    'IV': 'bg-red-100 text-red-800'
  }
  return classes[phase] || 'bg-gray-100 text-gray-800'
}

</script>

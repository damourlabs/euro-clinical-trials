<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <Card class="mx-auto w-full max-w-md">
      <CardContent class="pt-6">
        <div class="space-y-6 text-center">
          <!-- Loading spinner -->
          <div class="flex justify-center">
            <div class="border-primary border-b-2 rounded-full w-12 h-12 animate-spin" />
          </div>
          
          <!-- Loading text -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">Loading Trial Details</h3>
            <p class="text-muted-foreground text-sm">
              Please wait while we fetch the trial information...
            </p>
          </div>
          
          <!-- Loading progress bars -->
          <div class="space-y-3">
            <div class="space-y-2">
              <div class="flex justify-between text-muted-foreground text-xs">
                <span>Loading trial data</span>
                <span>●●●</span>
              </div>
              <div class="bg-gray-200 rounded-full w-full h-1.5">
                <div 
                  class="bg-primary rounded-full h-1.5 animate-pulse" 
                  style="width: 75%" 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
// No props needed for loading fallback
</script>

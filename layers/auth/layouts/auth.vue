<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="font-semibold text-gray-900 text-xl">
              Euro Clinical Trials
            </h1>
          </div>
          <nav class="flex space-x-4">
            <UiCommonNavLink 
              to="/auth/login" 
              variant="ghost"
              class="text-gray-700 hover:text-gray-900"
            >
              Sign In
            </UiCommonNavLink>
            <UiCommonNavLink 
              to="/auth/register" 
              variant="primary"
              class="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Register
            </UiCommonNavLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-gray-200 border-t">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div class="text-gray-500 text-sm text-center">
          <p>
            &copy; {{ new Date().getFullYear() }} Euro Clinical Trials. 
            GDPR Compliant Clinical Trial Management System.
          </p>
          <p class="mt-2">
            This system complies with European regulations for clinical trial data management and patient privacy.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No auth required for auth pages
definePageMeta({
  auth: false
})
</script>

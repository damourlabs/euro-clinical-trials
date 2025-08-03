export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // // Skip middleware for auth pages
    // if (to.path.startsWith('/auth/')) {
    //     return
    // }

    // // Check if user is authenticated
    // if (!authStore.isAuthenticated) {
    //     return navigateTo('/auth/login')
    // }

    // // Check role-based access for specific routes
    // if (to.path.startsWith('/admin/') && !authStore.isAdmin) {
    //     throw createError({
    //         statusCode: 403,
    //         statusMessage: 'Admin access required'
    //     })
    // }

    // if (to.path.startsWith('/clinical/') && !authStore.isClinicalStaff) {
    //     throw createError({
    //         statusCode: 403,
    //         statusMessage: 'Clinical staff access required'
    //     })
    // }
})

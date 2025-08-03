export interface AuthUser {
    uuid: string
    email: string
    name: string
    role: string
    institution: string
    emailVerified: boolean
    twoFactorEnabled: boolean
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<AuthUser | null>(null)
    const isAuthenticated = computed(() => !!user.value)
    const isLoading = ref(false)

    // Actions
    const login = async (credentials: { email: string; requestTwoFactor?: boolean }) => {
        isLoading.value = true
        try {
            const response = await $fetch('/api/auth/login', {
                method: 'POST',
                body: credentials
            })
            return response
        } finally {
            isLoading.value = false
        }
    }

    const verify = async (data: { email: string; token?: string; twoFactorCode?: string }) => {
        isLoading.value = true
        try {
            const response = await $fetch('/api/auth/verify', {
                method: 'POST',
                body: data
            })

            if (response.data.user) {
                user.value = response.data.user
            }

            return response
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        isLoading.value = true
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST'
            })
            user.value = null
            await navigateTo('/auth/login')
        } finally {
            isLoading.value = false
        }
    }

    const register = async (userData: Record<string, unknown>) => {
        isLoading.value = true
        try {
            const response = await $fetch('/api/auth/register', {
                method: 'POST',
                body: userData
            })
            return response
        } finally {
            isLoading.value = false
        }
    }

    const fetchUser = async () => {
        if (import.meta.server) return

        isLoading.value = true
        try {
            // Try to get user from JWT token
            const authCookie = useCookie('auth-token')
            if (!authCookie.value) {
                return
            }

            // Verify token and get user info
            const response = await $fetch('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${authCookie.value}`
                }
            })

            if (response.data) {
                user.value = response.data
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            // Clear invalid token
            const authCookie = useCookie('auth-token')
            authCookie.value = null
        } finally {
            isLoading.value = false
        }
    }

    const hasRole = (requiredRole: string | string[]) => {
        if (!user.value) return false

        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        return roles.includes(user.value.role)
    }

    const hasAnyRole = (roles: string[]) => {
        if (!user.value) return false
        return roles.includes(user.value.role)
    }

    const isAdmin = computed(() => hasAnyRole(['Coordinator', 'Sponsor']))
    const isClinicalStaff = computed(() => hasAnyRole(['Coordinator', 'Sponsor', 'Investigator', 'Monitor', 'Nurse']))

    // Initialize user on store creation
    if (import.meta.client) {
        fetchUser()
    }

    return {
        // State
        user: readonly(user),
        isAuthenticated,
        isLoading: readonly(isLoading),
        isAdmin,
        isClinicalStaff,

        // Actions
        login,
        verify,
        logout,
        register,
        fetchUser,
        hasRole,
        hasAnyRole
    }
})

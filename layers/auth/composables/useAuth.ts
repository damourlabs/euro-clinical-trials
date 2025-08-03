/**
 * Composable for auth configuration management
 * Allows the main app to override auth layer defaults
 */
export const useAuthConfig = () => {
    const { public: { auth: authConfig } } = useRuntimeConfig()

    return {
        // Two-factor authentication settings
        enableTwoFactor: authConfig.enableTwoFactor ?? true,

        // Magic link authentication
        enableMagicLink: authConfig.enableMagicLink ?? true,

        // OAuth providers
        enableOAuth: authConfig.enableOAuth ?? true,

        // Session settings
        sessionTimeout: authConfig.sessionTimeout ?? (24 * 60 * 60 * 1000), // 24 hours

        // Email verification
        requireEmailVerification: authConfig.requireEmailVerification ?? true,

        // Clinical trial specific settings
        enableRoleBasedAccess: authConfig.enableRoleBasedAccess ?? true,

        // GDPR compliance settings
        enableGdprConsent: authConfig.enableGdprConsent ?? true,

        // Audit logging for clinical trials
        enableAuditLogging: authConfig.enableAuditLogging ?? true
    }
}

/**
 * Composable for auth utilities
 */
export const useAuthUtils = () => {
    const config = useAuthConfig()

    const getRedirectPath = (userRole?: string) => {
        // Default redirect logic that can be overridden by the main app
        if (userRole === 'admin') return '/admin/dashboard'
        if (userRole === 'clinical_staff') return '/clinical/dashboard'
        if (userRole === 'researcher') return '/research/dashboard'
        return '/dashboard'
    }

    const validateSession = () => {
        const { sessionTimeout } = config
        // Session validation logic here
        return true
    }

    const requiresEmailVerification = (user: any) => {
        return config.requireEmailVerification && !user?.emailVerified
    }

    return {
        getRedirectPath,
        validateSession,
        requiresEmailVerification,
        config
    }
}

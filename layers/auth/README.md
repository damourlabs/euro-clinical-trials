# @damourlabs/auth-layer

A comprehensive authentication layer for Nuxt 3 applications with clinical trial management features.

## Features

- 🔐 **Multi-factor Authentication** - Email-based magic links and 2FA
- 🌐 **OAuth Integration** - GitHub and other providers
- 🏥 **Clinical Trial Compliance** - GDPR-compliant user management
- 🔑 **Role-based Access Control** - Admin, clinical staff, researcher roles
- 📧 **Email Verification** - Secure email verification workflow
- 🛡️ **Security** - JWT tokens, secure sessions, audit logging
- 🎨 **Customizable** - Configurable through runtime config

## Installation

This layer is designed to be used as a local layer within your Nuxt workspace.

## Configuration

Add the layer to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: ['./layers/auth'],
  
  runtimeConfig: {
    public: {
      auth: {
        // Override auth layer defaults
        enableTwoFactor: true,
        enableMagicLink: true,
        enableOAuth: true,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        requireEmailVerification: true,
        enableRoleBasedAccess: true,
        enableGdprConsent: true,
        enableAuditLogging: true
      }
    }
  }
})
```

## Environment Variables

```bash
# Required
AUTH_SECRET=your-secret-key
OAUTH_GITHUB_CLIENT_ID=your-github-client-id
OAUTH_GITHUB_CLIENT_SECRET=your-github-client-secret

# Optional email configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## Usage

### Authentication Store

```vue
<script setup>
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

// Login
await authStore.login({ email: 'user@example.com' })

// Logout
await authStore.logout()
</script>
```

### Auth Configuration

```vue
<script setup>
const authConfig = useAuthConfig()

// Check if 2FA is enabled
if (authConfig.enableTwoFactor) {
  // Show 2FA option
}
</script>
```

### Route Protection

The layer provides automatic route protection through middleware. Routes starting with `/auth/` are public, all others require authentication by default.

To make a page public:

```vue
<script setup>
definePageMeta({
  auth: false
})
</script>
```

### Role-based Access

```vue
<script setup>
// Protect admin routes
definePageMeta({
  middleware: 'auth',
  requiredRole: 'admin'
})
</script>
```

## API Endpoints

The layer provides the following API endpoints:

- `POST /api/auth/login` - Initiate login (magic link or 2FA)
- `POST /api/auth/verify` - Verify login token or 2FA code
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /auth/github` - GitHub OAuth

## Components

### Pages
- `/auth/login` - Login page with 2FA support
- `/auth/register` - Registration page
- `/auth/verify` - Magic link verification
- `/auth/verify-email` - Email verification

### Layouts
- `auth` - Clean layout for authentication pages

## Types

The layer includes TypeScript definitions for:
- User interface
- Authentication session
- Role definitions
- API responses

## Customization

### Override Pages

Create pages in your main app to override layer pages:

```
pages/
  auth/
    login.vue  # This will override the layer's login page
```

### Extend Store

```typescript
// composables/useAuthExtended.ts
export const useAuthExtended = () => {
  const authStore = useAuthStore()
  
  // Add custom auth logic
  const customLogin = async () => {
    // Custom implementation
  }
  
  return {
    ...authStore,
    customLogin
  }
}
```

### Custom Middleware

```typescript
// middleware/custom-auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Your custom auth logic
})
```

## Clinical Trial Features

The auth layer includes specific features for clinical trial management:

- **GDPR Compliance** - User consent tracking and data protection
- **Audit Logging** - All authentication events are logged
- **Role Hierarchy** - Clinical staff, researchers, site coordinators
- **Session Management** - Configurable session timeouts for security
- **Data Encryption** - Sensitive user data encryption

## License

MIT License

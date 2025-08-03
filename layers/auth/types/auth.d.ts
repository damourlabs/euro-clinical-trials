// auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: string
    }

    interface UserSession {
        user: User
    }

    interface SecureSessionData {
        user: User
    }
}

export { }
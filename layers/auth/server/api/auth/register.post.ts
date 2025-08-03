import { z } from 'zod'
import { useDb } from '~/server/utils/drizzle'
import { generateSecureToken } from '~/server/utils/jwt'
import { sendEmailVerificationEmail } from '~/server/utils/email'
import { eq } from 'drizzle-orm'
import type { ServerResponse } from '~/models/utils'

// Registration schema
const RegistrationSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    phoneNumber: z.string().max(20).optional(),
    institution: z.string().min(1, 'Institution is required').max(100, 'Institution must be less than 100 characters'),
    requestedRole: z.enum(['Patient', 'Investigator', 'Coordinator', 'Monitor', 'Nurse', 'Sponsor']).default('Patient'),
    gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
    specialization: z.string().optional(), // For medical professionals
    licenseNumber: z.string().optional(), // For medical professionals
    experience: z.string().optional(), // For medical professionals
    reason: z.string().optional(), // Why they want to join
})

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    }

    const db = useDb()

    // Validate request body
    const { success, error, data } = await readValidatedBody(event, RegistrationSchema.safeParse)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid registration data',
            data: error.errors
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Registration data is required'
        })
    }

    try {
        // Check if user already exists
        const existingUsers = await db
            .select()
            .from(tables.users)
            .where(eq(tables.users.email, data.email))
            .limit(1)

        if (existingUsers.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'An account with this email already exists'
            })
        }

        // Generate verification token
        const verificationToken = generateSecureToken()
        const verificationExpires = new Date()
        verificationExpires.setHours(verificationExpires.getHours() + 24) // 24 hours

        // Create user record
        const newUser = {
            uuid: crypto.randomUUID(),
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber || null,
            institution: data.institution,
            role: 'Patient', // Start with Patient role, will be upgraded by admin
            isActive: false, // Requires email verification and admin approval
            emailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            gdprConsentGiven: data.gdprConsent,
            gdprConsentDate: new Date(),
            twoFactorEnabled: false,
            loginAttempts: 0,
            magicLinkToken: null,
            magicLinkExpires: null,
            twoFactorSecret: null,
            twoFactorToken: null,
            twoFactorExpires: null,
            accountLockedUntil: null,
            lastLoginAt: null,
            githubId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await db.insert(tables.users).values(newUser)

        // Send verification email
        await sendEmailVerificationEmail(data.email, verificationToken, data.name)

        // Log registration audit event
        // await db.insert(tables.auditLogs).values({
        //   uuid: crypto.randomUUID(),
        //   trialUuid: crypto.randomUUID(), // Temporary - will be updated when user joins a trial
        //   userUuid: newUser.uuid,
        //   action: 'Create',
        //   entityType: 'User',
        //   entityUuid: newUser.uuid,
        //   timestamp: new Date(),
        //   ipAddress: getRequestIP(event),
        //   userAgent: getHeader(event, 'user-agent') || '',
        //   changes: {
        //     action: 'user_registration',
        //     email: data.email,
        //     requestedRole: data.requestedRole,
        //     institution: data.institution
        //   },
        //   oldValues: null,
        //   newValues: null,
        //   sessionId: null,
        // })

        const response: ServerResponse<{ message: string; requiresVerification: boolean }> = {
            status: 'success',
            statusCode: 201,
            statusText: 'Created',
            message: 'Registration successful. Please check your email to verify your account.',
            data: {
                message: 'Registration successful. Please check your email to verify your account.',
                requiresVerification: true
            }
        }

        return response

    } catch (error: unknown) {
        console.error('Registration error:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error during registration'
        })
    }
})

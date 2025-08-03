import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '~/server/database/schema'
import {
    GenericCompactCard,
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const USER_COLUMNS: ColumnDef<User>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'User ID'),
        cell: ({ row }) => {
            const user = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<User>, {
                    entityUuid: user.uuid,
                    entityType: 'user',
                    fetchFunction: () => Promise.resolve(user),
                    titleField: 'name',
                    subtitleField: 'email',
                    statusField: 'role',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'name',
        header: () => h('div', { class: getHeaderClasses() }, 'Name'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string
            return h('div', { class: getCellClasses() + ' font-medium' }, name)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'email',
        header: () => h('div', { class: getHeaderClasses() }, 'Email'),
        cell: ({ row }) => {
            const email = row.getValue('email') as string
            return h('div', { class: getCellClasses() },
                h('a', {
                    href: `mailto:${email}`,
                    class: 'text-blue-600 hover:text-blue-800 underline'
                }, email)
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'role',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Role'),
        cell: ({ row }) => {
            const role = row.getValue('role') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: role })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'institution',
        header: () => h('div', { class: getHeaderClasses() }, 'Institution'),
        cell: ({ row }) => {
            const institution = row.getValue('institution') as string
            const truncated = institution.length > 40 ? institution.substring(0, 40) + '...' : institution
            return h('div', { class: getCellClasses(), title: institution }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'phoneNumber',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Phone'),
        cell: ({ row }) => {
            const phoneNumber = row.getValue('phoneNumber') as string | null
            if (!phoneNumber) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No phone')
            }
            return h('div', { class: getCellClasses('center') },
                h('a', {
                    href: `tel:${phoneNumber}`,
                    class: 'text-blue-600 hover:text-blue-800 underline'
                }, phoneNumber)
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'isActive',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: isActive ? 'Active' : 'Inactive',
                    variant: isActive ? 'success' : 'secondary'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'emailVerified',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Email Verified'),
        cell: ({ row }) => {
            const emailVerified = row.getValue('emailVerified') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: emailVerified ? 'Verified' : 'Not Verified',
                    variant: emailVerified ? 'success' : 'warning'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'twoFactorEnabled',
        header: () => h('div', { class: getHeaderClasses('center') }, '2FA'),
        cell: ({ row }) => {
            const twoFactorEnabled = row.getValue('twoFactorEnabled') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: twoFactorEnabled ? 'Enabled' : 'Disabled',
                    variant: twoFactorEnabled ? 'success' : 'secondary'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'gdprConsentGiven',
        header: () => h('div', { class: getHeaderClasses('center') }, 'GDPR Consent'),
        cell: ({ row }) => {
            const gdprConsentGiven = row.getValue('gdprConsentGiven') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: gdprConsentGiven ? 'Given' : 'Not Given',
                    variant: gdprConsentGiven ? 'success' : 'warning'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'lastLoginAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Last Login'),
        cell: ({ row }) => {
            const lastLoginAt = row.getValue('lastLoginAt') as string | null
            if (!lastLoginAt) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'Never')
            }
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: lastLoginAt, showTime: true })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'createdAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Created'),
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: createdAt, showTime: true })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'updatedAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Updated'),
        cell: ({ row }) => {
            const updatedAt = row.getValue('updatedAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: updatedAt, showTime: true })
            )
        },
    })
]

import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Trial, AuditLog, User } from '~/server/database/schema';
import {
    UuidField,
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

async function fetchUser(_uuid: string) {
    const user = useUsersStore().getById(_uuid)

    if (user === undefined) {
        throw createError(`User with UUID ${_uuid} not found`)
    }

    return user
}

async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

export const AUDIT_COLUMNS: ColumnDef<AuditLog>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Audit ID'),
        cell: ({ row }) => {
            const audit = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<AuditLog>, {
                    entityUuid: audit.uuid,
                    entityType: 'audit',
                    fetchFunction: () => Promise.resolve(audit),
                    titleField: 'action',
                    subtitleField: 'entityType',
                    statusField: undefined,
                    colorScheme: 'orange'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'action',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Action'),
        cell: ({ row }) => {
            const action = row.getValue('action') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: action })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'entityType',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Entity Type'),
        cell: ({ row }) => {
            const entityType = row.getValue('entityType') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: entityType })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'entityUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Entity'),
        cell: ({ row }) => {
            const entityUuid = row.getValue('entityUuid') as string
            const entityType = row.getValue('entityType') as string
            const detailUrl = getEntityDetailUrl(entityType, entityUuid)

            return h('div', { class: getCellClasses('center') },
                h('span', {}, entityType)
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'userUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'User'),
        cell: ({ row }) => {
            const userUuid = row.getValue('userUuid') as string | null
            if (!userUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'System')
            }
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<User>, {
                    entityUuid: userUuid,
                    entityType: 'user',
                    fetchFunction: fetchUser,
                    titleField: 'name',
                    subtitleField: 'email',
                    statusField: 'role',
                    colorScheme: 'purple'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const trialUuid = row.getValue('trialUuid') as string
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Trial>, {
                    entityUuid: trialUuid,
                    entityType: 'trial',
                    fetchFunction: fetchTrial,
                    titleField: 'name',
                    subtitleField: 'shortName',
                    statusField: 'status',
                    colorScheme: 'blue'

                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'timestamp',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Timestamp'),
        cell: ({ row }) => {
            const timestamp = row.getValue('timestamp') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: timestamp, showTime: true })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'ipAddress',
        header: () => h('div', { class: getHeaderClasses('center') }, 'IP Address'),
        cell: ({ row }) => {
            const ipAddress = row.getValue('ipAddress') as string | null
            if (!ipAddress) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'Unknown')
            }
            return h('div', { class: getCellClasses('center') + ' font-mono text-sm' }, ipAddress)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'userAgent',
        header: () => h('div', { class: getHeaderClasses('center') }, 'User Agent'),
        cell: ({ row }) => {
            const userAgent = row.getValue('userAgent') as string | null
            if (!userAgent) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'Unknown')
            }
            const truncated = userAgent.length > 40 ? userAgent.substring(0, 40) + '...' : userAgent
            return h('div', { class: getCellClasses('center') + ' font-mono text-xs', title: userAgent }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'sessionId',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Session'),
        cell: ({ row }) => {
            const sessionId = row.getValue('sessionId') as string | null
            if (!sessionId) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No session')
            }
            return h('div', { class: getCellClasses('center') },
                h(UuidField, {
                    uuid: sessionId,
                    shortDisplay: true
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'changes',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Changes'),
        cell: ({ row }) => {
            const changes = row.getValue('changes') as unknown[] | null
            if (!changes || changes.length === 0) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No changes')
            }
            const changeCount = Array.isArray(changes) ? changes.length : 0
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: `${changeCount} field${changeCount !== 1 ? 's' : ''}`,
                    variant: 'info'
                })
            )
        },
    })
]

// Helper function to generate entity detail URLs
function getEntityDetailUrl(entityType: string, entityUuid: string): string {
    const typeUrlMap: Record<string, string> = {
        'Trial': '/trials',
        'Patient': '/patients',
        'User': '/users',
        'Site': '/sites',
        'Document': '/documents',
        'AdverseEvent': '/adverse-events',
        'Protocol': '/protocols',
        'GdprConsent': '/gdpr-consents'
    }

    const basePath = typeUrlMap[entityType] || '/unknown'
    return `${basePath}/${entityUuid}`
}

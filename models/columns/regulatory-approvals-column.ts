import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Trial, RegulatoryApproval } from '~/server/database/schema';
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import RegulatoryApprovalCard from '~/components/regulatory-approval/RegulatoryApprovalCard.vue'

async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

export const REGULATORY_APPROVAL_COLUMNS: ColumnDef<RegulatoryApproval>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Approval ID'),
        cell: ({ row }) => {
            const approval = row.original
            return h('div', { class: getCellClasses('right') },
                h(RegulatoryApprovalCard, {
                    approval,
                    size: 'micro'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'approvalType',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Type'),
        cell: ({ row }) => {
            const approvalType = row.getValue('approvalType') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: approvalType })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const statusVariant = getStatusVariant(status)
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status,
                    variant: statusVariant
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'authority',
        header: () => h('div', { class: getHeaderClasses() }, 'Authority'),
        cell: ({ row }) => {
            const authority = row.getValue('authority') as string
            const truncated = authority.length > 40 ? authority.substring(0, 40) + '...' : authority
            return h('div', { class: getCellClasses() + ' font-medium', title: authority }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'approvalDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Approval Date'),
        cell: ({ row }) => {
            const approvalDate = row.getValue('approvalDate') as string | null
            if (!approvalDate) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'Not set')
            }
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: approvalDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'expiryDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Expiry Date'),
        cell: ({ row }) => {
            const expiryDate = row.getValue('expiryDate') as string | null
            if (!expiryDate) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No expiry')
            }

            const isExpired = new Date(expiryDate) < new Date()
            const isExpiringSoon = new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

            return h('div', {
                class: getCellClasses('center') + (isExpired ? ' text-red-600' : isExpiringSoon ? ' text-orange-600' : '')
            },
                h(FieldDate, { date: expiryDate })
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
                    titleField: 'title',
                    subtitleField: 'description',
                    statusField: 'status',
                    colorScheme: 'blue'
                })
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
    })
]

// Helper function to determine status variant
function getStatusVariant(status: string): string {
    const statusVariants: Record<string, string> = {
        'Approved': 'success',
        'Pending': 'warning',
        'Rejected': 'error',
        'Expired': 'secondary',
        'Withdrawn': 'secondary'
    }

    return statusVariants[status] || 'default'
}

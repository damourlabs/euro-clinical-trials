import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { AuditLog } from '~/server/database/schema'
import {
    UuidField,
    StatusBadge
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const AUDIT_COLUMNS_SIMPLE: ColumnDef<AuditLog>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Audit ID'),
        cell: ({ row }) => {
            const audit = row.original
            return h('div', { class: getCellClasses('right') },
                h(UuidField, {
                    uuid: audit.uuid,
                    detailUrl: `/audits/${audit.uuid}`
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'action',
        header: () => h('div', { class: getHeaderClasses() }, 'Action'),
        cell: ({ row }) => {
            const action = row.getValue('action') as string
            return h('div', { class: getCellClasses() },
                h(StatusBadge, {
                    status: action,
                    variant: getActionVariant(action)
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'entityType',
        header: () => h('div', { class: getHeaderClasses() }, 'Entity Type'),
        cell: ({ row }) => {
            const entityType = row.getValue('entityType') as string
            return h('div', { class: getCellClasses() }, entityType)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'entityUuid',
        header: () => h('div', { class: getHeaderClasses() }, 'Entity ID'),
        cell: ({ row }) => {
            const entityUuid = row.getValue('entityUuid') as string
            return h('div', { class: getCellClasses() },
                entityUuid ? h(UuidField, { uuid: entityUuid }) : 'N/A'
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'userUuid',
        header: () => h('div', { class: getHeaderClasses() }, 'User'),
        cell: ({ row }) => {
            const userUuid = row.getValue('userUuid') as string
            return h('div', { class: getCellClasses() },
                userUuid ? h(UuidField, {
                    uuid: userUuid,
                    detailUrl: `/users/${userUuid}`
                }) : 'System'
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'timestamp',
        header: () => h('div', { class: getHeaderClasses() }, 'Timestamp'),
        cell: ({ row }) => {
            const timestamp = row.getValue('timestamp') as Date
            return h('div', { class: getCellClasses() },
                timestamp ? new Date(timestamp).toLocaleString() : 'N/A'
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'ipAddress',
        header: () => h('div', { class: getHeaderClasses() }, 'IP Address'),
        cell: ({ row }) => {
            const ipAddress = row.getValue('ipAddress') as string
            return h('div', { class: getCellClasses('center') }, ipAddress || 'N/A')
        },
    })
]

function getActionVariant(action: string): string {
    switch (action?.toLowerCase()) {
        case 'create':
            return 'success'
        case 'update':
            return 'warning'
        case 'delete':
            return 'destructive'
        case 'view':
            return 'default'
        default:
            return 'secondary'
    }
}

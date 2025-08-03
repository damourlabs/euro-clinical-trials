import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Protocol } from '~/server/database/schema'
import {
    GenericCompactCard,
    StatusBadge
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const PROTOCOL_COLUMNS_SIMPLE: ColumnDef<Protocol>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Protocol ID'),
        cell: ({ row }) => {
            const protocol = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<Protocol>, {
                    entityUuid: protocol.uuid,
                    entityType: 'protocol',
                    fetchFunction: () => Promise.resolve(protocol),
                    titleField: 'name',
                    subtitleField: 'description',
                    statusField: undefined,
                    colorScheme: 'purple'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'name',
        header: () => h('div', { class: getHeaderClasses() }, 'Name'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string
            return h('div', { class: getCellClasses() }, name)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            return h('div', { class: getCellClasses() },
                description && description.length > 50 ? `${description.substring(0, 50)}...` : description || 'N/A'
            )
        },
    }),

    // createResponsiveColumn({
    //     accessorKey: 'version',
    //     header: () => h('div', { class: getHeaderClasses() }, 'Version'),
    //     cell: ({ row }) => {
    //         const version = row.getValue('version') as string
    //         return h('div', { class: getCellClasses() }, version || 'N/A')
    //     },
    // }),

    // createResponsiveColumn({
    //     accessorKey: 'status',
    //     header: () => h('div', { class: getHeaderClasses() }, 'Status'),
    //     cell: ({ row }) => {
    //         const status = row.getValue('status') as string
    //         return h('div', { class: getCellClasses() },
    //             h(StatusBadge, {
    //                 status: status || 'Active',
    //                 variant: getStatusVariant(status)
    //             })
    //         )
    //     },
    // }),

    createResponsiveColumn({
        accessorKey: 'createdAt',
        header: () => h('div', { class: getHeaderClasses() }, 'Created'),
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as Date
            return h('div', { class: getCellClasses() },
                createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'updatedAt',
        header: () => h('div', { class: getHeaderClasses() }, 'Updated'),
        cell: ({ row }) => {
            const updatedAt = row.getValue('updatedAt') as Date
            return h('div', { class: getCellClasses() },
                updatedAt ? new Date(updatedAt).toLocaleDateString() : 'N/A'
            )
        },
    })
]

function getStatusVariant(status: string): string {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'success'
        case 'draft':
            return 'warning'
        case 'archived':
            return 'secondary'
        case 'inactive':
            return 'destructive'
        default:
            return 'default'
    }
}

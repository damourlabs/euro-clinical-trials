import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Protocol } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import GenericCompactCard from '~/components/common/field/GenericCompactCard.vue'

export const PROTOCOL_COLUMNS: ColumnDef<Protocol>[] = [
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
        header: () => h('div', { class: getHeaderClasses() }, 'Protocol Name'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string
            return h('div', { class: getCellClasses() + ' font-medium' }, name)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            if (!description || description.trim().length === 0) {
                return h('div', { class: getCellClasses() + ' text-gray-400' }, 'No description')
            }
            const truncated = description.length > 100 ? description.substring(0, 100) + '...' : description
            return h('div', { class: getCellClasses(), title: description }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'nameLength',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Name Length'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string
            const length = name?.length || 0
            const variant = length > 50 ? 'warning' : length > 100 ? 'error' : 'success'
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: `${length} chars`,
                    variant
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'descriptionLength',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Description Length'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            const length = description?.length || 0
            const variant = length < 50 ? 'warning' : length > 1000 ? 'info' : 'success'
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: `${length} chars`,
                    variant
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'wordCount',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Word Count'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            const wordCount = description ? description.trim().split(/\s+/).length : 0
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${wordCount} words`
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

// Removed the old getStatusVariant function as it's no longer needed
// since the protocol schema doesn't include version, status, or updatedAt fields

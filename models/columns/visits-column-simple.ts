import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Visit } from '~/server/database/schema'
import {
    GenericCompactCard,
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const VISIT_COLUMNS_SIMPLE: ColumnDef<Visit>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Visit ID'),
        cell: ({ row }) => {
            const visit = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<Visit>, {
                    entityUuid: visit.uuid,
                    entityType: 'visit',
                    fetchFunction: () => Promise.resolve(visit),
                    titleField: 'visitType',
                    subtitleField: 'visitDate',
                    statusField: 'status',
                    colorScheme: 'orange'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'visitType',
        header: () => h('div', { class: getHeaderClasses() }, 'Visit Type'),
        cell: ({ row }) => {
            const visitType = row.getValue('visitType') as string
            return h('div', { class: getCellClasses() }, visitType)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'visitDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Visit Date'),
        cell: ({ row }) => {
            const visitDate = row.getValue('visitDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: visitDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'notes',
        header: () => h('div', { class: getHeaderClasses() }, 'Notes'),
        cell: ({ row }) => {
            const notes = row.getValue('notes') as string | null
            if (!notes) return h('div', { class: getCellClasses() }, '-')
            const truncated = notes.length > 40 ? notes.substring(0, 40) + '...' : notes
            return h('div', { class: getCellClasses(), title: notes }, truncated)
        },
    })
]

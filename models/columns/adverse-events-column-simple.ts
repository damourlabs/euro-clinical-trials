import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { AdverseEvent } from '~/server/database/schema'
import {
    GenericCompactCard,
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const ADVERSE_EVENT_COLUMNS_SIMPLE: ColumnDef<AdverseEvent>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'AE ID'),
        cell: ({ row }) => {
            const adverseEvent = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<AdverseEvent>, {
                    entityUuid: adverseEvent.uuid,
                    entityType: 'adverse-event',
                    fetchFunction: () => Promise.resolve(adverseEvent),
                    titleField: 'outcome',
                    subtitleField: 'description',
                    statusField: 'severity',
                    colorScheme: 'red'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            const truncated = description.length > 50 ? description.substring(0, 50) + '...' : description
            return h('div', { class: getCellClasses(), title: description }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'severity',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Severity'),
        cell: ({ row }) => {
            const severity = row.getValue('severity') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: severity })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'outcome',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Outcome'),
        cell: ({ row }) => {
            const outcome = row.getValue('outcome') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: outcome })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'eventDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Event Date'),
        cell: ({ row }) => {
            const eventDate = row.getValue('eventDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: eventDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'relatedToTrial',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Related'),
        cell: ({ row }) => {
            const related = row.getValue('relatedToTrial') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: related ? 'Yes' : 'No' })
            )
        },
    })
]

import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Site } from '~/server/database/schema'
import {
    GenericCompactCard,
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const SITE_COLUMNS_SIMPLE: ColumnDef<Site>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Site ID'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<Site>, {
                    entityUuid: site.uuid,
                    entityType: 'site',
                    fetchFunction: () => Promise.resolve(site),
                    titleField: 'name',
                    subtitleField: 'address',
                    statusField: 'status',
                    colorScheme: 'green'
                }
                )
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'name',
        header: () => h('div', { class: getHeaderClasses() }, 'Site Name'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string
            return h('div', { class: getCellClasses() }, name)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'country',
        header: () => h('div', { class: getHeaderClasses() }, 'Country'),
        cell: ({ row }) => {
            const country = row.getValue('country') as string
            return h('div', { class: getCellClasses() }, country)
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
        accessorKey: 'dataSubmissionStatus',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Data Status'),
        cell: ({ row }) => {
            const dataStatus = row.getValue('dataSubmissionStatus') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: dataStatus })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'activationDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Activation Date'),
        cell: ({ row }) => {
            const activationDate = row.getValue('activationDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: activationDate })
            )
        },
    })
]

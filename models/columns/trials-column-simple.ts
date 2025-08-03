import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Trial } from '~/server/database/schema'
import {
    UuidField,
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const TRIAL_COLUMNS_SIMPLE: ColumnDef<Trial>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Trial ID'),
        cell: ({ row }) => {
            const trial = row.original
            return h('div', { class: getCellClasses('right') },
                h(UuidField, {
                    uuid: trial.uuid,
                    detailUrl: `/trials/${trial.uuid}`
                })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'title',
        header: () => h('div', { class: getHeaderClasses() }, 'Title'),
        cell: ({ row }) => {
            const title = row.getValue('title') as string
            return h('div', { class: getCellClasses() }, title)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'indication',
        header: () => h('div', { class: getHeaderClasses() }, 'Indication'),
        cell: ({ row }) => {
            const indication = row.getValue('indication') as string
            return h('div', { class: getCellClasses() }, indication)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'phase',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Phase'),
        cell: ({ row }) => {
            const phase = row.getValue('phase') as string
            return h('div', { class: getCellClasses('center') }, `Phase ${phase}`)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'startDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Start Date'),
        cell: ({ row }) => {
            const startDate = row.getValue('startDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: startDate })
            )
        }
    })
]

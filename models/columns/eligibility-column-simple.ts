import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { EligibilityCriteria } from '~/server/database/schema'
import {
    GenericCompactCard,
    StatusBadge
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const ELIGIBILITY_COLUMNS_SIMPLE: ColumnDef<EligibilityCriteria>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Criteria ID'),
        cell: ({ row }) => {
            const criteria = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<EligibilityCriteria>, {
                    entityUuid: criteria.uuid,
                    entityType: 'eligibility',
                    fetchFunction: () => Promise.resolve(criteria),
                    titleField: 'minAge',
                    subtitleField: 'maxAge',
                    statusField: 'sex',
                    colorScheme: 'teal'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'minAge',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Min Age'),
        cell: ({ row }) => {
            const minAge = row.getValue('minAge') as number
            return h('div', { class: getCellClasses('center') }, `${minAge}`)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'maxAge',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Max Age'),
        cell: ({ row }) => {
            const maxAge = row.getValue('maxAge') as number
            return h('div', { class: getCellClasses('center') }, `${maxAge}`)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'sex',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Sex'),
        cell: ({ row }) => {
            const sex = row.getValue('sex') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: sex })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'ageRange',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Age Range'),
        cell: ({ row }) => {
            const minAge = row.getValue('minAge') as number
            const maxAge = row.getValue('maxAge') as number
            return h('div', { class: getCellClasses('center') }, `${minAge}-${maxAge}`)
        },
    })
]

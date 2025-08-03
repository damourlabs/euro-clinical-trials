import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { EligibilityCriteria } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import EligibilityCard from '~/components/eligibility/EligibilityCard.vue'

async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

export const ELIGIBILITY_COLUMNS: ColumnDef<EligibilityCriteria>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Eligibility ID'),
        cell: ({ row }) => {
            const eligibility = row.original
            return h('div', { class: getCellClasses('right') },
                h(EligibilityCard, {
                    eligibility,
                    size: 'micro'
                })
            )
        },
        minWidth: 120,
        priority: 1
    }),

    createResponsiveColumn({
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const trialUuid = row.getValue('trialUuid') as string
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard, {
                    title: 'Trial',
                    fetchFunction: () => fetchTrial(trialUuid),
                    detailUrl: `/trials/${trialUuid}`,
                    displayProperty: 'title'
                })
            )
        },
        minWidth: 140,
        priority: 1
    }),

    createResponsiveColumn({
        accessorKey: 'minAge',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Min Age'),
        cell: ({ row }) => {
            const minAge = row.getValue('minAge') as number
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${minAge} years`
            )
        },
        minWidth: 100,
        priority: 1
    }),

    createResponsiveColumn({
        accessorKey: 'maxAge',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Max Age'),
        cell: ({ row }) => {
            const maxAge = row.getValue('maxAge') as number
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${maxAge} years`
            )
        },
        minWidth: 100,
        priority: 1
    }),

    createResponsiveColumn({
        accessorKey: 'ageRange',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Age Range'),
        cell: ({ row }) => {
            const minAge = row.getValue('minAge') as number
            const maxAge = row.getValue('maxAge') as number
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${minAge} - ${maxAge} years`
            )
        },
        minWidth: 120,
        priority: 2
    }),

    createResponsiveColumn({
        accessorKey: 'sex',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Sex'),
        cell: ({ row }) => {
            const sex = row.getValue('sex') as string
            const sexVariant = getSexVariant(sex)
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: sex,
                    variant: sexVariant
                })
            )
        },
        minWidth: 100,
        priority: 1
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
        minWidth: 140,
        priority: 3
    })
]

// Helper function to determine sex variant
function getSexVariant(sex: string): string {
    const sexVariants: Record<string, string> = {
        'Male': 'info',
        'Female': 'success',
        'All': 'default'
    }

    return sexVariants[sex] || 'default'
}

import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { EligibilityCriteria } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate
    // GenericCompactCard - TODO: Fix type mismatch before re-enabling
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import EligibilityCard from '~/components/eligibility/EligibilityCard.vue'

// TODO: Fix fetchTrial function when GenericCompactCard is re-enabled
/* async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
} */

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
        }
    }),

    createResponsiveColumn({
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const trialUuid = row.getValue('trialUuid') as string
            // TODO: Fix GenericCompactCard props type mismatch - missing required props: entityUuid, entityType, titleField, subtitleField
            return h('div', { class: getCellClasses('center') }, trialUuid)
            /* h(GenericCompactCard, {
                title: 'Trial',
                fetchFunction: () => fetchTrial(trialUuid),
                detailUrl: `/trials/${trialUuid}`,
                displayProperty: 'title'
            }) */
        }
    }),

    createResponsiveColumn({
        accessorKey: 'minAge',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Min Age'),
        cell: ({ row }) => {
            const minAge = row.getValue('minAge') as number
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${minAge} years`
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'maxAge',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Max Age'),
        cell: ({ row }) => {
            const maxAge = row.getValue('maxAge') as number
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${maxAge} years`
            )
        }
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
        }
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
        }
    }),

    createResponsiveColumn({
        accessorKey: 'createdAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Created'),
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: createdAt, showTime: true })
            )
        }
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

import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { GdprConsent } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import GenericCompactCard from '~/components/common/field/GenericCompactCard.vue'

export const GDPR_CONSENT_COLUMNS_SIMPLE: ColumnDef<GdprConsent>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Consent ID'),
        cell: ({ row }) => {
            const consent = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<GdprConsent>, {
                    entityUuid: consent.uuid,
                    entityType: 'gdpr-consent',
                    fetchFunction: () => Promise.resolve(consent),
                    titleField: 'consentStatus',
                    subtitleField: 'consentType',
                    statusField: 'consentStatus',
                    colorScheme: 'purple'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentType',
        header: () => h('div', { class: getHeaderClasses() }, 'Consent Type'),
        cell: ({ row }) => {
            const consentType = row.getValue('consentType') as string
            return h('div', { class: getCellClasses() }, consentType.replace(/_/g, ' '))
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentStatus',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const status = row.getValue('consentStatus') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentGiven',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Given'),
        cell: ({ row }) => {
            const consentGiven = row.getValue('consentGiven') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: consentGiven ? 'Yes' : 'No' })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Consent Date'),
        cell: ({ row }) => {
            const consentDate = row.getValue('consentDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: consentDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'legalBasis',
        header: () => h('div', { class: getHeaderClasses() }, 'Legal Basis'),
        cell: ({ row }) => {
            const legalBasis = row.getValue('legalBasis') as string
            return h('div', { class: getCellClasses('left') }, legalBasis.replace(/_/g, ' '))
        },
    })
]

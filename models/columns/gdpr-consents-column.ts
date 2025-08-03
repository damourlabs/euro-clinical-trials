import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { GdprConsent, Patient, Trial } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

async function fetchPatient(_uuid: string) {
    const patient = usePatientsStore().getById(_uuid)

    if (patient === undefined) {
        throw createError(`Patient with UUID ${_uuid} not found`)
    }

    return patient
}

export const GDPR_CONSENT_COLUMNS: ColumnDef<GdprConsent>[] = [
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
        accessorKey: 'consentStatus',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const consentStatus = row.getValue('consentStatus') as string
            const statusVariant = getConsentStatusVariant(consentStatus)
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: consentStatus,
                    variant: statusVariant
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentGiven',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Consent Given'),
        cell: ({ row }) => {
            const consentGiven = row.getValue('consentGiven') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: consentGiven ? 'Yes' : 'No',
                    variant: consentGiven ? 'success' : 'error'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentType',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Type'),
        cell: ({ row }) => {
            const consentType = row.getValue('consentType') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: consentType })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'legalBasis',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Legal Basis'),
        cell: ({ row }) => {
            const legalBasis = row.getValue('legalBasis') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: legalBasis })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'purpose',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Purpose'),
        cell: ({ row }) => {
            const purpose = row.getValue('purpose') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: purpose })
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
        accessorKey: 'withdrawalDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Withdrawal Date'),
        cell: ({ row }) => {
            const withdrawalDate = row.getValue('withdrawalDate') as string | null
            if (!withdrawalDate) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'Not withdrawn')
            }
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: withdrawalDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'retentionPeriod',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Retention'),
        cell: ({ row }) => {
            const retentionPeriod = row.getValue('retentionPeriod') as number
            return h('div', { class: getCellClasses('center') + ' font-medium' },
                `${retentionPeriod} years`
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'patientUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Patient'),
        cell: ({ row }) => {
            const patientUuid = row.getValue('patientUuid') as string
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Patient>, {
                    entityUuid: patientUuid,
                    entityType: 'patient',
                    fetchFunction: fetchPatient,
                    titleField: 'subjectId',
                    subtitleField: 'randomizationGroup',
                    statusField: 'status',
                    colorScheme: 'green'
                })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const trialUuid = row.getValue('trialUuid') as string
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Trial>, {
                    entityUuid: trialUuid,
                    entityType: 'trial',
                    fetchFunction: fetchTrial,
                    titleField: 'title',
                    subtitleField: 'indication',
                    statusField: 'status',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'withdrawalMethod',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Withdrawal Method'),
        cell: ({ row }) => {
            const withdrawalMethod = row.getValue('withdrawalMethod') as string | null
            if (!withdrawalMethod) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'None')
            }
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: withdrawalMethod })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'withdrawalReason',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Withdrawal Reason'),
        cell: ({ row }) => {
            const withdrawalReason = row.getValue('withdrawalReason') as string | null
            if (!withdrawalReason) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'None')
            }
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: withdrawalReason })
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
    }),

    createResponsiveColumn({
        accessorKey: 'updatedAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Updated'),
        cell: ({ row }) => {
            const updatedAt = row.getValue('updatedAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: updatedAt, showTime: true })
            )
        },
    })
]

// Helper function to determine consent status variant
function getConsentStatusVariant(status: string): string {
    const statusVariants: Record<string, string> = {
        'Consented': 'success',
        'NotConsented': 'warning',
        'Withdrawn': 'error',
        'Expired': 'secondary'
    }

    return statusVariants[status] || 'default'
}

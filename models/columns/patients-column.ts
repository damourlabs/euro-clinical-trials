import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Patient, Site, Trial } from '~/server/database/schema'
import PatientDataTableDropDown from '~/components/patient/PatientDataTableDropDown.vue'
import { PatientCard } from '~/components/patient'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import SimplePercentage from '~/components/common/field/SimplePercentage.vue'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

// Mock fetch functions - replace with actual API calls
async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

async function fetchSite(_uuid: string) {
    const site = useSitesStore().getById(_uuid)

    if (site === undefined) {
        throw createError(`Site with UUID ${_uuid} not found`)
    }

    return site
}


export const PATIENT_COLUMNS: ColumnDef<Patient>[] = [
    {
        accessorKey: 'patient',
        header: () => h('div', { class: getHeaderClasses('left') }, 'Patient UUID'),
        cell: ({ row }) => {
            const patient = row.original
            return h(PatientCard, {
                patient,
                size: 'micro'
            })
        },
    },
    {
        accessorKey: 'subjectId',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Subject ID'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('center') + ' font-medium' }, patient.subjectId)
        },
    },
    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: patient.status,
                    type: 'patient'
                })
            )
        }
    }, { hideOnMobile: true }),
    createResponsiveColumn({
        accessorKey: 'consentStatus',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Consent Status'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: patient.consentStatus,
                    type: 'gdpr-consent'
                })
            )
        }
    }, { hideOnTablet: true }),
    {
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const patient = row.original
            return h(GenericCompactCard<Trial>, {
                entityUuid: patient.trialUuid,
                entityType: 'trial',
                fetchFunction: fetchTrial,
                titleField: 'title',
                subtitleField: 'indication',
                statusField: 'status',
                colorScheme: 'blue'
            })
        }
    },
    createResponsiveColumn({
        accessorKey: 'siteUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Site'),
        cell: ({ row }) => {
            const patient = row.original
            return h(GenericCompactCard<Site>, {
                entityUuid: patient.siteUuid,
                entityType: 'site',
                fetchFunction: fetchSite,
                titleField: 'name',
                subtitleField: 'address',
                statusField: 'status',
                colorScheme: 'green'
            })
        }
    }, { hideOnMobile: true }),
    {
        accessorKey: 'dataCompleteness',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Data Completeness'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('right') },
                h(SimplePercentage, {
                    value: patient.dataCompleteness,
                    align: 'right'
                })
            )
        }
    },
    createResponsiveColumn({
        accessorKey: 'enrollmentDate',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Enrollment Date'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('right') },
                h(FieldDate, {
                    date: patient.enrollmentDate,
                    format: 'short',
                    align: 'right'
                })
            )
        }
    }, { hideOnMobile: true }),
    createResponsiveColumn({
        accessorKey: 'randomizationGroup',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Randomization Group'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('center') }, patient.randomizationGroup)
        }
    }, { hideOnTablet: true }),
    createResponsiveColumn({
        accessorKey: 'withdrawalDate',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Withdrawal Date'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('right') },
                h(FieldDate, {
                    date: patient.withdrawalDate,
                    format: 'short',
                    align: 'right'
                })
            )
        }
    }, { hideOnTablet: true }),
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const patient = row.original
            return h(PatientDataTableDropDown, { patientId: patient.uuid })
        }
    }
]

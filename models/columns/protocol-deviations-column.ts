import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { ProtocolDeviation, Trial, Patient, Site } from '~/server/database/schema'
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

async function fetchSite(_uuid: string) {
    const site = useSitesStore().getById(_uuid)

    if (site === undefined) {
        throw createError(`Site with UUID ${_uuid} not found`)
    }

    return site
}

export const PROTOCOL_DEVIATION_COLUMNS: ColumnDef<ProtocolDeviation>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Deviation ID'),
        cell: ({ row }) => {
            const deviation = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<ProtocolDeviation>, {
                    entityUuid: deviation.uuid,
                    entityType: 'protocol-deviation',
                    fetchFunction: () => Promise.resolve(deviation),
                    titleField: 'dateOccurred',
                    subtitleField: 'description',
                    statusField: 'severity',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            const truncated = description.length > 80 ? description.substring(0, 80) + '...' : description
            return h('div', { class: getCellClasses() + ' font-medium', title: description }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'severity',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Severity'),
        cell: ({ row }) => {
            const severity = row.getValue('severity') as string
            const severityVariant = getSeverityVariant(severity)
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: severity,
                    variant: severityVariant
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'dateOccurred',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Date Occurred'),
        cell: ({ row }) => {
            const dateOccurred = row.getValue('dateOccurred') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: dateOccurred })
            )
        },
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
                    subtitleField: 'description',
                    statusField: 'status',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'patientUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Patient'),
        cell: ({ row }) => {
            const patientUuid = row.getValue('patientUuid') as string | null
            if (!patientUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No patient')
            }
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Patient>, {
                    entityUuid: patientUuid,
                    entityType: 'patient',
                    fetchFunction: fetchPatient,
                    titleField: 'subjectId',
                    subtitleField: 'uuid',
                    statusField: 'status',
                    colorScheme: 'green'

                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'siteUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Site'),
        cell: ({ row }) => {
            const siteUuid = row.getValue('siteUuid') as string | null
            if (!siteUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No site')
            }
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Site>, {
                    entityUuid: siteUuid,
                    entityType: 'site',
                    fetchFunction: fetchSite,
                    titleField: 'name',
                    subtitleField: 'address',
                    statusField: 'status',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'impactAssessment',
        header: () => h('div', { class: getHeaderClasses() }, 'Impact Assessment'),
        cell: ({ row }) => {
            const impactAssessment = row.getValue('impactAssessment') as string | null
            if (!impactAssessment || impactAssessment.trim().length === 0) {
                return h('div', { class: getCellClasses() + ' text-gray-400' }, 'Not assessed')
            }
            const truncated = impactAssessment.length > 60 ? impactAssessment.substring(0, 60) + '...' : impactAssessment
            return h('div', { class: getCellClasses(), title: impactAssessment }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'correctiveAction',
        header: () => h('div', { class: getHeaderClasses() }, 'Corrective Action'),
        cell: ({ row }) => {
            const correctiveAction = row.getValue('correctiveAction') as string | null
            if (!correctiveAction || correctiveAction.trim().length === 0) {
                return h('div', { class: getCellClasses() + ' text-gray-400' }, 'No action taken')
            }
            const truncated = correctiveAction.length > 60 ? correctiveAction.substring(0, 60) + '...' : correctiveAction
            return h('div', { class: getCellClasses(), title: correctiveAction }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'reportedAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Reported'),
        cell: ({ row }) => {
            const reportedAt = row.getValue('reportedAt') as string | null
            if (!reportedAt) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'Not reported')
            }
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: reportedAt, showTime: true })
            )
        },
    })
]

// Helper function to determine severity variant
function getSeverityVariant(severity: string): string {
    const severityVariants: Record<string, string> = {
        'Mild': 'success',
        'Moderate': 'warning',
        'Severe': 'error',
        'Minor': 'info',
        'Major': 'warning',
        'Critical': 'error'
    }

    return severityVariants[severity] || 'default'
}

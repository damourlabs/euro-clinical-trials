import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Patient, Site, Visit } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import VisitCard from '~/components/visit/VisitCard.vue'

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

export const VISIT_COLUMNS: ColumnDef<Visit>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Visit ID'),
        cell: ({ row }) => {
            const visit = row.original
            return h('div', { class: getCellClasses('right') },
                h(VisitCard, {
                    visit,
                    size: 'micro'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'visitType',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Visit Type'),
        cell: ({ row }) => {
            const visitType = row.getValue('visitType') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: visitType })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const statusVariant = getVisitStatusVariant(status)
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status,
                    variant: statusVariant
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'visitDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Visit Date'),
        cell: ({ row }) => {
            const visitDate = row.getValue('visitDate') as string
            const isUpcoming = new Date(visitDate) > new Date()
            const isPast = new Date(visitDate) < new Date()
            const isToday = new Date(visitDate).toDateString() === new Date().toDateString()

            return h('div', {
                class: getCellClasses('center') +
                    (isToday ? ' text-blue-600 font-semibold' :
                        isUpcoming ? ' text-green-600' :
                            isPast ? ' text-gray-600' : '')
            },
                h(FieldDate, { date: visitDate })
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
                    subtitleField: 'uuid',
                    statusField: 'status',
                    colorScheme: 'green',
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'siteUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Site'),
        cell: ({ row }) => {
            const siteUuid = row.getValue('siteUuid') as string
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
        accessorKey: 'notes',
        header: () => h('div', { class: getHeaderClasses() }, 'Notes'),
        cell: ({ row }) => {
            const notes = row.getValue('notes') as string | null
            if (!notes || notes.trim().length === 0) {
                return h('div', { class: getCellClasses() + ' text-gray-400' }, 'No notes')
            }
            const truncated = notes.length > 60 ? notes.substring(0, 60) + '...' : notes
            return h('div', { class: getCellClasses(), title: notes }, truncated)
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

// Helper function to determine visit status variant
function getVisitStatusVariant(status: string): string {
    const statusVariants: Record<string, string> = {
        'Scheduled': 'info',
        'Completed': 'success',
        'Cancelled': 'error',
        'NoShow': 'warning',
        'InProgress': 'info',
        'Rescheduled': 'warning'
    }

    return statusVariants[status] || 'default'
}

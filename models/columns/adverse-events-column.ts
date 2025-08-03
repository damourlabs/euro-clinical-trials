import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { AdverseEvent, Patient } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'
import AdverseEventCard from '~/components/adverse-event/AdverseEventCard.vue'
import GenericCompactCard from '~/components/common/field/GenericCompactCard.vue'

async function fetchPatient(_uuid: string) {
    const patient = usePatientsStore().getById(_uuid)

    if (patient === undefined) {
        throw createError(`Patient with UUID ${_uuid} not found`)
    }

    return patient
}

export const ADVERSE_EVENT_COLUMNS: ColumnDef<AdverseEvent>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'AE ID'),
        cell: ({ row }) => {
            const adverseEvent = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<AdverseEvent>, {
                    entityUuid: adverseEvent.uuid,
                    entityType: 'adverse-event',
                    fetchFunction: () => Promise.resolve(adverseEvent),
                    titleField: 'severity',
                    subtitleField: 'description',
                    statusField: 'severity',
                    colorScheme: 'red'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            const truncated = description.length > 50 ? description.substring(0, 50) + '...' : description
            return h('div', { class: getCellClasses(), title: description }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'severity',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Severity'),
        cell: ({ row }) => {
            const severity = row.getValue('severity') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: severity })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'outcome',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Outcome'),
        cell: ({ row }) => {
            const outcome = row.getValue('outcome') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: outcome })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'eventDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Event Date'),
        cell: ({ row }) => {
            const eventDate = row.getValue('eventDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: eventDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'relatedToTrial',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Related'),
        cell: ({ row }) => {
            const related = row.getValue('relatedToTrial') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: related ? 'Yes' : 'No' })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'reportedAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Reported'),
        cell: ({ row }) => {
            const reportedAt = row.getValue('reportedAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: reportedAt, showTime: true })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'resolvedAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Resolved'),
        cell: ({ row }) => {
            const resolvedAt = row.getValue('resolvedAt') as string | null
            return h('div', { class: getCellClasses('center') },
                resolvedAt ? h(FieldDate, { date: resolvedAt, showTime: true }) : h('span', { class: 'text-gray-400' }, 'Not resolved')
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

import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Patient } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const PATIENT_COLUMNS_SIMPLE: ColumnDef<Patient>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Patient ID'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<Patient>, {
                    entityUuid: patient.uuid,
                    entityType: 'patient',
                    fetchFunction: () => Promise.resolve(patient),
                    titleField: 'subjectId',
                    subtitleField: 'status',
                    statusField: 'status',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'subjectId',
        header: () => h('div', { class: getHeaderClasses() }, 'Subject ID'),
        cell: ({ row }) => {
            const subjectId = row.getValue('subjectId') as string
            return h('div', { class: getCellClasses() }, subjectId)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'consentStatus',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Consent'),
        cell: ({ row }) => {
            const consentStatus = row.getValue('consentStatus') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: consentStatus })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'enrollmentDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Enrollment'),
        cell: ({ row }) => {
            const enrollmentDate = row.getValue('enrollmentDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: enrollmentDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'randomizationDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Randomization'),
        cell: ({ row }) => {
            const randomizationDate = row.getValue('randomizationDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: randomizationDate })
            )
        },
    })
]

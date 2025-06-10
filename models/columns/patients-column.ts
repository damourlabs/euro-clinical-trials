import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Patient } from '~/models/patients'
import PatientDataTableDropDown from '~/components/patient/PatientDataTableDropDown.vue'

export const PATIENT_COLUMNS: ColumnDef<Patient>[] = [
    {
        accessorKey: 'id',
        header: () => h('div', { class: 'text-right' }, 'Patient ID'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: 'text-right' }, patient.id)
        },
    },
    {
        accessorKey: 'status',
        header: () => h('div', { class: 'text-center' }, 'Status'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: 'text-center' }, patient.status)
        }
    },
    {
        accessorKey: 'trialId',
        header: () => h('div', { class: 'text-center' }, 'Trial ID'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: 'text-center' }, patient.trialId)
        }
    },
    {
        accessorKey: 'enrollmentDate',
        header: () => h('div', { class: 'text-right' }, 'Enrollment Date'),
        cell: ({ row }) => {
            const patient = row.original
            return h('div', { class: 'text-right' }, patient.enrollmentDate)
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const patient = row.original
            return h(PatientDataTableDropDown, { patientId: patient.id })
        }
    }

]

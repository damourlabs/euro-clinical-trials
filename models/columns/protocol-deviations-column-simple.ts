import type { ColumnDef } from '@tanstack/vue-table'
import type { ProtocolDeviation, Patient } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'

async function fetchPatient(_uuid: string) {
    const patient = usePatientsStore().getById(_uuid)

    if (patient === undefined) {
        throw createError(`Patient with UUID ${_uuid} not found`)
    }

    return patient
}

export const protocolDeviationsColumnSimple: ColumnDef<ProtocolDeviation>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Patient ID'),
        cell: ({ row }) => {
            const protocolDeviation = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<ProtocolDeviation>, {
                    entityUuid: protocolDeviation.uuid,
                    entityType: 'protocol-deviation',
                    fetchFunction: () => Promise.resolve(protocolDeviation),
                    titleField: 'patientUuid',
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
        }
    }),
    // Severity column
    createResponsiveColumn({
        accessorKey: 'severity',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Severity'),
        cell: ({ row }) => {
            const severity = row.getValue('severity') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: severity })
            )
        }
    }),
    // Date Occurred column
    createResponsiveColumn({
        accessorKey: 'dateOccurred',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Date Occurred'),
        cell: ({ row }) => {
            const dateOccurred = row.getValue('dateOccurred') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: dateOccurred })
            )
        }
    }),
    // Reported At column
    createResponsiveColumn({
        accessorKey: 'reportedAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Reported At'),
        cell: ({ row }) => {
            const reportedAt = row.getValue('reportedAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: reportedAt })
            )
        }
    }),
    // Patient UUID column
    createResponsiveColumn({
        accessorKey: 'patientUuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Patient UUID'),
        cell: ({ row }) => {
            const patientUuid = row.getValue('patientUuid') as string
            return h(GenericCompactCard<Patient>, {
                entityUuid: patientUuid,
                entityType: 'patient',
                fetchFunction: fetchPatient,
                titleField: 'subjectId',
                subtitleField: 'randomizationGroup',
                statusField: 'status',
                colorScheme: 'blue'
            })
        }
    }),
]

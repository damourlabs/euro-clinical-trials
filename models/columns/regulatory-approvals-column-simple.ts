import type { ColumnDef } from '@tanstack/vue-table'
import type { regulatoryApprovalsSchema } from '~/server/database/schema/regulatory'
import type { z } from 'zod'
import UuidField from '~/components/common/field/UuidField.vue'
import StatusBadge from '~/components/common/field/StatusBadge.vue'
import FieldDate from '~/components/common/field/FieldDate.vue'
import { formatTableHeader } from '~/utils/table-helpers'

type RegulatoryApproval = z.infer<typeof regulatoryApprovalsSchema>

export const regulatoryApprovalsColumnSimple: ColumnDef<RegulatoryApproval>[] = [
    {
        accessorKey: 'uuid',
        header: formatTableHeader('ID'),
        cell: ({ row }) => h(UuidField, { value: row.getValue('uuid') }),
    },
    {
        accessorKey: 'approvalType',
        header: formatTableHeader('Type'),
        cell: ({ row }) => h(StatusBadge, {
            status: row.getValue('approvalType'),
            variant: 'default'
        }),
    },
    {
        accessorKey: 'status',
        header: formatTableHeader('Status'),
        cell: ({ row }) => h(StatusBadge, {
            status: row.getValue('status'),
            variant: 'status'
        }),
    },
    {
        accessorKey: 'authority',
        header: formatTableHeader('Authority'),
    },
    {
        accessorKey: 'approvalDate',
        header: formatTableHeader('Approval Date'),
        cell: ({ row }) => h(FieldDate, { value: row.getValue('approvalDate') }),
    },
    {
        accessorKey: 'expiryDate',
        header: formatTableHeader('Expiry Date'),
        cell: ({ row }) => h(FieldDate, { value: row.getValue('expiryDate') }),
    },
]

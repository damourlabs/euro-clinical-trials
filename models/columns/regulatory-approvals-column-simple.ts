import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { regulatoryApprovalsSchema } from '~/server/database/schema/regulatory'
import type { z } from 'zod'
import StatusBadge from '~/components/common/field/StatusBadge.vue'
import FieldDate from '~/components/common/field/FieldDate.vue'
import { getHeaderClasses, getCellClasses } from '~/utils/table-helpers'
import RegulatoryApprovalCard from '~/components/regulatory-approval/RegulatoryApprovalCard.vue'

type RegulatoryApproval = z.infer<typeof regulatoryApprovalsSchema>

export const regulatoryApprovalsColumnSimple: ColumnDef<RegulatoryApproval>[] = [
    {
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses() }, 'ID'),
        cell: ({ row }) => h('div', { class: getCellClasses() },
            h(
                RegulatoryApprovalCard, {
                approval: row.original,
                size: 'micro',
                detailUrl: `/regulatory-approvals/${row.getValue('uuid')}`
            }
            )
        ),
    },
    {
        accessorKey: 'approvalType',
        header: () => h('div', { class: getHeaderClasses() }, 'Type'),
        cell: ({ row }) => h('div', { class: getCellClasses() },
            h(StatusBadge, {
                status: row.getValue('approvalType') as string,
                variant: 'default'
            })
        ),
    },
    {
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses() }, 'Status'),
        cell: ({ row }) => h('div', { class: getCellClasses() },
            h(StatusBadge, {
                status: row.getValue('status') as string,
                variant: 'status'
            })
        ),
    },
    {
        accessorKey: 'authority',
        header: () => h('div', { class: getHeaderClasses() }, 'Authority'),
        cell: ({ row }) => h('div', { class: getCellClasses() }, row.getValue('authority')),
    },
    {
        accessorKey: 'approvalDate',
        header: () => h('div', { class: getHeaderClasses() }, 'Approval Date'),
        cell: ({ row }) => h('div', { class: getCellClasses() },
            h(FieldDate, { value: row.getValue('approvalDate') })
        ),
    },
    {
        accessorKey: 'expiryDate',
        header: () => h('div', { class: getHeaderClasses() }, 'Expiry Date'),
        cell: ({ row }) => h('div', { class: getCellClasses() },
            h(FieldDate, { value: row.getValue('expiryDate') })
        ),
    },
]

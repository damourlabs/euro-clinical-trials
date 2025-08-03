import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '~/server/database/schema'
import {
    UuidField,
    StatusBadge
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const USER_COLUMNS_SIMPLE: ColumnDef<User>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'User ID'),
        cell: ({ row }) => {
            const user = row.original
            return h('div', { class: getCellClasses('right') },
                h(UuidField, {
                    uuid: user.uuid,
                    detailUrl: `/users/${user.uuid}`
                })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'name',
        header: () => h('div', { class: getHeaderClasses() }, 'Name'),
        cell: ({ row }) => {
            const name = row.getValue('name') as string
            return h('div', { class: getCellClasses() }, name)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'email',
        header: () => h('div', { class: getHeaderClasses() }, 'Email'),
        cell: ({ row }) => {
            const email = row.getValue('email') as string
            return h('div', { class: getCellClasses() }, email)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'role',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Role'),
        cell: ({ row }) => {
            const role = row.getValue('role') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: role })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'institution',
        header: () => h('div', { class: getHeaderClasses() }, 'Institution'),
        cell: ({ row }) => {
            const institution = row.getValue('institution') as string
            return h('div', { class: getCellClasses() }, institution)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'isActive',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') as boolean
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: isActive ? 'Active' : 'Inactive' })
            )
        }
    })
]

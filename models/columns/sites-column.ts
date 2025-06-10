import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Site } from '~/models/admin'
import { SiteDataTableDropDown } from '~/components/site'

export const SITE_COLUMNS: ColumnDef<Site>[] = [
    {
        accessorKey: 'id',
        header: () => h('div', { class: 'text-right' }, 'Site ID'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: 'text-right' }, site.id)
        },
    },
    {
        accessorKey: 'name',
        header: () => h('div', { class: 'text-center' }, 'Site Name'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: 'text-center' }, site.name)
        }
    },
    {
        accessorKey: 'location',
        header: () => h('div', { class: 'text-center' }, 'Location'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: 'text-center' }, site.address)
        }
    },
    {
        accessorKey: 'patientsEnrolled',
        header: () => h('div', { class: 'text-center' }, 'Patients Enrolled'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: 'text-center' }, site.patientsEnrolled)
        }
    },
    {
        accessorKey: 'status',
        header: () => h('div', { class: 'text-center' }, 'Status'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: 'text-center' }, site.status)
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const site = row.original
            return h(SiteDataTableDropDown, { siteId: site.id })
        }
    }

]

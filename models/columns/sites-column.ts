import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { User, Trial, Site } from '~/server/database/schema';
import { SiteDataTableDropDown } from '~/components/site'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import SimplePercentage from '~/components/common/field/SimplePercentage.vue'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

// Mock fetch functions - replace with actual API calls
async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

async function fetchUser(_uuid: string) {
    const user = useUsersStore().getById(_uuid)

    if (user === undefined) {
        throw createError(`User with UUID ${_uuid} not found`)
    }

    return user
}

export const SITE_COLUMNS: ColumnDef<Site>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Site UUID'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<Site>, {
                    entityUuid: site.uuid,
                    entityType: 'site',
                    fetchFunction: () => Promise.resolve(site),
                    titleField: 'name',
                    subtitleField: 'address',
                    statusField: 'status',
                    colorScheme: 'green'
                })
            )
        },
    }, { hideOnMobile: true }),
    {
        accessorKey: 'name',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Site Name'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('center') + ' font-medium' }, site.name)
        }
    },
    {
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const site = row.original
            return h(GenericCompactCard<Trial>, {
                entityUuid: site.trialUuid,
                entityType: 'trial',
                fetchFunction: fetchTrial,
                titleField: 'title',
                subtitleField: 'indication',
                statusField: 'status',
                colorScheme: 'blue'
            })
        }
    },
    createResponsiveColumn({
        accessorKey: 'address',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Location'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('center') }, site.address)
        }
    }, { hideOnMobile: true }),
    {
        accessorKey: 'patientsEnrolled',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Patients Enrolled'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('center') + ' font-medium' }, site.patientsEnrolled)
        }
    },
    {
        accessorKey: 'dataCompleteness',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Data Completeness'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('right') },
                h(SimplePercentage, {
                    value: site.dataCompleteness,
                    align: 'right'
                })
            )
        }
    },
    createResponsiveColumn({
        accessorKey: 'status',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, {
                    status: site.status,
                    type: 'site'
                })
            )
        }
    }, { hideOnMobile: true }),
    createResponsiveColumn({
        accessorKey: 'activationDate',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Activation Date'),
        cell: ({ row }) => {
            const site = row.original
            return h('div', { class: getCellClasses('right') },
                h(FieldDate, {
                    date: site.activationDate,
                    format: 'short',
                    align: 'right'
                })
            )
        }
    }, { hideOnTablet: true }),
    createResponsiveColumn({
        accessorKey: 'contactPersonUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Contact Person'),
        cell: ({ row }) => {
            const site = row.original
            if (!site.contactPersonUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-500' }, 'N/A')
            }
            return h(GenericCompactCard<User>, {
                entityUuid: site.contactPersonUuid,
                entityType: 'user',
                fetchFunction: fetchUser,
                titleField: 'name',
                subtitleField: 'email',
                statusField: 'role',
                colorScheme: 'purple'
            })
        },
        enableHiding: true,
        meta: { defaultHidden: true }
    }, { hideOnMobile: true }),
    createResponsiveColumn({
        accessorKey: 'principalInvestigatorUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Principal Investigator'),
        cell: ({ row }) => {
            const site = row.original
            if (!site.principalInvestigatorUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-500' }, 'N/A')
            }
            return h(GenericCompactCard<User>, {
                entityUuid: site.principalInvestigatorUuid,
                entityType: 'user',
                fetchFunction: fetchUser,
                titleField: 'name',
                subtitleField: 'email',
                statusField: 'role',
                colorScheme: 'orange'
            })
        },
        enableHiding: true,
        meta: { defaultHidden: true }
    }, { hideOnMobile: true }),
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const site = row.original
            return h(SiteDataTableDropDown, { siteId: site.uuid })
        }
    }
]

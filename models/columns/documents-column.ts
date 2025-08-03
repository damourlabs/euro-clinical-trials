import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Document, Site, Trial, User } from '~/server/database/schema'
import {
    StatusBadge,
    FieldDate,
    GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'


async function fetchUploadedBy(_uuid: string) {
    const user = useUsersStore().getById(_uuid)

    if (user === undefined) {
        throw createError(`User with UUID ${_uuid} not found`)
    }

    return user
}

async function fetchTrial(_uuid: string) {
    const trial = useTrialsStore().getById(_uuid)

    if (trial === undefined) {
        throw createError(`Trial with UUID ${_uuid} not found`)
    }

    return trial
}

async function fetchSite(_uuid: string) {
    const site = useSitesStore().getById(_uuid)

    if (site === undefined) {
        throw createError(`Site with UUID ${_uuid} not found`)
    }

    return site
}

export const DOCUMENT_COLUMNS: ColumnDef<Document>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Document UUID'),
        cell: ({ row }) => {
            const document = row.original
            return h('div', { class: getCellClasses('right') },
                h(GenericCompactCard<Document>, {
                    entityUuid: document.uuid,
                    entityType: 'document',
                    fetchFunction: () => Promise.resolve(document),
                    titleField: 'title',
                    subtitleField: 'description',
                    statusField: 'documentType',
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'title',
        header: () => h('div', { class: getHeaderClasses() }, 'Title'),
        cell: ({ row }) => {
            const title = row.getValue('title') as string
            const truncated = title.length > 60 ? title.substring(0, 60) + '...' : title
            return h('div', { class: getCellClasses() + ' font-medium', title }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'documentType',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Type'),
        cell: ({ row }) => {
            const documentType = row.getValue('documentType') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: documentType })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string | null
            if (!description) {
                return h('div', { class: getCellClasses() + ' text-gray-400' }, 'No description')
            }
            const truncated = description.length > 80 ? description.substring(0, 80) + '...' : description
            return h('div', { class: getCellClasses(), title: description }, truncated)
        },
    }),

    createResponsiveColumn({
        accessorKey: 'url',
        header: () => h('div', { class: getHeaderClasses('center') }, 'URL'),
        cell: ({ row }) => {
            const url = row.getValue('url') as string
            const displayUrl = url.length > 30 ? url.substring(0, 30) + '...' : url
            return h('div', { class: getCellClasses('center') },
                h('a', {
                    href: url,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'text-blue-600 hover:text-blue-800 underline',
                    title: url
                }, displayUrl)
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'uploadDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Upload Date'),
        cell: ({ row }) => {
            const uploadDate = row.getValue('uploadDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: uploadDate })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'uploadedBy',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Uploaded By'),
        cell: ({ row }) => {
            const uploadedBy = row.getValue('uploadedBy') as string
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<User>, {
                    entityUuid: uploadedBy,
                    entityType: 'user',
                    fetchFunction: fetchUploadedBy,
                    titleField: 'name',
                    subtitleField: 'email',
                    statusField: 'role',
                    colorScheme: 'purple',
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'trialUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Trial'),
        cell: ({ row }) => {
            const trialUuid = row.getValue('trialUuid') as string | null
            if (!trialUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No trial')
            }
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Trial>, {
                    entityUuid: trialUuid,
                    entityType: 'trial',
                    fetchFunction: fetchTrial,
                    titleField: 'title',
                    subtitleField: 'indication',
                    statusField: 'status',
                    colorScheme: 'blue'
                })
            )
        },
    }),

    createResponsiveColumn({
        accessorKey: 'siteUuid',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Site'),
        cell: ({ row }) => {
            const siteUuid = row.getValue('siteUuid') as string | null
            if (!siteUuid) {
                return h('div', { class: getCellClasses('center') + ' text-gray-400' }, 'No site')
            }
            return h('div', { class: getCellClasses('center') },
                h(GenericCompactCard<Site>, {
                    entityUuid: siteUuid,
                    entityType: 'trial',
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
        accessorKey: 'createdAt',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Created'),
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: createdAt, showTime: true })
            )
        },
    })
]

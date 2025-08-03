import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Document } from '~/server/database/schema'
import {
    UuidField,
    StatusBadge,
    FieldDate
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

export const DOCUMENT_COLUMNS_SIMPLE: ColumnDef<Document>[] = [
    createResponsiveColumn({
        accessorKey: 'uuid',
        header: () => h('div', { class: getHeaderClasses('right') }, 'Doc ID'),
        cell: ({ row }) => {
            const document = row.original
            return h('div', { class: getCellClasses('right') },
                h(UuidField, {
                    uuid: document.uuid,
                    detailUrl: `/documents/${document.uuid}`
                })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'title',
        header: () => h('div', { class: getHeaderClasses() }, 'Title'),
        cell: ({ row }) => {
            const title = row.getValue('title') as string
            const truncated = title.length > 40 ? title.substring(0, 40) + '...' : title
            return h('div', { class: getCellClasses(), title }, truncated)
        }
    }),

    createResponsiveColumn({
        accessorKey: 'documentType',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Type'),
        cell: ({ row }) => {
            const documentType = row.getValue('documentType') as string
            return h('div', { class: getCellClasses('center') },
                h(StatusBadge, { status: documentType })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'uploadDate',
        header: () => h('div', { class: getHeaderClasses('center') }, 'Upload Date'),
        cell: ({ row }) => {
            const uploadDate = row.getValue('uploadDate') as string
            return h('div', { class: getCellClasses('center') },
                h(FieldDate, { date: uploadDate })
            )
        }
    }),

    createResponsiveColumn({
        accessorKey: 'description',
        header: () => h('div', { class: getHeaderClasses() }, 'Description'),
        cell: ({ row }) => {
            const description = row.getValue('description') as string | null
            if (!description) return h('div', { class: getCellClasses() }, '-')
            const truncated = description.length > 50 ? description.substring(0, 50) + '...' : description
            return h('div', { class: getCellClasses(), title: description }, truncated)
        }
    })
]

import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Trial } from '~/server/database/schema'
import { TrialDataTableDropDown } from '~/components/trial'

export const TRIAL_COLUMNS: ColumnDef<Trial>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-right' }, 'Trial ID'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-right' }, trial.uuid)
    },
  },
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-left' }, 'Trial Title'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-left' }, trial.title)
    }
  },
  {
    accessorKey: 'phase',
    header: () => h('div', { class: 'text-center' }, 'Phase'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-center' }, trial.phase)
    }
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-center' }, 'Status'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-center' }, trial.status)
    }
  },
  {
    accessorKey: 'startDate',
    header: () => h('div', { class: 'text-right' }, 'Start Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-right' }, trial.startDate)
    }
  },
  {
    accessorKey: 'estimatedEndDate',
    header: () => h('div', { class: 'text-right' }, 'Estimated End Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-right' }, trial.estimatedEndDate)
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const trial = row.original

      return h('div', { class: 'relative' }, h(TrialDataTableDropDown, {
        trial,
      }))
    },
  },
]

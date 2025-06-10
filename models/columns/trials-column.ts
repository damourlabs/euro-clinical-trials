import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Trial } from '~/models/trials'
import { TrialDataTableDropDown } from '~/components/trial'

export const TRIAL_COLUMNS: ColumnDef<Trial>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-right' }, 'Trial ID'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-right' }, trial.id)
    },
  },
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-left' }, 'Trial Title'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-left' }, trial.basicInfo.title)
    }
  },
  {
    accessorKey: 'phase',
    header: () => h('div', { class: 'text-center' }, 'Phase'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-center' }, trial.basicInfo.phase)
    }
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-center' }, 'Status'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-center' }, trial.timeline.status)
    }
  },
  {
    accessorKey: 'startDate',
    header: () => h('div', { class: 'text-right' }, 'Start Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-right' }, trial.timeline.startDate)
    }
  },
  {
    accessorKey: 'estimatedEndDate',
    header: () => h('div', { class: 'text-right' }, 'Estimated End Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: 'text-right' }, trial.timeline.estimatedEndDate)
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

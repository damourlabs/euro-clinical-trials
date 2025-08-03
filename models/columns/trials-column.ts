import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Protocol, Trial, User } from '~/server/database/schema'
import { TrialDataTableDropDown } from '~/components/trial'
import {
  UuidField,
  StatusBadge,
  FieldDate,
  GenericCompactCard
} from '~/components/common/field'
import { getHeaderClasses, getCellClasses, createResponsiveColumn } from '~/utils/table-helpers'

async function fetchSponsor(_uuid: string) {
  const sponsor = useUsersStore().getById(_uuid)

  if (sponsor === undefined) {
    throw createError(`Sponsor with UUID ${_uuid} not found`)
  }

  return sponsor
}

async function fetchUser(_uuid: string) {
  const user = useUsersStore().getById(_uuid)

  if (user === undefined) {
    throw createError(`User with UUID ${_uuid} not found`)
  }

  return user
}

async function fetchProtocol(_uuid: string) {
  const protocol = useProtocolsStore().getById(_uuid)

  if (protocol === undefined) {
    throw createError(`Protocol with UUID ${_uuid} not found`)
  }

  return protocol
}

export const TRIAL_COLUMNS: ColumnDef<Trial>[] = [
  createResponsiveColumn({
    accessorKey: 'uuid',
    header: () => h('div', { class: getHeaderClasses('right') }, 'Trial UUID'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('right') },
        h(GenericCompactCard<Trial>, {
          entityUuid: trial.uuid,
          entityType: 'trial',
          fetchFunction: () => Promise.resolve(trial),
          titleField: 'title',
          subtitleField: 'description',
          statusField: 'status',
          colorScheme: 'blue'
        }
        )
      )
    },
  }, { hideOnMobile: true }),
  {
    accessorKey: 'title',
    header: () => h('div', { class: getHeaderClasses('left') }, 'Trial Title'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('left') + ' font-medium' }, trial.title)
    }
  },
  createResponsiveColumn({
    accessorKey: 'phase',
    header: () => h('div', { class: getHeaderClasses('center') }, 'Phase'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('center') + ' font-medium' }, trial.phase)
    }
  }, { hideOnMobile: true }),
  {
    accessorKey: 'status',
    header: () => h('div', { class: getHeaderClasses('center') }, 'Status'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('center') },
        h(StatusBadge, {
          status: trial.status,
          type: 'trial'
        })
      )
    }
  },
  createResponsiveColumn({
    accessorKey: 'indication',
    header: () => h('div', { class: getHeaderClasses('center') }, 'Indication'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('center') }, trial.indication)
    }
  }, { hideOnTablet: true }),
  createResponsiveColumn({
    accessorKey: 'startDate',
    header: () => h('div', { class: getHeaderClasses('right') }, 'Start Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('right') },
        h(FieldDate, {
          date: trial.startDate,
          format: 'short',
          align: 'right'
        })
      )
    }
  }, { hideOnMobile: true }),
  createResponsiveColumn({
    accessorKey: 'estimatedEndDate',
    header: () => h('div', { class: getHeaderClasses('right') }, 'Estimated End Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('right') },
        h(FieldDate, {
          date: trial.estimatedEndDate,
          format: 'short',
          align: 'right'
        })
      )
    }
  }, { hideOnTablet: true }),
  createResponsiveColumn({
    accessorKey: 'actualEndDate',
    header: () => h('div', { class: getHeaderClasses('right') }, 'Actual End Date'),
    cell: ({ row }) => {
      const trial = row.original
      return h('div', { class: getCellClasses('right') },
        h(FieldDate, {
          date: trial.actualEndDate,
          format: 'short',
          align: 'right'
        })
      )
    }
  }, { hideOnTablet: true }),
  createResponsiveColumn({
    accessorKey: 'sponsorUuid',
    header: () => h('div', { class: getHeaderClasses('center') }, 'Sponsor'),
    cell: ({ row }) => {
      const trial = row.original
      if (!trial.sponsorUuid) {
        return h('div', { class: getCellClasses('center') + ' text-gray-500' }, 'N/A')
      }
      return h(GenericCompactCard<User>, {

        entityUuid: trial.sponsorUuid,
        entityType: 'user',
        fetchFunction: fetchSponsor,
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
      const trial = row.original
      if (!trial.principalInvestigatorUuid) {
        return h('div', { class: getCellClasses('center') + ' text-gray-500' }, 'N/A')
      }
      return h(GenericCompactCard<User>, {
        entityUuid: trial.principalInvestigatorUuid,
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
  createResponsiveColumn({
    accessorKey: 'protocolUuid',
    header: () => h('div', { class: getHeaderClasses('center') }, 'Protocol'),
    cell: ({ row }) => {
      const trial = row.original
      if (!trial.protocolUuid) {
        return h('div', { class: getCellClasses('center') + ' text-gray-500' }, 'N/A')
      }
      return h(GenericCompactCard<Protocol>, {
        entityUuid: trial.protocolUuid,
        entityType: 'protocol',
        fetchFunction: fetchProtocol,
        titleField: 'name',
        subtitleField: 'description',
        statusField: undefined,
        colorScheme: 'blue'
      })
    },
    enableHiding: true,
    meta: { defaultHidden: true }
  }, { hideOnMobile: true }),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const trial = row.original

      return h('div', { class: 'relative' }, h(TrialDataTableDropDown, {
        trialId: trial.uuid,
      }))
    },
  },
]

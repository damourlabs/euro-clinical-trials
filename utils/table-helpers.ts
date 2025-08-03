import type { ColumnDef } from '@tanstack/vue-table'

export interface ResponsiveColumnConfig {
    hideOnMobile?: boolean
    hideOnTablet?: boolean
    mobileOrder?: number
}

export function createResponsiveColumn<T>(
    column: ColumnDef<T>,
    config: ResponsiveColumnConfig = {}
): ColumnDef<T> {
    const responsiveClasses = []

    if (config.hideOnMobile) {
        responsiveClasses.push('hidden', 'sm:table-cell')
    }

    if (config.hideOnTablet) {
        responsiveClasses.push('hidden', 'md:table-cell')
    }

    return {
        ...column,
        meta: {
            ...column.meta,
            responsive: config,
            className: responsiveClasses.join(' ')
        }
    }
}

export function createMobileFirstColumn<T>(
    column: ColumnDef<T>,
    mobileOrder: number = 0
): ColumnDef<T> {
    return {
        ...column,
        meta: {
            ...column.meta,
            mobileOrder,
            className: 'table-cell'
        }
    }
}

// Utility function to get column header classes based on alignment
export function getHeaderClasses(align: 'left' | 'center' | 'right' = 'left'): string {
    const baseClasses = 'font-medium text-gray-700'
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    return `${baseClasses} ${alignmentClasses[align]}`
}

// Utility function to get cell classes based on alignment
export function getCellClasses(align: 'left' | 'center' | 'right' = 'left'): string {
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    return alignmentClasses[align]
}

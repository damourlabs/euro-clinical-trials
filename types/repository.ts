// ~/types/repository.ts
export interface IRepository<T, TFilters = any> {
    findAll(filters?: TFilters): Promise<T[]>
    findById(id: string | number): Promise<T>
    create(item: Partial<T>): Promise<T>
    update(id: string | number, item: Partial<T>): Promise<T>
    delete(id: string | number): Promise<void>
}

export interface IPaginatedRepository<T, TFilters = any> extends IRepository<T, TFilters> {
    findWithPagination(filters?: TFilters): Promise<{
        items: T[]
        total: number
        page: number
        limit: number
    }>
}

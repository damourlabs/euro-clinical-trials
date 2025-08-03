// ~/repositories/CachedRepository.ts
import { BaseRepository, type Entity } from './BaseRepository'

export class CachedRepository<T extends Entity> extends BaseRepository<T> {
    private cache = new Map<string, { data: unknown; timestamp: number }>()
    private cacheTTL = 5 * 60 * 1000 // Default cache TTL of 5 minutes

    constructor(resource: string, cacheTTL?: number) {
        super(resource)
        if (cacheTTL) this.cacheTTL = cacheTTL
    }

    private getCacheKey(method: string, params?: Record<string, unknown>): string {
        return `${method}:${JSON.stringify(params || {})}`
    }

    override async delete(id: string | number): Promise<void> {
        // Invalidate the cache for all  methods that might be affected by the deletion
        this.clearCacheByPattern('findAll') // Invalidate findAll cache
        this.clearCacheByPattern('findById') // Invalidate findById cache
        this.clearCacheByPattern('create') // Invalidate create cache
        this.clearCacheByPattern('update') // Invalidate update cache    

        await super.delete(id)
    }

    override async create(item: Partial<T>): Promise<T> {
        const newItem = await super.create(item)

        // Invalidate the cache for findAll since a new item was created
        this.clearCacheByPattern('findAll')

        // Optionally, you can also cache the newly created item
        const cacheKey = this.getCacheKey('findById', { id: newItem.uuid })
        this.setCache(cacheKey, newItem)
        return newItem
    }

    override async update(id: string | number, item: Partial<T>): Promise<T> {
        const updatedItem = await super.update(id, item)

        // Invalidate the cache for findAll since an item was updated
        this.clearCacheByPattern('findAll')

        // Optionally, you can also cache the updated item
        const cacheKey = this.getCacheKey('findById', { id })
        this.setCache(cacheKey, updatedItem)
        return updatedItem
    }

    private isExpired(timestamp: number): boolean {
        return Date.now() - timestamp > this.cacheTTL
    }

    private getFromCache<R>(key: string): R | null {
        const cached = this.cache.get(key)
        if (!cached || this.isExpired(cached.timestamp)) {
            this.cache.delete(key)
            return null
        }
        return cached.data as R
    }

    private setCache(key: string, data: unknown): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        })
    }

    override async findAll(useCache = true): Promise<T[]> {
        const cacheKey = this.getCacheKey('findAll')

        if (useCache) {
            const cached = this.getFromCache<T[]>(cacheKey)
            if (cached) return cached
        }

        const data = await super.findAll()
        this.setCache(cacheKey, data)
        return data
    }

    override async findById(id: string | number, useCache = true): Promise<T> {
        const cacheKey = this.getCacheKey('findById', { id })
        if (useCache) {
            const cached = this.getFromCache<T>(cacheKey)
            if (cached) return cached
        }

        const data = await super.findById(id)
        this.setCache(cacheKey, data)
        return data
    }

    clearCache(): void {
        this.cache.clear()
    }

    clearCacheByPattern(pattern: string): void {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key)
            }
        }
    }
}

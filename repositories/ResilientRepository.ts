// ~/repositories/ResilientRepository.ts
import type { NuxtError } from '#app'
import type { Entity } from './BaseRepository'
import { CachedRepository } from './CachedRepository'

export class ResilientRepository<T extends Entity> extends CachedRepository<T> {
    private maxRetries = 3
    private retryDelay = 1000

    constructor(resource: string, options?: {
        maxRetries?: number
        retryDelay?: number
        cacheTTL?: number
    }) {
        super(resource, options?.cacheTTL)
        this.maxRetries = options?.maxRetries || 3
        this.retryDelay = options?.retryDelay || 1000
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private shouldRetry(error: NuxtError, attempt: number): boolean {
        if (attempt >= this.maxRetries) return false

        // Don't retry client errors (4xx) except for 429 (rate limit)
        if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
            return false
        }

        return true
    }

    private async executeWithRetry<R>(
        operation: () => Promise<R>,
        context: string
    ): Promise<R> {
        let lastError: NuxtError | Error | string | null = null

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await operation()
            } catch (error) {

                if (!isNuxtError(error)) {
                    return Promise.reject(createError({
                        statusCode: 500,
                        statusMessage: 'An unexpected error occurred',
                        message: `Failed to ${context} after ${attempt} attempts: ${String(error)}`
                    }))
                }

                lastError = error

                if (!this.shouldRetry(error, attempt)) {
                    throw createError({
                        statusCode: error.statusCode || 500,
                        statusMessage: error.statusMessage || 'An error occurred',
                        message: `Failed to ${context} after ${attempt} attempts: ${error.message}`
                    })
                }

                if (attempt < this.maxRetries) {
                    await this.sleep(this.retryDelay * attempt)
                }
            }
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'An unexpected error occurred',
            message: `Failed to ${context} after ${this.maxRetries} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`
        })
    }

    override async findAll(useCache = true): Promise<T[]> {
        return this.executeWithRetry(
            () => super.findAll(useCache),
            'findAll'
        )
    }

    override async findById(id: string | number, useCache = true): Promise<T> {
        return this.executeWithRetry(
            () => super.findById(id, useCache),
            `findById:${id}`
        )
    }

    override async create(item: Partial<T>): Promise<T> {
        return this.executeWithRetry(
            () => super.create(item),
            'create'
        )
    }

    override async update(id: string | number, item: Partial<T>): Promise<T> {
        return this.executeWithRetry(
            () => super.update(id, item),
            `update:${id}`
        )
    }

    override async delete(id: string | number): Promise<void> {
        return this.executeWithRetry(
            () => super.delete(id),
            `delete:${id}`
        )
    }
}

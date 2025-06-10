import type { ServerResponse } from "~/models/utils";
import type { BaseRepository, Entity } from "./BaseRepository";
import { CachedRepository } from "./CachedRepository";
import { ResilientRepository } from "./ResilientRepository";

export type REPOSITORY_TYPE = 'cached' | 'resilient';


export abstract class BaseRepositoryFilters {
    search: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';

    constructor(search: string = '', page: number = 1, limit: number = 10, sortBy: string = 'id', sortOrder: 'asc' | 'desc' = 'asc') {
        this.search = search;
        this.page = page;
        this.limit = limit;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
    }
}

export abstract class BasePaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;

    constructor(items: T[], total: number, page: number, limit: number) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}

export class ResourceRepository<T extends Entity> {
    private repository: BaseRepository<T>;
    private type: REPOSITORY_TYPE;

    constructor(resource: string, type: REPOSITORY_TYPE = 'cached') {
        // Initialize the repository with the resource name and type
        switch (type) {
            case 'cached':
                this.repository = new CachedRepository<T>(resource);
                this.type = 'cached';
                break;
            case 'resilient':
                this.repository = new ResilientRepository<T>(resource);
                this.type = 'resilient';
                break;
            default:
                this.repository = new CachedRepository<T>(resource);
                this.type = 'cached';
        }


    }

    get apiUrl(): string {
        // Expose the underlying API URL for custom methods
        return (this.repository as BaseRepository<T>).resource;
    }
    get resource(): string {
        // Expose the resource name for debugging and logging
        return (this.repository as BaseRepository<T>).resource;
    }

    // Delegate base methods to the underlying repository
    async findAll(): Promise<T[]> {
        return this.repository.findAll();
    }
    async findById(id: string | number): Promise<T> {
        return this.repository.findById(id);
    }
    async create(item: Partial<T>): Promise<T> {
        return this.repository.create(item);
    }
    async update(id: string | number, item: Partial<T>): Promise<T> {
        return this.repository.update(id, item);
    }
    async delete(id: string | number): Promise<void> {
        return this.repository.delete(id);
    }

    // Methods specific to paginated repositories
    async findWithFilters(filters: Partial<BaseRepositoryFilters> = {}): Promise<BasePaginatedResponse<T>> {
        const query = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value))
        })

        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<BasePaginatedResponse<T>>>(`${this.apiUrl}?${query}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return { items: [], total: 0, page: filters.page || 1, limit: filters.limit || 10 } // No items found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching patients: ${message || statusText}`
                    })
            }
        }

        return data
    }
}
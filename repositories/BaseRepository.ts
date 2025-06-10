import type { ServerResponse } from "~/models/utils"

export interface Entity {
    id: string | number
}


/**
 * BaseRepository is an abstract class that provides a set of methods for managing entities.
 * It includes methods for fetching, creating, updating, and deleting entities.
 * It is designed to be extended by specific repositories for different entity types.
 * * @template T - The type of the entity that this repository manages.
 */
export abstract class BaseRepository<T extends Entity> {
    protected apiUrl: string

    /**
     * Initializes the BaseRepository with the given resource name.
     * @param resource - The name of the resource to be managed by this repository.
     */
    // Constructor to initialize the API URL based on the resource name
    constructor(resource: string) {
        this.apiUrl = `/api/${resource}`
    }

    /**
     * Returns the resource URL for the repository.
     * This is useful for debugging and logging purposes.
     */
    get resource(): string {
        return this.apiUrl;
    }

    /**
     * Returns the type of the repository.
     * This is useful for debugging and logging purposes.
     */
    get type(): string {
        return this.constructor.name;
    }

    /**
     * Fetches all items from the repository.
     * @returns An array of items.
     * @throws {Error} If an error occurs during the fetch.
     */
    async findAll(): Promise<T[]> {
        console.log('Fetching all items from:', this.apiUrl)
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<T[]>>(this.apiUrl)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: statusText || 'An error occurred while fetching data',
                message: message || 'An error occurred while fetching data'
            })
        }
        return data
    }

    /**
     * Fetches an item by its ID.
     * @param id - The ID of the item to fetch.
     * @returns The fetched item.
     * @throws {Error} If the item is not found or if an error occurs during the fetch.
     */
    async findById(id: string | number): Promise<T> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<T>>(`${this.apiUrl}/${id}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    throw createError({
                        statusCode,
                        statusMessage: 'Resource not found'
                    })
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while fetching the resource',
                        message: message || 'An error occurred while fetching the resource'
                    })
            }
        }
        return data

    }

    /**
     * Creates a new item in the repository.
     * @param item - The item to create.
     * @returns The created item.
     * @throws {NuxtError} If an error occurs during the creation.
     */
    async create(item: Partial<T>): Promise<T> {
        console.log('Creating item:', item, "API URL:", this.apiUrl)

        // Generate a unique ID for the new item 
        const newItemId = crypto.randomUUID()
        item.id = newItemId;
        const url = `${this.apiUrl}/${newItemId}`

        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<T>>(url, {
            method: 'POST',
            body: item
        })
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: statusText || 'An error occurred while creating the resource',
                message: message || 'An error occurred while creating the resource'
            })
        }
        return data
    }

    /**
     * Updates an existing item in the repository.
     * @param id - The ID of the item to update.
     * @param item - The partial item data to update.
     * @returns The updated item.
     * @throws {NuxtError} If the item is not found or if an error occurs during the update.
     */
    async update(id: string | number, item: Partial<T>): Promise<T> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<T>>(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            body: item
        })
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    throw createError({
                        statusCode,
                        statusMessage: 'Resource not found'
                    })
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while updating the resource',
                        message: message || 'An error occurred while updating the resource'
                    })
            }
        }
        return data
    }

    /**
     * Deletes an item from the repository.
     * @param id - The ID of the item to delete.
     * @throws {NuxtError} If the item is not found or if an error occurs during the deletion.
     */
    async delete(id: string | number): Promise<void> {
        console.log(`FROM REPO Attempting to delete item with ID: ${id}`)
        const { status, statusCode, statusText, message } = await $fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE'
        })
        console.log(`Delete response status: ${status}, statusCode: ${statusCode}, statusText: ${statusText}, message: ${message}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    throw createError({
                        statusCode,
                        statusMessage: 'Resource not found'
                    })
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while deleting the resource',
                        message: message || 'An error occurred while deleting the resource'
                    })
            }
        }
    }
}

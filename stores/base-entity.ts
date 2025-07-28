// ~/stores/base-entity.ts
import { defineStore } from 'pinia';
import type { BaseRepositoryFilters, ResourceRepository } from '~/repositories/ResourceRepository';

interface Entity {
  uuid: string | number
}
export type EntityStore = ReturnType<typeof createEntityStore>;

export function createEntityStore<
  T extends Entity,
  R extends ResourceRepository<T>
>(
  storeName: string,
  repository: R
) {
  return defineStore(storeName, () => {
    const items = ref<T[]>();
    const loading = ref(false);
    const error = ref<string>();




    const isLoading = computed(() => loading)
    const hasError = computed(() => !!error)
    const isEmpty = computed(() => !loading && (!items.value || items.value.length === 0))
    const hasItems = computed(() => items.value ? items.value.length > 0 : false)

    const getById = async (id: string | number) => {
      loading.value = true
      error.value = undefined
      let response = undefined
      try {
        response = await repository.findById(id)
      } catch (err: unknown) {
        if (err instanceof Error) {
          error.value = err.message || 'Failed to fetch item'
        } else {
          error.value = 'An unknown error occurred'
        }
        throw error
      } finally {
        loading.value = false
      }

      return response
    }

    const fetchAll = async (filters?: BaseRepositoryFilters) => {
      loading.value = true
      error.value = undefined

      try {
        // Set filters in the repository if provided
        if (filters !== undefined) {
          const paginatedResponse = await repository.findWithFilters(filters)
          items.value = paginatedResponse.items
        } else {
          items.value = await repository.findAll()
        }
        console.log(`Fetched ${items.value.length} items from repository`)
      } catch (err: unknown) {
        console.error('HERE Error fetching items:', err)
        if (err instanceof Error) {
          error.value = err.message || 'Failed to fetch items'
        } else {
          error.value = 'An unknown error occurred'
        }
        throw error
      } finally {
        loading.value = false
      }
    }

    const fetchById = async (id: string | number) => {
      loading.value = true
      error.value = undefined

      try {
        const item = await repository.findById(id)
        if (!items.value) {
          throw createError('Items list is not initialized')
        }
        const index = items.value.findIndex((i: T) => i.uuid === id)

        if (index !== -1) {
          items.value[index] = item
        } else {
          items.value.push(item)
        }

        return item
      } catch (err: unknown) {
        if (err instanceof Error) {
          error.value = err.message || 'Failed to fetch item'
        } else {
          error.value = 'An unknown error occurred'
        }
        throw error
      } finally {
        loading.value = false
      }
    }

    const create = async (item: Partial<T>): Promise<T> => {
      loading.value = true
      error.value = undefined

      try {
        // Generate a unique ID
        item.uuid = crypto.randomUUID()

        const newItem = await repository.create(item)
        if (!items.value) {
          items.value = []
        }
        items.value.unshift(newItem)
        return newItem
      } catch (err: unknown) {
        if (err instanceof Error) {
          error.value = err.message || 'Failed to create item'
        } else {
          error.value = 'An unknown error occurred'
        }
        throw error
      } finally {
        loading.value = false
      }
    }

    const update = async (id: string | number, item: Partial<T>) => {
      loading.value = true
      error.value = undefined

      try {
        const updatedItem = await repository.update(id, item)
        if (!items.value) {
          throw createError('Items list is not initialized')
        }
        const index = items.value.findIndex((i: T) => i.uuid === id)

        if (index !== -1) {
          items.value[index] = updatedItem
        }

        return updatedItem
      } catch (err: unknown) {
        if (err instanceof Error) {
          error.value = err.message || 'Failed to update item'
        } else {
          error.value = 'An unknown error occurred'
        }
        throw error
      } finally {
        loading.value = false
      }
    }

    const remove = async (id: string | number) => {
      console.log(`Attempting to delete item with ID: ${id}`)
      loading.value = true
      error.value = undefined
      try {

        await repository.delete(id)

        if (!items.value) {
          throw createError('Items list is not initialized')
        }
        console.log(`Deleting item with ID: ${id}`)

        // Remove the item from the local items array
        items.value = items.value.filter((item: T) => item.uuid !== id)
        console.log(`Item with ID ${id} removed from local store`)
        console.log(`New items list:`, items.value)

        console.log(`Item with ID ${id} deleted successfully`)

      } catch (err: unknown) {
        if (err instanceof Error) {
          error.value = err.message || 'Failed to delete item'
          throw error
        }
      } finally {
        loading.value = false
      }
    }

    const clearError = () => {
      error.value = undefined
    }

    const reset = () => {
      items.value = []
      loading.value = false
      error.value = undefined
    }

    // We want to expose any custom methods from the repository
    const customMethods = getAllMethods(repository) as Omit<R, keyof ResourceRepository<T>>;

    return {
      items,
      loading,
      error,
      isLoading,
      hasError,
      isEmpty,
      hasItems,
      getById,
      customMethods,
      fetchAll,
      fetchById,
      create,
      update,
      remove,
      clearError,
      reset
    }
  })
}




export type MethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

// Base CRUD methods that should be excluded from custom methods
type BaseCrudMethods = 'findAll' | 'findById' | 'create' | 'update' | 'delete' | 'findWithFilters' | 'apiUrl' | 'resource';

// Get all method names except base CRUD methods
export type CustomMethodNames<T> = Exclude<MethodNames<T>, BaseCrudMethods>;

function getAllMethods<R extends ResourceRepository<Entity>>(classInstance: R): Record<string, (...args: unknown[]) => unknown> {
  const methods: Record<string, (...args: unknown[]) => unknown> = {};
  let currentPrototype = Object.getPrototypeOf(classInstance);

  // Base CRUD methods to exclude
  const baseMethods = new Set([
    'findAll', 'findById', 'create', 'update', 'delete', 'findWithFilters',
    'constructor', 'apiUrl', 'resource'
  ]);

  while (currentPrototype && currentPrototype !== Object.prototype) {
    const propertyNames = Object.getOwnPropertyNames(currentPrototype);

    for (const name of propertyNames) {
      if (
        !baseMethods.has(name) &&
        typeof classInstance[name as keyof R] === 'function' &&
        !(name in methods)
      ) {
        const method = classInstance[name as keyof R];
        if (typeof method === 'function') {
          methods[name] = method.bind(classInstance) as (...args: unknown[]) => unknown;
        }
      }
    }

    currentPrototype = Object.getPrototypeOf(currentPrototype);
  }

  return methods;
}

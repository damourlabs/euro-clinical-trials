import { useStorage } from "#imports"
import type { Trial } from "~/models/trials"
import type { ServerResponse } from "~/models/utils"

export default defineEventHandler(async (event) => {
    const trialsStorage = useStorage<Trial>('trials')

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required'
        })
    }
    const trial = await trialsStorage.getItem(id)
    if (!trial) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }


    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial retrieved successfully',
        data: trial
    }
    return response
})

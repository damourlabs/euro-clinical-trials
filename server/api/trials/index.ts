import { useStorage } from "#imports"
import type { Trial } from "~/models/trials"
import type { ServerResponse } from "~/models/utils";

export default defineEventHandler(async () => {
  const storage = useStorage<Trial>('trials')
  const trialIds = await storage.getKeys();

  if (!trialIds || trialIds.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No trials found'
    })
  }

  // Fetch all trials
  const trials = await Promise.all(trialIds.map(async (trialId) => {
    const trial = await storage.getItem(trialId)
    return trial
  }))

  const validTrials = trials.filter((trial): trial is Trial => trial !== null && trial !== undefined)
  if (validTrials.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No valid trials found'
    })
  }

  const response: ServerResponse<Trial[]> = {
    message: 'Trials fetched successfully',
    status: 'success',
    statusText: 'OK',
    statusCode: 200,
    data: validTrials
  }

  return response
})

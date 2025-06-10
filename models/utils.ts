import type { NuxtError } from '#app';
import { z } from 'zod';

export const RangeSchema = z.object({
    min: z.number().default(0).describe("Minimum value of the range, must be less than or equal to max"),
    max: z.number().default(100).describe("Maximum value of the range, must be greater than or equal to min"),
});
export type Range = z.infer<typeof RangeSchema>;


export type ServerResponse<T> = {
    data: T;
    status: 'success' | 'error';
    statusCode: number;
    statusText: string;
    message: string;
    error?: NuxtError;
};
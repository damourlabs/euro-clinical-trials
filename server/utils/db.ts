import { z } from 'zod';

// Unicode-aware string validation
export const createInternationalText = (minLength: number, maxLength: number, required: boolean = true) => {
    const base = z.string()
        .refine(val => {
            // Count Unicode code points, not bytes
            const codePoints = [...val].length;
            return codePoints >= minLength && codePoints <= maxLength;
        }, `Must be between ${minLength} and ${maxLength} characters`)
        .transform(val => val.trim().replace(/\s+/g, ' ')); // Normalize whitespace

    return required ? base.refine(val => val.length > 0, "Field is required") : base.optional();
};

// Name validation supporting international characters
export const internationalNameRegex = /^[\p{L}\p{M}\p{Zs}\p{Pd}'\u0027\u2019]+$/u;
export const validateInternationalName = z.string()
    .regex(internationalNameRegex, "Name contains invalid characters")
    .refine(val => [...val].length >= 1 && [...val].length <= 255, "Name length invalid");
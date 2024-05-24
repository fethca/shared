import { z } from 'zod'

export const booleanSchema = z
  .string()
  .toLowerCase()
  .transform((x) => x === 'true')
  .pipe(z.boolean())
  .optional()

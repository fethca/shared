import { z } from 'zod'

export const packageJsonSchema = z
  .object({
    name: z.string(),
    version: z.string(),
  })
  .passthrough()

export type IPackageJson = z.infer<typeof packageJsonSchema>

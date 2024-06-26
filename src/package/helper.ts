import { readFileSync } from 'fs'
import { resolve } from 'path'
import { IPackageJson, packageJsonSchema } from './zod.js'

export function extractPackageJson(): IPackageJson {
  const path = resolve(process.cwd(), 'package.json')
  const pckage = readFileSync(path, 'utf-8')
  const pjson = JSON.parse(pckage)
  return packageJsonSchema.parse(pjson)
}

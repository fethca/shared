import get from 'lodash.get'
import { FilterQuery, Model } from 'mongoose'
import { IMovie } from './zod.js'

export function formatNgrams(value: string | null): string[] {
  if (!value) return []
  const cleanValue = value
    .replace(/[^\p{L}\s\-|()']/gu, '')
    .replace(/[-:|!()@#$%^&*]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
  const ngrams: string[] = [...cleanValue.split(' ')]
  cleanValue.split(' ').map((word) => {
    for (let i = 3; i <= word.length; i++) {
      ngrams.push(word.substring(0, i).toLowerCase())
    }
  })
  return ngrams
}

export function slugTitle(title: string) {
  if (!title) return ''
  return title.replace(/[^a-zA-Z]/g, '').toLocaleLowerCase()
}

export async function getMax(Model: Model<IMovie>, property: string, filter?: FilterQuery<IMovie>): Promise<number> {
  const [movie] = await Model.find(filter || {})
    .sort({ [property]: -1 })
    .limit(1)

  if (!movie) return 0

  const keys = property.split('.')
  const key = keys.pop()
  const path = keys.join()
  const parent = get(movie, path)
  if (parent && Array.isArray(parent) && key) {
    const maxes = parent.map((value) => get(value, key)).sort((a, b) => a - b)
    return maxes.pop()
  }
  const max = get(movie, property)
  if (!max) throw new Error('No max for this key')
  return max
}

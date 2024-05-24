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

type maxKeys = 'tmdb.popularity' | 'senscritique.stats.ratingCount' | 'senscritique.stats.wishCount'

export async function getMax(Model: Model<IMovie>, property: maxKeys, filter?: FilterQuery<IMovie>) {
  const [movie] = await Model.find(filter || {})
    .sort({ [property]: -1 })
    .limit(1)
  return get(movie, property)
}

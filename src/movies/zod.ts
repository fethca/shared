import { DateTime } from 'luxon'
import { z } from 'zod'

export const actorSchemaFormat = z
  .object({
    name: z.string(),
    role: z.string().optional().nullable(),
    contact: z
      .object({
        picture: z.string(),
        id: z.number(),
      })
      .nullable(),
  })
  .transform(({ name, role, contact }) =>
    contact ? { actor: { name, picture: contact.picture, id: contact.id }, role } : null,
  )

export const actorSchema = z.object({
  actor: z.object({ name: z.string(), picture: z.string(), id: z.number() }),
  role: z.string().optional().nullable(),
})

export const actorsSchema = z
  .array(actorSchemaFormat)
  .transform((actors) => actors.filter((actor) => actor !== null))
  .nullable()
  .transform((value) => value || [])

export const directorSchemaFormat = z
  .object({
    name: z.string(),
    contact: z.object({
      picture: z.string(),
      id: z.number(),
    }),
  })
  .transform(({ name, contact }) => ({ name, picture: contact.picture, id: contact.id }))

export const directorSchema = z.object({
  name: z.string(),
  picture: z.string(),
  id: z.number(),
})

export const directorsSchema = z
  .array(directorSchemaFormat)
  .nullable()
  .transform((value) => value || [])

export const picturesSchema = z.object({
  backdrops: z.array(z.string()),
  posters: z.array(z.string()),
  screenshots: z.array(z.string()),
})

export const pollSchemaFormat = z
  .object({
    poll: z.object({ id: z.number(), cover: z.string(), label: z.string(), participationCount: z.number() }),
  })
  .transform(({ poll }) => ({
    id: poll.id,
    cover: poll.cover,
    name: poll.label,
    participationCount: poll.participationCount,
  }))

export const pollSchema = z.object({
  id: z.number(),
  cover: z.string().nullable(),
  name: z.string(),
  participationCount: z.number(),
})

export const pollsSchema = z
  .array(pollSchemaFormat)
  .nullable()
  .transform((value) => value || [])

export const statSchema = z.object({
  ratingCount: z.number(),
  recommendCount: z.number(),
  reviewCount: z.number(),
  wishCount: z.number(),
})

export const videoSchema = z.object({
  image: z.string().nullable(),
  provider: z.string(),
  type: z.string(),
  id: z.string(),
})

export const categorySchema = z
  .string()
  .nullable()
  .transform((value) => value || 'Film')

export const scMovieSchema = z.object({
  actors: actorsSchema,
  category: categorySchema,
  countries: z.array(z.object({ name: z.string() }).transform((val) => val.name)),
  dateRelease: z.string().nullable(),
  dateReleaseOriginal: z.string().nullable(),
  directors: directorsSchema,
  duration: z.number().nullable(),
  frenchReleaseDate: z.string().nullable(),
  genresInfos: z.array(z.object({ label: z.string() }).transform((val) => val.label)),
  id: z.number(),
  medias: z.object({ videos: z.array(videoSchema).nullable() }),
  originalTitle: z.string().nullable(),
  pictures: picturesSchema,
  polls: pollsSchema,
  rating: z.number().nullable(),
  slug: z.string(),
  stats: statSchema,
  synopsis: z.string(),
  title: z.string(),
  yearOfProduction: z.number().nullable(),
})

export type IMovieSC = z.infer<typeof scMovieSchema>

export type IRequestSC = { data: { searchProductExplorer: { items: IMovieSC[] } } }

export const tmdbSchemaFormat = z.object({
  cleanTitle: z.string(),
  digitalRelease: z.string().optional(),
  genres: z.array(z.string()),
  images: z.array(z.object({ remoteUrl: z.string() }).transform((val) => val.remoteUrl)),
  imdbId: z.string().optional(),
  inCinemas: z.string().optional(),
  originalLanguage: z.object({ id: z.number(), name: z.string() }),
  originalTitle: z.string(),
  physicalRelease: z.string().optional(),
  popularity: z.number(),
  ratings: z.record(z.string(), z.object({ votes: z.number(), value: z.number() })),
  runtime: z.number(),
  searchQuery: z.number().default(0),
  sortTitle: z.string(),
  studio: z.string(),
  title: z.string(),
  tmdbId: z.number(),
  year: z.number(),
})

export const tmbdbSchema = tmdbSchemaFormat.merge(z.object({ images: z.array(z.string()) }))

export type ITmdb = z.infer<typeof tmbdbSchema>

export const providerSchema = z.object({ id: z.string(), name: z.string(), url: z.string().optional() }).passthrough()

export type IProviders = z.infer<typeof providerSchema>

export const senscritiqueSchema = scMovieSchema.omit({ medias: true }).merge(
  z.object({
    actors: z.array(actorSchema),
    countries: z.array(z.string()),
    directors: z.array(directorSchema),
    genresInfos: z.array(z.string()),
    polls: z.array(pollSchema),
    videos: z.array(videoSchema).nullable().optional(),
    popularity: z.number(),
  }),
)

export const movieSchema = z.object({
  senscritique: senscritiqueSchema,
  tmdb: tmbdbSchema.optional(),
  providers: z.array(providerSchema).default([]),
  search: z.string().default(''),
  popularity: z.number().default(0),
  released: z.boolean().default(false),
  id: z.number(),
  updatedAt: z.date().optional(),
  opsDatas: z
    .object({
      lastJobDate: z.number(),
      lastUpdateDate: z.number(),
      unfound: z.boolean().default(false),
    })
    .default({ lastJobDate: DateTime.now().toMillis(), lastUpdateDate: DateTime.now().toMillis(), unfound: false }),
})

export type IActor = z.infer<typeof actorSchema>
export type IDirector = z.infer<typeof directorSchema>
export type IPoll = z.infer<typeof pollSchema>
export type IMovie = z.infer<typeof movieSchema>

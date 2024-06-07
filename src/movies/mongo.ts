import mongoose, { MongooseError, QueryOptions, Schema } from 'mongoose'
import { IActor, IDirector, IMovie, IPoll, movieSchema } from './zod.js'

export const ActorDBSchema = new Schema({
  id: { type: Number, index: true, unique: true },
  name: { type: String },
  picture: { type: String },
})

export const Actor = mongoose.model<IActor>('actor', ActorDBSchema)

export const DirectorDBSchema = new Schema({
  id: { type: Number, index: true, unique: true },
  name: { type: String },
  picture: { type: String },
})

export const Director = mongoose.model<IDirector>('director', DirectorDBSchema)

export const PollDBSchema = new Schema({
  cover: { type: String },
  id: { type: Number, index: true, unique: true },
  label: { type: String },
  participationCount: { type: Number, index: true },
})

export const Poll = mongoose.model<IPoll>('poll', PollDBSchema)

export const MovieDBSchema = new Schema(
  {
    id: { type: Number, index: true, unique: true },
    senscritique: {
      actors: [{ actor: { type: Number, ref: 'actor', index: true, unique: true }, role: { type: String } }],
      category: { type: String },
      countries: [{ type: String, index: true }],
      dateRelease: { type: String, index: true },
      dateReleaseOriginal: { type: String },
      directors: [{ type: Number, ref: 'director', index: true, unique: true }],
      duration: { type: Number, index: true },
      frenchReleaseDate: { type: String },
      genresInfos: [{ type: String, index: true }],
      id: { type: Number },
      originalTitle: { type: String },
      pictures: { backdrops: [{ type: String }], posters: [{ type: String }], screenshots: [{ type: String }] },
      polls: [{ type: Number, ref: 'poll', index: true, unique: true }],
      popularity: { type: Number },
      rating: { type: Number, index: true },
      slug: { type: String },
      stats: {
        ratingCount: { type: Number, index: true },
        recommendCount: { type: Number },
        reviewCount: { type: Number },
        wishCount: { type: Number, index: true },
      },
      synopsis: { type: String },
      title: { type: String },
      videos: [{ image: { type: String }, provider: { type: String }, type: { type: String }, id: { type: String } }],
      yearOfProduction: { type: Number },
    },
    tmdb: {
      title: { type: String },
      originalTitle: { type: String },
      originalLanguage: {
        id: { type: Number },
        name: { type: String },
      },
      sortTitle: { type: String },
      inCinemas: { type: String },
      physicalRelease: { type: String },
      digitalRelease: { type: String },
      year: { type: Number, index: true },
      studio: { type: String },
      cleanTitle: { type: String },
      tmdbId: { type: Number },
      imdbId: { type: String },
      genres: [{ type: String }],
      images: [{ type: String }],
      ratings: {
        imdb: {
          votes: { type: Number, index: true },
          value: { type: Number, index: true },
        },
        tmdb: {
          votes: { type: Number, index: true },
          value: { type: Number, index: true },
        },
        metacritic: {
          votes: { type: Number, index: true },
          value: { type: Number, index: true },
        },
        rottenTomatoes: {
          votes: { type: Number, index: true },
          value: { type: Number, index: true },
        },
      },
      runtime: { type: Number },
      popularity: { type: Number, index: true },
      searchQuery: { type: Number },
    },
    search: { type: String },
    providers: [
      {
        name: { type: String },
        url: { type: String },
        provider: { type: String, index: true },
        id: { type: String, index: true },
      },
    ],
    popularity: { type: Number, index: true },
    released: { type: Boolean, index: true },
    opsDatas: {
      lastJobDate: { type: Number },
      lastUpdateDate: { type: Number },
      unfound: { type: Boolean },
    },
  },
  { timestamps: true, strict: false },
)

MovieDBSchema.pre(['findOne', 'find'], function (next) {
  void this.populate([
    {
      path: 'senscritique.actors.actor',
      model: 'actor',
      localField: 'senscritique.actors.actor',
      foreignField: 'id',
    },
    {
      path: 'senscritique.directors',
      model: 'director',
      localField: 'senscritique.directors',
      foreignField: 'id',
    },
    {
      path: 'senscritique.polls',
      model: 'poll',
      localField: 'senscritique.polls',
      foreignField: 'id',
    },
  ])
  next()
})

MovieDBSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const document = this.getUpdate()

    const movie = movieSchema.parse(document)
    const { actors, directors, polls, ...senscritique } = movie.senscritique

    const upsertActors = actors.map(({ actor }) => formatUpsert(actor))
    const upsertDirectors = directors.map((director) => formatUpsert(director))
    const upsertPolls = polls?.map((poll) => formatUpsert(poll)) || []

    const upserts = [Actor.bulkWrite(upsertActors), Director.bulkWrite(upsertDirectors), Poll.bulkWrite(upsertPolls)]

    await Promise.all(upserts)

    const actorsIds = actors.map(({ actor, role }) => ({ actor: actor.id, role }))
    const directorsIds = directors.map((director) => director.id)
    const pollsIds = polls?.map((poll) => poll.id) || []

    const formattedMovie = {
      ...movie,
      senscritique: { ...senscritique, actors: actorsIds, directors: directorsIds, polls: pollsIds },
    }

    this.setUpdate(formattedMovie)

    next()
  } catch (error) {
    if (error instanceof MongooseError) return next(error)
    throw error
  }
})

const formatUpsert = (value: Record<string, string | number | null>) => {
  return {
    updateOne: {
      filter: { id: value['id'] },
      update: { $set: value },
      upsert: true,
    },
  }
}

export const Movie = mongoose.model<IMovie>('moviesV2', MovieDBSchema)

const Query_setOptions = mongoose.Query.prototype.setOptions
mongoose.Query.prototype.setOptions = function (options: QueryOptions, overwrite?: boolean) {
  return Query_setOptions.call(this, { ...options, lean: true }, overwrite)
}
mongoose.set('strictQuery', true)

export function connect(dbUri: string, options: { dbName: string }) {
  return mongoose.connect(dbUri, options)
}

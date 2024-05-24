import Fuse from 'fuse.js'

export function rate(set: string[], string?: string | null) {
  if (!string) return 1
  const fuseOptions = { includeScore: true, threshold: 1.0 }
  const fuse = new Fuse(set, fuseOptions)
  const score = Number(fuse.search(string)[0]?.score)
  return score
}

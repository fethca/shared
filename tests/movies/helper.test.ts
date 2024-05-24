import { formatNgrams, slugTitle } from '../../src/index.js'

describe('formatNgrams', () => {
  it('should return empty array if no string', () => {
    const result = formatNgrams('')
    expect(result).toEqual([])
  })

  it('should return ngrams', () => {
    const result = formatNgrams('long string like a movie title')
    expect(result).toEqual([
      'long',
      'string',
      'like',
      'a',
      'movie',
      'title',
      'lon',
      'long',
      'str',
      'stri',
      'strin',
      'string',
      'lik',
      'like',
      'mov',
      'movi',
      'movie',
      'tit',
      'titl',
      'title',
    ])
  })
})

describe('slugTitle', () => {
  it('should return empty string if no string', () => {
    const result = slugTitle('')
    expect(result).toEqual('')
  })

  it('should remove every non alphabetic characters', () => {
    const result = slugTitle('Title with space and _!')
    expect(result).toEqual('titlewithspaceand')
  })
})

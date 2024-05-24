import { rate } from '../../src/index.js'

describe('rate', () => {
  it('should return 1 if no string', () => {
    const result = rate(['string1, string2'], null)
    expect(result).toBe(1)
  })

  it('should return score', () => {
    const result = rate(['string1, string2'], 'searchString')
    expect(result).toBe(0.612592665952338)
  })
})

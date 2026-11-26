import { readFileSync } from 'fs'
import { extractPackageJson } from '../../src/index.helpers.js'

vi.mock('fs')

describe('extractPackageJson', () => {
  beforeEach(() => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ version: '1.0.0', name: 'my-app' }))
  })

  it('should return package.json parsed with required values', () => {
    const result = extractPackageJson()
    expect(result).toEqual({
      name: 'my-app',
      version: '1.0.0',
    })
  })

  it('should return package.json parsed with non required values', () => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ version: '1.0.0', name: 'my-app', titi: 'toto' }))
    const result = extractPackageJson()
    expect(result).toEqual({
      name: 'my-app',
      version: '1.0.0',
      titi: 'toto',
    })
  })

  it('should throw if a value is missing', () => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ version: '1.0.0' }))
    expect(() => extractPackageJson()).toThrow(
      expect.objectContaining({
        name: 'ZodError',
        issues: [expect.objectContaining({ code: 'invalid_type', expected: 'string', path: ['name'] })],
      }),
    )
  })
})

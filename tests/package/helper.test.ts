import { readFileSync } from 'fs'
import { ZodError } from 'zod'
import { extract } from '../../src/index.js'

vi.mock('fs')

describe('extract', () => {
  beforeEach(() => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ version: '1.0.0', name: 'my-app' }))
  })

  it('should return package.json parsed with required values', async () => {
    const result = await extract()
    expect(result).toEqual({
      name: 'my-app',
      version: '1.0.0',
    })
  })

  it('should return package.json parsed with non required values', async () => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ version: '1.0.0', name: 'my-app', titi: 'toto' }))
    const result = await extract()
    expect(result).toEqual({
      name: 'my-app',
      version: '1.0.0',
      titi: 'toto',
    })
  })

  it('should throw if a value is missing', async () => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({ version: '1.0.0' }))
    const error = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['name'],
        message: 'Required',
      },
    ])
    expect(() => extract()).toThrow(error)
  })
})

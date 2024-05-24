/// <reference types="vitest/globals" />

import { defineTestConfig } from '@fethcat/tests'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: defineTestConfig(),
})

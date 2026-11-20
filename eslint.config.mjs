import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Next.js 16 removed `next lint`; ESLint runs directly with this flat config.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // New React Compiler rules in Next 16's config. They flag 8 existing spots
      // (setState in mount effects, Date.now() during render). Kept visible as
      // warnings; fix them when those screens move to the API.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'AIP Session Presentations and workbooks-*/**',
  ]),
])

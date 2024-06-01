import react from '@atmina/linting/eslint/react.js';
import recommended from '@atmina/linting/eslint/recommended.js';
import tailwind from '@atmina/linting/eslint/tailwind.js';

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const config = [...recommended, tailwind, react];

export default config;

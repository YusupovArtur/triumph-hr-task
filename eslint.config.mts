import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,  // Распаковываем глобальные переменные для браузера
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  eslint.configs.recommended,  // Базовые рекомендации ESLint
  ...tseslint.configs.recommended,  // Рекомендации typescript-eslint (с spread-оператором!)
);

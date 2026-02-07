
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'deprecation'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'deprecation/deprecation': 'warn',
    },
    ignorePatterns: ['dist/', 'node_modules/'],
};

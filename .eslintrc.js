module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    "rules": {
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-explicit-any": "off",
        // "@typescript-eslint/no-param-reassign": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-use-before-define": "warn",
        "@typescript-eslint/prefer-for-of": "off",
        '@typescript-eslint/no-misused-promises': "warn",
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/unified-signatures": "warn",
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/consistent-type-assertions': ["warn", { "assertionStyle": "angle-bracket" }],
        '@typescript-eslint/no-var-requires': "warn",
        '@typescript-eslint/require-await': "warn",
        '@typescript-eslint/interface-name-prefix': "warn",
        '@typescript-eslint/class-name-casing': "off",
        '@typescript-eslint/ban-ts-ignore': "warn",
        '@typescript-eslint/unbound-method': "warn",
        "comma-dangle": "warn",
        "constructor-super": "error",
        "eqeqeq": [
            "warn",
            "always",
            { "null": "ignore" }
        ],
        // "import/no-deprecated": "warn",
        // "import/no-extraneous-dependencies": "off",
        // "import/no-unassigned-import": "warn",
        "no-cond-assign": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-empty": [
            "error",
            {
                "allowEmptyCatch": true
            }
        ],
        "no-invalid-this": "off",
        'no-irregular-whitespace': "warn",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-prototype-builtins": "warn",
        "no-sequences": "error",
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-throw-literal": "warn",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-useless-escape": "warn",
        "no-var": "warn",
        "no-void": "error",
        'no-mixed-spaces-and-tabs': "warn",
        "prefer-const": "warn",
        "prefer-spread": "warn",
        'prefer-rest-params': "warn",
        'no-async-promise-executor': "warn"
    }
};

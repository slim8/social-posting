module.exports = {
    ignoreFiles: [
        'dev/assets/js/plugins/**',
        '**/*.css',
        'vendor/**',
        'node_modules/**',
        'bower_components/**'
    ],
    plugins: [
        'stylelint-scss',
        'stylelint-order',
        'stylelint-at-rule-no-children',
        'stylelint-declaration-block-no-ignored-properties'
    ],
    rules: {
        // Possible errors
        'color-no-invalid-hex': true,
        'font-family-no-duplicate-names': true,
        'font-family-no-missing-generic-family-keyword': true,
        'function-calc-no-invalid': true,
        'function-calc-no-unspaced-operator': true,
        'function-linear-gradient-no-nonstandard-direction': true,
        'string-no-newline': true,
        'unit-no-unknown': true,
        'property-no-unknown': true,
        'keyframe-declaration-no-important': true,
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-no-shorthand-property-overrides': true,
        'selector-pseudo-class-no-unknown': true,
        'selector-pseudo-element-no-unknown': true,
        'selector-type-no-unknown':[
                true,
                {
                    'ignoreTypes': [
                        'tms-filtertags', 'tms-jobfilter', 'tms-joblist', 'tms-jobfeed'
                    ],
                }
            ],
        'media-feature-name-no-unknown': true,
        'comment-no-empty': true,
        'no-descending-specificity': true,
        'no-duplicate-at-import-rules': true,
        'no-duplicate-selectors': true,
        'no-extra-semicolons': true,

        'indentation': 4,
        'no-eol-whitespace': true,
        'no-missing-end-of-source-newline': true,
        'unicode-bom': 'never',
        'scss/comment-no-loud': true,
        // 'scss/double-slash-comment-empty-line-before': [
        //     'always',
        //     {
        //         'except': [
        //             'first-nested'
        //         ],
        //         'ignore': [
        //             'between-comments',
        //             'stylelint-commands'
        //         ]
        //     }
        // ],
        'scss/double-slash-comment-inline': [
            'never',
            {
                'ignore': [
                    'stylelint-commands'
                ]
            }
        ],
        'scss/double-slash-comment-whitespace-inside': 'always',
        // 'aditayvm/at-rule-no-children': [
        //     {
        //         'ignore': [
        //             'if',
        //             'else',
        //             'each',
        //             'for',
        //             'while',
        //             'mixin'
        //         ]
        //     }
        // ],
        // 'selector-combinator-whitelist': ['>', '+', '~'],
        'plugin/declaration-block-no-ignored-properties': true,
        'at-rule-blacklist': [
            'debug'
        ],
        'at-rule-no-vendor-prefix': true,
        'block-no-empty': null,
        'block-opening-brace-space-before': 'always',
        'block-opening-brace-newline-before': 'never-single-line',
        'block-opening-brace-newline-after': 'always',
        'block-closing-brace-empty-line-before': 'never',
        'block-closing-brace-newline-before': 'always',
        'block-closing-brace-newline-after': 'always',
        'color-hex-case': 'lower',
        'color-hex-length': 'short',
        'declaration-bang-space-after': 'never',
        'declaration-bang-space-before': 'always',
        'declaration-block-semicolon-newline-after': 'always',
        'declaration-block-semicolon-space-before': 'never',
        'declaration-block-single-line-max-declarations': 1,
        'declaration-block-trailing-semicolon': 'always',
        'declaration-colon-space-after': 'always-single-line',
        'declaration-colon-space-before': 'never',
        'declaration-property-value-blacklist': {
            'border': [
                'none'
            ],
            'border-top': [
                'none'
            ],
            'border-right': [
                'none'
            ],
            'border-bottom': [
                'none'
            ],
            'border-left': [
                'none'
            ]
        },
        'function-comma-space-after': 'always-single-line',
        'function-parentheses-space-inside': 'never',
        'function-url-quotes': 'always',
        'length-zero-no-unit': true,
        'media-feature-name-no-vendor-prefix': true,
        'media-feature-parentheses-space-inside': 'never',
        'number-leading-zero': 'always',
        'number-no-trailing-zeros': true,
        // 'order/order': [
        //     [
        //         {
        //             'type': 'at-rule',
        //             'name': 'extend'
        //         },
        //         'custom-properties',
        //         'dollar-variables',
        //         'declarations',
        //         {
        //             'type': 'rule',
        //             'selector': '^&[^:]+$'
        //         },
        //         {
        //             'type': 'rule',
        //             'selector': '^&[^:]*:[\\w-]'
        //         },
        //         {
        //             'type': 'rule',
        //             'selector': '^&[^:]*::'
        //         },
        //         {
        //             'type': 'at-rule',
        //             'name': 'include',
        //             'parameter': 'mq',
        //             'hasBlock': true
        //         },
        //         'rules'
        //     ]
        // ],
        'property-no-vendor-prefix': true,
        'rule-empty-line-before': [
            'always-multi-line',
            {
                'except': [
                    'first-nested'
                ],
                'ignore': [
                    'after-comment'
                ]
            }
        ],
        'scss/at-extend-no-missing-placeholder': true,
        'scss/at-function-pattern': '^_?[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
        'scss/at-import-no-partial-leading-underscore': true,
        'scss/at-import-partial-extension-blacklist': [
            'scss'
        ],
        'scss/at-mixin-pattern': '^[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
        'scss/at-rule-no-unknown': true,
        'scss/dollar-variable-colon-space-after': 'always',
        'scss/dollar-variable-colon-space-before': 'never',
        'scss/dollar-variable-pattern': '^[_]?[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
        'scss/percent-placeholder-pattern': '^[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
        'scss/selector-no-redundant-nesting-selector': true,
        'selector-class-pattern': [
            '^[a-z0-9\\-]+$',
            {
                'message': 'Selector should be written in lowercase with hyphens (selector-class-pattern)'
            }
        ],
        'selector-list-comma-newline-after': 'always',
        'selector-max-id': 2,
        'selector-no-vendor-prefix': true,
        'selector-pseudo-element-colon-notation': 'double',
        'shorthand-property-no-redundant-values': true,
        'string-quotes': 'single',
        'value-no-vendor-prefix': true
    }
};

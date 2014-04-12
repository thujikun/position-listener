'use strict';

module.exports = function(grunt) {
    var targetPath = './src/jquery-position-listener.js';

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            'minify': {
                files: targetPath,
                tasks: ['jshint', 'closurecompiler']
            },
            'doc': {
                files: targetPath,
                tasks: ['jsdoc']
            },
        },
        closurecompiler: {
            minify: {
                files: {
                    './src/jquery-position-listener.min.js': [
                        targetPath
                    ],
                },
                options: {
                    'compilation_level': 'ADVANCED_OPTIMIZATIONS',
                    'max_processes': 5,
                    'banner': '',
                }
            },
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            hint: [
                targetPath,
            ],
        },
        jsdoc: {
            dist: {
                src: [
                    targetPath
                ],
                options: {
                    destination: 'doc',
                    configure: 'doc/template/jsdoc.conf.json',
                    template: 'doc/template'
                },
            },
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'closurecompiler',
        'jsdoc',
        'watch',
    ]);
};

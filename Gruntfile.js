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
        uglify: {
            options: {
                ascii_only: true,
                preserveComments: 'some'
            },
            minify: {
                files: {
                    './src/jquery-position-listener.min.js': [
                        targetPath
                    ],
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

    grunt.registerTask('build', [
        'jshint',
        'uglify',
        'jsdoc'
    ]);

    grunt.registerTask('default', [
        'build',
        'watch'
    ]);
};

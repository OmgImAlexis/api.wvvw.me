module.exports = function(grunt) {
    grunt.initConfig({
        bower_concat: {
            all: {
                dest: './_bower.js',
                cssDest: './_bower.css',
                exclude: [
                    // 'jquery',
                    // 'modernizr'
                ],
                dependencies: {
                    // 'underscore': 'jquery',
                    // 'backbone': 'underscore',
                    // 'jquery-mousewheel': 'jquery'
                },
                bowerOptions: {
                    relative: false
                },
            }
        },
        uglify: {
            my_target: {
                files: {
                    './public/js/_bower.min.js': ['./_bower.js'],
                    // './public/js/_bower.min.css': ['./_bower.css']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    './public/css/core.min.css': ['./public/css/core.css']
                }
            }
        },
        jshint: {
            options: {
                // curly: true,
                eqeqeq: true
            },
            uses_defaults: ['app.js', 'app/**/*.js', 'config/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['bower_concat', 'uglify', 'cssmin']);

};
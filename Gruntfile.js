module.exports = function(grunt) {
    grunt.initConfig({
        bower_concat: {
            all: {
                dest: './public/js/_bower.js',
                // cssDest: 'gui/slick/css/_bower.css',
                bowerOptions: {
                    relative: false
                },
            }
        },
        uglify: {
            my_target: {
                files: {
                    './public/js/_bower.min.js': ['./public/js/_bower.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['bower_concat', 'uglify']);

};

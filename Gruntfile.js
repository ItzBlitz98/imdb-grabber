module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/js/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        copy: {
            main: {
                expand: true,
                dot: true,
                cwd: 'app/',
                src: '**',
                dest: 'dist/'
            },
            modules: {
                expand: true,
                dot: true,
                cwd: 'node_modules/*',
                src: 'node_modules/',
                dest: 'dist/'
            },
            packageinfo: {
                src: 'app/package.json',
                dest: 'dist-pkg/package.json'
            }
        },

        nodewebkit: {
            options: {
                version: '0.8.3',
                build_dir: './dist-pkg',
                mac: true,
                win: true,
                linux32: true,
                linux64: true
            },
            src: ['dist/**/*']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.registerTask('default', ['copy', 'nodewebkit']);

};
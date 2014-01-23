/*global module:false*/
module.exports = function(grunt) {

    var assetsBanner = '/*! <%= pkg.name %> - v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy HH:mm:ss") %> */\n';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
            page: {
                options: {
                    basePath: 'web/UI/app',
                    config: 'web/UI/app/config.rb',
                    // relativeassets: true
                }
            }
        },

        watch: {
            css_app: {
                files: ['web/UI/app/sass/*.scss'],
                tasks: ['compass']
            },
            twig: {
                files: ['app/Resources/views/*.html.twig', 'src/Btn/AppBundle/Resources/views/**/*.html.twig'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                // Here we watch the files the sass task will compile to
                // These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['web/UI/app/css/*'],
            },
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: ['web/UI/app/js/**/*.js', '*.json', 'Gruntfile.js']
        },

        phpcs: {
            application: {
                dir: 'src/*'
            },
            options: {
                bin: 'bin/phpcs',
                standard: 'PSR2'
            }
        },

        phpmd: {
            options: {
                bin: 'bin/phpmd',
                reportFormat: 'text',
                rulesets: 'codesize,unusedcode'
            },
            application: {
                dir: 'src/*'
            }
        },

        exec: {
            phpcs_hint: {
                cmd: 'bin/php-cs-fixer fix --level=all --dry-run --diff --verbose src/',
                stdout: true,
                stderr: true,
            },
            phpcs_fix: {
                cmd: 'bin/php-cs-fixer fix --level=all src/',
                stdout: true,
                stderr: true,
            },
        },

        assetic_dump: {
            options: {
                banner: assetsBanner,
            },
            prod: {
                configFile: 'app/config/assets.yml'
            }
        },

        uglify: {
            options: {
                banner: assetsBanner
            },
            prod: {
                expand: true,
                cwd: 'web/js',
                src: '*.js',
                dest: 'web/js/'
            },
        },

        cssmin: {
            options: {
                banner: assetsBanner,
                keepSpecialComments: 0
            },
            prod: {
                expand: true,
                cwd: 'web/css/',
                src: '*.css',
                dest: 'web/css/'
            }
        },

        groundskeeper: {
            options: {
                replace: '"cl"'
            },
            prod: {
                expand: true,
                cwd: 'web/js',
                src: '*.js',
                dest: 'web/js'
            }
        },

        clean : {
            assets : {
                src : [ 'web/js/*.js', 'web/css/*.css'],
            },
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-assetic-dump');
    grunt.loadNpmTasks('grunt-groundskeeper');
    grunt.loadNpmTasks('grunt-phpcs');
    grunt.loadNpmTasks('grunt-phpmd');
    grunt.loadNpmTasks('grunt-exec');

    // Default task.
    grunt.registerTask('default', []);
    grunt.registerTask('hint', ['jshint', 'phpcs', 'exec:phpcs_hint']);
    grunt.registerTask('dump:dev', ['compass', 'assetic_dump']);
    grunt.registerTask('dump:prod', ['dump:dev', 'cssmin', 'uglify', 'groundskeeper']);
    grunt.registerTask('dump', ['dump:prod']);
    grunt.registerTask('clear', ['clean']);
};

// sudo gem install em-websocket

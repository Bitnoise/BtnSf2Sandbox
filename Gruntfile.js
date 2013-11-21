/*global module:false*/
module.exports = function(grunt) {

  var assetsBanner = '/*! <%= pkg.name %> - v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy hh:mm:ss") %> */\n';
  var assetsPrefix = 'web/';
  var assetsFileList = function(ext) {
    var assets = grunt.file.readYAML('app/config/assets.yml').assetic.assets;
    var namePattern =new RegExp('_' + ext + '$');
    var returnObject = {};
    for (name in assets) {
        if (name.match(namePattern) ) {
            var asset = assets[name];
            var inputs = asset.inputs;
            for (input in inputs) {
                inputs[input] = assetsPrefix + inputs[input];
            }
            returnObject[assetsPrefix + asset.output] = inputs;
        }
    }
    return returnObject;
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      page: {
        options: {
          basePath: 'web/UI/app',
          config:  'web/UI/app/config.rb',
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
          files: ['app/Resources/views/*.html.twig', 'src/Btn/AppBundle/Resources/views/**/*.html.twig', 'src/Btn/ControlBundle/Resources/views/**/*.html.twig'],
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
        app: ['web/UI/app/js/**/*.js', '*.json']
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

    uglify: {
        options: {
            report: 'min',
            compress: false,
            banner: assetsBanner,
        },
        combine: {
            files: assetsFileList('js'),
        },
    },

    cssmin: {
        options: {
            report: 'min',
            banner: assetsBanner,
        },
        combine: {
            files: assetsFileList('css'),
        },
    },

    concat: {
        options: {
            stripBanners: false,
            banner: assetsBanner,
        },
        js: {
            files: assetsFileList('js'),
        },
        css: {
            files: assetsFileList('css'),
        },
    },

    clean : {
        assets : {
            src : [ "web/js/*.js", "web/css/*.css"],
        },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-phpcs');
  grunt.loadNpmTasks('grunt-phpmd');
  grunt.loadNpmTasks('grunt-exec');

  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('hint', ['jshint', 'phpcs', 'exec:phpcs_hint']);
  grunt.registerTask('dump:prod', ['compass', 'uglify', 'cssmin']);
  grunt.registerTask('dump:dev', ['compass', 'concat']);
  grunt.registerTask('dump', ['dump:prod']);
};


// sudo gem install em-websocket

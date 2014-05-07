module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
        distDir: './dist',
        cssSrc: './sass',
        cssDist: './dist/css',
        jsSrc: './js',
        jsDist: './dist/js',
        docsSrc: './docs',
        docsDist: './dist/docs',
        //packageBanner: grunt.file.read('banner.txt'),
        fwFilename: '<%= pkg.name %>',
    },


    watch: {
      options: {
        livereload: true,
      },

      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: [
          'sass',
          //'pixrem' // required for IE only
        ]
      },

      js: {
        files: 'js/**/*.js',
        tasks: ['uglify']
      },

      templates: {
          files: ['<%= jekyll.templates.options.src %>/**/*.html'],
          tasks: ['copy:templates', 'jekyll:templates']
      },
    },
    sass: {
      options: {
        includePaths: [
          'bower_components/foundation/scss',
          'scss/baselayer'
        ]
      },
      dist: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      }
    },
    pixrem: {
      options: {
        //rootvalue: '16px'
      },
      dist: {
        src: 'css/app.css',
        dest: 'css/app.css'
      }
    },
    uglify: {
      options: {
        //preserveComments: 'some'
      },
      dist: {
        files: {
          'js/modernizr.min.js': ['bower_components/modernizr/modernizr.js'],
          'js/fastclick.min.js': ['bower_components/fastclick/lib/fastclick.js'],
          'js/foundation.min.js': [
            'bower_components/foundation/js/foundation/foundation.js',

            // Include all or...
            //'bower_components/foundation/js/foundation/*.js'

            // Selectively include
            'bower_components/foundation/js/foundation/foundation.abide.js',
            'bower_components/foundation/js/foundation/foundation.clearing.js',
            'bower_components/foundation/js/foundation/foundation.interchange.js',
            'bower_components/foundation/js/foundation/foundation.magellan.js',
            'bower_components/foundation/js/foundation/foundation.reveal.js',
            'bower_components/foundation/js/foundation/foundation.tooltip.js',
            'bower_components/foundation/js/foundation/foundation.accordion.js',
            'bower_components/foundation/js/foundation/foundation.dropdown.js',
            'bower_components/foundation/js/foundation/foundation.joyride.js',
            'bower_components/foundation/js/foundation/foundation.offcanvas.js',
            'bower_components/foundation/js/foundation/foundation.slider.js',
            'bower_components/foundation/js/foundation/foundation.topbar.js',
            'bower_components/foundation/js/foundation/foundation.alert.js',
            'bower_components/foundation/js/foundation/foundation.equalizer.js',
            'bower_components/foundation/js/foundation/foundation.orbit.js',
            'bower_components/foundation/js/foundation/foundation.tab.js'
          ],
        }
      },
    },
    jekyll: {
      options: {
        //bundleExec: true,

      },
      templates: {
        options: {
          src : 'templates/src',
          dest: 'templates/dest'
        }
      },
    },

    connect: {
      options: {
        open: true,
        keepalive: false
      },
      templates: {
        options: {
          port: 9000,
          base: '<%= jekyll.templates.options.dest %>'
        }
      }
    },


    copy: {
          options: {
              flatten: true
          },
          templates: { // copy all assets into templates source dir
              src: [
                  'css/app.css',
                  'js/**/*.js',
                  'images/**/*',
                  'fonts/**/*',
              ],
              dest: '<%= jekyll.templates.options.src %>/assets/'
          }
      },
  });


  grunt.registerTask('build', ['sass','pixrem','uglify']);
  grunt.registerTask('default', ['build','watch']);

  grunt.registerTask('templates', [
      'copy:templates',
      'jekyll:templates',
      'connect:templates',
      'default'
  ]);
}
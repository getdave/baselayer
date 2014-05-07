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
          files: ['js/baselayer.js','js/site.js'],
          tasks: ['uglify']
        },

        templates: {
          files: ['<%= jekyll.templates.options.src %>/**/*.html'],
          tasks: ['copy:templates', 'jekyll:templates']
        },

        docs: {
          files: ['<%= jekyll.docs.options.src %>/**/*.html'],
          tasks: ['copy:docs', 'jekyll:docs']
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
            'css/site.css': 'scss/site.scss',
          //'css/site-ie.css': 'scss/site-ie.scss'
        }
      }
    },
    pixrem: {
      options: {
        //rootvalue: '16px'
      },
      dist: {
        src: 'css/site.css',
        dest: 'css/site-ie.css'
      }
    },
    uglify: {
      options: {

      },
      dist: {
        files: {
          'js/conditional/superfish.min.js': [
          'bower_components/superfish/dist/js/hoverIntent.js',
          'bower_components/superfish/dist/js/superfish.js'
          ],

          'js/vendor/modernizr.min.js': ['bower_components/modernizr/modernizr.js'],
          'js/vendor/foundation.min.js': [
          'bower_components/fastclick/lib/fastclick.js',
          'bower_components/foundation/js/foundation/foundation.js',

            // Include all or...
            //'bower_components/foundation/js/foundation/*.js'

            // Selectively include
            //'bower_components/foundation/js/foundation/foundation.abide.js',
            //'bower_components/foundation/js/foundation/foundation.clearing.js',
            //'bower_components/foundation/js/foundation/foundation.interchange.js',
            //'bower_components/foundation/js/foundation/foundation.magellan.js',
            //'bower_components/foundation/js/foundation/foundation.reveal.js',
            //'bower_components/foundation/js/foundation/foundation.tooltip.js',
            //'bower_components/foundation/js/foundation/foundation.accordion.js',
            //'bower_components/foundation/js/foundation/foundation.dropdown.js',
            //'bower_components/foundation/js/foundation/foundation.joyride.js',
            'bower_components/foundation/js/foundation/foundation.offcanvas.js',
            //'bower_components/foundation/js/foundation/foundation.slider.js',
            //'bower_components/foundation/js/foundation/foundation.topbar.js',
            'bower_components/foundation/js/foundation/foundation.alert.js',
            //'bower_components/foundation/js/foundation/foundation.equalizer.js',
            //'bower_components/foundation/js/foundation/foundation.orbit.js',
            //'bower_components/foundation/js/foundation/foundation.tab.js'
            ],
            'js/baselayer.min.js': ['js/baselayer.js'],
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
      docs: {
        options: {
          src : 'docs/src',
          dest: 'docs/dest'
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
      },
      docs: {
        options: {
          port: 9000,
          base: '<%= jekyll.docs.options.dest %>'
        }
      }
    },


    copy: {
      options: {
        flatten: false
      },
      templates: { // copy all assets into templates source dir
        src: [
        'css/*.css',
        'js/**/*.js',
        'images/**/*',
        'fonts/**/*',
        ],
        dest: '<%= jekyll.templates.options.src %>/assets/'
      },
      docs: {
        src: '<%= copy.templates.src %>',
        dest: '<%= jekyll.docs.options.src %>/assets/'
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

grunt.registerTask('docs', [
  'copy:docs',
  'jekyll:docs',
  'connect:docs',
  'default'
  ]);
}
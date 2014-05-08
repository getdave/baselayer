module.exports = function (grunt) {
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

    // Watch files for changes, run tasks and reload browser
    watch: {
      options: {
        livereload: true,
      },

      grunt: {
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'scss/**/*.scss',
        tasks: [
          'css'
        ]
      },

      js: {
        files: ['js/baselayer.js', 'js/site.js'],
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

    // Connect - spin up local server and open in default system browser
    connect: {
      options: {
        open: true,
        keepalive: false,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',
        // hostname: '0.0.0.0'

      },
      templates: {
        options: {
          port: 9000,
          base: '<%= jekyll.templates.options.dest %>'
        }
      },
      docs: {
        options: {
          port: 9001,
          base: '<%= jekyll.docs.options.dest %>'
        }
      }
    },

    // Sass - build CSS files from SCSS using grunt-sass (via libsass for speed!)
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
          'css/site.css': 'scss/site.scss'
        }
      }
    },

    // Pixrem - provide "px" fallback for "rem" units and create site-oldie.css file
    pixrem: {
      options: {
        //rootvalue: '16px'
      },
      dist: {
        src: 'css/site.css',
        dest: 'css/site-oldie.css'
      }
    },


    // Legacssy - flatten MQ's in site-oldie.css
    legacssy: {
      dist: {
        options: {
          // Include only styles for a screen 800px wide
          legacyWidth: 60
        },
        files: {
          'css/site-oldie.css': 'css/site-oldie.css',
        },
      },
    },

    // Uglify - process all JS
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


    // Jekyll - build Documentation and example Templates into static sites
    jekyll: {
      options: {

      },
      templates: {
        options: {
          src: 'templates/src',
          dest: 'templates/dest'
        }
      },
      docs: {
        options: {
          src: 'docs/src',
          dest: 'docs/dest'
        }
      },
    },


    // Copy - copy assets into required destination ready for use in Docs and Templates
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


    // Clean - ensure no legacy files are left around
    clean: {
      css: [
        'css/*.css'
      ],
      templates: [
        'templates/dest/',
        'templates/src/assets/',
      ],
      docs: [
        'docs/src/assets/',
        'docs/dest/',
      ],
    },

  });

  // Default - build and then start watching
  grunt.registerTask('default', ['build', 'watch']);


  // Master Build task - prepare for deployment
  grunt.registerTask('build', [
    'clean',
    'css',
    'uglify'
  ]);

  // CSS - process CSS
  grunt.registerTask('css', [
    'clean:css',
    'sass',
    'pixrem',
    'legacssy'
  ]);

  // Templates - build example Templates static site
  grunt.registerTask('templates', [
    'clean:templates',
    'copy:templates',
    'jekyll:templates',
    'connect:templates',
    'default'
  ]);

  // Docs - build Component Documentation static site
  grunt.registerTask('docs', [
    'clean:docs',
    'copy:docs',
    'jekyll:docs',
    'connect:docs',
    'default'
  ]);
}
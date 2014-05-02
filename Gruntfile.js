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

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      }
    },

    watch: {
      options: {
        livereload: true,
      },

      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      },

      templates: {
          files: ['<%= jekyll.templates.options.src %>/**/*.html'],
          tasks: ['copy:templates', 'jekyll:templates']
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
                  'images/**/*',
              ],
              dest: '<%= jekyll.templates.options.src %>/'
          }
      },
  });


  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);

  grunt.registerTask('templates', [
      'copy:templates',
      'jekyll:templates',
      'connect:templates',
      'default'
  ]);
}
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var mountFolder = function(connect, dir) {
    return require('serve-static')(require('path').resolve(dir));
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
        src: 'src',
        app: 'app',
        css: '<%= project.app %>/css',
        scss: ['<%= project.src %>/scss/style.scss'],
        js: ['<%= project.app %>/js/*.js']
    },
    connect: {
        options: {
            port: 9992,
            hostname: '*'
        },
        livereload: {
            options: {
                middleware: function(connect) {
                    return [lrSnippet, mountFolder(connect, 'app')];
                }
            }
        }
    },
    concat: {
        dev: {
            files: {
                '<%= project.app %>/js/scripts.min.js': '<%= project.js %>'
            }
        },
        options: {
            stripBanners: true,
            nonull: true,
        }
    },
    sass: {
      dev: {
          options: {
              style: 'expanded'
          },
          files: {
              '<%= project.app %>/css/craftsvilla.css': '<%= project.scss %>'
          }
      },
      dist: {
          options: {
              style: 'expanded'
          },
          files: {
              '<%= project.app %>/css/craftsvilla.css': '<%= project.scss %>'
          }
      }
    },
    cssmin: {
      dev: {
          files: {
              '<%= project.app %>/css/craftsvilla.min.css': [
                  //'<%= project.src %>/components/normalize-css/normalize.css',
                  '<%= project.app %>/css/craftsvilla.css'
              ]
          }
      },
      dist: {
          files: {
              '<%= project.app %>/css/craftsvilla.min.css': [
                  //'<%= project.src %>/components/normalize-css/normalize.css',
                  '<%= project.app %>/css/craftsvilla.css'
              ]
          }
      }
    },
    uglify: {
        dist: {
            files: {
                '<%= project.app %>/js/scripts.min.js': '<%= project.js %>'
            }
        }
    },
    open: {
        server: {
            path: 'http://localhost:<%= connect.options.port %>'
        }
    },
    watch: {
        concat: {
            files: '<%= project.src %>/js/{,*/}*.js',
            tasks: ['concat:dev']
        },
        sass: {
            files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
            tasks: ['sass:dev', 'cssmin:dev']
        },
        livereload: {
            options: {
                livereload: LIVERELOAD_PORT
            },
            files: [
                '<%= project.app %>/{,*/}*.html',
                '<%= project.app %>/css/*.css',
                '<%= project.app %>/js/{,*/}*.js',
                '<%= project.app %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    }

  });

  // Default task(s).
  grunt.registerTask('default', [
      'sass:dev',
      //'bower:dev',
      //'autoprefixer:dev',
      'cssmin:dev',
      'concat:dev',
      'connect:livereload',
      'open',
      'watch'
  ]);

};

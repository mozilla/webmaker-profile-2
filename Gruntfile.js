module.exports = function (grunt) {

  grunt.initConfig({
    less: {
      development: {
        files: {
          'app/compiled/app.min.ltr.css': 'app/less/app.less'
        },
        options: {
          sourceMap: true,
          sourceMapBasepath: 'app',
          sourceMapRootpath: '/'
        }
      },
      production: {
        files: {
          'app/compiled/app.min.ltr.css': 'app/less/app.less'
        }
      }
    },
    watch: {
      less: {
        files: ['app/less/**/*.less'],
        tasks: ['less:development']
      }
    },
    connect: {
      server: {
        options: {
          base: 'app/',
          port: 1134,
          open: true
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app/js/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'app/js/**/*.js', 'app/index.html', 'app/partials/**/*.html'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      validate: {
        src: ['Gruntfile.js', 'app/js/**/*.js', 'app/index.html', 'app/partials/**/*.html'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    cson: {
      glob_to_multiple: {
        expand: true,
        src: ['env.cson'],
        dest: 'app',
        ext: '.json'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-cson');

  // Development mode
  grunt.registerTask('default', ['less:development', 'cson', 'connect', 'watch']);

  // Clean code before a commit
  grunt.registerTask('clean', ['jsbeautifier:modify', 'jshint']);

  // Validate code (read only)
  grunt.registerTask('validate', ['jsbeautifier:validate', 'jshint']);

  // Build for Production
  grunt.registerTask('build', ['less:production', 'cson']);

};

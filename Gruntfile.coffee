module.exports = (grunt) ->
  grunt.initConfig
    less:
      options:
        sourceMap: true
        sourceMapBasepath: "app"
        sourceMapRootpath: "/"
      development:
        files:
          "app/_compiled/app.ltr.css": "app/_less/app.less"
      production:
        files:
          ".static/_css/app.ltr.css": "app/_less/app.less"
      reload:
        files:
          ".tmp/_compiled/app.ltr.css": "app/_less/app.less"

    shell:
      server:
        options:
          async: true
        command: 'node server'
      reload:
        options:
          async: true
        command: 'node server --path=../.tmp'

    clean: [
      ".tmp"
      ".static"
    ]

    watch:
      options:
        cwd: "app"
        spawn: true
      passive:
        files: [
          '_less/**/*.less'
        ]
        options:
          livereload: false
        tasks: [
          "less:development"
        ]
      reload:
        options:
          spawn: false
          livereload: true
          interrupt: true
          atBegin: true
        files: [
          '_img/**/*.*'
          '_js/**/*.js'
          '_less/**/*.less'
          '_partials/**/*.html'
          'index.html'
        ]
        tasks: [
          "copy:stageJS"
          "copy:stagePartials"
          "copy:stageImages"
          "less:reload"
          "dom_munger:reload"
        ]

    copy:
      reloadInit:
        files: [
          expand: true
          cwd: "app"
          src: "_bower_components/**/*.*"
          dest: ".tmp/"
        ]
      stageJS:
        files: [
          expand: true
          cwd: "app"
          src: "_js/**/*.js"
          dest: ".tmp/"
        ]
      stagePartials:
        files: [
          expand: true
          cwd: "app"
          src: "_partials/**/*.html"
          dest: ".tmp/"
        ]
      stageImages:
        files: [
          expand: true
          cwd: "app"
          src: "_img/**/*.*"
          dest: ".tmp/"
        ]

    dom_munger:
      reload:
        options:
          append:
            selector: "body"
            html: "<script src=\"//localhost:35729/livereload.js\" id=\"liveReloadScript\"></script>"

        src: "app/index.html"
        dest: ".tmp/index.html"

    autoprefixer:
      options:
        browsers: ["last 2 versions"]
      build:
        src: ".static/_css/app.ltr.css"
        dest: "app/_compiled/app.ltr.css"

    jshint:
      all: [
        "Gruntfile.js"
        "app/_js/**/*.js"
      ]
      options:
        jshintrc: ".jshintrc"

    jsbeautifier:
      modify:
        src: [
          "app/_js/**/*.js"
          "app/index.html"
          "app/_partials/**/*.html"
        ]
        options:
          config: ".jsbeautifyrc"

      validate:
        src: [
          "app/_js/**/*.js"
          "app/index.html"
          "app/_partials/**/*.html"
        ]
        options:
          mode: "VERIFY_ONLY"
          config: ".jsbeautifyrc"

    uglify:
      dependencies:
        options:
          sourceMap: true
          mangle: false
        files:
          'app/_compiled/dependencies.min.js': [

            'app/_bower_components/webmaker-auth-client/dist/webmaker-auth-client.min.js'
            'app/_bower_components/makeapi-client/src/make-api.js'
            'app/_bower_components/jquery/dist/jquery.js'
            'app/_bower_components/selectize/dist/js/standalone/selectize.js'

            'app/_bower_components/angular/angular.js'
            'app/_bower_components/angular-route/angular-route.js'
            'app/_bower_components/angular-resource/angular-resource.js'
            'app/_bower_components/angular-bootstrap/ui-bootstrap.js'
            'app/_bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
            'app/_bower_components/angular-sanitize/angular-sanitize.js'

            'app/_bower_components/locompleter/locompleter.js'

            'app/_bower_components/webmaker-analytics/analytics.js'
          ]
      app:
        options:
          sourceMap: true
          mangle: false
        files:
          'app/_compiled/app.min.js': 'app/_js/**/*.js'

  grunt.loadNpmTasks "grunt-shell-spawn"
  grunt.loadNpmTasks "grunt-jsbeautifier"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-dom-munger"
  grunt.loadNpmTasks "grunt-autoprefixer"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  # Development server
  grunt.registerTask "server", [
    "less:development"
    "uglify"
    "shell:server"
    "watch:passive"
  ]

  # Default task is development server for b-wds compatibility
  grunt.registerTask "default", [
    "server"
  ]

  # Development server + livereload
  grunt.registerTask "live-server", [
    "clean"
    "copy:reloadInit"
    "shell:reload"
    "watch:reload"
  ]

  # Clean code before a commit
  grunt.registerTask "lint", [
    "jsbeautifier:modify"
    "jshint"
  ]

  # Validate code (read only)
  grunt.registerTask "validate", [
    "jsbeautifier:validate"
    "jshint"
  ]

  # Build for Production
  grunt.registerTask "build", [
    "less:production"
    "uglify"
    "autoprefixer:build"
  ]
  return

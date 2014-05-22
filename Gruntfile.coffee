module.exports = (grunt) ->
  grunt.initConfig
    less:
      options:
        sourceMap: true
        sourceMapBasepath: "app"
        sourceMapRootpath: "/"
      development:
        files:
          "app/compiled/app.ltr.css": "app/less/app.less"
      production:
        files:
          ".static/css/app.ltr.css": "app/less/app.less"
      reload:
        files:
          ".tmp/compiled/app.ltr.css": "app/less/app.less"

    shell:
      server:
        options:
          async: true
        command: 'node server'
      reload:
        options:
          async: true
        command: 'node server path=/../.tmp'

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
          'less/**/*.less'
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
          'img/**/*.*'
          'js/**/*.js'
          'less/**/*.less'
          'partials/**/*.html'
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
          src: "bower_components/**/*.*"
          dest: ".tmp/"
        ]
      stageJS:
        files: [
          expand: true
          cwd: "app"
          src: "js/**/*.js"
          dest: ".tmp/"
        ]
      stagePartials:
        files: [
          expand: true
          cwd: "app"
          src: "partials/**/*.html"
          dest: ".tmp/"
        ]
      stageImages:
        files: [
          expand: true
          cwd: "app"
          src: "img/**/*.*"
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
        src: ".static/css/app.ltr.css"
        dest: "app/compiled/app.ltr.css"

    jshint:
      all: [
        "Gruntfile.js"
        "app/js/**/*.js"
      ]
      options:
        jshintrc: ".jshintrc"

    jsbeautifier:
      modify:
        src: [
          "app/js/**/*.js"
          "app/index.html"
          "app/partials/**/*.html"
        ]
        options:
          config: ".jsbeautifyrc"

      validate:
        src: [
          "app/js/**/*.js"
          "app/index.html"
          "app/partials/**/*.html"
        ]
        options:
          mode: "VERIFY_ONLY"
          config: ".jsbeautifyrc"

  grunt.loadNpmTasks "grunt-shell-spawn"
  grunt.loadNpmTasks "grunt-jsbeautifier"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-dom-munger"
  grunt.loadNpmTasks "grunt-autoprefixer"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"

  # Development server
  grunt.registerTask "server", [
    "less:development"
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
    "autoprefixer:build"
  ]
  return

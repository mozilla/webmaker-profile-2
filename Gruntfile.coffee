module.exports = (grunt) ->
  # Declare all non-minified scripts in load order here:
  scripts =
  [
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
    'app/_bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js'

    'app/_bower_components/locompleter/locompleter.js'
    'app/_bower_components/webmaker-analytics/analytics.js'

    'app/_js/app.js'
    'app/_js/services.js'
    'app/_js/controllers.js'
    'app/_js/filters.js'
    'app/_js/directives.js'
    'app/_js/i18n.js'
  ]

  devScript = ''

  for script in scripts
    script = script.replace('app/', 'user/')
    devScript += "<script src='/" + script + "'></script>"

  prodScript = '<script src="/user/_compiled/app.min.js"></script>'

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
          "app/_compiled/app.ltr.css": "app/_less/app.less"

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
        spawn: false
        livereload: true
        cwd: 'app'
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
        "less:reload"
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
          "app/_partials/**/*.html"
        ]
        options:
          config: ".jsbeautifyrc"

      validate:
        src: [
          "app/_js/**/*.js"
          "app/_partials/**/*.html"
        ]
        options:
          mode: "VERIFY_ONLY"
          config: ".jsbeautifyrc"
    'string-replace':
      production:
        files:
          'app/index.html': 'app/index.template'
        options:
          replacements: [
            {
              pattern: '%_APP_JS_%'
              replacement: prodScript
            },
            {
              pattern: '%_LIVE_RELOAD_%'
              replacement: ''
            }
          ]
      development:
        files:
          'app/index.html': 'app/index.template'
        options:
          replacements: [
            {
              pattern: '%_APP_JS_%'
              replacement: devScript
            },
            {
              pattern: '%_LIVE_RELOAD_%'
              replacement: "<script src=\"//localhost:35729/livereload.js\" id=\"liveReloadScript\"></script>"
            }
          ]
    uglify:
      app:
        options:
          sourceMap: true
          mangle: false
        files:
          'app/_compiled/app.min.js': scripts

  grunt.loadNpmTasks "grunt-shell-spawn"
  grunt.loadNpmTasks "grunt-jsbeautifier"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-autoprefixer"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-string-replace"

  # Development server
  grunt.registerTask "default", [
    "string-replace:development"
    "less:development"
    "shell:server"
    "watch"
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
    "string-replace:production"
    "less:production"
    "uglify"
    "autoprefixer:build"
  ]
  return

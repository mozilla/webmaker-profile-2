module.exports = (grunt) ->
  jshintrc = grunt.file.readJSON('./node_modules/mofo-style/linters/.jshintrc');

  jshintrc.globals =
    angular: false
    phantom: false
    $: false

  testsPassed = false
  scriptsToLint = ["app/_js/**/*.js", "test/phantom.js", "test/reporter.js", "test/runner.js", "test/login.js"]

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
    'app/_bower_components/spiiin/src/spiiin.js'
    'app/_bower_components/webmaker-login-ux/dist/ngWebmakerLogin.js'
    'app/_bower_components/webmaker-login-ux/dist/templates/ngWebmakerLogin.templates.js'
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
        sourceMapRootpath: "/user/"
        sourceMapFilename: "app/_compiled/app.ltr.css.map"
        sourceMapURL: "/user/_compiled/app.ltr.css.map"
      development:
        files:
          "app/_compiled/app.ltr.css": "app/_less/app.less"
      production:
        options:
          cleancss: true
        files:
          "app/_compiled/app.ltr.css": "app/_less/app.less"

    shell:
      server:
        options:
          async: true
        command: 'node server'
      sleep:
        command: 'sleep 5'
      test:
        options:
          callback: (exitCode, stdOutStr, stdErrStr, done) ->
            testsPassed = if exitCode > 0 then false else true
            done()
        command: 'phantomjs test/phantom.js'

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
        "less:development"
      ]

    # todo
    autoprefixer:
      options:
        browsers: ["last 2 versions"]
      build:
        src: "app/_compiled/app.ltr.css"
        dest: "app/_compiled/app.ltr.css"

    jshint:
      all: scriptsToLint
      options: jshintrc

    jsbeautifier:
      modify:
        src: scriptsToLint
        options:
          config: "node_modules/mofo-style/linters/.jsbeautifyrc"

      validate:
        src: scriptsToLint
        options:
          mode: "VERIFY_ONLY"
          config: "node_modules/mofo-style/linters/.jsbeautifyrc"

    jscs:
      src: scriptsToLint
      options:
        config: 'node_modules/mofo-style/linters/.jscsrc'

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
    htmlmin:
      all:
        options:
          collapseWhitespace: true
          minifyCSS: true
        files:
          'app/index.html': 'app/index.html'


  grunt.loadNpmTasks "grunt-shell-spawn"
  grunt.loadNpmTasks "grunt-jsbeautifier"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-autoprefixer"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-string-replace"
  grunt.loadNpmTasks "grunt-contrib-htmlmin"
  grunt.loadNpmTasks "grunt-jscs"

  # Development mode
  grunt.registerTask "default", [
    "string-replace:development"
    "htmlmin"
    "less:development"
    "shell:server"
    "watch"
  ]

  # Clean code before a commit
  grunt.registerTask "clean", [
    "jsbeautifier:modify"
    "jshint"
    "jscs"
  ]

  # Validate code before commit (read only)
  grunt.registerTask "validate", [
    "jsbeautifier:validate"
    "jshint"
    "jscs"
  ]

  # Build for Production
  grunt.registerTask "build", [
    "string-replace:production"
    "htmlmin"
    "less:production"
    "uglify"
    "autoprefixer:build"
  ]

  # This is needed to suppress the exit code returned
  #  from testing until the server is killed
  grunt.registerTask "exit",
    "Make a proper exit based on test results",
    () ->
      if !testsPassed then grunt.fail.warn("Tests failed!", 1)

  # Test
  grunt.registerTask "test", [
    "build"
    "validate"
    "shell:server"
    "shell:sleep" # Allow server to get completely ready
    "shell:test"
    "shell:server:kill"
    "exit"
  ]
  return

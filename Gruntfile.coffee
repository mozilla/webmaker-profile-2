module.exports = (grunt) ->
  grunt.initConfig
    less:
      development:
        files:
          "app/compiled/app.min.ltr.css": "app/less/app.less"

        options:
          sourceMap: true
          sourceMapBasepath: "app"
          sourceMapRootpath: "/"

      production:
        files:
          "app/compiled/app.min.ltr.css": "app/less/app.less"

    watch:
      less:
        files: ["app/less/**/*.less"]
        tasks: ["less:development"]

    shell:
      server:
        options:
          async: true
        command: 'node server'

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

  # Development mode
  grunt.registerTask "default", [
    "less:development"
    "shell"
    "watch"
  ]

  # Clean code before a commit
  grunt.registerTask "clean", [
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
  ]

  return

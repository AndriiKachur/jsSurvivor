/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;*/\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['source/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
      copy: {
          dist: {
              options: {
                  processContentExclude: ['**/*.{png,gif,jpg,ico,psd}'],
                  process: function(text) {
                      return text.replace(/src=["']images\//gi, 'src="dist/');
                  }
              },
              files: [{
                      expand: true,
                      flatten: true,
                      dest: 'dist/',
                      src: [
                          'source/**/*.{ico,png,txt,jpg}',
                          'source/**/*.css'
                      ]
                  },
                  {
                      expand: true,
                      flatten: true,
                      dot: true,
                      dest: '',
                      src: ['source/dev.html'],
                      rename: function() {
                          return 'index.html';
                      }
                  }]
          }
      },
      clean: ['dist', 'index.html', '.tmp'],

      useminPrepare: {
          html: 'index.html',
          options: {
              flow: {
                  html: {
                      steps: {
                          css: ['cssmin']
                      },
                      post: {}
                  }
              }
          }
      },
      usemin: {
          html: ['index.html'],
          css: ['dist/{,*/}*.css'],
          options: {
              assetsDirs: ['dist']
          }
      },
      'http-server': {
          'dev': {
              // the server root directory
              root: '/',
              port: 8282,
              host: "127.0.0.1",
              cache: 5,
              showDir: true,
              autoIndex: true,
              // server default file extension
              ext: "html",
              // run in parallel with other tasks
              runInBackground: true
          }
      },
      connect: {
          dev: {
              port: 1337,
              base: 'source'
          }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-connect');

  // Default task.
  grunt.registerTask('default', ['clean', 'copy:dist', 'useminPrepare', 'jshint', 'concat', 'uglify', 'usemin']);

};

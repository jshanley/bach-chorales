module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8080
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: '*.html'
      },
      js: {
        files: '*.js'
      },
      css: {
        files: '*.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect', 'watch']);
};

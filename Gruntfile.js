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
        files: ['*.html','tests/*.html']
      },
      js: {
        files: 'scripts/**/*.js'
      },
      bwv: {
        files: 'scripts/bwv/**/*.js',
        tasks: ['smash']
      },
      css: {
        files: '*.css'
      }
    },

    smash: {
      together: {
        src: 'scripts/bwv/index.js',
        dest: 'scripts/bwv-bundled.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-smash');

  grunt.registerTask('default', ['smash', 'connect', 'watch']);
  grunt.registerTask('build', ['smash'])
};

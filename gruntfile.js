module.exports = function(grunt) {
  
  grunt.initConfig({
    copy: {
      main: {
        files: [
          { 
            expand: true, 
            src: [
              'popup.html',
              'manifest.json',
              'images/icon-16.png',
              'images/icon-24.png',
              'images/icon-32.png',
              'images/icon-48.png',
              'images/icon-128.png',
              'images/league-icons.png',
              'images/links-bg.png',
              'images/loading.gif'
            ], 
            dest: 'release/'
          }
        ],
      },
    },
    cssmin: {
      target: {
        files: {
          'release/css/main.min.css': 'css/main.css'
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'release/js/popup.js': 'build/js/popup.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

};
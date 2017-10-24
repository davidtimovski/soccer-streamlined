module.exports = function(grunt) {
  
  grunt.initConfig({
    copy: {
      debug: {
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
              'images/loading.gif',
              'css/main.css'
            ], 
            dest: 'debug/'
          }
        ]
      },
      release: {
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
        ]
      }
    },
    cssmin: {
      target: {
        files: {
          'release/css/main.css': 'css/main.css'
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'release/js/popup.js': 'debug/js/popup.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('copydebug', 'copy:debug');
  grunt.registerTask('copyrelease', 'copy:release');

};
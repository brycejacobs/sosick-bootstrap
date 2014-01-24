/*
 * Gruntfile.js
 */

'use strict';

var path = require('path');
var project = require('./project');

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    project: project,
    cacheBust: {
      dist: {
        files: {
          src: [
            '<%= project.path.dist %>/index.html'
          ]
        }
      }
    }
  });

  // Default
  grunt.registerTask('default', 'cacheBust:dist');
};

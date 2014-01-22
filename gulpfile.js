// Include gulp
var gulp = require('gulp'),

// Include Our Plugins
sass       = require('gulp-sass'),
lr         = require('tiny-lr'),
livereload = require('gulp-livereload'),
server     = lr()
;

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src(['app/styles/main.scss'])
  .pipe(sass({
    includePaths: ['./app/bower_components', './app/styles/flat-ui', './app/styles', './app/styles/flat-ui/modules'],
    sourcemap : true
  })
  )
  .pipe(gulp.dest('./.tmp/styles'))
  .pipe(livereload(server));
});

// Default Task
gulp.task('default', function(){
  gulp.run('sass');
    // Watch For Changes To Our SCSS
    server.listen(35729, function (err) {
      if (err) { return console.log(err); }

      gulp.watch('app/**/*.html', function (evt) {
        server.changed({
          body: {
            files: [evt.path]
          }
        });
      });

      gulp.watch('app/styles/**/*.scss', function(){
        gulp.run('sass');
      });
    });
  });
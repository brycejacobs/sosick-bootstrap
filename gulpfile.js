// Include gulp
var gulp = require('gulp'),

// Include Our Plugins
sass       = require('gulp-sass'),
lr         = require('tiny-lr'),
livereload = require('gulp-livereload'),
html2js  = require('gulphtml2js'),
server     = lr();

var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var clean = require('gulp-clean');
var cssMin = require('gulp-minify-css');
var bower = require('gulp-bower');
var bump = require('gulp-bump');

var project = require('./project');
var production = false;

gulp.task('prepareDeploy', function () {
  production = true;
});

gulp.task('build',
  [
    'prepareDeploy',


  ]);

gulp.task('bump', function(){
  return gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bower', function () {
  bower();
});

gulp.task('cssmin', function () {
  return gulp.src(project.path.dist + '/css/**/*.css')
    .pipe(cssMin())
    .pipe(project.path.dist + '/css/');
});

gulp.task('distClean', function () {
  return gulp.src(project.path.dist, {read: false})
    .pipe(clean(), {force: true});
});

gulp.task('distUglify', function () {
  return gulp.src([project.path.client + '/**/*.js', !project.path.client + '/lib/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(project.path.dist + '/js/'))
});

gulp.task('html2js', function () {
  return gulp.src(project.path.client + '/**/*.tpl.html')
    .pipe(html2Js())
    .pipe(gulpIf(production, concat('templates.js')))
    .pipe(gulpIf(production, gulp.dest(project.path.client + '/templates')))
    .pipe(gulpIf(!production, gulp.dest(project.path.dist + '/templates')));
});

gulp.task('imagemin', function () {
  return gulp.src(project.path.client + '/img/**/*.{png,jpeg,gif}')
    .pipe(imagemin())
    .pipe(gulp.dest(project.path.dist + '/img'));
});

gulp.task('jshintclient', function () {
  return gulp.src(project.path.client + '/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('jshintserver', function () {
  return gulp.src(project.path.server + '/**/*.js')
    .pipe(jshint('.jshint-server'))
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src([project.path.client + '/**/*.scss'])
  .pipe(sass({
    includePaths: [project.path.client + '/lib'],
    sourcemap : true
  }))
  .pipe(concat('styles.css'))
  .pipe(gulp.dest(project.path.client + '/css/'))
  .pipe(livereload(server));
});

gulp.task('tempClean', function () {
  return gulp.src(project.path.temp, {read: false})
    .pipe(clean(), {force: true});
});

gulp.task('usemin', function() {
  gulp.src(project.path.client + '/*.html')
    .pipe(usemin({
      cssmin: false,
      htmlmin: true,
      jsmin: false
    }))
    .pipe(gulp.dest(project.path.dist));
});

// Default Task
gulp.task('default', function(){
  gulp.run('sass');
  // Watch For Changes To Our SCSS
  server.listen(35729, function (err) {
    if (err) { return console.log(err); }

    gulp.watch(project.path.client + '/**/*.tpl.html', function (evt) {
      server.changed({
        body: {
          files: [evt.path]
        }
      });
    });

    gulp.watch('<%= project.path.client %>/**/*.scss', function(){
      gulp.run('sass');
    });
  });
});

gulp.task('deploy', [
  'heroku:copy',
  'build',
  'repopush',
  'githubcopy'

]);


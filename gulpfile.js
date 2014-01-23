// Include gulp
var gulp = require('gulp'),

// Include Our Plugins
sass       = require('gulp-sass'),
lr         = require('tiny-lr'),
livereload = require('gulp-livereload'),
html2js  = require('gulphtml2js'),
server     = lr(),
minifyHtml = require('gulp-minify-html'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
gulpIf = require('gulp-if'),
clean = require('gulp-clean'),
cssMin = require('gulp-minify-css'),
bower = require('gulp-bower'),
bump = require('gulp-bump'),
git  = require('gulp-git'),

require('gulp-grunt')(gulp);

var project = require('./project');
var production = false;


gulp.task('bump', function(){
  return gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bower', function () {
  bower();
});

gulp.task('bowerCopy', function () {
  return gulp.src(['es5-shim/es5-shim.js', 'json3/lib/json3.js', 'modernizr/modernizr.js'], {base: project.path.bower, read: false})
    .pipe(gulp.if(!production, gulp.dest(project.path.temp + '/js/vendor')))
    .pipe(gulp.if(production, gulp.dest(project.path.dist + '/js/vender')));
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
  return gulp.src([project.path.client + '/**/*.js', '!' + project.path.client + '/lib/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(project.path.dist + '/js/'))
});

gulp.task('gitCopy', function () {
  return gulp.src('.gitignore-github')
    .pipe('.gitignore', {force: true});
});

gulp.task('herokuCopy', function () {
  return gulp.src('.gitignore-heroku')
    .pipe('.gitignore', {force: true});
});

gulp.task('herokupush', function () {
  return gulp.src('./*')
  .pipe(git.commit('Work to repo'))
  .pipe(git.push('heroku', 'master'));
});

gulp.task('html2js', function () {
  return gulp.src(project.path.client + '/**/*.tpl.html')
    .pipe(html2Js())
    .pipe(gulpIf(production, concat('templates.js')))
    .pipe(gulpIf(production, gulp.dest(project.path.client + '/templates')))
    .pipe(gulpIf(!production, gulp.dest(project.path.dist + '/templates')));
});

gulp.task('htmlCopy', function () {
  return gulp.src(['/index.html'], {base: project.path.client, read: false})
    .pipe(gulp.dest(project.path.temp));
});

gulp.task('htmlmin', function () {
  return gulp.src(project.path.client + '/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest(project.path.dist));
});

gulp.task('imagemin', function () {
  return gulp.src(project.path.client + '/img/**/*.{jpeg, jpg, png, gif}')
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

gulp.task('miscCopy', function () {
  return gulp.src(['/*.{ico, txt}'], {base: project.path.client})
    .pipe(gulp.dest(''))
});

gulp.task('nodemon', function () {
  nodemon({ script: project.path.server, options: '--harmony-generators -e js' })
    .on('restart', ['jshintserver'])
    .on('crash', ['restart']);
});

gulp.task('prepareDeploy', function () {
  production = true;
});

gulp.task('restart', function () {
  nodemon.emit('restart');
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

gulp.task('build', [
  'herokuCopy',
  'prepareDeploy',
  'distClean',
  'miscCopy',
  'bowerCopy',
  'jshintserver',
  'jshintclient',
  'imagemin',
  'htmlmin',
  'cssmin',
  'uglify',
  'usemin',
]);

gulp.task('devBuild', [
  'tempClean',
  'htmlCopy',
  'bowerCopy'
]);

// Default Task
gulp.task('default', function(){
  gulp.run('sass');
  gulp.run('nodemon');
  // Watch For Changes To Our SCSS
  server.listen(35729, function (err) {
    if (err) { return console.log(err); }

    gulp.watch(project.path.client + '/**/*.tpl.html', function (evt) {
      server.changed({
        body: {
          files: [evt.path]
        }
      });
      gulp.run('html2js');
    });

    gulp.watch('<%= project.path.client %>/**/*.scss', function(){
      gulp.run('sass');
    });
  });
});

gulp.task('deploy', [
  'copy:heroku',
  'bump',
  'build',
  'repopush',
  'githubcopy'
]);


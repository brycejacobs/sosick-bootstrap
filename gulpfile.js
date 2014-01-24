// Include gulp
var gulp = require('gulp'),

// Include Our Plugins
sass       = require('gulp-sass'),
lr         = require('tiny-lr'),
livereload = require('gulp-livereload'),
html2Js  = require('gulp-html2js'),
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
nodemon = require('gulp-nodemon'),
jshint = require('gulp-jshint'),
imagemin = require('gulp-imagemin'),
usemin = require('gulp-usemin'),
browserify = require('gulp-browserify');

var project = require('./project');
var dist = false;


gulp.task('bump', function(){
  return gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bower', function () {
  bower();
});

gulp.task('browserify', function () {
  return gulp.src([project.path.client + '/*{.js, */*.js}'])
      .pipe(jshint('.jshintrc'))
      .pipe(browserify({
        debug: !dist,
        shim: {
          angularLocalStorage: {
              path: project.path.bower + '/angularLocalStorage/src/angularLocalStorage.js',
              exports: 'angularLocalStorage'
          },
          modernizr: {
            path: project.path.bower + '/modernizr/modernizr.js',
            exports: 'modernizr'
          },
          'es5-shim': {
            path: project.path.bower + '/es5-shim/es5-shim.js',
            exports: 'es5-shim'
          },
          json3: {
            path: project.path.bower + '/json3/lib/json3.js',
            exports: 'json3'
          }
        }
      }))
      .pipe(concat('app.js'))
      .pipe(gulpIf(dist, uglify()))
      .pipe(gulp.dest(project.path.dist + '/js/'))
      .pipe(livereload(server));
});

gulp.task('cssmin', function () {
  return gulp.src(project.path.dist + '/css/*{.css, */*.css}')
    .pipe(concat('styles.css'))
    .pipe(cssMin())
    .pipe(gulp.dest(project.path.dist + '/css'));
});

gulp.task('distClean', function () {
  return gulp.src([project.path.dist, project.path.bower], {read: false})
    .pipe(clean(), {force: true});
});

gulp.task('gitCopy', function () {
  return gulp.src('.gitignore-github')
    .pipe(gulp.dest('.gitignore'), {force: true});
});

gulp.task('herokuCopy', function () {
  return gulp.src('.gitignore-heroku')
    .pipe(gulp.dest('.gitignore'), {force: true});
});

gulp.task('herokupush', function () {
  return gulp.src('./*')
  .pipe(git.commit('Work to repo'))
  .pipe(git.push('heroku', 'master'));
});

gulp.task('html2js', function () {
  return gulp.src(project.path.client + '/**/*.tpl.html')
    .pipe(html2Js())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(project.path.client));
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
  return gulp.src([
    project.path.client + '/*{.js, */*.js}',
    '!' + project.path.client + '/templates.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('jshintserver', function () {
  return gulp.src(project.path.server + '/*{.js, */*.js}')
    .pipe(jshint('.jshint-server'))
    .pipe(jshint.reporter('default'));
});

gulp.task('miscCopy', function () {
  gulp.src(['/*.{ico, txt}'], {base: project.path.client})
    .pipe(gulp.dest(project.path.dist));

  gulp.src(['/img/*.svg'], {base: project.path.client})
    .pipe(gulp.dest(project.path.dist + '/img/'));
});

gulp.task('nodemon', function () {
  nodemon({ script: project.path.server, options: '--harmony-generators -e js' })
    .on('restart', ['jshintserver']);
});

gulp.task('distFlag', function () {
  production = true; //mainly to tell uglify() not to run.
});

gulp.task('restart', function () {
  nodemon.emit('restart');
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src([project.path.client + '/*{.scss, */*}.scss'])
  .pipe(sass({
    includePaths: [project.path.client + '/lib'],
    sourcemap : true
  }))
  .pipe(concat('styles.css'))
  .pipe(gulp.dest(project.path.dist + '/css/'))
  .pipe(livereload(server));
});

gulp.task('build', [
  'distFlag',
  'distClean',
  'miscCopy',
  'bowerCopy',
  'jshintserver',
  'jshintclient',
  'imagemin',
  'htmlmin',
  'cssmin',
  'distUglify',
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
  gulp.run('html2js');
  gulp.run('jshintclient');
  gulp.run('jshintserver');
  // gulp.run('nodemon');
  // Watch For Changes To Our SCSS
  server.listen(35729, function (err) {
    if (err) { return console.log(err); }

    gulp.watch(project.path.client + '/**/*.tpl.html', function () {
      // server.changed({
      //   body: {
      //     files: [evt.path]
      //   }
      // });
      gulp.run('html2js');
    });

    gulp.watch(project.path.client + '/*{.scss, */*.scss}', function(){
      gulp.run('sass');
    });

    gulp.watch(project.path.client + '/*{.js, */*.js}', function () {
      gulp.run('browserify');
    });
  });
});

gulp.task('deploy', [
  'herokuCopy',
  'bump',
  'build',
  'repopush',
  'githubcopy'
]);


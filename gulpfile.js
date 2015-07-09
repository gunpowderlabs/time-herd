var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var slm = require('gulp-slm');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var amdOptimize = require('amd-optimize');

var paths = {
  js: ['./app/js/**/*.js'],
  html: ['./app/templates/**/*.slim'],
  sass: ['./app/scss/**/*.scss'],
};

gulp.task('build', ['sass', 'js', 'html']);

gulp.task('default', ['build']);

gulp.task('js', function(done) {
  gulp.src(paths.js)
    .pipe(babel({modules: 'amd'}))
    .pipe(amdOptimize('app', {}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('html', function(done) {
  gulp.src(paths.html)
    .pipe(slm())
    .pipe(gulp.dest('./www/templates/'))
    .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src('./app/scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.html, ['html']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

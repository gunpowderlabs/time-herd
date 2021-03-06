var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var concatSourcemap = require('gulp-concat-sourcemap');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var slm = require('gulp-slm');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var amdOptimize = require('amd-optimize');
var through = require("through2");
var merge = require("merge-stream");
var watch = require("gulp-watch");

var paths = {
  js: ['./app/js/**/*.js'],
  spec: ['./spec/**/*.js'],
  html: ['./app/templates/**/*.slim'],
  sass: ['./app/scss/**/*.scss'],
};

function libraries() {
  return {
    ionic: "www/lib/ionic/js/ionic.bundle",
    "ng-cordova": "www/lib/ngCordova/dist/ng-cordova",
    uri: "www/lib/uri.js/src/URI",
    chance: "www/lib/chance/chance",
    firebase: "www/lib/firebase/firebase",
    angularfire: "www/lib/angularfire/dist/angularfire",
    "angular-svg-round-progressbar": "www/lib/angular-svg-round-progressbar/build/roundProgress",
    sugarjs: "www/lib/sugarjs/release/sugar-full.development",
    "ng-autofocus": "www/lib/ng-autofocus/dist/ng-autofocus",
    "ng-audio": "www/lib/ngAudio/app/angular.audio",
    almond: "www/lib/almond/almond",
    "angular-mocks": "www/lib/angular-mocks/angular-mocks",
    bacon: "www/lib/bacon/dist/Bacon",
    "angular-mask": "www/lib/angular-mask/dist/ngMask"
  }
}

var shims = {
  ionic: {
    exports: "angular.module('ionic')",
  },
  "angular-mocks": {
    deps: ['ionic'],
  },
  "angular-mask": {
    deps: ['ionic'],
    exports: "angular.module('ngMask')",
  },
  angularfire: {
    deps: ['firebase'],
    exports: "angular.module('firebase')",
  },
  firebase: {
    exports: "Firebase",
  },
  'angular-svg-round-progressbar': {
    exports: "angular.module('angular-svg-round-progress')",
  },
  'ng-autofocus': {
    exports: "angular.module('ng-autofocus')",
  },
  'ng-audio': {
    exports: "angular.module('ngAudio')",
  },
  'ng-cordova': {
    exports: "angular.module('ngCordova')",
  },
};

gulp.task('build', ['sass', 'js', 'html']);

gulp.task('default', ['build']);

gulp.task('js', function(done) {
  gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({modules: 'amd'}))
    .pipe(amdOptimize('app', {paths: libraries(), shim: shims}))
    .pipe(concatSourcemap('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

function gatherModuleNames() {
  return through.obj(function(file, encoding, done) {
    if (file.isBuffer()) {
      var moduleName = file.relative.replace(/\.js$/, '');
      file.contents = new Buffer("import '" + moduleName + "';");
    }
    done(null, file);
  });
}

gulp.task('js-spec', function(done) {
  var specLibraries = libraries();
  specLibraries.app = "empty:";
  var specModules = gulp.src(paths.spec)
    .pipe(gatherModuleNames())
    .pipe(concat("specs"));

  merge(gulp.src(paths.spec), specModules)
    .pipe(sourcemaps.init())
    .pipe(babel({modules: "amd"}))
    .pipe(amdOptimize("specs", {paths: specLibraries, shim: shims}))
    .pipe(concatSourcemap("specs.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./tmp"))
    .on("end", done);
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
  watch(paths.sass, {ignoreInitial: false}, function() { gulp.start('sass') });
  watch(paths.js, {ignoreInitial: false}, function() { gulp.start('js') });
  watch(paths.spec, {ignoreInitial: false}, function() { gulp.start('js-spec') });
  watch(paths.html, {ignoreInitial: false}, function() { gulp.start('html') });
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

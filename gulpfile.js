var gulp = require('gulp')
  , shell = require('gulp-shell')
  , browserSync = require('browser-sync').create()
  , reload = browserSync.reload;

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var sass = require('gulp-sass'),
    combineMq = require('gulp-combine-mq'),
    csso = require('gulp-csso'),
    cleanCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss'),
    uncss = require('uncss').postcssPlugin,
    importCss = require('postcss-import'),
    reporter = require('postcss-reporter'),
    immutableCss = require('immutable-css');

gulp.task('styles', function(){
  gulp.src(['css/tachyons/src/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({
      precision: 4,
    }))
    .pipe(autoprefixer({
      browsers: ['>= 0%'],
    }))
    .pipe(gulp.dest('css/tachyons/dist/'))
    .pipe(combineMq({
  		beautify: true,
  	}))
    .pipe(cleanCss({

    }))
    .pipe(csso({
      debug: true,
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css/tachyons/dist/min/'))
});


// Task for building blog when something changed:
gulp.task('build', shell.task(['bundle exec jekyll build --watch']));
// Or if you don't use bundle:
// gulp.task('build', shell.task(['jekyll build --watch']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({
      server: { baseDir: '_site/' }
    });
    // Reloads page when some of the already built files changed:
    gulp.watch('_site/**/*.*').on('change', reload);
});

gulp.task('default', ['build', 'styles', 'serve']);

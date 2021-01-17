var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var copy = require('gulp-copy');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var replace = require('gulp-replace');

var stylesheets = [
    '**/*.scss'
];

// converts sass into final stylesheet file
gulp.task('sass', function () {
    return gulp
        .src('sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: stylesheets
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});

// serve up using browsersync
gulp.task('serve', function() {
    browserSync.init({ server: '.' });

    // watch files and build/reload where needed
    gulp.watch(['**/*.scss'], ['sass']);
    gulp.watch('**/*.html').on('change', browserSync.reload);
});

var filesToMove = [
    './css/**/*.*',
    './js/**/*.*',
    './img/**/*.*'
];

gulp.task('build-prod', ['sass'], function() {
    gulp.src('dist', {read: false}).pipe(clean());

    gulp.src(filesToMove, { base: './' }).pipe(gulp.dest('dist'));

    gulp.src(['index.html']).pipe(replace('{TIMESTAMP}', Date.now())).pipe(gulp.dest('dist/'));
});

// when running `gulp build` for a static build
gulp.task('build', ['sass']);

// when running `gulp` to build, watch and re-build
gulp.task('default', ['build', 'serve']);
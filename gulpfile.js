// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
//var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');




gulp.task('minify-js', function() {
    gulp.src(['./dev/**/*.js', '!./dev/vendors/**'])

        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./app'))
});

gulp.task('copy-vendors', function () {
    gulp.src(['./dev/vendors/**'])
        .pipe(gulp.dest('dist/vendors'));
});

gulp.task('clean', function() {
    gulp.src(['./dist/*'])
        .pipe(clean({force: true}));
});

gulp.task('connect-dev', function () {
    connect.server({
        root: 'dev/',
        port: 5555
    });
});

gulp.task('connect-build', function () {
    connect.server({
        root: 'app/',
        port: 7777
    });
});



gulp.task('default', ['connect-dev']);

gulp.task('build', function() {
    runSequence(
        ['clean'],
        ['copy-vendors', 'copy-assets', 'minify-css', 'minify-js', 'copy-html-files', 'connect-build']
    );
});
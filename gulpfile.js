// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
//var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
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


gulp.task('concat', function() {
    return gulp.src(
        [
            './dev/atomicBase/Database.js',
            './dev/atomicBase/DatabaseUtilities.js',
            './dev/atomicBase/RefRegistrator.js',
            './dev/atomicBase/ValueHandler.js',
            './dev/atomicBase/Schema.js',
            './dev/atomicBase/SchemaUtilities.js',
            './dev/atomicBase/Query.js',
            './dev/atomicBase/AtomicArray.js',
            './dev/atomicBase/AtomicObject.js',
            './dev/atomicBase/AtomicPriority.js',
            './dev/atomicBase/AtomicFile.js',
            './dev/atomicBase/Server.js'
        ])
        .pipe(concat('atomicBase.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-concat', function() {
    gulp.src(['./dist/*.js'])

        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build-dist', function() {
    runSequence(
        ['clean'],
        ['concat'],
        ['minify-concat']
    );
});



gulp.task('default', ['connect-dev']);

gulp.task('build', function() {
    runSequence(
        ['clean'],
        ['copy-vendors', 'copy-assets', 'minify-css', 'minify-js', 'copy-html-files', 'connect-build']
    );
});
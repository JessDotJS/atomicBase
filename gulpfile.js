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




gulp.task('minify', function() {
    gulp.src(['./dist/*.js'])

        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('concat', function() {
    return gulp.src(
        [
            './dev/vendors/atomicBase/Database.js',
            './dev/vendors/atomicBase/DatabaseUtilities.js',
            './dev/vendors/atomicBase/RefRegistrator.js',
            './dev/vendors/atomicBase/ValueHandler.js',
            './dev/vendors/atomicBase/Schema.js',
            './dev/vendors/atomicBase/SchemaUtilities.js',
            './dev/vendors/atomicBase/Query.js',
            './dev/vendors/atomicBase/AtomicArray.js',
            './dev/vendors/atomicBase/AtomicObject.js',
            './dev/vendors/atomicBase/AtomicPriority.js',
            './dev/vendors/atomicBase/AtomicFile.js',
            './dev/vendors/atomicBase/Server.js'
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

gulp.task('clean', function() {
    gulp.src(['./dist/*'])
        .pipe(clean({force: true}));
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
        ['concat'],
        ['minify']
    );
});
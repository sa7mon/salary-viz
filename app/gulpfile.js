const gulp   = require('gulp');
const pump   = require('pump');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel  = require('gulp-babel');
const uglifycss = require('gulp-uglifycss');

gulp.task('app-js', function(cb) {
    pump([
        gulp.src(['src/js/index.js']),
        concat('app.min.js'),
        gulp.dest('dist/js/'),
        babel({
            presets: ['env']
        }),
        uglify(),
        gulp.dest('dist/js/')
    ], cb);
});

gulp.task('app-css', function(cb) {
    pump([
        gulp.src(['src/css/*.css']),
        concat('app.min.css'),
        uglifycss(),
        gulp.dest('dist/css/')
    ], cb); 
});

gulp.task('watch-js', function () {
    gulp.watch(['src/js/*.js'], gulp.series('app-js'));
});

gulp.task('default', gulp.series('app-js'), function() {});
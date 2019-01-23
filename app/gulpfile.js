const gulp   = require('gulp');
const pump   = require('pump');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel  = require('gulp-babel');
const uglifycss = require('gulp-uglifycss');
const { series, parallel} = require('gulp');

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

gulp.task('vendor-js', function(cb) {
    pump([
        gulp.src([
            'node_modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
            'node_modules/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js',
            'node_modules/datatables.net-responsive/js/dataTables.responsive.min.js',
            'node_modules/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js'
        ]),
        concat('vendor.min.js'),
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

gulp.task('watch', function () {
    gulp.watch(['src/js/*.js'], gulp.series('app-js'));
    gulp.watch(['src/css/*.css'], gulp.series('app-css'));
});

gulp.task('default', gulp.series(parallel('app-js', 'app-css')), function() {});
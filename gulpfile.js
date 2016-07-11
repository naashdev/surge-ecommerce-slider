var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browsersync = require('browser-sync');

gulp.task('dist-build', function(){

  gulp.src(['src/js/surgeSlider.js'])
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({
			suffix: '.min',
			extname: '.js'
		}))
    .pipe(gulp.dest('dist/js/'))

  gulp.src('src/js/surgeSlider.js')
  	.pipe(gulp.dest('dist/js/'));

  /*gulp.src('src/js/lib/modernizr.custom.js')
    .pipe(gulp.dest('dist/js/lib/'));*/

  gulp.src('src/css/core.css')
    .pipe(gulp.dest('dist/css/'));

});

gulp.task('watch', function(){
    // Start BrowserSync Server
    browsersync.init({
        server: "./"
    });

    // Watch Files
    gulp.watch('src/js/*.js').on('change', browsersync.reload);
    gulp.watch("index.html").on('change', browsersync.reload);
});

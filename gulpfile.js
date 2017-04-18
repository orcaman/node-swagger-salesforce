const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const babel = require('gulp-babel');

gulp.task('default', () => {
    gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'));

    return gulp
        .src('./templates/**')
        .pipe(gulpCopy('dist'));
});
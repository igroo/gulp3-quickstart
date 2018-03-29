var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var del = require('del');

var paths = {
    html: 'src/index.html',
    css: 'src/styles.css',
    scripts: ['src/app/**/*.js'],
    images: 'src/assets/images/**/*',
    vendor: 'src/assets/vendor/**/*'
};

// Not all tasks need to use streams 
// A gulpfile is just another node program and you can use any package available on npm 
gulp.task('clean-all', function () {    
    return del(['dist']);
});

//-----------------------------
// HTML
//-----------------------------
gulp.task('clean-html', () => {
    return del.sync(['./dist/index.html'], { force: true });
});

gulp.task('html', ['clean-html'], () => {
    return gulp.src([paths.html])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

//-----------------------------
// CSS
//-----------------------------
gulp.task('clean-css', () => {
    return del.sync(['./dist/styles.css'], { force: true });
});

gulp.task('css', ['clean-css'], () => {
    return gulp.src([paths.css])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist'));
});


//-----------------------------
// SCRIPTS
//-----------------------------
gulp.task('clean-scripts', () => {
    return del.sync(['./dist/all.min.js'], { force: true });
});

gulp.task('scripts', ['clean-scripts'], () => {
    // Minify and copy all JavaScript (except vendor scripts) 
    // with sourcemaps all the way down 
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

//-----------------------------
// IMAGES
//-----------------------------
gulp.task('clean-images', () => {
    return del.sync(['./dist/assets/images/**/*'], { force: true });
});

// Copy all static images 
gulp.task('images', ['clean-images'], function () {
    return gulp.src(paths.images)
        // Pass in options to the task 
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest('dist/assets/images'));
});


//-----------------------------
// VENDOR
//-----------------------------
gulp.task('clean-vendor', () => {
    return del.sync(['./dist/assets/vendor/**/*'], { force: true });
});

// Copy all static vendor js
gulp.task('vendor', ['clean-vendor'], function () {
    return gulp.src(paths.vendor)
        .pipe(gulp.dest('dist/assets/vendor'));
});

//-----------------------------
// WATCH
//-----------------------------
// Rerun the task when a file changes 
gulp.task('watch', function () {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.vendor, ['vendor']);
});

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['clean-all', 'watch', 'html', 'css', 'scripts', 'images', 'vendor']);
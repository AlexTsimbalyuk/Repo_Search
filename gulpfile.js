'use strict';

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    cssmin      = require('gulp-minify-css'),
    rimraf      = require('rimraf'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload;

var path = {
    build: {
        fonts:  'build/fonts/',
        js:     'build/js/',
        libs:   'build/libs/',
        css:    'build/css/',
        html:   'build/'
    },
    src: {
        fonts:  'src/fonts/**/*.*',
        js:     'src/js/*.js',
        libs:   'src/libs/**/*.js',
        style:  'src/style/*.scss',
        html:   'src/index.html'
    },
    watch: {
        fonts:  'src/fonts/**/*.*',
        js:     'src/js/*.js',
        libs:   'src/libs/**/*.js',
        style:  'src/style/*.scss',
        html:   'src/index.html'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 7000,
    logPrefix: "alex_tsimbalyuk"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('libs:build', function () {
    gulp.src(path.src.libs) 
        .pipe(sourcemaps.init())
        .pipe(uglify()) 
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.libs))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'fonts:build',
    'js:build',
    'libs:build',
    'style:build',
    'html:build'
]);

gulp.task('watch', function(){
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });    
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.libs], function(event, cb) {
        gulp.start('libs:build');
    });    
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });    
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);
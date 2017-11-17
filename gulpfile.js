let gulp       = require('gulp');
let sass       = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let autopfx    = require('gulp-autoprefixer');
let sassdoc    = require('sassdoc');
let jshint     = require('gulp-jshint');
let concat     = require('gulp-concat');
let uglify     = require('gulp-uglify');
let rename     = require('gulp-rename');
let csslint    = require('gulp-csslint');
let htmlhint   = require("gulp-htmlhint");
let stripDebug = require('gulp-strip-debug');
let cleanCSS   = require('gulp-clean-css');
let imagemin   = require('gulp-imagemin');
let livereload = require('gulp-livereload');


//HTML Lint
gulp.task('html-lint', function(){
  gulp.src('./src/*.html')
    .pipe(htmlhint())
})

//Minify images
gulp.task('images', function(){
  gulp.src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
})


/*
// all SCSS/CSS tasks 
*/

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/scss/styles.scss') //or scss/*.scss
        .pipe(sass())
        .pipe(gulp.dest('dist/css/'));
});

//CSS Lint
gulp.task('css-lint', function() {
    gulp.src('dist/css/*.css')
      //.pipe(autopfx())
      .pipe(csslint())
      .pipe(csslint.formatter());
});

//sassdoc
gulp.task('sassdoc', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sassdoc());
});

//minify CSS
gulp.task('minify-css', () => {
  return gulp.src('dist/css/*.css')
    //.pipe(sourcemaps.init())
    .pipe(cleanCSS({debug: true, compatibility: 'ie8'}, function(details) {
      console.log(details.name + ' has been reduced from ' + details.stats.originalSize + ' Byte to ' + details.stats.minifiedSize + ' Byte.')     
    }))
    //.pipe(sourcemaps.write())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('dist/css/'));
});

//all in one
gulp.task('styles', ['sass', 'css-lint', 'minify-css']);

/*
// *end* all SCSS/CSS tasks 
*/

/*
// all JS tasks 
*/

// JS Lint Task
gulp.task('js-lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('js-minify', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//all in one
gulp.task('scripts', ['js-lint', 'js-minify']);

/*
// *end* all JS tasks 
*/

/*
** Tasks
*/
//this task watches files for changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/js/*.js', ['js-lint']);
    gulp.watch('src/scss/*.scss', ['sass', 'css-lint']);
    gulp.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('build', ['html-lint', 'styles', 'scripts', 'images']);
gulp.task('default', ['watch']);
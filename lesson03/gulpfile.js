"use strict";
const gulp = require('gulp');
const gulpIgnore = require('gulp-ignore');
const bower = require('gulp-bower');
const bowerMain = require('bower-main');
const clean = require( 'gulp-clean' );
const argv = require('yargs').argv;
const parseArgs = require('minimist');
const gulpif = require('gulp-if');
const gitmodified = require('gulp-gitmodified');
const debug = require( 'gulp-debug' );
const runSequence = require('run-sequence');
const htmlhint = require("gulp-htmlhint");
const csscomb = require('gulp-csscomb');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const iconfont = require('gulp-iconfont');
const runTimestamp = Math.round(Date.now()/1000);
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();

const config = {
  isDevelopment: !argv.production,
  all: argv.all
};

const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/styles/',
    img: 'build/img/',
    libs: 'build/libs/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    css: 'src/styles/*.less',
    img: 'src/images/**/*.{png,jpg}',
    svg: 'src/images/**/*.svg'
  },
  clean: './build'
};

gulp.task('bower', () => {
  return bower('libs');
});

gulp.task('libs', () => {
  return gulp.src( bowerMain( 'js', 'min.js' ).minified, { base: './libs' })
  .pipe(gulp.dest(path.build.libs))
});

gulp.task('html:build', () => {
  return gulp.src(path.src.html)
  .pipe(gulpIgnore.exclude(['node_modules', 'libs']))
  .pipe(gulpif(!config.isDevelopment, htmlmin({collapseWhitespace: true})))
  .pipe(gulp.dest(path.build.html))
  .pipe(browserSync.reload({stream: true}))
  .on('error', handleError);
});

gulp.task('css:build', () => {
  return gulp.src(path.src.css)
  .pipe(gulpif(config.isDevelopment, sourcemaps.init()))
  .pipe(concat('style.min.css'))
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(cssmin())
  .pipe(gulpif(config.isDevelopment, sourcemaps.write()))
  .pipe(gulp.dest(path.build.css))
  .pipe(browserSync.reload({stream: true}))
  .on('error', handleError);
});

gulp.task('js:build', () => {
  return gulp.src(path.src.js)
  .pipe(gulpif(config.isDevelopment, sourcemaps.init()))
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulpif(config.isDevelopment, sourcemaps.write()))
  .pipe(gulp.dest(path.build.js))
  .pipe(browserSync.reload({stream: true}))
  .on('error', handleError);
});

gulp.task('images:build', () => {
  return gulp.src(path.src.img)
  .pipe(gulpIgnore.exclude(['node_modules', 'libs']))
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
  }))
  .pipe(gulp.dest(path.build.img));
});

gulp.task('iconfont:build', () => {
  return gulp.src([path.src.svg])
  .pipe(iconfont({
    fontName: 'myfont',
    normalize: true,
    prependUnicode: true,
    formats: ['ttf', 'eot', 'woff'],
    timestamp: runTimestamp
  }))
  .on('glyphs', function(glyphs, options) {
    console.log(glyphs, options);
  })
  .pipe(gulp.dest(path.build.fonts));
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: "build",
    }
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('watch', () => {
  gulp.watch([path.src.html], ['html:build', 'bs-reload']);
  gulp.watch([path.src.css], ['css:build']);
  gulp.watch([path.src.js], ['js:build']);
  gulp.watch([path.src.img], ['images:build']);
});

gulp.task('build', () => {
  runSequence('clean', 'libs', ['html:build', 'css:build', 'js:build', 'images:build', 'iconfont:build']);
});

gulp.task('dev', () => {
  runSequence('build', 'style', ['watch', 'serve']);
});

gulp.task('default', ['build']);

//CODESTYLE

gulp.task('csscomb', () => {
  return gulp.src(path.src.css)
  .pipe(debug({title: 'csscomb:'}))
  .pipe(gulpif(!config.all, gitmodified('modified')))
  .pipe(csscomb().on('error', handleError))
  .pipe(gulp.dest((file) => {
    return file.base;
  }));
});

gulp.task('htmlhint', () => {
  return gulp.src(path.src.html)
  .pipe(debug({title: 'htmlhint:'}))
  .pipe(htmlhint('.htmlhintrc'))
  .pipe(htmlhint.reporter())
});

gulp.task('jscs', () => {
  return gulp.src(path.src.js)
  .pipe(debug({title: 'jscs:'}))
  .pipe(jscs({fix: true}))
  .pipe(gulp.dest((file) => {
    return file.base;
  }));
});

gulp.task('jshint', () => {
  return gulp.src(path.src.js)
  .pipe(debug({title: 'jshint:'}))
  .pipe(jshint())
  .pipe(jshint.reporter());
});

gulp.task('style', ['htmlhint', 'csscomb', 'jscs', 'jshint']);

gulp.task('clean', () => {
  return gulp.src(path.clean)
  .pipe(clean());
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
  return this;
}

const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const flexbugs = require('postcss-flexbugs-fixes');
const browserify = require('browserify');
const babelify = require('babelify');
const globify = require('require-globify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const glob = require('glob');
const clean = require('gulp-clean');
const sequence = require('run-sequence');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const envify = require('loose-envify/custom');

gulp.task('clean-build', (callback) => {
  sequence(
    'clean',
    ['build-scripts', 'build-styles', 'build-static'],
    callback);
});

gulp.task('build', (callback) => {
  sequence(
    ['build-scripts', 'build-styles', 'build-static'],
    callback);
});

gulp.task('clean', () => gulp
  .src('./public/*', { read: false })
  .pipe(clean())
);

gulp.task('build-styles', () => {
  const plugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
    flexbugs(),
    cssnano()
  ];
  return sass(['./app/styles/app.scss'])
    .on('error', sass.logError)
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('build-scripts', () => {
  process.env.NODE_ENV = 'production';
  const files = glob.sync('./app/*.js*');
  return browserify({ entries: files })
    .transform(babelify, { presets: ['es2015', 'es2016', 'react'], plugins: ['transform-object-rest-spread'] })
    .transform(globify)
    .transform(envify({
      NODE_ENV: 'production'
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('build-static', () => gulp
  .src(['./app/assets/**/*'], { base: './app/assets' })
  .pipe(changed('./public'))
  .pipe(gulp.dest('./public')));

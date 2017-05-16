import gulp from 'gulp';
import inject from 'gulp-inject';
import sass from 'gulp-ruby-sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import glob from 'glob';
import clean from 'gulp-clean';
import sequence from 'run-sequence';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('clean-build', (callback) => {
  sequence(
    'clean',
    ['build-server', 'build-scripts', 'build-styles', 'build-static'],
    'inject',
    callback);
});

gulp.task('build', (callback) => {
  sequence(
    ['build-server', 'build-scripts', 'build-styles', 'build-static'],
    'inject',
    callback);
});

gulp.task('clean', () => gulp
  .src('./dist/*', { read: false })
  .pipe(clean())
);

gulp.task('inject', () => {
  const transform = (filepath) => {
    const parts = filepath.split('/');
    const path = `/${parts.slice(parts.length - 2, parts.length).join('/')}`;
    if (filepath.split('.').pop() === 'css') {
      return `<link rel="stylesheet" href="${path}">`;
    }
    return `<script src="${path}"></script>`;
  };
  const sources = gulp.src(['./dist/public/js/*.js', './dist/public/css/*.css'], { read: false });

  return gulp.src('./dist/views/*.html')
    .pipe(inject(sources, { transform }))
    .pipe(gulp.dest('./dist/views'));
});

gulp.task('build-server', () => gulp
  .src([
    './src/**',
    '!./src/assets{,/**}'],
    { base: './src/' })
  .pipe(gulp.dest('./dist/')));

gulp.task('build-styles', () => {
  const plugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
    flexbugs(),
    cssnano()
  ];
  return sass(['./src/assets/scss/*.scss', './src/assets/scss/bootstrap/bootstrap.scss'])
    .on('error', sass.logError)
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./dist/public/css'));
});

gulp.task('build-scripts', () => {
  const files = glob.sync('./src/assets/js/*.js');
  return browserify({ entries: files })
    .transform(babelify, { presets: ['es2015', 'es2016'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('build-static', () => gulp
  .src([
    './src/assets/img/*'])
  .pipe(gulp.dest('./dist/public/img')));

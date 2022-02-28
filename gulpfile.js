const gulp = require('gulp');
const { series } = require('gulp');
const terser = require('gulp-terser');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));

const DIST_PATH = './dist';
const SOURCE_PATH = './source'
const SCRIPTS_PATH = ['./source/scripts/**/*.js', '!source/scripts/**/*_x.js'];


const styles = () => {
	return gulp.src(`${SOURCE_PATH}/scss/styles.scss`)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(`${DIST_PATH}/css`))
		.pipe(livereload());
}

const minifyStyles = (done) => {
	gulp.src(`${SOURCE_PATH}/scss/styles.scss`)
		.pipe(autoprefixer())
		.pipe(sass({
			errLogToConsole: true,
			outputStyle: 'compressed',
		}))
		.pipe(concat(`./css/styles.min.css`))
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
	done();
}

const scripts = () => {
	return gulp.src(SCRIPTS_PATH)
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(`${DIST_PATH}/js`))
		.pipe(livereload());
}

const uglifyScripts = () => {
	return gulp.src(SCRIPTS_PATH)
		.pipe(terser())
		.pipe(concat('scripts.min.js'))
		.pipe(gulp.dest(`${DIST_PATH}/js`))
		.pipe(livereload());
}

const watchChanges = function (done) {
	livereload.listen();
	gulp.watch(SCRIPTS_PATH, scripts);
	gulp.watch(SCRIPTS_PATH, uglifyScripts);
	gulp.watch(`${SOURCE_PATH}/scss/**/*.scss`, styles);
	gulp.watch(`${SOURCE_PATH}/scss/**/*.scss`, minifyStyles);
}

exports.default = series(styles, scripts, uglifyScripts, minifyStyles, watchChanges);
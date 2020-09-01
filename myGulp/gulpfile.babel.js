/* -- WHAT IS GULP? --
    > Open source JavaScript toolkit & task runner
    > Frontend built system
    > Build on Node.js and NPM
    > Used for time consuming & repetitive tasks
    > Hundreds of plugins available for different tasks

*/

/* -- COMMON TASKS --
    > Minification of scripts and styles
    > Concatenation
    > Cache busing
    > Testing, linting & optimization
    > Dev Servers
*/

/* -- HOW GULP WORKS --
    > Built on node streams
    > Pipelines / .pipe() operator
    > Single purpose plugins
    > Files not affected until all plugins are processed
*/


import { series, parallel, watch, src, dest } from 'gulp';
// TODO: WIP
import browsersync from 'browser-sync';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import yargs from 'yargs';

let args = yargs.alias('e', 'env').argv;
let isProduction = args.env === 'prod';

/* -- TOP LEVEL FUNCTIONS --
    gulp.task  - Define tasks
    gulp.src   - Point to files to use
    gulp.dest  - Points to folder to output
    gulp.watch - Watch files and folders for changes
*/

//Logs Message
function message() {
	console.log('Oh my Gulp...🥤')
}

//Copy All HTML Files
function copyHTML() {
	return src('test/*.html')
		.pipe(dest('dist'));
}

//Tasks style files
function streamCSS() {
	return src('test/css/*.scss')
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(dest('dist/css'));
}

//Tasks script files
function streamJS() {

	return src('test/js/*.js')
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(dest('dist/js'));
}

//Tasks image files
function imageMin() {
	return src('test/image/*')
		.pipe(imagemin([
			imagemin.mozjpeg({ quality: 75, progressive: true })
		]))
		.pipe(dest('dist/image'))
}

//Watch files and folders for changes
function watcher() {
	watch('test/*.html', copyHTML)
	watch('test/css/*.scss', streamCSS)
	watch('test/js/*.js', streamJS)
	watch('test/image/*', imageMin)
};

exports.watcher = watcher;
exports.scss = streamCSS;
exports.js = streamJS;
exports.message = series(message);
exports.default = series(copyHTML, parallel(streamCSS, streamJS), imageMin, watcher);

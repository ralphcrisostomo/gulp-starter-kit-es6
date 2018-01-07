const gulp          = require('gulp');
const gutil         = require('gulp-util');
const eslint        = require('gulp-eslint');
const mocha         = require('gulp-mocha');
const debug         = require('gulp-debug');
const clean         = require('gulp-clean');
const path          = require('path');
const uglify        = require('gulp-uglifyes');
const sourcemaps    = require('gulp-sourcemaps');
const runSequence   = require('run-sequence');
const rootPath      = path.normalize(__dirname + '/../..');

const dir           = {
    app   : './app',
    dist  : './dist',
    test  : './test'
};

gulp.task('clean', function () {
    gulp.src(`${dir.dist}/**/*`, {read : false})
        .pipe(clean());
});

gulp.task('eslint', function () {
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(debug())
        .pipe(eslint({
            "parserOptions": { "ecmaVersion": 6 }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('minjs', function () {
    return gulp.src([`${dir.app}/index.js`])
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: false,
            ecma: 6
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dir.dist}`));
});

// Public tasks
// -----------------
gulp.task('default', function () {
    let text = "\n\n";
    text += 'Commands : \n\n';
    text += '\tgulp \t\t\tShow available gulp commands\n\n';
    text += '\tgulp test \t\tUnit test everything inside `/app` directory\n';
    text += '\tgulp build \t\tProduction build\n';
    text += '\tgulp release \t\tRelease build + version bump + push to repo\n\n';
    return gutil.log(text);
});

gulp.task('test',['eslint'], function () {
    return gulp.src([`${dir.test}/**/*.test.js`], { read : false })
        .pipe(mocha({
            ui          : 'bdd',
            reporter    : 'nyan',
            ignoreLeaks : false,
            require     : [
                `${rootPath}/test/helpers/global.js`
            ]
        }))
        .once('end', function () {
            return process.exit();
        })
});

gulp.task('build', ['clean'], function (done) {
    runSequence('minjs',done)
});
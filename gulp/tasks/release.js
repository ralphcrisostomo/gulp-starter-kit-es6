// Install Gulp Dependencies:
// $ npm install --save-dev gulp gulp-util gulp-git gulp-bump gulp-shell inquirer run-sequence
//
const gulp          = require('gulp');
const gutil         = require('gulp-util');
const git           = require('gulp-git');
const bump          = require('gulp-bump');
const shell         = require('gulp-shell');
const inquirer      = require('inquirer');
const runSequence   = require('run-sequence');
const pkg           = require('../../package.json');
const bumps         = ['patch', 'minor', 'major'];


//
// Release tasks
// -----------------

//
// PSUEDOCODE | November 1, 2017
//
// - do a git flow release start 1.2
// - bump version
// - git add .; git commit -am "version updated to 1.2";
// - do a git flow release finish 1.2
// - git push --all
// - git push --tags
//

gulp.task('release', function (done) {
    inquirer.prompt([
        {
            type    : 'input',
            name    : 'version',
            message : `Release version (${pkg.version}) : `
        }
    ]).then(function (answers) {
        let { version } = answers;
        process.gulp = {
            version
        };
        return runSequence(
            'build',
            'release:start',
            'bump',
            'git:add:commit',
            'release:finish',
            'git:push',
            'npm:publish',
            done);

    });
});

gulp.task('npm:publish', function () {
    return gulp.src('./')
        .pipe(shell([`npm publish`]));
});

gulp.task('release:start', function () {
    let { version } = process.gulp;
    return gulp.src('./')
        .pipe(shell([`git flow release start ${version}`]));
});

gulp.task('bump', function () {
    let { version } = process.gulp;
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({version}).on('error', gutil.log))
        .pipe(gulp.dest('./'));
});

gulp.task('git:add:commit', function () {
    let { version } = process.gulp;
    return gulp.src('./')
        .pipe(git.add())
        .pipe(git.commit(`Version bumped to : ${version}`, {args: '-a'}));
});

gulp.task('release:finish', function () {
    let { version } = process.gulp;
    return gulp.src('./')
        .pipe(shell([`git flow release finish ${version}`]));
});

gulp.task('git:push', function () {
    git.push('origin', ['master', 'develop'], {args: " --tags"}, function (err) {
        if (err) throw err;
    });
});

bumps.forEach(function (item) {
    gulp.task(`bump:${item}`, function () {
        return gulp.src('./package.json')
            .pipe(bump({ key : "version", type : item }))
            .pipe(gulp.dest('./'));
    });
});

gulp.task('release:patch', function (done) {
    return runSequence(
        'bump:patch',
        'build',
        done
    )
});

gulp.task('git:push', function () {
    git.push('origin', ['master', 'develop'], {args: " --tags"}, function (err) {
        if (err) throw err;
    });
});

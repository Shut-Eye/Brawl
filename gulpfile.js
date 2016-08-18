var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    changed = require('gulp-changed');

var src = {
    clientTs: ['client/**/*.ts', 'common/**/*.ts'],
    serverTs: ['server/**/*.ts', 'common/**/*.ts']
}

var out = {
    client: 'bin/client',
    server: 'bin/server'
}

// typescript project
var clientTsProject = ts.createProject('client/tsconfig.json'),
    serverTsProject = ts.createProject('server/tsconfig.json');

gulp.task('client', function () {
    var work = gulp.src(src.clientTs)
		.pipe(plumber())
        .pipe(ts(clientTsProject)).js
        .pipe(gulp.dest(out.client));
    return work;
});

gulp.task('server', function () {
    var work = gulp.src(src.serverTs)
		.pipe(plumber())
        .pipe(ts(serverTsProject)).js
        .pipe(gulp.dest(out.server));
    return work;
});

gulp.task('default', ['client', 'server']);

gulp.task('watch', function taskWatch() {
    gulp.watch(src.clientTs, ['client']);
    gulp.watch(src.serverTs, ['server']);
});

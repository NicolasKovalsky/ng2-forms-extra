"use strict";

var gulp = require('gulp');
var exec = require('child_process').exec;
var del = require('del');

function compile(opts, cb) {
    exec(
        'node_modules/.bin/tsc ' + opts,
        function (err, stdout, stderr) {
            console.log(stdout);
            if (err) {
                console.error(stderr);
            }
            cb();
        });
}

gulp.task('compile', function(cb) {
    compile("-p .", cb);
});
gulp.task('watch-compile', function(cb) {
    compile('-p . --watch', cb);
});

gulp.task('clean-compiled', function () {
    return del([
        './src/**/*.{d.ts,js,js.map}',
        './index.{d.ts,js,js.map}'
    ]);
});


function bundleUmd(config, cb) {
    exec(
        'node_modules/.bin/rollup -c ' + config,
        function (err, stdout, stderr) {
            console.log(stdout);
            if (err) {
                console.error(stderr);
            }
            cb(err);
        });
}

gulp.task('bundle-umd', ['compile'], function(cb) {
    bundleUmd('rollup.config.js', cb);
});
gulp.task('bundle-umd-only', function(cb) {
    bundleUmd('rollup.config.js', cb);
});
gulp.task('watch-bundle-umd', ['bundle-umd-only'], function() {
    gulp.watch(
        [
            'index.js',
            'src/**/*.js',
            'rollup.config.js'
        ],
        ['bundle-umd-only']);
});

gulp.task('clean-bundles', function() {
    return del('bundles');
});


gulp.task('watch', ['watch-compile', 'watch-bundle-umd']);

// Use if IDE (IntelliJ IDEA) compiles TypeScript by itself.
gulp.task('watch-ide', ['watch-bundle-umd']);


gulp.task('default', ['bundle-umd']);

gulp.task('clean', ['clean-compiled', 'clean-bundles']);

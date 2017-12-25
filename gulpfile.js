/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library.
******************************************************/
const gulp = require('gulp');
const argv = require('minimist')(process.argv.slice(2));
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');

/******************************************************
 * PATTERN LAB  NODE WRAPPER TASKS with core library
******************************************************/
const config = require('./patternlab-config.json');
const patternlab = require('@pattern-lab/patternlab-node')(config);

function build() {
    return patternlab.build({
        watch: argv.watch,
        cleanPublic: config.cleanPublic
    }).then(() => {
        // do something else when this promise resolves
    });
}

function serve() {
    return patternlab.serve({
        cleanPublic: config.cleanPublic
    }
    ).then(() => {
        // do something else when this promise resolves
    });
}
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: 'Task Failed! See console.',
        message: "\n\n<%= error.message %>",
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).apply(this, args);

    gutil.beep(); // Beep 'sosumi' again

    // Prevent the 'watch' task from stopping
    this.emit('end');
}
/**
 * Compass SASS 
 */
gulp.task('patternlab:sass',function () {
    gulp.src('source/_sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob({ ignorePaths: ['**/*~split.scss'] }))
    .pipe(sass().on('error', handleErrors))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});
gulp.task('patternlab:version', function () {
    patternlab.version();
});

gulp.task('patternlab:help', function () {
    patternlab.help();
});

gulp.task('patternlab:patternsonly', function () {
    patternlab.patternsonly(config.cleanPublic);
});

gulp.task('patternlab:liststarterkits', function () {
    patternlab.liststarterkits();
});

gulp.task('patternlab:loadstarterkit', function () {
    patternlab.loadstarterkit(argv.kit, argv.clean);
});

gulp.task('patternlab:build', function () {
    build().then(() => {
        // do something else when this promise resolves
    });
});

gulp.task('patternlab:serve', function () {
    serve().then(() => {
        // do something else when this promise resolves
    });
});

gulp.task('patternlab:installplugin', function () {
    patternlab.installplugin(argv.plugin);
});
gulp.task('patternlab:watch',function(){
    browserSync.init({
        server: {
            baseDir: './public',
            directory: false
        },
        snippetOptions: {
            // Ignore all HTML files within the templates folder
            blacklist: ['/index.html', '/', '/?*']
        }
    });
    gulp.watch('source/_sass/**/*.scss', ['patternlab:sass']);

});
// gulp.task('dev',function () {
//     gulp.run('patternlab:serve');
//     gulp.run('patternlab:sass');
//     gulp.watch('./source/_sass/*.scss',function () {
//         gulp.run('patternlab:sass');
//     });
// });
gulp.task('patternlab:dev', ['patternlab:serve', 'patternlab:sass']);

gulp.task('default', ['patternlab:dev', 'patternlab:watch']);

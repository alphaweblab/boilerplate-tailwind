'use strict';

var projectName		= __dirname.split('/')[__dirname.split('/').length-1];

var gulp			= require('gulp');
var sass			= require('gulp-sass');
var postcss 		= require('gulp-postcss');
var copy			= require('gulp-copy');
var path			= require('path');
var tinypng			= require('gulp-tinypng');
var concat			= require('gulp-concat');
var minify			= require('gulp-minifier');
var clean 			= require('gulp-clean');
var autoprefixer	= require('gulp-autoprefixer');
var replace 		= require('gulp-replace');
var inlinesource	= require('gulp-inline-source');
var tailwindcss 	= require('tailwindcss');
var browserSync		= require('browser-sync').create();

gulp.task('clean', function() {
	return 	gulp.src('./build', {read: false, allowEmpty: true})
			.pipe(clean());
});

gulp.task('sync', function () {
	return 	gulp.src(['./source/**', '!./source/plugins', '!./source/plugins/**', '!./source/stylesheets/**', '!./source/scripts/**'], {dot: true})
			.pipe(gulp.dest('./build'));
});

gulp.task('sass', function () {
	return 	gulp.src('./source/stylesheets/master.scss')
			.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
			.pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('postcss', function () {
	return 	gulp.src('./build/stylesheets/master.css')
			.pipe(postcss([
				tailwindcss('./source/scripts/tailwind.js'),

			]))
			.pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('fonts', function () {
	return 	gulp.src('./source/fonts/*')
	  		.pipe(copy('./build/fonts', {prefix: 2}));
});

gulp.task('images', function () {
	return 	gulp.src(['./source/images/*.jpg', './source/images/*.png'])
	        .pipe(tinypng('w2lWbNviXvf2vp4OhLKNUOsexrAd0x-R'))
	        .pipe(gulp.dest('./build/images'));
});

gulp.task('plugins', function () {
	return 	gulp.src([
				'./node_modules/jquery/dist/jquery.min.js'
			])
	        .pipe(concat('plugins.js'))
	        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('scripts', function () {
	return 	gulp.src([
				'./source/scripts/functions.js'
			])
	        .pipe(concat('functions.js'))
	        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('stylesheets', function () {
	return 	gulp.src([
				'./build/stylesheets/master.css'
			])
	        .pipe(concat('master.css'))
			.pipe(autoprefixer({
		            browsers: ['last 4 versions'],
		            cascade: false
			}))
	        .pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('minify-css', function () {
	return	gulp.src('./build/stylesheets/master.css')
			.pipe(minify({
				minify: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				minifyJS: true,
				minifyCSS: true,
			}))
			.pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('minify-js', function () {
	return	gulp.src('./build/scripts/*')
			.pipe(minify({
				minify: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				minifyJS: true,
				minifyCSS: true,
			}))
			.pipe(gulp.dest('./build/scripts'));
});

gulp.task('replace-path', function () {
	return	gulp.src('./build/stylesheets/master.css')
			.pipe(replace('../images', 'images'))
			.pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('inline-source', function () {
    return 	gulp.src('./source/includes/head.php')
        	.pipe(inlinesource({rootpath: path.resolve('build'), swallowErrors: true}))
        	.pipe(gulp.dest('./build/includes'));
});

gulp.task('default', gulp.series('sass', 'postcss', 'plugins', 'scripts', 'stylesheets', 'sync', 'fonts', function (done) {
	browserSync.reload();
    done();
}));

gulp.task('watch', gulp.series('default', function() {
    browserSync.init({
		proxy: "localhost/"+projectName+"/build"
	});
    gulp.watch("./source/**/*.scss", gulp.series('default'));
    gulp.watch("./source/**/*.php", gulp.series('default'));
	gulp.watch("./source/**/*.js", gulp.series('default'));
}));

gulp.task('build', gulp.series('default', 'minify-css', 'minify-js', 'inline-source'));
gulp.task('build:image', gulp.series('default', 'images', 'minify-css', 'minify-js', 'inline-source'));

"use strict";

const gulp = require("gulp"),
  sass = require("gulp-sass");

sass.compiler = require("node-sass");

gulp.task("sass", function () {
  return gulp
    .src("./public/stylesheets/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./public/stylesheets"));
});

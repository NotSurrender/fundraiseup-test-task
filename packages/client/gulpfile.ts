const gulp = require("gulp");
const ts = require("gulp-typescript");

const tsProject = ts.createProject("tsconfig.json");

function typescript() {
  return gulp
    .src("src/**/*.ts")
    .pipe(tsProject())
    .pipe(gulp.dest("../../client-build"));
}

exports.default = function () {
  gulp.watch("src/**/*.ts", typescript);
};


// #region Import Directives

var gulp = require("gulp");
var clean = require("gulp-clean");
var typescript = require("gulp-typescript");

// #endregion

// References important paths that are used throughout the build tasks
var paths = {
    sourceFiles: "./src/**/*.ts",
    buildPath: "./build",
    typeScriptConfigurationFile: "./tsconfig.json",
    bowerPath: "./bower_components"
};

// Defines the default gulp task, which is execute when "gulp" is executed on the command line, it executes all other tasks needed to build the project
gulp.task("default", [
    "build",
    "watch"
]);

// Defines a gulp task, which cleans the build directory
gulp.task("clean", function() {
    return gulp
        .src(paths.buildPath, { read: false })
        .pipe(clean());
});

// Defines a gulp task, which builds the project
gulp.task("build", ["clean"], function() {
    return gulp
        .src(paths.sourceFiles)
        .pipe(typescript.createProject(paths.typeScriptConfigurationFile)())
        .pipe(gulp.dest(paths.buildPath));
});

// Defines a gulp task, which continously watches the source files and rebuilds the project if anything has changed
gulp.task("watch", function() {
    gulp.watch(paths.sourceFiles, ["build"]);
});

// #region Import Directives

var gulp = require("gulp");
var dts = require("dts-generator");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var typescript = require("gulp-typescript");

// #endregion

// References important paths that are used throughout the build tasks
var paths = {
    basePath: "./",
    sourcePath: "./src",
    sourceFiles: "./src/**/*.ts",
    buildPath: "./build",
    typeScriptConfigurationFile: "./tsconfig.json"
};

// Defines the default gulp task, which is execute when "gulp" is executed on the command line, it executes all other tasks needed to build the project
gulp.task("default", [
    "build",
    "watch"
]);

// Defines a gulp task, which continously watches the source files and rebuilds the project if anything has changed
gulp.task("watch", function() {
    gulp.watch(paths.sourceFiles, ["build:typescript"]);
});

// Defines a gulp task, which builds the project
gulp.task("build", function(callback) {
    runSequence(
        ["clean"],
        ["build:typescript", "build:typings"],
        callback);
});

// Defines a gulp task, which cleans the build directory
gulp.task("clean", function() {
    return gulp
        .src(paths.buildPath, { read: false })
        .pipe(clean());
});

// Defins a gulp task, which compiles the TypeScript files
gulp.task("build:typescript", function() {
    return gulp
        .src(paths.sourceFiles)
        .pipe(typescript.createProject(paths.typeScriptConfigurationFile)())
        .js
        .pipe(gulp.dest(paths.buildPath));
})

// Defins a gulp task, which compiles the TypeScript definition files
gulp.task("build:typings", function() {
    dts.default({
        project: paths.basePath,
        out: paths.buildPath + "/durandal-http-client.d.ts"
    });
})
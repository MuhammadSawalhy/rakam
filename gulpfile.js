const gulp = require('gulp');
const babel = require('gulp-babel');

const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

const SRC = './src/**/*.js';
const ESM_DEST = './module';
const CJS_DEST = './main';

gulp.task("update-version-file", ()=>{

  const FILE_PATH = './src/version.js';
  const VERSION = pkg.version;
  const CODE = [
    "// this file is auto generated",
    "// the current version is:",
    "export default \"" + VERSION + "\";",
  ].join('\n');

  return new Promise((res) => {
    fs.writeFileSync(path.resolve(__dirname, FILE_PATH), CODE);
    res('version file updated!');
  });

});

gulp.task("build:cjs", ()=>{
  process.env.NODE_ENV = 'cjs';
  const babelConfig = require('./babel.config')({ env: (e)=> e === process.env.NODE_ENV });
  return gulp
    .src(SRC)
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(CJS_DEST))
  ;
});

gulp.task("build:esm", ()=>{
  process.env.NODE_ENV = 'esm';
  const babelConfig = require('./babel.config')({ env: (e)=> e === process.env.NODE_ENV });
  return gulp
    .src(SRC)
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(ESM_DEST))
  ;
});

gulp.task("clean", ()=>{
  const rimraf = require('rimraf');
  return new Promise((res) => {
    rimraf.sync(path.resolve(CJS_DEST, '*'));
    rimraf.sync(path.resolve(ESM_DEST, '*'));
    res('version file updated!');
  });
});

gulp.task("build", gulp.series([
    'update-version-file', 
    'clean', 
    gulp.parallel(['build:cjs', 'build:esm']),
  ])
);

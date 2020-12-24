// to create the main and module directories,,,
// files are also handled with babel

const gulp = require('gulp');
const babel = require('gulp-babel');

const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

const SRC = './src/**/*.js';
const ESM_DEST = './module';
const CJS_DEST = './main';

gulp.task("update-version-file", ()=>{
  const fileName = 'version.js';
  const VERSION = pkg.version;
  const ESM_CODE = [
    "// this file is auto generated",
    "// the current version is:",
    "export default \"" + VERSION + "\";",
  ].join('\n');
  const CJS_CODE = [
    "// this file is auto generated",
    "// the current version is:",
    "module.exports = \"" + VERSION + "\";",
  ].join('\n');
  
  function checkPath(p) {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return new Promise((res) => {
    let esm = path.resolve(ESM_DEST, fileName);
    let cjs = path.resolve(CJS_DEST, fileName);
    checkPath(esm); checkPath(cjs);
    fs.writeFileSync(esm, ESM_CODE);
    fs.writeFileSync(cjs, CJS_CODE);
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
    res('Destination are cleaned...');
  });
});

gulp.task("build", gulp.series([
  'clean', 
  'update-version-file', 
  gulp.parallel(['build:cjs', 'build:esm']),
]));

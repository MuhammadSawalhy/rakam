const gulp = require('gulp');
const babel = require('gulp-babel');
// const rename = require('gulp-rename');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

const SRC = './src/**/*.js';
const ESM_DEST = './lib/esm';
const CJS_DEST = './lib/cjs';
const BUNDLE = './lib/index.js';

// const CJS_INDEX_CONTENT = `
// // this file is auto generated
// exports = require('.').default;
// `; 

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
    // .pipe(rename(function (p) {
    //   // rename index.js into index-cjs.js
    //   if(path.dirname === __dirname + "/src" && p.basename === 'index') {
    //     p.basename += "-cjs"
    //   }
    // }))
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

gulp.task("build", gulp.series([
    'update-version-file', 
    gulp.parallel(['build:cjs', 'build:esm']),
  ])
);

gulp.task("export-default-directly", ()=>{

});

gulp.task("copy-bundle-to-main", ()=>{
  return gulp
    .src(BUNDLE)
    .pipe(gulp.dest(CJS_DEST))
  ;
});


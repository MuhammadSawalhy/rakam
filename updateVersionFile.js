const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

const VERSION_FILE = path.resolve(__dirname, 'version.js');
const VERSION = pkg.version;

const CODE = [
  "// this file is auto generated",
  "// the current version is:",
  "export default \"" + VERSION + "\";",
].join('\n');

fs.writeFileSync(VERSION_FILE, CODE);

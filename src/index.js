import geometry from './geometry/index.js'
import * as core from './core/index.js';
import parser from './parser/index.js';
import version from './version.js';

export default {

   ...core, /// make sure that any new property won't crash with core properties
   
   parser,

   geometry,
   
   version
};

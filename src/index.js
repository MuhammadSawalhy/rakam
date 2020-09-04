import geometry from './geometry/index.js'
import * as core from './core/index.js';
import parser from './parser/index.js';
   

export default {

   ...core, /// make sure that any new property won't crash with core properties
   
   parser,

   geometry,
   
};

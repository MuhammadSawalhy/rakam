import geometry from './geometry/index.js'
import core from './core/index.js';
import parser from './parser/index.js';
   

export default {

   ...core, /// make sre that any new property won't crash with core properties
   
   parser,

   geometry,
   
};

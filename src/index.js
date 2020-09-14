import core from './core/';
import engine from './engine/';
import geometry from './geometry/'
import fraction from './fraction/';
import error from './error/';

import vector from './vector';
import matrix from './matrix';

import version from './version.js';

export default {

   core,
   // make sure the API's identifiers are unique
   ...core,
   
   engine,
   // make sure the API's identifiers are unique
   ...engine,
   
   geometry,
   // make sure the API's identifiers are unique
   ...geometry,

   fraction,
   // make sure the API's identifiers are unique
   ...fraction,

   error,
   // make sure the API's identifiers are unique
   ...error,

   vector,
   matrix,

   version,

};

import core from './core/';
import engine from './engine/';
import geometry from './geometry/';
import frac from './fraction/';
import error from './error/';

import vector from './vector';
import matrix from './matrix';

import version from './version.js';

export default {
  core,
  ...core,
  // make sure the API's identifiers are unique

  engine,

  geometry,

  frac,

  error,

  vector,
  matrix,

  version,
};

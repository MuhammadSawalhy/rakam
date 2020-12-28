import fraction from './frac';
import quotRem from './quotRem';

const aliases = {
  frac: fraction,
  qr: quotRem,
};

export default {
  ...aliases,
  fraction,
  quotRem,
};

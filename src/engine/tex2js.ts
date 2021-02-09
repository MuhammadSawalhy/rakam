/* eslint no-unused-vars: 0 */

import latexParser from '@scicave/math-latex-parser';
import UndefinedUsed from '../error/UndefinedUsed';
import prepareScope from './gears/prepareScope';
import prepareHandlers from './gears/tex2js/prepareHandlers';
import generateJs from './gears/tex2js/generateJs';

// the  default handler will be exported in some cases
// TODO: ["int", "diff"]
export const defaultHandlers = ['sum', 'gamma', 'fact'];

export default function latex2js(math, options, parserOptions = {}) {}

latex2js.defaultHandlers = defaultHandlers;
latex2js.generateJs = generateJs;

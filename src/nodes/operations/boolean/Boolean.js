//import { Node } from './../../Node.js';

import Node from '../../Node.js';
export default class Bool extends Node {
       constructor(children){ 
           super(children); 
       }

       derivative(cs) { return null }
}

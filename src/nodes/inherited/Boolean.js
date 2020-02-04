//import { Node } from './../../Node.js';

import Node from '../inherited/Node.js';
class Bool extends Node {
       constructor(children){ 
           super(children); 
       }

       derivative(cs) { return null }
}

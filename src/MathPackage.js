import Angles from './main/Angles.js';
import Lines from './main/Lines.js';
import Core from './main/Core.js';
import Parser from './Parser.js';
import entities from './entities/index.js';
import Nodes from './nodes/index.js';
   
let __MMP = new MagicalParser.CustomParsers.Math();

export default {

   //#region classes
   Nodes,
   //#endregion

   //#region properties

   Angles,
   Lines,
   Core,
   entities,
   MMP /* magical math parser */: __MMP,
   Parser: new Parser(__MMP),
   
   //#endregion
   
   //#region methods

   compile: function (input) {
      // if(input instanceof this.Parser.Node){
      //    return this.Parser.stringT
      // }
   }

   //#endregion

}

import {Math2JsOptions} from "../types";
import addToHeader, { IAddToHeader } from "./addToHeader";

export interface IHeaderUtils {
  options: Math2JsOptions;
}

export default class HeaderUtils implements IHeaderUtils {
  lines: string[];
  add: IAddToHeader;
  scopeId?: string; // is defined inside prepareScope.js
  // to avoid multi-declaration of identifiers
  declaredFuncs = [];
  declaredVars = [];

  constructor(public options: Math2JsOptions) {
    let header = options.header;
    // make sure header is an array
    this.lines = Array.isArray(header) ? header : header ? [header] : [];
    this.add = addToHeader;
  }

  /**
   * generate unique random identifier
   */
  getRandomId(): string {
    let ok: boolean, rndName: string;
    do {
      rndName = "_" + Math.floor((Math.random() * 100000)).toString(32).slice(2);
      ok = !this.idExists(rndName);
    } while(ok);
    return rndName;
  }

  /**
   * generate unique random identifier
   */
  idExists(id: string, params: boolean = true): boolean {
    let exists: boolean;
    exists   = this.declaredVars.indexOf(id) > -1;
    exists &&= this.declaredFuncs.indexOf(id) > -1;
    exists &&= !params || this.options.params.indexOf(id) > -1;
    return exists;
  }

  /*
   * push to this.lines array
   */
  pushLines(...lines: string[]) {
    this.lines.push(...lines);
  }

  /*
   * generate the code, actually we join this.lines together
   */
  getCode(): string {
    return this.lines.join('\n');
  }

}


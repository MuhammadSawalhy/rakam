import MathParserNode from '@scicave/math-parser/lib/Node';
import HeaderUtils from './gears/HeaderUtils';

//-----------------------//
//----    general    ----//
//-----------------------//

export type SimpleScope = Object | ((id: string)=>number);
export type Scope =
  SimpleScope | Array<SimpleScope>;

//-----------------------//
//----    math2js    ----//
//-----------------------//


export interface Math2JsHandler {
    test: (node: MathParserNode)=> boolean;
    handle: (
    	node: MathParserNode, // that passed the test
    	options: Math2JsHandlingOptions
    ) => string;
}

export interface Math2JsHandlingOptions {
  params: Array<string>,
  scope: Scope;
  handlers: Array<Math2JsHandler>;
  header: HeaderUtils;
  undefs: { vars: string[], funcs: string[] };
}

export interface Math2JsOptions {
  header?: string | Array<string>;
  params?: Array<string>,
  scope?: Scope;
  handlers?: Array<Math2JsHandler>;
  throwUndefError?: boolean;
}


//-----------------------//
//----   latex2js    ----//
//-----------------------//




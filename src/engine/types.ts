import MathParserNode from '@scicave/math-parser/lib/Node';

export type Scope =
  Object | Function | Array<Scope>;

export type Math2JsHandler = {
    test: (node: MathParserNode)=> boolean,
    handle: (
    	node: MathParserNode, // that passed the test
    	options: Math2JSHandlingOptions
    ) => string,
};

// CAUTION: fill before release
export type Math2JSHandlingOptions = {
   
}

export interface Math2JsOptions {
  scope: Scope;
  handlers: Array<Math2JsHandler>;
}

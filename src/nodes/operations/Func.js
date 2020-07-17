
import Node from '../Node.js';
export default class Func extends Node {

    constructor(name, args) {
        super(args, 0);
        this.syntaxType = 'function';
        this.name = name;
    }

    calculate(cs, tempVars) {

        // Searching in the {Functions}
        for (let i = 0; i < cs.funcs.length; i++) {
            if (cs.funcs[i].name == this.name) {
                return cs.funcs[i].calculate(this.children, cs, tempVars);
            }
        }

        throw new Error(`Your function ${this.name} does not exist.`);
    }

    derivative(cs) {
        // Searching in the {Functions}
        for (let i = 0; i < cs.funcs.length; i++) {
            if (cs.funcs[i].name == name) {
                return this.replace(cs.funcs[i].process, cs.funcs[i].args, this.children).derivative(cs);
            }
        }
        return new Constant(NaN);
    }
    replace(node, variablesToReplace, NodeToReplaceWith) {
        if (node instanceof Variable) {
            for (let i = 0; i < variablesToReplace.length; i++) {
                if (variablesToReplace[i] == node.name) {
                    return NodeToReplaceWith[i];
                }
            }
        }
        else if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                node.children[i] = this.replace(node.children[i], variablesToReplace, NodeToReplaceWith);
            }
            return node;
        }
        return node;
    }

    simplify() {
        return new Func(this.name, this.children[0].simplify());
    }

    isEqual(node) {
        if (this.constructor === node.contructor) {
            if (this.name === node.name) {
                if (this.children && node.children && this.children.length == node.children.length) {
                    for (let i = 0; i < this.children.length; i++) {
                        if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
                    }
                    return true;
                }
                else return true;
            }
        }
        return false;
    }

    toString() {
        let args = "";
        for (let i = 0; i < this.children.length; i++) {
            if (args == "") {
                args += this.children[i].toString();
            }
            else {
                args += ", " + this.children[i].toString();
            }
        }
        return this.name + "(" + args + ")";
    }


}


import Node from './inherited/Node.js';
class ArithmeticSequence extends Node {
    constructor(script, start, end, step) {
        super([], 0);
        this.syntaxType = 'literal';
        this.script = script;
        this.start = start;
        this.end = end;
        this.step = step;
    }

    calculate(cs, tempVars) {
        if (cs.vars[3].value.calculate(cs) <= this.length(cs, tempVars) && cs.vars[3].value.calculate(cs) >= 0)
            return this.start.calculate(cs, tempVars) + this.step.calculate(cs, tempVars) * cs.vars[3].value.calculate(cs);
        else throw new OutOfRangeException(`Index ${cs.vars[3].value.calculate(cs)} is out of the range ${"[" + 0 + "," + (Count(cs, tempVars) - 1) + "]"}`);
    }

    length(cs, tempVars) {
        return Math.floor((this, end.calculate(cs, tempVars) - this.start.calculate(cs, tempVars)) / this.step.calculate(cs, tempVars) + 1);
    }

    derivative(cs) {
        throw new NotImplementedException();
    }

    simplify() {
        return this;
    }

    isEqual(node) {
        if (fromTheSame(this, node)) {
            let arithmeticSequence = node;
            if (this.start.isEqual(arithmeticSequence.start) && this.end.isEqual(arithmeticSequence.end) && this.step.isEqual(arithmeticSequence.step)) {
                return true;
            }
        }
        return false;
    }

    toString() {
        return this.script.toString();
    }
}

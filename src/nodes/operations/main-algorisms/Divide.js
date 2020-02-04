
import Node from '../../inherited/Node.js';
class Divide extends Node {
    constructor(children) {
        super(children, 2);
        this.type = 'operator';
    }

    calculate(cs, tempVars) {
        try {
            return this.children[0].calculate(cs, tempVars) / this.children[1].calculate(cs, tempVars);
        }
        catch (e) {
            return NaN;
        }
    }

    derivative(cs) {
        return new Divide(
            new Subtract(
                new Multiply(this.children[1], this.children[0].derivative(cs)),
                new Multiply(this.children[0], this.children[1].derivative(cs))),

            new Power(this.children[1], new Constant(2)));
    }

    simplify() {
        let numerator;
        let denominator;

        let fraction = this.Get_Num_Denom(this);
        numerator = fraction[0].simplify();
        denominator = fraction[1].simplify();

        /// there will be a sequence of multiplication and the denomirator will be {Constant(1);}
        if (denominator.Sequence.Count == 0) {

        }
        /// there will be a sequence of multiplication and the denominator will be a sequence, too.
        else {

        }

        let sChild1 = this.children[0].simplify();
        let sChild2 = this.children[1].simplify();

        if (sChild1.isEqual(new Constant(0))) {
            return new Constant(0);
        }
        else if (sChild2.isEqual(new Constant(1))) {
            return sChild1;
        }
        else if (sChild1.isEqual(sChild2)) {
            return new Constant(1);
        }

        // #region Trigonmetric functions

        // Checking for the this.children
        if (sChild1.children != null && sChild2.children != null && sChild1.children.length == sChild2.children.length && sChild1.children[0].isEqual(sChild2.children[0])) {
            // Sin
            if (sChild1 instanceof Sin && sChild2 instanceof Cos) {
                return new Tan(sChild1.children[0]);
            }
            else if (sChild1 instanceof Sin && sChild2 instanceof Tan) {
                return new Cos(sChild1.children[0]);
            }
            else if (sChild1 instanceof Sin && sChild2 instanceof Csc) {
                return new Power(sChild1, new Constant(2));
            }

            // Cos
            if (sChild1 instanceof Cos && sChild2 instanceof Sin) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Cos && sChild2 instanceof Csc) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Cos && sChild2 instanceof Sec) {
                return new Power(sChild1, new Constant(2));
            }
            else if (sChild1 instanceof Cos && sChild2 instanceof Cot) {
                return new Cot(sChild1.children[0]);
            }

            // Tan
            if (sChild1 instanceof Tan && sChild2 instanceof Sin) {
                return new Tan(sChild1.children[0]);
            }
            else if (sChild1 instanceof Tan && sChild2 instanceof Cos) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Tan && sChild2 instanceof Csc) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Tan && sChild2 instanceof Sec) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Tan && sChild2 instanceof Cot) {
                return new Power(sChild1, new Constant(2));
            }

            // Csc
            if (sChild1 instanceof Csc && sChild2 instanceof Sin) {
                return new Power(sChild1, new Constant(2));
            }
            else if (sChild1 instanceof Csc && sChild2 instanceof Cos) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Csc && sChild2 instanceof Tan) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Csc && sChild2 instanceof Sec) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Csc && sChild2 instanceof Cot) {
                return new Cot(sChild1.children[0]);
            }

            // Sec
            if (sChild1 instanceof Sec && sChild2 instanceof Sin) {
                return new Tan(sChild1.children[0]);
            }
            else if (sChild1 instanceof Sec && sChild2 instanceof Cos) {
                return new Power(sChild1, new Constant(2));
            }
            else if (sChild1 instanceof Sec && sChild2 instanceof Tan) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Sec && sChild2 instanceof Csc) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Sec && sChild2 instanceof Cot) {
                return new Cot(sChild1.children[0]);
            }

            // Cot
            if (sChild1 instanceof Cot && sChild2 instanceof Sin) {
                return new Tan(sChild1.children[0]);
            }
            else if (sChild1 instanceof Cot && sChild2 instanceof Cos) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Cot && sChild2 instanceof Tan) {
                return new Power(sChild1, new Constant(2));
            }
            else if (sChild1 instanceof Cot && sChild2 instanceof Csc) {
                return new Cot(sChild1.children[0]);
            }
            else if (sChild1 instanceof Cot && sChild2 instanceof Sec) {
                return new Cot(sChild1.children[0]);
            }
        }
        //#endregion

        //#region Division of Mult  :  (.1. * .2.)/(.3. * .4.)

        if (sChild1 instanceof Multiply) {

        }
        else if (sChild2 instanceof Multiply) {

        }


        //#endregion

        if (sChild2 instanceof Neg) {
            return new Divide(new Neg(sChild1), sChild2.children[0]).simplify();
        }

        return new Divide(sChild1, sChild2);
    }

    Get_Num_Denom(multOrDiv) {
        let numerator, denominator;
        [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv, numerator, denominator, true);
        return [new SequenceOfMult(numerator), new SequenceOfMult(denominator)];
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="atNumerator">it instanceof a property for the multOrDiv</param>
    /// <returns></returns>
    sub_Get_Num_Denom(multOrDiv, numerator, denominator, atNumerator) {

        if (multOrDiv.children[0] instanceof Multiply || multOrDiv.children[0] instanceof Divide) {
            if (atNumerator) {
                [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[0], numerator, denominator, true);
            }
            else {
                [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[0], numerator, denominator, false);
            }
        }
        else {
            if (atNumerator) {
                numerator.Add(multOrDiv.children[0]);
            }
            else {
                denominator.Add(multOrDiv.children[0]);
            }
        }

        if (multOrDiv.children[1] instanceof Multiply || multOrDiv.children[1] instanceof Divide) {
            if (multOrDiv instanceof Multiply) {
                if (atNumerator) {
                    [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, true);
                }
                else {
                    [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, false);
                }
            }
            else {
                if (atNumerator) {
                    [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, false);
                }
                else {
                    [numerator, denominator] = this.sub_Get_Num_Denom(multOrDiv.children[1], numerator, denominator, true);
                }
            }
        }
        else {
            if (multOrDiv instanceof Multiply) {
                if (atNumerator) {
                    numerator.Add(multOrDiv.children[1]);
                }
                else {
                    denominator.Add(multOrDiv.children[1]);
                }
            }
            else {
                if (atNumerator) {
                    denominator.Add(multOrDiv.children[1]);
                }
                else {
                    numerator.Add(multOrDiv.children[1]);
                }
            }
        }

    }

    isEqual(node) {
        if (!this.containsVariable) {
            if (!node.containsVariable) {
                let cal = new calculationSettings();
                if (calculate(cal) == node.calculate(cal)) {
                    return true;
                }
            }
            else return false;
        }
        else if (fromTheSame(this, node)) {
            for (let i = 0; i < this.children.length; i++) {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
        return false;
    }

    toString() {
        let child1 = "", child2 = "";

        if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
            child1 = this.children[0].toString();
        else
            child1 = "(" + this.children[0].toString() + ")";

        if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
            child2 = this.children[1].toString();
        else
            child2 = "(" + this.children[1].toString() + ")";


        return child1 + " / " + child2;
    }
}

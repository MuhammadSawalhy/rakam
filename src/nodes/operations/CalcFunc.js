export default class CalcFunc
{

    get args(){
        return this._args;
    }

    set args(value) {
        this._args = value;
        if(value)
            for (let sy of value)
            {
                this.argsDic = [];
                this.argsDic.push({ key: sy, value: null});
            }
    }
    
    constructor(name, argsNames, process)
    {
        this.name = name;
        this.args = argsNames;
        this.process = process;
    }

    calculate(argsValues, cs, tempVars)
    {
        
        // #region Preparing tempVars
        
        for(let i = 0; i < this.args.length;i++)
        {
            this.argsDic[i].value = new Constant(argsValues[i].calculate(cs, tempVars));
        }

        // #endregion

        return Process.calculate(cs, this.argsDic);

    }

    toString()
    {
        let args = "";
        for (let arg of this.args)
        {
            if (args == "")
                args += arg.toString();
            else
                args += ", " + arg.toString();
        }
        return `${this.name.toString()}(${args}) = ${Process.toString()}`;
    }
}

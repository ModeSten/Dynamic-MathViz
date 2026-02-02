

class DivObj {

    constructor(id, parentDiv, className=null ){

        this.div = document.createElement("div");
        this.className = className;
        this.parentDiv = null;

        this.div.id = id;

        if(this.className !== null){
            this.div.className = this.className;
        }

        this.assignToDiv(parentDiv);

    
    }


    assignToDiv( parentDiv ){
        
        if(parentDiv === null){
            return
        }

        this.parentDiv = parentDiv;
        this.parentDiv.appendChild(this.div);

    }


    removeFromDiv(){

        this.div.remove();
        this.parentDiv = null;

    }

}


class SliderObj{

    constructor(id, range, val=0, labelName="val", parentDiv=null, className="", steps=100){

        this.id = id;
        this.parentDiv = null;
        this.labelName = labelName;     // text to show before value
        this.valRound = 1;              // number of decimal points to display
        this.val = val;                 // current value
        this.listener = [];             // call on slider input
        this.steps = steps;             // number of slider value steps
        this.min = range[0];            // slider min value
        this.max = range[1];            // slider max value
        this.stepSize = (this.max -  this.min) / this.steps;    // slider value step coresponding to real value step
        
        // create slider html elements
        this.container = document.createElement("div");
            this.container.id = this.id;
            this.container.className = "sliderContainer" + " " + className;
        this.range = document.createElement("input");
            this.range.type = "range";
            this.range.id = this.id+"Range";
            this.range.className = "sliderRange";
            this.range.min = 0;
            this.range.max = steps;
            this.range.value = (val-this.min) / this.stepSize;
            this.range.oninput = ()=>this.onInput();
        this.label = document.createElement("h3");
            this.label.id = this.id+"Label";
            this.className = "sliderLabel";
            let labelTxt = "";
            if(this.labelName !== null){
                labelTxt += `${this.labelName}=`
            }
            labelTxt += `${val}`;
            this.label.innerHTML = labelTxt;

        this.container.appendChild(this.range);
        this.container.appendChild(this.label);

        this.assignToDiv(parentDiv);

    }


    assignToDiv( parentDiv ){

        if(parentDiv === null){
            return
        }
        
        this.parentDiv = parentDiv;
        this.parentDiv.appendChild(this.container);

    }


    removeFromDiv(){

        this.container.remove();
        this.parentDiv = null;

    }


    onInput(){

        this.val = (Number( this.range.value ) * this.stepSize) + this.min;
        let diplayVal = this.val.toFixed(this.valRound);

        let labelTxt = "";
        if(this.labelName !== null){
            labelTxt += `${this.labelName}=`
        }
        labelTxt += `${diplayVal}`;
        this.label.innerHTML = labelTxt;

        this.listener.forEach( (func)=>{ func( this.val ) } );

    }


    addListener(callback){

        this.listener.push(callback);
        console.log(this.listener);
        return ()=>{ this.listener = this.listener.filter( (func)=>{func !== callback}) };

    }


    removeAllListeners(){
        this.listener = [];
    }


}


class ButtonObj{

    constructor(id, label, parentDiv=null, className=""){

        this.id = id;
        this.parent = null;
        this.listener = [];

        this.button = document.createElement("button");
            this.button.id = this.id;
            this.button.className = className;
            this.button.textContent = label;
            this.button.onclick = ()=>{this.onClick();};

        this.assignToDiv(parentDiv);

    }


    assignToDiv( parentDiv ){

        if(parentDiv === null){
            return
        }

        this.parentDiv = parentDiv;
        this.parentDiv.appendChild(this.button);

    }


    addListener(callback){

        this.listener.push(callback);
        console.log(this.listener);
        return ()=>{ this.listener = this.listener.filter( (func)=>{func !== callback}) };

    }


    removeAllListeners(){

        this.listener = [];

    }


    onClick(){

        this.listener.forEach( (func)=>{ func(this) } );

    }


}


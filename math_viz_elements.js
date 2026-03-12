

// for creating and managing divs
class DivObj {

    constructor(id, parentDiv=null, className="" ){

        this.id = id;
        this.div = document.createElement("div");
        this.className = className;
        this.parentDiv = null;

        this.div.id = this.id;
        this.div.className = this.className;

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


// for creating and managing sliders (inputs)
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
        
        /* create slider html elements */
        this.container = document.createElement("div");     // create containing div
            this.container.id = this.id;
            this.container.className = "slider_container" + " " + className;

        this.range = document.createElement("input");       // create slider range (input)
            this.range.type = "range";
            this.range.id = this.id+"Range";
            this.range.className = "sliderRange";
            this.range.min = 0;                             
            this.range.max = steps;                             // range max value; number of value steps; default, 100
            this.range.value = (val-this.min) / this.stepSize;  // set inital value; convert slider value (custom) to range value (0 to 100)
            this.range.oninput = ()=>this.onInput();

        this.label = document.createElement("h3");              // create value label
            this.label.id = this.id+"Label";
            this.className = "sliderLabel";
            this.label.innerHTML = `${labelName}${val}`;        

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

        this.val = (Number( this.range.value ) * this.stepSize) + this.min; // convert range value to slider value
        let diplayVal = this.val.toFixed(this.valRound);                    // round value to be displayed
        this.label.innerHTML = `${this.labelName}${diplayVal}`;             // set display text
        this.listener.forEach( (func)=>{ func( this.val ) } );              // handle listeners

    }


    addListener(callback){

        this.listener.push(callback);
        return ()=>{ this.listener = this.listener.filter( (func)=>{func !== callback}) };

    }


    removeAllListeners(){
        this.listener = [];
    }


}


/* for creating and managing buttons */
class ButtonObj{

    constructor(id, label, parentDiv=null, className=""){

        this.id = id;
        this.parentDiv = null;
        this.listener = [];     // call on button click

        this.button = document.createElement("button"); // create button
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
        return ()=>{ this.listener = this.listener.filter( (func)=>{func !== callback}) };

    }


    removeAllListeners(){

        this.listener = [];

    }


    onClick(){

        this.listener.forEach( (func)=>{ func(this) } );

    }


}


// for creating buttons for steping (up and down) value; left-> - , right-> +
class ButtonStepObj{

    constructor(id, labelName, valRange, stepSize, value, btnLabelL="<", btnLabelR=">", parentDiv=null, className=""){

        this.id = id;
        this.parent = null;             
        this.range = valRange;          // min and max values: [min, max]
        this.stepSize = stepSize;       // value to decrease, increase by on click
        this.val = value;               // curent value
        this.labelName = labelName;     // text to display before value: ex "x="
        this.listener = [];             // call on button click

        this.container = document.createElement("div"); // create conatining div
            this.container.id = this.id;
            this.container.className = "stepBtn";

        this.btnL = document.createElement("button");   // create left (minus) button
            this.btnL.id = this.id+"L";
            this.btnL.className = "BtnL";
            this.btnL.textContent = btnLabelL;
            this.btnL.onclick = ()=>{this.onClick("L")};

        this.btnR = document.createElement("button");   // creat right (pluss) button
            this.btnR.id = this.id+"R";
            this.btnR.className = "BtnR";
            this.btnR.textContent = btnLabelR;
            this.btnR.onclick = ()=>{this.onClick("R")};

        this.label = document.createElement("h3");      // create text for displaying value and label text
            this.label.id = this.id+"label";
            this.className = "stepLabel";
            this.label.innerHTML = `${labelName}${this.val}`;


        this.container.appendChild(this.btnL);
        this.container.appendChild(this.label);
        this.container.appendChild(this.btnR);


        // disabel / enable button
        if(this.val - this.stepSize < this.range[0]){
            this.btnL.disabled = true;
        } else if(this.val + this.stepSize > this.range[1]){
            this.btnR.disabled = true;
        }


        this.assignToDiv(parentDiv);


    }


    assignToDiv( parentDiv ){

        if(parentDiv === null){
            return
        }

        this.parentDiv = parentDiv;
        this.parentDiv.appendChild(this.container);

    }


    onClick(side){

        if(side === "L"){   // left button clicked => decreae value

            this.btnR.disabled = false; // enable right button
            this.val -= this.stepSize;  // decrease by stepsize

            if(this.val - this.stepSize < this.range[0]){ // disable left button if at min value
                this.btnL.disabled = true;
            }

        } else if(side === "R"){    // right button pressed => increase value

            this.btnL.disabled = false; // enable left button
            this.val += this.stepSize;  // increase value by stepsize

            if(this.val + this.stepSize > this.range[1]){   // disable right button if at max value
                this.btnR.disabled = true;
            }

        }

        this.label.innerHTML = `${this.labelName}${this.val}`;  // set display text

        this.listener.forEach( (func)=>{ func(this.val) } );    // handle listener functions

    }


    addListener(callback){

        this.listener.push(callback);
        return ()=>{ this.listener = this.listener.filter( (func)=>{func !== callback}) };

    }


    removeAllListeners(){

        this.listener = [];

    }


}



class SelectorObj{

    constructor(id, labels, values, parentDiv=null, className=""){

        this.id = id;

        this.listener = [];

        this.select = document.createElement("select");
        this.select.name = this.id;
        this.select.id = this.id;
        this.className = "selector";


        this.labels = labels;
        this.values = values;

        this.options = [];

        for(let i=0; i<Object.keys(values).length; i++){

            let opt = document.createElement("option");
            opt.value = values[i];
            opt.innerHTML = labels[i];

            this.options.push(opt);
            this.select.appendChild(opt);

        }

        this.select.onchange = () => {this.on_change()};



        this.assignToDiv(parentDiv);



    }


    assignToDiv(parentDiv){

        if(parentDiv===null){
            return
        }

        parentDiv.appendChild(this.select);

    }


    on_change(){

        this.listener.forEach( (func)=>{ func(this.select.value) } ); 

    }


    addListener(callback){

        this.listener.push(callback);
        return ()=>{ this.listener = this.listener.filter( (func)=>{func !== callback}) };

    }


    removeAllListeners(){

        this.listener = [];

    }



}



class VizContainerObj{

    constructor(id, parentDiv=null){

        this.id = id;
        this.parentDiv = parentDiv;

        let contaienrId = this.id+"conatiner";
        this.containerDiv = new DivObj(contaienrId, parentDiv, "viz_container");
        
        let svgDivId = this.id+"svgdiv";
        this.svgDiv = new DivObj(svgDivId, this.containerDiv.div, "svg_div");
        
    }


    assignToDiv(div){

        if(Div === null){
            return
        }

        this.parentDiv = div
        this.containerDiv.assignToDiv(div);

    }


    removeFromDiv(){

        if(this.parentDiv === null){
            return
        }

        this.parentDiv = null;
        this.containerDiv.removeFromDiv();

    }


}





class DivObj {

    constructor(id, parentId="", className=null ){

        this.div = document.createElement("div");
        this.className = className;
        this.parentDiv = null;

        this.div.id = id;

        if(this.className !== null){
            this.div.className = this.className;
        }

        this.assignToDiv(parentId);

    
    }


    assignToDiv( parentId="" ){

        this.parentDiv = document.getElementById(parentId);
        
        if(this.parentDiv === null){
            return
        }

        this.parentDiv.appendChild(this.div);

    }


    removeFromDiv(){

        this.div.remove();
        this.parentDiv = null;

    }

}


class SliderObj{

    constructor(id, range, val=0, labelName="val", parentId=""){

        this.id = id;
        this.parentDiv = null;
        this.labelName = labelName;
        this.valRound = 1;  
        this.val = val;
        this.listener = [];
        
        this.container = document.createElement("div");
            this.container.id = this.id;
            this.container.className = "sliderContainer";
        this.range = document.createElement("input");
            this.range.type = "range";
            this.range.id = this.id+"Range";
            this.range.className = "sliderRange";
            this.range.min = range[0]*100;
            this.range.max = range[1]*100;
            this.range.value = val*100;
            this.range.oninput = ()=>this.onInput();
        this.label = document.createElement("h3");
            this.label.id = this.id+"Label";
            this.className = "sliderLabel";
            this.label.innerHTML = this.labelName+`=${(val*100).toFixed(this.valRound)}`;

        this.container.appendChild(this.range);
        this.container.appendChild(this.label);

        this.assignToDiv(parentId);

    }


    assignToDiv( parentId="" ){

        this.parentDiv = document.getElementById(parentId);
        
        if(this.parentDiv === null){
            return
        }

        this.parentDiv.appendChild(this.container);

    }


    removeFromDiv(){

        this.div.remove();
        this.parentDiv = null;

    }


    onInput(){

        this.val = Number( this.range.value ) / 100;
        this.val = this.val.toFixed(this.valRound);
        this.label.innerHTML = this.label.innerHTML = `${this.labelName}=${this.val}`;

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

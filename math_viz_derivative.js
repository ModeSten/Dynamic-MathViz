
/* requires math_viz script */
/* classes defining representations of graph derivative and tangent lines*/


// Class for drawing tangent line
class TangentObj extends ExstensionObj{


    constructor(id, fx, params={}, canvas=null, graph=null){

        super(id);

        this.fx = fx;       // tangent reference function
        this.params = {
            "fx": fx,                  // reference function 
             "centerX":0 ,             // tangent 'origin' x value
             "length": 10 ,            // tangent-line lenght
             "width":2.5 ,             // line width
             "color":"red",            // line (stroke) color
             "h": 0.01,                // h value for calculating slope (k)
             "draw": false
        };
        this.parse_params(params);

        this.duration = 50;     // default transition duration

        if(graph===null){
            this.get_data();
        }

        this.svgObj = new LineObj(this.id, this.data, this.params);

        this.set_parent(graph);         // set Graph object as reference; update on graph update
        this.assigne_to_canvas(canvas);
        
    }


    on_parent_update( obj, msg){

        let update = new UpdateNode({"fx": obj.params.fx});
        this.update(update);

    }

    resolve_update(){
        this.get_data();
    }
    
    get_data(){

        let func = get_tangent_function(this.params.fx, this.params.centerX, this.params.h);     // tangent-line function
        this.data = get_points_from_lenght(func, this.params.centerX, this.params.length, 0.5);

    }


    // Create update chain for changing tangent origin x value
    translate_center(center, stepSize=0.05, duration=this.duration){


        let direction = Math.sign( center - this.params.centerX );  // translate direction: new center is left (negative) or right (positive) of old
        let x = this.params.centerX + direction * stepSize;         

        let T = duration; // transition duration 


        let root = new UpdateNode({"centerX": x}, T);
        let node = root;
        x +=  direction * stepSize;


        while ( Math.abs(center-x) > 0.05 ){

            node.next = new UpdateNode({"centerX": x}, T);
            node = node.next;

            x +=  direction * stepSize;
            if( (x > center && center > this.params.centerX) || (x < center && center < this.params.centerX) ){
                x = center;
                node.next = new UpdateNode({"centerX": x}, T);
                break;
            }

        }

        this.update(root);

    }


}


// Class creating chain of tangent lines
class TangentChainObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null){

        super(id);

        this.params = {
            "fx": fx,           // reference function
             "n": 5 ,           // number of tangent (lines)     
             "width":2.5 ,      // line width
             "color":"red",     // line color
             "xRange": xRange,  // x value range 
             "h": 0.01,         // h value for calculating line slope
             "ofset": 0.5,       // 
            "draw": false
            };    
        this.parse_params(params);

        this.duration = 1000;

        if(graph===null){
            this.get_data();
        }

        this.svgObj = new LineObj( this.id, this.data, this.params );

        this.set_parent(graph);
        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];
        let ofset = this.params.ofset;

        let len = ( this.params.xRange[1] - this.params.xRange[0] ) / this.params.n;    // x value range for each tangent line
        let half = len / 2;
        let x0 = this.params.xRange[0] + len * ofset;


        for (let xi=x0; xi<this.params.xRange[1]; xi+=len){

            let func = get_tangent_function(this.params.fx, xi);

            this.data.push( [ xi-len*ofset, func(xi-len*ofset) ] );
            this.data.push( [ xi+len*(1-ofset), func(xi+len*(1-ofset)) ] );
            this.data.push( [ xi+len*(1-ofset), null ] );

        }

    }


    resolve_update(){

        this.get_data();

    }


    on_parent_update(){

        let update = new UpdateNode({"fx": this.parent.params.fx});
        this.update(update);

    }


}


// Class creating an aproximation of derivative based on function
class DerivativeApxObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null){

        super(id);
        this.params = {
            "fx": fx,           // reference function      
             "width":2.5 ,      // line width
             "color":"red",     // line color
             "xRange": xRange,  // x value range
             "h": 0.05,            // h value for caclulating slope and for sgement lenght
             "draw": false,
             "discrete": false
            };   
        this.parse_params(params); 

        this.duration = 50;

        if(graph === null){
            this.get_data();
        }

        this.svgObj = new LineObj( this.id, this.data, this.params );
        this.svgObj.duration = this.duration;

        this.set_parent(graph);
        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        let xStart = this.params.xRange[0];
        let xEnd = this.params.xRange[1];
        let h = this.params.h;


        for(let x=xStart; x<=xEnd; x+=h){

            let k = get_slope(this.params.fx, x, h);

            this.data.push([x, k]);

        }

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(obj, msg, duration){

        let update = new UpdateNode({"fx": obj.params.fx}, duration);
        this.update(update);

    }

}


// class for creating derivative aproximation based on parent (graph) data
class DxApxDataObj extends DerivativeApxObj{

    constructor(id, params={}, canvas=null, graph=null){

        super(id, null, null, params, canvas, graph);

    }


    // parent class override; get data based on parent data rather than function
    get_data(){

        this.data = [];
        if(this.graph === null){
            return;
        }

        this.data = derivativeData(this.parent.data);

    }


}



class DxColorObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas){

        super(id);

        this.params = {
            "fx": fx, 
            "xRange": xRange,
            "step": 0.1,
            "color0": "red",
            "color1": "green",
            "width": 2,
            "draw": false,
            "drawT": 1,
            "drawT0": 0,
            "mode": "second" // first (first derivative), second (second derivative), both.
        }
        this.parse_params(params);

        this.dxData0 = [];
        this.dxData1 = [];

        this.get_data();

        this.line0 = new LineObj(this.id+"0", this.data, {"color": this.params.color0}, canvas);
        this.line0.isDefined = (d, i )=>{ return this.definedPos( d, i ) };
        this.line1 = new LineObj(this.id+"1", this.data, {"color": this.params.color1}, canvas);
        this.line1.isDefined = (d, i )=>{ return this.definedNeg( d, i ) };
        
        this.update(new UpdateNode({}));

    }


    get_data(){

        this.data = []; // remove stored (old) data
        let y;

        for( let x=this.params.xRange[0]; x <= this.params.xRange[1]; x+=this.params.step){

            y = this.params.fx( x );
            this.data.push( [x, y] );

        }

        this.dxData0 = derivativeData(this.data);
        this.dxData1 = derivativeData(this.dxData0);

    }



    definedPos(i){

        if(this.params.mode === "first"){

            if(this.dxData0[i][1] === null){
                return false
            }

            return ( this.dxData0[i][1] > 0 );

        } else{

            if(this.dxData1[i][1] === null){
                return false
            }

            return ( this.dxData1[i][1] > 0 );

        }

    } 


    definedNeg(i){


        if(this.params.mode === "first"){

            if(this.dxData0[i][1] === null){
                return false
            }

            return ( this.dxData0[i][1] < 0 );

        } else{

            if(this.dxData1[i][1] === null){
                return false
            }

            return ( this.dxData1[i][1] < 0 );

        }

    }


    update(state){
   
        let duration = 0; 

        this.parse_params(state.params);
        this.resolve_update();

        state.params["data"] = this.data;
        
        let state0 = new UpdateNode({...state.params});
        state0.params["color"] = this.params.color0;

        let state1 = new UpdateNode({...state.params});
        state1.params["color"] = this.params.color1;

        let node = state.next;

        while( node !== null){              // loop through update nodes

            this.parse_params(node.params);
            this.resolve_update();


            if(node.duration === null){
                node.duration = this.duration;
            } 
            if(node.delay === null){
                node.delay = this.delay
            }


            let update0 = new UpdateNode({...node.params}, node.duration, node.delay);
            update0.params["color"] = this.params.color0;
            let update1 = new UpdateNode({...node.params}, node.duration, node.delay);
            update1.params["color"] = this.params.color1;
            

            state0.append(update0);
            state1.append(update1);

            
            duration += node.duration;
            node = node.next;

        }
        

        this.line0.update(state0);            // update child (visual) object; pass root update node
        this.line1.update(state1);
        this.notify_children(duration);

    }


    resolve_update(){

        this.get_data();

        this.line0.isDefined =  (d, i )=>{ return this.definedNeg( i ) };
        this.line1.isDefined =  (d, i )=>{ return this.definedPos( i ) };

    }


}






// Class creating series of (n) lines, aproximating orginal graph
class SlopeObj extends ExstensionObj{

 constructor(id, fx, params={}, canvas=null, graph=null){

        super(id);

        this.params = {
            "fx": fx,           // reference function       
             "h": 5 ,
             "x0":  -2.5,  
             "width":2.5 , 
             "color":"red",
             "draw": false
            };   
        this.parse_params(params); 

        this.duration = 50;

        if(graph === null){
            this.get_data();
        }

        this.svgObj = new LineObj( this.id, this.data, this.params );
        this.svgObj.duration = this.duration;

        this.set_parent(graph);
        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        let x = this.params.x0;
        let h = this.params.h;
            
        this.data.push([x, this.params.fx(x)]);
        this.data.push([x+h, this.params.fx(x+h)]);

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(obj, msg){

        let update = new UpdateNode({"fx": obj.params.fx});
        this.update(update);

    }


    // Create update chain for changing tangent origin x value
    translate_x0(x0, stepSize=0.05, duration=this.duration){


        let direction = Math.sign( x0 - this.params.x0 );  // translate direction: new center is left (negative) or right (positive) of old
        let x = this.params.x0 + direction * stepSize;         

        let T = duration; // transition duration 


        let root = new UpdateNode({"x0": x}, T);
        let node = root;
        x +=  direction * stepSize;


        while ( Math.abs(x0-x) > 0.05 ){

            node.next = new UpdateNode({"x0": x}, T);
            node = node.next;

            x +=  direction * stepSize;
            if( (x > x0 && x0 > this.params.centerX) || (x < x0 && x0 < this.params.x0) ){
                x = x0;
                node.next = new UpdateNode({"x0": x}, T);
                break;
            }

        }

        this.update(root);

    }

}



// Class creating series of lines aproximating orginal graph
class SlopeChainObj extends ExstensionObj{

 constructor(id, fx, xRange, params={}, canvas=null, graph=null){

        super(id);

        this.params = {
            "fx": fx,           // reference function
             "n": 5 ,           // number of tangent (lines)
             "length":5 ,       
             "width":2.5 , 
             "color":"red",
             "xRange": xRange,
             "h": 5,
             "draw": false
            };   
        this.parse_params(params); 

        this.duration = 50;

        if(graph === null){
            this.get_data();
        }

        this.svgObj = new LineObj( this.id, this.data, this.params );
        this.svgObj.duration = this.duration;

        this.set_parent(graph);
        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        let xStart = this.params.xRange[0];
        let xEnd = this.params.xRange[1];
        let h = this.params.h;


        for(let x=xStart; x<=xEnd; x+=h){
            
            this.data.push([x, this.params.fx(x)]);
            this.data.push([x+h, this.params.fx(x+h)]);
            this.data.push([x+h, null]);

        }

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(obj, msg){

        let update = new UpdateNode({"fx": obj.params.fx});
        this.update(update);

    }


}
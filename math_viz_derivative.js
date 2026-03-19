
/* requires math_viz script */
/* classes defining representations of graph derivative and tangent lines*/


// Class for drawing tangent line
class TangentObj extends ExstensionObj{


    constructor(id, fx, params={}, canvas=null, graph=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);

        this.fx = fx;                  // tangent reference function
        this.slope = 0;
        this.params = {
            "fx": fx,                  // reference function 
             "x0":0 ,                  // tangent 'origin' x value
             "length": 10 ,            // tangent-line lenght
             "width":2.5 ,             // line width
             "color":"red",            // line (stroke) color
             "h": 0.01,                // h value for calculating slope (k)
             "draw": false
        };
        this.parse_params(params);

        if(graph===null){
            this.get_data();
        }

        this.svgObj = new LineObj(this.id, this.data, this.params, null, this.classname, this.duration, this.delay);

        this.set_parent(graph);         // set Graph object as reference; update on graph update
        this.assigne_to_canvas(canvas);
        
    }


    on_parent_update( obj, msg, duration){

        let update = new UpdateNode({"fx": obj.params.fx}, duration);
        this.update(update);

    }

    resolve_update(){
        this.get_data();
    }
    
    get_data(){

        let func = get_tangent_function(this.params.fx, this.params.x0, this.params.h);     // tangent-line function
        this.data = get_points_from_lenght(func, this.params.x0, this.params.length, 0.5);

    }


    // Create update chain for changing tangent origin x value
    translate_center(center, stepSize=0.05, duration=this.duration){

        let direction = Math.sign( center - this.params.x0 );  // translate direction: new center is left (negative) or right (positive) of old
        let x = this.params.x0 + direction * stepSize;         

        let T = duration; // transition duration 


        let root = new UpdateNode({"x0": x}, T);
        let node = root;
        x +=  direction * stepSize;


        while ( Math.abs(center-x) > 0.05 ){

            node.next = new UpdateNode({"x0": x}, T);
            node = node.next;

            x +=  direction * stepSize;
            if( (x > center && center > this.params.x0) || (x < center && center < this.params.x0) ){
                x = center;
                node.next = new UpdateNode({"x0": x}, T);
                break;
            }

        }

        this.update(root);

    }


}


// Class creating chain of tangent lines
class TangentChainObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);

        this.params = {
            "fx": fx,           // reference function
             "n": 5 ,           // number of tangent (lines)     
             "width":2.5 ,      // line width
             "color":"red",     // line color
             "xRange": xRange,  // x value range 
             "h": 0.01,         // h value for calculating line slope
             "ofset": 0.5,       // 
            "draw": false,
            "lenght": [10], 
            "x0": [0]           
            };    
        this.parse_params(params);

        this.duration = 1000;

        if(graph===null){
            this.get_data();
        }

        this.defineDxPos = true;
        this.defineDxNeg = true;
        this.defineDxZero = true;

        this.svgObj = new LineObj( this.id, this.data, this.params, null, this.classname, this.duration, this.delay );
        this.svgObj.isDefined = (d, i)=>{ return this.defined_pos_neg_zero(d, i) };

        this.set_parent(graph);
        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        /*
        let len = ( this.params.xRange[1] - this.params.xRange[0] ) / this.params.n;    // x value range for each tangent line
        let half = len / 2;
        let x0 = this.params.xRange[0] + len * ofset;


        for (let xi=x0; xi<this.params.xRange[1]; xi+=len){

            let func = get_tangent_function(this.params.fx, xi);
            let points = get_points_from_lenght(func, xi, this.params.lenght, ofset);

            this.data.push(points[0]);
            this.data.push(points[1]);
            this.data.push([points[1][0], null]);

            /*
            this.data.push( [ xi-len*ofset, func(xi-len*ofset) ] );
            this.data.push( [ xi+len*(1-ofset), func(xi+len*(1-ofset)) ] );
            this.data.push( [ xi+len*(1-ofset), null ] );
        

        }
        */
        

        for( let i=0; i<this.params.x0.length; i++){

            let slope = get_tangent_function( this.params.fx, this.params.x0[i], this.params.h );
            let l = this.params.lenght.length
            let points = get_points_from_lenght( slope, this.params.x0[i], this.params.lenght[i%l] );

            this.data.push(points[0]);
            this.data.push(points[1]);
            this.data.push([points[1][0], null]);

        }

    }


    resolve_update(){

        this.get_data();

    }


    on_parent_update(obj, msg, duration){

        let update = new UpdateNode({"fx": this.parent.params.fx}, duration);
        this.update(update);

    }


    defined_pos_neg_zero(d, i){

        if( d[1] === null || d[0] === null ){
            return false;
        } 

        if(this.defineDxPos && this.defineDxNeg && this.defineDxZero){
            return true;
        }

        let delta=0;
        if( i > this.data.length-2 || this.data[i+1][1]===null ){
            delta = d[1] - this.data[i-1][1];
        } else{
            delta = this.data[i+1][1] - d[1];
        }

        if( !this.defineDxPos && delta > 0.1 ){
            return false;
        }

        if( !this.defineDxNeg && delta < -0.1){
            return false;
        }

        if( !this.defineDxZero && Math.abs(delta) < 0.1){
            return false
        }

        return true;

    }


}


// Class creating an aproximation of derivative based on function
class DerivativeApxObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);
        this.params = {
            "fx": fx,              // reference function      
             "width":2.5 ,         // line width
             "color":"red",        // line color
             "xRange": xRange,     // x value range
             "h": 0.05,            // h value for caclulating slope and for sgement lenght
             "draw": false,
             "discrete": false,
             "step": 0.05,
             "dashArray": "0, 0"   // specify if / how line should be dashed
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

        for(let x=xStart; x<=xEnd; x+=this.params.step){

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

    // parent class override; get data based on parent data rather than function
    get_data(){

        this.data = [];
        if(this.parent === null){
            return;
        }

        this.data = derivativeData(this.parent.data);

    }

}


// class for creating graph colored based on derivative / second derivative greater or smaller than 0
class DxColorObj extends ExstensionMultiObj{

    constructor(id, fx, xRange, params={}, canvas=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);

        this.params = {
            "fx": fx,           // function
            "xRange": xRange,   // line x start and en values ([start, end])
            "step": 0.01,        // x step size between each data pair
            "color0": "red",    // color when derivative is negative  
            "color1": "blue",  // color when derivative is positive
            "width": 2,         
            "draw": false,      // specifiy line should animated as if drawn (true || false)
            "drawT": 1,         // draw animation end (relative to line lenght: 0 to 1)
            "drawT0": 0,        // draw animation start (relative: 0 to 1)
            "mode": "second"    // first (first derivative), second (second derivative), both.
        }
        this.parse_params(params);

        this.dxData0 = [];  // first derivative data
        this.dxData1 = [];  // second derivative data

        this.get_data();

        this.svgObj.push ( new LineObj(this.id+"0", this.data, {"color": this.params.color0}, null, this.classname, this.duration, this.delay) );    
        this.svgObj[0].isDefined = (d, i )=>{ return this.definedPos( d, i ) };
        this.svgObj.push( new LineObj(this.id+"1", this.data, {"color": this.params.color1}, null, this.classname, this.duration, this.delay) );
        this.svgObj[1].isDefined = (d, i )=>{ return this.definedNeg( d, i ) };
        this.svgObj.push( new LineObj(this.id+"3", this.data, {"color": "black"}, null, this.classname, this.duration, this.delay) );
        this.svgObj[2].isDefined = (d, i)=>{ return this.definedZero( d, i) };
        
        this.update(new UpdateNode(this.params, 0, 0));
        this.assigne_to_canvas(canvas);

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


    /* defined for positive derivative */ 
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


    /* defined for neagtive derivative */
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

    /* defined for derivative is 0 */
    definedZero(d, i){


        if(this.params.mode === "first"){

            if(this.dxData0[i][1] === null){
                return false
            }

            return ( Math.abs(this.dxData0[i][1]) < 0.01 );

        } else{

            if(this.dxData1[i][1] === null){
                return false
            }

            return ( Math.abs(this.dxData1[i][1]) < 0.01 );

        }

    }


    get_svgObj_params(){

        let params = [];
        let objL = this.svgObj.length;
        let colors = [this.params.color0, this.params.color1, "black"];
        for(let i=0; i<objL; i++){
            params.push( {
            "color": colors[i],    
            "width": this.params.width,         
            "draw": this.params.draw,      // specifiy line should animated as if drawn (true || false)
            "drawT": this.params.drawT,         // draw animation end (relative to line lenght: 0 to 1)
            "drawT0": this.params.drawT0,        // draw animation start (relative: 0 to 1)
            "data": [...this.data]
            } );

        }

        return params;

    }


    resolve_update(){

        this.get_data();

        this.svgObj[0].isDefined = (d, i )=>{ return this.definedNeg( i ) };
        this.svgObj[1].isDefined = (d, i )=>{ return this.definedPos( i ) };
        //this.svgObj[2].isDefined = (d, i)=>{ return this.definedZero( i ) };

    }


}


class DxAproxColoredObj extends ExstensionMultiObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);

        this.params ={
            "fx": fx,              // reference function      
             "width":2.5 ,         // line width
             "color0":"red",        // line color
             "color1":"blue",
             "xRange": xRange,     // x value range
             "h": 0.05,            // h value for caclulating slope and for sgement lenght
             "draw": false,
             "discrete": false,
             "step": 0.05,
             "dashArray": "0, 0",   // specify if / how line should be dashed
             "drawT": 1,
             "drawT0": 0
        }
        this.parse_params(params);

        this.svgObj.push( new LineObj(this.id+"0", this.data));
        this.svgObj[0].isDefined = (d)=>{ return (d[0] !== null) && (d[1] !== null) && (d[1]<-0.01)};
        this.svgObj.push( new LineObj(this.id+"1", this.data));
        this.svgObj[1].isDefined = (d)=>{ return (d[0] !== null) && (d[1] !== null) && (d[1]>0.01)};
        this.svgObj.push( new LineObj(this.id+"2", this.data));
        this.svgObj[2].isDefined = (d)=>{ return (d[0] !== null) && (d[1] !== null) && ( Math.abs(d[1])<0.01 )};

        this.set_parent(graph);
        this.assigne_to_canvas(canvas);

        this.update(new UpdateNode({}, 0, 0));

    }


    get_data(){

        this.data = [];

        let xStart = this.params.xRange[0];
        let xEnd = this.params.xRange[1];
        let h = this.params.h;

        for(let x=xStart; x<=xEnd; x+=this.params.step){

            let k = get_slope(this.params.fx, x, h);

            this.data.push([x, k]);

        }

    }


    resolve_update(){

        this.get_data();

    }


    get_svgObj_params(){

        let params = [];
        let color = [this.params.color0, this.params.color1, "black"];

        let l = this.svgObj.length;
        for(let i=0; i<l;i++){
            params.push({
              "data": [...this.data],
              "color": color[i],
              "width": this.params.width,
              "draw": this.params.draw,
              "drawT": this.params.drawT,
              "drawT0" :this.params.drawT0,
              "dashArray": this.params.dashArray
            });
        }

        return params;

    }


    on_parent_update(obj, msg, duration){

        this.update( new UpdateNode({"fx": this.parent.params.fx}, duration) );

    }


}


class DxAproxDataColoredObj extends DxAproxColoredObj{

    constructor(id, params={}, canvas, graph){
        super(id, null, null, params, canvas, graph);
    }

    get_data(){

        this.data = [];
        if(this.parent === null){
            return;
        }

        this.data = derivativeData(this.parent.data);
        
    }

}



// Class creating series of (n) lines, aproximating orginal graph
class SecantObj extends ExstensionObj{

 constructor(id, fx, params={}, canvas=null, graph=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);

        this.params = {
            "fx": fx,           // function: (x)=>{return some function}
             "h": 5 ,           // h value for calculating slope (x step betwee slope start and end)
             "x0":  -2.5,       // slope line starting point (x)
             "width":2.5 ,      
             "color":"red", 
             "draw": false,      // specifiy line should animated as if drawn (true || false)
             "lenght": 40
            };   
        this.parse_params(params); 

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
        let l = this.params.lenght;

        let slope = get_tangent_function(this.params.fx, x, h);
        let ends = get_points_from_lenght(slope, x, l);
            
        this.data.push(ends[0]);
        this.data.push([x, this.params.fx(x)]);
        this.data.push([x+h, this.params.fx(x+h)]);
        this.data.push(ends[1]);

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(obj, msg, duration){

        let update = new UpdateNode({"fx": obj.params.fx}, duration);
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


// class for creating lines, highligthing slope (secant) delta y and delta x (h) between intersection points
class SecantSuportObj extends ExstensionObj{

    constructor(id, secant, params={}, canvas=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);
        this.labels = null;

        this.labelPos = [];
        this.labelText = [];
        this.params = {
            "width": 2.5,
            "color": "black",   
            "draw": false,
            "dashArray": "5, 5"     // specifing if / how line shoudl be dashed
        };
        this.parse_params(params);

        this.set_parent(secant.svgObj);

        this.get_data();

        this.svgObj = new LineObj(this.id+"Line", this.data, this.params, null, this.classname, this.duration, this.delay);

        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        if(this.parent === null){
            return
        }

        let points = this.parent.data;

        let x0 = points[1][0];
        let y0 = points[1][1];
        let x1 = points[2][0];
        let y1 = points[2][1];

        this.data.push([x0, y0]);
        this.data.push([x1, y0]);
        this.data.push([x1, y1]);

    }


   resolve_update(node){
    
    this.get_data(this.data[1][0]-this.data[0][0]);

        if(this.data[1][0]-this.data[0][0] < 0.5 || Math.abs(this.data[2][1]-this.data[1][1])<0.5){
            node.params.width = 0;
        }
        else{
            node.params.width = 2.5;
        }

   } 


   on_parent_update(obj, msg, duration){

        this.update(new UpdateNode({}, duration));

   }


}



// Class creating series of lines aproximating orginal graph
class SlopeChainObj extends ExstensionObj{

 constructor(id, fx, xRange, params={}, canvas=null, graph=null, classname="", duration=0, delay=0){

        super(id, classname, duration, delay);

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

        this.svgObj = new LineObj( this.id, this.data, this.params, null, this.classname, this.duration, this.delay );

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

/* requires math_viz script */


class TangentBaseObj{


    constructor(id, fx){

        this.id = id;

        this.line;          // line object for svg elements

        this.fx = fx;       // tangent reference function
        this.params = {};   // 
        this.data = [];     // data points for plotting

        this.canvas;        // canvas (class) object
        this.graph;         // reference graph object
        this.duration = 10; // transition (default) duration
        this.delay = 0;     // transition (default) delay

        this.children = [];

        this.isDefined = (d, i)=>{return (d[0]!==null) && (d[1]!==null)};
        
    }


    add_child( obj, func){

        this.remove_child(obj);     // remove child if already exists; avoid duplicates
        this.children.push( {element: obj, callback: func} )

    }

    remove_child( obj ){

        this.children = this.children.filter( (e) => {return e.element.id !== obj.id} );

    }


    notify_children(){

        this.children.forEach( (c) => { c.callback( this, "" );} );

    }


    // get optional parameter values from input
    parse_params(params){

            for (let [key, val] of Object.entries(this.params)){

                if( params[key] !== undefined ){
                    this.params[key] = params[key];
                } 

            }
        
    }


    assign_graph(graph){

        if(graph === null){
            return
        }

        this.graph = graph;
        this.update( new UpdateNode({"fx": graph.params.fx}) );

        graph.add_child(this, (obj, msg)=>{ this.update(new UpdateNode({"fx": graph.params.fx})) });

    }

    // dereference graph
    remove_graph(){

        if(this.graph === null){
            return
        }

        this.graph.removeChild(this);
        this.graph = null;

    }


    assigne_to_canvas(canvas){

        if(canvas === null){
            return
        }

        if(canvas === null){
            return
        }

        this.canvas = canvas;
        this.line.assigne_to_canvas(canvas);

    }


    remove_from_canvas(){

        if(this.canvas === null){
            return
        }
       
        this.line.remove_from_canvas();
        this.canvas = null;

    }


    update(state){  


        this.parse_params(state.params);
        this.resolve_update();

        state.params.data = this.data;      // add tangent lien data to root update node
        let node = state.next;      

        while( node !== null){              // loop through update nodes
    
            this.parse_params(node.params);
            this.resolve_update();
            node.params.data = this.data;   // add tangent line data to update node

            node = node.next;

        }
        
        this.line.update(state);            // update child line object; pass root update node
        this.notify_children();

    }


    resolve_update(){
        /* placeholder for child class override */
    }


}




class TangentObj extends TangentBaseObj{   // tangent line

    constructor(id, fx, params={}, canvas=null, graph=null){

        super(id, fx);

        this.canvas;
        this.graph;                    // optional GraphObj: track to update tangent on graph change
        
        this.params = {
            "fx": fx,                  // reference function 
             "center":0 ,              // tangent 'origin' x value
             "length": 35 ,            // tangent line lenght
             "width":2.5 ,             
             "color":"red",            // tangent line (stroke) color
             "h": 0.01                 // h value for calculating tangent slope (k)
            };    

        this.parse_params(params);      // read optional parameters from input

        this.get_data();

        this.line = new LineObj( id, this.data, this.params );

        this.assigne_to_canvas(canvas)
        this.assign_graph(graph);

    }

 assign_graph(graph){

        if(graph === null){
            return
        }

        this.graph = graph;
        this.update( new UpdateNode({"fx": graph.params.fx}) );

        graph.add_child(this, (obj, msg)=>{ this.update(new UpdateNode({"fx": graph.params.fx})) });

    }

    remove_graph(){

        if(this.graph === null){
            return
        }

        this.graph.removeChild(this);
        this.graph = null;

    }


    assigne_to_canvas(canvas){

        if(canvas === null){
            return
        }

        if(canvas === null){
            return
        }

        this.canvas = canvas;
        this.line.assigne_to_canvas(canvas);

    }


    remove_from_canvas(){

        if(this.canvas === null){
            return
        }
       
        this.line.remove_from_canvas();
        this.canvas = null;

    }


    translate_center(center, stepSize=0.05){

        let direction = Math.sign( center - this.params.center );
        let x = this.params.center + direction * stepSize;

        let T = 5; // transition duration 


        let root = new UpdateNode({"center": x}, T);
        let node = root;
        x +=  direction * stepSize;

        while ( Math.abs(center-x) > 0.05 ){

            node.next = new UpdateNode({"center": x}, T);
            node = node.next;

            x +=  direction * stepSize;
            if( (x > center && center > this.params.center) || (x < center && center < this.params.center) ){
                x = center;
                node.next = new UpdateNode({"center": x}, T);
                break;
            }

        }

        this.update(root);

    }


    resolve_update(){
        this.get_data();
        this.fx = this.params.fx;   // fx duplicated to maintain consitency between classes
    }


    get_data(){

        let func = get_tangent_function(this.params.fx, this.params.center, this.params.h);     // tangent-line function
        this.data = get_points_from_lenght(func, this.params.center, this.params.length);

    }

}


class TangentChainObj extends TangentBaseObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null){

        super(id);

        this.params = {
            "fx": fx,           // reference function
             "n": 5 ,           // number of tangent (lines)
             "length":5 ,       
             "width":2.5 , 
             "color":"red",
             "xRange": xRange,
             "h": 0.01
            };    
        this.parse_params(params);

        if(graph == null){
            this.get_data();
        }

        this.line = new LineObj( this.id, this.data, this.params );
        this.line.isDefined = this.isDefined;

        this.assigne_to_canvas(canvas);
        this.assign_graph(graph);

    }


    get_data(){

        this.data = [];

        let segementL = ( this.params.xRange[1] - this.params.xRange[0] ) / this.params.n;
        let half = segementL / 2;
        let x0 = this.params.xRange[0] + half;


        for (let i=x0; i<this.params.xRange[1]; i+=segementL){

            let func = get_tangent_function(this.params.fx, i);

            this.data.push( [ i-half, func(i-half) ] );
            this.data.push( [ i+half, func(i+half) ] );
            this.data.push( [ i-half, null ] );

        }

    }


    resolve_update(){

        this.get_data();
        this.fx = this.params.fx;

    }


}



class TangenHChainObj extends TangentChainObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null, h=5){

        params.h = h;
        super(id, fx, xRange, params, canvas, graph );

    }


    get_data(){

        this.data = [];

        let xStart = this.params.xRange[0];
        let xEnd = this.params.xRange[1];
        let h = this.params.h;


        for(let x=xStart; x<xEnd; x+=h){

            let k = get_slope(this.params.fx, x, h);

            this.data.push([x, k]);
            this.data.push([x+h, k]);
            this.data.push([x+h, null]);

        }

    }

}
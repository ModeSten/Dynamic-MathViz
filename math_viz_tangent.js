
/* requires math_viz script */


class TangentBaseObj{


    constructor(id, fx){

        this.id = id;

        this.line;

        this.fx = fx;
        this.params = {};
        this.data = [];

        this.canvas;
        this.graph;
        this.duration = 10;
        this.delay = 0;

        this.isDefined = (d, i)=>{return (d[0]!==null) && (d[1]!==null)};
        
    }


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

        state.params.data = this.data;
        let node = state.next;

        while( node !== null){
    
            this.parse_params(node.params);
            this.resolve_update();
            node.params.data = this.data;

            node = node.next;

        }
        
        this.line.update(state);

    }


    resolve_update(){
        /* placeholder for child class override */
    }


}




class TangentObj{   // tangent line

    constructor(id, fx, params={}, canvas=null, graph=null){

        this.id = id;
        this.canvas;
        this.graph;                    // optional GraphObj: track to update tangent on graph change
        
        this.params = {
            "fx": fx,
             "center":0 , 
             "length":5 , 
             "width":2.5 , 
             "color":"red", 
             "duration":5 , 
             "translateT": 5,
             "delay":0, 
            };    

        for (let [key, val] of Object.entries(this.params)){    // read optional parameters

            if( params[key] !== undefined ){
                this.params[key] = params[key];
            }

        }

        this.data;
        this.get_data();


        let lineParams = {...this.params}
        this.line = new LineObj( id, this.data, lineParams );

        this.assigne_to_canvas(canvas)

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


    update(state){  

        for (let [key, val] of Object.entries(this.params)){

            if( state.params[key] === undefined ){
                state.params[key] = this.params[key];
            } else{
                this.params[key] = state.params[key];
            }

        }
        this.get_data();

        let lineParams = {...this.params}
        lineParams.data = this.data;
        
        let root = new UpdateNode(lineParams, state.duration, state.delay);
        let node = root;

        state = state.next;

        while( state !== null){
    
            for (let [key, val] of Object.entries(this.params)){

                if( state.params[key] === undefined ){
                    state.params[key] = this.params[key];
                } else{
                    this.params[key] = state.params[key];
                }

            }
            this.get_data();

            lineParams = {...this.params};
            lineParams.data = this.data;

            node.next = new UpdateNode(lineParams, state.duration, state.delay);
            node = node.next;

            state = state.next;

        }
        
        this.line.update(root);

    }


    translate_center(center, stepSize=0.05){

        let direction = Math.sign( center - this.params.center );
        let x = this.params.center + direction * stepSize;


        let root = new UpdateNode({"center": x}, 5);
        let node = root;
        x +=  direction * stepSize;

        while ( Math.abs(center-x) > 0.05 ){

            node.next = new UpdateNode({"center": x}, 5);
            node = node.next;

            x +=  direction * stepSize;
            if( (x > center && center > this.params.center) || (x < center && center < this.params.center) ){
                x = center;
                node.next = new UpdateNode({"center": x}, 5);
                break;
            }

        }

        this.update(root);

    }


    get_data(){

        let func = get_tangent_function(this.params.fx, this.params.center);     // tangent-line function
        this.data = get_points_from_lenght(func, this.params.center, this.params.length);

    }

}


class TangentChainObj extends TangentBaseObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null){

        super(id);

        this.params = {
            "fx": fx,
             "n": 5 , 
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

            this.data.push( [ i-half, null ] );
            this.data.push( [ i-half, func(i-half) ] );
            this.data.push( [ i+half, func(i+half) ] );

        }

    }


    resolve_update(){

        this.get_data();

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

            let x0 = x + h/2;
            let k = get_slope(this.params.fx, x0);

            this.data.push([x, k]);
            this.data.push([x+h, k]);
            this.data.push([x+h, null]);

        }

    }

}
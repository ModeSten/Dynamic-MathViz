
/* requires math_viz script */


class TangentBaseObj extends ExstensionObj{


    constructor(id, fx, params={}, canvas=null, graph=null){

        super(id);

        this.fx = fx;       // tangent reference function
        this.params = {
            "fx": fx,                  // reference function 
             "centerX":0 ,              // tangent 'origin' x value
             "length": 10 ,            // tangent line lenght
             "width":2.5 ,             
             "color":"red",            // tangent line (stroke) color
             "h": 0.01                 // h value for calculating tangent slope (k)
        };
        this.parse_params(params);

        if(graph===null){
            this.get_data();
        }

        this.svgObj = new LineObj(this.id, this.data, this.params);

        this.set_parent(graph);
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


    translate_center(center, stepSize=0.05){


        let direction = Math.sign( center - this.params.centerX );
        let x = this.params.centerX + direction * stepSize;

        let T = 5; // transition duration 


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


class TangentChainObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null){

        super(id);

        this.params = {
            "fx": fx,           // reference function
             "n": 5 ,           // number of tangent (lines)
             "length":5 ,       
             "width":2.5 , 
             "color":"red",
             "xRange": xRange,
             "h": 0.01,
             "ofset": 0.5
            };    
        this.parse_params(params);

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

        let len = ( this.params.xRange[1] - this.params.xRange[0] ) / this.params.n;
        let half = len / 2;
        let x0 = this.params.xRange[0] + len * ofset;


        for (let xi=x0; xi<this.params.xRange[1]; xi+=len){

            let func = get_tangent_function(this.params.fx, xi);
            console.log(xi-len*(1-ofset));

            this.data.push( [ xi-len*ofset, func(xi-half) ] );
            this.data.push( [ xi+len*(1-ofset), func(xi+half) ] );
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



class TangenHChainObj extends ExstensionObj{

    constructor(id, fx, xRange, params={}, canvas=null, graph=null, h=5){

        super(id);
        this.params = {
            "fx": fx,           // reference function
             "n": 5 ,           // number of tangent (lines)
             "length":5 ,       
             "width":2.5 , 
             "color":"red",
             "xRange": xRange,
             "h": 3
            };   
        this.parse_params(params); 

        if(graph === null){
            this.get_data();
        }

        this.svgObj = new LineObj( this.id, this.data, this.params );

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
            this.data.push([x+h, k]);
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
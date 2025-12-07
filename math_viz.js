
/* mathematics visualisation, generci functions and classes */
/* 
dependencies: 
- D3 
*/


/* math (elements) visualiazation classes */

// Visualization object: holds common parameters and svg element
class CanvasObj {

    constructor ( width, height, margin, id, xRange, yRange, parentId=null){

        this.ID = id;           // canvas id; also used as svg id
        this.parentId;          // id of div container; svg parent div 
        this.children = [];     // canvas child objects / elements [ class-objet, callback]

        this.svg = null; 

        this.width = width;     // svg height (pixels)
        this.height = height;   // svg width  (pixels)
        this.margin = margin;   // svg margins (pixels); top, bottom, left, right

        this.xRange = xRange;   // x value, default range
        this.yRange = yRange;   // y value, default range

        this.xScale;
        this.yScale;

        this.set_dependent_params();

        if(parentId !== null ){
            this.assign_to_div( parentId );
        }

    }

    set_dependent_params(){

        this.xScale = d3.scaleLinear( this.xRange, [0, this.width] );
        this.yScale = d3.scaleLinear( this.yRange, [this.height, 0] );

    }

    // assign canvas to html div and create svg element
    assign_to_div ( targetDivId ){

        this.parentId = targetDivId;

        this.svg = d3.select("#"+targetDivId)
            .append("svg")
                .attr("id", this.ID)
                .attr("class", "viz_svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
                .attr("transform", "translate("+ this.margin.left + "," + this.margin.top +")");

        this.svg.append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this.width)
                .attr("height", this.height);

        this.notify_children();

    }


    remove_from_div (){

        let container = document.getElementById(this.parentId);   // get conatining div
        let element = document.getElementById(this.ID);         // get svg element

        container.removeChild(element);             

        this.parentId = null;
        this.svg = null;

        this.notify_children();

    }

    update_canvas(){

        this.notify_children();

    }

    add_child( obj, func){

        this.children.push( {element: obj, callback: func} )

    }

    removeChild( obj ){

        this.children = this.children.filter( (e) => {return e.element.id !== obj.id} );

    }

    // notify change to canvas (ex assignment to div)
    notify_children(){

        this.children.forEach( (c) => { c.callback( this, "" );} );

    }

}


// parent class for math visualisation classes; implements common parameters and methods
class VisualObj{

    constructor(id){

        this.id = id;
        this.canvas = null;     // assigned canvas element
        this.params = {};       

        this.duration = 1000;   // transition dration (default)
        this.delay = 0;         // transition delay (default)
        this.isDefined = (d, i) => { return ( d[0] !== null )  && ( d[1] !== null ) };

        this.data = [];
        this.children = [];

    }


    // Read input parameters and overide stored values
    parse_params( params ){

        for (let [key, val] of Object.entries(this.params)){
            if( params[key] !== undefined ){
                this.params[key] = params[key];
            }
        }

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


    assigne_to_canvas(canvas){

        if(canvas === null ){
            return
        }

        this.canvas = canvas;
        canvas.add_child(this, (id, msg) => { this.svg_init() });

        this.svg_init();

    }


    remove_from_canvas(){

        if(this.canvas === null){
            return
        }

        if(this.canvas.svg !== null){
            this.canvas.svg.selectAll("."+this.id).remove();    // remove svg elements
        }

        this.canvas.removeChild(this);      // remove from canvas child list
        this.canvas = null;

    }


    update(state){

        if(state === null){
            return
        }

        this.parse_params(state.params);
        this.resolve_update();              // resolve update 'side-efects'; Custome for each child class (ex update data)
        this.notify_children();

        this.svg_init( state.duration, state.delay, ()=>{ this.update(state.next) } );

    }


    svg_init(callback=()=>{return}){
        /* placeholder for child obj init */
    }


    resolve_update(){
        /* placeholder for child override */
    }

    
}


// kordinate system (axis)
class ChartObj extends VisualObj{

    constructor ( id, params={}, canvas=null){

        super(id);

        this.params = {
            "xRange": null,
            "yRange": null
        };

        this.parse_params(params);

        this.xAxisOfset;  // chart x (botom) axis ofset (from top)
        this.yAxisOfset;            // chart y (left) axis ofset (from left edge)

        if (canvas !== null){     // create svg if target div is specified
            this.assigne_to_canvas( canvas );
        }

    }

    // get x & y scales based on value range and canvas size
    get_scale(){

        let xScale;
        let yScale;

        // if no value range specified, use canvas scale
        if(this.params.xRange === null){   
            this.params.xRange = this.canvas.xRange;
        } 
        if(this.params.yRange === null){
            this.params.yRange = this.canvas.yRange;
        }

        xScale = d3.scaleLinear( this.params.xRange, [0, this.canvas.width] );
        yScale = d3.scaleLinear( this.params.yRange, [this.canvas.height, 0]);

        return {"x": xScale, "y": yScale};

    }

    // get svg axis based on scale
    get_axis( scale ){

        let xAxis = d3.axisBottom(scale.x); 
        let yAxis = d3.axisLeft(scale.y); 

        return {"x": xAxis, "y": yAxis};

    }


    // get axis ofset based on x and y range 
    get_axis_ofset(){

        let xStep = this.canvas.width / (this.params.xRange[1] - this.params.xRange[0]);    // distance coresponding to each x value step
        let yStep = (this.canvas.height) / (this.params.yRange[1] - this.params.yRange[0]); // distance coresponding to each y value step

        let xAxisOfset;     // x Axis ofset from top
        let yAxisOfset;     // y axis ofset from left side


        if(this.params.yRange[0] < 0){     // if min y value is negative, move x-axis up 
            this.xAxisOfset = this.canvas.height + yStep * this.params.yRange[0];
            xAxisOfset = this.canvas.height + yStep * this.params.yRange[0];
        } else{
            this.xAxisOfset = this.canvas.height; 
            xAxisOfset = this.canvas.height; 
        }

        if(this.params.xRange[0] < 0){     // if min x is negative, move y-axis to right
            this.yAxisOfset = xStep * -this.params.xRange[0];
            yAxisOfset = xStep * -this.params.xRange[0];
        } else{
            this.yAxisOfset = 0;
            yAxisOfset = 0;
        }

        return {"x": xAxisOfset, "y": yAxisOfset};

    }


    svg_init(callback=()=>{return}){

        if (this.canvas.svg === null){
            return;
        }

        let scale = this.get_scale();
        let axis = this.get_axis( scale );
        let AxisOfset = this.get_axis_ofset();

        this.canvas.svg.append("g")
            .attr("transform", `translate(0,${AxisOfset.x})`)
            .attr("class", this.id)
            .call(axis.x);

        this.canvas.svg.append("g")
            .attr("transform", `translate(${AxisOfset.y},0)`)
            .attr("class", this.id)
            .call(axis.y);

        // Axes label

        // x label
        this.canvas.svg.append("text")
            .attr("class", `x-label ${this.id}`)
            .attr("text-anchor", "end")
            .attr("x",  -15)
            .attr("y", AxisOfset.x)
            .text("x");

        // y label
        this.canvas.svg.append("text")  
            .attr("class", `y-label ${this.id}`)
            .attr("text-anchor", "end")
            .attr("x", AxisOfset.y)
            .attr("y", -15)
            .html("y");

    }

}


class GraphObj extends VisualObj{

    constructor( id, fx, xRange, params, canvas=null ){ 

        super(id);

        this.fx = fx;           // graph function
        this.xRange = xRange;   // graph value (x) range

        this.params = {
            "fx": fx,           // function: (x)=>{ returne f(x) }
            "xRange": xRange,   // x bounds: [x0, x1]
            "step": 0.1,        // stepsize (x) between ploted points 
            "color": "black",   // stroke color
            "width": 2.5,       // stroke widght
        };

        this.parse_params(params);

        this.get_data();
        
        if(canvas !== null){
            this.assigne_to_canvas(canvas);
        }
        
    }


    resolve_update(){

        this.get_data();

    }


    get_data(){

        this.data = []; // remove stored data
        let y;

        for( let x=this.params.xRange[0]; x <= this.params.xRange[1]; x+=this.params.step){

            y = this.params.fx( x );
            this.data.push( [x, y] );

        }

    }


    svg_init(duration=this.duration, delay=this.delay, callback=()=>{return}){

        if(this.canvas === null || this.canvas.svg === null){
            return
        }


        let u = this.canvas.svg.selectAll("."+this.id)
            .data([this.data], (d)=>{return d.ser1});

        let line = d3.line()
            .x( (d) => {return this.canvas.xScale(d[0])} )
            .y( (d) => {return this.canvas.yScale(d[1])} )
            .defined(  (d, i)=>{ return this.isDefined(d, i) } );

        u.enter()
            .append("path")
            .attr("class", this.id)
            .attr("clip-path", "url(#clip)")
        .merge(u)
            .transition()
            .delay(delay)
            .duration(duration)
            .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", this.params.color)
                .attr("stroke-width", this.params.width)
            .on("end", callback);

    }


}


class LineObj extends VisualObj{

    constructor( id, points, params, canvas=null){

        super(id);

        this.params = {
        "data": points,
        "width": 2.5,
        "color": "black"
        };

        this.data = this.params.data;

        this.parse_params(params);
        this.assigne_to_canvas(canvas);
    
    }


    svg_init(duration=this.duration, delay=this.delay, callback = ()=>{return}){


        if(this.canvas === null || this.canvas.svg === null){
            return
        }

        let u = this.canvas.svg.selectAll("."+this.id)
            .data( [this.params.data], (d)=>{return d.ser1} );


        let line = d3.line()
            .x( (d)=>{return this.canvas.xScale(d[0])} )
            .y( (d)=>{return this.canvas.yScale(d[1])} )
            .defined( (d, i) => { return this.isDefined(d, i) } );


        u.enter()
            .append("path")
                .attr("class", this.id)
        .merge(u)
            .transition()
                .duration(duration)
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", this.params.color)
                .attr("stroke-width", this.params.width)
                .delay(delay)
            .on("end", callback);

    }
    

}


class MarkerObj extends VisualObj{

    constructor( id, params, canvas=null, parent=null){

        super(id);

        this.params = {
            "data":[],
            "color": "red",
            "r": "3",
            "space": 5
        };

        this.parse_params(params);
        this.parent = null;
        this.on_paren_update;

        this.set_parent(parent);
        this.assigne_to_canvas(canvas);

        this.resolve_update();
        this.svg_init();

    }


    set_parent(parent, callback=this.space_marker){

        if(parent === null){
            return
        }

        this.on_paren_update = callback;
        parent.add_child(this, (obj, msg)=>{callback(); this.svg_init() });
        this.parent = parent;

    }


    remove_parent(){

        this.parent.remove_child(this);

    }


    space_marker(){

        if( this.parent === null){
            return
        }

        this.data = [];
        let len = Object.keys(this.parent.data).length
        let space = this.params.space;

        let d0 = this.parent.data[0];
        //this.data.push(d0);

        let d1;
        let L = 0;
        for(let i=1; i<len; i++){
            
            d1 = this.parent.data[i];
            L += Math.sqrt( (d1[0]-d0[0])**2 + (d1[1]-d0[1])**2 );
            if(L >= space){
                this.data.push(d1);
                L=0;
            }
            d0 = d1;

        }

    }


    resolve_update(){

        if(this.parent !== null){
            this.on_paren_update();
        } else{
            this.data = [];
            for (let x = -10; x < 10; x++){
                this.data.push( [x, 2*x] );
            }
        }

    }


    svg_init(duration=this.duration, delay=this.delay, callback = ()=>{return}){

        if(this.canvas === null){
            return
        }

        let u = this.canvas.svg.selectAll("."+this.id)
            .data( this.data, (d)=>{return d.ser1});

        console.log(this.data);

        u.join("circle")
            .attr("class", this.id)
            .attr("r", this.params.r)
            .attr("fill", this.params.color)
            .attr("cx", (d)=>{ return this.canvas.xScale(d[0]) })
            .attr("cy", (d)=>{ return this.canvas.yScale(d[1]) });


    }





}



/* other classes */

class UpdateNode{   // use for updating visualisation classes parameters

    constructor( params, duration=1000, delay=0,  next=null ){

        this.params = params;       // parameters to be updated; ex {"data": data, "color": color}
        this.duration = duration;      // delya before next chained update
        this.delay = delay;
        this.next = next;           // next (chained) update node

    }

}

    
/*  suport functions  */

function get_points_from_lenght(fx, center, lenght){ // get line start and end values from target lenght

    let deltaX = (lenght / (1+Math.abs(get_slope(fx, center)))) / 2;
    let points = [];
    points.push( [ center-deltaX, fx(center-deltaX) ] );
    points.push( [ center+deltaX, fx(center+deltaX) ] );

    return points;

}



function get_slope(fx, x){  // get graph slope at x

    let h = 0.001;
    return ( fx(x+h) - fx(x) ) / h;

}


function get_tangent_function(fx, x){    // get tangent-line function

    let k = get_slope(fx, x);
    let m = fx(x) - k*x;

    return (x) => { return k*x + m };

}



/* Test functions */

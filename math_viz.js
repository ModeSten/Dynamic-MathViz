
/* mathematics visualisation, generci functions and classes */
/* 
dependencies: 
- D3 
*/


/* math (elements) visualiazation classes */

// Visualization object: holds common parameters and svg element
class CanvasObj {

    constructor (id, width, height, margin, xRange, yRange, parentId=null){

        this.ID = id;           // canvas id; also used as svg id
        this.parentId;          // id of div container; svg parent div 
        this.children = [];     // canvas child objects / elements [ class-objet, callback]

        this.svg = null; 



        this.xScale;
        this.yScale;


        this.params = {
            "width": width,
            "height": height,
            "margin": margin,
            "xRange": xRange,
            "yRange": yRange
        }

        this.set_dependent_params();

        if(parentId !== null ){
            this.assign_to_div( parentId );
        }

    }

    set_dependent_params(){

        this.xScale = d3.scaleLinear( this.params.xRange, [0, this.params.width] );
        this.yScale = d3.scaleLinear( this.params.yRange, [this.params.height, 0] );

    }

    // assign canvas to html div and create svg element
    assign_to_div ( targetDivId ){

        this.parentId = targetDivId;

        this.svg = d3.select("#"+targetDivId)
            .append("svg")
                .attr("id", this.ID)
                .attr("class", "viz_svg")
                .attr("width", this.params.width + this.params.margin.left + this.params.margin.right)
                .attr("height", this.params.height + this.params.margin.top + this.params.margin.bottom)
            .append("g")
                .attr("transform", "translate("+ this.params.margin.left + "," + this.params.margin.top +")");

        this.svg.append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this.params.width)
                .attr("height", this.params.height);

        this.notify_children();

    }


    update_svg(){

   

    }


    remove_from_div (){

        let container = document.getElementById(this.parentId);   // get conatining div
        let element = document.getElementById(this.ID);         // get svg element (as node)

        container.removeChild(element);             

        this.parentId = null;
        this.svg = null;

        this.notify_children();

    }


    update(params){

        for (let [key, val] of Object.entries(params)){
            if( this.params[key] !== undefined ){       // if provided parameter is part of class, override curent value
                this.params[key] = val;
            }
        }

        this.set_dependent_params();
        this.update_svg();
        this.notify_children();

    }

    add_child( obj, func){

        this.removeChild(obj)   // remove to avoid duplicates
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
        this.params = {};       // parameters placeholder for child class overrride

        this.duration = 1000;   // transition dration (default)
        this.delay = 0;         // transition delay (default)
        this.isDefined = (d, i) => { return ( d[0] !== null )  && ( d[1] !== null ) };      // specify for whath values element should be rendered

        this.data = [];
        this.children = [];     // child objects; updating with parent

    }


    // Read input parameters and overide stored values
    parse_params( params ){

        for (let [key, val] of Object.entries(params)){
            if( this.params[key] !== undefined ){       // if provided parameter is part of class, override curent value
                this.params[key] = val;
            }
        }

    }


    add_child( obj, func){

        this.remove_child(obj);     // remove child if already exists; to avoid duplicates
        this.children.push( {element: obj, callback: func} )

    }

    remove_child( obj ){

        this.children = this.children.filter( (e) => {return e.element.id !== obj.id} );

    }


    notify_children(){

        this.children.forEach( (c) => { c.callback( this, "" );} );

    }


    // assign to canvas (class) object 
    assigne_to_canvas(canvas){

        if(canvas === null ){
            return
        }

        this.canvas = canvas;
        canvas.add_child(this, (id, msg) => { this.on_canvas_update(); });

        this.svg_init();    // create svg elements (if canvas svg has been created)

    }


    remove_from_canvas(){

        if(this.canvas === null){
            return
        }

        if(this.canvas.svg !== null){
            this.canvas.svg.selectAll("."+this.id).remove();    // remove svg elements if canvas svg exists (canvas is assigned to div)
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


    on_canvas_update(){
        /* placeholder for child override */
    }

    
}


// kordinate system (axis)
class ChartObj extends VisualObj{

    constructor ( id, params={}, canvas=null){

        super(id);

        this.params = {
            "xRange": null,     // range of x axis values
            "yRange": null      // range of y axis values
        };

        this.parse_params(params);

        this.xAxisOfset;            // chart x (botom) axis ofset (from top)
        this.yAxisOfset;            // chart y (left) axis ofset (from left edge)

        if (canvas !== null){       // create svg if target div is specified
            this.assigne_to_canvas( canvas );
        }

    }

    // get x & y (D3) scales based on value range and canvas size
    get_scale(){

        let xScale;
        let yScale;

        // if no value range specified, use canvas scale
        if(this.params.xRange === null){   
            this.params.xRange = this.canvas.params.xRange;
        } 
        if(this.params.yRange === null){
            this.params.yRange = this.canvas.params.yRange;
        }

        xScale = d3.scaleLinear( this.params.xRange, [0, this.canvas.params.width] );
        yScale = d3.scaleLinear( this.params.yRange, [this.canvas.params.height, 0]);

        return {"x": xScale, "y": yScale};

    }

    // get svg (D3) axis based on scale
    get_axis( scale ){

        let xAxis = d3.axisBottom(scale.x); 
        let yAxis = d3.axisLeft(scale.y); 

        return {"x": xAxis, "y": yAxis};

    }


    // get axis ofset based on x and y range 
    get_axis_ofset(){

        let xStep = this.canvas.params.width / (this.params.xRange[1] - this.params.xRange[0]);    // distance coresponding to each x value step
        let yStep = (this.canvas.params.height) / (this.params.yRange[1] - this.params.yRange[0]); // distance coresponding to each y value step

        let xAxisOfset;     // x Axis ofset from top
        let yAxisOfset;     // y axis ofset from left side


        if(this.params.yRange[0] < 0){     // if min y value is negative, move x-axis up 
            this.xAxisOfset = this.canvas.params.height + yStep * this.params.yRange[0];
            xAxisOfset = this.canvas.params.height + yStep * this.params.yRange[0];
        } else{
            this.xAxisOfset = this.canvas.params.height; 
            xAxisOfset = this.canvas.params.height; 
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


    // create / update svg elements
    svg_init(callback=()=>{return}){

        if (this.canvas === null || this.canvas.svg === null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)
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


        // Axis labels

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


    update_svg(){


    }


    on_canvas_update(){

        this.update_svg();

    }

}


// Graph class: Draw graph based on function
class GraphObj extends VisualObj{

    constructor( id, fx, xRange, params, canvas=null ){ 

        super(id);

        this.fx = fx;           // graph function
        this.xRange = xRange;   // graph value (x) range

        this.params = {
            "fx": fx,           // function: (x)=>{ returne f(x) }
            "xRange": xRange,   // x value range
            "step": 0.1,        // stepsize (x) between value pairs [x, y]
            "color": "black",   // stroke color
            "width": 2.5,       // stroke widght
        };

        this.parse_params(params);
        this.get_data();
        this.assigne_to_canvas(canvas);
        
        
    }

    // update side efects; not shared by sibling classes
    resolve_update(){

        this.get_data();

    }


    // get graph value paris [x, y]
    get_data(){

        this.data = []; // remove stored (old) data
        let y;

        for( let x=this.params.xRange[0]; x <= this.params.xRange[1]; x+=this.params.step){

            y = this.params.fx( x );
            this.data.push( [x, y] );

        }

    }


    svg_init(duration=this.duration, delay=this.delay, callback=()=>{return}){

        if(this.canvas === null || this.canvas.svg === null){   // no canvas assigned or no canvas svg (canvas not assigned to div) exists
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


    on_canvas_update(){

        this.svg_init();

    }


}


// Line class: plot line (graph) based on list of data values
class LineObj extends VisualObj{

    constructor( id, points, params, canvas=null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)

        super(id);

        this.params = {
        "data": points,     // data value pairs; to plot
        "width": 2.5,       // line (stroke) width
        "color": "black"    // lien (stroke) color
        };

        this.data = this.params.data;   // used to maintain comonolity with sibling classes: main data variable stored in parameters

        this.parse_params(params);
        this.assigne_to_canvas(canvas);
    
    }


    svg_init(duration=this.duration, delay=this.delay, callback = ()=>{return}){


        if(this.canvas === null || this.canvas.svg === null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)
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
                .attr("clip-path", "url(#clip)")
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


    on_canvas_update(){

        this.svg_init();

    }
    

}


// data markers class; create circular markers based on data value paris
class MarkerObj extends VisualObj{


    constructor( id,  data, params={}, canvas=null, parent=null){

        super(id);

        this.params={
            "data": data,       // marker locations
            "color": "red",     // marker color
            "r": "3",           // marker (circle) radius 
        }

        this.data = data;       
        this.parent = null;

        this.assigne_to_canvas(canvas);
        this.svg_init();

    }


    // set parent object: update markers on parent update
    set_parent(parent){

        if(parent === null){
            return
        }

        parent.add_child(this, (obj, msg)=>{ this.on_parent_update() });
        this.parent = parent;

        this.resolve_update();
        this.svg_init();

    }


    remove_parent(){

        this.parent.remove_child(this);

    }


    on_parent_update(){
        
    }


    on_canvas_update(){

        this.svg_init();

    }


    resolve_update(){
        this.data = this.params.data;
    }


    // combine base class parameter and child parameter objects
    join_params(params){

        for (let [key, val] of Object.entries(params)){
            this.params[key] = val;
        }

    }


    // create / update svg elements
    svg_init(duration=this.duration, delay=this.delay, callback = ()=>{return}){

        if(this.canvas === null){
            return
        }

        let u = this.canvas.svg.selectAll("."+this.id)
            .data( this.data, (d)=>{return d.ser1});

        u.join("circle")
                .attr("class", this.id)
                .attr("clip-path", "url(#clip)")
                .transition()
                .duration(duration)
                    .attr("r", this.params.r)
                    .attr("fill", this.params.color)
                    .attr("cx", (d)=>{ return this.canvas.xScale(d[0]) })
                    .attr("cy", (d)=>{ return this.canvas.yScale(d[1]) });

    }

}

// uniformly place marker along graph
class SpacedMarkerObj extends MarkerObj{

    constructor(id, params={}, parent=null, canvas=null){

        super( id );

        let childParams = {
            "space": 3,
        };

        this.join_params(childParams);  
        this.parse_params(params);

        this.set_parent(parent);
        this.assigne_to_canvas(canvas);
        this.svg_init();

    }


    on_parent_update(){

        this.get_data();
        this.svg_init();

    }


    resolve_update(){

        this.get_data();

    }


    get_data(){


        if( this.parent === null){
            return
        }

        this.data = [];
        let len = Object.keys(this.parent.data).length;
        let space = this.params.space;

        let d0 = this.parent.data[0];
        this.data.push(d0);

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

}


// place markers at relative position of line segment (between data points): x and y interpolated
class SegmentMarkerObj extends MarkerObj{

    constructor(id, params={}, parent=null, canvas=null){

        super(id);

        let childParams = {
            "p": [0.5]      // relative position of marker: 0 >= p <= 1
        }
        this.join_params(childParams);
        this.parse_params(params);

        this.set_parent(parent);
        this.assigne_to_canvas(canvas);

    }


    on_parent_update(){

        this.get_data();
        this.svg_init();

    }


    resolve_update(){

        this.get_data();

    }



    get_data(){

        if(this.parent === null){
            return
        }

        this.data = [];

        let len = Object.keys(this.parent.data).length;

        let d0;
        let d1;
        let d;
        let p = this.params.p;

        for(let i=0; i<len-1; i+=2){

            if(this.parent.data[i][1] == null){
                i++;
            }

            d0 = this.parent.data[i];
            d1 = this.parent.data[i+1];

            this.params.p.forEach((p, i)=>{
                    d = [ p*d1[0]+(1-p)*d0[0], p*d1[1]+(1-p)*d0[1] ];
                    this.data.push(d);
                }
            );

        }

    }


}


// place markers at relativ position along line segment (between data points): x interpolated and y from function
class SegmentMarkerFxObj extends SegmentMarkerObj{

    constructor( id, params={}, parent=null, canvas=null){

        super(id, params, parent, canvas);

    }


 get_data(){

        if(this.parent === null){
            return
        }

        this.data = [];

        let len = Object.keys(this.parent.data).length;

        let x0;
        let x1;
        let x;
        let y;

        for(let i=0; i<len-1; i+=2){

            if(this.parent.data[i][1] == null){
                i++;
            }

            x0 = this.parent.data[i][0];
            x1 = this.parent.data[i+1][0];

            this.params.p.forEach (  (p, i)=>{
                x = p*x1 + (1-p)*x0;
                y = this.parent.fx(x);
                this.data.push([x, y]);
                }
            );
            

        }

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



function get_slope(fx, x, h=0.001){  // get graph slope at x

    return ( fx(x+h) - fx(x) ) / h;

}


function get_tangent_function(fx, x, h=0.001){    // get tangent-line function

    let k = get_slope(fx, x, h);
    let m = fx(x) - k*x;

    return (x) => { return k*x + m };

}



/* Test functions */

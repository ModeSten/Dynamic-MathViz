
/* mathematics visualisation, generci functions and classes */
/* 
dependencies: 
- D3 
*/


/* math (elements) visualiazation classes */

// Visualization object: holds common parameters and svg element
class CanvasObj {

    constructor (id, width, height, margin, xRange, yRange, parentId=null){

        this.id = id;           // canvas id; also used as svg id; for selecting svg element
        this.parentId;          // id of div container; svg parent div 
        this.children = [];     // canvas child objects / elements [ class-objet, callback]

        this.svg = null;        // base svg element

        this.xScale;            // canvas (svg) xScale; dependent on width and x value range
        this.yScale;            // canvas yScale yScale: dependent on height and y value range 

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

    // set parameters dependent on input parameters
    set_dependent_params(){

        this.xScale = d3.scaleLinear( this.params.xRange, [0, this.params.width] );
        this.yScale = d3.scaleLinear( this.params.yRange, [this.params.height, 0] );

    }

    // assign canvas to html div and create svg element
    assign_to_div ( targetDivId ){

        this.parentId = targetDivId;

        this.svg = d3.select("#"+targetDivId)
            .append("svg")
                .attr("id", this.id)
                .attr("class", "viz_svg")
                .attr("preserveAspectRatio", "xMinyMin mett")
                .attr("viewBox", `0 0 ${width+margin.left*2} ${height+margin.top*2}`)
                .append("g")
                    .attr("class", "transform")
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


    // update canvas
    update_svg(rescale = false){

        if(rescale){
            let parent = this.parentId;
            this.remove_from_div();
            this.assign_to_div(parent);
        }

    }


    // remove canvas from contained div
    remove_from_div (){

        let container = document.getElementById(this.parentId);   // get conatining div
        let element = document.getElementById(this.id);         // get svg element (as node)

        container.removeChild(element);             

        this.parentId = null;
        this.svg = null;

        this.notify_children();

    }


    // update canvas
    update(params){

        for (let [key, val] of Object.entries(params)){
            if( this.params[key] !== undefined ){       // if provided parameter is part of class, override curent value
                this.params[key] = val;
            }
        }

        let keys = Object.keys(params);
        let rescale = ("height" in params) || ("width" in params);

        this.set_dependent_params();
        this.update_svg(rescale);
        this.notify_children();

    }


    // add child object
    add_child( obj, func){

        this.removeChild(obj)   // remove to avoid duplicates
        this.children.push( {element: obj, callback: func} )

    }


    // remove specified child object
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

        this.parent = null;

        this.data = [];

    }


    // Read input parameters and overide stored values
    parse_params( params ){

        for (let [key, val] of Object.entries(params)){
            if( this.params[key] !== undefined ){       // if provided parameter is part of class, override curent value
                this.params[key] = val;
            }
        }

    }


    // add child object
    add_child( obj, func){

        this.remove_child(obj);     // remove child if already exists; to avoid duplicates
        this.children.push( {element: obj, callback: func} )

    }

    
    // remove specified child object
    remove_child( obj ){

        this.children = this.children.filter( (e) => {return e.element.id !== obj.id} );

    }


    // notify child objects (on update)
    notify_children(duration){

        this.children.forEach( (c) => { c.callback( this, "", duration );} );

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


    // remove parent => stop subscribing to parent updates
    remove_parent(){

        this.parent.remove_child(this);

    }


    // do if parent object is updated
    on_parent_update(){
        /* placeholder for child class override */ 
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

    
    // remove object svg elements from canvas
    remove_from_canvas(){

        if(this.canvas === null){
            return
        }

        if(this.canvas.svg !== null){
            this.canvas.svg.selectAll("."+this.id).remove();    // remove svg elements if canvas svg exists (canvas is assigned to div)
        }

        this.canvas.removeChild(this);      // remove from canvas child list
        this.canvas = null;
        this.on_remove();

    }


    // update element
    update(state){

        if(state === null){
            return
        }

        this.parse_params(state.params);
        this.resolve_update();              // resolve update 'side-efects'; Custome for each child class (ex update data)
        this.notify_children( state.duration );

        if(state.duration === null){
            state.duration = this.duration;
        } 
        if(state.delay === null){
            state.delay = this.delay
        }

        this.svg_init( state.duration, state.delay, ()=>{ this.update(state.next) } );

    }


    // create svg elements
    svg_init(callback=()=>{return}){
        /* placeholder for child obj init */
    }


    // update side efects
    resolve_update(){
        /* placeholder for child override */
    }

    // canvas update side efects 
    on_canvas_update(){
        /* placeholder for child override */
    }


    // removal from canvas, side efects
    on_remove(){
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

        this.xAxis = null;
        this.yAxis = null;
        this.xLabel = null;
        this.yLabel = null;

        this.init = false;

        if (canvas !== null){       // create svg if target div is specified
            this.assigne_to_canvas( canvas );
        }

    }

    // get x & y (D3) scales based on value range and canvas size
    get_scale(){

        let xScale;
        let yScale;

        xScale = d3.scaleLinear( this.canvas.params.xRange, [0, this.canvas.params.width] );
        yScale = d3.scaleLinear( this.canvas.params.yRange, [this.canvas.params.height, 0]);

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

        let xStep = this.canvas.params.width / (this.canvas.params.xRange[1] - this.canvas.params.xRange[0]);    // distance coresponding to each x value step
        let yStep = (this.canvas.params.height) / (this.canvas.params.yRange[1] - this.canvas.params.yRange[0]); // distance coresponding to each y value step

        let xAxisOfset;     // x Axis ofset from top
        let yAxisOfset;     // y axis ofset from left side


        if(this.canvas.params.yRange[0] < 0){     // if min y value is negative, move x-axis up 
            xAxisOfset = this.canvas.params.height + yStep * this.canvas.params.yRange[0];
        } else{
            xAxisOfset = this.canvas.params.height; 
        }

        if(this.canvas.params.xRange[0] < 0){     // if min x is negative, move y-axis to right
            yAxisOfset = xStep * -this.canvas.params.xRange[0];
        } else{
            this.yAxisOfset = 0;
            yAxisOfset = 0;
        }

        return {"x": xAxisOfset, "y": yAxisOfset};

    }


    // create / update svg elements
    svg_init(callback=()=>{return}){

        if (this.canvas === null || this.canvas.svg === null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)
            this.init = false;
            return;
        } else if(this.init){   // if svg elements already exists, run update function instead
            this.svg_update();
            return;
        }

        let scale = this.get_scale();
        let axis = this.get_axis( scale );
        let AxisOfset = this.get_axis_ofset();

        this.xAxis = this.canvas.svg.append("g")
            .attr("class", `xOfset ${this.id}`)
            .attr("transform", `translate(0,${AxisOfset.x})`)
            .call(axis.x);

        this.yAxis = this.canvas.svg.append("g")
            .attr("class", `yOfset ${this.id}`)
            .attr("transform", `translate(${AxisOfset.y},0)`)
            .call(axis.y);


        // Axis labels

        // x label
        this.xLabel = this.canvas.svg.append("text")
            .attr("class", `x-label ${this.id}`)
            .attr("text-anchor", "end")
            .attr("x",  -15)
            .attr("y", AxisOfset.x)
            .text("x");

        // y label
        this.yLabel = this.canvas.svg.append("text")  
            .attr("class", `y-label ${this.id}`)
            .attr("text-anchor", "end")
            .attr("x", AxisOfset.y)
            .attr("y", -15)
            .html("y");

        this.init = true;

    }

    // update svg elements
    svg_update(){

        if (this.canvas === null || this.canvas.svg === null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)
            return;
        } 

        let scale = this.get_scale();
        let axis = this.get_axis( scale );
        let AxisOfset = this.get_axis_ofset();

        this.xAxis
            .transition()
            .duration(1000)
            .attr("transform", `translate(0,${AxisOfset.x})`)
            .call(axis.x);

        this.yAxis
            .transition()
            .duration(1000)
            .attr("transform", `translate(${AxisOfset.y},0)`)
            .call(axis.y);  

        this.xLabel
            .attr("text-anchor", "end")
            .attr("x",  -15)
            .attr("y", AxisOfset.x)
            .text("x");

        this.yLabel
            .attr("text-anchor", "end")
            .attr("x", AxisOfset.y)
            .attr("y", -15)
            .html("y");

    }


    on_canvas_update(){

        if(this.canvas.svg === null){
            this.init = false;
        } else{
            this.svg_init();
        }

    }

    on_remove(){

        this.init = false;

    }

}


// Line class: plot line (graph) based on list of data values
class LineObj extends VisualObj{

    constructor( id, points, params, canvas=null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)

        super(id);

        this.params = {
        "data": points,     // data for drawing line (x & y value pairs)
        "width": 2.5,       // line (stroke) width
        "color": "black",   // line (stroke) color
        "draw": false,      // animate drawing of line
        "drawT0": 0,        // line draw (relative) start: between 0 & 1
        "drawT": 1          // line draw (relative) end: between 0 & 1
        };

        this.lenght = 0;
        this.data = this.params.data;   // used to maintain comonolity with sibling classes: main data variable stored in parameters

        this.parse_params(params);
        this.assigne_to_canvas(canvas);
    
    }


    svg_init(duration=this.duration, delay=this.delay, callback = ()=>{return}){ // create / update svg elements

        if(this.canvas === null || this.canvas.svg === null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)
            return
        }

        let u = this.canvas.svg.selectAll("."+this.id)          
            .data( [this.params.data] );


        let line = d3.line()
            .x( (d)=>{return this.canvas.xScale(d[0])} )
            .y( (d)=>{return this.canvas.yScale(d[1])} )
            .defined( (d, i) => { return this.isDefined(d, i) } );

        if(this.params.draw){
            this.svg_draw(u, line, duration, delay, callback);
            return
        }
    
        if(duration === 0){

            u.enter()
                .append("path")
                    .attr("class", this.id)
                    .attr("clip-path", "url(#clip)")
            .merge(u)
                    .attr("d", line)
                    .attr("fill", "none")
                    .attr("stroke", this.params.color)
                    .attr("stroke-width", this.params.width)

            callback();

        } else{

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
                .on("end", callback)

             u.exit().remove();

        }

    }


    svg_draw(u, line, duration, delay, callback){   // animate drawing of Line

        this.get_lenght();
        let l = this.lenght;
        let l0 = l * (1-this.params.drawT0);
        let l1 = l * (1-this.params.drawT);

        u.enter()
            .append("path")
                .attr("class", this.id)
                .attr("clip-path", "url(#clip)")
        .merge(u)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", this.params.color)
            .attr("stroke-width", this.params.width)
            .attr("stroke-dasharray",  l + " " + l)
            .attr("stroke-dashoffset", l0)
            .transition()
                .duration(duration)
                .attr("stroke-dashoffset", l1)
                .delay(delay)
            .on("end", callback);

        u.exit().remove();

    }


    on_canvas_update(){

        this.svg_init();

    }


    get_lenght(){   // get line (path lenght), acounting for SVG scale

        this.lenght = 0;

        if(this.canvas === null || this.canvas.svg === null){  // if no canvas has been assigned or canvas has no svg (not assigned to div)
            return
        }

        let x0 =  this.params.data[0][0];
        x0 = this.canvas.xScale(x0);
        let y0 =  this.params.data[0][1];
        y0 = this.canvas.yScale(y0)

        let x;
        let y;

        let L = Object.keys(this.params.data).length;

        for(let i=1; i<L; i++){

            x = this.params.data[i][0];
            y = this.params.data[i][1];

            if(y!==null && x!==null){

                x = this.canvas.xScale( x );
                y = this.canvas.yScale( y );

                this.lenght += Math.sqrt( (x-x0)**2 + (y-y0)**2 );
                x0 = x;
                y0 = y; 

            } 

        }

    }


    resolve_update(){
        this.data = this.params.data;
    }
    

}


// data markers class; create circular markers based on data value paris
class MarkerObj extends VisualObj{

    constructor( id,  data, params={}, canvas=null, parent=null){

        super(id);

        this.params={
            "data": data,       // marker positions
            "color": "red",     // marker color
            "r": 3,             // marker (circle) radius 
        }

        this.data = data;       
        this.parent = null;

        this.parse_params(params);
        this.assigne_to_canvas(canvas);
        this.svg_init();

    }


    on_canvas_update(){

        this.svg_init();

    }


    resolve_update(){
        this.data = this.params.data;
    }


    // create / update svg elements
    svg_init(duration=this.duration, delay=this.delay, callback = ()=>{return}){
        

        if(this.canvas === null || this.canvas.svg === null){
            return
        }

        let u = this.canvas.svg.selectAll("."+this.id) // selected target SVG elements 
        .data( this.data );    // bind data
        


        if(duration === 0){     // duration = 0  =>   update without transition

            u.join("circle")
                    .attr("class", this.id)
                    .attr("clip-path", "url(#clip)")
                    .attr("cx", (d)=>{ return this.canvas.xScale(d[0]) })
                    .attr("cy", (d)=>{ return this.canvas.yScale(d[1]) })
                    .attr("r", this.params.r)
                    .attr("fill", this.params.color);

        } else{

            u.enter()
                .append("circle")
                    .attr("class", this.id)
                    .attr("clip-path", "url(#clip)")
                    .attr("cx", (d)=>{ return this.canvas.xScale(d[0]) })
                    .attr("cy", (d)=>{ return this.canvas.yScale(d[1]) })
            .merge(u)
                .transition()
                .duration(duration)
                    .attr("fill", this.params.color)
                    .attr("r", this.params.r)
                    .attr("cx", (d)=>{ return this.canvas.xScale(d[0]) })
                    .attr("cy", (d)=>{ return this.canvas.yScale(d[1]) })
                    .delay(delay)
                .on("end", callback);

            u.exit().remove();
        }

    }

}


class LabelObj extends VisualObj{

    constructor(id, pos, text, params={}, canvas=null, classname=""){

        super(id);

        this.params={
            "data": pos,
            "text": text,
            "dx": [0],
            "dy": [0],
            "anchors": ["middle"], 
            "show": [true]
        }
        this.parse_params(params);
    
        this.classname = this.id + " " + classname;
        this.textObj = null;

        this.data = this.params.data;

        this.assigne_to_canvas(canvas);
        this.svg_init(0);

    }


    svg_init(duration=this.duration, delay=this.delay, callbac=()=>{}){

        if(this.canvas === null || this.canvas.svg === null){
            return
        } 

        let dxL = this.params.dx.length;
        let dyL = this.params.dy.length;
        let showL = this.params.show.length;

        let u = this.canvas.svg.selectAll("."+this.id)
            .data(this.params.data);

        u.enter()
            .append("text")
            .attr("class", this.classname)
        .merge(u)
            .transition()
            .duration(duration)
            .delay(delay)
                .text((d, i)=>{ if(this.params.show[i%showL]){return this.params.text[i]} else{return ""} })
                .attr("x", (d)=>{ return this.canvas.xScale(d[0]) })
                .attr("y", (d)=>{ return this.canvas.yScale(d[1]) })
                .attr("dx", (d, i)=>{ return this.params.dx[i%dxL] })
                .attr("dy", (d, i)=>{ return this.params.dy[i%dyL] })
                .attr("text-anchor", (d, i)=>{ return this.params.anchors[i%this.params.anchors.length]});

    }


    set_text(text){

        if(this.textObj = null){
            return
        }

        this.textObj.text(text);

    }

    
    on_remove(){

        this.textObj = null;

    }


    on_canvas_update(){

        this.svg_init();

    }


    resolve_update(){
        this.data = this.params.data;
    }

}




// Base class for classes extending visual classes; cotnain visualObj (ex line) as parameter 
class ExstensionObj{

    constructor( id ){

        this.id = id;           // object id; also used for selecting svg elements
        this.svgObj = null;     // Class object mannaging svg elements (VisualObj class)
        this.canvas = null;     // target canvas
        this.params = {};       // object parameters; Specified by child classes
        this.children = []      // child objects, updating with parent class
        this.data = [];         // object data to visualize
        this.isDefined = (d, i)=>{return (d[0]!==null) && (d[1]!==null)};   // specifies which data points should be ignored
        this.duration = 1000;   // transition (default) duration
        this.delay = 0;         // transition (default) delay
        this.parent = null;

    }


    parse_params(params){

        for (let [key, val] of Object.entries(params)){
            if( this.params[key] !== undefined ){       // if provided parameter is part of class, override curent value
                this.params[key] = val;
            }
        }

    }


    join_params(params){

        for (let [key, val] of Object.entries(params)){
            this.params[key] = val;
        }

    }


    update(state){
  

        let node = state;     
        let duration = 0; 

        while( node !== null){              // loop through update nodes

            this.parse_params(node.params);
            this.resolve_update(node);
            node.params.data = this.data;   // add data to update node
            if(node.duration === null){
                node.duration = this.duration;
            } 
            if(node.delay === null){
                node.delay = this.delay
            }

            duration += node.duration;
            node = node.next;
            
        }

        if(this.svgObj !== null){
            this.svgObj.update(state);   
        }

        // update child (visual) object; pass root update node
        this.notify_children(duration);

    }


    assigne_to_canvas(canvas){

        if(canvas == null){
            return
        } 

        this.canvas = canvas;
        this.svgObj.assigne_to_canvas(canvas);

    }


    remove_from_canvas(){

        this.canvas = null;
        this.svgObj.remove_from_canvas();

    }


    add_child(obj, callback){

        this.remove_child(obj);     // remove child if already exists; avoid duplicates
        this.children.push( {element: obj, callback: callback} );
        callback(this, "");

    }


    remove_child(obj){

        this.children = this.children.filter( (e) => {return e.element.id !== obj.id} );

    }


    notify_children(duration){

        this.children.forEach( (c) => { c.callback( this, "", duration); } );

    }


    set_parent(parent){

        if(parent === null){
            return
        }

        this.parent = parent;
        parent.add_child(this, (obj,msg, duration)=>{ this.on_parent_update(obj, msg, duration) });

    }


    on_parent_update( obj, msg ){
        /* placeholder for child class override */
    }


    remove_parent(){

        this.parent = null;
        parent.remove_child(this);

    }


    resolve_update(){
        /* placeholder for child override */
    }


    get_data(){
        /* placeholder for child override */
    }

}


// Class for creating Graph from function 
class GraphObj extends ExstensionObj{ 

    constructor(id, fx, xRange, params, canvas){

        super(id);
        this.params = {
            "fx": fx,           // graph function
            "xRange": xRange,   // x value range
            "color": "black",   // graph color
            "width": 2,         // line widht
            "step": 0.1,        // x value steps between points
            "draw": false,      // animate drawing of graph
            "drawT0": 0,        // (relative) starting point for drawing graph: [0, 1]
            "drawT": 1          // (relative) enpoint for drawing grpah: [0, 1]
        };
        this.parse_params(params);

        this.get_data();
        this.svgObj = new LineObj(id, this.data, this.params);
        this.assigne_to_canvas(canvas);


    }


    get_data(){

        this.data = []; // remove stored (old) data
        let y;

        for( let x=this.params.xRange[0]; x <= this.params.xRange[1]; x+=this.params.step){

            y = this.params.fx( x );
            this.data.push( [x, y] );

        }

    }


    resolve_update(){

        this.get_data();

    }

}


/* other classes */

class UpdateNode{   // Specify update parameters for other classes; link nodes (linked list) to chain updates

    constructor( params, duration=null, delay=null,  next=null ){

        this.params = params;       // parameters to be updated; ex {"data": data, "color": color}
        this.duration = duration;   // delya before next chained update
        this.delay = delay;
        this.next = next;           // next (chained) update node

    }


    append(updateN){    // append new update (node) to end of update chain

        let node = this;

        while( node.next !== null){
            node = node.next;
        }

        node.next = updateN;

    }


    insert(UpdateN, level){ // insert update node in update chain

        let node = this;
        let i = 0;

        while( node.next != null && i<level ){
            node = node.next;
            i++;
        }

        UpdateN.next = node.next;
        node.next = UpdateN;

    }

}

    
/*  suport functions  */


/* get line start and end values from target line lenght lenght */
function get_points_from_lenght(fx, x0, lenght, ofset){ 

    let deltaX = (lenght / (1+Math.abs(get_slope(fx, x0))));
    let deltaX1 = deltaX * (1-ofset);
    let deltaX0 = deltaX * ofset;
    let points = [];
    points.push( [ x0-deltaX0, fx(x0-deltaX0) ] );
    points.push( [ x0+deltaX1, fx(x0+deltaX1) ] );

    return points;

}


/* get graph slope at x */
function get_slope(fx, x, h=0.001){  

    return ( fx(x+h) - fx(x) ) / h;

}


/* get tangent-line function */
function get_tangent_function(fx, x, h=0.001){   

    let k = get_slope(fx, x, h);
    let m = fx(x) - k*x;

    return (x) => { return k*x + m };

}


/* get derivative aproximation based on function */
function derivativeFx(fx, xRange, step=0.1, h=0.001){

    let data = [];
    for(let x=xRange[0]; x<=xRange[1]; x+=step){

        let y = get_slope(fx, x, h);
        data.push([x, y]);

    }

    return data;

}


/* get derivative aproximation based on graph data; use diference between data points. Assure output lenght = input lenght */
function derivativeData(fxData){


    let data = [];
    let l = Object.keys(fxData).length;
    let dx = 0;

    for(let i=0; i<l-1; i++){

        let x0 = fxData[i][0];
        let y0 = fxData[i][1];

        let x1 = fxData[i+1][0];
        let y1 = fxData[i+1][1];

        if(y0 === null){
            data.push([x0, null]);
            i++;
        } else if(y1 === null){
            data.push([x0, null]);
            data.push([x1, null]);
            i+2;
        } else{

        dx = (y1-y0) / (x1-x0);

        data.push([x0, dx]);

        }

    }
        
    data.push([fxData[l-1][0], dx]);
    
    return data;

}




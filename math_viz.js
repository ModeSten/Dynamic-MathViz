
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
        this.parentId;          // div container for svg
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

    // assign canvas to div and create svg element
    assign_to_div ( targetDivId ){

        this.parentId = targetDivId;

        this.svg = d3.select("#"+targetDivId)
            .append("svg")
                .attr("id", this.ID)
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

        this.parent = null;
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


// kordinate system (axis)
class ChartObj {

    constructor ( id, parentCanvas=null, xRange = null, yRange = null){

        this.canvas = parentCanvas;    // containing canvas (svg) id
        this.id = id;               

        this.xRange = xRange; // chart x value range; if null, use canvas x-Range
        this.yRange = yRange; // chart y value range; if null, use canvas y-range

        this.xAxisOfset;  // chart x (botom) axis ofset (from top)
        this.yAxisOfset;            // chart y (left) axis ofset (from left edge)

        this.canvas = null;                   // chart visual (svg) object
        if (parentCanvas !== null){     // create svg if target div is specified
            this.assigne_to_canvas( parentCanvas );
        }

    }

    // get x & y scales based on value range and canvas size
    get_scale(){

        let xScale;
        let yScale;

        // if no value range specified, use canvas scale
        if(this.xRange === null){   
            this.xRange = this.canvas.xRange;
        } 
        if(this.yRange === null){
            this.yRange = this.canvas.yRange;
        }

        xScale = d3.scaleLinear( this.xRange, [0, this.canvas.width] );
        yScale = d3.scaleLinear( this.yRange, [this.canvas.height, 0]);

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

        let xStep = this.canvas.width / (this.xRange[1] - this.xRange[0]);
        let yStep = (this.canvas.height) / (this.yRange[1] - this.yRange[0]);

        let xAxisOfset;
        let yAxisOfset;


        if(this.yRange[0] < 0){     // if min y value is negative, move x-axis up 
            this.xAxisOfset = this.canvas.height + yStep * this.yRange[0];
            xAxisOfset = this.canvas.height + yStep * this.yRange[0];
        } else{
            this.xAxisOfset = this.canvas.height; 
            xAxisOfset = this.canvas.height; 
        }

        if(this.xRange[0] < 0){     // if min x is negative, move y-axis to right
            this.yAxisOfset = xStep * -this.xRange[0];
            yAxisOfset = xStep * -this.xRange[0];
        } else{
            this.yAxisOfset = 0;
            yAxisOfset = 0;
        }

        return {"x": xAxisOfset, "y": yAxisOfset};

    }


    // update chart parameters
    update_chart(){

        /* placeholder */

    }


    // assignr chart to dive container and create svg ellement
    assigne_to_canvas( targetCanvas ){

        this.canvas = targetCanvas;
        this.canvas.add_child( this, (id, msg) => { this.svg_init() } );
        this.svg_init();

    }


    svg_init(){

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


    // remove from canvas (svg)
    remove_from_canvas(){

        if (this.canvas === null){
            return
        }

        if(this.canvas !== null){   
            this.canvas.svg.selectAll("."+this.id).remove();    // remove svg elements
        }

        this.canvas.removeChild(this);  // remove from canvas child list
        this.canvas = null;            

    }


}



class VisualObj{

    constructor(id){

        this.id = id;
        this.canvas = null;
        this.params = {};

    }


    parse_params( params ){

        for (let [key, val] of Object.entries(this.params)){
            if( params[key] !== undefined ){
                this.params[key] = params[key];
            }
        }

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
            this.canvas.svg.selectAll("path."+this.id).remove();    // remove svg elements
        }

        this.canvas.removeChild(this);      // remove from canvas child list
        this.canvas = null;

    }


    svg_init(callback=()=>{return}){
        /* placeholder for child obj init */
    }

    

}


class GraphObj extends VisualObj{

    constructor( id, fx, xRange, params, canvas=null ){ 

        super(id);

        this.fx = fx;           // graph function
        this.xRange = xRange;   // graph value (x) range
        this.data;

        this.params = {
            "fx": fx,           // function: (x)=>{ returne f(x) }
            "xRange": xRange,   // x bounds: [x0, x1]
            "step": 0.1,        // stepsize (x) between ploted points 
            "color": "black",   // stroke color
            "width": 2.5,       // stroke widght
            "duration": 1000,   // transition duration
            "delay": 0          // transition delay
        };

        this.parse_params(params);

        this.get_data();
        
        if(canvas !== null){
            this.assigne_to_canvas(canvas);
        }
        
    }

    update( state ){

        if(state === null){
            return
        }

        this.parse_params(state.params);

        this.get_data();
        this.svg_init( ()=>{ this.update(state.next) } );

    }


    get_data(){

        this.data = []; // remove stored data
        let y;

        for( let x=this.params.xRange[0]; x <= this.params.xRange[1]; x+=this.params.step){

            y = this.params.fx( x );
            this.data.push( [x, y] );

        }

    }


    svg_init(callback=()=>{return}){

        if(this.canvas === null || this.canvas.svg === null){
            return
        }


        let u = this.canvas.svg.selectAll("."+this.id)
            .data([this.data], (d)=>{return d.ser1});

        let line = d3.line()
            .x( (d) => {return this.canvas.xScale(d[0])} )
            .y( (d) => {return this.canvas.yScale(d[1])} );

        u.enter()
            .append("path")
            .attr("class", this.id)
            .attr("clip-path", "url(#clip)")
        .merge(u)
            .transition()
            .delay(this.params.delay)
            .duration(this.params.duration)
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
        "duration": 1000,
        "delay": 0,
        "width": 2.5,
        "color": "black"
        };

        for (let [key, val] of Object.entries(this.params)){
            if( params[key] !== undefined ){
                this.params[key] = params[key];
            }
        }

        this.assigne_to_canvas(canvas);
    
    }


    svg_init(callback = ()=>{return}){

        if(this.canvas === null || this.canvas.svg === null){
            return
        }

        let u = this.canvas.svg.selectAll("."+this.id)
            .data( [this.params.data], (d)=>{return d.ser1} );
            

        let line = d3.line()
            .x( (d)=>{return this.canvas.xScale(d[0])} )
            .y( (d)=>{return this.canvas.yScale(d[1])} );


        u.enter()
            .append("path")
                .attr("class", this.id)
        .merge(u)
            .transition()
                .duration(this.params.duration)
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", this.params.color)
                .attr("stroke-width", this.params.width)
                .delay(0)
            .on("end", callback);

    }


    update( state ){

        if(state === null){
            return
        }

        this.parse_params(state.params);

        this.svg_init(()=>{ this.update(state.next) });

    }
    

}


/* other classes */

class UpdateNode{   // use for updating visualisation classes parameters

    constructor( params, delay=10, duration=1000, next=null ){

        this.params = params;       // parameters to be updated; ex {"data": data, "color": color}
        this.duration = delay;      // delya before next chained update
        this.next = next;           // next (chained) update node

    }

}


class TnagentObj{   // tangent line

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

    assign_graph(){

    }


    assigne_to_canvas(canvas){

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
        
        let root = new UpdateNode(lineParams);
        let node = root;

        while( state.next !== null){

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

            node.next = new UpdateNode(lineParams);
            node = node.next;

            state = state.next;

        }
        

        this.line.update(root);

    }


    translate_center(center, stepSize=0.1){

        let direction = Math.sign( center - this.params.center );
        let x = this.params.center + direction * stepSize;


        let root = new UpdateNode({"center": x});
        let node = root
        x +=  direction * stepSize;

        while ( Math.abs(center-x) > 0.1 ){


            node.next = new UpdateNode({"center": x});
            node = node.next;

            x +=  direction * stepSize;
            if( (x > center && center > this.params.center) || (x < center && center < this.params.center) ){
                x = center;
            }

        }

        this.update(root);

    }


    get_data(){

    

        let func = get_tangent(this.params.fx, this.params.center);     // tangent-line function
        this.data = get_points_from_lenght(func, this.params.center, this.params.length);

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


function get_tangent(fx, x){    // get tangent-line function

    let k = get_slope(fx, x);
    let m = fx(x) - k*x;

    return (x) => { return k*x + m };

}



/* Test functions */

function test_chart(){

const margin = { top: 60, right: 60, bottom: 50, left: 60 },
  width = 450 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

chart1 = new ChartObj( width, height, margin, 4, 4, "tan-chart", "viz1", -2, -2);
chart2 = new ChartObj( width, height, margin, 4, 4, "tan-chart2", null, -4, -4);

//chart1.remove_svg();
//chart2.assigne_svg("viz1");

}

function test_canvas(){

    const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-6,6], [-6,6]);
    let chart = new ChartObj( "chart1", canvas);
    canvas.assign_to_div("viz1");

}


function test_graph(){

    const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


    let fx = (x)=>{return 3*Math.sin(x)};

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-6, 6], [-6, 6], "viz1");
    let chart = new ChartObj("chart1", canvas);
    let graph1 = new GraphObj("graph1", fx, [-6, 6],{}, canvas);

    let btn = document.getElementById("testBtn");
    btn.onclick = ()=>{

        graph1.update(new UpdateNode({"fx": (x)=>{return x**3/10}}));

    }

}

function test_tangent(){

    const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let fx = (x)=>{return 3*Math.sin(x)};

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-6, 6], [-6, 6], "viz1");
    let chart = new ChartObj("chart1", canvas);
    let graph = new GraphObj("graph1", fx, [-6, 6], {}, canvas);
    let tangent = new TnagentObj("tangent", fx,{"center":2}, canvas);


    var slider = document.getElementById("xSlider");

    slider.oninput = function(){

    let val = this.value / 1000;
    let xVal = -6 * (1-val) + 6*val;
    tangent.translate_center(xVal);

    }


    let btn = document.getElementById("testBtn");
    btn.onclick = ()=>{

        if(tangent.canvas === null){
            tangent.assigne_to_canvas(canvas);
        } else{
            tangent.remove_from_canvas();
        }

    }

}


test_tangent();
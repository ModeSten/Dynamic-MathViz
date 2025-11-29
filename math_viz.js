
/* mathematics visualisation, generci functions and classes */
/* 
dependencies: 
- D3 
*/


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


// kdrdinate system (axis)
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


class GraphObj{

    constructor( id, fx, xRange, canvas=null, defines=(x)=>{ return x !== NaN } ){ 

        this.id = id;
        this.canvas;

        this.fx = fx;           // graph function
        this.xRange = xRange;   // graph value (x) range
        this.data;
        this.defines = defines;           // function specifing when graph is defined

        this.get_data();

        if (canvas !== null){
            this.assigne_to_canvas(canvas);
        }

    }


    get_data(){

        this.data = []; // remove stored data
        let y;

        for( let x=this.xRange[0]; x <= this.xRange[1]; x+=0.1){

            y = this.fx( x );
            this.data.push( [x, y] );

        }

    }


    assigne_to_canvas(canvas){

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


    svg_init(){

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
        .merge(u)
            .transition(1000)
            .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 2.5);

    }

}




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

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-5, 5], [-6, 6], "viz1");
    let graph = new GraphObj("graph1", (x)=>{ return x**2 }, [-2, 2], canvas);
    let chart = new ChartObj("chart1", canvas);

    graph.remove_from_canvas();

}


test_graph();
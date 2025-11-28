
/* mathematics visualisation, generci functions and classes */
/* 
dependencies: 
- D3 
*/


// visualisation (SVG) container (base object)
class CanvasObj {

    constructor ( width, height, margin, id, xRange, yRange, parentId=null){

        this.ID = id;
        this.parentId; // div container for svg

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

    assign_to_div ( targetDivId ){

        this.parentId = targetDivId;

        this.svg = d3.select("#"+targetDivId)
            .append("svg")
                .attr("id", this.ID)
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
                .attr("transform", "translate("+ this.margin.left + "," + this.margin.top +")");

    }


    remove_from_div (){

        let container = document.getElementById(this.parentId);   // get conatining div
        let element = document.getElementById(this.ID);         // get svg element

        container.removeChild(element);             

        this.parent = null;
        this.svg = null;

    }

    update_canvas(){

    }

}


class ChartObj {

    constructor ( id, parentCanvas=null, xRange = null, yRange = null){

        this.canvas = null;    // containing canvas (svg) id
        this.ID = id;               

        this.xRange = xRange; // chart x value range; if null, use canvas x-Range
        this.yRange = yRange; // chart y value range; if null, use canvas y-range

        this.xScale;    // chart x scale; set as dependent parameter
        this.yScale;    // chart y scale; set as dependent parameter

        this.xAxis;     // chart x axis; set as dependent parameter
        this.yAxis;     // chart y axis: set as dependent parameter

        this.xAxisOfset;  // chart x (botom) axis ofset (from top)
        this.yAxisOfset;            // chart y (left) axis ofset (from left edge)


        this.canvas = null;                   // chart visual (svg) object
        if (parentCanvas !== null){     // create svg if target div is specified
            this.assigne_to_canvas( parentCanvas );
        }


    }

    // set dependent parameter values
    set_dependents(){


        if (this.canvas !== null){

            if(this.xRange === null){  
                this.xRange = this.canvas.xRange;
            } 
            if(this.yRange === null){
                this.yRange = this.canvas.yRange;
            }

            this.xScale = d3.scaleLinear( this.xRange, [0, this.canvas.width] );
            this.yScale = d3.scaleLinear( this.yRange, [this.canvas.height, 0]);

            this.get_axis_ofset();

        }   else{

            this.xScale = null;
            this.yScale = null;
            this.xAxis = null;
            this.yAxis = null;

        }


    }


    // get axis ofset based on x and y range 
    get_axis_ofset(){

        let xStep = this.canvas.width / (this.xRange[1] - this.xRange[0]);
        let yStep = (this.canvas.height) / (this.yRange[1] - this.yRange[0]);


        if(this.yRange[0] < 0){     // if min y value is negative, move x-axis up 
            this.xAxisOfset = this.canvas.height + yStep * this.yRange[0];
        } else{
            this.xAxisOfset = this.canvas.height; 
        }

        if(this.xRange[0] < 0){     // if min x is negative, move y-axis to right
            this.yAxisOfset = xStep * -this.xRange[0];
        } else{
            this.yAxisOfset = 0;
        }


    }


    // update chart parameters
    update_chart(){

        /* placeholder */

    }


    // assignr chart to dive container and create svg ellement
    assigne_to_canvas( targetCanvas ){

        this.canvas = targetCanvas;
        this.set_dependents();

        this.xAxis = d3.axisBottom(this.xScale); 
        this.yAxis = d3.axisLeft(this.yScale); 

        this.canvas.svg.append("g")
            .attr("transform", `translate(0,${this.xAxisOfset})`)
            .call(this.xAxis);

        this.canvas.svg.append("g")
            .attr("transform", `translate(${this.yAxisOfset},0)`)
            .call(this.yAxis);

    // Axes label

    // x label
    this.canvas.svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x",  -15)
        .attr("y", this.xAxisOfset)
        .text("x");

    // y label
    this.canvas.svg.append("text")  
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", this.yAxisOfset)
        .attr("y", -15)
        .html("y");


    }

    // remove from canvas (svg)
    remove_from_canvas(){



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

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-4,4], [-4,4], "viz1");
    let chart = new ChartObj( "chart1" );

    chart.assigne_to_canvas(canvas);

    canvas.remove_from_div();
    canvas.assign_to_div("viz1");
    chart.assigne_to_canvas(canvas);

}


test_canvas();
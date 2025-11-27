
/* mathematics visualisation, generci functions and classes */


class ChartObj {

    constructor ( width, height, margin, xMax, yMax, id, parentDiv=NaN, xMin=0, yMin=0 ){

        this.width = width;         // chart width
        this.height = height;       // chart height
        this.margin = margin;       // chart border margin
        this.rangeX = [xMin, xMax]; // chart x value range
        this.rangeY = [yMin, yMax]; // chart y value range

        this.scaleX;    // chart x scale; set as dependent parameter
        this.scaleY;    // chart y scale; set as dependent parameter

        this.axisX;     // chart x axis; set as dependent parameter
        this.axisY;     // chart y axis: set as dependent parameter

        this.xAxisOfset = this.height;  // chart x (botom) axis ofset (from top)
        this.yAxisOfset = 0;            // chart y (left) axis ofset (from left edge)

        this.set_dependent();

        this.parent = parentDiv;    // containing div id
        this.id = id;               // svg element id

        this.svg;                   // chart visual (svg) object
        if (parentDiv !== NaN){     // create svg if target div is specified
            this.assigne_svg( parentDiv );
        }

    }

    // update chart parameters
    update_chart(){

        /* placeholder */

    }

    // assignr chart to dive container and create svg ellement
    assigne_svg( targetDiv ){

        // create svg element
        this.svg = d3.select("#"+targetDiv)
            .append("svg")
                .attr("id", this.id)
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
                .attr("transform", "translate("+ this.margin.left + "," + this.margin.top +")");

        // add axis
        this.svg.append("g")
            .attr("transform", `translate(0,${this.xAxisOfset})`)
            .call(this.axisX);
            
        this.svg.append("g")
            .attr("transform", `translate(${this.yAxisOfset},0)`)
            .call(this.axisY);


    // Axes label

    // x label
    this.svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x",  -15)
        .attr("y", this.xAxisOfset)
        .text("x");

    // y label
    this.svg.append("text")  
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", this.yAxisOfset)
        .attr("y", -15)
        .html("y");


    }

    // remove svg element from containing div
    remove_svg(){

        if(this.parent === NaN || this.svg === NaN){  // no existing svg element
            return
        }

        let container = document.getElementById(this.parent);   // get conatining div
        let element = document.getElementById(this.id);         // get svg element
        container.removeChild(element);             

        this.parent = NaN;
        this.svg = NaN;

    }


    // set dependent parameter values
    set_dependent(){

        this.scaleX = d3.scaleLinear( this.rangeX, [0, this.width] );   // x axis scale
        this.scaleY = d3.scaleLinear( this.rangeY, [this.height, 0]);   // y axis scale

        this.axisX = d3.axisBottom(this.scaleX);    // x axis
        this.axisY = d3.axisLeft(this.scaleY);      // y axis

        this.get_axis_ofset();

    }

    // get axis ofset based on x and y range 
    get_axis_ofset(){

        let xStep = this.width / (this.rangeX[1] - this.rangeX[0]);     // fraction of width coresponding to each x value step
        let yStep = this.height / (this.rangeY[1] - this.rangeY[0]);    // fraction of height coresponding to each y value step

        if(this.rangeY[0] < 0){     // if min y value is negative, move x-axis up 
            this.xAxisOfset = this.height - yStep * -this.rangeY[0]; 
        } else{
            this.xAxisOfset = this.height;
        }

        if(this.rangeX[0] < 0){     // if min x is negative, move y-axis to right
            this.yAxisOfset = xStep * -this.rangeX[0];
        } else{
            this.yAxisOfset = 0;
        }

    }


}


function test_chart(){

const margin = { top: 60, right: 60, bottom: 50, left: 60 },
  width = 450 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

chart1 = new ChartObj( width, height, margin, 4, 4, "tan-chart", "viz1", -2, -2);
chart2 = new ChartObj( width, height, margin, 4, 4, "tan-chart2", NaN, -4, -4);

//chart1.remove_svg();
//chart2.assigne_svg("viz1");

}

test_chart();
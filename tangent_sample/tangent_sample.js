
const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 500 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;


//var fx = (x)=>{ return x**3 / 30 };
//var fx = (x)=>{ return x**2 / 10 };
//var fx = (x)=>{ return x**4.5 / 10 };
var fx = (x)=>{ return 5*Math.sin(x/1.5) };


var xRange = [-10, 10];
var yRange = [-10, 10];


function get_fx_string(fx){
      
    //let rawStr = fx.toString();
    let leftBracket = false;
    let fxStr = "";

    for( char of rawStr ){

        if(char === "}"){
            break;
        }

        if( leftBracket ){
            fxStr = fxStr.concat(char);
        }
        if(char === "{"){
            leftBracket = true;
        }

    }

    return fxStr;

}


function tangent1(){

    let root = document.getElementById("root");
    let divId = "tan_viz1";
    let container = new DivObj(divId, root, "viz_container");


    let canvas = new CanvasObj( "canvas1", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart1", {}, canvas );
    let graph = new GraphObj( "graph1", fx, xRange, {"color": "black"}, canvas );
    let tangent = new TangentBaseObj( "tangent1", fx, {}, canvas, graph );
    let marker = new SegmentMarkerFxObj( "marker1", tangent, { "color": "green"}, canvas);


    let slider = new SliderObj("tanSlider1", [-10, 10], 0, "x=", container.div);
    
    let update = (val)=>{

        tangent.translate_center(val);

    }

    slider.addListener(update);


}


function tangent2(){

    let root = document.getElementById("root");
    let divId= "tan_viz2";
    let n = 3;

    let container = new DivObj(divId, root, "viz_container");

    let canvas = new CanvasObj( "canvas2", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart2", {}, canvas );
    let graph = new GraphObj( "graph2", fx, xRange, {"color": "black"}, canvas );
    let tanChain = new TangentChainObj( "tan_chain1", fx, xRange, {"n":n, "ofset":0.5}, canvas, graph);
    let marker = new SegmentMarkerFxObj( "marker2", tanChain, { "color": "green", "p":[tanChain.params.ofset]}, canvas);

    let button = new ButtonStepObj("stepBtn1", "n=", [0, 30], 1, 3);
    button.assignToDiv(container.div);

    let update = (val)=>{

        tanChain.update( new UpdateNode({"n": val}) );

    }


    button.addListener(update);

}


function tangent3(){

    let root = document.getElementById("root");
    let divId= "tan_viz3";
    let container = new DivObj(divId, root, "viz_container");
    let h0 = 0.5;

    let canvas = new CanvasObj( "canvas3", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart3", {}, canvas );
    let graph = new GraphObj( "graph3", fx, yRange, {"color": "black"}, canvas );
    let tanChain = new TangenHChainObj( "tan_hchain1", fx, xRange, {}, canvas, graph, h0);
    let marker = new SegmentMarkerFxObj( "marker3", tanChain, {"color": "green", "p": [0, 1]}, canvas);


    let slider = new SliderObj("tanSlider2", [0.1, 10], 5, "h", container.div);
    
    let update = (val)=>{

        tanChain.update(new UpdateNode({"h": val}))

        if(val < 0.5){
            marker.remove_from_canvas();
        } else{
            marker.assigne_to_canvas(canvas);
        }

    }

    slider.addListener(update);


}


function tangent4(){

    let root = document.getElementById("root");
    let divId= "tan_viz4";
    let container = new DivObj(divId, root, "viz_container");
    let h0 = 0.5;

    let canvas = new CanvasObj( "canvas4", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart4", {}, canvas );
    let graph = new GraphObj( "graph4", fx, yRange, {"color": "black"}, canvas );
    let tanChain = new SlopeChainObj( "tan_hchain2", fx, xRange, {}, canvas, graph, h0);
    let marker = new SegmentMarkerFxObj( "marker4", tanChain, {"p": [0, 1], "color": "green"}, canvas);
    marker.duration =0;

    let slider = new SliderObj("tanSlider3", [0.1, 10], 5, "h=", container.div);
    
    let update = (val)=>{

        tanChain.update(new UpdateNode({"h": val}))

        if(val < 0.5){
            marker.remove_from_canvas();
        } else{
            marker.assigne_to_canvas(canvas);
        }

    }

    slider.addListener(update);


}


function tangent5(){

    let divId = "tan_viz5";
    let root = document.getElementById("root");

    let container = new DivObj(divId, root, "viz_container");

    let canvas = new CanvasObj("canvas5", width, height, margin, xRange, yRange, divId);
    let chart = new ChartObj("chart5", {}, canvas);
    let graph = new GraphObj("graph5", fx, xRange, {"color": "black"}, canvas);
    let slope = new SlopeObj("slope1", fx, {}, canvas, graph);
    let marker = new SegmentMarkerFxObj("marker5", slope, {"p": [0, 1], "color": "green"}, canvas);

    let slider = new SliderObj("tanSlider4", [-10, 10], -5, "x0=", container.div);
    
    let update = (val)=>{

        slope.update(new UpdateNode({"x0": val}))


    }

    slider.addListener(update);

    let slider2 = new SliderObj("tanSlider5", [0.1, 10], 1, "h=", container.div);
    
    let update2 = (val)=>{

        slope.update(new UpdateNode({"h": val}))


    }

    slider2.addListener(update2);

}


tangent1();
tangent2();
tangent3();
tangent4();
tangent5();

const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/50}, (x)=>{ return 5*Math.sin(x/3)}, (x)=>{return 5*Math.cos(x/3)} ];
//var fx = [ (x)=>{ return 1.5*x}, (x)=>{ return 1.5*x**2 / 5}, (x)=>{ return 1.5*x**3 / 10}, (x)=>{ return 1.5 * x**4 / 100} ];
var fI = 1;



function derivative_color(){

    let root = document.getElementById("root");

    let div = new DivObj("dxColorContainer", root, "viz_container");
    let svgDiv = new DivObj("dxColorSvgDiv", div.div, "svg_container");

    let button = new ButtonObj("testButton", "test", div.div);

    let canvas = new CanvasObj("dxColorCanvas", width, height, margin, [-15, 15], [-10, 10], "dxColorSvgDiv");
    let chart = new ChartObj("dxColorChart", {}, canvas);
    

    let graphColor = new DxColorObj("dxColorGraph", fx[fI], [-15, 15], {"draw": true}, canvas);
    let fDx = new DerivativeApxObj("dx", fx[fI], [-15, 15], {"color": "blue", "draw":false}, null, graphColor);
    //let fDdx = new DxApxDataObj("ddx", {"color": "purple", "draw": false}, canvas, fDx);

    ///*
    let btnRm = button.addListener( (obj)=>{
        
        fI ++;
        let update = new UpdateNode({"fx": fx[fI%fx.length], "draw": true}, 1000);
        graphColor.update(update);
    
    } );
     //*/


}


function tangent(){

    let root = document.getElementById("root");

    let div = new DivObj("tangentContainer", root, "viz_container");
    let svgDiv = new DivObj("tangentSvgDiv", div.div, "svg_container");

    let canvas = new CanvasObj("tangentCanvas", width, height, margin, [-10, 10], [-10, 10], svgDiv.id);
    let chart = new ChartObj("tangentChart", {}, canvas);


    let graph = new GraphObj("tangentGraph", fx[fI], [-10, 10], {}, canvas);
    let tangent = new TangentObj("tangentLine", fx[fI], {"length": 100, "origin":2}, canvas, graph);

    let slider = new SliderObj("tanSlider", [-10, 10], 2, "x= ", div.div, "viz_slider", 1000);
    let px = tangent.params.origin;
    let py = tangent.params.fx(px);
    let slope = get_slope(tangent.fx, px).toFixed(5);
    
    let label = new LabelObj("kLabel", [px, py], `k= ${slope}`, {}, canvas, "label");

    slider.addListener(
        (x)=>{
            tangent.translate_center(x);
            slope = get_slope(tangent.fx, x).toFixed(5);
            let y = tangent.params.fx(x);
            let txt = `k= ${slope}`;
            let update = new UpdateNode({"text": txt, "position": [x, y]}, 10);
            label.update(update);
        }
    )


}


function slope(){

    let root = document.getElementById("root");

    let div = new DivObj("slopeContainer", root, "viz_container");
    let svgDiv = new DivObj("slopeSvgDiv", div.div, "svg_container");

    let canvas = new CanvasObj("slopeCanvas", width, height, margin, [-10, 10], [-10, 10], svgDiv.id);
    let chart = new ChartObj("slopeChart", {}, canvas);


    let graph = new GraphObj("slopeGraph", fx[fI], [-10, 10], {}, canvas);
    let slope = new SlopeObj("slopeLine", fx[fI], {"x0": 2, "h":3}, canvas, graph);
    let slopeSup = new SlopeSuportObj("slopeSup", slope, {}, canvas);


    /* test function for zooming o mouse click
    let defXrange = canvas.params.xRange;
    let defYrange = canvas.params.yRange;

    svgDiv.div.addEventListener("click", (e)=>{

        let bounds = e.target.getBoundingClientRect();
        let x = e.clientX - bounds.left;
        x /= svgDiv.div.offsetWidth;
        let y = e.clientY - bounds.top;
        y /= svgDiv.div.offsetHeight; 
        y = 1-y;

        let xOrigin = defXrange[0] * (1-x) + defXrange[1]*x;
        let xRange = [xOrigin-5, xOrigin+5];
        let yOrigin = defYrange[0] * (1-y) + defYrange[1]*x;
        let yRange = [yOrigin-5, yOrigin+5];

        canvas.update({"xRange":xRange, "yRange": yRange});
    });
    */

}



derivative_color();
tangent();
slope();
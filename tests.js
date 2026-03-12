const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/50}, (x)=>{ return 5*Math.sin(x/3)}, (x)=>{return 5*Math.cos(x/3)} ];
//var fx = [ (x)=>{ return 1.5*x}, (x)=>{ return 1.5*x**2 / 5}, (x)=>{ return 1.5*x**3 / 10}, (x)=>{ return 1.5 * x**4 / 100} ];
var fI = 1;



function main(){

    let root = document.getElementById("root");

    let vizDiv = new VizContainerObj("testViz", root);
    let canvas = new CanvasObj("testCanvas", width, height, main, [-10, 10], [-10, 10], vizDiv.svgDiv.id);
    let chart = new ChartObj("testChart", {}, canvas);

    let graph = new GraphObj("testGraph", (x)=>{return -3/x+6}, [0.01, 30], {}, canvas);
    let secant = new SecantObj("testSecant", graph.params.fx, {"x0": 1, "h": 3}, canvas, graph);

    let labelSupLine = new LabelAxisLineObj("labelLines", secant.data, {}, canvas, secant.svgObj);
    let supLine = new SecantSuportObj("secantTri", secant, {}, canvas);
    let labels = new slopeLabels("labels", secant, {}, canvas);

    let slider = new SliderObj("testSlider", [0.01, 10], 1, "x=", vizDiv.containerDiv.div);
    slider.addListener((val)=>{

        let update = new UpdateNode({"x0": val}, 10); 
        secant.update(update);

    });

    let slider2 = new SliderObj("testSlider2", [0.1, 10], 5, "h=", vizDiv.containerDiv.div);
    slider2.addListener((val)=>{

        let update = new UpdateNode({"h": val}, 10);
        secant.update(update);


    });
    

}


main();
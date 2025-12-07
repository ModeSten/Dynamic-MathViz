const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 500 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}];
let fI = 2;



function main(){

    let canvas = new CanvasObj(width, height, margin, "testcanvas1", [-10, 10], [-10, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-10, 10], {}, canvas);
    //let tangent = new TangentObj("tangent1", fx[fI], {"length": 15, "center": 3}, canvas, graph);

    let markers = new MarkerObj("marker1", {}, canvas, graph);

}



main();
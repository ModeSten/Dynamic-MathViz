const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 700 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


function viz1(root){

    let vizDiv1 = new VizContainerObj("viz1", root);
    let canvas = new CanvasObj("canvas1", width, height, margin, [-10, 10], [-5, 10] , vizDiv1.svgDiv.id);
    let chart = new ChartObj("chart1", {}, canvas);

    let fx = (x)=>{return x**2 / 4 - 2};
    let graph = new GraphObj("graph1", fx, [-10, 10], {}, canvas );
    let secant = new SlopeObj("slope1", fx, {"x0":4, "h": 2}, canvas, graph);
    let slopeSup = new SlopeSuportObj("slopeSup1", secant, {"width": 1}, canvas);


    let btn = new ButtonObj("testBtn", "test", vizDiv1.containerDiv.div);
    btn.addListener(()=>{
        let update = new UpdateNode({"fx": (x)=>{return 5*Math.sin(x/3)}});
        graph.update(update);
    });





}


function viz2(root){

    let vizDiv1 = new VizContainerObj("viz2", root);
    let canvas = new CanvasObj("canvas2", width, height, margin, [-10, 10], [-10, 10] , vizDiv1.svgDiv.id);
    let chart = new ChartObj("chart2", {}, canvas);

    let fx = (x)=>{return x**2 / 4 - 2};
    let graph = new GraphObj("graph2", fx, [-10,10], {}, canvas);
    let tangent = new TangentObj("tangent1", fx, {"length": 100, "origin": 2}, canvas, graph);
    let k = get_slope(fx, 2).toFixed(2);
    let label = new LabelObj("tangentTxt1", [1.5,-1], `k=${k}`, {"anchor": "start"}, canvas);



}


let root = document.getElementById("root");
viz1(root);
viz2(root);
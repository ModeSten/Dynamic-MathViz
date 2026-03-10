const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 700 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


function viz1(root){

    let vizDiv1 = new VizContainerObj("viz1", root);
    let canvas = new CanvasObj("canvas1", width, height, margin, [-10, 10], [-10, 5] , vizDiv1.svgDiv.id);
    let chart = new ChartObj("chart1", {}, canvas);

    let fx = (x)=>{return -1*x**2 / 6 + 4};
    let graph = new GraphObj("graph1", fx, [-10, 10], {} , canvas);
    let secant = new SlopeObj("slope1", fx, {"x0":4, "h": 2}, canvas, graph);
    let slopeSup = new SlopeSuportObj("slopeSup1", secant, {"width": 2.5}, canvas);
    let label = new slopeLabels("slopeLabels", secant, {}, canvas);
    let labelLines = new PointAxisLines("labelInd", secant.data, {}, canvas, secant);


    let btn = new ButtonObj("testBtn", "test", vizDiv1.containerDiv.div);
    btn.addListener(()=>{
        let update = new UpdateNode({"x0": -6});
        secant.update(update);
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



function viz3(root){

    let vizDiv1 = new VizContainerObj("viz3", root);
    let canvas = new CanvasObj("canvas3", width, height, margin, [-15, 15], [-5, 5] , vizDiv1.svgDiv.id);
    let chart = new ChartObj("chart3", {}, canvas);

    let fx = (x)=>{return x**3 / 6 };
    let h = 1;
    let graph = new GraphObj("graph2", fx, [-15,15], {}, canvas);
    let derivative = new DerivativeApxObj("derivative", fx, [-15, 15], {"h": h}, canvas);
     let derivative1 = new DerivativeApxObj("derivative1", fx, [-15, 15], {"h": 0.01, "color":"blue"}, canvas);



}


let root = document.getElementById("root");
viz1(root);
viz2(root);
viz3(root);
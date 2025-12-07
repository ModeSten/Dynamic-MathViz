const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 500 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}];
let fI = 2;



function main(){

    let canvas = new CanvasObj(width, height, margin, "testcanvas1", [-10, 10], [-10, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-10, 10], {}, canvas);
    let tangent = new TangentObj("tangent1", fx[fI], {"length": 15, "center": 3}, canvas, graph);

    let markers = new MarkerObj("marker1", {}, canvas, graph);
    markers.set_parent( tangent, markers.center_marker);

    let testBtn = document.getElementById("testBtn");
    testBtn.onclick = ()=>{

        ///*
        fI ++;
        let update = new UpdateNode({"fx": fx[fI%fx.length]});
        graph.update(update);
        //*/

        /*
        let update = new UpdateNode({ "r": "10" });
        markers.update(update);
        */

    }

    let slider = document.getElementById("originR");
    let txt = document.getElementById("xTXT");
    slider.oninput = function(){

        let val = this.value / 100;
        let xVal = graph.params.xRange[0] * (1-val) + graph.params.xRange[1]*val;
        tangent.translate_center(xVal);
        txt.innerHTML = `x=${xVal.toFixed(1)}`;

    }

}



main();
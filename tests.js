const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 1000 - margin.left - margin.right,
height = 900 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}];
let fI = 2;



function main(){

    let canvas = new CanvasObj("testcanvas1", width, height, margin, [0, 10], [0, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-10, 10], {}, canvas);
    let tangent = new TangentObj("tangent1", fx[fI], {}, canvas, graph);

    //let markers = new SpacedMarkerObj("marker1", {}, graph, canvas);
    let marker = new SegmentMarkerFxObj("marker1", {"p": [0.5]}, tangent, canvas);
    marker.duration = 5;

    let testBtn = document.getElementById("testBtn");
    testBtn.onclick = ()=>{

        canvas.update({"xRange": [-10, 10]});

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
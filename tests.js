const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}, (x)=>{ return 5*Math.sin(x/3)}, (x)=>{return 5*Math.cos(x/3)} ];
let fI = 0;



function main(){

    let canvas = new CanvasObj("testcanvas1", width, height, margin, [-10, 10], [-10, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-10, 10], {"draw": true});
    let marker = new SpacedMarkerObj("marker1", graph, {"space": 5}, canvas);
    //let marker = new SegmentMarkerObj("marker1", graph, {"p": [0]});

    graph.assigne_to_canvas(canvas);

    let testBtn = document.getElementById("testBtn");
    testBtn.onclick = ()=>{

        //canvas.update({"xRange": [-5, 5], "yRange": [-5, 5]});

        fI++;
        graph.update( new UpdateNode({"fx": fx[fI%fx.length], "draw": false}));



    }

}



main();
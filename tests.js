const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}, (x)=>{ return Math.sqrt(5**2 - x**2)}, (x)=>{return -Math.sqrt(5**2 - x**2)} ];
let fI = 2;



function main(){

    let canvas = new CanvasObj("testcanvas1", width, height, margin, [-10, 10], [-10, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[3], [-5, 5], {"draw": true});
    //let marker = new SpacedMarkerObj("marker1", graph, {"space": 5}, canvas);
    //let marker = new SegmentMarkerObj("marker1", graph, {"p": [0]});
    let graph2 = new GraphObj("graph2", fx[4], [-5, 5], {"draw": true}, canvas);

    graph.assigne_to_canvas(canvas);

    let testBtn = document.getElementById("testBtn");
    testBtn.onclick = ()=>{

        //canvas.update({"xRange": [-5, 5], "yRange": [-5, 5]});

        graph.update( new UpdateNode({"fx": fx[4], "draw": false}));
        graph2.update( new UpdateNode({"fx": fx[3], "draw": false}));



    }

}



main();
const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 1000 - margin.left - margin.right,
height = 900 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}];
let fI = 0;



function main(){

    let canvas = new CanvasObj("testcanvas1", width, height, margin, [-10, 10], [-10, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-10, 10], {});

    let testBtn = document.getElementById("testBtn");
    testBtn.onclick = ()=>{

        //canvas.update({"xRange": [-5, 5], "yRange": [-5, 5]});
        let update = new UpdateNode({"fx": fx[fI%fx.length]});
        graph.update(update);

        if(graph.canvas == null){
            graph.assigne_to_canvas(canvas);
        } else{
            graph.remove_from_canvas();
            fI++;
        }

    }

}



main();
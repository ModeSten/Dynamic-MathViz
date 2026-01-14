const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}];
let fI = 2;



function main(){

    let canvas = new CanvasObj("testcanvas1", width, height, margin, [-10, 10], [-10, 10], "test_viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-10, 10], {"drawT": 0, "draw": true});

    graph.assigne_to_canvas(canvas);

    let testBtn = document.getElementById("testBtn");
    testBtn.onclick = ()=>{

        //canvas.update({"xRange": [-5, 5], "yRange": [-5, 5]});
        let update = new UpdateNode({"drawT": 0.5, "drawT0": 0, "draw": true, "color":"red"}, 1500, 100);
        update.next = new UpdateNode({"draw": false, "color": "green", "width": 5}, 500, 50);
        update.next.next = new UpdateNode({"draw": false, "color": "green", "width": 2.5}, 500, 50);
        update.next.next.next = new UpdateNode({"drawT": 1, "drawT0": 0.5, "draw": true}, 1500, 100);
        update.next.next.next.next = new UpdateNode({"draw": false, "color": "blue", "width": 5}, 500, 50);
        update.next.next.next.next.next = new UpdateNode({"draw": false, "color": "black", "width": 2.5}, 500, 50);
        graph.update(update);


    }

}



main();
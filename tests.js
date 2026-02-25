const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/50}, (x)=>{ return 5*Math.sin(x/3)}, (x)=>{return 5*Math.cos(x/3)} ];
let fI = 2;



function main(){

    let root = document.getElementById("root");

    let div = new DivObj("testDiv1", root);

    let button = new ButtonObj("testButton", "test", div.div);

    let canvas = new CanvasObj("canvas1", width, height, margin, [-10, 10], [-10, 10], "testDiv1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-7, 7], {"draw": true}, canvas);
    let dx = new DxApxDataObj("derivative1", {}, canvas, graph);
    let dxdx = new DxApxDataObj("derivative2", {"color":"green"}, canvas, dx);


    let btnRm = button.addListener( (obj)=>{
        
        fI ++;
        let update = new UpdateNode({"fx": fx[fI%fx.length]});
        graph.update(update);
    
    } );


}



main();
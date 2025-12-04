
const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 500 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;


function tangent1(){

    let divId = "tan_viz1";
    let fx = (x)=>{ return x**2 / 10 };

    let canvas = new CanvasObj( width, height, margin, "canvas1", [-10, 10], [-10, 10], divId );
    let chart = new ChartObj( "chart1", {}, canvas );
    let graph = new GraphObj( "graph1", fx, [-10, 10], {}, canvas );
    let tangent = new TangentObj( "tangent1", fx, {}, canvas, graph );

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas1");
    container.insertBefore(viz, container.firstChild);

}


function tangent2(){

    let divId= "tan_viz2";
    let fx = (x)=>{ return 6 * Math.sin(x) };

    let canvas = new CanvasObj( width, height, margin, "canvas2", [-10, 10], [-10, 10], divId );
    let chart = new ChartObj( "chart2", {}, canvas );
    let graph = new GraphObj( "graph2", fx, [-10, 10], {}, canvas );
    let tanChain = new TangentChainObj( "tan_chain1", fx, [-10, 10], {"n":7}, canvas, graph);

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas2");
    container.insertBefore(viz, container.firstChild);

}


tangent1();
tangent2();
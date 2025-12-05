
const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 500 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;


function get_fx_string(fx){
      
    let rawStr = fx.toString();
    let leftBracket = false;
    let fxStr = "";

    for( char of rawStr ){

        if(char === "}"){
            break;
        }

        if( leftBracket ){
            fxStr = fxStr.concat(char);
        }
        if(char === "{"){
            leftBracket = true;
        }

    }

    return fxStr;

}


function tangent1(){

    let divId = "tan_viz1";
    let fx = (x)=>{ return 5*Math.sin(x/2) };


    let canvas = new CanvasObj( width, height, margin, "canvas1", [-10, 10], [-10, 10], divId );
    let chart = new ChartObj( "chart1", {}, canvas );
    let graph = new GraphObj( "graph1", fx, [-10, 10], {}, canvas );
    let tangent = new TangentObj( "tangent1", fx, {"center": 3}, canvas, graph );

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas1");
    container.insertBefore(viz, container.firstChild);

    get_fx_string(fx);

}


function tangent2(){

    let divId= "tan_viz2";
    let fx = (x)=>{ return 5*Math.sin(x/2) };

    let canvas = new CanvasObj( width, height, margin, "canvas2", [-10, 10], [-10, 10], divId );
    let chart = new ChartObj( "chart2", {}, canvas );
    let graph = new GraphObj( "graph2", fx, [-10, 10], {}, canvas );
    let tanChain = new TangentChainObj( "tan_chain1", fx, [-10, 10], {"n":7}, canvas, graph);

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas2");
    container.insertBefore(viz, container.firstChild);


}


function tangent3(){

    let divId= "tan_viz3";
    let fx = (x)=>{ return 5*Math.sin(x/2) };

    let canvas = new CanvasObj( width, height, margin, "canvas3", [-10, 10], [-10, 10], divId );
    let chart = new ChartObj( "chart3", {}, canvas );
    let graph = new GraphObj( "graph3", fx, [-10, 10], {}, canvas );
    let tanChain = new TangenHChainObj( "tan_hchain1", fx, [-10, 10], {}, canvas, graph, 0.5);

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas3");
    container.insertBefore(viz, container.firstChild);

}


tangent1();
tangent2();
tangent3();

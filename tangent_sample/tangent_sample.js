
const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 500 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;


//var fx = (x)=>{ return x**3 / 30 };
//var fx = (x)=>{ return x**2 / 10 };
//var fx = (x)=>{ return x**4.5 / 10 };
var fx = (x)=>{ return 5*Math.sin(x/1.5) };


var xRange = [-10, 10];
var yRange = [-10, 10];


function get_fx_string(fx){
      
    //let rawStr = fx.toString();
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
    //let fx = (x)=>{ return 5*Math.sin(x/2) };


    let canvas = new CanvasObj( "canvas1", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart1", {}, canvas );
    let graph = new GraphObj( "graph1", fx, xRange, {"color": "black"}, canvas );
    let tangent = new TangentBaseObj( "tangent1", fx, {}, canvas, graph );
    //let marker = new SegmentMarkerFxObj( "marker1", { "r": 3.5}, tangent, canvas);
    //marker.duration =5;

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas1");
    container.insertBefore(viz, container.firstChild);

    let txt = document.getElementById("xTXT");
    txt.innerHTML = `x=${Math.round(tangent.params.center)}`;

    var slider = document.getElementById("originR");

    slider.oninput = function(){

        let val = this.value / 100;
        let xVal = graph.params.xRange[0] * (1-val) + graph.params.xRange[1]*val;
        tangent.translate_center(xVal);

        txt.innerHTML = `x=${xVal.toFixed(1)}`;

    }


}


function tangent2(){

    let divId= "tan_viz2";
    //let fx = (x)=>{ return 5*Math.sin(x/2) };
    let n = 3;

    let canvas = new CanvasObj( "canvas2", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart2", {}, canvas );
    let graph = new GraphObj( "graph2", fx, xRange, {"color": "black"}, canvas );
    let tanChain = new TangentChainObj( "tan_chain1", fx, xRange, {"n":n}, canvas, graph);
    //let marker = new SegmentMarkerFxObj( "marker2", { "r": 3.5}, tanChain, canvas);

    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas2");
    container.insertBefore(viz, container.firstChild);

    let txt = document.getElementById("nTXT");
    txt.innerHTML = `n=${n}`;

    let fwdBtn = document.getElementById("n+");
    fwdBtn.onclick = () => {
        n++;
        let update = new UpdateNode({"n": n});
        tanChain.update(update);
        txt.innerHTML = `n=${n}`;

    }

    let BckBtn = document.getElementById("n-");
    BckBtn.onclick = () => {
        if(n>0){
            n--;
            let update = new UpdateNode({"n": n});
            tanChain.update(update);
            txt.innerHTML = `n=${n}`;
        }
    }


}


function tangent3(){

    let divId= "tan_viz3";
    //let fx = (x)=>{ return 5*Math.sin(x/2) };
    let h0 = 0.5;

    let canvas = new CanvasObj( "canvas3", width, height, margin, xRange, yRange, divId );
    let chart = new ChartObj( "chart3", {}, canvas );
    let graph = new GraphObj( "graph3", fx, yRange, {"color": "black"}, canvas );
    let tanChain = new TangenHChainObj( "tan_hchain1", fx, xRange, {}, canvas, graph, h0);
    //let marker = new SegmentMarkerFxObj( "marker3", {"p": [0, 1], "r": 2}, tanChain, canvas);
    //marker.duration =5;


    let container = document.getElementById(divId);
    let viz = document.getElementById("canvas3");
    container.insertBefore(viz, container.firstChild);

    let txt = document.getElementById("hTXT");
    txt.innerHTML = `h=${h0.toFixed(2)}`;

    var slider = document.getElementById("hRange");
    slider.oninput = function(){

        let val = this.value / 100;
        let h = val*5;

        let update = new UpdateNode({"h": h});
        tanChain.update(update);

        txt.innerHTML = `h=${h.toFixed(2)}`;

    }

}


tangent1();
tangent2();
tangent3();

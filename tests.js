const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}, (x)=>{ return 5*Math.sin(x/3)}, (x)=>{return 5*Math.cos(x/3)} ];
let fI = 3;



function main(){

    let div = new DivObj("testDiv1", "root", "testDiv");
    let slider = new SliderObj("testSlider1", [0, 100]);
    slider.assignToDiv(div.div.id);

    let canvas = new CanvasObj("canvas1", width, height, margin, [-10, 10], [-10, 10], "testDiv1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-7, 7], {"draw": true}, canvas);
    let tangent = new TangentBaseObj("tangent1", fx[fI], {}, canvas, graph);


    let listener = (val)=>{

        val /= 100;
        let xVal = (1-val)*graph.params.xRange[0] + val*graph.params.xRange[1];
        tangent.translate_center(xVal);

    }


    let remove = slider.addListener(listener);


}



main();
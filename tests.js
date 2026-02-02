const margin = { top: 60, right: 60, bottom: 50, left: 60 },
width = 750 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var fx = [ (x)=>{return 2*x} , (x)=>{return x**2/5}, (x)=>{return x**3/100}, (x)=>{ return 5*Math.sin(x/3)}, (x)=>{return 5*Math.cos(x/3)} ];
let fI = 3;



function main(){

    let root = document.getElementById("root");

    let div = new DivObj("testDiv1", root);
    let slider = new SliderObj("testSlider1", [-7, 7], -2, null);
    slider.assignToDiv(div.div);

    let button = new ButtonObj("testButton", "test", div.div);
    let btnRm = button.addListener( (obj)=>{console.log( obj.id )} );

    let canvas = new CanvasObj("canvas1", width, height, margin, [-10, 10], [-10, 10], "testDiv1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx[fI], [-7, 7], {"draw": true}, canvas);
    let tangent = new TangentBaseObj("tangent1", fx[fI], {}, canvas, graph);


    let listener = (val)=>{

        tangent.translate_center(val);

    }


    let remove = slider.addListener(listener);

}



main();
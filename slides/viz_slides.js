
const margin = { top: 50, right: 0, bottom: 20, left: 30 },
width = 700;
height = 400;

var fx = [(x)=>{return x**2 / 4}, (x)=>{return x**3/12}, (x)=>{ return 3*Math.sin(x/2)}];
var Dx = [(x)=>{return x/2}, (x)=>{return 3*x**2/12}, (x)=>{return 3/2*Math.cos(x/2)}];
var fxTxt = ["f(x)= x^2 / 4", "f(x)= x^3 / 12", "f(x)= 3*sin(x/2)"];

class Slide{

    constructor(id, svgN){

        let widhtClassLst = ["full", "half", "third"];
        let widhtClass = widhtClassLst[svgN%widhtClassLst.length];

        this.init = false;
        this.id = id;

        this.root = document.createElement("div");
        this.root.id = this.id;
        this.className = "viz_slide";
        this.vizContainer = document.createElement("div");
        this.vizContainer.className = "viz_container";
        this.footer = document.createElement("div");
        this.footer.className = "slide_footer";
        this.txtContainer = document.createElement("div");
        this.txtContainer.className = "slide_txt";
        this.ctrlContainer = document.createElement("div");
        this.ctrlContainer.className = "slide_ctrl";

        this.svgDiv = [];
        for(let i=0; i<svgN; i++){
            let div = document.createElement("div");
            div.id = this.id+i;
            div.className = "svg_div" + " " + widhtClass;
            this.vizContainer.appendChild(div);
            this.svgDiv.push(div);
        }

        this.footer.appendChild(this.txtContainer);
        this.footer.appendChild(this.ctrlContainer);

        this.root.appendChild(this.vizContainer);
        this.root.appendChild(this.footer);

        this.svgElements = {};
        this.inputs = {};

    }

}

var slides = [null, null, null, null];
var slideN = 0;
var slideF = [set_slide1, set_slide2, set_slide3, set_slide4];



function set_header(){

    let header = document.getElementById("header");
    let btn = new ButtonStepObj("testStep", "slide ", [1, 4], 1, 1, "back", "next", header);
    btn.addListener((val)=>{
        toggle_slide(val-1);
    });

}


function toggle_slide(n){

    if(n >= slides.length){
        return;
    }

    if(slides[slideN] !== null){
        slides[slideN].root.remove();
    }

    slideN = n;
    slideF[n](slides[n]);

}


function set_slide1( slide=null ){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide === null){

        slide = new Slide("derivativeIntro", 1);
        
        let figTxt = "<b>figure1:</b> this is a figure";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        slide.inputs["xSlider"] = new SliderObj("dxIntroSliderX", [-10, 10], -2, "x=", slide.ctrlContainer, "viz_slider", 1000);
        slide.inputs["hSlider"] = new SliderObj("dxIntroSliderH", [0.1, 7], 2, "h=", slide.ctrlContainer, "viz_slider", 1000);

        let select = new SelectorObj("dxIntroFxSelect", fxTxt, [0, 1, 2], slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[0] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){

        slide.init = true;

        let canvas = new CanvasObj("dxIntoCanvas", width, height, margin, [-10, 10], [-10, 10], slide.svgDiv[0].id);
        let chart = new ChartObj("dxIntroChart", {}, canvas);
        let graph = new GraphObj("dxIntroGraph", fx[0], [-20, 20], {}, canvas);
        let secant = new SecantObj("dxIntroSlope", fx[0], {"x0": 2, "h": 3}, canvas, graph);
        let slopeSup = new SecantSuportObj("dxIntroSlopeBase", secant, {}, canvas);
        let labels = new slopeLabels("dxIntroLabels", secant, {}, canvas);
        let LabelLines = new LabelAxisLineObj("dxIntroLabelL", secant.data, {}, canvas, secant.svgObj);

        slide.inputs.xSlider.addListener((val)=>{
            let update = new UpdateNode({"x0": val}, 10);
            secant.update(update);
        });
        slide.inputs.hSlider.addListener((val)=>{
            let update = new UpdateNode({"h": val}, 10);
            secant.update(update);
        });

        slide.inputs.fxSelect.addListener((val)=>{

            let update = new UpdateNode({"fx": fx[val]}, 1500);
            graph.update(update);

        });

    }

}


function set_slide2(slide=null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide === null){

        slide = new Slide("derivateCtn", 2);
        
        let figTxt = "<b>figure2:</b> this is a figure";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        slide.inputs["xSlider"] = new SliderObj("dxIntroSliderX", [-10, 10], -2, "x=", slide.ctrlContainer, "viz_slider", 1000);
        slide.inputs["hSlider"] = new SliderObj("dxIntroSliderH", [0.1, 7], 2, "h=", slide.ctrlContainer, "viz_slider", 1000);

        let select = new SelectorObj("dxCtnFxSelect", fxTxt, [0, 1, 2], slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[1] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){

        slide.init = true;

        let canvas1 = new CanvasObj("dxCtnCanvas1", width, height, margin, [-10, 10], [-10, 10], slide.svgDiv[0].id);
        let chart1 = new ChartObj("dxCtnChart1", {}, canvas1);
        let graph1 = new GraphObj("dxCtnG1", fx[0], [-20, 20], {}, canvas1);
        let secant = new SecantObj("dxCtnSlope", fx[0], {"width": 1.5}, canvas1, graph1);
        let slopeSup = new SecantSuportObj("dxCtnSlopeBase", secant, {}, canvas1);
        let labels = new slopeLabels("dxCtnLabels", secant, {}, canvas1);
        let LabelLines = new LabelAxisLineObj("dxCtnLabelL", secant.data, {}, canvas1, secant.svgObj);

        let canvas2 = new CanvasObj("dxCtnCanvas2", width, height, margin, [-10, 10], [-10, 10], slide.svgDiv[1].id);
        let chart2 = new ChartObj("dxCtnChart2", {}, canvas2);
        let graph2 = new GraphObj("dxCtnG2", fx[0], [-20, 20], {}, canvas2);
        let derivative = new DerivativeApxObj("dxCtnDx", fx[0], [-20, 20], {"color": "red"}, canvas2, graph2);
        let trueDx = new GraphObj("dxCtnTrueDx", Dx[0], [-20, 20], {"color": "green"}, canvas2);

        slide.inputs.xSlider.addListener((val)=>{
            let update = new UpdateNode({"x0": val}, 10);
            secant.update(update);
        })

        slide.inputs.hSlider.addListener((val)=>{
            let update = new UpdateNode({"h": val}, 10);
            secant.update(update);
            derivative.update(update);
        })

        slide.inputs.fxSelect.addListener((val)=>{

            let update = new UpdateNode({"fx": fx[val]}, 1500);
            let updateDx = new UpdateNode({"fx": Dx[val]});
            graph1.update(update);
            graph2.update(update);
            trueDx.update(updateDx);

        });

    }

}


function set_slide3(slide=null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide===null){

        slide = new Slide("tangentSlide", 1 );

        let figTxt = "<b>figure3:</b> this is a figure";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        slide.inputs["xSlider"] = new SliderObj("dxIntroSliderX", [-10, 10], -2, "x=", slide.ctrlContainer, "viz_slider", 1000);

        let select = new SelectorObj("tangentFxSelect", fxTxt, [0, 1, 2], slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[2] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){
        slide.init = true;

        let canvas = new CanvasObj("tangentCanvas", width, height, margin, [-10, 10], [-10, 10], slide.svgDiv[0].id);
        let chart = new ChartObj("tangentChart", {}, canvas);
        let graph = new GraphObj("tangentG", fx[0], [-20, 20], {}, canvas);
        let tangent = new TangentObj("tangent", fx[0], {"origin": 2, "length": 100}, canvas, graph);
        let marker = new SegmentMarkerObj("tangentMarker", tangent, {"p":[0.5], "color": "blue"}, canvas);
        let label = new TangentLabel("tangentLabel", tangent, {}, canvas);

        slide.inputs.xSlider.addListener((val)=>{
            let update = new UpdateNode({"origin": val}, 10);
            tangent.update(update);
        });

        slide.inputs.fxSelect.addListener((val)=>{

            let update = new UpdateNode({"fx": fx[val]}, 1500);
            graph.update(update);

        });

    }

}


function set_slide4(slide = null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide===null){

        slide = new Slide("dxColorSlide", 1 );

        let figTxt = "<b>figure4:</b> this is a figure";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        let select = new SelectorObj("dxClFxSelect", fxTxt, [0, 1, 2], slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[3] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){
        slide.init = true;

        let canvas = new CanvasObj("dxColorCanvas", width, height, margin, [-10, 10], [-10, 10], slide.svgDiv[0].id);
        let chart = new ChartObj("dxColorChart", {}, canvas);
        let dxColor = new DxColorObj("dxColorG", fx[0], [-20, 20], {"draw": true}, canvas);

        slide.inputs.fxSelect.addListener((val)=>{

            let update = new UpdateNode({"fx": fx[val]}, 1500);
            dxColor.update(update);

        });

    }

}



set_header();
toggle_slide(0);

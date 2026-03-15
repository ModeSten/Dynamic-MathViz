
const margin = { top: 50, right: 0, bottom: 20, left: 30 },
width = 700;
height = 400;

var fx = [(x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4}, (x)=>{return x**2/4 - 3*x/2 + 5 }, (x)=>{ return x**3/12 - 3*x**2/4 + 9*x/4 + 1}, (x)=>{ return 4*Math.sin(x)+5}];
var Dx = [(x)=>{return x**2/4 - 1.8*x + 2.5}, (x)=>{return x/2 - 3/2}, (x)=>{return x**2/4 - 3*x/2 +9/4}, (x)=>{ return 4*Math.cos(x) }];
var fxTxt = ["f(x)= 1/12*x^3 - 0.9x^2 + 2.5x +4", "f(x)= 1/4*x^2 - 3/2*x^2 +5", "f(x)= 1/12*x^3 - 3/4*x^2 +9/4*x +1", "f(x)= 4*sin(x)+5"];
var Xrange = [-3, 10];
var yRange = [-5, 10];

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

var slideN = 0;
var slideF = [dx_intro_slide, dx_continued_slide, tangent_slide, multi_tangent_slide, dx_color_slide];
var slides = Array(slideF.length).fill(null);


function set_header(){

    let header = document.getElementById("header");
    let btn = new ButtonStepObj("testStep", "slide ", [1, slideF.length], 1, 1, "back", "next", header);
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
    slideF[n](n, slides[n]);

}


function dx_intro_slide(i, slide=null){

    let div = document.getElementById("content");


    /* create slide object and 'html' elements */ 
    if(slide === null){

        slide = new Slide("derivativeIntro", 1);
        
        let figTxt = "<b>figur1:</b> En sekant (linje) skär grafen f(x) i punkterna ( x, f(x) ) och ( x+h, f(x+h). För små värden på h är sekantentens lutning, ∆y/h, ungefär lika med grafens derivata, f `(x) <br> f `(x) ≈ ∆y/h för små h";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        slide.inputs["xSlider"] = new SliderObj("dxIntroSliderX", [-5, 15], 2, "x=", slide.ctrlContainer, "viz_slider", 1000);
        slide.inputs["hSlider"] = new SliderObj("dxIntroSliderH", [0.1, 7], 2, "h=", slide.ctrlContainer, "viz_slider", 1000);

        let fxI = Array(fx.length).fill(null).map((x, i)=>{return i});
        let select = new SelectorObj("dxIntroFxSelect", fxTxt, fxI, slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[i] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){

        slide.init = true;

        let canvas = new CanvasObj("dxIntoCanvas", width, height, margin, Xrange, yRange, slide.svgDiv[0].id);
        let chart = new ChartObj("dxIntroChart", {}, canvas);
        let graph = new GraphObj("dxIntroGraph", fx[0], [-20, 20], {"draw": false}, canvas);
        let secant = new SecantObj("dxIntroSlope", fx[0], {"x0": 2, "h": 3}, canvas, graph);
        let slopeSup = new SecantSuportObj("dxIntroSlopeBase", secant, {}, canvas);
        let labels = new slopeLabels("dxIntroLabels", secant, {}, canvas);
        let LabelLines = new LabelAxisLineObj("dxIntroLabelL", secant.data, {}, canvas, secant.svgObj);
        let SecantMarker = new SecantMarkerObj("dxIntroSecMarker", secant, {}, canvas);

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


function dx_continued_slide(i, slide=null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide === null){

        slide = new Slide("derivateCtn", 2);
        
        let figTxt = "<b>figur2:</b> (Vänster) En sekant (linje) skär grafen f(x) i punkterna ( x, f(x) ) och ( x+h, f(x+h). För små värden på h är sekantentens lutning, ∆y/h, ungefär lika med grafens derivata, f `(x) <br> f `(x) ≈ ∆y/h för små h <br> (Höger) Arpoximerade derivatan av f(x), ∆y/h, jämfört med den faktiska derivatan, f `(x)";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        slide.inputs["xSlider"] = new SliderObj("dxIntroSliderX", [-5, 10], -2, "x=", slide.ctrlContainer, "viz_slider", 1000);
        slide.inputs["hSlider"] = new SliderObj("dxIntroSliderH", [0.1, 7], 2, "h=", slide.ctrlContainer, "viz_slider", 1000);

        let fxI = Array(fx.length).fill(null).map((x, i)=>{return i});
        let select = new SelectorObj("dxCtnFxSelect", fxTxt, fxI, slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[i] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){

        slide.init = true;

        let canvas1 = new CanvasObj("dxCtnCanvas1", width, height, margin, Xrange, yRange, slide.svgDiv[0].id);
        let chart1 = new ChartObj("dxCtnChart1", {}, canvas1);
        let graph1 = new GraphObj("dxCtnG1", fx[0], [-20, 20], {}, canvas1);
        let secant = new SecantObj("dxCtnSlope", fx[0], {"width": 1.5, "x0": 2, "h":2}, canvas1, graph1);
        let slopeSup = new SecantSuportObj("dxCtnSlopeBase", secant, {}, canvas1);
        let labels = new slopeLabels("dxCtnLabels", secant, {}, canvas1);
        let LabelLines = new LabelAxisLineObj("dxCtnLabelL", secant.data, {}, canvas1, secant.svgObj);
        let SecantMarker = new SecantMarkerObj("dxCtnSecantMarker", secant, {}, canvas1);

        let canvas2 = new CanvasObj("dxCtnCanvas2", width, height, margin, Xrange, yRange, slide.svgDiv[1].id);
        let chart2 = new ChartObj("dxCtnChart2", {}, canvas2);
        let graph2 = new GraphObj("dxCtnG2", fx[0], [-20, 20], {}, canvas2);
        let derivative = new DerivativeApxObj("dxCtnDx", fx[0], [-20, 20], {"color": "red", "h":2}, canvas2, graph2);
        let trueDx = new GraphObj("dxCtnTrueDx", Dx[0], [-20, 20], {"color": "red", "dashArray": "6, 6"}, canvas2);
        let legend = new LabelObj("dxCtnLegend", [[-1,10], [-1,9], [-1,8]], ["–––f(x)", "– –f `(x)", "–––∆y/h"], {"color":["black", "red", "red"]}, canvas2);

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


function tangent_slide(i, slide=null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide===null){

        slide = new Slide("tangentSlide", 1 );

        let figTxt = "<b>figur3:</b> En tangent (linje) till grafen f(x) i punkten ( x, f(x) ) ";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        slide.inputs["xSlider"] = new SliderObj("dxIntroSliderX", [-5, 10], -2, "x=", slide.ctrlContainer, "viz_slider", 1000);

        let fxI = Array(fx.length).fill(null).map((x, i)=>{return i});
        let select = new SelectorObj("tangentFxSelect", fxTxt, fxI, slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[i] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){
        slide.init = true;

        let canvas = new CanvasObj("tangentCanvas", width, height, margin, Xrange, yRange, slide.svgDiv[0].id);
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


function dx_color_slide(i, slide = null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide===null){

        slide = new Slide("dxColorSlide", 1 );

        let figTxt = "<b>figur4:</b> this is a figure";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        let fxI = Array(fx.length).fill(null).map((x, i)=>{return i});
        let select = new SelectorObj("dxClFxSelect", fxTxt, fxI, slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        let dxCheck = new CheckBoxObj("dxColorDxCheck", "f `(x)", 0, slide.ctrlContainer);
        slide.inputs["dxCheck"] = dxCheck;
        let dDxCheck = new CheckBoxObj("dDxColorDxCheck", "f ``(x)", 0, slide.ctrlContainer);
        slide.inputs["dDxCheck"] = dDxCheck;

        slides[i] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){
        slide.init = true;

        let canvas = new CanvasObj("dxColorCanvas", width, height, margin, Xrange, yRange, slide.svgDiv[0].id);
        let chart = new ChartObj("dxColorChart", {}, canvas);
        let dxColor = new DxColorObj("dxColorG", fx[0], [-20, 20], {"draw": true}, canvas);
        let dx = new DerivativeApxObj("dxColorDx", fx[0], [-20, 20], { "color": "black", "width": 0}, canvas, dxColor);
        let ddx = new DxApxDataObj("dxColorDdx", {"color": "black", "width": 0, "dashArray": "5, 5"}, canvas, dx);
        let legendTxt = ["–––f(x), f ``(x)>0", "–––f(x), f ``(x)<0", "–––f `(x)", "– –f ``(x)"];
        let legend = new LabelObj("dxColorLegend", [[-2,10],[-2,9],[-2,8],[-2,7]], ["–––f(x), f ``(x)<0", "–––f(x), f ``(x)>0"], {"color":["red", "blue", "black", "black"]},canvas);

        slide.inputs.fxSelect.addListener((val)=>{

            let update = new UpdateNode({"fx": fx[val]}, 1500);
            dxColor.update(update);

        });

        slide.inputs.dxCheck.addListener((val)=>{

            let legTxt = [...legend.params.text];
            if(val){
                dx.update( new UpdateNode({"width": 1.5}, 500) );
                legTxt.push(legendTxt[2]);
            } else{
                dx.update( new UpdateNode({"width": 0}, 500) );
                legTxt = legTxt.filter((txt)=>{return txt!==legendTxt[2]});
            }
            console.log(legTxt);
            legend.update(new UpdateNode({"text":legTxt}));

        });

        slide.inputs.dDxCheck.addListener((val)=>{

            let legTxt = [...legend.params.text];
            if(val){
                ddx.update( new UpdateNode({"width": 1.5}, 500) );
                legTxt.push(legendTxt[3]);
            } else{
                ddx.update( new UpdateNode({"width": 0}, 500) );
                legTxt = legTxt.filter((txt)=>{return txt!==legendTxt[3]});
            }
            legend.update(new UpdateNode({"text":legTxt}));

        });

    }

}


function multi_tangent_slide(i, slide = null){

    let div = document.getElementById("content");

    /* create slide object and 'html' elements */ 
    if(slide===null){

        slide = new Slide("tanChainSlide", 1 );

        let figTxt = "<b>figur5:</b> Multiple tangents to the graf f(x). <br> The tangent lines ilustarte where f `(x) > 0, f `(x) < 0 and f `(x) = 0";

        let txt = document.createElement("p");
        txt.innerHTML = figTxt;
        slide.txtContainer.appendChild(txt);

        let fxI = Array(fx.length).fill(null).map((x, i)=>{return i});
        let select = new SelectorObj("tanChainFxSelect", fxTxt, fxI, slide.ctrlContainer);
        slide.inputs["fxSelect"] = select;

        slides[i] = slide;

    }

    div.appendChild(slide.root);

    /* create SVG elements */ 
    if(!slide.init){
        slide.init = true;

        let tanX0 = [ [-1, 1.8, 3.5, 5.3, 7.5 ], [-1, 3, 7], [-0.5, 3, 6.5], [0, 1.55, 3.2, 4.72, 6.3] ];
        let tanLen = [[10, 3, 3, 3, 6 ], [9, 5, 9], [8, 4, 8], [9, 3, 9, 3, 9]];

        let canvas = new CanvasObj("tanChainCanvas", width, height, margin, Xrange, yRange, slide.svgDiv[0].id);
        let chart = new ChartObj("tanChainChart", {}, canvas);
        let graph = new GraphObj("tanChainG", fx[0], [-20, 20], {"draw": true}, canvas);
        let tanChain = new TangentChainObj("tanChain", fx[0], [-7, 7], {"x0": tanX0[0], "lenght": tanLen[0]}, canvas);

        slide.inputs.fxSelect.addListener((val)=>{

            let update = new UpdateNode({"fx": fx[val]}, 1500);
            graph.update(update);

            let tanUpdate = new UpdateNode({"fx": fx[val], "x0": tanX0[val], "lenght": tanLen[val]}, 1000);
            tanChain.update(tanUpdate);

        });

    }

}



set_header();
toggle_slide(0);

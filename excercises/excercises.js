
const margin = { top: 40, right: 10, bottom: 10, left: 30 },
width = 700;
height = 500;

var fx = [(x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4}, (x)=>{return x**2/4 - 3*x/2 + 5 }, (x)=>{ return x**3/12 - 3*x**2/4 + 9*x/4 + 1}, (x)=>{ return 4*Math.sin(x)+5}];
var Dx = [(x)=>{return x**2/4 - 1.8*x + 2.5}, (x)=>{return x/2 - 3/2}, (x)=>{return x**2/4 - 3*x/2 +9/4}, (x)=>{ return 4*Math.cos(x) }];
var fxTxt = ["f(x)= 1/12*x^3 - 0.9x^2 + 2.5x +4", "f(x)= 1/4*x^2 - 3/2*x^2 +5", "f(x)= 1/12*x^3 - 3/4*x^2 +9/4*x +1", "f(x)= 4*sin(x)+5"];
var Xrange = [-3, 10];
var yRange = [-5, 10];


class Excercise{

    constructor(id, root){

        this.questions = [];

        this.id = id;
        this.root = root;
        this.P = 0;
        this.R = 0;

        this.containterDiv = document.createElement("div");
        this.containterDiv.id = this.id;
        this.containterDiv.className = "excerise";
        root.appendChild(this.containterDiv);

        this.headerDiv = document.createElement("div");
        this.headerDiv.className = "contextDiv flooter";
        this.containterDiv.appendChild(this.headerDiv);

        this.vizDiv = document.createElement("div");
        this.vizDiv.className = "vizDiv";
        this.containterDiv.appendChild(this.vizDiv);

        this.svgDiv = document.createElement("div");
        this.svgDiv.className = "svgDiv";
        this.svgDiv.id = this.id+"svgDiv";
        this.vizDiv.appendChild(this.svgDiv);

        this.vizFooterDiv = document.createElement("div");
        this.vizFooterDiv.className = "contextDiv footer";
        this.containterDiv.appendChild(this.vizFooterDiv);
        
        this.figTxtDiv = document.createElement("div");
        this.figTxtDiv.className = "half";
        this.vizFooterDiv.appendChild(this.figTxtDiv);
        this.controlDiv = document.createElement("div");
        this.controlDiv.className = "half";
        this.vizFooterDiv.appendChild(this.controlDiv);

        this.quizDiv = document.createElement("div");
        this.quizDiv.className = "quizDiv";
        this.containterDiv.appendChild(this.quizDiv);

        this.textDiv = document.createElement("div");
        this.textDiv.className = "contextDiv header";
        this.quizDiv.appendChild(this.textDiv);

    }


    add_question(quiz){

        this.questions.push(quiz);
        this.P += quiz.P;
        quiz.assign_to_div(this.quizDiv);

    }


    check(){

        this.R = 0;

        for(let i=0; i<this.questions.length; i++){

            let q = this.questions[i];

            if(q.check()){
                this.R += q.R;
            }   else{
                return false;
            }

        }

        return true;

    }

}



class Question{

    constructor(id, text, N, P, parentDiv=null, className=""){

        this.id = id;
        this.N = N;
        this.P = P;
        this.answer = new Array(this.N).fill(null);

        this.passed = false;
        this.R = 0;

        this.containterDiv = document.createElement("div");
        this.containterDiv.id = this.id;
        this.containterDiv.className = "questionDiv " + className;

        this.textDiv = document.createElement("div");
        this.textDiv.className = "qTxtDiv half";
        this.text = document.createElement("p");
        this.text.innerHTML = text;
        this.textDiv.appendChild(this.text);

        this.answerDiv = document.createElement("div");
        this.answerDiv.className = "answerDiv half";

        this.containterDiv.appendChild(this.textDiv);
        this.containterDiv.appendChild(this.answerDiv);

        this.selector = null;

        this.listener = [];

        this.assign_to_div(parentDiv);

    }


    assign_to_div(div){

        if(div===null){
            return
        }

        div.appendChild(this.containterDiv);

    }
    

    check(){

        this.R = 0;

        if(this.answer.length < 1){
            return false;
        }

        for (let i=0; i<this.answer.length; i++){

            let ans = this.answer[i];

            if(ans === null){
                return false
            } else{
                this.R += ans.points;
            }

        }

        return true;
        
    }


    addListener(func){

        this.listener.push(func);

    }


    notify_listeners(){

        this.listener.forEach( (func)=>{
            func(this);
        });

    }


}


class QuestionSelectOne extends Question{

    constructor(id, text, N, P, opts, parentDiv=null, Optheader=["a)", "b)", "c)", "d)"]){

        super(id, text, N, P, parentDiv );

        this.options = opts;
        this.header = Optheader;

        this.set_selection();

    }


    update(opts=this.options, N=this.N, P=this.P, text=this.text.textContent, Optheader=this.header){

        this.options = opts;
        this.header = Optheader;

        this.N = N;
        this.P = P;
        this.answer = new Array(this.N).fill(null);
        
        this.text.innerHTML = text;

        while(this.answerDiv.lastChild ){
            this.answerDiv.removeChild(this.answerDiv.lastChild);
        }

        this.options.forEach(()=>{

        });

        this.set_selection();

    }



    set_selection(){

        let optL = this.options.length;

        for(let i=0; i<this.N; i++){

            let opt = this.options[i%optL];
            let optStr = [];
            opt.forEach((e,i)=>{ 
                let str = this.header[i%this.header.length] + e.label;
                optStr.push(str);
            });
            this.selector = new RadioBtnObj(this.id+"select", optStr, this.answerDiv);

            this.selector.addListener((obj)=>{

                this.answer[i] = opt[obj.selectedI];
                this.notify_listeners();

            });

        }

    }

}


class QuestionMenSelect extends Question{

    constructor(id, text, N, P, labels, opts, parentDiv=null){

        super(id, text, N, P, parentDiv);

        this.labels = labels;
        this.options = opts;

        this.set_selection();

    }


    update( labels=this.labels, N=this.N, P=this.P, opts=this.options, text=this.text.textContent ){

        this.labels = labels;
        this.options = opts;

        this.N = N;
        this.P = P;
        this.answer = new Array(this.N).fill(null);
        
        this.text.innerHTML = text;

        while(this.answerDiv.lastChild ){
            this.answerDiv.removeChild(this.answerDiv.lastChild);
        }


        this.set_selection();

    }



    set_selection(){

        let optL = Object.keys(this.options).length;
        let labelL = Object.keys(this.labels).length;

        for(let i=0; i<this.N; i++){

            let opt = this.options[i%optL];
            let label = this.labels[i%labelL];

            let optStr = [];
            let optI = [];
            opt.forEach((e, i)=>{optStr.push(e.label); optI.push(i)});

            this.selector = new SelectorObj(this.id+"select", optStr, optI, label, this.answerDiv);

            this.selector.addListener((obj)=>{

                let selectI = Number(obj.select.value);
                this.answer[i] = this.options[i%optL][selectI];
                this.check();
                this.on_select();

            });

        }

    }


    on_select(){

        this.notify_listeners();

    }


}


class QusetionMultiSelect extends Question{

    constructor(id, text, keys, parentDiv=null){

        super(id, text, keys, parentDiv);

    }

}



class Option{

    constructor(label, value, points){

        this.label = label;
        this.value = value;
        this.points = points;

    }

}


class Point{

    constructor(x, y, type=""){

        this.x = x;
        this.y = y;
        this.type = type;

        this.label = `(${this.x}, ${this.y})`;

    }

}


function get_options(labels, values, points){

    let opts = [];

    for(let i=0; i<labels.length; i++){
        opts.push( new Option(labels[i], values[i], points[i]));
    }

    return opts;

}


function get_xy_options(data, N=4){

    let optionsLst = [get_options([], [], [])];
    let L = [];

    data.forEach((d)=>{

        let labels = [];
        let points = new Array(d.length).fill(0);

        d.forEach((opt, i)=>{

            labels.push( xyLst_to_labelTxt(opt) ); 
            
            opt.forEach((xy)=>{

                if(xy.type === "min" || xy.type === "max" || xy.type === "teras"){
                    points[i] ++;
                }

            });

        });

        optionsLst.push(get_options(labels, d, points));

    });

    return optionsLst;

}


function xyLst_to_labelTxt(data, separator=" & "){

    let str = "";

    data.forEach( (d,i)=>{


        if(i>0){
            str += separator;
        }

        str += d.label;

    } );

    return str;

}


function get_minMax_opts(data){


    let refStr = ["-", "min", "max", "teras"];
    let refVal = [...refStr];
    refVal[0] = null;
    let options = [];

    data.forEach((d)=>{

        let points = new Array(refStr.length).fill(0);

        for(let i=1; i<refStr.length; i++){
            if(d.type === refStr[i]){
                points[i] = 1;
            }
        }

        options.push( get_options( refStr, refVal, points ) );

    });

    return(options);

}






let root = document.getElementById("root");
let header = document.getElementById("header");

let stpBtn = new ButtonStepObj("excersieStep", "Uppg: ", [1, 10], 1, 1);
stpBtn.assignToDiv(header);


let x = new Excercise("test1", root);

let introTxt = document.createElement("p");
let div = document.createElement("div");
div.appendChild(introTxt);
introTxt.innerHTML = "bellow is shown the tangent line to a hidden graph ..."
x.headerDiv.appendChild(div);

let canvas = new CanvasObj("Canvas1", width, height, margin, Xrange, yRange, x.svgDiv.id);
let chart = new ChartObj("chart1", {}, canvas);
let graph = new GraphObj("graph1", fx[0], Xrange, {"draw": true, "drawT":0}, canvas);
let tangent = new TangentObj("tangent1", fx[0], {"x0": 2, "length": 50, "color": "black"}, canvas, graph);
let marker = new SegmentMarkerFxObj("tangentMarker", tangent, {"color": "black"}, canvas);

let slider = new SliderObj("tanSlider", [-5, 10], 1, "x= ", x.controlDiv);
slider.addListener((val)=>{
    tangent.translate_center(val);
});


let figTxt = document.createElement("p");
figTxt.innerHTML = "<b>Figure 1:</b> Tangentent till en dold graf";
x.figTxtDiv.appendChild(figTxt);

let text = document.createElement("p");
text.innerHTML = "Genom att flytta runt tangetlinjen, svara på följande frågor om den gömda grafen"; 
x.textDiv.appendChild(text);


let q1opts = get_options(["-", "1", "2", "3", "4"], [0, 1, 2, 3, 4], [0, 0, 1, 0, 0]);
let q1 = new QuestionMenSelect("q1", "Hur mång extrempunkter har grafen?", 1, 1, ["N="], [q1opts]);
x.add_question(q1);


let points = [];
let p0_0 = new Point(0, 0);
let p1_2 = new Point(1, 2);
let p2_6 = new Point(2, 6, "max");
let p4_5 = new Point(4, 5);
let p5_4 = new Point(5, 4, "min");

let q2XY = [ 
    [[p0_0], [p2_6], [p1_2], [p4_5]], 
    [[p0_0, p4_5], [p1_2, p2_6], [p2_6, p5_4], [p0_0, p1_2] ],
    [[p0_0, p4_5, p1_2], [p1_2, p2_6, p2_6], [p2_6, p5_4, p4_5], [p0_0, p1_2, p4_5]], 
    [[p0_0, p4_5, p1_2, p2_6], [p1_2, p2_6, p2_6, p5_4], [p2_6, p5_4, p1_2, p4_5], [p0_0, p1_2, p1_2, p4_5]] 
];
let q2Opts = get_xy_options(q2XY);
let q2 = new QuestionSelectOne("q2", "Vilka är grafens extrempunkter, (x, y)?", 1, 2, [q2Opts[0]]);

x.add_question(q2);

q1.addListener((obj)=>{
    let val = obj.answer[0].value;
    q2.update([q2Opts[val]]);
});

let mmOptV = [null, "max", "min", "teras"];
let mmOptS = ["-", "max", "min", "teras"];

let q3Opts = [[]];
q3Opts.push([ get_options( mmOptS, mmOptV, [0, 1, 0, 0]) ] );
q3Opts.push([ get_options( mmOptS, mmOptV, [0, 0, 1, 0]) , get_options(mmOptS, mmOptV, [0, 0, 0, 0]) ] );
q3Opts.push( [  get_options( mmOptS, mmOptV, [0, 0, 1, 0]) , get_options(mmOptS, mmOptV, [0, 0, 1, 0]), get_options(mmOptS, mmOptV, [0, 0, 1, 0]) ]  );
q3Opts.push( [  get_options( mmOptS, mmOptV, [0, 0, 1, 0]) , get_options(mmOptS, mmOptV, [0, 0, 1, 0]), get_options(mmOptS, mmOptV, [0, 0, 1, 0]), get_options(mmOptS, mmOptV, [0, 0, 1, 0]) ]  );
let q3 = new QuestionMenSelect("q3", "För varje extrempunkt, ange om det är en maximum, minimum eller terasspunkt?", 0, 2, [], []);
x.add_question(q3);

q2.addListener((obj)=>{

    let opts = get_minMax_opts(obj.answer[0].value);
    let labels = [];
    obj.answer[0].value.forEach((d)=>{
        labels.push(xyLst_to_labelTxt([d]));
    });
    
    let nP = opts.length;
    q3.update(labels, nP, nP, opts);

});

q1.addListener(()=>{    
    q3.update([], 0, 0, []);
});

let q4Opts = get_options(["ax^2+bx+c", "ax^3+bx^2+cx+d"], ["ax^2+bx+c", "ax^3+bx^2+cx+d"], [0, 1]);
let q4 = new QuestionSelectOne("q4", "Vad är grafens funktion", 1, 1, [q4Opts]);
x.add_question(q4);

let testB = new ButtonObj("testB", "check", x.quizDiv);
let pointsP = document.createElement("P");
x.quizDiv.appendChild(pointsP);
testB.addListener(()=>{

    if(!x.check()){

        pointsP.innerHTML = "All frågor ej besvarade";
        return

    }

    let update = new UpdateNode({"drawT": 1}, 1000);
    graph.update(update);


    let key = [p2_6, p5_4];

    let markerData = [];
    let answerPts = [...q2.answer[0].value];
    let markerC = [];

    let labelData = [];
    let labelTxt = [];
    let labelC = [];

    answerPts.forEach((pt)=>{

        let d = [pt.x, pt.y];

        if(pt.type!==""){
            markerC.push("black");
            labelData.push(d);
            labelTxt.push(pt.type);
        } else{
            markerC.push("red");
        }

        markerData.push(d);

    });


    q3.answer.forEach((ans, i)=>{

        if(ans.value === answerPts[i].type){
            labelC.push("black");
        } else if(answerPts[i].type !== ""){
            labelC.push("red");
        }

    });


    key.forEach((k)=>{

        if(!answerPts.includes(k)){

            let d = [k.x, k.y];

            answerPts.push(k);
            markerC.push("blue");
            markerData.push(d);

            labelData.push(d);
            labelTxt.push(k.type);
            labelC.push("blue");

        }

    });

    let M = new MarkerObj("ansMarker", markerData, {"color": markerC}, canvas);
    let L = new LabelObj("answerLabel", labelData, labelTxt, {"color": labelC}, canvas);

    let fxL = new LabelObj("fxAnswerL", [[2, 10]], [q4.answer[0].value], {}, canvas);



    window.scrollTo(0, 0);

    pointsP.innerHTML = `${x.R}/${x.P} P`;

});







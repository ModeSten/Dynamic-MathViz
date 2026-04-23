
    /* SVG sizing parameters */
const margin = { top: 40, right: 10, bottom: 10, left: 30 };
const width = 800;
const height = 500;

var extremeDict = ["min", "max", "teras"] // String (labels) denoting extreme points

var excerciseFx = [ex1, ex2, ex3, ex4];
var ExcerciseN = excerciseFx.length;
var excercises = new Array(ExcerciseN).fill(null);



function ex1(rootName="content"){  // create / set excercise 1xw

    let root = document.getElementById(rootName);
    
    let fx = (x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4};

    let pt1_6 = new Point(1.9, 6.1, "max");   // graph max point
    let pt5_4 = new Point(5.3, 4.4, "min"); // graph min point
    let pt0_0 = new Point(0.0, 0.0, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt6_5 = new Point(6.3, 5.2, "");

    let data = [pt0_0, pt1_6, pt3_6, pt4_1, pt5_4, pt6_5];

    let fxLabels = ["(1/4)x^2  - 1.8x + 2.5", "(1/12)x^3 - 0.9x^2 + 2.5x + 4", "-x^2 + 3x + 2"];
    let fxOptions = get_options(fxLabels, fxLabels, [0, 1, 0]);

    return hidden_graph_tangent("Excercise1", root, 2, data, fx, fxOptions);

}


function ex2(rootName = "content"){

    let root = document.getElementById(rootName);
    
    let fx = (x)=>{return x**2/4 - 3*x/2 + 5 };

    let pt0_0 = new Point(0.0, 0.0, "");
    let pt1_6 = new Point(1.9, 6, "");
    let pt3_2 = new Point(3.0, 2.7, "min"); // graph min point
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt6_5 = new Point(6.3, 5.2, "");

    let data = [pt0_0, pt1_6, pt3_2, pt3_6, pt4_1, pt6_5];

    let fxLabels = ["(1/4)x^2  - 1.8x + 2.5 ", "-x^2 + 3x + 2", "(1/3)x^3  - 2.5x^2 + 6.25x"];
    let fxOptions = get_options(fxLabels, fxLabels, [1, 0, 0]);

    return hidden_graph_tangent("Excercise2", root, 1, data, fx, fxOptions);

}


function ex3(rootName="content"){

    let root = document.getElementById(rootName);

    let fx = (x)=>{return x**3/3 - 2.5*x**2 + 6.25*x};

    let pt0_0 = new Point(0.0, 0.0, "");
    let pt1_5 = new Point(1.7, 5.2, "");
    let pt2_5 = new Point(2.5, 5.2, "teras");   
    let pt3_2 = new Point(3.2, 2.7, ""); 
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");

    let data = [pt0_0, pt1_5, pt2_5, pt3_2, pt3_6, pt4_1];

    let fxLabels = ["x^2 - 5x +6.25", "-x^2 + 3x + 2", "(1/3)x^3  - 2.5x^2 + 6.25x"];
    let fxOptions = get_options(fxLabels, fxLabels, [0, 0, 1]);

    return hidden_graph_tangent("Excercise3", root, 1, data, fx, fxOptions);

}


function ex4(rootName="content"){

    let root = document.getElementById(rootName);

    let fx = (x)=>{return -1*x**2 + 3*x + 2};

    let pt0_0 = new Point(0.0, 0.0, "");
    let pt1_5 = new Point(1.5, 4.2, "max"); // graph teras point
    let pt3_2 = new Point(3.0, 2.7, ""); 
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt6_5 = new Point(6.3, 5.2, "");

    let data = [pt0_0, pt1_5, pt3_2, pt3_6, pt4_1, pt6_5];

    let fxLabels = ["x^2 - 5x +6.25", "-x^2 + 3x + 2", "(1/3)x^3  - 2.5x^2 + 6.25x"];
    let fxOptions = get_options(fxLabels, fxLabels, [0, 1, 0]);

    return hidden_graph_tangent("Excercise3", root, 1, data, fx, fxOptions);

}


function hidden_graph_tangent(id, rootDiv, extremeN, dataPts, fx, fxOptions){

    let xRange = [-3, 10];
    let yRange = [-5, 10];

    let excercise = new Excercise(id);

        /* excercise description texts */
    let headerTxt = " Figuren nedan visar tangenten, i en markad punkt (x, y), till en dold graf. Fundera på på vad tangenten kan avslöja om den dolda grafen.<br>Du kan flytta tangent längs grafen med hjälp av slidern nedan.";
    let figureTxt = " <b>Figur 1:</b> Tangenten, i en markad punkt (x, y), till en dold graf ";
    let quizTxt = "<b>Övning:</b> Utgå från tangentlinjen och svara på följande frågor om den dold grafen";

        /* Text Paragraphs */
    let headerP = new Paragraph(id+"HeaderP", headerTxt, excercise.headerDiv);  
    let FigureP = new Paragraph(id+"FigureP", figureTxt, excercise.figTxtDiv);
    let quizP = new Paragraph(id+"QuizP", quizTxt, excercise.qHeaderDiv);
    
        /* graph control (input) elements*/
    let tangentSlider = new SliderObj(id, xRange, 2, "x= ", excercise.controlDiv);
    excercise.inputs["tangentSlider"] = tangentSlider;

        /* Quesion 1: Number of extreme points*/
    let q1Txt = "<b>Q1:</b> Hur många extrempunkter har grafen?"
    let q1Points = new Array(4).fill(0);
    q1Points[extremeN-1] = 1;   // One point for correct number of extreme points
    let q1Opts = get_options([" 1", " 2", " 3"], [1, 2, 3], q1Points);
    let q1 = new QuestionSelectOne(id+"Q1", q1Txt, 1, 1, [q1Opts]);
    excercise.add_question(q1);

        /* Question 2: identifying extrem points*/
    let q2Txt = "<b>Q2:</b> Vilka är grafens extrempunkter?<br>Svar i formatetet (x, y) och värdena är rundade till en decimal<br>Välj samma antal punkter som svra ovan (Q1)";
    let q2Opts = get_xy_options(dataPts, 1);
    let q2 = new QusetionMultiSelect(id+"Q2", q2Txt, 1, 1, q2Opts);
    excercise.add_question(q2);

        /* Question 3: Type of extreme points */ 
    let q3Txt = "<b>Q3:</b> För varje extrempunkt, ange om det är en min, max eller teraspunkt<br>Välj först vilka extrempunkterna är (Q2)";
    let q3 = new QuestionMenSelect(id+"Q3", q3Txt, 0, 1, [], []);
    excercise.add_question(q3);

        /* Question 4: Graph function */
    let q4Txt = "<b>Q4:</b> Vilken är grafens function?";
    let q4Opts = get_options([" x2", " x3", " sin"], ["x2", "x3", "sin"], [0, 1, 0]);
    let q4 = new QuestionSelectOne(id+"q4", q4Txt, 1, 1, [fxOptions]);
    excercise.add_question(q4);

        /* Quiz Footer elements */
    let checkAnsBtn = new ButtonObj(id+"CheckAns", "kolla svar", excercise.qFooterDiv);
    let scoreP = new Paragraph(id+"ScoreP", "", excercise.qFooterDiv);
    excercise.quizDiv.appendChild(excercise.qFooterDiv);

        /* Question listners handling dependency between questions: updating subsequent questions based on answer */
    q1.addListener((q)=>{

        let N = q.answer[0].value;
        let options = get_xy_options(dataPts, N);
        q2.update(options, N);

        q3.update([], 0);

    });
    q2.addListener((q)=>{
            
            let allSelected = q.check(false);

            if(allSelected){

                let ansPoints = [];
                let labels = [];
                q.answer.forEach((ans)=>{ 
                    ansPoints.push(ans.value);  
                    labels.push(ans.value.label);
                });
                let options = get_minMax_opts(ansPoints, q.N);
                q3.update(labels, q.N, 1, options);

            } else{

                q3.update([], 0);

            }

        });


    rootDiv.appendChild(excercise.containerDiv);


        /* SVG elements */

    let canvas = new CanvasObj(id+"Canvas", width, height, margin, xRange, yRange, excercise.svgDiv.id);
    let chart = new ChartObj(id+"Chart",{}, canvas);
    let graph = new GraphObj(id+"Graph", fx, xRange, {"draw": true, "drawT": 0}, canvas);
    let tangent = new TangentObj(id+"Tangent", fx, {"x0": 2, "length": 100, "color": "black"}, canvas, graph);
    let tangentMarker = new SegmentMarkerObj(id+"TangMark", tangent, {"color": "black", "r": 5}, canvas);

    tangentSlider.addListener((val)=>{
        tangent.translate_center(val);
    });



        /* Check answers and reveal answer visual elements */
    checkAnsBtn.addListener(()=>{

        if(!excercise.check()){
            scoreP.P.innerHTML = "En eller flera frågor ej besvarade";
        } else{

            scoreP.P.innerHTML = `${excercise.R}/${excercise.P} P`;     // Display scored points out of total possible

            graph.update(new UpdateNode({"drawT": 1}, 1500));   // Reveal hidden graph

            let ansDataPts = [];
            q2.answer.forEach((ans)=>{ansDataPts.push(ans.value)});

            let missedExtPts = [];
            let ansExtPts = [];
            let ansErrPts = [];

            let missedLabels = [];
            let foundLabels = [];
            let foundLabelColor = [];
            let errLabels = [];

            let cords = [];
            let cordLabelTxt = [];

            dataPts.forEach((d)=>{

                if(extremeDict.includes(d.type) && !ansDataPts.includes(d)){
                    missedExtPts.push([d.x, d.y]);
                    missedLabels.push(d.type);
                    cordLabelTxt.push(d.label);
                    cords.push([d.x, d.y]);
                }

            });

            ansDataPts.forEach((d, i)=>{
                if(extremeDict.includes(d.type)){
                    ansExtPts.push([d.x, d.y]);
                    foundLabels.push(d.type);
                    if(d.type === q3.answer[i].value){
                        foundLabelColor.push("black");
                    } else{
                        foundLabelColor.push("red");
                    }
                } else{
                    ansErrPts.push([d.x, d.y]);
                    errLabels.push(d.label);
                }
                cordLabelTxt.push(d.label);
                cords.push([d.x, d.y]);
            });

                /* Mark answered points and missed extreme points */
            let missedM = new MarkerObj(id+"missedM", missedExtPts, {"color": ["blue"], "r": 4}, canvas);   // Mark missed extreme points
            let ansExtM = new MarkerObj(id+"foundM", ansExtPts, {"color": ["blaxk"], "r": 4}, canvas);      // Mark found extreme points
            let errM = new MarkerObj(id+"wrongAnsM", ansErrPts, {"color": ["red"], "r": 4}, canvas );       // Mark answered none extreme points (wrong answersx)

            let miseedL = new LabelObj(id+"missedL", missedExtPts, missedLabels, {"color": ["blue"], "dy": [15]}, canvas);
            let ansExtL = new LabelObj(id+"foundExtL", ansExtPts, foundLabels, {"color": foundLabelColor, "dy": [15] }, canvas);
            //let errL = new LabelObj(id+"wrongAnsL", ansErrPts, errLabels, {"color": ["red"], "dy": [15]}, canvas);
            let cordL = new LabelObj(id+"cordL", cords, cordLabelTxt, {"dy": [-10]}, canvas);

            let fxLabelColor = "black";
            let fxLabel = "";
            for(let i=0; i<fxOptions.length; i++){
                console.log(fxOptions[i]);
                if(fxOptions[i].points > 0){ 
                    fxLabel = fxOptions[i].label;
                    break;
                 }
            };
            if(q4.answer[0].points < 1){ fxLabelColor = "red"; };
            let fxL = new LabelObj(id+"fxLabel", [[0.5, 9]], ["f(x)= "+fxLabel], {"anchors": ["start"], "color": [fxLabelColor]}, canvas);

            window.scrollTo(0, 0);  // Scroll to window top to display visual elements

            

        }

    });


    return excercise;


}



function togle_excercises(i){

    let root = document.getElementById("content");

    while(root.lastChild){
        root.removeChild(root.lastChild);
    }

    if(excercises[i] === null){
        excercises[i] = excerciseFx[i]();
    } else{
        root.appendChild(excercises[i].containerDiv);
    }

}


togle_excercises(0);

let togleBtn = new ButtonStepObj("toggleExcercise", "", [1, excerciseFx.length], 1, 1);
togleBtn.assignToDiv(document.getElementById("header"));
togleBtn.addListener((val)=>{

    togle_excercises(val-1);

})



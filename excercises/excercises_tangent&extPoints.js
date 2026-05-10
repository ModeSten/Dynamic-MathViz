
    /* SVG sizing parameters */
const margin = { top: 40, right: 10, bottom: 10, left: 30 };    // SVG margin
const width = 800;  // SVG width
const height = 500; // SVG height

var extremeDict = ["min", "max", "teras"] // String (labels) denoting extreme points

var excerciseFx = [tangX3_2, tangX2_1, tangX3_1, tangX2_2]; // Excercises initlization functions
var ExcerciseN = excerciseFx.length;                        // Number of excercises
var excercises = new Array(ExcerciseN).fill(null);          // Excerices list; store excercises class instances

var headerElements = {};    // store header elements that needs referencing
var intro = null;           // store excercise intro (class object)



    // create questions for hidden graph excercises
function hiddenGraph_questions(exc, headerTxt, figureTxt, figureTxtAns, quizTxt, extremeN, dataPts, fxOptions){


        /* Text Paragraphs */
    let headerP = new Paragraph(exc.id+"HeaderP", headerTxt, exc.headerDiv);  
    exc.inputs["figureP"] = new Paragraph(exc.id+"FigureP", figureTxt, exc.figTxtDiv);
    let quizP = new Paragraph(exc.id+"QuizP", quizTxt, exc.qHeaderDiv);

        /* Quesion 1: Number of extreme points*/
    let q1Txt = "<b>Q1:</b> Hur många extrempunkter har grafen?"
    let q1Points = new Array(4).fill(0);    // initalize al option points to 0
    q1Points[extremeN-1] = 1;               // One point for correct number of extreme points
    let q1Opts = get_options([" 1", " 2", " 3"], [1, 2, 3], q1Points);
    let q1 = new QuestionSelectOne(exc.id+"Q1", q1Txt, 1, 1, [q1Opts]);
    exc.add_question(q1);

        /* Question 2: identifying extrem points*/
    let q2Txt = "<b>Q2:</b> Vilka är grafens extrempunkter?<br>Svar i formatetet (x, y) och värdena är rundade till en decimal<br>Välj samma antal punkter som svra ovan (Q1)";
    let q2Opts = get_xy_options(dataPts, extremeN);
    let q2 = new QusetionMultiSelect(exc.id+"Q2", q2Txt, 1, 1, q2Opts);
    exc.add_question(q2);

        /* Question 3: Type of extreme points */ 
    let q3Txt = "<b>Q3:</b> För varje extrempunkt, ange om det är en min, max eller teraspunkt<br>Välj först vilka extrempunkterna är (Q2)";
    let q3 = new QuestionMenSelect(exc.id+"Q3", q3Txt, 0, 1, [], []);
    exc.add_question(q3);

        /* Question 4: Graph function */
    let q4Txt = "<b>Q4:</b> Vilken är grafens function?";
    let q4Opts = get_options([" x2", " x3", " sin"], ["x2", "x3", "sin"], [0, 1, 0]);
    let q4 = new QuestionSelectOne(exc.id+"q4", q4Txt, 1, 1, [fxOptions]);
    exc.add_question(q4);

        /* Quiz Footer elements */
    exc.inputs["checkAns"] = new ButtonObj(exc.id+"CheckAns", "kolla svar", exc.qFooterDiv);
    exc.inputs["scoreP"] = new Paragraph(exc.id+"ScoreP", "", exc.qFooterDiv);
    exc.quizDiv.appendChild(exc.qFooterDiv);

        /* Question listners handling dependency between questions: updating subsequent questions based on answer */
    q1.addListener((q)=>{

        let N = q.answer[0].value;
        let options = get_xy_options(dataPts, extremeN);
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
                let options = get_minMax_opts(ansPoints, Math.max(extremeN, q.N));
                q3.update(labels, q.N, 1, options);

            } else{

                q3.update([], 0);

            }

        });

}

    // reveal answer (visuals coresponding to answer ) for hidden graph excercise
function hidde_graph_ansReveal(exc, dataPts, canvas, graph, fxOptions){

    if(!exc.check()){ // run answer check and see if all questions have been answered => true
        exc.inputs["scoreP"].P.innerHTML = "En eller flera frågor ej besvarade";
        return false;
    }

        exc.inputs["scoreP"].P.innerHTML = `${exc.R}/${exc.P} P`;     // Display scored points out of total possible

        graph.update(new UpdateNode({"drawT": 1}, 1500));   // Reveal hidden graph

        let ansDataPts = [];    // answered pints
        exc.questions[1].answer.forEach((ans)=>{ansDataPts.push(ans.value)}); // q2

        let missedExtPts = [];  // Position of missed (not in answer) extreme-points
        let ansExtPts = [];     // Position of found (in answer) extreme-points
        let ansErrPts = [];     // Position of None extreem points in answer

        let missedLabels = [];      // Type labels for missed extreme-Points
        let foundLabels = [];       // Type labels for found extreme-points
        let foundLabelColor = [];   // Colors for found found extrme-points type labels

        let cords = [];             // cordinates for points (in answer + missed extreme-points)
        let cordLabelTxt = [];      // labels showing points cordinate values (x,y)

        dataPts.forEach((d)=>{  // lope through al cordinate points (from function input parameter)

            if(extremeDict.includes(d.type) && !ansDataPts.includes(d)){    // Point is an extreme-point but not in the answer
                missedExtPts.push([d.x, d.y]);
                missedLabels.push(d.type);
                cordLabelTxt.push(d.label);
                cords.push([d.x, d.y]);
            }

        });

        ansDataPts.forEach((d, i)=>{                // lope through al points in answer

            if(extremeDict.includes(d.type)){       // point is an extreme-point
                ansExtPts.push([d.x, d.y]);
                foundLabels.push(d.type);
                if(d.type === exc.questions[2].answer[i].value){  // Point type (min, max or teras) corectly identified
                    foundLabelColor.push("black");
                } else{ 
                    foundLabelColor.push("red");
                }
            } else{     
                ansErrPts.push([d.x, d.y]);         // Answered points not part of correct answer (not extreme points)
            }
            cordLabelTxt.push(d.label);             // Answered points position labels
            cords.push([d.x, d.y]);                 // Answered points xy positions

        });

            /* Mark answered points and missed extreme points */
        let missedM = new MarkerObj(exc.id+"missedM", missedExtPts, {"color": ["blue"], "r": [4]}, canvas);   // Mark missed extreme points
        let ansExtM = new MarkerObj(exc.id+"foundM", ansExtPts, {"color": ["blaxk"], "r": [4]}, canvas);      // Mark found extreme points
        let errM = new MarkerObj(exc.id+"wrongAnsM", ansErrPts, {"color": ["red"], "r": [4]}, canvas );       // Mark answered none extreme points (wrong answersx)

        let miseedL = new LabelObj(exc.id+"missedL", missedExtPts, missedLabels, {"color": ["blue"], "dy": [15]}, canvas);          // label missed extreme-points (type)
        let ansExtL = new LabelObj(exc.id+"foundExtL", ansExtPts, foundLabels, {"color": foundLabelColor, "dy": [15] }, canvas);    // label found extreme points (type)
        let cordL = new LabelObj(exc.id+"cordL", cords, cordLabelTxt, {"dy": [-10]}, canvas);   // label cordinates for al points (answer + missed extreme-points)

            // create label for showing correct graph function
        let fxLabelColor = "black";     
        let fxLabel = "";
        for(let i=0; i<fxOptions.length; i++){
            if(fxOptions[i].points > 0){ 
                fxLabel = fxOptions[i].label;
                break;
                }
        };
        if(exc.questions[3].answer[0].points < 1){ fxLabelColor = "red"; };
        let fxL = new LabelObj(exc.id+"fxLabel", [[0.5, 9]], ["f(x)= "+fxLabel], {"anchors": ["start"], "color": [fxLabelColor]}, canvas);  // Label showing correct graph function 

            /* set answer legend */
        let legBack = new RectObj(exc.id+"legBackground", [[-3, 10]], {"height": [150], "width": [130]}, canvas, "txtBack");    // legend background
        let lablX = -2.75;  
        let lablY0 = 9.25;
        let labelPos = [[lablX, lablY0]];
        let labelTxt = ["facit: rätt svarat", "facit: missat svar", "facti: fel svarat", "extrempunkt", "missad ext-pkt", "ej ext-pkt"];
            let legCol = ["black", "blue", "red", "black", "blue", "red"];
        for(let i=1; i<labelTxt.length; i++){
            labelPos.push([lablX, labelPos[i-1][1]-0.6]);
        }
        let legLabel = new LabelObj(exc.id+"legLabel", labelPos, labelTxt, {"anchors": ["start"], "color": legCol}, canvas);

        legenMarkerX = lablX - 0.1;
        let legMrkPos = [];
        for(let i=3; i<labelTxt.length; i++){
            legMrkPos.push( [ legenMarkerX, labelPos[i][1]+0.1 ] );
        }
        let legenMarker = new MarkerObj(exc.id+"legMarker", legMrkPos, {"color": legCol, "r": [4]}, canvas);

        return true

}


    // create "tangent and hidden graph" excercise 
function hidden_graph_tangent(id, i, rootDiv, extremeN, dataPts, fx, fxOptions, xRange=[-3, 10], yRange=[-5, 10]){

    let exc = new Excercise(id);  

    let toIntroBtn = new ButtonObj("toIntroBtn", "Intro", exc.containerDiv, "exc_introBtn");  
    toIntroBtn.addListener(()=>{
            while(rootDiv.lastChild){
                rootDiv.removeChild(rootDiv.lastChild);
            }
            exc_intro();
            window.scrollTo(0, 0);
        }
    );

        // excercise description texts 
    let headerTxt = "Figuren nedan visar tangenten till en graf / kurva (ej utritad). Tangentlinjens lutningen är lika med grafens lutningen i en utmarkerad punkt (tangeringspunkten). Tangenten (tangeringspunkten) kan flyttas utmed grafen med hjälp a slidern under figuren. Utgå från tangenten och svara på frågorna om grafen";
    let figureTxt = " <b>Figur 1:</b> Tangenten till en dold graf i en punkt (x, y). 'Tangeringspunkten' (x, y) är markerad med en en svart circle och tangentens lutning (k) är utritad";
    let figureTxtAns = " <b>Figur 1:</b> Tangenten till en graf i en punkt (x, y). Punkten (x, y), i vilken tangent skär grafen är markerad med en circle och tangentens lutning (k) är utritad. Utmarkerat är punkterna angivna i Q2 + eventuella extrempunkter som inte angets i Q2";
    let quizTxt = `<b>Uppgift${i}:</b> Utgå från tangentlinjen och svara på följande frågor om den dold grafen`;

    hiddenGraph_questions(exc, headerTxt, figureTxt, figureTxtAns, quizTxt, extremeN, dataPts, fxOptions);  // create questions

           // graph control (input) elements
    let tangentSlider = new SliderObj(id, xRange, 2, "x= ", exc.controlDiv);
    exc.inputs["tangentSlider"] = tangentSlider;


    rootDiv.appendChild(exc.containerDiv);    // add excercise container to root div


        /* SVG elements */

    let canvas = new CanvasObj(id+"Canvas", width, height, margin, xRange, yRange, exc.svgDiv.id);
    let chart = new ChartObj(id+"Chart",{}, canvas);
    let graph = new GraphObj(id+"Graph", fx, xRange, {"draw": true, "drawT": 0}, canvas);
    let tangent = new TangentObj(id+"Tangent", fx, {"x0": 2, "length": 100, "color": "black"}, canvas, graph);
    let tangentMarker = new SegmentMarkerObj(id+"TangMark", tangent.svgObj, {"color": "black", "r": [5]}, canvas);
    let tangentL = new TangentLabel(id+"TangentM", tangent, {}, canvas);   
    let supLines = new LabelAxisLineObj(id+"valLines", tangentMarker.data, {}, canvas, tangentMarker.svgObj);

    tangentSlider.addListener((val)=>{  // slider controling tangent (sets tangent 'middpoint')
        tangent.translate_center(val);
    });

        /* Check answers and reveal answer visual elements */
    exc.inputs["checkAns"].addListener((obj)=>{

        if( hidde_graph_ansReveal(exc, dataPts, canvas, graph, fxOptions) ){

        if(i < excercises.length){
                exc.inputs["figureP"].P.innerHTML = figureTxtAns; // Update figure text
                obj.remove_all_listeners();
                obj.button.textContent = "nästa uppgift";
                obj.addListener(()=>{ window.scrollTo(0, 0); togle_excercises(i); headerElements["excTogle"].set_value(i+1)});
        } else{
            obj.remove_from_div();
        }

            window.scrollTo(0, 0);  // Scroll to window top to display visual elements

        }

    });


    return exc;


}


function hidden_graph_derivata(id, i, rootDiv, extremeN, dataPts, fx, fxOptions, xRange=[-3, 10], yRange=[-5, 10]){


    let exc = new Excercise(id);  

    let toIntroBtn = new ButtonObj("toIntroBtn", "Intro", exc.containerDiv, "exc_introBtn");  
    toIntroBtn.addListener(()=>{
            while(rootDiv.lastChild){
                rootDiv.removeChild(rootDiv.lastChild);
            }
            exc_intro();
            window.scrollTo(0, 0);
        }
    );

        // excercise description texts 
    let headerTxt = "Figuren nedan visar tangenten till en graf / kurva (ej utritad). Tangentlinjens lutningen är lika med grafens lutningen i en utmarkerad punkt (tangeringspunkten). Tangenten (tangeringspunkten) kan flyttas utmed grafen med hjälp a slidern under figuren. Utgå från tangenten och svara på frågorna om grafen";
    let figureTxt = " <b>Figur 1:</b> Tangenten till en dold graf i en punkt (x, y). 'Tangeringspunkten' (x, y) är markerad med en en svart circle och tangentens lutning (k) är utritad";
    let figureTxtAns = " <b>Figur 1:</b> Tangenten till en graf i en punkt (x, y). Punkten (x, y), i vilken tangent skär grafen är markerad med en circle och tangentens lutning (k) är utritad. Utmarkerat är punkterna angivna i Q2 + eventuella extrempunkter som inte angets i Q2";
    let quizTxt = `<b>Uppgift${i}:</b> Utgå från tangentlinjen och svara på följande frågor om den dold grafen`;

    hiddenGraph_questions(exc, headerTxt, figureTxt, figureTxtAns, quizTxt, extremeN, dataPts, fxOptions);  // create questions

    rootDiv.appendChild(exc.containerDiv);    // add excercise container to root div

        /* SVG elements */
    let canvas = new CanvasObj(id+"Canvas", width, height, margin, xRange, yRange, exc.svgDiv.id);
    let chart = new ChartObj(id+"Chart",{}, canvas);
    let graph = new GraphObj(id+"Graph", fx, xRange, {"draw": true, "drawT": 0}, canvas);
    let dx = new DerivativeApxObj(id+"dx", fx, Xrange, {}, canvas);
    let ddx= new DxApxDataObj(id+"ddx", null, Xrange, {}, canvas, dx);



        /* Check answers and reveal answer visual elements */
    exc.inputs["checkAns"].addListener((obj)=>{

        if( hidde_graph_ansReveal(exc, dataPts, canvas, graph, fxOptions) ){

            if(i < excercises.length){
                    exc.inputs["figureP"].P.innerHTML = figureTxtAns; // Update figure text
                    obj.remove_all_listeners();
                    obj.button.textContent = "nästa uppgift";
                    obj.addListener(()=>{ window.scrollTo(0, 0); togle_excercises(i); headerElements["excTogle"].set_value(i+1)});
            } else{
                obj.remove_from_div();
            }

            window.scrollTo(0, 0);  // Scroll to window top to display visual elements

        }

    });


    return exc;

}


function hidden_graph_tangentMulti( id, i, rootDiv, extremeN, dataPts, fx, fxOptions, xRange=[-3, 10], yRange=[-5, 10] ){




}


    /* Initialize excercise introduction */
function exc_intro(rootDiv){

    set_header(false);
    let root = document.getElementById("content");

    if(intro !== null){
        root.appendChild(intro.containerDiv);
        return
    }

    let pt1_6 = new Point(1.9, 6.1, "max");   // graph max point
    let pt5_4 = new Point(5.3, 4.4, "min"); // graph min point

    intro = new Excercise("intro");

    root.appendChild(intro.containerDiv);
    //intro.containerDiv.removeChild(intro.quizDiv);
    let toExcBtn = new ButtonObj("toExcBtn", "Övningar", intro.quizDiv, "exc_introBtn");
    toExcBtn.addListener(()=>{
        set_header();
        togle_excercises(0);
        window.scrollTo(0, 0);
    }
    );

    let header = new Paragraph("IntroHeader", "Introudktion till övning: Tangenter och Extrempunkter", intro.headerDiv);

    let fx = (x)=>{ return x**3/12 - 0.9*x**2 + 2.5*x + 4 };
    let xRange = [-3, 10];

    let canvas = new CanvasObj("introCanvas", width, height, margin, Xrange, [-5, 10], intro.svgDiv.id );
    let chart = new ChartObj("introChart", {}, canvas );
    let graph = new GraphObj("introGraph", fx, xRange, {}, canvas);
    let tangent = new TangentObj("introTangent", fx, {"x0": 0.5, "length":50}, canvas, graph);
    let tangentM = new SegmentMarkerObj("tangentM", tangent.svgObj, {"r":[5]}, canvas);
    let tangentL = new TangentLabel("introTangentL", tangent, {"decimal": 1}, canvas);

    let tanPosNeg = new TangentChainObj("tanPosNeg", fx, [-1, 9], {"x0": [0, 3.75, 7], "lenght":[5, 4, 4.75], "width": 0}, canvas, graph);
    let posNegL = new LabelObj("posNegM", [[0.25, 3.75], [3.5, 4.75], [7.25, 5.75]],[], {}, canvas );

    let extPos = [[1.9, 6.1], [5.3, 4.4]];

    let extM = new MarkerObj("extMarkers", extPos, {"r": [0], "color": ["black"]}, canvas );
    let extL = new LabelObj("extL", extPos, [], {"dy":[20]}, canvas );
    let cordL = new LabelObj("extCordL", [pt1_6.cord, pt5_4.cord], [], {"dy": [-10]}, canvas, "", 500);

    let introTxt = [
        "<b>1:</b> En tangent till en graf är en rätt linje varse lutning / riktningskoficient är lika med grafens lutning i en punkt (tangeringspunkten)",
        "<b>2:</b> Flyttar vi tangenten (tangeringspunkten) längs grafen så ser vi hur tangentens, pch där med grafens, lutning varierar för olika x värden",
        "<b>3:</b> Vi kan identifiera grafens extrempunkter genom att se i vilka punkter lutningen är lika med 0",
        "<b>4:</b> Vi kan se vilken vad en extrempunkt har för typ (min, max eller teras) genom att se vilket tecken (+ eller -) lutningen har innan och efter"
    ];

    let introP = new Paragraph("introP", introTxt[0], intro.figTxtDiv);

    let step0 = ()=>{

        tangent.update( new UpdateNode({"width": 2.5, "x0": 0.5}, 500));
        tangentM.update( new UpdateNode({"r": [5]}, 10));
        tangentL.assigne_to_canvas(canvas);
        tanPosNeg.update( new UpdateNode({"width": 0}, 10) );
        posNegL.update( new UpdateNode({"text": []}, 10) );
        extL.update( new UpdateNode({"text": []}, 10) );
        extM.update( new UpdateNode({"r": [0, 0]}, 10));
        cordL.update(new UpdateNode({"text": []}, 10))

    }


    let step1 = ()=>{

        let seq = [];
        seq.push( ()=>{ tangent.translate_center(3, ()=>{seqStep(1)}, 20) } );

        let seqStep = (i, timeout = 500)=>{
            setTimeout( seq[i], timeout );
        }
        seqStep(0, 250);

    }


    let step2 = ()=>{

        tangent.update( new UpdateNode({"width": 2.5}, 500));
        tangentM.update( new UpdateNode({"r": [4]}, 500));
        tangentL.assigne_to_canvas();

        tanPosNeg.update( new UpdateNode({"width": 0}, 500) );
        posNegL.update( new UpdateNode({"text": []}, 500) );
        extL.update( new UpdateNode({"text": []}, 500) );

        let seq = [];
        seq.push( (next)=>{ 
                        tangent.translate_center(1.81, ()=>{seqStep(next)}, 10, 0.01) 
                    } );
        seq.push( (next)=>{ 
                        extM.update( new UpdateNode( {"r":[4, 0]}, 10) ); 
                        cordL.update( new UpdateNode( {"text": [pt1_6.label]}, 100 )); 
                        tangent.translate_center(5.30, ()=>{seqStep(next)});
                    } );
        seq.push( (next)=>{ 
                        tangent.translate_center(5.34, ()=>{seqStep(next)}, 1, 0.01);
                    } );
        seq.push( (next)=>{ 
                        extM.update(new UpdateNode({"r":[4, 4]}, 10)); 
                        cordL.update(new UpdateNode({"text": [pt1_6.label, pt5_4.label]})) 
                    } );

        let seqStep = (i, timeout = 500)=>{
            setTimeout( ()=>{seq[i](i+1)}, timeout );
        }
        seqStep(0, 250);
        
    }


    let step3 = ()=>{

        tangent.update( new UpdateNode({"width": 0}, 500));
        tangentM.update( new UpdateNode({"r": [0]}, 500));
        tangentL.remove_from_canvas();

        tanPosNeg.update( new UpdateNode({"width": 2.5}, 500) );
        posNegL.update( new UpdateNode({"text": ["+", "––", "+"]}, 500) );
        extL.update( new UpdateNode({"text": ["max", "min"]}, 500) );
        
    }

    let stepS = [ step0, step1, step2, step3];

    let togleIntro = (i)=>{

        introP.P.innerHTML = introTxt[i];
        stepS[i]();

    }


    let auto_step_intro = ()=>{

        let T = [500, 3000, 5000];

        let tsum = 0;

        for(let i=1; i<T.length; i++){
            tsum+= T[i-1];
            T[i] += tsum;
        }

        for( let i=0; i<stepS.length; i++){

            setTimeout( 
                ()=>{ togleIntro(i);}, T[i]
            );
        
        }

    }

    /*
    let btn = new ButtonStepObj("introTogle", "", [1, stepS.length], 1, 1 );
    btn.addListener(
        (val)=>{
            togleIntro(val-1);
        }
    );
    exc.controlDiv.appendChild(btn.container);
    */

    let stateLbl = document.createElement("h3");

    let I = 0;
    let nextBtn = new ButtonObj("introNext", "next", intro.controlDiv);
    nextBtn.addListener((obj)=>{

        I++;
        if(I < stepS.length){
            togleIntro(I);
        } 
        if (I+1 >= stepS.length){
             obj.button.disabled = true;
        }

        stateLbl.innerHTML = `${I+1}/${stepS.length}`;

    });

    stateLbl.innerHTML = `${I+1}/${stepS.length}`;
    intro.controlDiv.appendChild(stateLbl);

    let resetBtn = new ButtonObj("introReset", "reset", intro.controlDiv);
    resetBtn.addListener((obj)=>{

        I = 0;
        togleIntro(I);
        nextBtn.button.disabled = false;
        stateLbl.innerHTML = `${I+1}/${stepS.length}`;

    });


    //auto_step_intro();

}


function togle_excercises(i){

    if(i >= excercises.lenght){
        return false
    }

    let root = document.getElementById("content");

    while(root.lastChild){
        root.removeChild(root.lastChild);
    }

    if(excercises[i] === null){
        excercises[i] = excerciseFx[i](i+1);
    } else{
        root.appendChild(excercises[i].containerDiv);
    }

    return true

}


function set_header(excercise=true){

    let header = document.getElementById("header");

    if( headerElements["stText"] === undefined ){
         headerElements["stText"] = new Paragraph("headerStTxt", "", header);
    }

    if( headerElements["excTogle"] === undefined){
        headerElements["excTogle"] = new ButtonStepObj("excTogleBtn", "", [1, excercises.length], 1, 1);
        headerElements["excTogle"].addListener( (val)=>{ togle_excercises(val-1) } );
    }

    if( headerElements["excBtn"] === undefined ){
         headerElements["excBtn"] = new ButtonObj("excBtnHeader", "Övningar");
         headerElements["excBtn"].addListener(()=>{ set_header(); togle_excercises(0); window.scrollTo(0, 0); });
    }

    if(excercise){
        
        headerElements["excBtn"].remove_from_div();
        headerElements["stText"].P.innerHTML = "Övning";
        headerElements["excTogle"].set_value(1);
        headerElements["excTogle"].assignToDiv(header);


    } else{

        headerElements["excTogle"].remove_from_div();
        headerElements["stText"].P.innerHTML = "intro";
        headerElements["excBtn"].assignToDiv(header);

    }


}


function tangX3_2(i, type="derivata", rootName="content"){  // create / set excercise 1xw

    let root = document.getElementById(rootName);           // Excercises root div
    
    let fx = (x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4};  // graph function

        /* answer option points */
    let pt1_6 = new Point(1.9, 6.1, "max");     // graph max point
    let pt1_4 = new Point(1.5, 4.2, "");
    let pt3_6 = new Point(3.8, 6.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt5_4 = new Point(5.3, 4.4, "min");     // graph min point
    let pt6_5 = new Point(6.3, 5.2, "");

    let data = [pt1_4, pt1_6, pt3_6, pt4_1, pt5_4, pt6_5];  // answer (options) corindate points 

    let fxLabels = ["(1/4)x^2  - 1.8x + 2.5", "(1/12)x^3 - 0.9x^2 + 2.5x + 4", "-x^2 + 3x + 2"];    // Function (options) labels 
    let fxOptions = get_options(fxLabels, fxLabels, [0, 1, 0]);                                     // Function options

    if(type === "derivata"){
        return hidden_graph_derivata("excX3_2", i, root, 2, data, fx, fxOptions);
    } else if(type === "multiTangent"){
        return hidden_graph_derivata("excX3_2", i, rootDiv, 2, data, fx, fxOptions)
    }

        return hidden_graph_tangent("excX3_2", i, root, 2, data, fx, fxOptions);

}


function tangX2_1(i, type="tangent", rootName = "content"){

    let root = document.getElementById(rootName);   
    
    let fx = (x)=>{return x**2/4 - 3*x/2 + 5 }; // graph function

        /* answer option points */
    let pt1_4 = new Point(1.5, 4.3, "");
    let pt1_6 = new Point(1.9, 6.1, "");
    let pt3_2 = new Point(3.0, 2.7, "min"); // graph min point
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt4_1 = new Point(4.4, 2.3, "");
    let pt6_5 = new Point(6.3, 5.2, "");

    let data = [pt1_4, pt1_6, pt3_2, pt3_6, pt4_1, pt6_5]; // answer (options) corindate points 

    let fxLabels = ["(1/4)x^2  - 1.8x + 2.5 ", "-x^2 + 3x + 2", "(1/3)x^3  - 2.5x^2 + 6.25x"];  // Function (options) labels 
    let fxOptions = get_options(fxLabels, fxLabels, [1, 0, 0]);                                 // Function options

    if(type === "derivata"){
        return hidden_graph_derivata("excX2_1", i, root, 1, data, fx, fxOptions);
    } else if(type === "multiTangent"){
        return hidden_graph_derivata("excX2_1", i, rootDiv, 1, data, fx, fxOptions)
    }

        return hidden_graph_tangent("excX2_1", i, root, 1, data, fx, fxOptions);

}


function tangX3_1(i, type="tangent", rootName="content"){

    let root = document.getElementById(rootName);

    let fx = (x)=>{return x**3/3 - 2.5*x**2 + 6.25*x};  // graph function

        /* answer option points */
    let pt1_4 = new Point(1.5, 4.8, "");
    let pt1_5 = new Point(1.7, 5.2, "");
    let pt2_5 = new Point(2.5, 5.2, "teras");   // graph extreme point
    let pt3_2 = new Point(3.6, 2.7, ""); 
    let pt3_6 = new Point(3.6, 5.8, "");
    let pt4_1 = new Point(4.4, 6.8, "");

    let data = [pt1_4, pt1_5, pt2_5, pt3_2, pt3_6, pt4_1]; // answer (options) corindate points 

    let fxLabels = ["x^2 - 5x +6.25", "-x^2 + 3x + 2", "(1/3)x^3  - 2.5x^2 + 6.25x"];    // Function (options) labels 
    let fxOptions = get_options(fxLabels, fxLabels, [0, 0, 1]);                          // Function options

    if(type === "derivata"){
        return hidden_graph_derivata("excX3_1", i, root, 1, data, fx, fxOptions);
    } else if(type === "multiTangent"){
        return hidden_graph_derivata("excX3_1", i, rootDiv, 1, data, fx, fxOptions)
    }

        return hidden_graph_tangent("excX3_1", i, root, 1, data, fx, fxOptions);

}


function tangX2_2(i, type="tangent", rootName="content"){

    let root = document.getElementById(rootName);

    let fx = (x)=>{return -1*x**2 + 3*x + 2};   // graph function

        /* answer option points */
    let pt1_1 = new Point(1.4, 1.2, "");
    let pt1_5 = new Point(1.5, 4.2, "max"); // graph teras point
    let pt3_2 = new Point(3.0, 2.7, ""); 
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt6_5 = new Point(6.3, 5.2, "");

    let data = [pt1_1, pt1_5, pt3_2, pt3_6, pt4_1, pt6_5];

    let fxLabels = ["x^2 - 5x +6.25", "-x^2 + 3x + 2", "(1/3)x^3  - 2.5x^2 + 6.25x"];   // Function (options) labels 
    let fxOptions = get_options(fxLabels, fxLabels, [0, 1, 0]);                         // Function options

    if(type === "derivata"){
        return hidden_graph_derivata("excX2_2", i, root, 1, data, fx, fxOptions);
    } else if(type === "multiTangent"){
        return hidden_graph_derivata("excX2_2", i, rootDiv, 1, data, fx, fxOptions)
    }

        return hidden_graph_tangent("excX2_2", i, root, 1, data, fx, fxOptions);
    

}


function derivataX2_1(i, rootName="content"){

}




exc_intro()


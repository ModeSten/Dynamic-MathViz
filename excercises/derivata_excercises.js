

const margin = { top: 40, right: 10, bottom: 10, left: 30 };
const width = 800;
const height = 500;


var ExcerciseN = 1
var excercises = new Array(ExcerciseN).fill(null);



function ex1(i, exc=null){  // create / set excercise 1xw

    let root = document.getElementById("content");

    /* cordinate points, used for answer optios */
    let pt1_6 = new Point(1.9, 6, "max");   // graph max point
    let pt5_4 = new Point(5.3, 4.4, "min"); // graph min point
    let pt0_0 = new Point(0, 0, "");
    let pt1_4 = new Point(1.9, 4.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt5_5 = new Point(5.3, 5.2, "");
    let pt1_5 = new Point(1.9, 5.2, "");


    if(exc === null){   // excercise not already created

        exc = new Excercise("quiz1");
        excercises[i]= exc;

        let headerTxt = " Figuren nedan visar tangenten, i en markad punkt (x, y), till en dold graf. Fundera på på vad tangenten kan avslöja om den dolda grafen.<br>Du kan flytta tangent längs grafen med hjälp av slidern nedan.";
        let hdP = new Paragraph("q1Intro", headerTxt, exc.headerDiv);

        let figTxt = "<b>Figur 1:</b> Tangenten, i en markad punkt (x, y), till en dold graf";
        let figP = new Paragraph("q1FigTxt", figTxt, exc.figTxtDiv);

        let tanSlider = new SliderObj("exc1TanSlider", [-3, 10], 2, "x= ", exc.controlDiv);
        exc.inputs["tanSlider"] = tanSlider;

        let quizTxt = "<b>Övning 1:</b> Utgå från tangentlinjen och svara på följande frågor om den dold grafen";
        let quizP = new Paragraph("q1descript", quizTxt, exc.qHeaderDiv);

        let q1opts = get_options([" 1", " 2", " 3"], [1, 2, 3], [0, 1, 0]);
        let q1 = new QuestionSelectOne("exc1Q1", "<b>Q1:</b> Hur många extrempunkter har grafen?", 1, 1, [q1opts]); // create question 1 (q1)
        exc.add_question(q1);

        // cordinate points (combinations) for q2 answer options
        let q2Pts = [   
            [],
            [[pt1_4],[pt5_4],[pt3_6],[pt1_6]],
            [[pt1_4, pt5_5],[pt1_6, pt5_4],[pt4_1, pt5_4],[pt1_5, pt3_6]],
            [[pt1_4, pt3_6, pt5_5],[pt1_6, pt4_1, pt5_4],[pt0_0, pt4_1, pt5_4],[pt1_5, pt3_6, pt5_5]],
        ];
        let q2Opts = get_xy_options(q2Pts, 2);

        //let q2 = new QuestionSelectOne("exc1Q2", "<b>Q2:</b> Vilka är grafens extrempunkter?<br> Svar i formatet (x, y)", 1, 1, [q2Opts[0]]);   // create question 2 (q2); initaly without answer inputs
        let q2 = new QusetionMultiSelect("exc1Q2", "<b>Q2:</b> Vilka är grafens extrempunkter?<br> Svar i formatet (x, y)", 2, 1, q2Opts[1]);
        exc.add_question(q2);

        let q3Txt = "<b>Q3:</b> För varje extrempunkt, ange om det är en maximum, minimum eller teras - punkt";
        let q3Opts = get_minMax_opts([pt1_6, pt1_5], 2);
        let q3 = new QuestionMenSelect("exc1Q3", q3Txt, 0, 1, [], q3Opts);  // create question 3 (q3); initaly without answer inputs
        exc.add_question(q3);
        
        let q4opts = get_options([" -3*x^2 - 2x + 3 ", " x^3/12 - 0.9*x^2 + 2.5*x + 4", " 6*Sin(x+0.5)"], [" x2", "x3", "sin"], [0, 1, 0]);
        let q4 = new QuestionSelectOne("exc1Q4", "<b>Q4:</b> Vad är grafens funktion?", 1, 1, [q4opts]);    // Create question 4 (q4)
        exc.add_question(q4);
        exc.quizDiv.appendChild(exc.qFooterDiv);

        exc.inputs["checkBtn"] = new ButtonObj("exc1CheckBtn", "check answers", exc.qFooterDiv);    // create and store button for checking answers
        exc.elements["scoreP"] = new Paragraph("scoreP", "", exc.qFooterDiv);


        q1.addListener((obj)=>{     // update q2 options based on the answer to q1 and reset q3
            
            let n = obj.answer[0].value;
            if(n===null){i=0}

            q2.update(q2.options, n);
            q3.update([], 0);

        });


        q2.addListener((obj)=>{     //  Update q3 based on the answer to q2

            if(q2.check()){

                let xyPts = [];
                obj.answer.forEach((ans)=>{
                    xyPts.push(ans.value[0]);
                });

                let opts = get_minMax_opts(xyPts, 2);
                let labels = [];
                xyPts.forEach((p)=>{
                    labels.push(p.label);
                });
                let nP = opts.length;   // number of answer inputs (= number of points in q2 answer)

                q3.update(labels, obj.N, 1, opts);

            } else{

                q3.update([], 0);

            }

        });

    }

    root.appendChild(exc.containterDiv);


    if(!exc.init){  // Svg elements have not been created

        exc.init = true;

        let fx = (x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4};  // graph function

        /* Visuals elements */
        let canvas = new CanvasObj("exc1Canvas", width, height, margin, [-3, 10], [-5, 10], exc.svgDiv.id);             // svg canvas
        let chart = new ChartObj("exc1Chart", {}, canvas);                                                              // Chart (x y axis and labels)
        let graph = new GraphObj("q1Graph", fx, canvas.params.xRange, {"draw": true, "drawT": 0}, canvas, "", 1000);    // Function graph
        let tangent = new TangentObj("q1Tangent", fx, {"color": "black", "length": 100}, canvas, graph);                // Tangent line
        let tangentM = new SegmentMarkerFxObj("q1TanM", tangent, {"color": "black", "r": 5}, canvas);                   // Tangent line center marker

        exc.inputs["tanSlider"].addListener((val)=>{
            tangent.translate_center(val);
        });

        exc.inputs.checkBtn.addListener(()=>{ 

            if(!exc.check()){
                exc.elements.scoreP.update_text("En eller flera frågor ej besvarade");
                return
            }

            exc.elements.scoreP.update_text(`${exc.R}/${exc.P} P`);     // Set to show earned score out of max potential 

            window.scrollTo(0, 0);      // Scroll to page to to see graph

            graph.update(new UpdateNode({"drawT":1}, 1500));    // Reveal graph

            let xyPts = [[pt1_6.x, pt1_6.y], [pt5_4.x, pt5_4.y]];   // cordinate points; initaly graph max and min point (right answer)
            let xyCols = ["blue", "blue"];                          // Point marker colors; blue => miseed right answer, red => incroect answer, black => right answer

            let ptLabels = ["max", "min"];                          // cordinate point labels
            let ptLabelCol = ["red", "red"];                        // cordinate label colors; blue => miseed right answer, red => incroect answer, black => right answer

            exc.questions[1].answer.forEach((ans,i)=>{

                let pt = ans.value[0];

                if(pt.type === ""){    // answered cordinate point is not an extreme point (incorct answer)

                   xyPts.push([pt.x, pt.y]);  // add incroect answer point
                   xyCols.push("red");          // add point color; red since point is not a right answer
                   ptLabels.push("");           


                } else if(pt === pt1_6){ // |can be simplified as loop|
                    
                    xyCols[0] = "black";    // change color from blue to black to indicate extreme point part of answer
                    if(exc.questions[2].answer[i].value === pt1_6.type){    // check if indentified as corect type
                        ptLabelCol[0] = "black";    
                    }

                } else if(pt === pt5_4){

                    xyCols[1] = "black"; // change color from blue to black to indicate extreme point part of answer
                    if(exc.questions[2].answer[i].value === pt5_4.type){ // check if indentied as corect type
                        ptLabelCol[1] = "black";
                    }


                }
                
            });


            let M = new MarkerObj("extrMarkers", xyPts, {"color": xyCols, "r":3}, canvas, null, "", 1000);  // create markers for showing answered (and coreect) cordinate points
            let L = new LabelObj("extrLabels", xyPts, ptLabels, {"color": ptLabelCol}, canvas, "", 1000 );  // Create labels showing cordinate point types

            //exc.questions.forEach((q)=>{console.log(q.answer)});
            //console.log(exc.questions[0].answer[0]);

        }); 

    }


}


function hidden_graph_tangent(id, rootDiv, extremeN, dataPts, fx){

    let xRange = [-3, 10];
    let yRange = [-5, 10];

    let excercise = new Excercise(id);

    /* excercise description texts */
    let headerTxt = " Figuren nedan visar tangenten, i en markad punkt (x, y), till en dold graf. Fundera på på vad tangenten kan avslöja om den dolda grafen.<br>Du kan flytta tangent längs grafen med hjälp av slidern nedan.";
    let figureTxt = " <b>Figur 1:</b> Tangenten, i en markad punkt (x, y), till en dold graf ";
    let quizTxt = "<b>Övning 1:</b> Utgå från tangentlinjen och svara på följande frågor om den dold grafen";

    /* Text Paragraphs */
    let headerP = new Paragraph(id+"HeaderP", headerTxt, excercise.headerDiv);  
    let FigureP = new Paragraph(id+"FigureP", figureTxt, excercise.figTxtDiv);
    let quizP = new Paragraph(id+"QuizP", quizTxt, excercise.qHeaderDiv);
    
    /* graph control (input) elements*/
    let tangentSlider = new SliderObj(id, Xrange, 2, "x= ", excercise.controlDiv);
    excercise.inputs["tangentSlider"] = tangentSlider;

    /* Quesion 1: Number of extreme points*/
    let q1Txt = "<b>Q1:</b> Hur många extrempunkter har grafen?"
    let q1Points = new Array(4).fill(0);
    q1Points[extremeN-1] = 1;   // One point for correct number of extreme points
    let q1Opts = get_options([" 1", " 2", " 3"], [1, 2, 3], q1Points);
    let q1 = new QuestionSelectOne(id+"Q1", q1Txt, 1, 1, [q1Opts]);
    excercise.add_question(q1);

    /* Question 2: identifying extrem points*/
    let q2Txt = "<b>Q2:</b> Vilka är grafens extrempunkter?<br>Svar i formatetet (x, y)<br>Välj samma antal punkter som svra ovan (Q1)";
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
    let q4 = new QuestionSelectOne(id+"q4", q4Txt, 1, 1, [q4Opts]);
    excercise.add_question(q4);


    /* Question listners handling dependency between questions: updating subsequent questions based on answer */
    q1.addListener((q)=>{

        let N = q.answer[0].value;
        let options = get_xy_options(dataPts, N);
        q2.update(options, N);

        q3.update([], 0);

    });
    q2.addListener((q)=>{
            
            let allSelected = q.check();

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


    rootDiv.appendChild(excercise.containterDiv);


        /* SVG elements */

    let canvas = new CanvasObj(id+"Canvas", width, height, margin, Xrange, yRange, excercise.svgDiv.id);
    let chart = new ChartObj(id+"Chart",{}, canvas);
    let graph = new GraphObj(id+"Graph", fx, Xrange, {"draw": true, "drawT": 0}, canvas);
    let tangent = new TangentObj(id+"Tangent", fx, {"x0": 2, "length": 100, "color": "black"}, canvas, graph);
    let tangentMarker = new SegmentMarkerObj(id+"TangMark", tangent, {"color": "black", "r": 5}, canvas);

    tangentSlider.addListener((val)=>{
        tangent.translate_center(val);
    });

}


    let pt1_6 = new Point(1.9, 6, "max");   // graph max point
    let pt5_4 = new Point(5.3, 4.4, "min"); // graph min point
    let pt0_0 = new Point(0, 0, "");
    let pt1_4 = new Point(1.9, 4.4, "");
    let pt4_1 = new Point(4.4, 1.9, "");
    let pt3_6 = new Point(3.2, 6.4, "");
    let pt5_5 = new Point(5.3, 5.2, "");
    let pt1_5 = new Point(1.9, 5.2, "");

    let data = [pt0_0, pt1_6, pt3_6, pt4_1, pt5_4];


//ex1(1);
hidden_graph_tangent("ex1", document.getElementById("content"), 2, data, (x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4});

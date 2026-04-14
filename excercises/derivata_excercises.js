

const margin = { top: 40, right: 10, bottom: 10, left: 30 };
const width = 800;
const height = 500;


var ExcerciseN = 1
var excercises = new Array(ExcerciseN).fill(null);



function ex1(i, exc=null){

    let root = document.getElementById("content");

    if(exc === null){

        exc = new Excercise("quiz1");
        excercises[i]= exc;

        let headerTxt = " Figuren nedan visar tangenten, i en markad punkt (x, y), till en dold graf. Fundera på på vad tangenten kan avslöja om den dolda grafen.<br>Du kan flytta tangent längs grafen med hjälp av slidern nedan.";
        let hdP = new Paragraph("q1Intro", headerTxt, exc.headerDiv);

        let figTxt = "<b>Figur 1:</b> Tangenten, i en markad punkt (x, y), till en dold graf";
        let figP = new Paragraph("q1FigTxt", figTxt, exc.figTxtDiv);

        let tanSlider = new SliderObj("exc1TanSlider", [-3, 10], 2, "x= ", exc.controlDiv);
        exc.inputs["tanSlider"] = tanSlider;

        let quizTxt = "<b>Övning 1:</b> Utgå från tangentlinjen och svara på följande frågor om den dold grafen";
        let quizP = new Paragraph("q1descript", quizTxt, exc.textDiv);

        let q1opts = get_options(["-", "1", "2", "3", "4"], [null, 1, 2, 3, 4], [0, 0, 1, 0, 0]);
        console.log(q1opts);
        let q1 = new QuestionMenSelect("exc1Q1", "<b>Q1:</b> Hur många extrempunkter har grafen?", 1, 1, [""], [q1opts]); 
        exc.add_question(q1);

        let pt1_6 = new Point(1.9, 6, "max");
        let pt5_4 = new Point(5.3, 4.4, "min");
        let pt0_0 = new Point(0, 0, "");
        let pt1_4 = new Point(1.9, 4.4, "");
        let pt4_1 = new Point(4.4, 1.9, "");
        let pt3_6 = new Point(3.2, 6.4, "");
        let pt5_5 = new Point(5.3, 5.2, "");
        let pt1_5 = new Point(1.9, 5.2, "");

        let q2Pts = [
            [[pt1_4],[pt5_4],[pt3_6],[pt1_6]],
            [[pt1_4, pt5_5],[pt1_6, pt5_4],[pt5_4, pt4_1],[pt1_5, pt3_6]],
        ];
        let q2Opts = get_xy_options(q2Pts);

        let q2 = new QuestionSelectOne("exc1Q2", "<b>Q2:</b> Vilka är grafens extrempunkter?<br>Svar i formatet (x, y)", 1, 2, [q2Opts[1]]);
        exc.add_question(q2);

        let q3 = new QuestionMenSelect("exc1Q3", "<b>Q3:</b> För varje extrempunkt, ange om det är en maximum, minimum eller teras - punkt", 0, 2, [], []);
        exc.add_question(q3);

        let q4opts = get_options(["-3*x^2 - 2x + 3 ", "x^3/12 - 0.9*x^2 + 2.5*x + 4", "6*Sin(x+0.5)"], ["x2", "x3", "sin"], [0, 1, 0]);
        let q4 = new QuestionSelectOne("exc1Q4", "<b>Q4:</b> Vad är grafens funktion?", 1, 1, [q4opts]);
        exc.add_question(q4);

    }

    root.appendChild(exc.containterDiv);


    if(!exc.init){

        exc.init = true;

        let fx = (x)=>{return x**3/12 - 0.9*x**2 + 2.5*x + 4};

        let canvas = new CanvasObj("exc1Canvas", width, height, margin, [-3, 10], [-5, 10], exc.svgDiv.id);
        let chart = new ChartObj("exc1Chart", {}, canvas);
        let graph = new GraphObj("q1Graph", fx, canvas.params.xRange, {"draw": true, "drawT": 0}, canvas, "", 1000);
        let tangent = new TangentObj("q1Tangent", fx, {"color": "black", "length": 30}, canvas, graph);
        let tangentM = new SegmentMarkerFxObj("q1TanM", tangent, {"color": "black", "r": 5}, canvas);

        
        exc.inputs["tanSlider"].addListener((val)=>{
            tangent.translate_center(val);
        });

    }


}




ex1(1);
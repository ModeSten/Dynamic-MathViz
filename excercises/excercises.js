

class Excercise{

    constructor(){

        this.questions = [];

    }


    check(){

    }

}



class Question{

    constructor(id, text, keys, parentDiv=null, className=""){

        this.id = id;
        this.N = Object.keys(keys).length;
        this.key = keys;
        this.answer = new Array(this.N).fill(null);

        this.passed = false;
        this.R = 0;

        this.containterDiv = document.createElement("div");
        this.containterDiv.id = this.id;
        this.containterDiv.className = "quiz" + " " + className;

        this.textDiv = document.createElement("div");
        this.text = document.createElement("p");
        this.text.innerHTML = text;
        this.textDiv.appendChild(this.text);

        this.answerDiv = document.createElement("div");

        this.containterDiv.appendChild(this.textDiv);
        this.containterDiv.appendChild(this.answerDiv);

        this.selector = null;

        this.assign_to_div(parentDiv);

    }


    assign_to_div(div){

        if(div===null){
            return
        }

        div.appendChild(this.containterDiv);

    }
    

    check(){

        this.R = this.N;

        this.answer.forEach((ans, i)=>{

            if(ans !== this.key[i]){
                this.R--;
            }

        });

        this.passed = this.R === this.N;
        return this.passed;

    }

}


class QuestionSelectOne extends Question{

    constructor(id, text, keys, opts, parentDiv=null, Optheader=["a)", "b)", "c)", "d)"]){

        super(id, text, keys, parentDiv );

        this.options = opts;
        this.header = Optheader;

        this.set_selection();

    }


    set_selection(){

        for(let i=0; i<this.N; i++){

            let optL = Object.keys(this.options).length;
            let opt = this.options[i%optL];
            this.selector = new RadioBtnObj(this.id+"select", opt, this.answerDiv);

            this.selector.addListener((obj)=>{

                this.answer[i] = opt[obj.selectedI];

            });

        }

    }

}


class QuestionMenSelect extends Question{

    constructor(id, text, keys, labels, opts, parentDiv=null){

        super(id, text, keys, parentDiv);

        this.labels = labels;
        this.options = opts;

        this.set_selection();

    }


    set_selection(){

        for(let i=0; i<this.N; i++){

            let optL = Object.keys(this.options).length;
            let opt = this.options[i%optL];
            let labelL = Object.keys(this.labels).length;
            let label = this.labels[i%labelL];
            this.selector = new SelectorObj(this.id+"select", opt, opt, label, this.answerDiv);

            this.selector.addListener((obj)=>{

                this.answer[i] = obj.select.value;

            });

        }

    }

}


let div = document.getElementById("content");
//let x = new QuestionSelectOne("q1", "this is a test question", ["ja", "nej"], [["ja", "nej", "kanske"]], div);
let x = new QuestionMenSelect("q1", "test question", ["ja", "ja", "kanske"], ["a)", "b)", "c)"],[["ja", "nej", "kanske"]], div);
let btn = new ButtonObj("checkbtn", "check answers", div);
btn.addListener(()=>{

   let p = x.check();
   console.log(x.R);


});
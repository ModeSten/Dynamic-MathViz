

class Excercise{

    constructor(){

        this.questions = [];

    }


    check(){

    }

}



class Question{


    constructor(text, key, opts, type = "single", condition=()=>{return 0} ){

        this.type = type;

        this.condition = condition;

        this.key = key;
        this.answer = new Array(opts.lenght).fill(null);
        this.options = opts;

        this.container = document.createElement("div");
        this.container.className = "quizContainer";

        this.textDiv = document.createElement("div");
        this.textElement = document.createElement("p");
        this.textElement.innerHTML = text;
        this.textDiv.appendChild(this.textElement);

        this.container.appendChild(this.textDiv);

        this.answerDiv = document.createElement("div");
        
        this.container.appendChild(this.answerDiv);

        this.set_options();

    }


    set_inputs(){


    }


    set_answer(i){

        this.answer = this.options

    }


    set_options(){


        while(this.answerDiv.lastChild){
            this.answerDiv.removeChild(this.answerDiv.lastChild);
        }

        if(this.type === "single"){

            this.options.forEach((opt, optI) => {
               
                let x = new RadioBtnObj(this.id+optI, opt, this.answerDiv);
                x.addListener( (obj)=>{
                    let i = obj.selectedI
                    this.answer[optI] = opt[i];
                } );

            });

        }


        else if(this.type === "men"){

            this.options.forEach((opt, optI) => {
                console.log(opt);
                let x = new SelectorObj(this.id+optI, opt, opt, this.answerDiv);
                x.addListener( (obj)=>{
                    console.log(obj);
                    this.answer[optI] = obj;
                } );

            });

        }

    }


    check(){

        let pass = true;

        this.answer.forEach( (ans, i)=>{

            if(ans !== this.key[i]){
                pass = false;
            }

        });

        console.log(pass);

    }


}


let div = document.getElementById("content");


let x = new Question("test question", ["ja", "na"], [["ja", "nej"], [ "yeah", "na"]], "single");
div.appendChild(x.container);

let btn = new ButtonObj("checkBtn", "check answer", div);
btn.addListener(()=>{

    x.check();

})

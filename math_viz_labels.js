
class slopeLabels extends ExstensionObj{

    constructor(id, slope, params={}, canvas=null){

        super(id);
        this.labelText = [];
        this.labelBaseTxt = ["f(x)", "f(x+h)", "h", "∆y"];
        this.labelTxt = [];
        this.params={
            "anchors": ["end", "start", "middle", "start"],
            "showVal": [true, true, true, true],
        };
        this.parse_params(params);

        this.set_parent(slope);

        this.get_data();

        this.svgObj = new LabelObj(this.id+"label", this.data, this.labelTxt, this.params, this.canvas );

        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];
        this.labelTxt = [...this.labelBaseTxt];

        if(this.parent === null){
            return
        }

        let y0 = this.parent.data[0][1];
        let y1 = this.parent.data[1][1];
        let dy = y1 - y0;
        let h = this.parent.params.h;

        let x0 = this.parent.data[0][0];
        let x1 =  this.parent.data[1][0];
        let xC = x0*0.5 + x1*0.5;
        let yC = y0*0.5 + y1*0.5;

        this.data.push([x0, 0]);
        this.data.push([x1, 0]);
        this.data.push([xC, y0]);
        this.data.push([x1, yC]);

        this.get_label_text();

    } 


    get_label_text(){

        let fx = this.parent.data[0][1];
        let fxh = this.parent.data[1][1];
        let dy = fxh - fx;
        let h = this.parent.params.h;

        let labelVal = [fx, fxh, h, dy];
        let l = this.labelTxt.length;
        let sl =this.params.showVal.length;
        for(let i=0; i<l; i++){
            if(this.params.showVal[i%sl]){
                this.labelTxt[i] += `=${labelVal[i].toFixed(1)}`;
            }
        }

    }


    resolve_update(node){

        this.get_data();
        node.params.text = [...this.labelTxt];

    }


    on_parent_update(duration){
        this.update(new UpdateNode({}, duration));
    }


}

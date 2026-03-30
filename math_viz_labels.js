
// class for creating lines between labels and value position: (x, 0) -> (x, y) -> (0, y)
class LabelAxisLineObj extends ExstensionObj{

    constructor(id, points, params={}, canvas=null, parent=null, duration=0, delay=0, classname=""){

        super(id, classname, duration, delay);

        this.params = {
            "points": points,           // data points
            "axisOfset": [0.2, 0.2],    // line lenght after crossing axis
            "width": 0.5                // line width
        };
        this.parse_params(params);
        this.get_data();

        this.svgObj = new LineObj(id+"Lines", this.data, this.params, null, this.classname, this.duration, this.delay);
        this.assigne_to_canvas(canvas);

        this.set_parent(parent);

    }


    get_data(){

        this.data = [];

        let l = this.params.points.length;
        let p = this.params.points;

        for(let i=1; i<l-1; i++){

            let px = p[i][0];
            let py = p[i][1];

            let x0 = 0;
            if(px < 0){
                 x0 += this.params.axisOfset[0];
            } else{
                x0 -= this.params.axisOfset[0];
            }
            let y0 = py;
            let x1 = px;
            let y1 = 0;
            if(py < 0){
                 y1 += this.params.axisOfset[1];
            } else{
                y1 -= this.params.axisOfset[1];
            }

            this.data.push([x0, y0]);
            this.data.push([x1, y0]);
            this.data.push([x1, y1]);
            this.data.push([x1, null]);

        }

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(obj, msg, duration){
    
        this.update( new UpdateNode({"points":this.parent.params.data}, duration));

    }


}


// class for creating labels for graph slope (secant)
class slopeLabels extends ExstensionObj{

    constructor(id, slope, params={}, canvas=null, classname="", duration=0, delay=0){

        classname += " slopeLabel";

        super(id, classname, duration, delay);
        this.labelText = [];
        this.baseLabelTxt = ["f(x)", "f(x+h)", "h", "∆y", "x", "x+h"];  // default text (without values) for labels
        this.labelTxt = [];
        this.baseAnchors = ["end", "end", "middle", "start", "middle", "middle"];
        this.params={
            "anchors": [...this.baseAnchors],
            "showVal": [false],             // specifie if label[i] should include data value
            "dx" : [ 0 ], // label xOffset
            "dy" : [ 0 ], // label yOffset
            "show": [true]                  // specifiy if label[i] should be shown or hidden
        };
        this.parse_params(params);

        this.set_parent(slope.svgObj);

        this.get_data();

        console.log(this.classname);

        this.svgObj = new LabelObj(this.id+"label", this.data, this.labelTxt, this.params, this.canvas, this.classname );

        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];
        this.labelTxt = [...this.baseLabelTxt];

        if(this.parent === null){
            return
        }

        let y0 = this.parent.data[1][1];
        let y1 = this.parent.data[2][1];
        let dy = y1 - y0;

        let x0 = this.parent.data[1][0];
        let x1 =  this.parent.data[2][0];
        let xC = x0*0.5 + x1*0.5;
        let yC = y0*0.5 + y1*0.5;

        let x1y = 0;
        if( (y0 < 0 && y1 > 0) || (y0 > 0 && y1 < 0)){
            x1y = y0;
        }

        let y1x = 0;
        if( (x0>0 && x1<0) || (x0<0 && x1>0)){
            y1x = x1;
        }

        this.data.push([y1x, y0]);
        this.data.push([0, y1]);
        this.data.push([xC, y0]);
        this.data.push([x1+0.25, yC]);
        this.data.push([x0, 0]);
        this.data.push([x1, x1y]);

        this.get_label_text();
        this.adjust_offset();

    } 


    get_label_text(){

        let x = this.parent.data[1][0];
        let xh = this.parent.data[2][0];
        let fx = this.parent.data[1][1];
        let fxh = this.parent.data[2][1];
        let dy = fxh - fx;
        let h = xh-x;

        let labelVal = [fx, fxh, h, dy, x, xh];
        let l = this.labelTxt.length;
        let sl =this.params.showVal.length;
        for(let i=0; i<l; i++){
            if(this.params.showVal[i%sl]){
                this.labelTxt[i] += `= ${labelVal[i].toFixed(1)}`;
            }
        }

    }



    adjust_offset(){

        let x = this.parent.data[1][0];
        let xh = this.parent.data[2][0];
        let fx = this.parent.data[1][1];
        let fxh = this.parent.data[2][1];
        let dy = fxh - fx;
        let h = this.parent.params.h;

        let ofsetAxisL = 0.5;
        let ofsetAxisR = 0.25;
        let ofsetAxisT = 1.5;
        let ofsetAxisB = 0.5;
        let ofsetLineB = 1;

        if(x >= 0){
            this.data[0][0] -= ofsetAxisL;
            this.params.anchors[0] = "end";
        } else{
            this.data[0][0] += ofsetAxisR;
            this.params.anchors[0] = "start";
        }

        if(xh >= 0){
            this.data[1][0] -= ofsetAxisL;
            this.params.anchors[1] = "end";
        }else{
            this.data[1][0] += ofsetAxisR;
            this.params.anchors[1] = "start";
        }

        if(fx >= 0){
            this.data[4][1] -= ofsetAxisT; 
        }else{
            this.data[4][1] += ofsetAxisB;
        }

        if(fxh >= 0){
            this.data[5][1] -= ofsetAxisT;
        } else{
            this.data[5][1] += ofsetAxisB;
        }

        if(dy >= 0){
            this.data[2][1] -= ofsetLineB;
        } else{
            this.data[2][1] += ofsetAxisB;
        }


    }


    resolve_update(node){

        this.get_data();
        node.params.text = [...this.labelTxt];

    }


    on_parent_update(obj, msg, duration){
        this.update(new UpdateNode({}, duration));
    }


}



class TangentLabel extends ExstensionObj{

    constructor(id, tangent, params={}, canvas=null, duration=0, delay=0, classname=""){

        super(id, classname, duration, delay);

        this.LabelTxt=[""];

        this.params={
            "anchors": ["middle"],
            "showVal": [true],      // specifie if label should include data value
            "dx" : [ 30 ],          // label xOffset
            "dy" : [ 20 ],          // label yOffset
            "show": [true]          // specifiy if label should be shown or hidden
        };
        this.parse_params(params);   
        
        this.set_parent(tangent.svgObj);

        this.get_data();

        this.svgObj = new LabelObj(this.id+"label", this.data, this.labelText, this.params, null);

        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data=[];

        if(this.parent === null){
            return;
        }

        let x0 = this.parent.data[0][0];
        let y0 = this.parent.data[0][1];
        let x1 = this.parent.data[1][0];
        let y1 = this.parent.data[1][1];

        let x = 0.5*x0 + 0.5*x1;
        let y = 0.5*y0 + 0.5*y1;

        this.data.push([x, y]);

        let k = 0.0;
        if( x0!==x1 ){
            k = (y1-y0) / (x1-x0);
        }

        this.labelText = [`k= ${k.toFixed(2)}`];


        let dx = this.params.dx[0];
        dx = Math.abs(dx);
        if(k<0){
            dx = -dx;
        }
        this.params.dx[0] = dx;

    }


    resolve_update(node){

        this.get_data();
        node.params.text = this.labelText;

    }


    on_parent_update(obj, msg, duration){

        this.update( new UpdateNode({}, duration));

    }


}
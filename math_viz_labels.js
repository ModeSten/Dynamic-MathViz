
class LabelAxisLineObj extends ExstensionObj{

    constructor(id, points, params={}, canvas=null, parent=null){

        super(id);

        this.params = {
            "points": points,
            "axisOfset": [0.2, 0.2],
            "width": 0.5
        };
        this.parse_params(params);
        this.get_data();

        this.svgObj = new LineObj(id+"Lines", this.data, this.params);
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



class slopeLabels extends ExstensionObj{

    constructor(id, slope, params={}, canvas=null){

        super(id);
        this.labelText = [];
        this.baseLabelTxt = ["f(x)", "f(x+h)", "h", "∆y", "x", "x+h"];
        this.labelTxt = [];
        this.params={
            "anchors": ["middle"],
            "showVal": [false],
            "dx" : [ 25, 35, 0, 25, 0, 0 ],
            "dy" : [ 0, 0, 20, 0, 20, 20 ],
            "show": [true]
        };
        this.parse_params(params);

        this.set_parent(slope.svgObj);

        this.get_data();

        this.svgObj = new LabelObj(this.id+"label", this.data, this.labelTxt, this.params, this.canvas );

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
        this.data.push([x1, yC]);
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

        let negateX = [false, false, false, false, false, false];
        let negateY = [false, false, false, false, false, false];

        if(x >= 0 ){
            negateX[0] = true;
        } 

        if(xh >= 0){
            negateX[1] = true;
        }

        if(fx < 0){
            negateY[4] = true;
        }

        if(fxh < 0){
            negateY[5] = true;
        }

        if(dy < 0){
            negateY[2] = true;
        }

        for(let i=0; i<this.data.length; i++){

            if( this.params.dx.length > i ){
                let dx = Math.abs(this.params.dx[i]);
                if(negateX[i]){
                    dx = -dx;
                }
                this.params.dx[i] = dx;
            }

            if( this.params.dy.length > i ){
                let dy = Math.abs(this.params.dy[i]);
                if(negateY[i]){
                    dy = -dy;
                }
                this.params.dy[i] = dy;
            }

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

    constructor(id, tangent, params={}, canvas=null){

        super(id);

        this.LabelTxt=[""];

        this.params={
            "anchors": ["middle"],
            "showVal": [true],
            "dx" : [ 30 ],
            "dy" : [ 20 ],
            "show": [true]
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
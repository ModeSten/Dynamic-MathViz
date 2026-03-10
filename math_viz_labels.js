
class PointAxisLines extends ExstensionObj{

    constructor(id, points, params={}, canvas=null, label=null){
        

        super(id);
        this.data = [];
        this.params = {
            "points": points,
            "width": 1,
            "axxisOffset": [0.2, 0.2]
        }
        this.parse_params(params);

        this.set_parent(label);

        this.get_data();

        this.svgObj = new LineObj(id+"Line", this.data, this.params);

        this.assigne_to_canvas(canvas);

    }

    get_data(){

        if(this.parent !== null){

            this.params.points = this.parent.data;

        }


        this.data = [];

        for( let i=0; i<this.params.points.length; i++ ){

            let x0 = 0
            let y0 = this.params.points[i][1];
            let x1 = this.params.points[i][0];
            let y1 = 0;

            if(this.params.points[i][0] > 0){ x0 -= this.params.axxisOffset[0] }
            else{ x0 += this.params.axxisOffset[0] }

            if( this.params.points[i][1] >  0){ y1 -= this.params.axxisOffset[1] }
            else{  y1 += this.params.axxisOffset[1] }

            this.data.push([x0, y0]);
            this.data.push([x1, y0]);
            this.data.push([x1, y1]);
            this.data.push([x1, null]);

        }

    }



    resolve_update(node){
        this.get_data();
    }
    


    on_parent_update(obj, msg, duration){
        this.update(new UpdateNode({}, duration));
    }


}


class slopeLabels extends ExstensionObj{

    constructor(id, slope, params={}, canvas=null){

        super(id);
        this.labelText = [];
        this.labelBaseTxt = ["f(x)", "f(x+h)", "h", "∆y", "x", "x+h"];
        this.labelTxt = [];
        this.params={
            "anchors": ["middle"],
            "showVal": [false],
            "dx" : [ -35, -35, 0, 20, 0, 0 ],
            "dy" : [ 0, 0, 20, 0, 25, 25 ]
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

        this.data.push([0, y0]);
        this.data.push([0, y1]);
        this.data.push([xC, y0]);
        this.data.push([x1, yC]);
        this.data.push([x0, 0]);
        this.data.push([x1, 0]);

        this.get_label_text();
        this.adjust_offset();

    } 


    get_label_text(){

        let x = this.parent.data[0][0];
        let xh = this.parent.data[1][0];
        let fx = this.parent.data[0][1];
        let fxh = this.parent.data[1][1];
        let dy = fxh - fx;
        let h = this.parent.params.h;

        let labelVal = [fx, fxh, h, dy, x, xh];
        let l = this.labelTxt.length;
        let sl =this.params.showVal.length;
        for(let i=0; i<l; i++){
            if(this.params.showVal[i%sl]){
                this.labelTxt[i] += `=${labelVal[i].toFixed(1)}`;
            }
        }

    }


    adjust_offset(){

        let x = this.parent.data[0][0];
        let xh = this.parent.data[1][0];
        let fx = this.parent.data[0][1];
        let fxh = this.parent.data[1][1];
        let dy = fxh - fx;
        let h = this.parent.params.h;

        let negateX = [false, false, false, false, false, false];
        let negateY = [false, false, false, false, false, false];

        if(x >= 0 ){
            negateX[0] = true;
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


    on_parent_update(duration){
        this.update(new UpdateNode({}, duration));
    }


}


class SpacedMarkerObj extends ExstensionObj{

    constructor(id, parent, params={}, canvas=null){

        super(id);

        this.params = {
            "color": "red",
            "r": 3.5,
            "space": 3
        };
        this.parse_params(params);

        this.data = [];

        this.set_parent(parent);
        this.get_data();

        this.svgObj = new MarkerObj(id, this.data, this.params);

        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        if( this.parent === null){
            return
        }

        this.data = [];
        let len = Object.keys(this.parent.data).length;
        let space = this.params.space;

        let d0 = this.parent.data[0];
        this.data.push(d0);

        let d1;
        let L = 0;
        for(let i=1; i<len; i++){
            
            d1 = this.parent.data[i];
            L += Math.sqrt( (d1[0]-d0[0])**2 + (d1[1]-d0[1])**2 );
            if(L >= space){ 
                this.data.push(d1);
                L=0;
            }
            d0 = d1;

        }

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(){

        this.get_data();

        if(this.svgObj !== null){
            this.svgObj.update(new UpdateNode({"data":this.data}));
        }

    }


}



class SegmentMarkerObj extends ExstensionObj{

constructor(id, parent, params={}, canvas=null){

        super(id);

        this.params = {
            "color": "red",
            "r": 3.5,
            "p": [0.5]
        };
        this.parse_params(params);

        this.data = [];

        this.set_parent(parent);
        this.get_data();

        this.svgObj = new MarkerObj(id, this.data, this.params);

        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        if(this.parent === null){
            return
        }

        let len = Object.keys(this.parent.data).length;

        let d0;
        let d1;
        let d;

        for(let i=0; i<len-1; i+=2){

            if(this.parent.data[i][1] == null){
                i++;
            }

            d0 = this.parent.data[i];
            d1 = this.parent.data[i+1];

            this.params.p.forEach((p, i)=>{
                    d = [ p*d1[0]+(1-p)*d0[0], p*d1[1]+(1-p)*d0[1] ];
                    this.data.push(d);
                }
            );

        }

    }


    resolve_update(){
        this.get_data();
    }

    on_parent_update(){
        this.get_data();
        this.svgObj.update(new UpdateNode({"data":this.data}));
    }

}


class SegmentMarkerFxObj extends ExstensionObj{

constructor(id, parent, params={}, canvas=null){

        super(id);

        this.params = {
            "color": "red",
            "r": 3.5,
            "p": [0.5],
        };
        this.parse_params(params);

        this.data = [];

        this.set_parent(parent);
        this.get_data();

        this.svgObj = new MarkerObj(this.id, this.data, this.params);
        this.assigne_to_canvas(canvas);

    }


    get_data(){

        this.data = [];

        if(this.parent === null){
            return
        }


        let len = Object.keys(this.parent.data).length;

        let x0;
        let x1;
        let x;
        let y;

        for(let i=0; i<len-1; i+=2){

            if(this.parent.data[i][1] == null){
                i++;
            }

            x0 = this.parent.data[i][0];
            x1 = this.parent.data[i+1][0];

            this.params.p.forEach (  (p, i)=>{
                x = p*x1 + (1-p)*x0;
                y = this.parent.params.fx(x);
                this.data.push([x, y]);
                }
            );
            

        }

    }


    resolve_update(){
        this.get_data();
    }


    on_parent_update(obj, msg){
        
        this.get_data();

        if(this.svgObj !== null){
            this.svgObj.update(new UpdateNode({"data":this.data}));
        }

    }


}
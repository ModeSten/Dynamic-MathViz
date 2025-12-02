function test_chart(){

    const margin = { top: 60, right: 60, bottom: 50, left: 60 },
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    canvas = new CanvasObj(width, height, margin, "viz_canvas", [-6,6], [-6,6], "viz1");
    chart = new ChartObj("chart1", {}, canvas);

    let btn = document.getElementById("testBtn");
    btn.onclick = ()=>{

        if(chart.canvas === null){
            chart.assigne_to_canvas(canvas);
        } else{
            console.log("remove");
            chart.remove_from_canvas();
        }

    }

}



function test_graph(){

    const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


    let fx = (x)=>{return 3*Math.sin(x)};

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-6, 6], [-6, 6], "viz1");
    chart = new ChartObj("chart1", {}, canvas);
    let graph1 = new GraphObj("graph1", fx, [-6, 6],{}, canvas);

    let btn = document.getElementById("testBtn");
    btn.onclick = ()=>{

        /*
        if(graph1.canvas === null){
            graph1.assigne_to_canvas(canvas);
        } else{
            console.log("remove");
            graph1.remove_from_canvas();
        }
            */

        let update = new UpdateNode({"color": "red", "duration": 1000, "width":5});
        update.next = new UpdateNode({"color": "green", "duration": 1000, "width":10});
        update.next.next = new UpdateNode({"color": "blue", "duration": 1500, "width":5});
        update.next.next.next = new UpdateNode({"color": "black", "duration": 1500, "width":2.5});
        graph1.update(update);


    }

}

function test_tangent(){

    const margin = { top: 60, right: 60, bottom: 60, left: 60 },
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let fx = (x)=>{return 3*Math.sin(x)};

    let canvas = new CanvasObj(width, height, margin, "canvas1", [-6, 6], [-6, 6], "viz1");
    let chart = new ChartObj("chart1", {}, canvas);
    let graph = new GraphObj("graph1", fx, [-6, 6], {}, canvas);
    let tangent = new TnagentObj("tangent", fx,{"center":2}, canvas);


    var slider = document.getElementById("xSlider");

    slider.oninput = function(){

    let val = this.value / 1000;
    let xVal = -6 * (1-val) + 6*val;
    tangent.translate_center(xVal);

    }


    let btn = document.getElementById("testBtn");
    btn.onclick = ()=>{

        /*
        if(tangent.canvas === null){
            tangent.assigne_to_canvas(canvas);
        } else{
            tangent.remove_from_canvas();
        }
        */

        let update = new UpdateNode({"color": "green", "duration": 1000, "width":5});
        update.next = new UpdateNode({"color": "blue", "duration": 1000, "width":10});
        update.next.next = new UpdateNode({"color": "red", "duration": 1500, "width":2.5});
        tangent.update(update);

    }

}


test_graph();
$( function() {
    $('input').checkboxradio();
    $('input').on("change", function(e){
        var target=$(e.target);
        changeSub(target[0].id);
    });
});

data = d3.csv("../data/group_by_country.csv", function(data){ 
        draw(data); changeSub("MATH");});

function draw(data){
    var width = 800,
        height = 600,
        margin = 50;
        
    var escs_scale = d3.scale.linear()
                       .domain([-2.5,1.5])
                       .range([0, width - 2 * margin]);
    
    var score_scale = d3.scale.pow().exponent(2)
                        .domain([0, d3.max(data, function(d){return d.MEANSCORE;})])
                        .range([height - 2 * margin, margin]);
    var size_scale = d3.scale.sqrt()
                       .domain([0, d3.max(data, function(d){return d.RSQURED;})])
                       .range([0, 16]);
    var coef_scale = d3.scale.linear()
                       .domain(d3.extent(data, function(d){return d.COEF;}))
                       .range(['navy', 'yellow']);
                       
    var x_axis = d3.svg.axis()
                 .scale(escs_scale)
                 .orient('bottom')
                 .ticks(7);
                 
    var y_axis = d3.svg.axis()
                 .scale(score_scale)
                 .tickValues([200, 250, 300, 350, 400, 450, 478, 500, 550, 600])
                 .orient('right');
    
    /*Add Tips for each circle*/
    var tip = d3.tip()
                .attr('class','tip')
                .offset([10,0])
                .html(function(d){ 
                         l1 = '<strong class="cnt">'+d.CNT+"</strong><br />";
                         l2 = "<strong>Mean Score: </strong><span>"+(+d.MEANSCORE).toFixed(2) +"</span><br />";
                         l3 = "<strong>Mean ESCS: </strong><span>"+(+d.MEANESCS).toFixed(2) +"</span><br />";
                         l4 = "<strong>Coef.: </strong><span>"+(+d.COEF).toFixed(2) +"</span><br />";
                         l5 = "<strong>R-Squared: </strong><span>"+(+d.RSQURED).toFixed(2) +"</span>";
                         return l1 + l2 + l3 + l4 + l5;})
                
    /*Build frame and axis*/
    svg = d3.select("#graph-area")
        .append('svg').attr('width', width).attr('height', height);
    svg.append('g')
          .attr('transform', mov(margin,height-margin))
          .call(x_axis)
          .attr('class','xaxis');
    svg.append('g')
          .attr('transform', mov(width-margin, margin))
          .call(y_axis)
          .attr('class','yaxis');
    /*Axis Titles*/
    svg.append("text").text("Mean").attr("x",width-margin).attr('y',margin).attr('class','axis-title');
    svg.append("text").text("Score").attr("x",width-margin).attr('y',margin+15).attr('class','axis-title');
    svg.append("text").text("Mean Economic Social Cultural Index (ESCS)")
                      .attr("x",margin+escs_scale(-1.5)).attr('y',height-10)
                      .attr('class','axis-title');
   
    /*Add Mean line*/
    mean_sc = d3.mean(data, function(d){return d.MEANSCORE;})
    mean_es = d3.mean(data, function(d){return d.MEANESCS;})
    svg.append('line')
       .attr('class','habline')
       .attr('stroke-dasharray','5')
       .attr('x1', margin+30).attr('y1', score_scale(mean_sc) + margin)
       .attr('x2', width-margin).attr('y2', score_scale(mean_sc) + margin)
       .attr('stroke', 'black');
    var h_average_line_text = svg.append("text").text("World")
                      .attr('y',score_scale(mean_sc)+margin).attr('x', margin).attr('class','axis-title')
                      .attr('fill', 'grey');
    h_average_line_text.append('tspan').text("Average Score").attr('x',margin).attr('dy', '1em');
    svg.append('line')
       .attr('class','vabline')
       .attr('stroke-dasharray','5')
       .attr('y1', margin).attr('x1', escs_scale(mean_es)+margin)
       .attr('y2', height-margin-30).attr('x2', escs_scale(mean_es)+margin)
       .attr('stroke', 'black');
    var v_average_line_text = svg.append('text').text("World")
                      .attr("x", escs_scale(mean_es)+margin).attr('y', height-margin-20).attr('class', 'axis-title')
                      .attr('fill', 'grey');
    v_average_line_text.append('tspan').text('Average ESCS').attr('dx', '-6em').attr('dy', '1em');

    /*Explanation for Areas*/
    svg.append("text").text("Disadvantage background, lower score")
                      .attr('x',margin+10).attr('y', height-margin-10).attr('class','axis-title');
    svg.append("text").text("Advantage background, lower score")
                      .attr('x',margin+escs_scale(0.3)).attr('y', height-margin-10).attr('class','axis-title');
    svg.append("text").text("Desadvantage background, higher score")
                      .attr('x',margin+10).attr('y', margin-10).attr('class','axis-title');
    svg.append("text").text("Advantage background, higher score")
                      .attr('x',margin+escs_scale(0.3)).attr('y', margin-10).attr('class','axis-title');
                      
    /*Draw circles*/   
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('subject', function(d){return d.SUBJECT;})
        .attr('country', function(d){return d.CNT;})
        .attr('coef', function(d){return d.COEF;})
        .attr('rsq', function(d){return d.RSQURED;})
        .attr('cx', function(d){ return escs_scale(d.MEANESCS) + margin;})
        .attr('cy', function(d){ return score_scale(d.MEANSCORE) + margin;})
        .attr('r', function(d){ return size_scale(d.RSQURED);})
        .attr('fill', function(d) { return coef_scale(d.COEF);})
        .call(tip)
        .on('mouseover',tip.show)
        .on('mouseout', tip.hide);
    svg.selectAll('circle')
        .sort(function(a,b){ return a.rsq > b.rsq;});
    
    /*Add Legends*/
    addLegend($("#graph-area>svg"), margin, 420);
    
    /*Add Slide Bars*/
    coef_extent = d3.extent(data, function(d){ return +d.COEF; });
    rsq_extent = d3.extent(data, function(d){ return +d.RSQURED; });
    $("#select-coef").slider({
        range: true,
        values: coef_extent,
        max: coef_extent[1] * 1.01,
        min: coef_extent[0] * 1.01,
        slide: function(event, ui){
            $("svg>circle[substatus=sub-show]").each(function(){
                var coef = +$(this).attr('coef');
                if(coef >= ui.values[0] && coef <= ui.values[1]){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            $("#select-rsq").slider({values: rsq_extent});
        }
    });
    
    $("#select-rsq").slider({
        range: true,
        max: rsq_extent[1] * 1.02,
        min: rsq_extent[0] * 1.02,
        step: 0.01,
        values: rsq_extent,
        slide: function(event, ui){
            $("svg>circle[substatus=sub-show]").each(function(){
                var rsq = +$(this).attr('rsq');
                if(rsq >= ui.values[0] && rsq <= ui.values[1]){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            $("#select-coef").slider({values: coef_extent});
        }
    }); 
   
};

/*Toggle Subjects*/
function changeSub(subject){
    $("svg>circle[subject!='"+subject+"']").hide().attr('substatus','sub-hide');
    $("svg>circle[subject='"+subject+"']").show().attr('substatus','sub-show');
};

function mov(x,y){
        var s1 = "translate(";
        var s2 = ",";
        var s3 = ")";
        return s1 + x + s2 + y + s3;
    };
    
function addLegend(svg, x, y){
    var legend = $("#legend").clone();
    svg.append(legend);
    legend.attr('transform', mov(x, y));
};

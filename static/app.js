
var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

function createChartTitle(chart,dx, dy, chart_svg){

    chart_svg.append('text')
        .attr('id', chart.id+'-title')
        .attr('class', 'chart-title')
        .attr('dx', dx / 2)
        .attr('dy', dy/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .style('cursor', 'pointer')
        .text(chart.title)
        .on('mouseover', function(d){
            var currentElement = d3.select(this);
            currentElement.transition()
            .duration(100)
            .style('opacity', '0.6');

        })
        .on('mouseout', function(d){
            var currentElement = d3.select(this);
            currentElement.transition()
            .duration(100)
            .style('opacity', '1');

        });


}



//chart settings
settings = {

    barchart: {
    id: 'barchart',
    chart_width: 800, 
    chart_height: 600,
    padding:  {bottom: 100, left: 20, top: 50},
    x_scale: d3.scaleBand(),
    y_scale: d3.scaleLinear(), 
    line: d3.line(),
    initial_line: null,
    xAxis: d3.axisBottom(),
    yAxis: d3.axisLeft(),
    title: 'Daily Spending vs Baseline: Discrete',
    bars: null,
    properLine: null
},

piechart: {
    id: 'piechart',
    p1: {
        id: 'piechart1',
        colors: d3.scaleOrdinal().range(d3.schemeDark2),

        pie_width: 300,
        pie_height: 400,
        get outer_radius(){return Math.floor(this.pie_width/ 2); },
        get inner_radius(){ return Math.floor(this.outer_radius / 1.3); },
        
        
        title: 'Food Type by: Value',
        pie: null,
        arc: null,
        properPie: null,
        arcs: null

        },
    p2: {
        colors: d3.scaleOrdinal().range(d3.schemeDark2),

        pie_width: 300,
        pie_height: 400,
        get outer_radius(){return Math.floor(this.pie_width/ 2); },
        get inner_radius(){ return Math.floor(this.outer_radius / 1.3); },
        
        
        title: 'TBD'

        }

    },
    heatmap: {

        id: 'heatmap',
        chart_width: 600,
        chart_height: 200,
        padding: {bottom: 50, left: 20, top: 50, right: 20},    
        x_scale: d3.scaleBand(),    
        colors: d3.scaleQuantize().range(d3.schemeBlues[5]),    
        xAxis: d3.axisBottom(),
        title: 'Total Spending Distribution: Weekdays',
        properBoxes: null,
        properLabeles: null

    },

    line: {
        
        id: 'linechart',
        chart_width: 600,
        chart_height: 200,
        padding: {bottom: 40, left: 20, top: 50, right: 20},
        x_scale: d3.scaleBand(),
        y_scale: d3.scaleLinear(),
        line: d3.line(),
        title: 'Accumulated Lunch Savings Over Time',
        properLine: null,
        properCirc: null


    }

}

//create chart areas

//barchart
var svg = d3.select( '#'+settings.barchart.id )
        .append( 'svg' )
        .attr( 'width', settings.barchart.chart_width )
        .attr( 'height', settings.barchart.chart_height );

    // Create Title
createChartTitle(settings.barchart,settings.barchart.chart_width, settings.barchart.padding.top, svg);


//piechart#1
var svg2 = d3.select('#'+settings.piechart.id)
    .append('svg')
    .attr('width', settings.piechart.p1.pie_width)
    .attr('height', settings.piechart.p1.pie_height);

    // Create Title
createChartTitle(settings.piechart.p1, settings.piechart.p1.pie_width, settings.piechart.p1.pie_height, svg2);

//piechart#2
var svg3 = d3.select('#'+settings.piechart.id)
    .append('svg')
    .attr('width', settings.piechart.p2.pie_width)
    .attr('height', settings.piechart.p2.pie_height);

    // Create Title
createChartTitle(settings.piechart.p2, settings.piechart.p2.pie_width, settings.piechart.p2.pie_height, svg3);

//heatmap
var svg4 = d3.select('#'+settings.heatmap.id)
    .append('svg')
    .attr('width', settings.heatmap.chart_width)
    .attr('height', settings.heatmap.chart_height);

    // Create Title
createChartTitle(settings.heatmap, settings.heatmap.chart_width, settings.heatmap.padding.top, svg4);

//linechart

var svg5 = d3.select('#'+settings.line.id)
.append('svg')
.attr('height', settings.line.chart_height)
.attr('width', settings.line.chart_width);

    // Create Title
createChartTitle(settings.line, settings.line.chart_width, settings.line.padding.top, svg5);


var parseDate = d3.timeParse('%Y-%m-%d');








//functions creating vizualizations

function createBarchart(data, isLine){

    

    data.forEach(function(d){
    
        d.lunch_d = parseDate(d.lunch_d);
      });
      console.log(data);

    //scales
    settings.barchart.x_scale
        .domain( data.map(function(d){ return d.lunch_d; }) )
        .rangeRound([ 0, settings.barchart.chart_width - settings.barchart.padding.left ])
        .paddingInner( 0.05 );

    settings.barchart.y_scale.domain([0, d3.max(data, function( d ){
        if (d.actual > d.baseline){
            return d.actual;
        }else{
            return d.baseline;
        }
    })])
    .range([settings.barchart.chart_height - settings.barchart.padding.top - settings.barchart.padding.bottom, 0]);
    
    //define axes
    settings.barchart.xAxis
        .scale(settings.barchart.x_scale)
        .tickFormat(d3.timeFormat("%b-%d"));

    settings.barchart.yAxis
        .scale(settings.barchart.y_scale);
    
   



    //create bars
    if (settings.barchart.bars == null) {
        settings.barchart.bars = svg.append('g')
        .attr('class', 'bars')
        .selectAll( 'rect' )
        .data( data )
        .enter()
        .append( 'rect' )
        .attr('class', function(d){
            return d.food_type;
        })
        .attr( 'x', function( d ){
            return settings.barchart.x_scale( d.lunch_d ) + settings.barchart.padding.left;
        })
        .attr('y', settings.barchart.chart_height - settings.barchart.padding.bottom)
    
        .attr( 'width', settings.barchart.x_scale.bandwidth() )
        .attr('height', 0)
    
        .attr( 'fill', '#3c97da')
        .attr('stroke', '#226789');
    
    } else {
        settings.barchart.bars.data(data)
    }



    settings.barchart.bars
        .on('mouseover', function(d){


            var currentElement = d3.select(this)
            console.log(currentElement.attr('x'));

            currentElement.transition()
                .duration(400)
                .style('fill-opacity', '0.5')

            //label
            var x = parseInt(currentElement.attr('x'))+parseInt((settings.barchart.x_scale.bandwidth() / 2));
            var y = parseInt(currentElement.attr('y')) - 20;
            console.log(x);
            console.log(y);
        
            
            //interaction with pie1
            var arc = d3.select('path.'+currentElement.attr('class'));

            arc
                .transition()
                .duration(400)
                .style('opacity', '0.5')
                .style('stroke-width', 0);



            var label1 = d3.select('.pielabel_2');
            label1
                .transition()
                .duration(200)
                .style('opacity', '0')
                .transition()
                .duration(200)
                .style('opacity', '0.6')
                .text(currentElement.attr('class'));


        })
        .on('mouseout', function(d){

            var currentElement = d3.select(this);

            currentElement.transition()
                .duration(400)
                .style('fill-opacity', '1');


            //interaction with pie1
            var arc = d3.select('path.'+currentElement.attr('class'));

            arc
                .transition()
                .duration(400)
                .style('opacity', '1')
                .style('stroke-width', 5);



            var label1 = d3.select('.pielabel_2');
            label1
                .transition()
                .duration(200)
                .style('opacity', '0')
                .transition()
                .duration(200)
                .style('opacity', '0.6')
                .text('');
        });


    settings.barchart.bars.transition('barchart-loads')
        .attr( 'height', function( d ){
            return settings.barchart.chart_height - settings.barchart.y_scale(d.actual) - settings.barchart.padding.bottom - settings.barchart.padding.top;
        })
        .attr( 'y', function(d ){
            return settings.barchart.y_scale(d.actual) + settings.barchart.padding.top;
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
        .ease(d3.easeSinInOut);

    //define line
    if (settings.barchart.initial_line == null){

        var initial_line = d3.line()
        .x(function(d){
            return settings.barchart.x_scale( d.lunch_d ) + (settings.barchart.padding.left + (settings.barchart.x_scale.bandwidth() / 2));
        })
        .y(function( d ){

            return settings.barchart.y_scale( 1 ) + settings.barchart.padding.top;
        });

    } else {

        settings.barchart.initial_line = settings.barchart.line;
    }


      settings.barchart.line
        .x(function( d ){

            return settings.barchart.x_scale( d.lunch_d ) + (settings.barchart.padding.left + (settings.barchart.x_scale.bandwidth() / 2));
        })
        .y(function( d ){

            return settings.barchart.y_scale( d.baseline ) + settings.barchart.padding.top;
        });
    //create line
    if (settings.barchart.properLine == null){

        settings.barchart.properLine = svg.append('g').attr('class', 'line')
            .append( 'path' )
            .datum(data)
            .attr( 'fill', 'none')
            .attr( 'stroke', '#d95f02' )
            .attr( 'stroke-width', 2 )
            .attr('stroke-dasharray', 5)
            .attr( 'd', initial_line )
            .style('opacity', 1);
        settings.barchart.properLine
            .transition()
            .duration(1000)
            .attr( 'd', settings.barchart.line );
    } else {
        
        settings.barchart.properLine
            .datum(data);
        settings.barchart.properLine
            .transition()
            .duration(1000)
            .attr('d',  settings.barchart.line);


    }
    
        // .style('opacity', 1);

        setTimeout(function(){

                    //create axes
            svg.append('g')
            .attr('class', 'xaxis')
            .attr('transform', 'translate('+settings.barchart.padding.left+', ' + (settings.barchart.chart_height - settings.barchart.padding.bottom)+')')
            .call(settings.barchart.xAxis)
            .selectAll('text')
                .attr("transform", "rotate(-90)" )
                .style("text-anchor", "end")
                .attr('fill', '#6b8193')
                .style('font', 'bold 11px sans-serif')
                .attr("dx", "-1%")
                .attr('dy', '-1%');

            svg.append('g')
                .attr('class', 'yaxis')
                .attr('transform', 'translate('+settings.barchart.padding.left+', ' +settings.barchart.padding.top+')')
                .call(settings.barchart.yAxis)
                .selectAll('text')
                    .attr('fill', '#6b8193')
                    .style('font', 'bold 11px sans-serif');

        }, 1000);

    


}

function createPieChart(data, unit){
    settings.piechart.p1.colors.domain(data, function (d){ return d.food_type; });
    settings.piechart.p1.pie = d3.pie().value(function(d){ return d.vsum; });
    settings.piechart.p1.arc = d3.arc().innerRadius(settings.piechart.p1.inner_radius).outerRadius(settings.piechart.p1.outer_radius);
   
    //create lables
    svg2.append('text')
        .attr('class', 'pielabel_1')
        .attr('dx', settings.piechart.p1.pie_width / 2)
        .attr('dy', Math.floor(settings.piechart.p1.pie_height / 1.6))
        .style('font', 'bold 20px sans-serif')
        .attr('text-anchor', 'middle')
        .attr('fill', '#3c97da')
        .text('');

    svg2.append('text')
        .attr('class', 'pielabel_2')
        .attr('dx', settings.piechart.p1.pie_width / 2)
        .attr('dy', Math.floor(settings.piechart.p1.pie_height / 2.5))
        .style('font', 'bold 20px sans-serif')
        .attr('text-anchor', 'middle')

    .attr('fill', '#3c97da')
    .text('');


        

    //draw the pie


    if (settings.piechart.p1.properPie == null){

        //define arcs         
        settings.piechart.p1.arcs = svg2.selectAll('g.arc')

            .append('g')
            .attr('class', 'arc')
            ;

        settings.piechart.p1.properPie = settings.piechart.p1.arcs
        .data(settings.piechart.p1.pie(data))
        .enter()
        .append('path')
        .attr('transform', 'translate(' + settings.piechart.p1.pie_width/ 2 + ', ' + settings.piechart.p1.pie_height / 2 + ')')
        .attr('id', function(d){

            return d.data.vsum;
            
        })
        .attr('class', function(d){
            return d.data.food_type;
        })
        .attr('fill', function (d) {

            return settings.piechart.p1.colors(d.data.food_type);
        })
        .style('stroke', '#0a2234')
        .style('stroke-width', '5')
        .style('opacity', 1)
        //.attr('d', settings.piechart.p1.arc)
        .style('cursor', 'pointer')
        .each(function() { this._current = {startAngle: 0, endAngle: 0}; });
    } else {
        
        settings.piechart.p1.properPie.data(settings.piechart.p1.pie(data));
    }

    settings.piechart.p1.properPie
        .on('mouseover', function(d){

            var currentElement = d3.select(this);
            console.log(currentElement.attr('id'));
            console.log(this);
            currentElement.transition()
                .duration(400)
                .style('fill-opacity', '0.5')
                .style('stroke-width', 0);
            var label1 = d3.select('.pielabel_2');
                label1
                .transition()
                .duration(200)
                .style('opacity', '0')
                .transition()
                .duration(200)
                .style('opacity', '0.6')
                .text(currentElement.attr('class'));
            var label2 = d3.select('.pielabel_1');
            label2
                .transition()
                .duration(200)
                .style('opacity', '0')
                .transition()
                .duration(200)
                .style('opacity', '0.6')
                .text(currentElement.attr('id')+unit);

            // barchart interaction

            var bars = d3.selectAll('rect.'+currentElement.attr('class'));
            bars
                .transition()
                .duration(400)
                .style('opacity', 0.6);


        })
        .on('mouseout', function(d){

            var currentElement = d3.select(this);

            currentElement.transition()
                .duration(450)
                .style('fill-opacity', '1')
                .style('stroke-width', 5);
            var label1 = d3.select('.pielabel_2');
            label1
                .transition()
                .duration(200)
                .style('opacity', '0.6')
                .transition()
                .duration(200)
                .style('opacity', '0')
                .text('');
            var label2 = d3.select('.pielabel_1');
            label2
                .transition()
                .duration(200)
                .style('opacity', '0.6')
                .transition()
                .duration(200)
                .style('opacity', '0')
                .text('');

            // barchart interaction

            var bars = d3.selectAll('rect.'+currentElement.attr('class'));
            console.log(bars);
            bars
                .transition()
                .duration(400)
                .style('opacity', 1);
        });

        settings.piechart.p1.properPie.transition('piechart-loads')
            .duration(1000)
            .attrTween('d', function(d){
                var interpolate = d3.interpolate(this._current, d);
                console.log(this._current, d);
                this._current = interpolate(0);
                return function(t) {

                  return settings.piechart.p1.arc(interpolate(t));
                };
            });
        // settings.piechart.p1.properPie.transition('piechart-loads')
        // .duration(1000)
        // .style('opacity', 1);

}

function createHeatMap(data){

    data.forEach(function(d){
        var wd = {
            'Monday': 1, 
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5
        };
        d.wnum = wd[d.weekday];
    });
    data.sort(function(a, b){
        return a.wnum - b.wnum;
    });

    settings.heatmap.x_scale
        .domain( data.map(function(d){ return d.weekday; }) )
        .rangeRound([ 0, settings.heatmap.chart_width - settings.heatmap.padding.left - settings.heatmap.padding.right ]);

    settings.heatmap.colors        
        .domain([d3.min(data, function(d){ return d.vsum; }), d3.max(data, function(d){ return d.vsum; }) ])
        .range(d3.schemeBlues[5]);

    settings.heatmap.xAxis.scale(settings.heatmap.x_scale);

    svg4.append('g').attr('id', 'xaxis')
        .attr('transform', 'translate('+settings.heatmap.padding.left+', ' + (settings.heatmap.chart_height - settings.heatmap.padding.bottom)+')')
        .call(settings.heatmap.xAxis)
        .selectAll('text')
        .style("text-anchor", "center")
        .attr('fill', '#6b8193')
        .style('font', 'bold 15px sans-serif')
        .attr('dy', '3%');

    settings.heatmap.properBoxes = svg4.append('g').attr('class', 'heatboxes')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', settings.heatmap.padding.left)
    .attr( 'y', settings.heatmap.padding.top)
    .attr('height', settings.heatmap.chart_height - settings.heatmap.padding.bottom - settings.heatmap.padding.top)
    .attr('width', settings.heatmap.x_scale.bandwidth())
    .attr('fill', function(d){

        return settings.heatmap.colors(d.vsum);
    })
    .style('stroke', '#0a2234')
    .style('stroke-width', '3')
    .on('mouseover', function(d){
        var currentElement = d3.select(this);
        currentElement
            .transition()
            .duration(450)
            .style('opacity', '0.7');

    })
    .on('mouseout', function(d){
        var currentElement = d3.select(this);
        currentElement
            .transition()
            .duration(450)
            .style('opacity', '1');
    });
    settings.heatmap.properBoxes.transition('heatmap-loads')
        .duration(1000)
        .attr( 'x', function( d ){
            return settings.heatmap.x_scale( d.weekday ) + settings.heatmap.padding.left;
        });


    //labels
    settings.heatmap.properLables = svg4.append('g').attr('id', 'heatlabels')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('dy', settings.heatmap.chart_height / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#0a2234')
    .style('fill-opacity', '0.7')
    .style('font', 'bold 17px sans-serif')
    .text(function(d){

        return Math.floor(d.vsum) +' PLN';
    });
    settings.heatmap.properLables.transition('heatlables-loads')
        .duration(1000)
        .attr('dx', function(d){
            return settings.heatmap.x_scale(d.weekday) + settings.heatmap.padding.left + (settings.heatmap.x_scale.bandwidth() / 2);
        });

}

function createLineChart(data){

    data.forEach(function(d){
            
        d.lunch_d = parseDate(d.lunch_d);
      });

    settings.line.x_scale
    .domain( data.map(function(d){ return d.lunch_d; }) )
    .rangeRound([ 0, settings.line.chart_width - settings.line.padding.left - settings.line.padding.right ]);

    settings.line.y_scale
    .domain([0, d3.max(data, function(d){
        return d.inc_savings;
    })])
    .range([settings.line.chart_height - settings.line.padding.top - settings.line.padding.bottom, 0])


    //define lines

    settings.line.line
        .x(function( d ){
            return settings.line.x_scale( d.lunch_d ) + (settings.line.padding.left);
        })
        .y(function( d ){
            return settings.line.y_scale( d.inc_savings ) + settings.line.padding.top;
        });

                //draw lines
    settings.line.properLine = svg5.append('g')
        .attr('class', 'line')
        .append( 'path' )
        .datum(data)
        .attr( 'stroke', '#3c97da' )
        .attr( 'stroke-width', 3 )
        .attr( 'd', settings.line.line )
        .attr('fill', 'transparent')
        .style('opacity', 0);

    //label
    svg5.append('text')
        .attr('id', 'savings-line-label')
        .attr('dx', settings.line.chart_width / 2)
        .attr('dy', settings.line.chart_height - Math.floor(settings.line.padding.top/ 2.5))
        .attr('fill', '#6b8193')
        .style('fill-opacity', '0.4')
        .style('font', 'bold 30px sans-serif')
        .attr('text-anchor', 'middle')
        .text('')
    var formatLabel = d3.timeFormat('%Y-%m-%d')
    svg5.append('text')
        .attr('id', 'savings-line-label-dt')
        .attr('dx', settings.line.chart_width / 2)
        .attr('dy', settings.line.chart_height - Math.floor(settings.line.padding.top/ 0.8))
        .attr('fill', '#6b8193')
        .style('fill-opacity', '0.4')
        .style('font', 'bold 15px sans-serif')
        .attr('text-anchor', 'middle')
        .text('')


    //border line

    svg5.append('line')
        .attr('class', 'borderline')
        .attr('x1', settings.line.padding.left * 10)
        .attr('x2', settings.line.chart_width - (settings.line.padding.right * 10))
        .attr('y1', settings.line.chart_height)
        .attr('y2', settings.line.chart_height)
        .style('stroke', '#3c97da')
        .style('stroke-width', '4')
        .style('opacity', '0.3');

    //draw circles

    settings.line.properCirc = svg5.append('g')
        .attr('id', 'outer-circ')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('class', 'unclicked-circle')
            .attr('id', function(d){
                return d.inc_savings;
            })
            .attr('cx', function(d){
                return settings.line.x_scale(d.lunch_d) + settings.line.padding.left;
            })
            .attr('cy', function(d){
                return settings.line.y_scale(d.inc_savings) + settings.line.padding.top;
            })
            .attr('r', '0')
            .style('stroke', '#3c97da')
            .style('stroke-width', '2')
            .style('fill', '#0a2234')
            .style('cursor', 'pointer')
            .on('mouseover', function(d){

                var currentElement = d3.select(this)

                currentElement.transition()
                    .duration(400)
                    .style('fill', '#3c97da')
                    .attr('r', '7');



            })
            .on('mouseout', function(d){

                var currentElement = d3.select(this);
                    if (currentElement.classed('unclicked-circle') === true) {
                        currentElement.transition()
                            .duration(400)
                            .style('fill', '#0a2234')
                            .attr('r', '5');
                    }else{


                    }


            })
            .on('click', function(d){
                var currentElement = d3.select(this);


                if (currentElement.classed('unclicked-circle') === true){

                    var allCircles = d3.selectAll('g#outer-circ circle')
                    allCircles.classed('unclicked-circle', true)
                        .transition()
                        .duration(450)
                        .style('fill', '#0a2234')
                        .attr('r', '5');
                    currentElement.classed('unclicked-circle', false)
                        .transition()
                        .duration(450)
                        .style('fill', '#3c97da')
                        .attr('r', '7');
                    d3.select('text#savings-line-label')
                        .transition()
                        .duration(200)
                        .style('opacity', '0')
                        .transition()
                        .duration(200)
                        .style('opacity', '1')
                        .text(currentElement.attr('id')+' PLN');
                    d3.select('text#savings-line-label-dt')
                        .transition()
                        .duration(200)
                        .style('opacity', '0')
                        .transition()
                        .duration(200)
                        .style('opacity', '1')
                        .text(formatLabel(d.lunch_d));

                }else{
                    currentElement.classed('unclicked-circle', true)
                        currentElement
                            .transition()
                            .duration(450)
                            .style('fill', '#0a2234')
                            .attr('r', 5);
                    d3.select('text#savings-line-label')
                        .transition()
                        .duration(200)
                        .style('opacity', '1')
                        .transition()
                        .duration(200)
                        .style('opacity', '0')
                        .text('');
                    d3.select('text#savings-line-label-dt')
                        .transition()
                        .duration(200)
                        .style('opacity', '1')
                        .transition()
                        .duration(200)
                        .style('opacity', '0')
                        .text('');

                }
            });


    settings.line.properLine.transition('line-loads')
        .duration(1000)
        .style('opacity', 1);
    settings.line.properCirc.transition('line-circle-loads')
        .duration(1000)
        .attr('r', 5);
}


//first data load function
function documentReady(){
    $.ajax({
        type: 'GET',
        url: '/initialdload',
        dataType: 'json'
    })
    .done(function(data){
        data[0].forEach(function(d){
            console.log(typeof(d.lunch_d), d.lunch_d, parseDate(d.lunch_d));
        });
        
        console.log(data);

        d3.select('body').style('pointer-events', 'none');
        createBarchart(data[0], true);
        createPieChart(data[1], ' PLN');
        createHeatMap(data[3]);
        createLineChart(data[2]);
        d3.select('body').style('pointer-events', 'auto');

    });
}


function updatePie(api_url, unit, title){
    $.ajax({
        type: 'GET',
        url: api_url,
        dataType: 'json'
    })
    .done(function(data){


        d3.select('#piechart').style('pointer-events', 'none');
        createPieChart(data, unit);
        d3.select('#piechart').style('pointer-events', 'auto');
        // //unload piechart
        // settings.piechart.p1.properPie
        // .transition('pie-unloads')
        // .duration(400)
        // .style('opacity', 0);

        // setTimeout(function(){
        //     //unload axis and base line and bars
        //     d3.selectAll('.arc').remove()
            
        //     createPieChart(data, unit);
        //     d3.select('#piechart1-title').text('Food Type by: '+title);

        //     d3.select('#piechart').style('pointer-events', 'auto');



        // }, 400);

        
    });
        
}

function updateBar(api_url, title=''){

    $.ajax({
        type: 'GET',
        url: api_url,
        dataType: 'json'
    })
    .done(function(data){

                //unload axis and base line and bars
                //d3.select('#barchart svg .xaxis').remove()
                d3.select('#barchart svg .yaxis').remove();
                //d3.select('#barchart svg .line').remove();
                //d3.selectAll('.bars rect').remove();

                //create new barchart
                createBarchart(data, false);

                d3.select('#barchart-title').text(title);

    });
}

function updateHeatMap(api_url, title){

    $.ajax({
        type: 'GET',
        url: api_url,
        dataType: 'json'
    })
    .done(function(data){
        console.log(data);
        //unload heatmap animation
        settings.heatmap.properBoxes.transition('heatmap-loads')
        .duration(1000)
        .attr( 'x', 0)
        .attr('width', 0);

        settings.heatmap.properLables.transition('heatlables-loads')
        .duration(1000)
        .attr('dx', 0);

            
            setTimeout(function(){
                //unload axis and base line and bars

                d3.selectAll('.heatboxes rect').remove();

                //create new barchart
                createHeatMap(data);

                d3.select('#heatmap-title').text(title);


            }, 1000); 
    
    });

}



$(document).ready(documentReady);



//data load selectors/
$('#piechart1-title').on('click', function(){
    var title = d3.select('#piechart1-title').text();

    if (title == settings.piechart.p1.title){

        updatePie('/piechangefreq', ' x', 'Frequency');

    }else{
        updatePie('/piechangeval', ' PLN', 'Value');
        
    }
});

$('#barchart-title').on('click', function(){

    
    var title = d3.select('#barchart-title').text();


    if (title == settings.barchart.title){

        updateBar('/barchangeinc', 'Daily Spending vs Baseline: Incremental');

    }else{

        updateBar('/barchangedisc', settings.barchart.title);
        
    }

});

$('#heatmap-title').on('click', function(){

    
    var title = d3.select('#heatmap-title').text();


    if (title == settings.heatmap.title){

        updateHeatMap('/heatchangeavg', 'Average Spending Distribution: Weekdays');

    }else{

        updateHeatMap('/heatchangetot', settings.heatmap.title);
        
    }

});










//header

    var svg0 = d3.select('#info-rect-1').append('svg')
        .attr('width', '1400')
        .attr('height', 120);

    svg0.append('line')
        .attr('x1', 20)
        .attr('x2', 1380)
        .attr('y1', 110)
        .attr('y2', 110)
        .style('stroke', '#3c97da')
        .style('stroke-width', '2')
        .style('opacity', '0.5');

    svg0.append('line')
        .attr('x1', 20)
        .attr('x2', 1380)
        .attr('y1', 10)
        .attr('y2', 10)
        .style('stroke', '#3c97da')
        .style('stroke-width', '2')
        .style('opacity', '0.5');

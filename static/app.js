
function createChartTitle(chart,dx, dy, chart_svg){

    chart_svg.append('text')
        .attr('id', chart.id+'-title')
        .attr('dx', dx / 2)
        .attr('dy', dy/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .text(chart.title);
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
    xAxis: d3.axisBottom(),
    yAxis: d3.axisLeft(),
    title: 'Daily Spending vs Baseline',
    bars: null
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
        title: 'Spending Distribution: Weekdays',
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



//first data load function
function documentReady(){
    $.ajax({
        type: 'GET',
        url: '/test',
        dataType: 'json'
    })
    .done(function(data){


        //*************************barchart*********************************
        var parseDate = d3.timeParse('%Y-%d-%m');

    
        //create svg
        data[0].forEach(function(d){
            
            d.lunch_date = parseDate(d.lunch_date);
          });
        console.log(data[3]);
        //scales
        settings.barchart.x_scale
            .domain( data[0].map(function(d){ return d.lunch_date; }) )
            .rangeRound([ 0, settings.barchart.chart_width - settings.barchart.padding.left ])
            .paddingInner( 0.05 );

        settings.barchart.y_scale.domain([0, d3.max(data[0], function( d ){
            return d.actual;
        })])
        .range([settings.barchart.chart_height - settings.barchart.padding.top - settings.barchart.padding.bottom, 0]);
        
        //define axes
        settings.barchart.xAxis
            .scale(settings.barchart.x_scale)
            .tickFormat(d3.timeFormat("%b-%d"));

        settings.barchart.yAxis
            .scale(settings.barchart.y_scale);
        
        //define line
        settings.barchart.line
            .x(function( d ){

                return settings.barchart.x_scale( d.lunch_date ) + (settings.barchart.padding.left + (settings.barchart.x_scale.bandwidth() / 2));
            })
            .y(function( d ){

                return settings.barchart.y_scale( d.baseline ) + settings.barchart.padding.top;
            });
        

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

                //create bars
        settings.barchart.bars = svg.append('g')
        .attr('class', 'bars')
        .selectAll( 'rect' )
        .data( data[0] )
        .enter()
        .append( 'rect' )
        .attr('class', function(d){
            return d.food_type;
        })
        .attr( 'x', function( d ){
            return settings.barchart.x_scale( d.lunch_date ) + settings.barchart.padding.left;
        })
        .attr('y', settings.barchart.chart_height - settings.barchart.padding.bottom)

        .attr( 'width', settings.barchart.x_scale.bandwidth() )
        .attr('height', 0)

        .attr( 'fill', '#3c97da')
        .attr('stroke', '#226789')
        .on('mouseover', function(d){

            var currentElement = d3.select(this)

            currentElement.transition()
                .duration(400)
                .style('fill-opacity', '0.5')

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
        settings.barchart.bars.transition()
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
    //create line

    svg.append('g').attr('class', 'line')
        .append( 'path' )
        .datum(data[0])
        //.attr( 'fill', '#73FF36' )
        .attr( 'stroke', '#d95f02' )
        .attr( 'stroke-width', 2 )
        .attr('stroke-dasharray', 5)
        .attr( 'd', settings.barchart.line )
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);

    //*******************************piechart****************************************


    settings.piechart.p1.colors.domain(data[1], function (d){ return d.food_type; });
    console.log();


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

    
   
   //define arcs         
    settings.piechart.p1.arcs = svg2.selectAll('g.arc')
        .data(settings.piechart.p1.pie(data[1]))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + settings.piechart.p1.pie_width/ 2 + ', ' + settings.piechart.p1.pie_height / 2 + ')');
        

    //draw the pie
    settings.piechart.p1.properPie = settings.piechart.p1.arcs

        .append('path')
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
        .style('opacity', 0)
        .attr('d', settings.piechart.p1.arc)
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
                .text(currentElement.attr('id')+' PLN');

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
        settings.piechart.p1.properPie.transition()
        .duration(1000)
        .style('opacity', 1);


    //**************************************piechart#2 placeholder************************

    //**********************************************heatmap************************
    data[3].forEach(function(d){
        var wd = {
            'Monday': 1, 
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5
        };
        d.wnum = wd[d.weekday];
    });
    data[3].sort(function(a, b){
        return a.wnum - b.wnum;
    });
    console.log(data[3]);
    settings.heatmap.x_scale
        .domain( data[3].map(function(d){ return d.weekday; }) )
        .rangeRound([ 0, settings.heatmap.chart_width - settings.heatmap.padding.left - settings.heatmap.padding.right ]);

    settings.heatmap.colors        
        .domain([d3.min(data[3], function(d){ return d.vsum; }), d3.max(data[3], function(d){ return d.vsum; }) ])
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
    .data(data[3])
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
    settings.heatmap.properBoxes.transition()
        .duration(1000)
        .attr( 'x', function( d ){
            return settings.heatmap.x_scale( d.weekday ) + settings.heatmap.padding.left;
        });


    //labels
    settings.heatmap.properLables = svg4.append('g').attr('id', 'heatlabels')
    .selectAll('text')
    .data(data[3])
    .enter()
    .append('text')
    .attr('dy', settings.heatmap.chart_height / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#0a2234')
    .style('fill-opacity', '0.7')
    .style('font', 'bold 17px sans-serif')
    .text(function(d){

        return d.vsum +' PLN';
    });
    settings.heatmap.properLables.transition()
        .duration(1000)
        .attr('dx', function(d){
            return settings.heatmap.x_scale(d.weekday) + settings.heatmap.padding.left + (settings.heatmap.x_scale.bandwidth() / 2);
        });
//titles
    svg4.append('text')
        .attr('dx', settings.heatmap.chart_width / 2)
        .attr('dy', settings.heatmap.padding.top/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .text('Spending Distribution: Weekdays');

    // **************************************************line chart************************************
    data[2].forEach(function(d){
            
        d.lunch_date = parseDate(d.lunch_date);
      });
    console.log(data);
    settings.line.x_scale
    .domain( data[2].map(function(d){ return d.lunch_date; }) )
    .rangeRound([ 0, settings.line.chart_width - settings.line.padding.left - settings.line.padding.right ]);

    settings.line.y_scale
    .domain([0, d3.max(data[2], function(d){
        return d.inc_savings;
    })])
    .range([settings.line.chart_height - settings.line.padding.top - settings.line.padding.bottom, 0])


    //define lines

    settings.line.line
        .x(function( d ){
            return settings.line.x_scale( d.lunch_date ) + (settings.line.padding.left);
        })
        .y(function( d ){
            return settings.line.y_scale( d.inc_savings ) + settings.line.padding.top;
        });

                //draw lines
    settings.line.properLine = svg5.append('g')
        .attr('class', 'line')
        .append( 'path' )
        .datum(data[2])
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
        .data(data[2])
        .enter()
        .append('circle')
            .attr('class', 'unclicked-circle')
            .attr('id', function(d){
                return d.inc_savings;
            })
            .attr('cx', function(d){
                return settings.line.x_scale(d.lunch_date) + settings.line.padding.left;
            })
            .attr('cy', function(d){
                return settings.line.y_scale(d.inc_savings) + settings.line.padding.top;
            })
            .attr('r', '0')
            .style('stroke', '#3c97da')
            .style('stroke-width', '2')
            .style('fill', '#0a2234')
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
                    .text(formatLabel(d.lunch_date));

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


    settings.line.properLine.transition()
        .duration(1000)
        .style('opacity', 1);
    settings.line.properCirc.transition()
        .duration(1000)
        .attr('r', 5);

    });

}


$(document).ready(documentReady);



//data load selectors/
$('#piechart1-title').on('click', function(){
    $.ajax({
        type: 'GET',
        url: '/piechangefreq',
        dataType: 'json'
    })
    .done(function(data){
        console.log(data);

        settings.piechart.p1.pie = d3.pie().value(function(d){ return d.freq; });

        settings.piechart.p1.properPie.transition()
        .duration(1000)
        .style('opacity', 0);

        d3.selectAll('.arc').remove()

        //define arcs         
        settings.piechart.p1.arcs = svg2.selectAll('g.arc')
            .data(settings.piechart.p1.pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(' + settings.piechart.p1.pie_width/ 2 + ', ' + settings.piechart.p1.pie_height / 2 + ')');
    
    
    
    
    //draw the pie
    settings.piechart.p1.properPie = settings.piechart.p1.arcs
        .append('path')

        .attr('id', function(d){

            return d.data.freq;
            
        })
        .attr('class', function(d){
            return d.data.food_type;
        })
        .attr('fill', function (d) {

            return settings.piechart.p1.colors(d.data.food_type);
        })
        .style('stroke', '#0a2234')
        .style('stroke-width', '5')
        .style('opacity', 0)
        .attr('d', settings.piechart.p1.arc)

        settings.piechart.p1.properPie.transition()
        .duration(1000)
        .style('opacity', 1);
            



    
    });
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

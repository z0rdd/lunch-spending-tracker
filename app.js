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



//barchart
d3.csv( 'file.csv' ).then(function( data ) {




    var parseDate = d3.timeParse('%Y-%m-%d');


    data.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Actual = +d.Actual
        d.Baseline = +d.Baseline;
    });


    // Create SVG Element
    var chart_width     =   800;
    var chart_height    =   600;
    var bar_padding     =   5;
    var padding = {bottom: 100, left: 20, top: 50};
    var svg = d3.select( '#barchart' )
        .append( 'svg' )
        .attr( 'width', chart_width )
        .attr( 'height', chart_height );

// Scales
    var x_scale         =   d3.scaleBand()
        .domain( data.map(function(d){ return d.Date; }) )
        .rangeRound([ 0, chart_width - padding.left ])
        .paddingInner( 0.05 );
    var y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, function( d ){
            return d.Actual;
        })])
        .range([chart_height - padding.top - padding.bottom, 0]);

    // var colors = d3.scaleOrdinal()
    //     .domain(data, function (d){ return d.Type; })
    //     .range(d3.schemeDark2);


//define lines

    var line = d3.line()
        .x(function( d ){

            return x_scale( d.Date ) + (padding.left + (x_scale.bandwidth() / 2));
        })
        .y(function( d ){

            return y_scale( d.Baseline ) + padding.top;
        });

//axes

    var xAxis = d3.axisBottom()
        .scale(x_scale)
        .tickFormat(d3.timeFormat("%b-%d"));
    var yAxis = d3.axisLeft(y_scale);

//create axes
    svg.append('g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate('+padding.left+', ' + (chart_height - padding.bottom)+')')
        .call(xAxis)
        .selectAll('text')
            .attr("transform", "rotate(-90)" )
            .style("text-anchor", "end")
            .attr('fill', '#6b8193')
            .style('font', 'bold 11px sans-serif')
            .attr("dx", "-1%")
            .attr('dy', '-1%');

    svg.append('g')
        .attr('class', 'yaxis')
        .attr('transform', 'translate('+padding.left+', ' +padding.top+')')
        .call(yAxis)
        .selectAll('text')
            .attr('fill', '#6b8193')
            .style('font', 'bold 11px sans-serif');

//create bars
    var bars = svg.append('g')
        .attr('class', 'bars')
        .selectAll( 'rect' )
        .data( data )
        .enter()
        .append( 'rect' )
        .attr('class', function(d){
            return d.Type;
        })
        .attr( 'x', function( d ){
            return x_scale( d.Date ) + padding.left;
        })
        .attr('y', chart_height - padding.bottom)
/*        .attr( 'y', function(d ){
            return y_scale(d.Actual) + padding.top;
        })*/
        .attr( 'width', x_scale.bandwidth() )
        .attr('height', 0)
/*        .attr( 'height', function( d ){
        return chart_height - y_scale(d.Actual) - padding.bottom - padding.top;
        })*/
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
        })
    ;
        bars.transition()
            .attr( 'height', function( d ){
                return chart_height - y_scale(d.Actual) - padding.bottom - padding.top;
            })
            .attr( 'y', function(d ){
                return y_scale(d.Actual) + padding.top;
            })
            .delay(function(d, i) {
                return i * 20;
            })
            .duration(1000)
            .ease(d3.easeSinInOut);
//create line

    svg.append('g').attr('class', 'line')
        .append( 'path' )
        .datum(data)
        //.attr( 'fill', '#73FF36' )
        .attr( 'stroke', '#d95f02' )
        .attr( 'stroke-width', 2 )
        .attr('stroke-dasharray', 5)
        .attr( 'd', line )
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);


// Create Title
    svg.append('text')
        .attr('dx', chart_width / 2)
        .attr('dy', padding.top/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .text('Daily Spending vs Baseline');




});


d3.csv( 'file2.csv' ).then(function( data ) {


    var colors = d3.scaleOrdinal()
        .domain(data, function (d){ return d.Type; })
        .range(d3.schemeDark2);
// PIE CHART

    var pie_width = 300;
    var pie_height = 400;
    var outer_radius = Math.floor(pie_width / 2.5);
    var inner_radius = Math.floor(outer_radius / 1.3);

    var arc = d3.arc()
        .innerRadius(inner_radius)
        .outerRadius(outer_radius);



// create svg

    var svg2 = d3.select('#piechart')
        .append('svg')
        .attr('width', pie_width)
        .attr('height', pie_height);

    var pie = d3.pie()
        .value(function(d){ return d.Sum; });

    // labels
    svg2.append('text')
        .attr('class', 'pielabel_1')
        .attr('dx', pie_width / 2)
        .attr('dy', Math.floor(pie_height / 1.6))
        .style('font', 'bold 20px sans-serif')
        .attr('text-anchor', 'middle')
        .attr('fill', '#3c97da')
        .text('');

    svg2.append('text')
        .attr('class', 'pielabel_2')
        .attr('dx', pie_width / 2)
        .attr('dy', Math.floor(pie_height / 2.5))
        .style('font', 'bold 20px sans-serif')
        .attr('text-anchor', 'middle')

        .attr('fill', '#3c97da')
        .text('');



    //arcs

    var arcs = svg2.selectAll('g.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + pie_width/ 2 + ', ' + pie_height / 2 + ')');

    var properPie = arcs.append('path')
        .attr('id', function(d){
            return d.data.Sum;
        })
        .attr('class', function(d){
            return d.data.Type;
        })
        .attr('fill', function (d) {
            return colors(d.data.Type);
        })
        .style('stroke', '#0a2234')
        .style('stroke-width', '5')
        .style('opacity', 0)
        .attr('d', arc)
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
    properPie.transition()
        .duration(1000)
        .style('opacity', 1);

    //piechart title

    svg2.append('text')
        .attr('dy', pie_height / 2)
        .attr('dx', pie_width / 2)
        .attr('text-anchor', 'middle')
        .text('Food Type by: Value')
        .style('font', 'bold 17px sans-serif')
        .attr('fill', '#6b8193');

/*    //piechart labels

    arcs.filter(function(d) { return d.endAngle - d.startAngle > 10; })
        .append("text")
        .attr( 'transform', function(d, i){
            return "translate(" + arc.centroid(d) + ")";})
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.Type; });*/

});

d3.csv( 'file2.csv' ).then(function( data ) {


    var colors = d3.scaleOrdinal()
        .domain(data, function (d){ return d.Type; })
        .range(d3.schemeDark2);
// PIE CHART # 2

    var pie_width = 300;
    var pie_height = 400;
    var outer_radius = Math.floor(pie_width / 2.5);
    var inner_radius = Math.floor(outer_radius / 1.3);

    var arc = d3.arc()
        .innerRadius(inner_radius)
        .outerRadius(outer_radius);

    console.log('outer radius', outer_radius);


// create svg

    var svg2 = d3.select('#piechart')
        .append('svg')
        .attr('width', pie_width)
        .attr('height', pie_height);

    var pie = d3.pie()
        .value(function(d){ return d.Sum; });


    //arcs

    var arcs = svg2.selectAll('g.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + pie_width/ 2 + ', ' + pie_height / 2 + ')');

    var properPie = arcs.append('path')
        .attr('fill', function (d) {
            return colors(d.data.Type);
        })
        .style('stroke', '#0a2234')
        .style('stroke-width', '5')
        .style('opacity', 0)
        .attr('d', arc)
        .on('mouseover', function(d){

            var currentElement = d3.select(this)

            currentElement.transition()
                .duration(400)
                .style('fill-opacity', '0.5')

        })
        .on('mouseout', function(d){

            var currentElement = d3.select(this);

              currentElement.transition()
                .duration(400)
                .style('fill-opacity', '1');
        })
    ;

    properPie.transition()
        .duration(1000)
        .style('opacity', 1);


    //piechart title

    svg2.append('text')
        .attr('dy', pie_height / 2)
        .attr('dx', pie_width / 2)
        .attr('text-anchor', 'middle')
        .text('% below baseline')
        .style('font', 'bold 17px sans-serif')
        .attr('fill', '#6b8193');

    //piechart labels

    arcs.filter(function(d) { return d.endAngle - d.startAngle > 10; })
        .append("text")
        .attr( 'transform', function(d, i){
            return "translate(" + arc.centroid(d) + ")";})
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.Type; });

});



d3.csv( 'file.csv' ).then(function( data ) {


    var chart_width = 600;
    var chart_height = 200;
    var padding = {bottom: 40, left: 20, top: 50, right: 20};

    var svg3 = d3.select('#linechart')
        .append('svg')
        .attr('height', chart_height)
        .attr('width', chart_width);

    var x_scale = d3.scaleBand()
        .domain( data.map(function(d){ return d.Date; }) )
        .rangeRound([ 0, chart_width - padding.left - padding.right ]);

    var y_scale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
            return d.savings;
        })])
        .range([chart_height - padding.top - padding.bottom, 0])


    //define lines

    var line = d3.line()
        .x(function( d ){
            return x_scale( d.Date ) + (padding.left);
        })
        .y(function( d ){
             return y_scale( d.savings ) + padding.top;
        });


    //draw lines
    var properLine = svg3.append('g')
        .attr('class', 'line')
        .append( 'path' )
        .datum(data)
        .attr( 'stroke', '#3c97da' )
        .attr( 'stroke-width', 3 )
        .attr( 'd', line )
        .attr('fill', 'transparent')
        .style('opacity', 0);

    //label
    svg3.append('text')
        .attr('id', 'savings-line-label')
        .attr('dx', chart_width / 2)
        .attr('dy', chart_height - Math.floor(padding.top/ 2.5))
        .attr('fill', '#6b8193')
        .style('fill-opacity', '0.4')
        .style('font', 'bold 30px sans-serif')
        .attr('text-anchor', 'middle')
        .text('')
    svg3.append('text')
        .attr('id', 'savings-line-label-dt')
        .attr('dx', chart_width / 2)
        .attr('dy', chart_height - Math.floor(padding.top/ 0.8))
        .attr('fill', '#6b8193')
        .style('fill-opacity', '0.4')
        .style('font', 'bold 15px sans-serif')
        .attr('text-anchor', 'middle')
        .text('')


    //border line

    svg3.append('line')
        .attr('class', 'borderline')
        .attr('x1', padding.left * 10)
        .attr('x2', chart_width - (padding.right * 10))
        .attr('y1', chart_height)
        .attr('y2', chart_height)
        .style('stroke', '#3c97da')
        .style('stroke-width', '4')
        .style('opacity', '0.3');

    //draw circles

    var properCirc = svg3.append('g')
        .attr('id', 'outer-circ')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('class', 'unclicked-circle')
            .attr('id', function(d){
                return d.savings;
             })
            .attr('cx', function(d){
                return x_scale(d.Date) + padding.left;
            })
            .attr('cy', function(d){
                return y_scale(d.savings) + padding.top;
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
                    .text(d.Date);

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


    properLine.transition()
        .duration(1000)
        .style('opacity', 1);
    properCirc.transition()
        .duration(1000)
        .attr('r', 5);



    svg3.append('text')
        .attr('dx', chart_width / 2)
        .attr('dy', padding.top/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .text('Accumulated Lunch Savings Over Time');



});








d3.csv( 'file3.csv' ).then(function( data ) {

    data.forEach(function(d){
        d.Sum = + d.Sum;

    })

    var chart_width = 600;
    var chart_height = 200;
    var padding = {bottom: 50, left: 20, top: 50, right: 20};

    var x_scale = d3.scaleBand()
        .domain( data.map(function(d){ return d.Weekday; }) )
        .rangeRound([ 0, chart_width - padding.left - padding.right ]);


    var colors = d3.scaleQuantize()

        .domain([d3.min(data, function(d){ return d.Sum; }), d3.max(data, function(d){ return d.Sum; }) ])
        .range(d3.schemeBlues[5]);

    xAxis = d3.axisBottom(x_scale);

    var svg4 = d3.select('#heatmap').append('svg')
        .attr('height', chart_height)
        .attr('width', chart_width);

    svg4.append('g').attr('id', 'xaxis')
        .attr('transform', 'translate('+padding.left+', ' + (chart_height - padding.bottom)+')')
        .call(xAxis)
        .selectAll('text')
        .style("text-anchor", "center")
        .attr('fill', '#6b8193')
        .style('font', 'bold 15px sans-serif')
        .attr('dy', '3%');

   var properBoxes = svg4.append('g').attr('class', 'heatboxes')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', padding.left)
/*        .attr( 'x', function( d ){
            return x_scale( d.Weekday ) + padding.left;
        })*/
        .attr( 'y', padding.top)
        .attr('height', chart_height - padding.bottom - padding.top)
        .attr('width', x_scale.bandwidth())
        .attr('fill', function(d){
            console.log('ooo', d);
            return colors(d.Sum);
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
        properBoxes.transition()
            .duration(1000)
            .attr( 'x', function( d ){
                return x_scale( d.Weekday ) + padding.left;
            });

    //labels
    var properLables = svg4.append('g').attr('id', 'heatlabels')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
/*        .attr('dx', function(d){
            return x_scale(d.Weekday) + padding.left + (x_scale.bandwidth() / 2);
        })*/
        .attr('dy', chart_height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0a2234')
        .style('fill-opacity', '0.7')
        .style('font', 'bold 17px sans-serif')
        .text(function(d){
            return d.Sum +' PLN';
        });
    properLables.transition()
        .duration(1000)
        .attr('dx', function(d){
            return x_scale(d.Weekday) + padding.left + (x_scale.bandwidth() / 2);
        });
    //titles
    svg4.append('text')
        .attr('dx', chart_width / 2)
        .attr('dy', padding.top/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .text('Spending Distribution: Weekdays');


});

/*
d3.csv('file4.csv').then(function(data){



    var parseDate = d3.timeParse('%Y-%m-%d');



    data.forEach(function(d){
        d.Month = parseDate(d.Month);
        d.Baseline = +d.Baseline;
        d.Actual = +d.Actual;
        d.Savings = +d.Savings;
    });
    console.log(data);

    console.log(d3.max(function(d){ return d.Actual; }));

    var chart_height = 200;
    var chart_width = 800;
    var padding = {left: 20, right: 20, top: 50, bottom: 50};

    x_scale = d3.scaleBand()
        .domain(data.map(function(d) { return d.Month; }))
        .rangeRound([padding.left, chart_width - padding.right])
        .paddingInner( 0.05 );;

    y_scale = d3.scaleLinear()
         .range([chart_height - padding.top - padding.bottom, 0]);

    if (d3.max(data, function( d ){ return d.Actual; }) > d3.max(data, function( d ){ return d.Savings; })){

        y_scale.domain([0, d3.max(data, function( d ){
            return d.Actual;
        })]);

    } else {

        y_scale.domain([0, d3.max(data, function( d ){
            return d.Savings;
        })]);
    }


    var svg5 = d3.select('#monthchart').append('svg')
        .attr('width', chart_width)
        .attr('height', chart_height);


    var xAxis = d3.axisBottom()
        .scale(x_scale)
        .tickFormat(d3.timeFormat("%b"));

    var yAxis = d3.axisLeft(y_scale);

//define line

    var line = d3.line()
        .x(function( d ){

            return x_scale( d.Month ) + (padding.left +(x_scale.bandwidth() / 2));
        })
        .y(function( d ){

            return y_scale( d.Savings ) + padding.top;
        });

//create axes
    svg5.append('g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate('+padding.left+', ' + (chart_height - padding.bottom)+')')
        .call(xAxis)
        .selectAll('text')
        .attr("transform", "rotate(-90)" )
        .style("text-anchor", "end")
        .attr('fill', '#6b8193')
        .style('font', 'bold 11px sans-serif')
        .attr("dx", "-1%")
        .attr('dy', '-1%');

    svg5.append('g')
        .attr('class', 'yaxis')
        .attr('transform', 'translate('+padding.left+', ' +padding.top+')')
        .call(yAxis)
        .selectAll('text')
        .attr('fill', '#6b8193')
        .style('font', 'bold 11px sans-serif');


    svg5.append('g')
        .attr('class', 'bars')
        .selectAll( 'rect' )
        .data( data )
        .enter()
        .append( 'rect' )
        .attr('class', function(d){
            return d.Month;
        })
        .attr( 'x', function( d ){
            return x_scale( d.Month ) + padding.left;
        })
        .attr( 'y', function(d ){
            return y_scale(d.Actual) + padding.top;
        })
        .attr( 'width', x_scale.bandwidth() )
        .attr( 'height', function( d ){
            return chart_height - y_scale(d.Actual) - padding.bottom - padding.top;
        })
        .attr( 'fill', '#cfda3c')
        .attr('stroke', '#226789');



    //create line

    svg5.append('g').attr('class', 'line')
        .append( 'path' )
        .datum(data)
        .attr( 'stroke', '#d95f02' )
        .attr( 'stroke-width', 2 )
        .attr('fill', 'transparent')
        .attr( 'd', line );


// Create Title
    svg5.append('text')
        .attr('dx', chart_width / 2)
        .attr('dy', padding.top/ 2)
        .attr('fill', '#6b8193')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', '1')
        .style('font', 'bold 17px sans-serif')
        .text('Monthly Spending and Accumulated Savings');


});*/

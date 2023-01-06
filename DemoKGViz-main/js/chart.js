const margin = { left: 40, right: 20, bottom: 20, top: 80 }
const color = d3.scaleOrdinal()
const scales = {
    "brush-chart": {
        x: d3.scaleTime(),
        y: d3.scaleLinear()
    }, "line-chart-hour1": {
        x: d3.scaleTime(),
        y: d3.scaleLinear()
    }
}

function drawCharts(json, region) {
    
    // onSuccessMember4(json, region)
    let chartdata = json // compute data for charts

    let stationnames = chartdata.map(d => d.station) // ancien newdata
    stationnames = stationnames.filter((d, i) => stationnames.indexOf(d) === i)
    console.log('names = ', stationnames)

    color.domain(stationnames).range(colorbrewer.Set2[6])

    drawStationLineChart(chartdata, "brush-chart", region)
    drawLegend(stationnames, chartdata[0].region, "chart-legend-hour1")

    drawRegionLineChart(chartdata, "line-chart-hour1", region)

    drawBrush("brush-chart")
    
    d3.select('svg#line-chart-hour2').selectAll('g').remove()
    d3.select('svg#chart-legend-hour2').selectAll('g').remove()
    d3.select('svg#line-chart-hour2').selectAll("text").remove()
}

function getData(json) {
    let newdata = []
    let data = json.results.bindings

    for (let i = 0; i < data.length; i++) {
        newdata.push({
            date: data[i]['date'].value,
            station: data[i]['Nstation'].value,
            temp_avg: data[i]['temp_avg'].value,
            region: data[i]['label'].value
        })

    }

    return newdata
}

function drawBrush(id) {

    console.log("Brush Draw")
    var svgChart = d3.select(`svg#${id}`)

    let width = svgChart.node().parentNode.clientWidth,
        height = svgChart.node().parentNode.clientHeight;

    console.log(width, height)

    var brush = d3.brushX()                 // Add th e brush feature using the d3.brush function
        .extent([[0, 0], [width - margin.left, height - margin.bottom]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart'
    //.on("brush", brushed)

    const lastDate = scales["brush-chart"].x.domain()[1] // get the last date of the axis

    const firstDate = new Date(lastDate.getTime());
    firstDate.setMonth(firstDate.getMonth() - 6); // subtract 3 months from the last date of the axis

    const defaultSelection = [scales["brush-chart"].x(firstDate), scales["brush-chart"].x.range()[1]]; // give the positions of the first and last date which you want to include in the brush
    console.log("defaultSelection:", defaultSelection)
    let lineGroup = svgChart
        .select('g.lineGroup')

    lineGroup.attr("class", "brush")
        .call(brush)
        .call(brush.move, defaultSelection);

    let targetChartSVG = d3.select(`svg#line-chart-hour1`)
    var clipPath = targetChartSVG
        .selectAll('g.lineGroup')
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", targetChartSVG.node().clientWidth)
        .attr("height", targetChartSVG.node().clientHeight);

    var idleTimeout
    function idled() { idleTimeout = null; }

    function updateChart() {
        console.log("test")
        extent = d3.event.selection
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        }
        else {
            scales["line-chart-hour1"].x.domain([scales["brush-chart"].x.invert(extent[0]), scales["brush-chart"].x.invert(extent[1])])
            // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and circle position
        d3.select('g#line-chart-hour1').transition().duration(2000).call(d3.axisBottom(scales["line-chart-hour1"].x))



        d3.select('svg#line-chart-hour1')
            .selectAll('g.lineGroup')
            .selectAll("path")
            .transition().duration(2000)
            .attr("clip-path", "url(#clip)")
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveCardinal)
                    .x(function (d) { return scales["line-chart-hour1"].x(new Date(d.date).setFullYear(0000)) })
                    .y(function (d) { return scales["line-chart-hour1"].y(parseFloat(d.temp_avg)); })
                    (d.values)
            })

    }

}

function drawLegend(StationName, region, id, date) {

    d3.select("svg#" + id).selectAll('text').remove()

    
    // add SVG legend             
    var svglegend = d3.select("svg#" + id);

    svglegend.selectAll('g').remove()

    let legendGroup = svglegend.selectAll('g')
        .data(StationName)
        .enter()
        .append('g')

    legendGroup.append('line')
        .style("stroke", d => color(d))
        .style("stroke-width", 3)
        .attr("x1", 0)
        .attr("y1", (d, i) => 10 + i * 15)
        .attr("x2", 30)
        .attr("y2", (d, i) => 10 + i * 15);

    legendGroup.append('text')
        .attr('x', 40)
        .attr('y', (d, i) => 10 + i * 17)
        .style('font-size', '11px')
        .text(d => d)

    if (id === "chart-legend-hour2") {
        legendGroup.append("text")
            .attr("x", 350)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .html("Air Temperatures Per Station (Region: " + region + ")" + "  " + date + "(J-1, J+1)");
    }
    else {
        legendGroup.append("text")
            .attr("x", 350)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(`${StationName} Air Temperatures (Region: ${region})}`);
        }
}

/*
function drawRegionLineChart(newdata, id, insee) {


    let margin = { left: 40, right: 20, bottom: 20, top: 0 }
    var svgChart = d3.select(`svg#${id}`)

    let width = svgChart.node().parentNode.clientWidth,
        height = svgChart.node().parentNode.clientHeight;

    if (id != "brush-chart") height -= 80;

    console.log(width, height)

    svgChart.selectAll('g').remove()
    svgChart.selectAll("text").remove()

    svgChart.attr('width', width)
        .attr('height', height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //console.log("Region", newdata[0].region)
    var region = newdata[0].region

    var sumstat = d3.nest()
        .key(d => d.date.slice(0,4))
        .entries(newdata);

    console.log("newdata = ",newdata)
    scales[id].x.domain([new Date("0000-01-01"),new Date("0000-12-31")]).range([0, `${width - margin.left}`])

    //newdata, d => new Date(d.date))
    var xAxis = svgChart.append("g")
        .attr('id', id) /// je lui donne un id pour séléctionner ce groupe lors de la transition
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(scales[id].x));

    // Add Y axis

    scales[id].y.domain(d3.extent(newdata, function (d) { return parseFloat(d.temp_avg) }))
        .range([height - margin.bottom, 0]);

    yAxis = d3.axisLeft().scale(scales[id].y)

    if (id == "brush-chart") yAxis.ticks(0)

    var year = new Date(newdata[0].date).getYear();


    svgChart.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis)

    if (id != "brush-chart") {

        svgChart.append("text")
            .attr("transform", `translate(10,${height / 2})rotate(-90)`)
            .style("font-size", "12px")
            .text("Air Temperature in °C");
    }

    let lineGroup = svgChart.selectAll('g.lineGroup')
        .data(sumstat)
        .enter()
        .append('g')
        .attr('class', 'lineGroup')
        .attr('transform', `translate(${margin.left}, 0)`)

    lineGroup.append("path")
        .attr("fill", "none") //.attr("fill", d => color(d.key))
        .style('fill-opacity', 0.1)
        .attr("stroke", d => color(d.key))
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
            return d3.line()
                .curve(d3.curveCardinal)
                .x(function (d) { return scales[id].x(new Date(d.date).setFullYear(0000)) })
                .y(function (d) { return scales[id].y(parseFloat(d.temp_avg)); })
                (d.values)
        })
        .on("mouseout", () => d3.select(".chart-tooltip").style("display", "none"))
        .on('mouseover', function (d) {
            if (this.parentNode.parentNode.id == 'brush-chart') return;

            // console.log("data----here", d.key);
            var mouse = d3.mouse(this);
            var station = d.values[0].station;
            // console.log("d : ",d)
            // console.log(d3.event)
            // console.log('mouse = ', mouse)

            var tooltip = d3.select(".chart-tooltip")

            tooltip.style('display', 'block')
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY + 10 + 'px')
            
            
            var xDate = scales[id].x.invert(mouse[0])
            xDate = d.key + xDate.toISOString().slice(4)
            var yTemp = scales[id].y.invert(mouse[1]).toFixed(3)
            // console.log("Temp----here", yTemp);
            // console.log("Date----here", xDate);
            tooltip.html("<b> Station: </b>" + station + "</br>" + "<b>  Date:</b> " + xDate.split('T')[0] + "</br>" + "<b> Daily Avg. Temp.:</b> " + yTemp);


            function doesChartExist() {
                return new Promise((fulfill, reject) => {
                    // comparer donnée survol et donnée ligne
                    if (d3.select("#line-chart-hour2").selectAll('path.line').size() > 0) {
                        let oldData = d3.select("#line-chart-hour2").select('path.line').datum()
                        let oldStation = d3.select("svg#chart-legend-hour2").select('text').node().innerHTML;

                        //console.log('old station = ', oldStation)
                        //console.log('old data = ', oldData)
                        //console.log('new data =', station, xDate.toISOString().split('T')[0] , oldData[0].date.split('T')[0])

                        if (oldStation != station)
                            fulfill(false)

                        if (xDate.split('T')[0] != oldData[0].date.split('T')[0])
                            fulfill(false)

                        fulfill(true)
                    } else fulfill(false)
                })
            }

            doesChartExist().then((value) => {
                // console.log("resultat de la promise = ", value)
                if (value) return;
                var date = xDate.split('T')[0]
                endpoint.query(QueryObservationsByDate(insee, xDate.split('T')[0])).done((json) => {
                    // legend exists
                    if (d3.select('svg#chart-legend-hour2').selectAll('g').empty()) {
                        stationnames = json.results.bindings.map(d => d.station.value)
                        drawLegend(stationnames, region, "chart-legend-hour2", date)
                    } else {
                        // change title
                    }
                    stationnames = json.results.bindings.map(d => d.station.value)
                    stationnames = stationnames.filter((d, i) => stationnames.indexOf(d) === i)
                    drawLegend(stationnames, region, "chart-legend-hour2", date)
                    onSuccessMember3HourlyTemp(json)

                });
            })

        })
}
*/
// function onSuccessLegend2

function onSuccessMember3HourlyTemp(json) {

    //console.log("3Hourly Temperature", json)

    let margin = { left: 70, right: 20, bottom: 20, top: 80 }
    let width = 600, height = 300

    var svgChart = d3.select("svg#line-chart-hour2")
    // console.log(svgChart)

    svgChart.selectAll('g').remove()
    svgChart.select("text").remove()

    svgChart.attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top)
        .append("g")

    let newdata = []
    let data = json.results.bindings


    for (let i = 0; i < data.length; i++) {
        newdata.push({
            date: data[i]['t'].value,
            temp: data[i]['temp'].value,
            station: data[i]['station'].value,
            region: data[i]['region'].value
        })

    }
    var datej1 = new Date(data[0]['t'].value.split('T')[0])

    var date = new Date();

    // add a day
    date.setDate(datej1.getDate() - 1);
    console.log("dataj", date.toISOString())
    date = date.toISOString().split('T')[0]
    var sumstat = d3.nest()
        .key(d => d.station)
        .entries(newdata);

    var StationName = sumstat.map(function (d) { return d.key })
    //console.log(StationName)

    console.log("new--- 3Hours", sumstat)

    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");

    var x = d3.scaleTime()
        //.domain(d3.extent(newdata, d => new Date(d.date)))
        .domain(d3.extent(newdata, d => new Date(d.date)))
        .range([0, width])


    xAxis = d3.axisBottom()
        .scale(x)

    svgChart.append("g")
        .attr("transform", `translate(${margin.left}, ${height})`)
        .call(xAxis);



    // Add Y axis

    var y = d3.scaleLinear()
        .domain(d3.extent(newdata, function (d) { return parseFloat(d.temp) }))
        .range([height, 0]);

    yAxis = d3.axisLeft()
        .scale(y)

    svgChart.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)


    svgChart.append("text")
        .attr("transform", `translate(15,${(height + margin.bottom + margin.top) / 2})rotate(-90)`)
        .style("font-size", "12px")
        .text("Air Temperature in °C");

    /*svgChart.append("text")
        .attr("transform", "translate(30,200)rotate(-90)")
        .text("Temperature");*/

    var color = d3.scaleOrdinal().domain(StationName).range(colorbrewer.Set2[6])

    let lineGroup = svgChart.selectAll('g.lineGroup')
        .data(sumstat)
        .enter()
        .append('g')
        .attr('class', 'lineGroup')
        .attr('transform', `translate(${margin.left}, 0)`)


    var valueline = d3.line()
        .curve(d3.curveCardinal)
        .x(function (d) { return x(new Date(d.date)); })
        .y(function (d) { return y(parseFloat(d.temp)); });

    console.log("valueline", valueline)

    lineGroup.append("path")
        .attr("class", "chart-line")
        .attr("fill", "none") //.attr("fill", d => color(d.key))
        .style('fill-opacity', 0.1)
        .attr("stroke", d => color(d.key))
        .attr("stroke-width", 1.5)
        .attr("d", d => valueline(d.values))

    var mouseG = svgChart.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var lines = document.getElementsByClassName('chart-line');
    //console.log("lines", lines)

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(StationName)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function (d) {
            return color(d);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text").attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
        })
        .on('mouseover', function () { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function () { // mouse moving over canvas
            var mouse = d3.mouse(this);

            d3.select(".mouse-line")
                .attr("d", function () {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });


            var xDate = x.invert(mouse[0] - margin.left);
            let roundedDate = roundMinutes(xDate)

            console.log('-----------------------------')
            console.log("selected date = ", roundedDate)

            console.log('ex = ', new Date(newdata[0].date))

            let values = newdata.filter(e => new Date(e.date).getTime() === roundedDate.getTime())
            console.log(values)

            let circles = d3.selectAll(".mouse-per-line")
            if (values.length) {
                circles
                    .transition()
                    .duration(500)
                    .attr('opacity', 1)
                    .attr("transform", function (d, i) {
                        let v = values.find(e => e.station === d)

                        d3.select(this).select('text')
                            .style('font-size', '11px')
                            .text(v.temp);

                        return `translate(${mouse[0]}, ${y(parseFloat(v.temp))})`
                    });
            } else {
                circles.transition().duration(500).attr('opacity', 0)
            }
        });


    function roundMinutes(date) {

        date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
        date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

        return new Date(date);
    }


}


const LineChart = {
    data: [],
    drawRegionLineChart : (newdata, id, insee) => {

        let margin = { left: 40, right: 20, bottom: 20, top: 0 }
        var svgChart = d3.select(`svg#${id}`)
    
        let width = svgChart.node().parentNode.clientWidth,
            height = svgChart.node().parentNode.clientHeight;
    
        if (id != "brush-chart") height -= 80;
    
        //console.log(width, height)
    
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
    
        //console.log("newdata = ",newdata);
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
    },

    drawStationLineChart : (newdata, id, current_region) => {
    
        color.domain(newdata[0].station).range(colorbrewer.Set2[6]);
        
        //map date year of newdate into a new array

    
        let margin = { left: 40, right: 20, bottom: 20, top: 0 };
        var svgChart = d3.select(`svg#${id}`);
    
        let width = svgChart.node().parentNode.clientWidth,
            height = svgChart.node().parentNode.clientHeight;
    
        if (id != "brush-chart") height -= 80;
    
        //console.log(width, height)
    
        svgChart.selectAll('g').remove()
        svgChart.selectAll("text").remove()
    
        svgChart.attr('width', width)
            .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
        var region = current_region;
    
        var sumstat = d3.nest()
            .key(d => d.date.slice(0,4))
            .entries(newdata);
    
        //console.log("sumstat", sumstat);
    
        //console.log("newdata = ",newdata)
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
                    endpoint.query(QueryObservationsByDate(current_region, xDate.split('T')[0])).done((json) => {
                        // legend exists
                        if (d3.select('svg#chart-legend-hour2').selectAll('g').empty()) {
                            stationnames = json.results.bindings.map(d => d.station.value)
                            LineChart.drawLegend(stationnames, newdata[0].region, "chart-legend-hour2", date)
                        } else {
                            // change title
                        }
                        stationnames = json.results.bindings.map(d => d.station.value)
                        stationnames = stationnames.filter((d, i) => stationnames.indexOf(d) === i)
                        LineChart.drawLegend(stationnames, newdata[0].region, "chart-legend-hour2", date)
                        onSuccessMember3HourlyTemp(json)
                    });
                })
    
            })
        // new array of sumstat.keys
        let yearsRange = sumstat.map(d => d.key);
        LineChart.drawLegend(yearsRange, newdata[0].region, "chart-legend-hour1",undefined,newdata[0].station);
    },
    
    updateLineChart: (yearsSelected) => {
        //console.log(LineChart.data)
        let newData = LineChart.data.filter(d => d.date.includes(yearsSelected[0]) || d.date.includes(yearsSelected[1]) || d.date.includes(yearsSelected[2])
            || d.date.includes(yearsSelected[3]) || d.date.includes(yearsSelected[4]) || d.date.includes(yearsSelected[5]));
        //console.log("newData", newData);
        LineChart.drawStationLineChart(newData, "line-chart-hour1", "chart-legend-hour1");
    },

    drawLegend : (yearsRange, region, id, date, stationName) => {

        //console.log("stationName", stationName);
        d3.select("svg#" + id).selectAll('text').remove()
        
        // add SVG legend             
        var svglegend = d3.select("svg#" + id);
    
        svglegend.selectAll('g').remove()
    
        let legendGroup = svglegend.selectAll('g')
            .data(yearsRange)
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
                .html("Air Temperatures Per Year (Region: " + region + ")" + "  " + date + "(J-1, J+1)");
        }
        else {
            legendGroup.append("text")
                .attr("x", 350)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .text(`${stationName} Air Temperatures (Region: ${region})}`);
            }
    }
};

// fit the SVG element to leaflet's map layer
function reset() {
    bounds = path.bounds(regions);
    
    var topLeft = bounds[0],
    bottomRight = bounds[1];
    
    svg.attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");
    
    g .attr("transform", "translate(" + -topLeft[0] + "," 
                                    + -topLeft[1] + ")");
    
    // initialize the path data	
    d3_features.attr("d", path)
                .style("fill-opacity", 0.2);
                //.attr('fill','blue');
} 





// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}






var map = L.map('map').setView([47,2], 5);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

// Add an SVG element to Leaflet’s overlay pane
var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

var path;  
var transform = d3.geoTransform({point: projectPoint}),
path = d3.geoPath().projection(transform);

// create path elements for each of the features
d3_features = g.selectAll("path")
                .data(regions.features) //utile ou non ?
                .enter()
                .append("path")
                .attr("d", path)
                .classed('map-border', true)
                .style("fill-opacity", 0.2)

map.on("viewreset", reset);
reset();








function onSuccessStation(json) {
    
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    
    var latSelected = 47;
    var longSelected = 2;
    var zoom = 5;

    for (var b in json.results.bindings) {
        var icon = new L.Icon.Default();
        icon.options.shadowSize = [0,0];

        var station = json.results.bindings[b][json.head.vars[0]];
        var stationName = json.results.bindings[b][json.head.vars[1]];
        var lat = json.results.bindings[b][json.head.vars[2]];
        var long = json.results.bindings[b][json.head.vars[3]];

        if(stationName.value != textStation) {
            icon.options.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png';
        }
        else{
            icon.options.iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
            latSelected = lat.value;
            longSelected = long.value;
            zoom = 8;
        }

        L.marker([lat['value'], long['value']], {icon: icon})
            .addTo(map)
            .bindPopup(stationName['value'])
            .on("click", function() {
                this.closePopup();
                document.getElementById("select-station").value = this._popup._content;
                stationChanged();
            })
            .addEventListener("mouseover", function() {
                this.openPopup();
            })
            .addEventListener("mouseout", function() {
                this.closePopup();
            });
    }
    
    map.setView([latSelected, longSelected], zoom);
}



// ----- AFFICHAGE GRAPHE EN CLIQUANT SUR UNE STATION ----- //

// .on('click', function(event, d){
//     //console.log(this._popup._content);
    
//     /*
//     endpoint.query(buildQuery_slices1(current_region))
//     .done(function (json) {
//         //console.log("new data = ", regions.features[d].properties.code, json)
//         // onSuccessMember4(json, 'month', regions.features[d].properties.code)
//         console.log(json);
//         drawCharts(json, current_region);
//     });
//     */
//     let stationSelected = this._popup._content;
//     endpoint.query(build_queryByYearOnStation(stationSelected))
//     .done(function (json) {
//         //console.log("new data = ", regions.features[d].properties.code, json)
//         // onSuccessMember4(json, 'month', regions.features[d].properties.code)
//         //console.log("Le json de la querry :");
//         //console.log(json);
        
//         let newdata = json.results.bindings.map(d => {
//             return {
//                 date: d.date.value,
//                 station: d.stationName.value,
//                 temp_avg: d.temp_avg.value,
//                 region : current_region_name
//             }
//         });
//         console.log(newdata)
//         LineChart.data = newdata;
//         LineChart.drawStationLineChart(newdata,"brush-chart",current_region_code);
//         LineChart.drawStationLineChart(newdata,"line-chart-hour1",current_region_code);
//         drawBrush("brush-chart")    
//         if(boolean){
//             CheckBoxList.setUpCheckBox(["2017","2018","2019","2020","2021"]);
//             boolean = false;
//         }
//         else{
//         }
//         //drawCharts(json, current_region);
//     });
// });
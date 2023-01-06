SPARQL =  function(o) {
    this.query = function(q) {
        return $.ajax({
            url: o.endpoint,
            accepts: {json: "application/sparql-results+json"},
            data: {query: q, apikey: o.apikey},
            dataType: "json", 
            method: "POST",
        });
    };

    this.queryTurtle = function(q) {
        return $.ajax({
            url: o.endpoint,
            accepts: {turtle: "text/turtle"},
            data: {query: q, apikey: o.apikey},
            method: "POST",
        });
    }

    this.queryCSV = function(q) {
        return $.ajax({
            url: o.endpoint,
            accepts: {csv: "text/csv"},
            data: {query: q, apikey: o.apikey},
            method: "POST",
        });
    }
};





var endpoint = new SPARQL({ 
    apikey: "YOUR-API-KEY-HERE", 
    endpoint: "https://weakg.i3s.unice.fr/sparql"
    //endpoint: "http://localhost:8890/sparql"
});





function stationLoad() {

    var option = document.createElement("option");
    option.text = "--Please choose an option--";
    document.getElementById("select-station").appendChild(option);

    endpoint.query(listWeatherStation()).done((json) => {
        stationnames = json.results.bindings.map(d => d.name.value)
        stationnames.forEach(element => {
            option = document.createElement("option");
            option.value = element;
            option.text = element.charAt(0).toUpperCase() + element.slice(1);
            document.getElementById("select-station").appendChild(option);
        });
        stationChanged();
    });
}





var textStation, valueStation;
function stationChanged() {
    let selectStation;
    selectStation = document.getElementById("select-station");
    textStation = selectStation.options[selectStation.selectedIndex].text;
    valueStation = selectStation.options[selectStation.selectedIndex].value;
    endpoint.query(buildQuery_station()).done(onSuccessStation);
    
    document.getElementById("localisation-choose").innerHTML = "Station selected : " + textStation;
}





function zoomToFrance(){
    map.setView([47, 2], 5);
}

function zoomToStPierreEtMiquelon(){
    map.setView([46.8, -56.2], 9);
}

function zoomToReunionMayotte(){
    map.setView([-18, 48], 5);
}

function zoomToGuadeloupeMartinique(){
    map.setView([16.25, -61.583333], 7);
}

function zoomToGuyane(){
    map.setView([4.0, -53.0], 7);
}





var parameters = [];
function checkParameters(param) {
    if(document.getElementById(param).checked) {
        parameters.push(param);
    } else {
        parameters = parameters.filter(function(item) {
            return item !== param;
        });
    }

    document.getElementById("parameters-choose").innerHTML = "Parameters selected : " + parameters;
}





var startDate = "2016-01-01";
var endDate = "2021-12-31";
function dateChanged() {
    startDate = (document.getElementById("start").value);
    endDate = (document.getElementById("end").value);

    document.getElementById("date-choose").innerHTML = "Start: " + startDate + "</br>End: " + endDate;
}




function createFileRDF(stationName, startDate, endDate) {
    console.log("stationName: " + stationName + " startDate: " + startDate + " endDate: " + endDate) 
    endpoint.queryTurtle(buildQuery_extractData(stationName, startDate, endDate)).done((turtle) => {
        // console.log(turtle);
        downloadFileRDF(turtle);
    });
}

function downloadFileRDF(text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'export.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}



function createFileJSON(stationName, startDate, endDate) {
    console.log("stationName: " + stationName + " startDate: " + startDate + " endDate: " + endDate) 
    endpoint.query(buildQuery_extractData(stationName, startDate, endDate)).done((json) => {
        json = JSON.stringify(json, null, 2);
        // console.log(json);
        downloadFileJSON(json);
    });
}


function downloadFileJSON(text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'export.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}



function createFileCSV(stationName, startDate, endDate) {
    console.log("stationName: " + stationName + " startDate: " + startDate + " endDate: " + endDate) 
    endpoint.queryCSV(buildQuery_extractData(stationName, startDate, endDate)).done((csv) => {
        csv = csv.replace(/;/g, ',');
        console.log(csv);
        downloadFileCSV(csv);
    });
}

function downloadFileCSV(text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'export.csv');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
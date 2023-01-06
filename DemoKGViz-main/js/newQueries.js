function listWeatherStation() {
    let query = `
    prefix weo:        <http://ns.inria.fr/meteo/ontology/> 
    prefix rdfs:       <http://www.w3.org/2000/01/rdf-schema#>

    SELECT  ?name  where { 
        ?station a weo:WeatherStation; rdfs:label ?name .
    }
    
    ORDER BY ?name
    `;
    return query;
}





function buildQuery_stationID(stationName) {
    let queryStations = `
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX geosparql:  <http://www.opengis.net/ont/geosparql#> 
    SELECT distinct * WHERE {
     
        
        ?station rdfs:label ?stationName;  geo:lat ?lat; geo:long ?long .
        VALUES ?stationName{"`+ stationName +`" }  
    }
    `
    return queryStations
    
}





function buildQuery_station() {
    let queryStations = `
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX geosparql:  <http://www.opengis.net/ont/geosparql#> 
    SELECT distinct * WHERE {
     
        
        ?station rdfs:label ?stationName;  geo:lat ?lat; geo:long ?long .
    }
    `
    return queryStations
    
}





function buildQuery_meanTempStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT distinct  ?stationName ?date  ?temp_avg  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
    
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:avgDailyTemperature ?temp_avg; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
        FILTER (?date >=xsd:date("`+ startDate +`"))
        FILTER (?date <=xsd:date("`+ endDate +`"))
    }
    
    ORDER BY ?date

    `

    return query;
}





function buildQuery_maxTempStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT distinct  ?stationName ?date  ?temp_max  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
    
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:maxDailyTemperature ?temp_max; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
        FILTER (?date >=xsd:date("`+ startDate +`"))
        FILTER (?date <=xsd:date("`+ endDate +`"))
           }
    
    ORDER BY ?date
    `

    return query;
}





function buildQuery_minTempStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT distinct  ?stationName ?date  ?temp_min  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
    
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:minDailyTemperature ?temp_min; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
        FILTER (?date >=xsd:date("`+ startDate +`"))
        FILTER (?date <=xsd:date("`+ endDate +`"))
           }
    
    ORDER BY ?date
    `

    return query;
}



function buildQuery_avgMaxTempStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT distinct  ?stationName ?dateDebPeriod ?dateFinPeriod (AVG(?temp_max) as ?AvgTmax)  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        VALUES ?dateDebPeriod {"`+ startDate +`"}
        VALUES ?dateFinPeriod {"`+ endDate +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
        
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:maxDailyTemperature ?temp_max; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
   
       FILTER (?date >=xsd:date(?dateDebPeriod))
       FILTER (?date <=xsd:date(?dateFinPeriod))
    }
    GROUP BY ?stationName  ?dateDebPeriod ?dateFinPeriod 
    `

    return query;
}





function buildQuery_avgMinTempStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT distinct  ?stationName ?dateDebPeriod ?dateFinPeriod (AVG(?temp_min) as ?AvgTmin)  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        VALUES ?dateDebPeriod {"`+ startDate +`"}
        VALUES ?dateFinPeriod {"`+ endDate +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
        
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:minDailyTemperature ?temp_min; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
   
       FILTER (?date >=xsd:date(?dateDebPeriod))
       FILTER (?date <=xsd:date(?dateFinPeriod))
    }
    GROUP BY ?stationName  ?dateDebPeriod ?dateFinPeriod 
    `

    return query;
}





function buildQuery_avgMeanTempStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT distinct  ?stationName ?dateDebPeriod ?dateFinPeriod (AVG(?temp_mean) as ?AvgTmean)  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        VALUES ?dateDebPeriod {"`+ startDate +`"}
        VALUES ?dateFinPeriod {"`+ endDate +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
        
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:avgDailyTemperature ?temp_mean; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
   
       FILTER (?date >=xsd:date(?dateDebPeriod))
       FILTER (?date <=xsd:date(?dateFinPeriod))
    }
    GROUP BY ?stationName  ?dateDebPeriod ?dateFinPeriod 
    `

    return query;
}






function buildQuery_dailyCumulativePrecipitation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT distinct  ?stationName ?date ?rainfall WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
    
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
        FILTER (?date >=xsd:date("`+ startDate +`"))
        FILTER (?date <=xsd:date("`+ endDate +`"))
    }
    
    ORDER BY ?date
    `

    return query;
}




function buildQuery_nbWetDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX weo:  <http://ns.inria.fr/meteo/ontology/>

    select ?stationName (sum(if(?wetDays>60.0, 1, 0)) as ?nbWetDays) where
    {
        select ?date ?stationName (avg(?v) as ?wetDays) where
        {
            ?obs a  <http://ns.inria.fr/meteo/ontology/MeteorologicalObservation>;
            sosa:observedProperty <http://ns.inria.fr/meteo/vocab/weatherproperty/airRelativeHumidity> ;
            sosa:hasSimpleResult ?v;
            wep:madeByStation ?station ;
            sosa:resultTime ?t .
            ?station rdfs:label ?stationName ; weo:stationID ?stationID .
            BIND(xsd:date(?t) as ?date)
            FILTER(?t>= xsd:date("`+ startDate +`"))
            FILTER(?t < xsd:date("`+ endDate +`"))
            VALUES ?stationName{"`+ stationName +`"}
        }
    }

    group by ?stationName
    order by ?stationName
    `
    return query;
}






function buildQuery_dailyThermalAmplitude(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT distinct  ?stationName ?date ((?temp_max - ?temp_min) as ?thermalAmplitude) WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
    
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:minDailyTemperature ?temp_min; 
        wes-measure:maxDailyTemperature ?temp_max; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
        FILTER (?date >=xsd:date("`+ startDate +`"))
        FILTER (?date <=xsd:date("`+ endDate +`"))
    }
    
    ORDER BY ?date
    `

    return query;
}





function buildQuery_rainyDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    select ?stationName ?dateDebPeriod ?dateFinPeriod (sum(if(?rainfall >0.0, 1, 0)) as ?nbRainyDays) 
    where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName ?rainfall  where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
            a qb:Observation ;
            wes-attribute:observationDate ?date ;
            wes-measure:rainfall24h ?rainfall] .
            ?station a weo:WeatherStation ; rdfs:label ?stationName.
            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))

        }
 
    }
    `
    return query;
}




function buildQuery_cumulativePrecipitation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    select ?stationName ?dateDebPeriod ?dateFinPeriod (SUM(?rainfall) as ?sum_rainfall) where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName ?rainfall  where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
            a qb:Observation ;
            wes-attribute:observationDate ?date ;
            wes-measure:rainfall24h ?rainfall] .
            ?station a weo:WeatherStation ; rdfs:label ?stationName.
            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))
        }

    }
    `
    return query;
}





function buildQuery_nbColdDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select ?stationName  ?dateDebPeriod ?dateFinPeriod (sum(if(?temp_min<0.0, 1, 0)) as ?nbCold ) where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName ?temp_min where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
            a qb:Observation ;
            wes-attribute:observationDate ?date ;
            wes-measure:minDailyTemperature ?temp_min; 
            wes-measure:rainfall24h ?rainfall] .
            ?station a weo:WeatherStation ; rdfs:label ?stationName.
            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))
        }
    }
    `
    return query;
}






function buildQuery_nbFrostDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select ?stationName  ?dateDebPeriod ?dateFinPeriod (sum(if(?temp_max<0.0, 1, 0)) as ?nbFrost ) where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName ?temp_max where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
            a qb:Observation ;
            wes-attribute:observationDate ?date ;
            wes-measure:maxDailyTemperature ?temp_max; 
            wes-measure:rainfall24h ?rainfall] .
            ?station a weo:WeatherStation ; rdfs:label ?stationName.
            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))
        }
    }
    `
    return query;
}






function buildQuery_nbWindDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX wep: <http://ns.inria.fr/meteo/ontology/property/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX weo:  <http://ns.inria.fr/meteo/ontology/>

    select ?stationName ?dateDebPeriod ?dateFinPeriod (sum(if(?windSpeed >5.28, 1, 0)) as ?nbWindDays) where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName (MAX(?v) as ?windSpeed) where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?obs a  <http://ns.inria.fr/meteo/ontology/MeteorologicalObservation>;
            sosa:observedProperty <http://ns.inria.fr/meteo/vocab/weatherproperty/windAverageSpeed> ;
            sosa:hasSimpleResult ?v;
            wep:madeByStation ?station;
            sosa:resultTime ?t .
            ?station rdfs:label ?stationName ; weo:stationID ?stationID .

            BIND(xsd:date(?t) as ?date)

            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))

        }
    }

    `
    return query;
}





function buildQuery_nbSummerDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select ?stationName  ?dateDebPeriod ?dateFinPeriod (sum(if(?temp_max>25.0, 1, 0)) as ?nbSummer ) where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName ?temp_max where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
            a qb:Observation ;
            wes-attribute:observationDate ?date ;
            wes-measure:maxDailyTemperature ?temp_max; 
            wes-measure:rainfall24h ?rainfall] .
            ?station a weo:WeatherStation ; rdfs:label ?stationName.
            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))
        }
    }
    `
    return query;
}





function buildQuery_nbStressDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select ?stationName  ?dateDebPeriod ?dateFinPeriod (sum(if(?temp_min>20.0, 1, 0)) as ?nbHeat ) where
    {
        select ?date ?dateDebPeriod ?dateFinPeriod  ?stationName ?temp_min where
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?dateDebPeriod {"`+ startDate +`"}
            VALUES ?dateFinPeriod {"`+ endDate +`"}

            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
            a qb:Observation ;
            wes-attribute:observationDate ?date ;
            wes-measure:minDailyTemperature ?temp_min; 
            wes-measure:rainfall24h ?rainfall] .
            ?station a weo:WeatherStation ; rdfs:label ?stationName.
            FILTER (?date >=xsd:date(?dateDebPeriod))
            FILTER (?date <=xsd:date(?dateFinPeriod))
        }
    }
    `
    return query;
}





function buildQuery_degreeDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT distinct  ?stationName ?date  (?temp_avg - 10) as ?growingDegree  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
    
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:avgDailyTemperature ?temp_avg; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
        FILTER (?date >=xsd:date("`+ startDate +`"))
        FILTER (?date <=xsd:date("`+ endDate +`"))
    }
    ORDER BY ?date
    `
    return query;
}





function buildQuery_cumulativeDegreeDaysStation(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT distinct  ?stationName ?dateDebPeriod ?dateFinPeriod (sum(?temp_mean - 10) as ?sumGrowingDegree)  WHERE
    {
        VALUES ?stationName {"`+ stationName +`"}
        VALUES ?dateDebPeriod {"`+ startDate +`"}
        VALUES ?dateFinPeriod {"`+ endDate +`"}
        ?s  a qb:Slice ;
        wes-dimension:station ?station  ;
        
        wes-dimension:year ?year;
        qb:observation [
        a qb:Observation ;
        wes-attribute:observationDate ?date ;
        wes-measure:avgDailyTemperature ?temp_mean; 
        wes-measure:rainfall24h ?rainfall] .
        ?station a weo:WeatherStation ; rdfs:label ?stationName.
   
       FILTER (?date >=xsd:date(?dateDebPeriod))
       FILTER (?date <=xsd:date(?dateFinPeriod))
    }
    `
    return query;
}




function buildQuery_extractData(stationName, startDate, endDate) {
    let query = `
    PREFIX wes: <http://ns.inria.fr/meteo/observationslice/>
    PREFIX weo: <http://ns.inria.fr/meteo/ontology/>
    PREFIX qb:  <http://purl.org/linked-data/cube#>
    PREFIX wes-dimension: <http://ns.inria.fr/meteo/observationslice/dimension#>
    PREFIX wes-measure: <http://ns.inria.fr/meteo/observationslice/measure#>
    PREFIX wes-attribute: <http://ns.inria.fr/meteo/observationslice/attribute#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct:   <http://purl.org/dc/terms/> 

    CONSTRUCT 
    {
        ?uriDataset a qb:DataSet ; dct:issued ?issueDate ; 
        qb:slice ?uriSlice1 .
        ?uriSlice1  a qb:Slice; 
        wes-dimension:station ?station;
        wes-dimension:periodStartDate ?periodStartDate; 
        wes-dimension:periodEndDate ?periodEndDate; 
        qb:observation  [
            a qb:Observation ; qb:dataSet  ?uriDataset ;
            wes-attribute:observationDate ?date ; 
            wes-measure:minDailyTemperature ?temp_min ; 
            wes-measure:maxDailyTemperature ?temp_max ;
            wes-measure:avgDailyTemperature ?temp_avg; 
            wes-measure:rainfall24h ?rainfall;  
            wes-measure:dailyRangeTemperature ?tdiff ; 
            wes-measure:gdd ?gdd 
        ].

    } 
    WHERE {
        SELECT distinct ?issueDate ?uriDataset ?uriSlice1 ?station ?date  ?periodStartDate ?periodEndDate ?temp_avg ?temp_min  ?temp_max (?temp_max -  ?temp_min) as ?tdiff  ?rainfall ?gdd 
        WHERE
        {
            VALUES ?stationName {"`+ stationName +`"}
            VALUES ?periodStartDate {"`+ startDate +`"}
            VALUES ?periodEndDate {"`+ endDate +`"}
            ?s  a qb:Slice ;
            wes-dimension:station ?station  ;
        
            wes-dimension:year ?year;
            qb:observation [
                a qb:Observation ;
                wes-attribute:observationDate ?date ;
                wes-measure:minDailyTemperature ?temp_min; 
                wes-measure:maxDailyTemperature ?temp_max; 
                wes-measure:avgDailyTemperature ?temp_avg; 
                wes-measure:rainfall24h ?rainfall]  .
                
            ?station a weo:WeatherStation ; rdfs:label ?stationName; weo:stationID ?stationID .
            BIND( IF( xsd:float(?temp_avg) > 10.0 , xsd:float(?temp_avg) - 10.0, xsd:float(1))  as ?gdd)
            #BIND (?periodStartDate  as xsd:date("2021-02-01")
            #BIND (?periodStartDate  as xsd:date("2021-02-01")
            BIND(xsd:date(NOW()) AS ?issueDate)
            FILTER (?date >=xsd:date(?periodStartDate))
            FILTER (?date <=xsd:date(?periodEndDate))
            BIND(URI(CONCAT("http://ns.inria.fr/meteo/observationslice/",?periodStartDate, "_", ?periodEndDate, "/slice_",str(?stationID ))) as ?uriSlice1  )
            BIND(URI(CONCAT("http://ns.inria.fr/meteo/dataset/",?periodStartDate, "_", ?periodEndDate, "/dataset_",str(?stationID ))) as ?uriDataset  )
        }
        ORDER BY ?date
    }
    `
    return query;
}












/*



FILTER(?t>= xsd:date("2021-08-01"))
FILTER(?t < xsd:date("2021-08-07"))
VALUES ?stationName{"AJACCIO"}




FILTER(?t>= xsd:date("`+ startDate +`"))
FILTER(?t < xsd:date("`+ endDate +`"))
VALUES ?stationName{"`+ stationName +`"} 


*/
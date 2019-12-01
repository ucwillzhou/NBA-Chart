/*
CPSC 583

 */
window.onload = function(){
    setUp();
};

var _data;
var WIDTH = 1650;
var HEIGHT = 2300;
var flag = true;
var rightXPad = 150;
var yPad = 101;
var xPos = 1350;
var yPos = 2000;
var teamId1 = ["atl", "bos", "bkn", "cha", "chi", "cle", "dal", "den", "det", "gsw", "hou", "ind", "lac",
    "lal", "mem", "mia", "mil", "min", "nop", "nyk", "okc", "orl", "phi", "phx", "por", "sac", "sas", "tor", "uta", "was", " "].map (v => v.toUpperCase());

function setUp() {
    d3.csv("nba-stats.csv").then(function (data) {
        _data = data;
        bubbleChart();
    });
}

//https://www.youtube.com/watch?v=lPr60pexvEM
//Function that draws bubbles
function bubbleChart(){
    //color scale
    var colorScale = d3.scaleOrdinal(d3["schemeTableau10"]);

    //setup a svg container and give an id vis
    //append svg to the body
    svgContainer = d3.select("body")
        .append("svg")
        .attr("id", "vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

// setup our x scale
    //domain is from 0% to 55%
    var xScale = d3.scaleLinear()
        .domain([0,55])
        .range([0, 1100]);
    var xAxis = d3.axisBottom(xScale);

// setup our y sccale
    //domain is all the nba teams
    var yScale = d3.scalePoint()
        .domain(teamId1)
        .range([0, 2100])
    var yAxis = d3.axisLeft(yScale);


    //move our Y-axis to the right and a little down
    svgContainer.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + rightXPad + "," + 100 + ")")
        .call(yAxis);
    //move our X-axis to the right and bottom
    svgContainer.append("g")
        .attr("class", "xAxis")
        .attr("id", "3PT-Axis")
        .attr("transform", "translate(" + rightXPad + "," + (2200) + ")")
        .call(xAxis);

    //x axis label
    svgContainer.append("text")
        .attr("class", "xLabel")
        .text("Shooting Percentage (%)")
        .attr("x", 650)
        .attr("y", 2275);
    //title label
    svgContainer.append("text")
        .attr("class", "xLabel")
        .text("Title Goes Here")
        .attr("x", 650)
        .attr("y", 50);

    svgContainer.append("text")
        .attr("class", "yLabel")
        .text("NBA Teams")
        .attr("x", -1200)
        .attr("y", 50)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")


    createImage(svgContainer);

//http://bl.ocks.org/d3noob/38744a17f9c0141bcd04
    //draws circles given input data
    svgContainer.selectAll("circle")
        .data(_data)
        .enter()
        .append("circle")
        .attr("id", function (d) {
            return d.Team;
        })
        .attr("r", function (d) {
            return d.AveragePoints;
        })
        .attr("cx", function (d) {
            return xScale(d.ThreePointPercentage) + rightXPad;
        })
        .attr("cy", function (d) {
            return yScale(d.Team) + yPad;
        })
        .style("fill", function (d) {
            return "url(#" + d.Team.toLowerCase() + ")"
            //return colorScale(d.Team)
        })
        .attr("opacity", 0.7)
        .on("click", function (d) {
            console.log(d)
        })
        .on("mouseover", function (d) {
            tooltip.style("display", null)
        })
        .on("mouseout", function (d) {
            tooltip.style("display", "none")
        })
        .on("mousemove", function (d) {
            var x = d3.mouse(this)[0] - 15
            var y = d3.mouse(this)[1] - 25
            tooltip.attr("transform", "translate(" + x + "," + y + ")")
            tooltip.select("text").text(d.Player)
        });


    //Button for representing data as free throw percentage
    svgContainer.append("rect")
        .attr("id", "buttonTwo")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos + 75)
        .attr("y", yPos - 50)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#73a9de")
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection
            d3.select("#buttonOne").attr("opacity", 0.5)        //and highlight the button so we know its selected
            flag = false; //this flag will help us keep track of the data presented 3pt or ft
            console.log(flag);
            var xScaleFT = d3.scaleLinear()
                .domain([0,100])
                .range([0, 1200]);

            svgContainer.selectAll("circle")
                .data(_data)
                .transition()
                .duration(1300)
                .attr("cx", function (d) {
                    return xScaleFT(d.FreeThrowPercentage) + rightXPad;
                })
            var xScaleFT = d3.scaleLinear()
                .domain([0,90])
                .range([0, 1100]);

            var parent = document.getElementById("vis")
            var child = parent.getElementsByClassName("xAxis")[0];
            parent.removeChild(child);

            var newXAxis = d3.axisBottom(xScaleFT);
            svgContainer.append("g")
                .attr("class", "xAxis")
                .attr("id", "3PT-Axis")
                .attr("transform", "translate(" + rightXPad + "," + (2200) + ")")
                .call(newXAxis);
        })
    svgContainer.append("text")
        .attr("class", "buttonLabel")
        .attr("x", xPos + 100)
        .attr("y", yPos - 20)
        .text("FT")

    svgContainer.append("rect")
        .attr("id", "buttonOne")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos - 25)
        .attr("y", yPos - 50)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 1)
        .style("fill", "#73a9de")
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection
            d3.select("#buttonTwo").attr("opacity", 0.5)        //and highlight the button so we know its selected
            flag = true;
            console.log(flag)
            var xScale3PT = d3.scaleLinear()
                .domain([0,55])
                .range([0, 1100]);

            svgContainer.selectAll("circle")
                .data(_data)
                .transition()
                .duration(1300)
                .attr("cx", function (d) {
                    return xScale3PT(d.ThreePointPercentage) + rightXPad;
                })
            var parent = document.getElementById("vis")
            var child = parent.getElementsByClassName("xAxis")[0];
            parent.removeChild(child);

            var newXXAxis = d3.axisBottom(xScale3PT);
            svgContainer.append("g")
                .attr("class", "xAxis")
                .attr("id", "FT-Axis")
                .attr("transform", "translate(" + rightXPad + "," + (2200) + ")")
                .call(newXXAxis);
        })
    svgContainer.append("text")
        .attr("class", "buttonLabel")
        .attr("x", xPos - 5)
        .attr("y", yPos - 20)
        .text("3PT")


    sortConf(svgContainer);

    var tooltip = svgContainer.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    //add a border to our hover texts
    tooltip.append("text")
        .attr("x", 43)
        .attr("dy", "1.0em")
        .style("opacity", 1)
        .style("font-size", "1.45em");

    createLegend(svgContainer);
}

function createImage(svgContainer) {

    var teamId = ["dal", "gsw", "atl", "bos", "bkn", "cha", "chi", "cle", "den", "hou", "det", "ind", "lac",
        "lal", "mem", "mia", "mil", "min", "nop", "nyk", "okc", "phi", "por", "phx", "orl", "sac", "sas", "tor", "uta", "was"];
    //create a def for each image we have
    for(i = 0; i < teamId.length; i++){
        var defs = svgContainer.append("defs")
        defs.append("pattern")
            .attr("id", teamId[i])
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", "1")
            .attr("width", "1")
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xLink")
            .attr("xlink:href", "Pic/" + teamId[i] + ".png");
    }
}
//need to refacor this function later
//function that adds 3 buttons, All, East, West
//on each button click it will sort teams based on All, East, West teams
function sortConf(svgContainer){

    var eastTeams = ["ATL", "BOS", "BKN", "CHA", "CHI", "CLE", "DET", "IND", "MIA", "MIL", "NYK",
        "ORL", "PHI", "TOR", "WAS", " "];

    var westTeams = ["DAL", "DEN", "GSW", "HOU", "LAC", "LAL", "MEM", "MIN", "NOP", "OKC", "PHX",
        "POR", "SAC", "SAS", "UTA", " "];

    //refactor this later
    var yScaleEast = d3.scalePoint()
        .domain(eastTeams)
        .range([0, 2100]);


    var yScaleWest = d3.scalePoint()
        .domain(westTeams)
        .range([0, 2100]);

    var xScaleFT = d3.scaleLinear()
        .domain([0,100])
        .range([0, 1200]);

    var xScale = d3.scaleLinear()
        .domain([0,55])
        .range([0, 1100]);

    var yScale = d3.scalePoint()
        .domain(teamId1)
        .range([0, 2100]);


    //eastern conf button
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonThree")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos + 175)
        .attr("y", yPos + 20)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#73a9de")
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection;
            d3.select("#buttonFour").attr("opacity", 0.5)
            d3.select("#buttonFive").attr("opacity", 0.5)
            //FIRST remake the axis to fit the eastern teams
            svgContainer.selectAll("circle")
                .data(_data)
                .transition()
                .duration(1300)
                .attr("cx", function (d) {
                    if(flag == true ) {
                        return xScale(d.ThreePointPercentage) + rightXPad;                      //if the flag is set to true it means we are moving based on three point percentage
                    }
                    else{
                        return xScaleFT(d.FreeThrowPercentage) + rightXPad;                     //else free throw percentage
                    }
                })
                .attr("cy", function (d) {
                    if(eastTeams.includes(d.Team)){
                        return yScaleEast(d.Team) + yPad;                                   //now scale the eastern conf team
                    }
                    if(westTeams.includes(d.Team)){                                             //hide all the western conf teams
                        return -1000;
                    }
                });

            var parent = document.getElementById("vis")                                 //we remove the axis to update it
            var child = parent.getElementsByClassName("yAxis")[0];
            parent.removeChild(child);

            var newYAxis = d3.axisLeft(yScaleEast);                                             //here we append the new y axis
            svgContainer.append("g")
                .attr("class", "yAxis")
                .attr("id", "Team-Axis")
                .attr("transform", "translate(" + rightXPad + "," + 100 + ")")
                .call(newYAxis);

        })
    svgContainer.append("text")                                                                    //text that labels our buttons
        .attr("class", "buttonLabel")
        .attr("x", xPos + 195)
        .attr("y", yPos + 50)
        .text("East")

    //-----------------------------------------------------------
    //this will be the western conf button
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonFour")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos + 75)
        .attr("y", yPos + 20)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#73a9de")
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection;
            d3.select("#buttonThree").attr("opacity", 0.5)
            d3.select("#buttonFive").attr("opacity", 0.5)
            //FIRST remake the axis to fit the eastern teams
            svgContainer.selectAll("circle")
                .data(_data)
                .transition()
                .duration(1300)
                .attr("cx", function (d) {
                    if(flag == true ) {
                        return xScale(d.ThreePointPercentage) + rightXPad;                      //if the flag is set to true it means we are moving based on three point percentage
                    }
                    else{
                        return xScaleFT(d.FreeThrowPercentage) + rightXPad;                     //else free throw percentage
                    }
                })
                .attr("cy", function (d) {
                    if(westTeams.includes(d.Team)){
                        return yScaleWest(d.Team) + yPad;                                  //now scale the eastern conf team
                    }
                    if(eastTeams.includes(d.Team)){                                             //hide all the western conf teams
                        return -1000;
                    }
                });

            var parent = document.getElementById("vis")                                 //we remove the axis to update it
            var child = parent.getElementsByClassName("yAxis")[0];
            parent.removeChild(child);

            var newYAxis = d3.axisLeft(yScaleWest);                                             //here we append the new y axis
            svgContainer.append("g")
                .attr("class", "yAxis")
                .attr("id", "Team-Axis")
                .attr("transform", "translate(" + rightXPad + "," + 100 + ")")
                .call(newYAxis);

        })
    svgContainer.append("text")                                                                    //text that labels our buttons
        .attr("class", "buttonLabel")
        .attr("x", xPos + 93)
        .attr("y", yPos + 50)
        .text("West")

    //-----------------------------------------------------------------------------
    //HEre we wiill add an All button that shows all the teams
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonFive")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos - 25)
        .attr("y", yPos + 20)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 1)
        .style("fill", "#73a9de")
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection;
            d3.select("#buttonThree").attr("opacity", 0.5)      //change highlight color of our buttons
            d3.select("#buttonFour").attr("opacity", 0.5)
            //FIRST remake the axis to fit the eastern teams
            svgContainer.selectAll("circle")
                .data(_data)
                .transition()
                .duration(1300)
                .attr("cx", function (d) {
                    if(flag == true ) {
                        return xScale(d.ThreePointPercentage) + rightXPad;                      //if the flag is set to true it means we are moving based on three point percentage
                    }
                    else{
                        return xScaleFT(d.FreeThrowPercentage) + rightXPad;                     //else free throw percentage
                    }
                })
                .attr("cy", function (d) {
                    return yScale(d.Team) + yPad
                });

            var parent = document.getElementById("vis")                                 //we remove the axis to update it
            var child = parent.getElementsByClassName("yAxis")[0];
            parent.removeChild(child);

            var newYAxis = d3.axisLeft(yScale);                                             //here we append the new y axis
            svgContainer.append("g")
                .attr("class", "yAxis")
                .attr("id", "Team-Axis")
                .attr("transform", "translate(" + rightXPad + "," + 100 + ")")
                .call(newYAxis);

        })
    svgContainer.append("text")                                                                    //text that labels our buttons
        .attr("class", "buttonLabel")
        .attr("x", xPos - 5)
        .attr("y", yPos + 50)
        .text("All");
}


function createLegend(svgContainer) {

    var averagePoints = [40,30,20,10]
    y = 1500
    svgContainer.selectAll("a")
        .data(averagePoints)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return "legendCircle" + d.toString();
        })
        .attr("r", function (d) {
            return d;
        })
        .attr("cx", 1350)
        .attr("cy", function (d) {
            return y +=75;
        })
        .attr("opacity", 0.6)
        .style("fill", "#44c4eb");
    y = 1500
    svgContainer.selectAll("legendText")
        .data(averagePoints)
        .enter()
        .append("text")
        .attr("class", function (d) {
            return "legendCircle" + d.toString();
        })
        .attr("x", 1400)
        .attr("y", function (d) {
            return y+=77;
        })
        .text(function (d) {
            return d + " Average Points"
        })
}

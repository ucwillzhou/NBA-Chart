/*
CPSC 583

 */
window.onload = function(){
    setUp();
};
//define global variables
var _data;
var WIDTH = 1900;
var HEIGHT = 2300;
var flag = true;
var rightXPad = 295;
var yPad = 100;
var xPos = 1510;
var yPos = 2060;
var tempList = [];
//image.png
var teamId = ["atl", "bos", "bkn", "cha", "chi", "cle", "dal", "den", "det", "gsw", "hou", "ind", "lac",
    "lal", "mem", "mia", "mil", "min", "nop", "nyk", "okc", "orl", "phi", "phx", "por", "sac", "sas", "tor", "uta", "was"];

var teamId1 = ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
    "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat",
    "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City", "Orlando Magic", "Philadelphia 76ers",
    "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards", " "];

var yScale = d3.scalePoint()
    .domain(teamId1)
    .range([0, 2100])

var xScale = d3.scaleLinear()
    .domain([0,55])
    .range([0, 1100]);

var filter = [];

function setUp() {
    d3.csv("nbaStats.csv").then(function (data) {
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
    var xAxis = d3.axisBottom(xScale);

// setup our y sccale
    //domain is all the nba teams
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
        .attr("x", 750)
        .attr("y", 2275);
    //title label
    svgContainer.append("text")
        .attr("class", "xLabel")
        .text("NBA Teams and Their Shooting Percentages (3PT/FT)")
        .attr("x", 750)
        .attr("y", 50);

    svgContainer.append("text")
        .attr("class", "yLabel")
        .text("NBA Teams")
        .attr("x", -1100)
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
            return (d.Team).replace(/\s+/g,'');
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
            return "url(#" + (d.Team).replace(/\s+/g, '') + ")"
            //var string = (d.Team).replace(/\s+/g, '');
            //console.log(string)
            //return colorScale(string)
        })
        .attr("opacity", 0.7)
        .on("click", function (d) {})
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

    //draw a border around our 3PT and FT buttons
    svgContainer.append("g")
        .append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", xPos - 15)
        .attr("y", yPos  - 20)
        .attr("width", 300)
        .attr("height", 150)
        .style("opacity", 1)
        .attr("stroke", "black")
        .attr("stroke-width", "3px")
        .attr("fill", "white");


    //Button for representing data as free throw percentage
    svgContainer.append("rect")
        .attr("id", "buttonTwo")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos + 100)
        .attr("y", yPos)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#73a9de")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection
            d3.select("#buttonOne").attr("opacity", 0.5)        //and highlight the button so we know its selected
            flag = false; //this flag will help us keep track of the data presented 3pt or ft
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
        .attr("x", xPos + 125)
        .attr("y", yPos + 30)
        .text("FT")

    svgContainer.append("rect")
        .attr("id", "buttonOne")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 1)
        .style("fill", "#73a9de")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection
            d3.select("#buttonTwo").attr("opacity", 0.5)        //and highlight the button so we know its selected
            flag = true;
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
        .attr("x", xPos + 20)
        .attr("y", yPos + 30)
        .text("3PT")

    createLegendBorder(svgContainer);
    sortConf(svgContainer);         //function that will add buttons so we can sort based off of west or east conf
    createLegend(svgContainer);        //function that makes the average points legend
    createRadioButtons(svgContainer);


    var tooltip = svgContainer.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    //add a border to our hover texts
    tooltip.append("text")
        .attr("x", 43)
        .attr("dy", "1.0em")
        .style("opacity", 1)
        .style("font-size", "1.45em");


}

//function that create defs and patterns for our images
function createImage(svgContainer) {

        //array containing our image paths

    //create a def for each image we have
    for(i = 0; i < teamId1.length - 1; i++){
        var defs = svgContainer.append("defs")
        defs.append("pattern")
            .attr("id", (teamId1[i]).replace(/\s+/g, ''))
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", "1")
            .attr("width", "1")
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xLink")
            .attr("xlink:href", "Pic/" +  teamId[i] + ".png");
    }
}
//need to refacor this function later
//function that adds 3 buttons, All, East, West
//on each button click it will sort teams based on All, East, West teams
function sortConf(svgContainer){

    var eastTeams = ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Detroit Pistons",
        "Indiana Pacers", "Miami Heat", "Milwaukee Bucks", "New York Knicks", "Orlando Magic", "Philadelphia 76ers", "Toronto Raptors", "Washington Wizards", " "];

    var westTeams = ["Dallas Mavericks", "Denver Nuggets", "Golden State Warriors", "Houston Rockets", "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies",
        "Minnesota Timberwolves", "New Orleans Pelicans", "Oklahoma City", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Utah Jazz", " "];

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
        .attr("x", xPos + 200)
        .attr("y", yPos + 70)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#73a9de")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection;
            d3.select("#buttonFour").attr("opacity", 0.5)
            d3.select("#buttonFive").attr("opacity", 0.5)

            //clear the buttons if this is click
            svgContainer.selectAll("#buttons")
                .style("opacity", 1)
            filter = [];

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
                        return -4000;
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
        .attr("x", xPos + 220)
        .attr("y", yPos + 100)
        .text("East")

    //-----------------------------------------------------------
    //this will be the western conf button
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonFour")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos + 100)
        .attr("y", yPos + 70)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#73a9de")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection;
            d3.select("#buttonThree").attr("opacity", 0.5)
            d3.select("#buttonFive").attr("opacity", 0.5)

            //clear the buttons if this is click
            svgContainer.selectAll("#buttons")
                .style("opacity", 1)
            filter = [];

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
        .attr("x", xPos + 118)
        .attr("y", yPos + 100)
        .text("West")

    //-----------------------------------------------------------------------------
    //Here we wiil add an All button that shows all the teams
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonFive")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos)
        .attr("y", yPos + 70)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 1)
        .style("fill", "#73a9de")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {
            d3.select(this).attr("opacity", 1)                  //change selection;
            d3.select("#buttonThree").attr("opacity", 0.5)      //change highlight color of our buttons
            d3.select("#buttonFour").attr("opacity", 0.5)

            //clear the buttons if this is click
            svgContainer.selectAll("#buttons")
                .style("opacity", 1)
                filter = [];

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
        .attr("x", xPos + 25)
        .attr("y", yPos + 100)
        .text("All");
}


//function that will create our legend
//size is based off of average salary
function createLegend(svgContainer) {
    var averagePoints = [40,30,20,10]
    y = 400
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
        .attr("cx", xPos + 25)
        .attr("cy", function (d) {
            return y +=75;
        })
        .attr("opacity", 1)
        .style("stroke", "black")
        .style("fill", "#40c985");
    y = 400
    svgContainer.selectAll("legendText")
        .data(averagePoints)
        .enter()
        .append("text")
        .attr("class", function (d) {
            return "legendCircle" + d.toString();
        })
        .attr("x", xPos + 75)
        .attr("y", function (d) {
            return y+=77;
        })
        .text(function (d) {
            return "= " + d + " Avg Points"
        })
}

function createRadioButtons(svgContainer) {
    var leftStackButtons = ["Atlanta Hawks", "Charlotte Hornets", "Dallas Mavericks", "Golden State Warriors", "Los Angeles Clippers", "Miami Heat", "New Orleans Pelicans", "Orlando Magic",
        "Portland Trail Blazers", "Toronto Raptors"];
    var middleStackButtons = ["Brooklyn Nets", "Chicago Bulls", "Denver Nuggets", "Houston Rockets", "Los Angeles Lakers", "Milwaukee Bucks", "New York Knicks", "Philadelphia 76ers",
        "Sacramento Kings", "Utah Jazz"];
    var rightStackButtons = ["Boston Celtics", "Cleveland Cavaliers", "Detroit Pistons", "Indiana Pacers", "Memphis Grizzlies", "Minnesota Timberwolves", "Oklahoma City", "Phoenix Suns",
        "San Antonio Spurs", "Washington Wizards"];
    var temp = teamId1;
    temp.pop();

    //call function to draw our buttons
    drawButtons(svgContainer, leftStackButtons, middleStackButtons, rightStackButtons);


    //create a radio button to confirm selection of the filtered teams
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonSix")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos)
        .attr("y", 1880)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#aeaeae")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {

            if(filter.length != 0) {
                //temp variable to get rid of " " in teamId1 so we can compute the difference between temp and filtersole.log(temp)

                //want to remove all duplicates just in case of user error
                filter = [...new Set(filter)];
                filter.sort();
                filter.push("")

                tempList = temp.filter(x => !filter.includes(x));

                var calcAxisRange = (70 * filter.length)
                var calcAxisMove = (70 * tempList.length)
                //from those two list i will construct a new axis
                var yScaleFilter = d3.scalePoint()
                    .domain(filter)
                    .range([0, calcAxisRange]);


                //select all circles
                svgContainer.selectAll("circle")
                    .data(_data)
                    .transition()
                    .duration(1300)
                    .attr("cx", function (d) {
                        var xScaleFT = d3.scaleLinear()
                            .domain([0, 140])
                            .range([0, 1200]);
                        if (flag == true) {
                            return xScale(d.ThreePointPercentage) + rightXPad;                      //if the flag is set to true it means we are moving based on three point percentage
                        } else {
                            return xScaleFT(d.FreeThrowPercentage) + rightXPad;                     //else free throw percentage
                        }
                    })
                    .attr("cy", function (d) {
                        if (filter.includes(d.Team)) {
                            return yScaleFilter(d.Team) + (yPad + calcAxisMove - 70);                                  //now scale the eastern conf team
                        }
                        if (tempList.includes(d.Team)) {                                             //hide all the western conf teams
                            return -4000;
                        }
                    });

                var parent = document.getElementById("vis")                                 //we remove the axis to update it
                var child = parent.getElementsByClassName("yAxis")[0];
                parent.removeChild(child);
                var newYAxis = d3.axisLeft(yScaleFilter);                                             //here we append the new y axis

                svgContainer.append("g")
                    .attr("class", "yAxis")
                    .attr("id", "Team-Axis")
                    .attr("transform", "translate(" + rightXPad + "," + (calcAxisMove + 30) + ")")
                    .call(newYAxis);
                filter.pop()    //remove the " " element so our y axis doesnt start on x axis

            }

        })
    svgContainer.append("text")                                                                    //text that labels our buttons
        .attr("class", "buttonLabel")
        .attr("x", xPos + 12)
        .attr("y", 1912)
        .text("Select");
//-------------------------------------------------------------------
//create a radio button to confirm clear selection of the filtered teams
    svgContainer.append("rect")
        .data(_data)
        .attr("id", "buttonSeven")
        .attr("rx", 11)
        .attr("ry", 11)
        .attr("x", xPos + 120)
        .attr("y", 1880)
        .attr("height", 50)
        .attr("width", 70)
        .attr("opacity", 0.5)
        .style("fill", "#aeaeae")
        .on("mouseover", function () {
            d3.select(this).style("stroke-width", 4).style("stroke", "black")
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (d) {
            svgContainer.selectAll("#buttons")
                .style("opacity", 1)
            filter = [];

        })

    svgContainer.append("text")                                                                    //text that labels our buttons
        .attr("class", "buttonLabel")
        .attr("x", xPos + 136)
        .attr("y", 1912)
        .text("Clear");
}


function  drawButtons(svgContainer, leftStackButtons, middleStackButtons, rightStackButtons) {

    var listOfButtons = []
    listOfButtons.push(leftStackButtons);
    listOfButtons.push(middleStackButtons);
    listOfButtons.push(rightStackButtons);
    var buttonPad = 0;
    var buttonPadX = 60;
    for(var i = 0; i < listOfButtons.length; i++){
        //console.log(listOfButtons[i])
        svgContainer.selectAll(("chartOne" + i).toString())
            .data(listOfButtons[i])
            .enter()
            .append("circle")
            .attr("id", "buttons")
            .attr("class", function (d) {
                return d;
            })
            .attr("r", 30)
            .attr("cx", xPos - 30 + buttonPadX)
            .attr("cy", function () {
                buttonPad+=68
                return buttonPad + (yPos - 910)
            })
            .style("stroke", "rgba(255,128,0,0)")
            .style("stroke-width", 5)
            .style("fill", function(d, i) {
                return "url(#" + (d).replace(/\s+/g, '') + ")";
            } )
            .on("mouseover", function () {
                d3.select(this).style("stroke-width", 4).style("stroke", "black")
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke", "none");
            })
            .on("click", function (d) {
                filter.push(d);
                d3.select(this).style("opacity", 0.5)
            });
        buttonPad = 0; //reset var back to 0 to use for padding
        buttonPadX+= 65;
    }


}

function createLegendBorder(svgContainer) {

    //draw a border around our radio buttons
    svgContainer.append("g")
        .append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", xPos - 15)
        .attr("y", yPos - 900)
        .attr("width", 220)
        .attr("height", 790)
        .style("opacity", 1)
        .attr("stroke", "black")
        .attr("stroke-width", "3px")
        .attr("fill", "white");

    //draw a border around our bubble size legend
    svgContainer.append("g")
        .append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", xPos - 25)
        .attr("y", yPos - 1690)
        .attr("width", 300)
        .attr("height", 300)
        .style("opacity", 1)
        .attr("fill", "black")
        .attr("fill", "#bac5d6");

    //add a title to the legend
    svgContainer.append("g")
        .append("text")
        .attr("x", xPos + 45)
        .attr("y", yPos - 1650)
        .attr("font-size", 30)
        .attr("font", "sans-serif")
        .text("Bubble Size")

    //add a text for the interactions
    svgContainer.append("g")
        .append("text")
        .attr("x", xPos - 40)
        .attr("y", yPos - 920)
        .attr("font-size", 30)
        .attr("font", "sans-serif")
        .text("Filter by Specfic Team")


    //add a text for the interactions
    svgContainer.append("g")
        .attr("class", "description")
        .append("text")
        .attr("x", xPos)
        .attr("y", yPos - 40)
        .text("Organize by")


    svgContainer.append("g")
        .attr("class", "description")
        .append("text")
        .attr("x", xPos - 30)
        .attr("y", 100)
        .text("Comparison between Team's shooting")

    svgContainer.append("g")
        .attr("class", "description")
        .append("text")
        .attr("x", xPos - 30)
        .attr("y", 125)
        .text("percentages, the players average points")

    svgContainer.append("g")
        .attr("class", "description")
        .append("text")
        .attr("x", xPos - 30)
        .attr("y", 150)
        .text("are represented by size of circle.")

    svgContainer.append("g")
        .attr("class", "description")
        .append("text")
        .attr("x", xPos - 30)
        .attr("y", 175)
        .text("Teams can be organized by western or")

    svgContainer.append("g")
        .attr("class", "description")
        .append("text")
        .attr("x", xPos - 30)
        .attr("y", 200)
        .text("eastern conference or by specific teams")
}

/*
*	Project: IT680 - Software Engineering Project
* 	Author:  Dan Salmon
* 	Contact: https://danthesalmon.com/contact
* 	License: MIT
*/

// FIRST_LAST_INITIALS, LONG_DESC, COL_DIV_CODE, JOB_TITLE, 
// TENURE_DEC_YR_MO, EMPT_STATE_DATE,BASE,YTD
var csvData; 

$(document).ready(init());

function init() {
	loadData();
}


function loadData() {
	$.ajax({
        type: "GET",
        url: "data_sampled.csv",
        dataType: "text",
        success: function(data) {
        	csvData = $.csv.toObjects(data);
        	// csvData.map(function(d) {
        	// 	d["BASE"] = d["BASE"].replace("$", "");
        	// })
        	// var csvKeys = Object.keys(csvData[0]);
        	// console.log(csvKeys);

			for (var i = csvData.length - 1; i >= 0; i--) {
				if (csvData[i]["BASE"] !== undefined) {
					csvData[i]["BASE"] = Number(csvData[i]["BASE"].replace("$", "").replace(",",""));
				}
			}

        	console.log(csvData);
        	graph(csvData);
        },
        error: function(data) {
        	console.log("[loadData] Error loading data: ", data);
        }
     });
}


function graph(data) {
	d3.select(".chart")
	.selectAll("div")
	.data(data)
		.enter()
		.append("div")
		.style("width", function(d) { return d["BASE"] / 1000 + "px"; })
		.text(function(d) { return d["BASE"]; });
}

function toNumber(string) {
	return Number(string.replace("$", ""))
}
/*
*	Project: IT680 - Software Engineering Project
* 	Author:  Dan Salmon
* 	Contact: https://danthesalmon.com/contact
* 	License: MIT
*/

/* global d3, localStorage, $, moment */ // <- Make linter happy


var csvData; 

const graphSample = [
	{
		COL_DIV_CODE: 'Academic Affairs',
		BASE: 67778.9,
	},
	{
		COL_DIV_CODE: 'Finance and Administration',
		BASE: 75000.1,
	},
	{
		COL_DIV_CODE: 'Arts and Humanities, College of',
		BASE: 68109.0,
	},
];

function loadData(handleData) {
	if (localStorage.getItem("csvData") !== null) {
		console.log("Using csvdata from LocalStorage...");
		handleData(JSON.parse(localStorage.getItem("csvData")));
	} else {
		$.ajax({
	        type: "GET",
	        url: "data/data_sampled.csv",
	        dataType: "text",
	        success: function(data) {
				csvData = $.csv.toObjects(data);
				for (var i = csvData.length - 1; i >= 0; i--) {
					if (csvData[i]["BASE"] !== undefined) {
						csvData[i]["BASE"] = Number(csvData[i]["BASE"].replace("$", "").replace(",",""));
					}
					if (csvData[i]["YTD"] !== undefined) {
						csvData[i]["YTD"] = Number(csvData[i]["YTD"].replace("$", "").replace(",",""));
					}
				}
				localStorage.setItem("csvData", JSON.stringify(csvData));
				handleData(csvData);
	        },
	        error: function(data) {
	        	console.log("[loadData] Error loading data: ", data);
	        }
		});
	}
}

function createTable(csvData) {
	console.log(csvData);
	// Initialize DataTable
    var table = $('#salary-table').DataTable( {
		data: csvData,
		"columns": [
			{ "data": "FIRST_LAST_INITIALS", "title": "Initials"},	
			{ "data": "LONG_DESC", "title": "Description"},
			{ "data": "COL_DIV_CODE", "title": "Department"},
			{ "data": "JOB_TITLE", "title": "Job Title"},
			{ "data": "TENURE_DEC_YR_MO", 
				"title": "Tenure Date",
				"render": function(data, type, row){
                	if(type === "sort" || type === "type" || data == ""){
                    	return data;
                	}
                	return moment(data, "YYYYMM").format("MMMM YYYY")
            	}			
			},
			{ "data": "EMPT_STATE_DATE", 
				"title": "Start Date",
				"render": function(data, type, row){
                	if(type === "sort" || type === "type" || data == ""){
                    	return data;
                	}
                	return moment(data, "YYYYMMDD").format("MMM DD, YYYY")
				}
			},
			{ "data": "BASE", 
				"title": "Base",
				"render": renderMoney
			},
			{ "data": "YTD",
				"title": "YTD",
				"render": renderMoney
			},
		],
		orderCellsTop: true,
		fixedHeader: true,
		//responsive: true
	});
	
	/**
	 * Add column filtering 
	 * https://datatables.net/extensions/fixedheader/examples/options/columnFiltering.html
	 */
	var num_columns = $('#salary-table thead tr:eq(0) th').length;
	$('#salary-table thead').append('<tr></tr>');
	for (var i=0; i < num_columns; i++) {
		$('#salary-table thead tr:eq(1)').append('<th></th>');
	}
    $('#salary-table thead tr:eq(1) th').each( function (i) {
    	if (i == 0) {
    		$(this).html( '<input type="text" class="table-search width-0" placeholder="Search" />' );
    	} else if (i == 4 || i == 5 || i == 6 || i == 7) {
    		$(this).html( '<input type="text" class="table-search width-1" placeholder="Search" />' );
    	} else {
    		$(this).html( '<input type="text" class="table-search" placeholder="Search" />' );
    	}
        
		
        $( 'input', this ).on( 'keyup change', function () {
			if ( table.column(i).search() !== this.value ) {
				table
				.column(i)
				.search( this.value )
				.draw();
            }
        } );
    } );
}

function graph(data) {
	d3.select(".chart")
	.selectAll("div")
	.data(data)
		.enter()
		.append("div")
		.style("width", function(d) { return d["BASE"] / 100 + "px"; })
		.text(function(d) { return d["BASE"]; });
}

function graph2(data) {
	/*
	*	https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
	*/
	
	const heightMargin = 30;
	const widthMargin = 300;
    const width = 1200 - 2 * widthMargin;
    const height = 1000 - 2 * heightMargin;
    
    const maxObj = data.reduce(function(max, obj) {
    	// https://stackoverflow.com/a/35690350/2307994
		return obj.avg_base > max.avg_base? obj : max;
	});
	
	const svg = d3.select('svg#bar-chart');
	const chart = svg.append('g')
    .attr('transform', `translate(${widthMargin}, ${heightMargin})`);
    
    // Draw X axis
	const xScale = d3.scaleLinear()
	    .range([width, 0])
	    .domain([maxObj.avg_base, 0]);

	chart.append('g')
	    .attr('transform', `translate(0, 0)`)
	    .attr('class', 'x-axis')
	    .call(d3.axisTop(xScale));
    
    // Draw Y axis
    const yScale = d3.scaleBand()
	    .range([0, height])
	    .domain(data.map((s) => s.COL_DIV_CODE))
	    .padding(0.2);
	    
	var axisLeft = d3.axisLeft(yScale).tickFormat(function(d) {return d;});

	chart.append('g')
	    .attr('transform', `translate(0, 0)`)
	    .attr('class', 'y-axis')
	    .call(d3.axisLeft(yScale).tickFormat(function(d) {return cleanCollegeName(d); }));
	    
	d3.selectAll(".y-axis .tick text")
		.attr("class", "bar-label"); // Add a class to the bar labels 
	
	// Draw gridlines - vertical
	chart.append('g')
	    .attr('class', 'grid')
	    .call(d3.axisTop()
	        .scale(xScale)
	        .tickSize(-height, 0, 0)
	        .tickFormat(''));
	
	// Draw bars
	chart.selectAll()
	    .data(data)
	    .enter()
	    .append('rect')
	    .attr("class","bar")
	    .attr('style', 'fill: steelblue')
	    .attr('y', (s) => yScale(s.COL_DIV_CODE))
	    .attr('x', 0)
	    // .attr('width', (s) => width - xScale(s.BASE))
	    .attr('width', (s) => xScale(s.avg_base))
	    .attr('height', yScale.bandwidth());
	    
	// // Axis labels
	// svg.append('text')
	//     .attr('x', -(height / 2) - margin)
	//     .attr('y', margin / 2.4)
	//     .attr('transform', 'rotate(-90)')
	//     .attr('text-anchor', 'middle')
	//     .text('Base ($)');

	// svg.append('text')
	//     .attr('x', width / 2 + margin)
	//     .attr('y', height + 120)
	//     .attr('text-anchor', 'middle')
	//     .text('X Label');
	
	
	// Sort bars by value
	
	d3.select("#byValue").on("click", function() {
		data.sort(function(a,b) {
			return d3.descending(a.avg_base, b.avg_base);
		});
		
		yScale.domain(data.map(function(d) {
			return d.COL_DIV_CODE;
		}));
		
		svg.selectAll(".bar")
			.transition()
			.duration(500)
			.attr("y", function(d, i) {
				return yScale(d.COL_DIV_CODE);
			});
			
		chart.select('g.y-axis')
			.transition()
				.duration(500)
			.call(axisLeft);
	});
	
	d3.select("#byCollege").on("click", function() {
		data.sort(function(a,b) {
			return d3.descending(a.COL_DIV_CODE, b.COL_DIV_CODE);
		});	
		
		yScale.domain(data.map(function(d) {
			return d.COL_DIV_CODE;
		}));
		
		svg.selectAll(".bar")
			.transition()
			.duration(500)
			.attr("y", function(d, i) {
				return yScale(d.COL_DIV_CODE);
			});
			
		chart.select('g.y-axis')
			.transition()
				.duration(500)
			.call(axisLeft);
	});
}

function graphAverages(data) {
	/*
	*	https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
	*/
	
	const margin = 80;
    const width = 1200 - 2 * margin;
    const height = 600 - 2 * margin;
    
    const maxObj = data.reduce(function(max, obj) {
    	// https://stackoverflow.com/a/35690350/2307994
		return obj.avg_base > max.avg_base? obj : max;
	});
	
	const svg = d3.select('svg');
	const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
    
    // Draw Y scale
    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, maxObj.avg_base]);
    
    chart.append('g')
    	.call(d3.axisLeft(yScale));
    
    // Draw X scale
    const xScale = d3.scaleBand()
	    .range([0, width])
	    .domain(data.map((s) => s.COL_DIV_CODE))
	    .padding(0.2);

	chart.append('g')
	    .attr('transform', `translate(0, ${height})`)
	    .call(d3.axisBottom(xScale))
	    .selectAll("text")
		    .style("text-anchor", "end")
	        .attr("dx", "-.8em")
	        .attr("dy", ".15em")
	        .attr("transform", "rotate(-35)");
	    
	// Draw gridlines - horizontal
	chart.append('g')
	    .attr('class', 'grid')
	    .call(d3.axisLeft()
	        .scale(yScale)
	        .tickSize(-width, 0, 0)
	        .tickFormat(''))
	
	// Draw bars
	chart.selectAll()
	    .data(data)
	    .enter()
	    .append('rect')
	    .attr('style', 'fill: steelblue')
	    .attr('x', (s) => xScale(s.COL_DIV_CODE))
	    .attr('y', (s) => yScale(s.avg_base))
	    .attr('height', (s) => height - yScale(s.avg_base))
	    .attr('width', xScale.bandwidth());
	    
	// Axis labels
	svg.append('text')
	    .attr('x', -(height / 2) - margin)
	    .attr('y', margin / 2.4)
	    .attr('transform', 'rotate(-90)')
	    .attr('text-anchor', 'middle')
	    .text('Base ($)');

	// svg.append('text')
	//     .attr('x', width / 2 + margin)
	//     .attr('y', height + 120)
	//     .attr('text-anchor', 'middle')
	//     .text('X Label');
}

function renderMoney(data, type, row) {
	if(type === "sort" || type === "type" || data == "") {
		return data;
	}
	return "$" + formatMoney(data,2, ".", ",");
}

function formatMoney(n, c, d, t) {
	/** https://stackoverflow.com/a/149099/2307994 **/
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function groupByCollege(data) {
	let averages = {};
	for (var i = 0, len = data.length; i < len; i++) {
		let element = data[i];
		
		if (averages[element.COL_DIV_CODE] == undefined) {
			averages[element.COL_DIV_CODE] = {};
			averages[element.COL_DIV_CODE]["sum"] = element.BASE;
			averages[element.COL_DIV_CODE]["count"] = 1;
		} else {
			averages[element.COL_DIV_CODE]["sum"] += element.BASE;
			averages[element.COL_DIV_CODE]["count"] += 1;
		}
		averages[element.COL_DIV_CODE]["average"] = averages[element.COL_DIV_CODE]["sum"] / averages[element.COL_DIV_CODE]["count"];
	}
	
	let returnAverages = [];
	for(var college in averages) {
		let collegeItem = {};
		collegeItem["COL_DIV_CODE"] = cleanCollegeName(college);
		collegeItem["avg_base"] = averages[college]["average"];
		returnAverages.push(collegeItem);
	}
	console.log(returnAverages);
	
	return returnAverages;
}

function findObjectByCollegeName(name, data) {
	for (var i=0;i<data.length;i++) {
		if (data[i].COL_DIV_CODE == name) {
			return data[i]
		}
	}
}

function cleanCollegeName(name) {
	// Take in college name like: 'Education, College of' 
	// and return 'College of Education'
	
	let matches = name.match(/,.+ of/g);
	
	if (matches === null) {
		return name;
	}
	
	return name.substr(name.lastIndexOf(",")+1, name.length).trim() + " " + // College of
			name.substr(0, name.lastIndexOf(","));							// Education (etc.)
}
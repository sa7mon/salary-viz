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
        url: "data/data_sampled.csv",
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
			createTable();
        	// graph(csvData);
        },
        error: function(data) {
        	console.log("[loadData] Error loading data: ", data);
        }
     });
}

function createTable() {
	
	var headerLabels = {
		"FIRST_LAST_INITIALS": "Initials",
		"LONG_DESC": "Description",
		"COL_DIV_CODE": "Department",
		"JOB_TITLE": "Job Title",
		"TENURE_DEC_YR_MO": "Tenure Date",
		"EMPT_STATE_DATE": "Start Date",
		"BASE": "Base",
		"YTD": "YTD",
	};

	// Add table headers
	var csvKeys = Object.keys(csvData[0]);
	csvKeys.forEach(key => {
		var heading = `<th>${headerLabels[key]}</th>`;
		$("table thead tr").append(heading);
	});

	// Add table rows
	csvData.forEach(csvRow => {
		var row = `<tr>`;
		csvKeys.forEach(key => {
			row += `<td>${csvRow[key]}</td>`;
		});
		row += `</tr>`;
		$("table tbody").append(row);
	});

	// Initialize DataTable
	// $('#salary-table').DataTable();

	/**
	 * Add column filtering 
	 * https://datatables.net/extensions/fixedheader/examples/options/columnFiltering.html
	 */

	// Setup - add a text input to each footer cell
    // $('#salary-table thead tr').clone(true).appendTo( '#salary-table thead' );
    // $('#salary-table thead tr:eq(1) th').each( function (i) {
    //     var title = $(this).text();
    //     $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
 
    //     $( 'input', this ).on( 'keyup change', function () {
    //         if ( table.column(i).search() !== this.value ) {
    //             table
    //                 .column(i)
    //                 .search( this.value )
    //                 .draw();
    //         }
    //     } );
    // } );
 
    // var table = $('#salary-table').DataTable( {
    //     orderCellsTop: true,
	// 	   fixedHeader: true,
	// 	responsive: true
	// });

	var table = $('#salary-table').DataTable( {
		responsive: false,
    } );
 
    new $.fn.dataTable.FixedHeader( table );
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

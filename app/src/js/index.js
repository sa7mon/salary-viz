/*
*	Project: IT680 - Software Engineering Project
* 	Author:  Dan Salmon
* 	Contact: https://danthesalmon.com/contact
* 	License: MIT
*/

// FIRST_LAST_INITIALS, LONG_DESC, COL_DIV_CODE, JOB_TITLE, 
// TENURE_DEC_YR_MO, EMPT_STATE_DATE,BASE,YTD
var csvData; 

// $(document).ready(init());

// function init() {
// 	loadData();
// }


function loadData(handleData) {
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
			}
			handleData(csvData);
        },
        error: function(data) {
        	console.log("[loadData] Error loading data: ", data);
        }
	 });
}

function createTable(csvData) {
	
	// Initialize DataTable
    var table = $('#salary-table').DataTable( {
		data: csvData,
		"columns": [
			{ "data": "FIRST_LAST_INITIALS", "title": "Initials"},	
			{ "data": "LONG_DESC", "title": "Description"},
			{ "data": "COL_DIV_CODE", "title": "Department"},
			{ "data": "JOB_TITLE", "title": "Job Title"},
			{ "data": "TENURE_DEC_YR_MO", "title": "Tenure Date"},
			{ "data": "EMPT_STATE_DATE", "title": "Start Date"},
			{ "data": "BASE", "title": "Base"},
			{ "data": "YTD", "title": "YTD"},
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
		.style("width", function(d) { return d["BASE"] / 1000 + "px"; })
		.text(function(d) { return d["BASE"]; });
}

function toNumber(string) {
	return Number(string.replace("$", ""))
}

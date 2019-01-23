/*
*	Project: IT680 - Software Engineering Project
* 	Author:  Dan Salmon
* 	Contact: https://danthesalmon.com/contact
* 	License: MIT
*/

var csvData; 

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
				if (csvData[i]["YTD"] !== undefined) {
					csvData[i]["YTD"] = Number(csvData[i]["YTD"].replace("$", "").replace(",",""));
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
	// console.log(csvData);
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
		.style("width", function(d) { return d["BASE"] / 1000 + "px"; })
		.text(function(d) { return d["BASE"]; });
}

function toNumber(string) {
	return Number(string.replace("$", ""))
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
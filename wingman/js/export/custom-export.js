$(document).ready(function() {
	//export selected to csv file
	$(document).on('click', '#cn-export-all-selected-csv', function(e){		
	  e.preventDefault();
	  $('#menu-options-column-number').hide();  

	  $("#main-table").tableToCSVSelected({  
              filename: 'selected-records'  
      });  
	});	

	//export selected asin to csv file
	$(document).on('click', '.cn-copy-asin-all-selected', function(e){
	  	e.preventDefault();
	  	$('#menu-options-column-number').hide();  

    	$("#main-table").tableToCSVSelectedASIN({  
              filename: 'selected-records-asins'  
    	});  
	});	

	// export to csv file
	$(document).on('click', '#export-csv', function(e){
	 	e.preventDefault();
	    $("#main-table").tableToCSV({  
              filename: 'data-All'  
     	});  
	});
});	 
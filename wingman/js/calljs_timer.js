
			var p =  $( '#popuptable' ).fadeIn().promise(); 

			arrayOfArrays.forEach( function( el, i ) {				
		    //setTimeout(function () {				  		  			    	
		        p = p.then( function() {
		            return $.ajax( {
		                type        : 'POST',		                
		                url         : _apiUrl+"extension/getpopupdata.php",		                
		                data        : {asin: el}, 
		                beforeSend: function() {					      
					        $("#popuptable").find('#loading_data').show();		
					    },
					    complete: function() {
					        $("#popuptable").find('#loading_data').hide();	
					    }, 
		            }).then( 
		                function(responseJson) {		                	
		                    productInfos = $.parseJSON(responseJson);
			        		var num=1;

			        		if(productInfos.length == 0){
			        			$("#popuptable").find('#loading_data').show();	
			        		}

							$.each(productInfos.all_products, function(k, productInfo) {
								var sale = 0;
								var revenue = 0;

								var sales = calculateSales('com',productInfo.category, productInfo.rank, productInfo.price);

								if(sales){
									sale = sales[0];
								}else{
									$(this).find('.estimatedCol').text('N/A');
								}

								if(sales){
									revenue = sales[1];
								}else{
									$(this).find('.estimatedRevenueCol').text('N/A');
								} 

								var num_zero = false;
								if(num < 10){
									num_zero = true;
								}

						    	var tr = '<tr>';	
						    	if(num_zero){					
									tr += '<td style="display:none;">0'+num+'</td>';		
								}else{
									tr += '<td style="display:none;">'+num+'</td>';		
								}

								if(productInfo.title){
									tr += '<td ><a title="'+productInfo.title+'" href="'+productInfo.title+'" target="_blank">'+productInfo.title.substring(0,10)+'</a></td>';		
								}else{
									tr += '<td>N/A</td>';
								}

								tr += '<td >'+productInfo.asin+'</td>';		
								tr += '<td>'+productInfo.brand+'</td>';		
								tr += '<td>'+productInfo.price+'</td>';		
								tr += '<td>'+productInfo.category+'</td>';		
								tr += '<td>'+productInfo.binding+'</td>';		
								tr += '<td>'+productInfo.rank+'</td>';		
								tr += '<td>'+sale+'</td>';		
								tr += '<td>'+revenue+'</td>';		
								tr += '<td>'+productInfo.review+'</td>';		
								tr += '<td>'+productInfo.rating+'</td>';		
								tr += '<td>'+productInfo.fullfillby+'</td>';		
								tr += '<td>'+productInfo.lqs+' / 100</td>';
								tr += '</tr>'
								$("#popuptable tbody").prepend(tr);	

								num++;														
							});	

							var tot =  $('#popuptable tbody tr').length;
			        		tot = parseInt(tot) - 1;
			        		$('#total_records').text(tot);							
		                } 		                
		            );

		            p.then( function() {                  
			            //$("#popuptable").find('#loading_data').hide();	
			        });
		        });	
		      //$("#popuptable").find('#loading_data').show();		       
		     // }, 40000 * (i + 1));  		  
		    });

var _apiUrl = "https://www.legendaryanalysis.com/";
$(document).ready(function() {	
	$('.light-bg').hide();

	if($.fn.DataTable.isDataTable('#main-table')){
		$('#main-table').DataTable().destroy();
	}
	$('#main-table tbody').empty();	

	$(document).click(function(e){
		var container = $(".toggle_btn");
	    // if the target of the click isn't the container nor a descendant of the container
	    if (!container.is(e.target) && container.has(e.target).length === 0) 
	    {
	        $('#menu-options-column-number').hide();
	    }
	});
	
    var checkSettins =  function(){   
    	//key refer to class and value refer to ID
		var myArray = {srCol: 'hasPopup', asinCol: 'ASIN', widthCol: 'Width_ne', heightCol: 'Height',parentAsinCol: 'ParentASIN',productNameCol:'Title',brandCol:'Brand',priceCol:'LowestRefurbishedPrice',publisherCol: 'ComposedRank',warrantyCol: 'Warranty',estimatedCol: 'EstSales',estimatedRevenueCol: 'EstRevenue',saleRankCol: 'SalesRank',fbaCol: 'FBATablefee',ratingCol: 'Rating',reviewCol: 'NumOfReviews',categoryCol: 'Category',imageCol:'Image',eanCol:'EAN',upcCol:'UPC',similarProductCol: 'SimilarProduct',studioCol:'Studio',manufacturerCol:'Manufacturer',numberSellerNewCol:'TotalNew',numberSellerUsedCol: 'TotalUsed',lowestPriceCol:'LowestNewPrice',numberSellerRefurbishedCol: 'TotalRefurbished',weightCol:'Weight',weightLbCol: 'WeightLB',bindingCol:'Binding',priceHistoryCol:'EvolutionPriceRank',partNumberCol:'PartNumber',packageQuantityCol: 'PackageQuantity',packageDimensionsCol:'PackageDimensions',editorialReviewCol: 'EditorialReview',mpnCol: 'MPN',fullSaleRankCol: 'fullsaleranks',languageCol:'Languages',releaseDateCol: 'ReleaseDate',publicationDateCol:'PublicationDate',authorCol:'Author',numberOfPagesCol:'NumberOfPages',formatCol:'Format',productGroupCol:'ProductGroup',isAadultProductCol:'IsAdultProduct',lowestUsedPriceCol:'LowestUsedPrice',bbSellerCol:'BBSeller',
			bbPriceCol:'BBPrice',modelCol:'Model',weightKgCol:'WeightKG',weightOzCol:'WeightOZ',bbShippingCostCol:'Shipping',bbPricePlusbbShippingCostCol:'ShippingAndPrice',lowestShippingCol:'LowestShipping',
			lowestPricePlusShippingCol:'LowestShippingAndPrice',breakEvenCostCol:'BreakEven'};

		var check = false;
		for (var key in myArray) {			
			if(localStorage.getItem(key)){
				check = true;
				return false;
			}	
		}		

		if(!check){
	       var showToMe = {srCol: 'hasPopup',productNameCol:'Title', asinCol: 'ASIN',brandCol:'Brand',estimatedCol: 'EstSales',estimatedRevenueCol: 'EstRevenue',saleRankCol: 'SalesRank',categoryCol: 'Category',imageCol:'Image',bbPriceCol:'BBPrice'			
			  };
		   
		   for (var key in showToMe) {	
		   	 localStorage.setItem(key, 'yes'); 		   	
			
		   }	
    	}	
    }

    checkSettins();

	//show default columns - initial all columns are active
	var hideDefaultColumn = function(){		
		//key refer to class and value refer to ID
		var myArray = {srCol: 'hasPopup', asinCol: 'ASIN', widthCol: 'Width_ne', heightCol: 'Height',parentAsinCol: 'ParentASIN',productNameCol:'Title',brandCol:'Brand',priceCol:'LowestRefurbishedPrice',publisherCol: 'ComposedRank',warrantyCol: 'Warranty',estimatedCol: 'EstSales',estimatedRevenueCol: 'EstRevenue',saleRankCol: 'SalesRank',fbaCol: 'FBATablefee',ratingCol: 'Rating',reviewCol: 'NumOfReviews',categoryCol: 'Category',imageCol:'Image',eanCol:'EAN',upcCol:'UPC',similarProductCol: 'SimilarProduct',studioCol:'Studio',manufacturerCol:'Manufacturer',numberSellerNewCol:'TotalNew',numberSellerUsedCol: 'TotalUsed',lowestPriceCol:'LowestNewPrice',numberSellerRefurbishedCol: 'TotalRefurbished',weightCol:'Weight',weightLbCol: 'WeightLB',bindingCol:'Binding',priceHistoryCol:'EvolutionPriceRank',partNumberCol:'PartNumber',packageQuantityCol: 'PackageQuantity',packageDimensionsCol:'PackageDimensions',editorialReviewCol: 'EditorialReview',mpnCol: 'MPN',fullSaleRankCol: 'fullsaleranks',languageCol:'Languages',releaseDateCol: 'ReleaseDate',publicationDateCol:'PublicationDate',authorCol:'Author',numberOfPagesCol:'NumberOfPages',formatCol:'Format',productGroupCol:'ProductGroup',isAadultProductCol:'IsAdultProduct',lowestUsedPriceCol:'LowestUsedPrice',bbSellerCol:'BBSeller',
			bbPriceCol:'BBPrice',modelCol:'Model',weightKgCol:'WeightKG',weightOzCol:'WeightOZ',bbShippingCostCol:'Shipping',bbPricePlusbbShippingCostCol:'ShippingAndPrice',lowestShippingCol:'LowestShipping',
			lowestPricePlusShippingCol:'LowestShippingAndPrice',breakEvenCostCol:'BreakEven'};

		for (var key in myArray) {	
				if(localStorage.getItem(key) == 'yes'){						
					$('#'+myArray[key]).prop('checked', true);			
					$('.'+key).show();
				}else {						
					$('#'+myArray[key]).prop('checked', false);
					$('.'+key).hide();

				}
		}
			
	}

	hideDefaultColumn();


	//append loader for the new content
	var appendLoader = function(){
		$('#total_records').html('<img src="../images/loader-upload_ajax.gif">');
		$('#avg_sale_rank').html('<img src="../images/loader-upload_ajax.gif">');
		$('#avg_reviews').html('<img src="../images/loader-upload_ajax.gif">');
		$('#avg_rating').html('<img src="../images/loader-upload_ajax.gif">');		
		$('#avg_new_price').html('<img src="../images/loader-upload_ajax.gif">');		

	  			var tr ='<tr>';
	                tr +='<td colspan="19" style="text-align:center;">';
	                tr +='<img height="150" width="150" src="../images/loaders.svg"></td>';  
	                tr +='</tr>';	        
		$("#main-table tbody").html(tr); 	
	}


	//define scrap function
	var startScrap = function(url) { 	
	    //chrome.storage.sync.get('user': user, 'userId':userId}   

		appendLoader();			
		$.ajax({
		    type: "get",	        
	        url: url,
	        success: function (item) {	
	 	    var asins = [];	

	 	    localStorage.removeItem('next_page');
	 	    localStorage.removeItem('paging');
			var paging = $(item).find('.pagnCur').next().find('a').attr('href');			
			localStorage.setItem('paging', paging); 

	 	    var text_box_val = $(item).find('#twotabsearchtextbox').val();	 	    
	 	    
	 	    if(text_box_val){
	 	    	$('#keyword_search').text(text_box_val);
	 		}else{
	 			$('#keyword_search').hide();
	 		}

	 	    //Get ASIN of li found on page
	        $(item).find('li').each(function(){		  	
	       		var asin = $(this).find("div").data("asin");       		
	       		asins.push(asin);	
		    });
		
			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		  	

			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		

			if($(item).length > 0){
				asins.push($('#ftSelectAsin').val());				
			}  	
			
			//Get ASIN of amazon homepage 
			$(item).find('.feed-carousel-shelf li').each(function(){		 
			  if($(this).data("asin") != '') {       		
	       		var data = $(this).data("sgproduct");		       		       		       		
	       		if(data != undefined){       			
	   			   asins.push(data.asin);
	       		}
	    	  }	
			});



	    	if(url){
				var a = url.split('dp/');		  
				if(a && a[1]){
			  		var b = a[1].split('/ref');
				  	if(b && b[0]){
				  	 asins.push(b[0]);		  
				    }
			    }
			 }



			$(item).find('.a-carousel li').each(function(){
			  var href = $(this).find('a').attr('href');
			  if(href){
				var a = href.split('product/');		  
				if(a && a[1]){
			  	 var b = a[1].split('/ref');
			  	if(b && b[0]){
			  	 asins.push(b[0]);		  
			    }
			    }
			  }
			});

	       	$(item).find('#s-results-list-atf li').each(function(){
	       	if($(this).data("asin") != '') {       	
	       		asins.push($(this).data("asin"));		
	    	  }	    	   
			}); 

			$(item).find('.zg_itemImmersion').each(function(){
          		var v = $(this).find('.zg_itemWrapper').find('div').attr('data-p13n-asin-metadata');
           		var json = $.parseJSON(v);           	
           		asins.push(json.asin);						
			});	

			var first_id = $(item).find('#s-results-list-atf li').first().attr('id');
			if(first_id){
				var i;
				first_id = first_id.replace ( /[^\d.]/g, '' );
				first_id = parseInt(first_id);

				var start = parseInt(first_id) + 60;

				for (i = first_id; i < start; i++) { 
					if($(item).find('#result_'+i).length > 0){
				    	var asin = $(item).find('#result_'+i).data("asin"); 
				    	asins.push(asin);
					}
				}
			}

	       	asins = $.unique(asins);

	       	displayDataInTable(asins);	       	
	    },error: function (jqXHR, exception) {
			      	var msg = handleError(jqXHR, exception);
			        httpError(msg);
			},
		})	
	}

	//URL ASIN function
	var paginationRecords = function(url) { 					
		var asins = [];	 

		$.ajax({
		    type: "get",	        
	        url: url,
	        //async:false,
	        success: function (item) {	 	    	 	    

	 	    //Get ASIN of li found on page
	        $(item).find('li').each(function(){		  	
	       		var asin = $(this).find("div").data("asin");       		
	       		asins.push(asin);	
		    });
		
			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		  	

			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		

			if($(item).length > 0){
				asins.push($('#ftSelectAsin').val());				
			}  	
			
			//Get ASIN of amazon homepage 
			$(item).find('.feed-carousel-shelf li').each(function(){		 
			  if($(this).data("asin") != '') {       		
	       		var data = $(this).data("sgproduct");		       		       		       		
	       		if(data != undefined){       			
	   			   asins.push(data.asin);
	       		}
	    	  }	
			});



	    	if(url){
				var a = url.split('dp/');		  
				if(a && a[1]){
			  		var b = a[1].split('/ref');
				  	if(b && b[0]){
				  	 asins.push(b[0]);		  
				    }
			    }
			 }



			$(item).find('.a-carousel li').each(function(){
			  var href = $(this).find('a').attr('href');
			  if(href){
				var a = href.split('product/');		  
				if(a && a[1]){
			  	 var b = a[1].split('/ref');
			  	if(b && b[0]){
			  	 asins.push(b[0]);		  
			    }
			    }
			  }
			});



	       	$(item).find('#s-results-list-atf li').each(function(){
	       	if($(this).data("asin") != '') {       	
	       		asins.push($(this).data("asin"));		
	    	  }	    	   
			}); 

			$(item).find('.zg_itemImmersion').each(function(){
          		var v = $(this).find('.zg_itemWrapper').find('div').attr('data-p13n-asin-metadata');
           		var json = $.parseJSON(v);           	
           		asins.push(json.asin);						
			});	

			var first_id = $(item).find('#s-results-list-atf li').first().attr('id');
			if(first_id){
				var i;
				first_id = first_id.replace ( /[^\d.]/g, '' );
				first_id = parseInt(first_id);

				var start = parseInt(first_id) + 60;

				for (i = first_id; i < start; i++) { 
					if($(item).find('#result_'+i).length > 0){
				    	var asin = $(item).find('#result_'+i).data("asin"); 
				    	asins.push(asin);
					}
				}
			}

			console.log('asins---', asins)
	       	asins = $.unique(asins);
	        
	        appendPaginationRecords(asins);

	    },error: function (jqXHR, exception) {
			      	var msg = handleError(jqXHR, exception);
			        httpError(msg);
			},
		})	

	}

	//get sale rank html
	function checkCategoryAndSalesrank(htmlSource) {	 
	        var productDetails = $(htmlSource).find("#productDetails_detailBullets_sections1").find("tr");
	        productDetails.each(function(){
	            if($.trim($(this).find("th").text()) === "Best Sellers Rank"){
	            	return $.trim($($(this).find("td")).html());	              	            	
	            }
	        });	    
	        return false;	    
	}	
	
	function getScrapURL(url){
		//Get save url where data to fetch
		var url = localStorage.getItem('currentURL');                                                                           	
		//Default scrap page
		if(!url){
			url = 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dtoys-and-games&field-keywords=baby';
		}
		
		return url;

	}

	// Read a page's GET URL variables and return them as an associative array.
	function getUrlVars(){
		return window.location.href.slice(window.location.href.indexOf('?'));
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}

	var asinss = getUrlVars();	

	var str1 = getUrlVars();
	var str2 = "varitation";
	var walmartString = "walmart";
	var yes = false;
	if(str1.indexOf(str2) != -1){
	   yes = true;
	}

	//check for ebay product
	var walmart = false;
	if(str1.indexOf(walmartString) != -1){
	   walmart = true;
	}

	if(getUrlVars() == 'l'){
		//calling scrap function	
		var url = getScrapURL();
		startScrap(url);
	}else if(yes){
		var val = getUrlVars();		
		var asin = val.replace('?varitation=',"");	
		$('#keyword_search').hide();
		getMoreChoicess(asin);		
	}else if(walmart){		
		$('#keyword_search').hide();
		getWalmartProduct();		
	}else{
		var asins = getUrlVars();
		var res = asins.replace("?", "");
		var answerInt = [];
		var answerString = res;
		
		answerString.split(',').forEach(function (item) {
		   answerInt.push(item);
		});

		$('#keyword_search').hide();
		displayDataInTable(answerInt);		
	}	

	//no result found message	
	var noResultFound = function(){
		$('#total_records').text('');
		$('#avg_sale_rank').text('');
		$('#avg_reviews').text('');
		$('#avg_rating').text('');
		$('#avg_new_price').text('');

		$("#main-table tbody").html('');					
	  			var tr ='<tr>';
	                tr +='<td colspan="19" style="text-align: center;">';
	                tr +='No Record Found.</td>';  
	                tr +='</tr>';	        
		$("#main-table tbody").append(tr); 	
	}

    //no result found message   
    var httpError = function(error){
    	$('#keyword_search').text('');
        $('#total_records').text('');
        $('#avg_sale_rank').text('');
        $('#avg_reviews').text('');
        $('#avg_rating').text('');
        $('#avg_new_price').text('');
        
        $("#main-table tbody").html('');                    
                var tr ='<tr>';
                    tr +='<td colspan="19" style="text-align: center;">'+error+'</td>';                    
                    tr +='</tr>';           
        $("#main-table tbody").append(tr);  
    }

    //selection checkbox for bulk operations
    $(document).on('change','.line-selection', function(){

	        if($(this).is(":checked")) {
        		 $(this).closest('tr').addClass('active-line-cb');
	        }else{
	        	$(this).closest('tr').removeClass('active-line-cb');
	        }
    });

    //Operational popup ***************************************

    //hide / show popup
    $(document).on('click','.toggle_btn', function(){
    	$('#menu-options-column-number').toggle();	
    });  

    //hide menu popup
    var hideMenuPopup = function(){
    	$('#menu-options-column-number').hide();  
    }

    //show menu popup
    var showMenuPopup = function(){
    	$('#menu-options-column-number').show();  
    }

    //Select all
	$(document).on('click','.cn-select-all', function(e){
		e.preventDefault();				
		$("#main-table").find('tr').each(function(){
			$(this).addClass('active-line-cb');
			$(this).find('.line-selection').prop('checked',true);

			hideMenuPopup();
		});
    });

	//de-select all
    $(document).on('click','.cn-deselect-all', function(e){
		e.preventDefault();				
		$("#main-table").find('tr').each(function(){
			$(this).removeClass('active-line-cb');
			$(this).find('.line-selection').prop('checked',false);
			
			hideMenuPopup();
		});
    });

    //invert selection
    $(document).on('click','.cn-invert-selection', function(e){
		e.preventDefault();				
		$("#main-table").find('tr').each(function(){
			$(this).toggleClass('active-line-cb');
			
			if($(this).find('.line-selection').is(':checked')){
				$(this).find('.line-selection').prop('checked', false);
			}else{
				$(this).find('.line-selection').prop('checked', true);
			}

			hideMenuPopup();
		});
    });

    //delete selected
     $(document).on('click','.cn-delete-all-selected', function(e){
		e.preventDefault();				
		$("#main-table  > tbody  > tr").each(function(){					
			if($(this).hasClass('active-line-cb')){
				  $(this).addClass('deleted');						
				  $(this).hide();				
			}			
		});

		hideMenuPopup();
    });   

    //delete not selected    
     $(document).on('click','.cn-delete-all-not-selected', function(e){
		e.preventDefault();				
		$("#main-table  > tbody  > tr").each(function(){					
			if(!$(this).hasClass('active-line-cb')){
				  $(this).addClass('deleted');						
				  $(this).hide();				
			}			
		});

		hideMenuPopup();
    }); 

	//Render data to popup html
	function displayDataInTable(asins){  
			if ( $.fn.DataTable.isDataTable('#main-table') ) {
			  $('#main-table').DataTable().destroy();
			}

			$('#main-table tbody').empty();
			appendLoader();	

			var sale_rank_total = 0;
			var total_sale_rank = 0;

	  		var num = 1;
			$.ajax({
		        type: "POST",	        
		        url: _apiUrl+"index.php?type=product_info_for_lv",
		        data: {asin: asins},  		        
		        success: function (responseJson) {		        

		        		if(!responseJson){
		        			noResultFound();
		        			return false;
		        		}	

		           		productInfos = $.parseJSON(responseJson);
		           		$("#main-table tbody").html('');

		           		var review_total = 0;
		           		var rating_total= 0;
		           		var common_loader = '<img src="../images/loader-upload_ajax.gif">';

						$.each(productInfos.all_products, function(k, productInfo) {
					     if(productInfo.asin != ''){	

					     	rating_total = parseFloat(rating_total) + parseFloat(productInfo.rating);
					     	review_total = parseInt(review_total) + parseInt(productInfo.review);

							var tr = '<tr>';						
							tr += '<td class="srCol column-number"><b><span class="line-selection-number">'+num+'</span><input type="checkbox" value="'+num+'" class="line-selection"></b></td>';
							tr += '<td class="asinCol">'+productInfo.asin+'</td>';
							tr += '<td class="productNameCol">'+'<a target="_blank" href="'+productInfo.link+'" title="'+productInfo.title+'"> '+productInfo.title.substring(0,15)+'</a></td>';	
							tr += '<td class="estimatedCol">'+common_loader+'</td>';						
							tr += '<td class="estimatedRevenueCol">'+common_loader+'</td>';								
							tr += '<td class="saleRankCol" data-price='+productInfo.formattedPrice+' data-sale_rank='+productInfo.sale_rank+'>'+productInfo.sale_rank+'</td>';	
							tr += '<td class="ratingCol">'+productInfo.rating+'</td>';		
							tr += '<td class="reviewCol">'+productInfo.review+'</td>';		
							tr += '<td class="categoryCol" data-category='+productInfo.category+'><a title="'+productInfo.category+'">'+productInfo.category+'</a></td>';						
							tr += '<td style="display:none" class="length_rawCol">'+productInfo.length_raw+'</td>';	
							tr += '<td style="display:none" class="weight_rawCol">'+productInfo.weight_raw+'</td>';	
							tr += '<td style="display:none" class="width_rawCol">'+productInfo.width_raw+'</td>';	
							tr += '<td style="display:none" class="height_rawCol">'+productInfo.height_raw+'</td>';										
							num++;						
							$("#main-table tbody").append(tr);	
							$('#total_records').html(num-1);
							hideDefaultColumn();							
						} 	
					});				
				
					var total_rec = $('#main-table tbody tr').length;										
					var avg_rating = rating_total / num;
					var avg_review = review_total / num;

					$('#avg_rating').html(avg_rating.toFixed(2))
					$('#avg_reviews').html(avg_review.toFixed(2))
					
					//Get montly sale and revenue
					getMontlySaleRevenue();

					if(total_rec > 0){
                        getSearchOption();  						
					}else{
						noResultFound();
					}	
		        },error: function (jqXHR, exception) {
			       var msg = handleError(jqXHR, exception);
			       httpError(msg);
			    },
		    });  	

		    return true;
	  	}

	//Render data to popup html of upc
	function displayDataInTableUPC(asins){  			
			if ( $.fn.DataTable.isDataTable('#main-table') ) {
			  $('#main-table').DataTable().destroy();
			}

			$('#main-table tbody').empty();
			appendLoader();	

			var sale_rank_total = 0;
			var total_sale_rank = 0;

	  		var num = 1;
			$.ajax({
		        type: "POST",	        
		        url: _apiUrl+"index.php?type=product_info_for_lv",
		        data: {asin: asins},  		        
		        success: function (responseJson) {		        

		        		if(!responseJson){
		        			noResultFound();
		        			return false;
		        		}	

		           		productInfos = $.parseJSON(responseJson);
		           		$("#main-table tbody").html('');

		           		var review_total = 0;
		           		var rating_total= 0;
		           		var common_loader = '<img src="../images/loader-upload_ajax.gif">';

						$.each(productInfos.all_products, function(k, productInfo) {
					     if(productInfo.asin != ''){	

					     	rating_total = parseFloat(rating_total) + parseFloat(productInfo.rating);
					     	review_total = parseInt(review_total) + parseInt(productInfo.review);

							var tr = '<tr>';						
							tr += '<td class="srCol column-number"><b><span class="line-selection-number">'+num+'</span><input type="checkbox" value="'+num+'" class="line-selection"></b></td>';
							tr += '<td class="asinCol">'+productInfo.asin+'</td>';
							tr += '<td class="productNameCol">'+'<a target="_blank" href="'+productInfo.link+'" title="'+productInfo.title+'"> '+productInfo.title.substring(0,15)+'</a></td>';	
							tr += '<td class="estimatedCol">'+common_loader+'</td>';						
							tr += '<td class="estimatedRevenueCol">'+common_loader+'</td>';								
							tr += '<td class="saleRankCol" data-price='+productInfo.formattedPrice+' data-sale_rank='+productInfo.sale_rank+'>'+productInfo.sale_rank+'</td>';	
							tr += '<td class="ratingCol">'+productInfo.rating+'</td>';		
							tr += '<td class="reviewCol">'+productInfo.review+'</td>';		
							tr += '<td class="categoryCol" data-category='+productInfo.category+'><a title="'+productInfo.category+'">'+productInfo.category+'</a></td>';						
							tr += '<td style="display:none" class="length_rawCol">'+productInfo.length_raw+'</td>';	
							tr += '<td style="display:none" class="weight_rawCol">'+productInfo.weight_raw+'</td>';	
							tr += '<td style="display:none" class="width_rawCol">'+productInfo.width_raw+'</td>';	
							tr += '<td style="display:none" class="height_rawCol">'+productInfo.height_raw+'</td>';										
							num++;						
							$("#main-table tbody").append(tr);	
							$('#total_records').html(num-1);
							hideDefaultColumn();							
						} 	
					});				
				
					var total_rec = $('#main-table tbody tr').length;										
					var avg_rating = rating_total / num;
					var avg_review = review_total / num;

					$('#avg_rating').html(avg_rating.toFixed(2))
					$('#avg_reviews').html(avg_review.toFixed(2))
					
					//Get montly sale and revenue
					getMontlySaleRevenue();	
					if(total_rec > 0){
                        getSearchOption();  						
					}else{
						noResultFound();
					}	
		        },error: function (jqXHR, exception) {
			       var msg = handleError(jqXHR, exception);
			       httpError(msg);
		    },
	    });  	   
	}  	


	function checkCategoryAndSalesrank(htmlSource, country) {
	    var cname;
	    var salesrank = "";

	    if(country === "co.uk") {
	        salesrank = $.trim($(htmlSource).find("#SalesRank").text()).split("#")[0];
	    } else {	    	
	        salesrank = $.trim($(htmlSource).find("#SalesRank").text()).split("#")[1];
	    }

	    console.log('salesrank', salesrank)

	    var salesdata = [];
	    if(salesrank && salesrank.indexOf(" 100") > -1) {
	        cname = scrapCategory(salesrank);
	        salesdata = salesrank.split('in');	        
	    } else {
	        var productDetails = $(htmlSource).find("#productDetails_detailBullets_sections1").find("tr");
	        productDetails.each(function(){
	            if($.trim($(this).find("th").text()) === "Best Sellers Rank"){
	                var bestSellers = $.trim($($(this).find("td > span > span")).text());
	                if(bestSellers.indexOf("in ") > -1 && bestSellers.indexOf(" (") > -1){
	                    cname = bestSellers.split("in ")[1].split(" (")[0];
	                }
	            }
	        });
	    }

	     var data = {
	     	cname: cname,
	     	rank: salesdata[0]
	     };

	    // console.log('object', data);

	   	 return data;
	}

	function scrapCategory(salesrank) {
	    var cname;
	    var country = "com";
	    if(salesrank && salesrank.indexOf(" 100") > -1){
	        if (country == "fr"){
	            cname = salesrank.substring(salesrank.indexOf(" en") + 4, salesrank.indexOf(" ("));
	        } else if (country == "de"){
	            cname = salesrank.substring(salesrank.indexOf(" in") + 4, salesrank.indexOf(" ("));
	        } else if (country == "es"){
	            cname = salesrank.substring(salesrank.indexOf(" en") + 4, salesrank.indexOf(" ("));
	        } else if (country == "it"){
	            cname = salesrank.substring(salesrank.indexOf(" in") + 4, salesrank.indexOf(" ("));
	        } else {
	            cname = salesrank.substring(salesrank.indexOf(" in") + 4, salesrank.indexOf(" ("));
	        }
	    }
	    return cname;
	}
  	

	//get review and rating
	var getMontlySaleRevenue = function(){
		$("#main-table tbody").find('tr').each(function(){
			var category = $(this).find('.categoryCol').find('a').text();  
			var rank = $(this).find('.saleRankCol').attr('data-sale_rank');  
			var price = $(this).find('.saleRankCol').attr('data-price');  

			console.log('category', category)
			console.log('rank', rank);
			console.log('price', price);

			var sales = calculateSales('com',category,rank,price)

			if(sales){
				$(this).find('.estimatedCol').text(sales[1]);
			}else{
				$(this).find('.estimatedCol').text('N/A');
			}

			if(sales){
				$(this).find('.estimatedRevenueCol').text(sales[0]);
			}else{
				$(this).find('.estimatedRevenueCol').text('N/A');
			}

			console.log('sales', sales);

		});	
	}	

	
	//get review and rating
	var getReviewAndRating = function(total_sale_rank){
	var sum_of_review = 0;
   	var review_count = 0;

   	var sum_of_rating = 0;
   	var rating_count = 0;
   	var rating_r = 0;	
   	var i = 1;
    $("#main-table tbody").find('tr').each(function(){
    	var _that = $(this);  

    	var url  = _that.find('.productNameCol a').attr('href');    	
		var category = _that.find('.categoryCol a').attr('title');    		
		var category_name = _that.find('.categoryCol a').text();  
		console.log('category_name', category_name)  		
		var asinCol = _that.find('.asinCol').attr('data-my_asin');    				
		var estimatedCol = _that.find('.estimatedCol').text();    		    	
		var formattedPrice = _that.find('.priceCol').text();   
		var price = formattedPrice.replace("$", "");

		var lowestPriceColVal = _that.find('.lowestPriceCol').text();   
		lowestPriceColVal = lowestPriceColVal.replace("$", "");

		$.ajax({
		    url : url,
		    type : "get",		    
		    success : function(item) {
		    	//Calculate estimated sale if not present in current tr
	    		
	    		//if(!estimatedCol){
	    			var datass = checkCategoryAndSalesrank(item,'com');
	    			console.log('asinCol', asinCol)
	    			console.log('data', datass)
	    			console.log('asinCol', asinCol)
	    			if(!category){
	    				 category_name = datass.cname; 
	    				 console.log('category_name  222', category_name)  		
	    				_that.find('.categoryCol a').text(datass.cname);
	    				_that.find('.saleRankCol').text(datass.rank);
	    			}
	    		//}

		    	//End

		    	//For calculating the available quantity and understock, overstock
        		var optional_quantity = $(item).find("#addToCart #quantity option:last-child").val();	

        		/******--Add To Cart--****/

        		var data = {};
        		var rsid = $(item).find("#addToCart #session-id").val();
               
                data['ASIN.1'] = asinCol; 
                data['Quantity.1'] = '2000';                
                data['AWSAccessKeyId'] = 'AKIAJDBS764437ALC74A';
                data['AssociateTag'] = 'davin01-20';
                data['AWSAccessKeyId'] = 'davin01-20';
                data['confirmPage'] = 'confirm';
                data['SessionId'] = rsid;               

                //End calculate available quantity , understock , overstock  	

		    	var c = '';
		    	var v = '';
			    c = $(item).find('#averageCustomerReviews .a-icon-alt').text();
				v = $(item).find('#acrCustomerReviewText').first().text();			
				console.log('v ', v)				
				if(v){			
					rating_r = v.replace(/\D/g,'');
				}

				let rankTemp = $.trim($(item).find('#SalesRank').text());
				rankTemp = rankTemp.split('in');
				rankTemp = rankTemp[0].split(':');
				// deleting the # symbol
				rank = $.trim(rankTemp[1]).slice(1);
				console.log('rankTemp', rank);
				let th = $(item).find('th');
				let li = $(item).find('li');
				if(!rank){					
					for(j = 0; j < th.length; j++){
						if($.trim($(th[j]).text()) == 'Best Sellers Rank'){

							// full rank text
							let rankTemp = $.trim($(th[j]).next().text());
							// splitting the first number
							rankTemp = rankTemp.split('in');
							// deleting the # symbol
							rank = rankTemp[0].slice(1);
						}	
					};
				}

				console.log('nisha rank code', rank)


				var sR = _that.find('.saleRankCol').text();
				var str = rank.replace(',');				
				str = parseInt(str);

				if(_that.find('.saleRankCol').text() == ''){
					if($.isNumeric(str) && str !=''){
						_that.find('.saleRankCol').text(str);	
						sR = str;
					}else{
						_that.find('.saleRankCol').text('');	
					}
				}


				
            	//_that.find('.availableQuantityCol').html('');
            	//_that.find('.stockCol').html('');
            	var est_sale = calculateSales('com',category_name,sR,price);
				console.log(est_sale,'est_sale',asinCol);


            	if(est_sale != undefined){   
            		_that.find('.estimatedCol').text(est_sale[0]);                    		
            		_that.find('.estimatedRevenueCol').text(est_sale[1]);                    		
            	}else{        			
        			_that.find('.estimatedCol').text('');                    		
        			_that.find('.estimatedRevenueCol').text('');
            	}

				var review_count_c = '';
                if(c != 'Be the first to review this item'){
				if(c){			
					review_count_c = parseFloat(c.match(/-?(?:\d+(?:\.\d*)?|\.\d+)/)[0]);	
				}}else{
                    review_count_c = '';
                }			



				if (rating_r == null){
					rating_r = '';	
				}else{
					sum_of_review += parseInt(rating_r);	
					var avg = sum_of_review/total_sale_rank;
					$('#avg_reviews').text(avg.toFixed(0));				
   					review_count = parseInt(review_count) + parseInt(i);
				}

				if(review_count_c == ''){
					review_count_c = '';	
					$('#avg_rating').text('0');								
				}else{
					sum_of_rating += parseFloat(review_count_c);
					var avg = sum_of_rating/total_sale_rank;
					$('#avg_rating').text(avg.toFixed(1));	
   					rating_count = parseInt(rating_count) + parseInt(i);	
				}

				//BB SHIPPING COST
				var shipping_cost = $(item).find('#ourprice_shippingmessage span').first().text();
				var shipping_cost_doublenumber = Number(shipping_cost.replace(/[^0-9\.]+/g,""));

				//BB PRICE 
				var bb_price = $(item).find('#priceblock_ourprice').text();
				var bb_price_doublenumber = Number(bb_price.replace(/[^0-9\.]+/g,""));

				//Show Lwst Price (new) + shipping
				var lowestPriceCol = _that.find('.lowestPriceCol').html();	
				var lpc = 0;
				
				if(lowestPriceCol){
					lpc = Number(lowestPriceCol.replace(/[^0-9\.]+/g,""));
				}

				var total_lowest_new_plus_shipping = shipping_cost_doublenumber + lpc;

				//SELLER DATA
				var str1 = item;
				var str2 = "sold by Amazon";
				var str3 = "Fulfilled by Amazon";
				var bbseller = '';
				
				if(str1.indexOf(str2) != -1){
				    bbseller = 'AMZ';
				}else if(str1.indexOf(str3) != -1){
					bbseller = 'FBA';
				}else{
					bbseller = 'MCH';
				}				

				var fullSaleRank = ''; 
				var htmlSource = item;
				var productDetails = $(htmlSource).find("#productDetails_detailBullets_sections1").find("tr");
	      		productDetails.each(function(){
		            if($.trim($(this).find("th").text()) === "Best Sellers Rank"){
		            	fullSaleRank =  $.trim($($(this).find("td")).html());		            	
		            }
		        });	 

	      		//calculate fba fees	      	
	      		var weight = _that.find('.weight_rawCol').text();	
	      		var length = _that.find('.length_rawCol').text();	
	      		var width  = _that.find('.width_rawCol').text();	
	      		var height = _that.find('.height_rawCol').text();	
	      		var asin   = _that.find('.asinCol').text();	

	      		var total_fba = 0;
	      		$.ajax({
			          url: "http://asinspector.com/rest/getMeFBA.php",   
			          method:'post',  
			          async: false,
			          data: {
			              getFBAFeesForListAsins: 1,
			                'data[0][asin]': asin,                  
			                'data[0][weight]': weight,                  
			                'data[0][width]': width,                  
			                'data[0][length]': length,                  
			                'data[0][height]': height                  
			            },
			            success: function(data) { 
			            	total_fba = parseFloat(data.dataFba[0].orderHandling) + parseFloat(data.dataFba[0].fbaStorageFee) + parseFloat(data.dataFba[0].pickAndPack) + parseFloat(data.dataFba[0].weightHandling + 0.99);			             
			       }
			    });


	      		var priceForRefferFees = '';
	      		var categoryForRefferFees = '';

			    if(lowestPriceColVal && lowestPriceColVal != undefined){
			    	priceForRefferFees = lowestPriceColVal;
	      			categoryForRefferFees = category;
			    }else{
			    	priceForRefferFees = formattedPrice;
	      			categoryForRefferFees = category_name;
			    }

			    var refferFess = getPerRefFeeProductType(priceForRefferFees, categoryForRefferFees);
			    total_fba = parseFloat(total_fba) + parseFloat(refferFess.toFixed(2));

	      		//break even cost
	      		var break_even_cost = lpc - total_fba;

				i++;
				var total = parseFloat(bb_price_doublenumber) + parseFloat(shipping_cost_doublenumber);
				var ces = '<a>Click<div style="display:none;">'+fullSaleRank+'</div></a>';

				if(break_even_cost){
					break_even_cost = Math.abs(break_even_cost);
				}			
				
				_that.find('.breakEvenCostCol').html(break_even_cost.toFixed(2));	
				_that.find('.fbaCol').html(total_fba.toFixed(2));	
				_that.find('.lowestPricePlusShippingCol').html(total_lowest_new_plus_shipping.toFixed(2));	
				_that.find('.bbPricePlusbbShippingCostCol').html(total.toFixed(2));	
				_that.find('.bbPriceCol').html(bb_price_doublenumber);	
				_that.find('.bbShippingCostCol').html(shipping_cost_doublenumber);	
				_that.find('.lowestShippingCol').html(shipping_cost_doublenumber);	
				_that.find('.bbSellerCol').html(bbseller);	
				_that.find('.fullSaleRankCol').html(ces);	
				_that.find('.ratingCol').text(review_count_c);								
				_that.find('.reviewCol').text(rating_r);					

		    },error: function (jqXHR, exception) {
		    	//_that.find('.availableQuantityCol').html('');
		    	//_that.find('.stockCol').html('');
		    	_that.find('.estimatedCol').html('');
		    	_that.find('.estimatedRevenueCol').html('');

		    	$('#avg_reviews').text('');
		    	$('#avg_rating').text('');

		    	_that.find('.breakEvenCostCol').html('');
		    	_that.find('.fbaCol').html('');
		    	_that.find('.lowestPricePlusShippingCol').html('');
		    	_that.find('.lowestShippingCol').html('');
		    	_that.find('.bbPricePlusbbShippingCostCol').html('');
		    	_that.find('.bbPriceCol').html('');	
		    	_that.find('.bbShippingCostCol').html('');	
		    	_that.find('.bbSellerCol').html('');	
		    	_that.find('.saleRankCol').html('');
			 	_that.find('.fullSaleRankCol').html('');	
				_that.find('.ratingCol').text('');								
				_that.find('.reviewCol').text('');					
		    },							
		 });
	   });		   
	}  	


	 /*Get percentage Referral Fees by category*/
    var getPerRefFeeProductType = function (amzPrice, category) {       

      if (category == "3D Printed Products") {
        referralFee = 0.12 * amzPrice;
      }else if (category == "Amazon Device Accessories") {
        referralFee = 0.45 * amzPrice;

        if (referralFee < 1){
          referralFee = 1
        }
      }else if (category == "Automotive & Powersports") {
        referralFee = 0.12 * amzPrice;

        if (referralFee < 1){
          referralFee = 1;
        }
      }else if (category == "Camera and Photo") {
        referralFee = 0.08 * amzPrice
      }else if (category == "Cell Phone Devices") {
        referralFee = 0.08 * amzPrice
      }else if (category == "Consumer Electronics") {
        referralFee = 0.08 * amzPrice;

        if (referralFee < 1){
          referralFee = 1;
        }
      }else if (category == "Jewelry") {
        referralFee = 0.20 * amzPrice;

        if (referralFee < 2){
          referralFee = 2;
        }
      }else if (category == "Personal Computers") {
        referralFee = 0.06 * amzPrice;

        if (referralFee < 1){
          referralFee = 1;
        }
      }else if (category == "Sports Collectibles") {
        referralFee = 0.20 * amzPrice
      }else if (category == "Video Game Consoles") {
        referralFee = 0.08 * amzPrice
      }else {
        referralFee = 0.15 * amzPrice
      }

      return parseFloat(referralFee.toFixed(2));
    }

	//Jquery sortorder lib
	var getSearchOption = function() { 	
		// Setup - add a text input to each header cell
    	$('#main-table thead tr:eq(1) th').each( function () {
        	var title = $('#main-table thead tr:eq(0) th').eq( $(this).index() ).text();
        	$(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    	}); 


		if (!$.fn.dataTable.isDataTable('#main-table')) {
        table = $('#main-table').DataTable({
		        "paging":   false,
		        "ordering": true,
		        "info":     false,
		        "orderCellsTop": true
	   	});

	    // Apply the search
    	table.columns().every(function (index) {
	        $('#main-table thead tr:eq(1) th:eq(' + index + ') input').on('keyup change', function () {
	            table.column($(this).parent().index() + ':visible')
	                .search($.trim(this.value))
	                .draw();
	        	});
	    	});
		}
		//hide search box
		$('#main-table_filter').hide();	
	} 

	// var target = document.body;
	// 	var observer = new MutationObserver(function() {
	// 	    $('input[type="search"]').keyup(function(){		    	
		    	
	// 	    	var val = $.trim($(this).val()); 

	// 	    	$('input[type="search"]').val(val)
	// 	    });  
	// 	});

	// 	// configuration of the observer:
	// var config = { childList: true, subtree: true};

	// // pass in the target node, as well as the observer options
	// observer.observe(target, config);	

	//destroy sortorder from table
	var destroySortOrder = function(tablenameid){
		$("#"+tablenameid).trigger("destroy");
	}

	// show Full Rank 
	$(document).on('click', '.fullSaleRankCol', function(e){		
		var src = $(this).find('div').html();	
		if(!src){
			src = 'No Result Found !';
		}		
		$('.full-ranked').html(src);
		$('#full-rank-popup').modal('show');
	});

	//open a link of search web page
    $(document).on('click', '#get-link', function(e){        
        e.preventDefault();
        var url = localStorage.getItem('currentURL'); 
        window.open(url);
     });

    //prevent default action under full sale rank 
    $(document).on('click', '.full-ranked a', function(e){         
        e.preventDefault();     
 	});

    // Increase Font Size
    $(document).on('click', '.act-font-plus',function(){
      var currentSize = $('.dataTable td').css('font-size');
      var currentSize = parseFloat(currentSize)*1.2;
      $('.dataTable td').css('font-size', currentSize);
    });

    // Decrease Font Size
    $(document).on('click', '.act-font-minus',function(){
      var currentFontSize = $('.dataTable td').css('font-size');
      var currentSize = $('.dataTable td').css('font-size');
      var currentSize = parseFloat(currentSize)*0.8;
      $('.dataTable td').css('font-size', currentSize);
    });

	// show editorial Review
	$(document).on('click', '.editorialReviewAnc', function(e){	
		var src = $(this).find('div').html();	
		$('.editorial-reviews').html(src);
		$('#editorial-review-popup').modal('show');
	});

	// show brain storm
	$(document).on('click', '.brainstorm', function(e){	
		$('#brain-strom-popup').modal('show');
	});

	//find a new product on brain storm
	var tkeyword = function(_0x2348x2b, _0x2348x2c) {
        return _0x2348x2b + Math['floor'](Math['random']() * (_0x2348x2c - _0x2348x2b))
    };

	$(document).on('click', '#btn-refresh-keywords-brainstorm', function(e){
		$(".brainstorm-table tbody").html('');


		var _that = $(this);
		var l = 1;
		l = l + 50

		$('.brainstorm-load').show();

		var dat = new Date();
        var datas = dat['getDate']() + '9' + dat['getMonth']();
        code = btoa(btoa(datas));

		var i;
		for (i = 1; i <= 1; i++) {   	
			var d = Math.floor(1000 + Math.random() * 9000);
			var l = Math.floor(1000 + Math.random() * 9000);
			
			$.ajax({
		          url: "http://asinspector.com/rest/actions.php",   
		          method:'post',  
		         // async: false,		     		          
		          data: {
		          		d: tkeyword(999, 9999),                  
		                l: l,                  
		                u: code
		            },
		            success: function(data) { 		           		            	
		     			//brainStormScrap(url, data[0].akeywords);
		     			var ex = $(".brainstorm-table tbody").find('.brainstorm-helper').length;		
		     			
						if(ex){
							$(".brainstorm-table tbody").empty();
						}

						var common_loader = '<img src="../images/loader-upload_ajax.gif">';

						var tr = '';
						var tr = '<tr>';				
						//var keyword = $('#brainstorm-keyword').val();						
						var keyword = data[0].akeywords;												
						tr += '<td class="keywordCol">'+keyword+'</td>';	
						tr += '<td class="noOfProductCol">'+common_loader+'</td>';
						tr += '<td class="avgRankCol">'+common_loader+'</td>';	
						tr += '<td class="avgPriceCol">'+common_loader+'</td>';						
						tr += '<td><a class="searchCol" data-keyword="'+data[0].akeywords+'"><img src="../images/goto.png"></a>&nbsp;<a class="openNewTabCol" data-keyword="'+data[0].akeywords+'"><img src="../images/gotonew.png"><a></td>';
						tr += '</tr>';				
						$(".brainstorm-table tbody").append(tr);	

						$(".brainstorm-table > tbody > tr").not('.done').each(function(){
    	var _that = $(this);
    	var keyword  = _that.find('.keywordCol').text();
    	var url =  "https://www.amazon.com/s/field-keywords="+keyword;

    	var asins = [];

		$.ajax({
		    type: "get",	        
	        url: url,	      
	       // async:false,	       
	        success: function (item) {	 	    	 	    

	 	    //Get ASIN of li found on page
	        $(item).find('li').each(function(){		  	
	       		var asin = $(this).find("div").data("asin");       		
	       		asins.push(asin);	
		    });
		
			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		  	

			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		

			if($(item).length > 0){
				asins.push($('#ftSelectAsin').val());				
			}  	
			
			//Get ASIN of amazon homepage 
			$(item).find('.feed-carousel-shelf li').each(function(){		 
			  if($(this).data("asin") != '') {       		
	       		var data = $(this).data("sgproduct");		       		       		       		
	       		if(data != undefined){       			
	   			   asins.push(data.asin);
	       		}
	    	  }	
			});



	    	if(url){
				var a = url.split('dp/');		  
				if(a && a[1]){
			  		var b = a[1].split('/ref');
				  	if(b && b[0]){
				  	 asins.push(b[0]);		  
				    }
			    }
			 }



			$(item).find('.a-carousel li').each(function(){
			  var href = $(this).find('a').attr('href');
			  if(href){
				var a = href.split('product/');		  
				if(a && a[1]){
			  	 var b = a[1].split('/ref');
			  	if(b && b[0]){
			  	 asins.push(b[0]);		  
			    }
			    }
			  }
			});

	       	$(item).find('#s-results-list-atf li').each(function(){
	       	if($(this).data("asin") != '') {       	
	       		asins.push($(this).data("asin"));		
	    	  }	    	   
			}); 

			$(item).find('.zg_itemImmersion').each(function(){
          		var v = $(this).find('.zg_itemWrapper').find('div').attr('data-p13n-asin-metadata');
           		var json = $.parseJSON(v);           	
           		asins.push(json.asin);						
			});	

			var i;
			for (i = 0; i < 60; i++) { 
				if($(item).find('#result_14').length > 0){
			    	var asin = $(item).find('#result_'+i).data("asin"); 
			    	asins.push(asin);
				}
			}
			
	       	asins = $.unique(asins);

	       	$.ajax({
		        type: "POST",	    		        
		        url: _apiUrl+"index.php?type=brainStormInfo",
		        data: {asin: asins},  	
		        //async:false,	        
		        success: function (responseJson) {	
		        	if(responseJson){	        	
		           		productInfos = $.parseJSON(responseJson);
		           		if(productInfos){
				           	_that.closest('tr').addClass('done');
						    _that.find('.noOfProductCol').text(productInfos.num);  	
						    _that.find('.avgRankCol').text(productInfos.sale_rank.toFixed(0));  	
						    _that.find('.avgPriceCol').text(productInfos.formattedPrice.toFixed(2));  	
						}else{
							_that.closest('tr').addClass('done');
						    _that.find('.noOfProductCol').text('');  	
						    _that.find('.avgRankCol').text('');  	
						    _that.find('.avgPriceCol').text('');
						}
					}else{
							_that.closest('tr').addClass('done');
						    _that.find('.noOfProductCol').text('');  	
						    _that.find('.avgRankCol').text('');  	
						    _that.find('.avgPriceCol').text('');
					}
		        }
			}); 
	    },error: function (jqXHR, exception) {
			      		_that.closest('tr').addClass('done');
					    _that.find('.noOfProductCol').text('');  	
					    _that.find('.avgRankCol').text('');  	
					    _that.find('.avgPriceCol').text(''); 
				},
		})		
		});					
			    }
		    });
		}

		// setTimeout(function () {
		//   //  getRemainingValuesBrainStorm();	
		// }, 1000);
		
	});

	//on brainstrom search click button
	$(document).on('click', '.searchCol', function(e){
		var keyword = $(this).data('keyword');
		var url =  "https://www.amazon.com/s/field-keywords="+keyword;
		$('#brain-strom-popup').modal('hide');
		startScrap(url);
	});	

	//on brainstrom click on add button icon
	$(document).on('click', '.openNewTabCol', function(e){
		var keyword = $(this).data('keyword');
		var url =  "https://www.amazon.com/s/field-keywords="+keyword;
		
		chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
                var activeTab = tabArray[0].url;

                var storage = localStorage.setItem('currentURL', url);
                window.open(chrome.extension.getURL("html/popup.html"));
        });        
	});	

	var getRemainingValuesBrainStorm = function(){
	   	$(".brainstorm-table > tbody > tr").not('.done').each(function(){
    	var _that = $(this);
    	var keyword  = _that.find('.keywordCol').text();
    	var url =  "https://www.amazon.com/s/field-keywords="+keyword;

    	var asins = [];

		$.ajax({
		    type: "get",	        
	        url: url,	      
	        async:false,	       
	        success: function (item) {	 	    	 	    

	 	    //Get ASIN of li found on page
	        $(item).find('li').each(function(){		  	
	       		var asin = $(this).find("div").data("asin");       		
	       		asins.push(asin);	
		    });
		
			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		  	

			$(item).find('li').each(function(){		   
				  	var data = $(this).find('div').data('p13n-asin-metadata')	
				  	if(data){ 	  	
				  		asins.push(data.asin);				  		
				 	}
			});		

			if($(item).length > 0){
				asins.push($('#ftSelectAsin').val());				
			}  	
			
			//Get ASIN of amazon homepage 
			$(item).find('.feed-carousel-shelf li').each(function(){		 
			  if($(this).data("asin") != '') {       		
	       		var data = $(this).data("sgproduct");		       		       		       		
	       		if(data != undefined){       			
	   			   asins.push(data.asin);
	       		}
	    	  }	
			});



	    	if(url){
				var a = url.split('dp/');		  
				if(a && a[1]){
			  		var b = a[1].split('/ref');
				  	if(b && b[0]){
				  	 asins.push(b[0]);		  
				    }
			    }
			 }



			$(item).find('.a-carousel li').each(function(){
			  var href = $(this).find('a').attr('href');
			  if(href){
				var a = href.split('product/');		  
				if(a && a[1]){
			  	 var b = a[1].split('/ref');
			  	if(b && b[0]){
			  	 asins.push(b[0]);		  
			    }
			    }
			  }
			});

	       	$(item).find('#s-results-list-atf li').each(function(){
	       	if($(this).data("asin") != '') {       	
	       		asins.push($(this).data("asin"));		
	    	  }	    	   
			}); 

			$(item).find('.zg_itemImmersion').each(function(){
          		var v = $(this).find('.zg_itemWrapper').find('div').attr('data-p13n-asin-metadata');
           		var json = $.parseJSON(v);           	
           		asins.push(json.asin);						
			});	

			var i;
			for (i = 0; i < 60; i++) { 
				if($(item).find('#result_14').length > 0){
			    	var asin = $(item).find('#result_'+i).data("asin"); 
			    	asins.push(asin);
				}
			}
			
	       	asins = $.unique(asins);

	       	$.ajax({
		        type: "POST",	    		        
		        url: _apiUrl+"index.php?type=brainStormInfo",
		        data: {asin: asins},  	
		        async:false,	        
		        success: function (responseJson) {	
		        	if(responseJson){	        	
		           		productInfos = $.parseJSON(responseJson);
		           		if(productInfos){
				           	_that.closest('tr').addClass('done');
						    _that.find('.noOfProductCol').text(productInfos.num);  	
						    _that.find('.avgRankCol').text(productInfos.sale_rank.toFixed(0));  	
						    _that.find('.avgPriceCol').text(productInfos.formattedPrice.toFixed(2));  	
						}else{
							_that.closest('tr').addClass('done');
						    _that.find('.noOfProductCol').text('');  	
						    _that.find('.avgRankCol').text('');  	
						    _that.find('.avgPriceCol').text('');
						}
					}else{
							_that.closest('tr').addClass('done');
						    _that.find('.noOfProductCol').text('');  	
						    _that.find('.avgRankCol').text('');  	
						    _that.find('.avgPriceCol').text('');
					}
		        }
			}); 
	    },error: function (jqXHR, exception) {
			      		_that.closest('tr').addClass('done');
					    _that.find('.noOfProductCol').text('');  	
					    _that.find('.avgRankCol').text('');  	
					    _that.find('.avgPriceCol').text(''); 
				},
		})		
		});
	}   	

	// show price history popup
	$(document).on('click', '.priceHistory', function(e){	
		var asin = $(this).attr('title');
		var src = '<iframe class="graph" frameborder="0" width="100%" height="310px" src="http://keepa.com/iframe_addon.html#1-0-'+asin+'"></iframe><br><br><a target="_blank" href="https://keepa.com/#!product/1-'+asin+'">Source: keepa.com</a>';
		$('#priceHistorySource').html(src);
		$('#price-history-popup').modal('show');	
	});

	//toggle filter search boxes
	$(document).on('click','#filters',function(){
		$('.light-bg').toggle();			
		//$('#main-table_filter').toggle();			
	});

	//read file content when uploaded
	$(function() {        
		var fileInput = document.getElementById("filefromcsv"),
		readFile = function () {
			    document.getElementById('ipt-list-asin').innerHTML = "";
		        var reader = new FileReader();
		        reader.onload = function () {		        	
		            document.getElementById('ipt-list-asin').innerHTML = reader.result;
		        };
		        // start reading the file. When it is done, calls the onload event defined above.
		        reader.readAsBinaryString(fileInput.files[0]);
		};

		fileInput.addEventListener('change', readFile);
	});


	//read file content when uploaded upc
	$(function() {        
		var fileInput = document.getElementById("filefromcsvupc"),
		readFile = function () {			    
			    document.getElementById('ipt-list-upc').innerHTML = "";
		        var reader = new FileReader();
		        console.log('reader', reader)
		        reader.onload = function () {		        	
		            document.getElementById('ipt-list-upc').innerHTML = reader.result;
		        };
		        // start reading the file. When it is done, calls the onload event defined above.
		        reader.readAsBinaryString(fileInput.files[0]);
		};

		fileInput.addEventListener('change', readFile);
	});


	//search list of asins
	$(document).on('click','#btn-search-asin', function(){       
		val=document.getElementById('ipt-list-asin').value;

		if(!val){
			alert('add ASIN first');			
		}else{

    	 
		val = val = val.replace(/(?:\r\n|\r|\n)/g, ',');
		var partsOfStr = val.split(',');

		var asins = [];				
		$.each(partsOfStr, function( index, value ) {
		  console.log('value', value)	
		  if(value){	
		  	asins.push(value);	
		  }
		});			

		if(asins.length == 0){
		  $('#import_list_asin').modal('hide');		  
		}else{
			destroySortOrder('main-table');
			appendLoader();
			$('#import_list_asin').modal('hide');
			asins = $.unique(asins);		
	       	displayDataInTable(asins);
       	}
       }
	});

	//search list of asins
	$(document).on('click','#btn-search-upc', function(){       
		val=document.getElementById('ipt-list-upc').value;

		if(!val){
			alert('add UPC first');			
		}else{

    	
		val = val = val.replace(/(?:\r\n|\r|\n)/g, ',');
		var partsOfStr = val.split(',');

		var asins = [];				
		$.each(partsOfStr, function( index, value ) {

		 console.log('value', value);			
		 var a = parseInt(value);
		 if(/^[0-9]{1,12}$/.test(a)){	
		  	asins.push(a);	
		  }
		});			

		console.log('asins.length', asins.length);
		console.log('asins', asins);

		if(asins.length == 0){
		  	$('#import_list_asin').modal('hide');		 
		}else{
			$('#import_list_asin').modal('hide');
			appendLoader(); 
			destroySortOrder('main-table');
			$('#import_list_upc').modal('hide');
			asins = $.unique(asins);		
	       	displayDataInTableUPC(asins);
       	}
       }
	});



	//Search Keyword amazon popup
	$(document).on('click','#act-search-amazon', function(){
		$('#search-keyword').modal('show');	
	});

	//onClick keyword search button
	$(document).on('click','#btn-search-amazon', function(){
		var search_val  = $('#ipt-search-amazon').val();
		
		if(search_val == ''){			
			$('#search-keyword-msg').show().text('Please enter Keyword');
			return;
		}

		var category_alias = $('#searchDropdownBox').find(":selected").val();
		var category_val = category_alias.split('=');		

		$('#search-keyword-msg').hide();

		var str = search_val;
		str = search_val.replace(/\s+/g, '+').toLowerCase();		

		var url  = "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3D"+category_val[1]+"&field-keywords="+str;	

		localStorage.setItem('currentURL',url);

		$('#search-keyword').modal('hide');	
		$('.tablesorter-filter-row').hide();			
		startScrap(url);		
	});

	//manage favorite
	$(document).on('click','.favorites-urls', function(){
		$('#favorites-urls-popup').modal('show');

		if(localStorage.getItem('url')){
			$(".favorites-list tbody").html('');	
			var data = localStorage.getItem('url');
			var substr = data.split(',');
			for(var i=0; i< substr.length; i++) {
			  rating_r = substr[i].replace(/[\[\]']+/g,'');
			  rating_r = rating_r.replace(/\"/g, "");			  
			  var tr = '';
			  var tr = '<tr>';
			  tr += '<td>'+rating_r.replace(".", "")+'</td>';
			  tr += '<td><a href="#" class="remove_url">Remove</a>&nbsp;<a href="#" class="search_url">Search</a></td>';							
			  tr += '</tr>';			  
			  $(".favorites-list tbody").append(tr);	
			}
		}
	});


    //show setting popup
    $(document).on('click','#setting-popup-id', function(){
        $('#setting-popup').modal('show');
    });

    //show barcode scanner popup
    $(document).on('click','.barcode', function(){
    	console.log('poko men');
        $('#barcode-popup').modal('show');
    });

    //validate master key 
    $(document).on('click','#btn-add-barcode', function(){
    	var master_key = $('.barcode-input').val();

    	if(!master_key){
    		return;
    	}

		$.ajax({
	        type: "POST",	        
	        url: _apiUrl+"index.php?type=checkMasterKey",
	        data: {master_key: master_key},  		        
	        success: function (responseJson) {		        	
	           		if(responseJson == 1){
	           			var tr = '<tr><td class="master_key">'+master_key+'</td><td class="center1"><a href="#" class="remove_barcode">Remove</a>&nbsp;<a href="#" class="search_barcode">Search</a></td></tr>';
	           			$('.barcode-table').append(tr);
	           		}else{
	           			alert('invalid master key!');
	           		}
	        }
	    });
    }); 


    //remove barcode 
    $(document).on('click','.remove_barcode', function(){  
    	 $(this).closest('tr').remove(); 
    });

    //show product info barcode base
    $(document).on('click','#btn-open-barcodes', function(){
      var master_key = $(this).closest('tr').find('.master_key').text(); 
      $('#barcode-popup').modal('hide');
      $('#barcode-interface').modal('hide');


      var asins = [];	

      $.ajax({
	        type: "POST",	        
	        url: _apiUrl+"index.php?type=getAllBarecode",
	        data: {master_key: master_key},  
	        async: false,		        
	        success: function (responseJson) {		
				productInfos = $.parseJSON(responseJson);		           		
				$.each(productInfos, function(k, productInfo) {
					  asins.push(productInfo.asin);					  
				});	

				displayDataInTable(asins);
	        }
	    });
    });


    //search product of master key
    $(document).on('click','.search_barcode', function(){
      var master_key = $(this).closest('tr').find('.master_key').text(); 
      $('#barcode-popup').modal('hide');
      $('#barcode-interface').modal('show');

       $(".barcode-list-table tbody").html('');

      $.ajax({
	        type: "POST",	        
	        url: _apiUrl+"index.php?type=getAllBarecode",
	        data: {master_key: master_key},  
	        async: false,		        
	        success: function (responseJson) {		
				productInfos = $.parseJSON(responseJson);		           		
				$.each(productInfos, function(k, productInfo) {
					  var tr = '<tr>';
					  tr += '<td>'+productInfo.barcode+'</td>';
					  tr += '<td>'+productInfo.title+'</td>';						
					  tr += '</tr>';			  
					  $(".barcode-list-table tbody").append(tr);	
					  console.log(productInfo)
				});	

				$('.barcode-loading').hide();
	        }
	    });
    });

    //enable / disable setting
    $(document).on('click','.colToShow', function(){   
        var target_col =  $(this).data('col');
        if($(this).is(':checked')){                
        	localStorage.setItem(target_col, 'yes');        	        	
            $('.'+target_col).show();

        }else{
        	localStorage.setItem(target_col, 'no');         	
            $('.'+target_col).hide();
        }
    });

	//onClick add favorite button
	$(document).on('click','#btn-add-favorite', function(){
		var search_val  = $('.favorite-url-add-text').val();		
		

		if(search_val == ''){			
			$('#fav-keyword-msg').show().text('Please enter Keyword');
			return;
		}		

		var a = [];

		if(localStorage.getItem('url')){
			//console.log(localStorage.getItem('url'));
			//a.push(JSON.parse(localStorage.getItem('url')));
		} else{
			localStorage.setItem('url', JSON.stringify(a));
		}

		SaveDataToLocalStorage(search_val);		
	});

	function searchByURL(category, keyword){
		var str = '';
		str = keyword.replace(/\s+/g, '+').toLowerCase();		

		var url  = "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3D"+category+"&field-keywords="+str;
		
		localStorage.setItem('currentURL',url);

		startScrap(url);	
	}

	function SaveDataToLocalStorage(data){
	    var a = [];
	    // Parse the serialized data back into an aray of objects
	    a = JSON.parse(localStorage.getItem('url'));
	    // Push the new data (whether it be an object or anything else) onto the array
	    a.push(data);
	    // Alert the array value
	    //alert(a);  // Should be something like [Object array]	    
	    // Re-serialize the array back into a string and store it in localStorage
	    localStorage.setItem('url', JSON.stringify(a));
	    //console.log(localStorage.getItem('url'))

	  //   if(localStorage.getItem('url')){
			// $(".favorites-list tbody").html('');	
			// var data = localStorage.getItem('url');
			// var substr = data.split(',');
			// for(var i=0; i< substr.length; i++) {
			//   rating_r = substr[i].replace(/[\[\]']+/g,'');
			//   rating_r = rating_r.replace(/\"/g, "");			  
			//   rating_r = rating_r.replace(".", "");			  
			  var tr = '';
			  var tr = '<tr>';
			  tr += '<td>'+data+'</td>';
			  tr += '<td><span href="#" class="remove_url">Remove</span>&nbsp;<span href="#" class="search_url">Search</span></td>';							
			  tr += '</tr>';			  
			  $(".favorites-list tbody").append(tr);	
			//}
		//}
	}

	//search favorite keyword
	$(document).on('click','.search_url', function(){
		 var pn = $(this).closest('td').prev('td').text();
		 $('#favorites-urls-popup').modal('hide');
		 $('.tablesorter-filter-row').hide();
		 searchByURL('aps', pn);
	});

	//remove favorite keyword
	$(document).on('click','.remove_url', function(){
	     var pn = $(this).closest('td').prev('td').text();		
		 var data = localStorage.getItem('url');
		// localStorage.removeItem('url');	
		 var a = [];

			var substr = data.split(',');
			for(var i=0; i< substr.length; i++) {
			  rating_r = substr[i].replace(/[\[\]']+/g,'');
			  rating_r = rating_r.replace(/\"/g, "");			  
			  rating_r = rating_r.replace(".", "");			  
			  if(pn == rating_r){
				substr.splice(i,1);	
				localStorage.removeItem('url');
				localStorage.setItem('url',substr);	
				$(this).closest('tr').remove();							
				break;		
		      }
		}
	});

	function getCurrentNumber(link){
		var chick = link.split('?');
		var yourString = chick[0].replace ( /[^\d.]/g, '' );
		return yourString;
	}

	var bootboxMsg = function(msg){
			var box =bootbox.dialog({
	                message: "<label class='text-danger'>"+msg+"</label>",                       
	        });

	        setTimeout(function() {
	                // be careful not to call box.hide() here, which will invoke jQuery's hide method
	                box.modal('hide');
	        }, 2000);
	}

	//Add and load more products
	$(document).on('click','#more-products', function(){
		if(localStorage.getItem('paging') == 'undefined'){ 
		  	bootboxMsg('No more products found!');

		}else{			
			bootboxMsg('Please wait, while fetching products.')

			var link = localStorage.getItem('paging');
			var cc = link;
			var number = getCurrentNumber(cc);
			var toys = cc.split('sr_pg_'+number);
			var first_part = 'https://www.amazon.com/s/ref=sr_pg_';
			console.log(first_part);
			var wholes = toys[1].split('page='+number);
			console.log('dd',wholes);

			var next_page;
			var future;

			if(localStorage.getItem('next_page') !=null){		
				next_page = localStorage.getItem('next_page');
			    future = parseInt(next_page) + parseInt(1);
			    localStorage.setItem('next_page',future);
			}else{
				next_page = number;    
			    future = parseInt(next_page) + parseInt(1);
			    localStorage.setItem('next_page',future);
			}
			
			var url = first_part+next_page+wholes[0]+'page='+next_page+wholes[1];
			paginationRecords(url);			
		}
	});

	//handle ajax http error
	function handleError(jqXHR, exception){
		  	var msg = 'There seems to be some error, Please try again !';
	        if (jqXHR.status === 0) {
	            msg = 'Not connect.\n Verify Network.';
	        } else if (jqXHR.status == 404) {
	            msg = 'Requested page not found. [404]';
	        } else if (jqXHR.status == 500) {
	            msg = 'Internal Server Error [500].';
	        } else if (exception === 'parsererror') {
	            msg = 'Requested JSON parse failed.';
	        } else if (exception === 'timeout') {
	            msg = 'Time out error.';
	        } else if (exception === 'abort') {
	            msg = 'Ajax request aborted.';
	        } else {
	            msg = 'Uncaught Error.\n' + jqXHR.responseText;
	        }

	        return msg;
	}	

	//for fba fees
	function gettings(){
	$.ajax({
	          url: "http://asinspector.com/rest/getMeFBA.php",   
	          method:'post',  
	          data: {
	              getFBAFeesForListAsins: 0,
	                'data[0][asin]': 'B073TSKFRX',                  
	                'data[0][weight]': '80',                  
	                'data[0][width]': '670',                  
	                'data[0][length]': '1150',                  
	                'data[0][height]': '80'                  
	            },
	            success: function( data ) {              
	               console.log('data', data)
	            }
	        });
	}

	// append paginate records
	//Render data to popup html
	function appendPaginationRecords(asins){ 
			var t = $('#main-table').DataTable(); 
			var asr = $('#avg_sale_rank').text();

			if(!asr){
				asr = 0;
			}

			var sale_rank_total = parseInt(asr);			
			var total_sale_rank = 0;

			var old_rec = $('#total_records').text();

	  		var num = parseInt(old_rec);

	  		if(!num){
	  			num = 0;
	  		}

			var sale_rank_total = 0;
			var total_sale_rank = 0;

	  		var num = 1;
			$.ajax({
		        type: "POST",	        
		        url: _apiUrl+"index.php?type=product_info_for_lv",
		        data: {asin: asins},  		        
		        success: function (responseJson) {		        

		        		if(!responseJson){
		        			noResultFound();
		        			return false;
		        		}	

		           		productInfos = $.parseJSON(responseJson);
		           		$("#main-table tbody").html('');

		           		var review_total = 0;
		           		var rating_total= 0;
		           		var common_loader = '<img src="../images/loader-upload_ajax.gif">';

						$.each(productInfos.all_products, function(k, productInfo) {
					     if(productInfo.asin != ''){	

					     	rating_total = parseFloat(rating_total) + parseFloat(productInfo.rating);
					     	review_total = parseInt(review_total) + parseInt(productInfo.review);

							var tr = '<tr>';						
							tr += '<td class="srCol column-number"><b><span class="line-selection-number">'+num+'</span><input type="checkbox" value="'+num+'" class="line-selection"></b></td>';
							tr += '<td class="asinCol">'+productInfo.asin+'</td>';
							tr += '<td class="productNameCol">'+'<a target="_blank" href="'+productInfo.link+'" title="'+productInfo.title+'"> '+productInfo.title.substring(0,15)+'</a></td>';	
							tr += '<td class="estimatedCol">'+common_loader+'</td>';						
							tr += '<td class="estimatedRevenueCol">'+common_loader+'</td>';								
							tr += '<td class="saleRankCol" data-price='+productInfo.formattedPrice+' data-sale_rank='+productInfo.sale_rank+'>'+productInfo.sale_rank+'</td>';	
							tr += '<td class="ratingCol">'+productInfo.rating+'</td>';		
							tr += '<td class="reviewCol">'+productInfo.review+'</td>';		
							tr += '<td class="categoryCol" data-category='+productInfo.category+'><a title="'+productInfo.category+'">'+productInfo.category+'</a></td>';						
							tr += '<td style="display:none" class="length_rawCol">'+productInfo.length_raw+'</td>';	
							tr += '<td style="display:none" class="weight_rawCol">'+productInfo.weight_raw+'</td>';	
							tr += '<td style="display:none" class="width_rawCol">'+productInfo.width_raw+'</td>';	
							tr += '<td style="display:none" class="height_rawCol">'+productInfo.height_raw+'</td>';										
							num++;						
							$("#main-table tbody").append(tr);	
							$('#total_records').html(num-1);
							hideDefaultColumn();							
						} 	
					});				
				
					var total_rec = $('#main-table tbody tr').length;										
					var avg_rating = rating_total / num;
					var avg_review = review_total / num;

					$('#avg_rating').html(avg_rating.toFixed(2))
					$('#avg_reviews').html(avg_review.toFixed(2))
					
					//Get montly sale and revenue
					getMontlySaleRevenue();	

		        },error: function (jqXHR, exception) {
			       // var msg = handleError(jqXHR, exception);
			       // httpError(msg);
			    },
		    });  	   
	  	}

	//get review and rating
	var getReviewAndRatingAppend = function(total_sale_rank){	
	
	var exe = $("#main-table tbody").find('tr').length;		
	$('#total_records').html(parseInt(exe) -1);	

	var soreview = $('#avg_reviews').text();
	
	console.log('soreview', soreview);
	
	var sum_of_review = parseFloat(soreview);	
   	
   	var review_count = 0;
   	var sorating = $('#avg_rating').text();

   	console.log('sorating', sorating);
   	
   	var sum_of_rating = parseFloat(sorating);   
   	var rating_count = 0; 

   	var rating_r = 0;	
   	var i = 1;
    $("#main-table tbody").find('tr.startRow').each(function(){
    	var _that = $(this);  
    	
    	var url  = _that.find('.productNameCol a').attr('href');    	
		var category = _that.find('.categoryCol a').attr('title');    		
		var category_name = _that.find('.categoryCol a').text();  
		console.log('category_name', category_name)  		
		var asinCol = _that.find('.asinCol').attr('data-my_asin');    				
		var estimatedCol = _that.find('.estimatedCol').text();    		    	
		var formattedPrice = _that.find('.priceCol').text();   
		var price = formattedPrice.replace("$", "");    

		var lowestPriceColVal = _that.find('.lowestPriceCol').text();   
		lowestPriceColVal = lowestPriceColVal.replace("$", "");		
    	

		$.ajax({
		    url : url,
		    type : "get",		    
		    success : function(item) {
		    	//Calculate estimated sale if not present in current tr
	    		
	    		//if(!estimatedCol){
	    			var datass = checkCategoryAndSalesrank(item,'com');
	    			console.log('asinCol', asinCol)
	    			console.log('data', datass)
	    			console.log('asinCol', asinCol)
	    			if(!category){
	    				 category_name = datass.cname; 
	    				_that.find('.categoryCol a').text(datass.cname);
	    				_that.find('.saleRankCol').text(datass.rank);
	    			}
	    		//}

		    	//End

		    	//For calculating the available quantity and understock, overstock
		    	var optional_quantity = $(item).find("#addToCart #quantity option:last-child").val();   
                /******--Add To Cart--****/
                var data = {};
                var rsid = $(item).find("#addToCart #session-id").val();
               
                data['ASIN.1'] = asinCol; 
                data['Quantity.1'] = '2000';                
                data['AWSAccessKeyId'] = 'AKIAJDBS764437ALC74A';
                data['AssociateTag'] = 'davin01-20';
                data['AWSAccessKeyId'] = 'davin01-20';
                data['confirmPage'] = 'confirm';
                data['SessionId'] = rsid;

                
                
		    	var c = '';
		    	var v = '';
			    c = $(item).find('#averageCustomerReviews .a-icon-alt').text();
				v = $(item).find('#acrCustomerReviewText').first().text();			
				console.log('v ', v)				
				if(v){			
					rating_r = v.replace(/\D/g,'');
				}

				let rankTemp = $.trim($(item).find('#SalesRank').text());
				rankTemp = rankTemp.split('in');
				rankTemp = rankTemp[0].split(':');
				// deleting the # symbol
				rank = $.trim(rankTemp[1]).slice(1);
				console.log('rankTemp', rank);
				let th = $(item).find('th');
				let li = $(item).find('li');
				if(!rank){					
					for(j = 0; j < th.length; j++){
						if($.trim($(th[j]).text()) == 'Best Sellers Rank'){

							// full rank text
							let rankTemp = $.trim($(th[j]).next().text());
							// splitting the first number
							rankTemp = rankTemp.split('in');
							// deleting the # symbol
							rank = rankTemp[0].slice(1);
						}	
					};
				}

				console.log('nisha rank code', rank)
				
				var sR = _that.find('.saleRankCol').text();
				var str = rank.replace(',');				
				str = parseInt(str);

				if(_that.find('.saleRankCol').text() == ''){
					if($.isNumeric(str) && str !=''){
						_that.find('.saleRankCol').text(str);	
						sR = str;
					}else{
						_that.find('.saleRankCol').text('');	
					}
				}



				//_that.find('.availableQuantityCol').html('');
            	//_that.find('.stockCol').html('');
            	var est_sale = calculateSales('com',category_name,sR,price);
				console.log(est_sale,'est_sale',asinCol);


            	if(est_sale != undefined){   
            		_that.find('.estimatedCol').text(est_sale[0]);                    		
            		_that.find('.estimatedRevenueCol').text(est_sale[1]);                    		
            	}else{        			
        			_that.find('.estimatedCol').text('');                    		
        			_that.find('.estimatedRevenueCol').text('');
            	}


				// console.log(category, rank);
				// var esting = getEstimatedSaless(category, rank.replace(/\D/g,''));
				// console.log('esting', esting);
				
				var review_count_c = '';
                if(c != 'Be the first to review this item'){
				if(c){			
					review_count_c = parseFloat(c.match(/-?(?:\d+(?:\.\d*)?|\.\d+)/)[0]);	
				}}else{
                    review_count_c = '';
                }			



				if (rating_r == null){
					rating_r = '';	
				}else{		
					console.log('sum_of_review', sum_of_review)			
					sum_of_review = sum_of_review + parseInt(rating_r);	
					var avg = sum_of_review/total_sale_rank;
					$('#avg_reviews').text(avg.toFixed(0));				
   					review_count = parseInt(review_count) + parseInt(i);
				}

				if(review_count_c == ''){
					review_count_c = '';									
				}else{
					console.log('sum_of_rating', sum_of_rating)
					sum_of_rating = sum_of_rating + parseFloat(review_count_c);
					var avg = sum_of_rating/total_sale_rank;
					$('#avg_rating').text(avg.toFixed(1));	
   					rating_count = parseInt(rating_count) + parseInt(i);	
				}

				//BB SHIPPING COST
				var shipping_cost = $(item).find('#ourprice_shippingmessage span').first().text();
				var shipping_cost_doublenumber = Number(shipping_cost.replace(/[^0-9\.]+/g,""));

				//BB PRICE 
				var bb_price = $(item).find('#priceblock_ourprice').text();
				var bb_price_doublenumber = Number(bb_price.replace(/[^0-9\.]+/g,""));

				//Show Lwst Price (new) + shipping
				var lowestPriceCol = _that.find('.lowestPriceCol').html();	
				var lpc = 0;
				
				if(lowestPriceCol){
					lpc = Number(lowestPriceCol.replace(/[^0-9\.]+/g,""));
				}

				var total_lowest_new_plus_shipping = shipping_cost_doublenumber + lpc;

				//SELLER DATA
				var str1 = item;
				var str2 = "sold by Amazon";
				var str3 = "Fulfilled by Amazon";
				var bbseller = '';
				
				if(str1.indexOf(str2) != -1){
				    bbseller = 'AMZ';
				}else if(str1.indexOf(str3) != -1){
					bbseller = 'FBA';
				}else{
					bbseller = 'MCH';
				}				

				var fullSaleRank = ''; 
				var htmlSource = item;
				var productDetails = $(htmlSource).find("#productDetails_detailBullets_sections1").find("tr");
	      		productDetails.each(function(){
		            if($.trim($(this).find("th").text()) === "Best Sellers Rank"){
		            	fullSaleRank =  $.trim($($(this).find("td")).html());		            	
		            }
		        });	 

	      		//calculate fba fees	      	
	      		var weight = _that.find('.weight_rawCol').text();	
	      		var length = _that.find('.length_rawCol').text();	
	      		var width  = _that.find('.width_rawCol').text();	
	      		var height = _that.find('.height_rawCol').text();	
	      		var asin   = _that.find('.asinCol').text();	

	      		var total_fba = 0;
	      		$.ajax({
			          url: "http://asinspector.com/rest/getMeFBA.php",   
			          method:'post',  
			          async: false,
			          data: {
			              getFBAFeesForListAsins: 1,
			                'data[0][asin]': asin,                  
			                'data[0][weight]': weight,                  
			                'data[0][width]': width,                  
			                'data[0][length]': length,                  
			                'data[0][height]': height                  
			            },
			            success: function(data) { 
			            	total_fba = parseFloat(data.dataFba[0].orderHandling) + parseFloat(data.dataFba[0].fbaStorageFee) + parseFloat(data.dataFba[0].pickAndPack) + parseFloat(data.dataFba[0].weightHandling + 0.99);			             
			       }
			    });

			    var priceForRefferFees = '';
	      		var categoryForRefferFees = '';

			    if(lowestPriceColVal && lowestPriceColVal != undefined){
			    	priceForRefferFees = lowestPriceColVal;
	      			categoryForRefferFees = category;
			    }else{
			    	priceForRefferFees = formattedPrice;
	      			categoryForRefferFees = category_name;
			    }

			    var refferFess = getPerRefFeeProductType(priceForRefferFees, categoryForRefferFees);
			    total_fba = parseFloat(total_fba) + parseFloat(refferFess.toFixed(2));

	      		//break even cost
	      		var break_even_cost = lpc - total_fba;

				i++;
				var total = parseFloat(bb_price_doublenumber) + parseFloat(shipping_cost_doublenumber);
				var ces = '<a>Click<div style="display:none;">'+fullSaleRank+'</div></a>';

 				if(break_even_cost){
					break_even_cost = Math.abs(break_even_cost);
				}
				
				_that.find('.breakEvenCostCol').html(break_even_cost.toFixed(2));	
				_that.find('.fbaCol').html(total_fba.toFixed(2));	
				_that.find('.lowestPricePlusShippingCol').html(total_lowest_new_plus_shipping.toFixed(2));	
				_that.find('.bbPricePlusbbShippingCostCol').html(total.toFixed(2));	
				_that.find('.bbPriceCol').html(bb_price_doublenumber);	
				_that.find('.bbShippingCostCol').html(shipping_cost_doublenumber);	
				_that.find('.lowestShippingCol').html(shipping_cost_doublenumber);	
				_that.find('.bbSellerCol').html(bbseller);	
				_that.find('.fullSaleRankCol').html(ces);	
				_that.find('.ratingCol').text(review_count_c);								
				_that.find('.reviewCol').text(rating_r);
				_that.removeClass('startRow');

		    },error: function (jqXHR, exception) {
		    	//_that.find('.availableQuantityCol').html('');
		    	//_that.find('.stockCol').html('');
		    	_that.find('.estimatedCol').html('');
		    	_that.find('.estimatedRevenueCol').html('');

		    	$('#avg_reviews').text('');
		    	$('#avg_rating').text('');

		    	_that.find('.breakEvenCostCol').html('');
		    	_that.find('.fbaCol').html('');
		    	_that.find('.lowestPricePlusShippingCol').html('');
		    	_that.find('.lowestShippingCol').html('');
		    	_that.find('.bbPricePlusbbShippingCostCol').html('');
		    	_that.find('.bbPriceCol').html('');	
		    	_that.find('.bbShippingCostCol').html('');	
		    	_that.find('.bbSellerCol').html('');	
		    	_that.find('.saleRankCol').html('');
			 	_that.find('.fullSaleRankCol').html('');	
				_that.find('.ratingCol').text('');								
				_that.find('.reviewCol').text('');		
				_that.removeClass('startRow');			
		    },							
		 });
	   });		   
	}


	//fetch more variations of product
	$(document).on('click', '.more_choices', function(e){				
		if($(this).hasClass('doneVariations')){
			bootboxMsg('Already fetched variations!');			

		}else{
			bootboxMsg('Please wait, while fetching variations!');			
			
			$(this).addClass('doneVariations');
			var parent_asin = $(this).attr('data-parent_asin');
			getMoreChoices(parent_asin);
		}
	});

	function getMoreChoicess(parent_asin){
		$.ajax({
		        type: "POST",	        
		        url: _apiUrl+"index.php?type=getMoreChoice",
		        data: {parent_asin: parent_asin},  		        
		        success: function (responseJson) {		        			        		
		           		productInfos = $.parseJSON(responseJson);
		           		console.log('productInfos', productInfos);
		           		appendPaginationRecords(productInfos.more_choices);		           		
		        },   		
	    });       		
	}

	function getWalmartProduct(){
		appendLoader();	
		setTimeout(function(){ 
		var walmart_titles = localStorage.getItem('walmart_titles');
		var words = walmart_titles.split(",");
    	var words_length = words.length;
    
			$.ajax({
			        type: "POST",	        			      
			        url: _apiUrl+"index.php?type=walmart",
			        data: {walmart_titles: walmart_titles},  		        
			        success: function (responseJson) {		        
			        		if(responseJson){				        		 			        		 	
			           		 productInfos = $.parseJSON(responseJson);			           		 	
			           		 console.log('productInfos', productInfos)
		           		 	 var res = displayDataInTable(productInfos);		

		           		 	 var msg = '<h4>Result</h4><ul><p&nbsp;</p><li>'+productInfos.length+'/'+words_length+' product(s) identified on walmart</li><li>0 has an UPC code (required to try to match on Amazon)</li><li> from 0 product(s) with an UPC code, 0 is(are) not register on Amazon</li><li>0 had an exact match on Amazon!</li>';

		           		 	 if(res){
			           		 	 var box =bootbox.dialog({
						                message: "<label class='text-danger'>"+msg+"</label>",                       
						         });

						         setTimeout(function() {
						                // be careful not to call box.hide() here, which will invoke jQuery's hide method
						                box.modal('hide');
						         }, 10000);
					        }
			            }

			        }   		
			});  
		}, 2000);         				
	}	

	var getMoreChoices = function(parent_asin){
		$.ajax({
		        type: "POST",	        
		        url: _apiUrl+"index.php?type=getMoreChoice",
		        data: {parent_asin: parent_asin},  		        
		        success: function (responseJson) {		        			        		
		           		productInfos = $.parseJSON(responseJson);
		           		console.log('productInfos', productInfos);
		           		appendPaginationRecords(productInfos.more_choices);		           		
		        },   		
	    });       		
	}
});


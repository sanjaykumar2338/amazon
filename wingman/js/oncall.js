chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){ 
 if(message.method == 'openpopup'){   	
	var _apiUrl = "https://www.legendaryanalysis.com/";
	var checkstatus = false;

	chrome.storage.sync.get(function(data) {
		if(data.userId && data){

			var search_val = $('#twotabsearchtextbox').val();

			console.log('search_val', search_val);

			if(search_val){
				var t = localStorage.getItem('search_val');				
				if(t && t != search_val){
					$('#myModal').remove(); 
					localStorage.setItem('search_val',search_val);					
				}else{
					localStorage.setItem('search_val',search_val);
				}
			}

			if($('body').find('#myModal').length){
			   $('#myModal').modal('show'); 
			   return;
			}

			//$('body').find('#myModal').remove();

			//alert($('body').find('#myModal').length)

			var PageSource = DOMtoString(document);
			var AsinsArray = [];
			var AsinsArrayPointer = 0;
			var ResultArray = [];
			var DuplicatesArray = [];
			var PageStatus = '';

			var html = '',
	        node = document.firstChild;		
		    
		    var AmazonProductMarkupType = 'div';		    
			var CategoryContent = PageSource.split('<div id="result_');

			if(CategoryContent.length == 1)
			{
				AmazonProductMarkupType = 'li';
				CategoryContent = PageSource.split('<li id="result_');
			}

			if(CategoryContent.length > 1)
			{
				PageStatus = 'Category Page';
				
				var AsinsAmount = 0;
				if(CategoryContent.length >= 60)
				{
					AsinsAmount = 60;
				}
				else if(CategoryContent.length >= 48)
				{
					AsinsAmount = 48;
				}
				else if(CategoryContent.length >= 32)
				{
					AsinsAmount = 32;
				}
				else if(CategoryContent.length >= 24)
				{
					AsinsAmount = 24;
				}
				else if(CategoryContent.length >= 16)
				{
					AsinsAmount = 16;
				}
				else if(CategoryContent.length >= 12)
				{
					AsinsAmount = 12;
				}
				
				for(var i=1;i<CategoryContent.length;i++)
				//for(var i=1;i<=AsinsAmount;i++)
				{
					var CurrentAsin;
					if(AmazonProductMarkupType == 'div')
					{
						CurrentAsin = CategoryContent[i].split('name="');
					}
					else
					{
						CurrentAsin = CategoryContent[i].split('data-asin="');
					}
					
					CurrentAsin = CurrentAsin[1].split('"');
					CurrentAsin = CurrentAsin[0].match(/([0-9A-Z]{9,16})/);
					if(CurrentAsin != null){
						AsinsArray[AsinsArrayPointer] = CurrentAsin[0];
						AsinsArrayPointer++;
					}
					
					var StopIndicator = CategoryContent[i].split('<div id="results-atf-next"');
					if(StopIndicator.length > 1)
					{
						break;
					}
				}
			}

			if(AsinsArray.length > 0)
			{
				var AsinsString = AsinsArrayToString(AsinsArray, 'comma');				
			}

			//Top Page
			if(AsinsArray.length == 0)
			{
				if(PageStatus != '')
				{	
					console.log('Warning. ' + PageStatus + ' has been parsed incorrectly. Check the ' + PageStatus + ' processing steps.');
					PageStatus = '';
				}
				else
				{
					//Top page processing starts here
					var AmazonTopPageMarkupType = 'old';
					var TopContent = PageSource.split('<div class="zg_itemImage_normal">');
					
					if(TopContent.length == 1)
					{
						TopContent = PageSource.split('<span class="zg_itemImageImmersion">');
					}
					
					if(TopContent.length == 1)
					{
						TopContent = PageSource.split('<div class="zg_itemImageImmersion">');
					}
					
					if(TopContent.length == 1)
					{
						AmazonTopPageMarkupType = 'new';
						TopContent = PageSource.split('asin="');
					}
					
					var AsinsAmount = 0;
					if(TopContent.length >= 20)
					{
						AsinsAmount = 20;
					}
					
					for(var i=1;i<=AsinsAmount;i++)
					{
						var CurrentAsin;
						if(AmazonTopPageMarkupType == 'old')
						{
							CurrentAsin = TopContent[i].split('>');
							CurrentAsin = CurrentAsin[0].match(/([\/][0-9A-Z]{9,16}[\/])/);
							if(CurrentAsin != null){
								CurrentAsin[0] = CurrentAsin[0].replace(/[\/]/g, "");
							}
						}
						else
						{
							CurrentAsin = TopContent[i].split('"');
							CurrentAsin = CurrentAsin[0].match(/([0-9A-Z]{9,16})/);
						}
						
						if(CurrentAsin != null){
							AsinsArray[AsinsArrayPointer] = CurrentAsin[0];
							AsinsArrayPointer++;
						}
					}
				}
			}

			if(AsinsArray.length > 0)
			{
				var AsinsString = AsinsArrayToString(AsinsArray, 'comma');				
			}
				
			//Raw match
			if(AsinsArray.length == 0)
			{
				if(PageStatus != '')
				{
					console.log('Warning. ' + PageStatus + ' has been parsed incorrectly. Check the ' + PageStatus + ' processing steps.');
					PageStatus = '';
				}

				//Raw match processing starts here
				ResultArray = PageSource.match(/([\/][0-9A-Z]{9,16}[\/])/g);
				//ResultArray = PageSource.match(/([^0-9A-Za-z][0-9A-Z]{9,16}[^0-9A-Za-z])/g);
				if(ResultArray != null){
					for(var i=0;i<ResultArray.length;i++)
					{
						//var AsinLength = ResultArray[i].length - 2;
						//ResultArray[i] = ResultArray[i].substr(1, AsinLength);
						ResultArray[i] = ResultArray[i].replace(/[\/]/g, "");
						if(DuplicatesArray[ResultArray[i]] != 1)
						{
							DuplicatesArray[ResultArray[i]] = 1;
							AsinsArray[AsinsArrayPointer] = ResultArray[i];
							AsinsArrayPointer++;
						}
					}
					
					var AsinsString = AsinsArrayToString(AsinsArray, 'comma');					
				}
				else {
					var AsinsString = false;
				}
			}	    

			var path = chrome.extension.getURL('images/logo_images/wingman.png');
			var wrong = "<img style='width:40px;height:30px' src='https://cdn1.iconfinder.com/data/icons/basic-ui-elements-coloricon/21/19-512.png'>";
			var right = "<img style='width: 56px;height: 30px;'' src='https://cdn4.iconfinder.com/data/icons/flat-game-ui-buttons-icons-2/80/1-33-512.png'>";
		
			var html = '<div class="modal fade"  class="ui-widget-content" data-keyboard="false" data-backdrop="static" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
				html += '<div class="modal-dialog modal-sm">';
				html += '<div class="modal-content" style="width: 1200px; margin:auto;">';
				html += '<div class="modal-header" style="background: #f6f5f3;height: 73px;"><button type="button" class="close" style="font-size:50px;" data-dismiss="modal">&times;</button>';				
				html += '<h4 class="modal-title" style="margin:auto;width: 12%;"><img style="width:139px;" src="'+path+'"></h4></div>';  				
				html += '<div class="modal-body">';				            							  
				
				html += '<ul class="nav nav-pills"> <li class="active"><a class="btn btn-info" data-toggle="pill" href="#home">Product List(<span id="total_records">0</span>)</a></li><li><a class="btn btn-info" data-toggle="pill" href="#menu1">Wing Man</a></li><li style="display:none;"><a type="button" class="btn btn-info" id="hide_popup">Hide</a></li></ul>';

				html +='<div class="tab-content">';

				html +='<div id="home" class="tab-pane fade in active">'; 
				html += '<table class="table-responsive table table-striped" id="popuptable">';
				html += '<thead>';	
				html += `<th style="display:none;" class="sr_no">#</th>						      
							    	<th class="product_name">Name</th>						      
							    	<th class="product_name">ASIN</th>						      
							    	<th class="brand">Brand</th>						      
							    	<th class="price">Price</th>						      
							    	<th class="category">Category</th>						      
							    	<th class="binding">Binding</th>						      
							    	<th class="rank">Rank</th>						      
							    	<th class="sales">Sales</th>						      
							    	<th class="revenue">Revenue</th>						      
							    	<th class="review">Review</th>						      
							    	<th class="rating">Rating</th>						      
							    	<th class="seller">Seller</th>						      
							    	<th class="lqs">LQS</th>						      
							    </thead>`;
				html += '<tbody><tr id="loading_data"><td style="display:block;background:transparent;">';	
				html += '<img style="padding-left:0px"; src="http://www.casasbahia-imagens.com.br/App_Themes/CasasBahia/img/load.gif">';						    
				html += `</td></tr></tbody>
						 </table></div>`;							

				html += '<div id="menu1" class="tab-pane fade">';
				html += '<table class="table-responsive table table-striped" id="wingman">';		 
				html += '<tbody>';
				html += '<tr><td><b>Mostly Tshirt on Page</b> <span class="mostly_tshirt_wrong" style="display:none;">'+wrong+'</span><span style="display:none;" class="mostly_tshirt_right">'+right+'</span></td><td><b>Less Than 2000 Results</b> <span style="display:none" class="total_result_wrong">'+wrong+'</span><span style="display:none" class="total_result_right">'+right+'</span></td><td><b>8 out of the 10 Have a BSR</b> <span class="eight_bsr_wrong" style="display:none;">'+wrong+'</span><span class="eight_bsr_right" style="display:none;">'+right+'</span></td><td><b>2 out of the 10 Udner A Million BSR</b> <span class="two_bsr_wrong" style="display:none;">'+wrong+'</span><span class="two_bsr_right" style="display:none;">'+right+'</span></td></tr>';	
				html += '<tr><td style="display:block;background:transparent;width:100%;"><img id="thumb_loader" style="padding-left:0px"; src="http://www.casasbahia-imagens.com.br/App_Themes/CasasBahia/img/load.gif"><span class="wrong_thumb" style="display:none;"><img style="width: 273px;" src="https://www.m35design.co.uk/wp-content/uploads/2017/07/thumbs-down-bad-review.png"></span><span style="display:none;" class="right_thumb"><img style="width: 273px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmEHUqtAV6doBoMdkR4S-jlGSn1xAY6dd6o-PUeyT6xm5UwMuUQQ"></span></td></tr>';
				html += '</tbody>';
				html += '</table>';		 
				html += '</div>';		 
				
				html +='</div>';

				html += `</div>
				            <div class="modal-footer">				            
				            </div>
				        </div>
				    </div>
				</div>`;

			$('#popuptable').DataTable();	
			$('body').prepend(html);
    		$('#myModal').modal('show'); 

    		$("#myModal").draggable({
    		    handle: ".modal-header"
			});

			$('.modal-content').resizable({      			
  				minHeight: 300,
 				minWidth: 300
	    	});

	    	 $('#myModal').on('show.bs.modal', function() {
      			$(this).find('.modal-body').css({
        			'max-height': '100%'
      			});
    		});

    		$('#hide_popup').on('click', function(){
    		   $('#myModal').modal('hide'); 		
    		});

    		$('.modal-content').resizable({		     
		      minHeight: 700,
		      minWidth: 300
		    });

    		//$('.modal-dialog').draggable({
    		//handle: ".modal-header"
  			//});

    		console.log('AsinsString', AsinsString);

    		var trainindIdArrays = AsinsString.split(',');

    		//console.log(trainindIdArrays.length,'trainindIdArrays.length')

    		if(AsinsString == 'undefined' || !AsinsString || trainindIdArrays.length < 0){
    			$("#popuptable tbody").html('No Record Found.');
    			$("#wingman tbody").html('No Record Found.');
    			return false;
    		}     

   //  		var trainindIdArray = trainindIdArrays.filter(function(itm, i, a) {
			//     return i == a.indexOf(itm);
			// });  

    		//$("#popuptable tbody").html('');
    		var size = 20; var arrayOfArrays = [];
			for (var i=0; i<trainindIdArrays.length; i+=size) {
			     arrayOfArrays.push(trainindIdArrays.slice(i,i+size));
			}
			
			var p =  $( '#popuptable' ).fadeIn().promise(); 

			arrayOfArrays.forEach( function( el, i ) {						    
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

							$.each(productInfos.all_products, function(k, productInfo) {
								var sale = 'N/A';
								var revenue = 'N/A';
								var rank = 'N/A';

								if (productInfo.rank > 0) {
									rank = productInfo.rank;
								}

								var sales = false;
								if(productInfo.price > 0) {
									var sales = calculateSales('com',productInfo.category, rank, productInfo.price);
								}	

								

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


								if(productInfo.brand == null){
									tr += '<td>N/A</td>';		
								}else{
									tr += '<td>'+productInfo.brand+'</td>';		
								}

								if(productInfo.price > 0) {
									tr += '<td>'+addCommas(productInfo.price)+'</td>';		
								}else{
									tr += '<td>N/A</td>';		
								}

								if(productInfo.category != null){
									tr += '<td>'+productInfo.category+'</td>';		
								}else{
									tr += '<td>N/A</td>';		
								}

								tr += '<td>'+productInfo.binding+'</td>';		
								
								if (productInfo.rank > 0) {
									tr += '<td>'+addCommas(productInfo.rank)+'</td>';		
								}else{
									tr += '<td>N/A</td>';		
								}

								tr += '<td>'+addCommas(sale)+'</td>';		
								tr += '<td>'+addCommas(revenue)+'</td>';										

								if (productInfo.review > 0) {
									tr += '<td>'+addCommas(productInfo.review)+'</td>';		
								}else{
									tr += '<td>N/A</td>';		
								}

								if (productInfo.rating > 0) {
									tr += '<td>'+productInfo.rating+'</td>';		
								}else{
									tr += '<td>N/A</td>';		
								}

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
		    });

		    function addCommas(nStr){
			    nStr += '';
			    x = nStr.split('.');
			    x1 = x[0];
			    x2 = x.length > 1 ? '.' + x[1] : '';
			    var rgx = /(\d+)(\d{3})/;
			    while (rgx.test(x1)) {
			        x1 = x1.replace(rgx, '$1' + ',' + '$2');
			    }
			    return x1 + x2;
			}	

		   bingman();

		    $("body").on("click", ".modal-dialog", function(e) {
		        if ($(e.target).hasClass('modal-dialog')) {
		            var hidePopup = $(e.target.parentElement).attr('id');
		            $('#' + hidePopup).modal('hide');
		        }
		    });

    		function bingman(){
			    var v = $('body').find('#s-result-count').text();  				    
			    search_result = false;
			    if(v){
			    	var subStr = v.match("over(.*)results");

			    	if(!subStr){
						var subStr = v.match("of(.*)results");			    		
			    	}

			    	if(subStr){
				    	//$('#elementId').text().indexOf('some text') > -1;
				    	search_result = subStr[1].replace(",","");
				    	search_result = parseInt(search_result);

				    	if(search_result <=2000){
				    		search_result = true;
				    	}else{
				    		search_result = false;
				    	}
			    	}
			    }

			    console.log('search_result', search_result);


			    var first_ten = trainindIdArrays.slice(0,10);		
			    $.ajax({
			        type: "POST",	        
			        url: _apiUrl+"extension/bingman.php",
			        data: {asin: first_ten},  		        
			        success: function (responseJson) {		        
			        		productInfos = $.parseJSON(responseJson);		        		

			        		var res = parseInt(productInfos.res);

			        		if(search_result){
			        			$('.total_result_right').show();
			        		}else{
			        			$('.total_result_wrong').show();
			        		}

			        		if(productInfos.all_belong_to_cloth){
			        			$('.mostly_tshirt_right').show();
			        		}else{
			        			$('.mostly_tshirt_wrong').show();
			        		}

			        		if(productInfos.first_eight_has_bsr){
			        			$('.eight_bsr_right').show();
			        		}else{
			        			$('.eight_bsr_wrong').show();
			        		}

			        		if(productInfos.less_than_billion){
			        			$('.two_bsr_right').show();
			        		}else{
			        			$('.two_bsr_wrong').show();
			        		}


			        		$('body').find('#thumb_loader').hide();
			        		if(search_result && productInfos.all_belong_to_cloth && productInfos.first_eight_has_bsr && productInfos.less_than_billion){
			        			$('.right_thumb').show();
			        		}else{
			        			$('.wrong_thumb').show();
			        		}
			        	}
			    });				
			}		   
		}
	});

	function DOMtoString(document_root) {
	    var html = '',
	        node = document_root.firstChild;
	    while (node) {
	        switch (node.nodeType) {
	        case Node.ELEMENT_NODE:
	            html += node.outerHTML;
	            break;
	        case Node.TEXT_NODE:
	            html += node.nodeValue;
	            break;
	        case Node.CDATA_SECTION_NODE:
	            html += '<![CDATA[' + node.nodeValue + ']]>';
	            break;
	        case Node.COMMENT_NODE:
	            html += '<!--' + node.nodeValue + '-->';
	            break;
	        case Node.DOCUMENT_TYPE_NODE:
	            // (X)HTML documents are identified by public identifiers
	            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
	            break;
	        }
	        node = node.nextSibling;
	    }
	    return html;
	}


	function AsinsArrayToString(AsinsArray, result_delimiter)
	{
		var result_string = '';

		switch(result_delimiter) 
		{
			case 'comma':
				result_string = AsinsArray.join(",");
				break;
			case 'new_line':
				result_string = AsinsArray.join("\n");
				break;
			case 'space':
				result_string = AsinsArray.join(" ");
				break;
			case 'vertical_bar':
				result_string = AsinsArray.join("|");
				break;
			default:
				result_string = AsinsArray.join(",");
		}

		return result_string;
	}

function getEstimatedSales(Category, SalesRank,country) {
  Category = $.trim(Category);

  if (!IsNumeric(SalesRank)) {
    console.log('if IsNumeric' , 'not')
  }else{
    console.log('if IsNumeric' , 'yes')
  }


  if (!IsNumeric(SalesRank)) {
    return;
  }

  var EstimatedSales;
  if (Category == "Toys & Games") {
    Slop = -0.910196205564476;
    Offset = 63866.5924884108;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES);
    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 76;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Automotive" || Category == "Tools & Home Improvement") {
    Slop = -0.633136406198535;
    Offset = 1459.97464905557;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 63;
      Adjust = 0.65; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.65;
    else if (SalesRank < 800)
    Adjust = 0.65;
    else if (SalesRank < 1000)
    Adjust = 0.7;
    else if (SalesRank < 2000)
    Adjust = 0.7;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Home Improvements") {
    Slop = -0.892647454978935;
    Offset = 31871.6649985098;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 88;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Kitchen & Dining") {
    Slop = -1.01410732238537;
    Offset = 101201.296675844;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 98;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Home and Kitchen" || Category == "Home & Kitchen") {
    Slop = -0.829847569905984;
    Offset = 32355.1377081117;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 128;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Health & Personal Care") {
    Slop = -1.11221344800393;
    Offset = 402609.1695426;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 158;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Sports & Outdoors") {
    Slop = -0.890277344864231;
    Offset = 30790.3538325155;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 97;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Beauty" || Category == "Beauty & Personal Care"  || Category == "Health & Household" || Category == "Products") {
    Slop = -0.935079666570251;
    Offset = 44648.3295127306;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 600) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 84;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.4;
    else if (SalesRank < 800)
    Adjust = 0.4;
    else if (SalesRank < 1000)
    Adjust = 0.45;
    else if (SalesRank < 2000)
    Adjust = 0.5;
    else if (SalesRank < 4000)
    Adjust = 0.8;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Patio, Lawn & Garden") {
    Slop = -0.8687913834089;
    Offset = 12942.373575964;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 116;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Grocery & Gourmet Food") {
    Slop = -1.19433041346734;
    Offset = 579199.138930291;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 106;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Clothing") {
    Slop = -0.890301317849426;
    Offset = 50229.0970635419;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 44;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Musical Instruments") {
    Slop = -1.02683869745013;
    Offset = 15479.6763443842;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 56;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Pet Supplies") {
    Slop = -1.10627691729796;
    Offset = 154077.608501638;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 68;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Office Products") {
    Slop = -0.947430145186706;
    Offset = 31553.6757228578;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 82;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Industrial & Scientific") {
    Slop = -0.749611336516322;
    Offset = 2511.66293051382;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 41;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Arts, Craft & Sewing") {
    Slop = -0.829766707830769;
    Offset = 7819.72839867913;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 78;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Videogames") {
    Slop = -1.07764010379412;
    Offset = 18381.5268612669;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 72;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Jewelry") {
    Slop = -1.01346421616392;
    Offset = 22758.7833803613;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES);

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 43;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Baby") {
    Slop = -1.03098161074877;
    Offset = 39812.0435636674;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 82;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Cell Phones & Accessories") {
    Slop = -0.733958399561946;
    Offset = 5453.1139257706;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 85;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Home and Garden") {
    Slop = -0.537265153086811;
    Offset = 494.172227898278;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 30;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Watches") {
    Slop = -0.870661992348441;
    Offset = 2130.44370633452;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 72;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Camera & Photo") {
    Slop = -0.810813891501792;
    Offset = 1086.23732510221;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 35;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Electronics") {
    Slop = -0.58633189502591;
    Offset = 505.052282708312;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES);

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 30;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant
    
    console.log('EstimatedSales', EstimatedSales)
    console.log('Adjust', Adjust)

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Computers & Accessories") {
    Slop = -0.794057157841841;
    Offset = 1385.00773607183;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 31;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Appliances") {
    Slop = -0.861357686991442;
    Offset = 451.610316995561;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 19;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Music") {
    Slop = -0.662910080313591;
    Offset = 738.200160843942;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 45;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  } else if (Category == "Movies & TV") {
    Slop = -1.01605292985309;
    Offset = 33318.4010560254;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 38;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    EstimatedSales = EstimatedSales * Adjust;
  }else{
    Slop = -1.10627691729796;
    Offset = 154077.608501638;
    LogOffset = Math.log10(Offset);
    LogRank = Math.log10(SalesRank);
    LogES = (Slop * LogRank) + LogOffset;
    EstimatedSales = Math.pow(10, LogES)

    if (SalesRank < 400) {
      EstimatedSales = (1 + ( 0.0004 * (400 - SalesRank))) * 80;
      Adjust = 1; //Constant
    } else if (SalesRank < 600)
    Adjust = 0.3;
    else if (SalesRank < 800)
    Adjust = 0.3;
    else if (SalesRank < 1000)
    Adjust = 0.35;
    else if (SalesRank < 2000)
    Adjust = 0.4;
    else if (SalesRank < 4000)
    Adjust = 0.7;
    else if (SalesRank < 6000)
    Adjust = 0.9;
    else if (SalesRank < 8000)
    Adjust = 0.9;
    else if (SalesRank < 10000)
    Adjust = 0.9;
    else if (SalesRank < 20000)
    Adjust = 0.9;
    else if (SalesRank < 40000)
    Adjust = 0.8;
    else if (SalesRank < 60000)
    Adjust = 0.8;
    else if (SalesRank < 80000)
    Adjust = 0.7;
    else if (SalesRank < 100000)
    Adjust = 0.7;
    else if (SalesRank < 200000)
    Adjust = 0.7;
    else if (SalesRank < 400000)
    Adjust = 0.35;
    else if (SalesRank < 600000)
    Adjust = 0.25;
    else if (SalesRank < 800000)
    Adjust = 0.25;
    else if (SalesRank < 1000000)
    Adjust = 0.15;
    else if (SalesRank >= 1000000)
    Adjust = 0.10; //constant

    if (country == 'de' || country == 'fr' || country == 'es' || country == 'it' || country == 'uk' || country == 'ca' ||country == 'in' || country == 'jp' || country == 'mx' || country == 'com.mx')
			EstimatedSales = EstimatedSales * Adjust;
	else		
			EstimatedSales = EstimatedSales * 0.15;

  }

  return EstimatedSales;
}

function calculateSales(country,Category, SalesRank, Price)
{
    /**/

    console.log('country,Category, SalesRank, Price', country,Category, SalesRank, Price);

    EstimatedSales = getEstimatedSales(Category, SalesRank,country);

    console.log('EstimatedSalesEstimatedSales',EstimatedSales)

    if (country == 'de' || country == 'fr' || country == 'es' || country == 'it' || country == 'uk' || country == 'ca')
      EstimatedSales = EstimatedSales*0.41; //reduce
    if (country == 'in' || country == 'jp' || country == 'mx' || country == 'com.mx'  )
      EstimatedSales = EstimatedSales*0.15; //reduce

    var m = new Date();


	 if ((m.getMonth() + 1) == 11 || (m.getMonth() + 1) == 12) {
		EstimatedSales = EstimatedSales * 1;
	}
	else {
		EstimatedSales = EstimatedSales * 0.85;  
	}

    EstimatedSales = EstimatedSales * 30;

    console.log(EstimatedSales,'EstimatedSales');

    var EstimatedRevenue = 0.00;


    if (IsNumeric(EstimatedSales))
    {
        if (EstimatedSales < 1 && EstimatedSales>0)
        {
            var denominator = 1/EstimatedSales;
            denominator = parseInt(denominator);
            if (denominator == 1)
                denominator++;
            EstimatedSales = parseInt(denominator);
            //EstimatedSales = '1 each '+parseInt(denominator)+' months';
        }
        else
        {
            EstimatedSales = parseInt(EstimatedSales);        
        }

        if(typeof(Price) != "undefined" && Price !== null) {
            EstimatedRevenue = parseFloat(EstimatedSales)*parseFloat(Price);         
        }
        return [EstimatedSales, EstimatedRevenue.toFixed(2)];
    } 
}

function IsNumeric(input) {
	    console.log(input,'input')
	    if($.isNumeric(input)){
	        return true;
	    }
	    return false;	    
    }
 }
});
$(document).ready(function(){	
		$(document).click(function(e){

	    //console.log('asin', document)		

		var container = $(".onpage-asinspector");
	    // if the target of the click isn't the container nor a descendant of the container
	    if (!container.is(e.target) && container.has(e.target).length === 0) 
		    {
		        $('.store-options').hide();
		        $('.remove-onpage-analyzer-options').hide();
		    }
		});


		var _apiUrl = "https://www.amazonsoldout.com/";
		//var v = chrome.extension.getURL("html/onpage.html");
		var style1 = chrome.extension.getURL("css/onpage.css");
		var style2 = chrome.extension.getURL("css/general.css");

		$('head').append('<link rel="stylesheet" href="'+style2.css+'" type="text/css" />');
		$('head').append('<link rel="stylesheet" href="'+style1.css+'" type="text/css" />');

		//var imagesPath = chrome.extension.getURL('images');
		//$('#dp-container #desktop_buybox').html('');
		//var b = '<iframe and="" seamless="seamless" scrolling="no" class="asinspector-iframe a-section a-spacing-medium" src="'+v+'"></iframe>';
		$('#rightCol').append(getHtml());

		var parts = window.location.href.split('dp/');	

		//get asin of current product 
		var curr_asin = $(document).find("#addToCart #ASIN").val();

		if(!curr_asin){
			 curr_asin = $(document).find("input[name='ASIN.0']" ).first().val();
		}

		$.ajax({
		        type: "POST",
		        async: false,	        
		        contentType: 'application/json',
		        url: "https://api.sellerprime.com/free_tool/keyword/search_v2",
		         data: JSON.stringify({
		            keyword:"toys",		            
		        }),
		        dataType: 'json',		        
		        success: function (responseJson) {	
		        	console.log('responseJson', responseJson)
		        }
		});        	


		//alert(curr_asin)

		if(curr_asin){
			var asins = [];
			var parts_2 = parts[1].split('/ref');
			asins.push(curr_asin);

			$.ajax({
		        type: "POST",
		        async: false,	        
		        url: _apiUrl+"index.php?type=productInfo",
		        data: {asin: asins},  		        
		        success: function (responseJson) {		        	
		           		productInfos = $.parseJSON(responseJson);	
		           		
			            console.log('productInfos', productInfos);
			           	

		           		$.each(productInfos.all_products, function(k, productInfo) {
					    if(productInfo.asin != ''){

					    	

					     	console.log('productInfos', productInfo)
					     	console.log(productInfo.asinspectorFba.dataFba[0].weightHandling,'lol');
					     
					     	$(document).find('.options-SalesRank').text(productInfo.sale_rank);
					     	$(document).find('.product-category').text(productInfo.category);

					     	$(document).find('#current_asin').val(productInfo.parent_asin);

					     	if(productInfo.lowest_new_price){
					     		var price = productInfo.lowest_new_price.replace("$","");
					     	}else{
					     		var price = productInfo.formattedPrice.replace("$","");
					     	}

					     	if(!price){
					     		price = $(document).find("input[name='displayedPrice']" ).val();
					     	}

					     	if(!price){
					     		var v = $(document).find("#priceblock_ourprice").text();;
								var string = v.split('-')[0];
								price = string.replace("$","");								
					     	}

					     	var est = calculateSales('com',productInfo.category,productInfo.sale_rank,price);					     	

					     	$(document).find('.estimated-sales-per-month').text('NaN');	
					     	$(document).find('.estimated-revenue-per-month').text('NaN');					     		

					     	if(est != undefined && est){
					     		$(document).find('.estimated-sales-per-month').text(est[0]);	
					     		$(document).find('.estimated-revenue-per-month').text('$ '+est[1]);					     		
					     	}

					     	$(document).find('#ntp_price').val('$'+price);

					     	console.log('price', price);

					     	if(price){
					     		var est_sale = productInfo.est_sale.replace("$","");
					     		console.log('productInfo.est_sale', productInfo.est_sale)
					     		var est_rev = parseFloat(price) * parseFloat(est_sale);					     		
					     	}

					     	console.log('est_rev', est_rev.toFixed(2));

					     	//$(document).find('.estimated-revenue-per-month').text('$'+est_rev.toFixed(2));	

					     	var htm = `<b>Fulfillment Fee: </b><span id="fulfillment_fees"></span><br>
							           <b>Storage Fee: </b><span id="stroage_fees"></span><br>
							           <b>Variable Closing Fee: </b><span id="variable_closing_fees"></span><br>
							           <b>Referral Fee: </b><span id="referral_fees"></span><br><br>
							           <b>Total: </b><span id="total_fees"></span></b>`;
							    htm += '<input type="hidden" value="'+productInfo.title+'" id="title_of_pro">';       

							$(document).find('.fba-fees-description').html(htm);
							
							//fba values and total
							$(document).find('#fulfillment_fees').html('$'+productInfo.asinspectorFba.dataFba[0].weightHandling);

							var sf = parseFloat(productInfo.asinspectorFba.dataFba[0].fbaStorageFee) + 0.01;

							$(document).find('#stroage_fees').html('$'+sf.toFixed(2));
							$(document).find('#variable_closing_fees').html('$0.00');

							var reff_fees = getPerRefFeeProductType(productInfo.category,price);
							$(document).find('#referral_fees').html('$'+reff_fees);

							var tot = parseFloat(productInfo.asinspectorFba.dataFba[0].weightHandling) + sf + parseFloat(reff_fees);

							$(document).find('#total_fees').html('$'+tot.toFixed(2));

							//buy cost 
							var buy_cost = parseFloat(price) - parseFloat(tot);
							console.log('buy_cost.toFixed(2)', buy_cost.toFixed(2))
							$(document).find('#ntp_breakEven').val('$'+buy_cost.toFixed(2));
					    } 	
				    });  
		        }
		    });    
		}

 function getPerRefFeeProductType(category, amzPrice) {      
      var category = category;
      var referralFee = 0;

      if (category == "3D Printed Products") {
        referralFee = 0.12 * amzPrice;
      }else if (category == "Amazon Device Accessories") {
        referralFee =
 0.45 * amzPrice;

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

      console.log('referralFee', referralFee)

      return parseFloat(referralFee.toFixed(2));
    }	


	
	function getBBPrice(productInfo, _0x6b6fx1d, _0x6b6fx9) {
			var total_fba = 0;
				      		$.ajax({
						          url: "http://asinspector.com/rest/getMeFBA.php",   
						          method:'post', 						            
						          data: {
						              	 getFBAFeesForListAsins: 1,
						                'data[0][asin]': productInfo.asin,                  
						                'data[0][weight]': productInfo.weight_raw,                  
						                'data[0][width]': productInfo.width_raw,                  
						                'data[0][length]': productInfo.length_raw,                  
						                'data[0][height]': productInfo.height_raw                  
						            },
						            success: function(data) { 
						            	total_fba = parseFloat(data.dataFba[0].orderHandling) + parseFloat(data.dataFba[0].fbaStorageFee) + parseFloat(data.dataFba[0].pickAndPack) + parseFloat(data.dataFba[0].fees) +  parseFloat(data.dataFba[0].weightHandling);
						            	console.log('tatal-fba', total_fba);
						            	$(document).find('.fba-fees-description').text(total_fba);

						            	console.log('total_fba', total_fba);

						       }
						    });


	    return;
    	var _0x6b6fx13 = 0.00;
    	$['get']('https://www.amazon.com/gp/cart/desktop/ajax-mini-detail.html/ref=added_item_1?ie=UTF8&asin=' + _0x6b6fx1c, function(_0x6b6fx2e) {
        _0x6b6fx2e = $(_0x6b6fx2e);
        var _0x6b6fx2f = $['trim'](_0x6b6fx2e['find']('.a-size-medium.a-color-price.sc-price')['text']());
        // if (!_0x6b6fx2f) {
        //     var _0x6b6fx30 = $['trim'](_0x6b6fx2e['text']())['split'](' ');
        //     _0x6b6fx2f = _0x6b6fx30[_0x6b6fx30['length'] - 1]
        // };
        // if (country == 'de' || country == 'it' || country == 'fr' || country == 'es') {
        //     _0x6b6fx2f = usToEuCurrencyFormat(_0x6b6fx2f)
        // };
        // if (!IsNumeric(_0x6b6fx2f['replace'](/[^\d.-]/g, ''))) {
        //     $('.hide-if-no-salesrank:not(:first)')['remove']();
        //     $('.hide-if-no-fba')['remove']();
        //     $('.asin-line.yellow')['remove']();
        //     $($('.hide-if-no-salesrank')[0])['text']('Product data currently is unavailable!');
        //     $(document)['remove']()
        // };
        console.log('test', _0x6b6fx2f)
        //_0x6b6fx1d(_0x6b6fx2f, _0x6b6fx9)
   	 })

	}	

	function usToEuCurrencyFormat(_0x6b6fx4) {
	    return _0x6b6fx4['replace'](/[,.]/g, function(_0x6b6fx5) {
	        return _0x6b6fx5 == ',' ? '.' : ','
	    })
	}

	//hide analyser
	$(document).on('click','.hide-current-analyzer', function(e){
		e.preventDefault();
		$('.onpage-asinspector').hide();
	});	

	//open product in different store
	$(document).on('click','.store', function(e){
		e.preventDefault();
		var v = $('#title_of_pro').val();

		if($(this).hasClass('cn-store-alibaba')){
			var link = 'http://www.alibaba.com/trade/search?SearchText='+v;
		}

		if($(this).hasClass('cn-store-aliexpress')){
			var link = 'https://www.aliexpress.com/wholesale?initiative_id=SC_20180619003151&SearchText='+v;	
		}

		if($(this).hasClass('cn-store-ebay')){
			var link = 'https://www.ebay.com/sch/i.html?&_nkw='+v;
		}

		if($(this).hasClass('cn-store-toysrus')){
			var link = 'https://www.toysrus.com/search/index.jsp?kw='+v;
		}

		if($(this).hasClass('cn-store-walmart')){
			var link = 'https://www.walmart.com/search/?query='+v;
		}

		if($(this).hasClass('cn-store-target')){
			var link = 'https://www.target.com/s?searchTerm='+v;
		}

		if($(this).hasClass('cn-store-kohls')){
			var link = 'https://www.kohls.com/search.jsp?search='+v;
		}

		if($(this).hasClass('cn-store-overstock')){
			var link = 'https://www.overstock.com/search?keywords='+v;
		}

		if($(this).hasClass('cn-store-wayfair')){
			var link = 'http://www.homedepot.com/s/'+v;
		}
		
		if($(this).hasClass('cn-store-argos')){
			var link = 'http://www.argos.co.uk/search/'+v;
		}

		if($(this).hasClass('cn-store-asda')){
			var link = 'https://groceries.asda.com/search/'+v;
		}

		if($(this).hasClass('cn-store-homedepot')){
			var link = 'https://www.homedepot.com/s/'+v;
		}

		window.open(link, '_blank');
	});

	//opon camelcamelcamel
	$('.camelcamelcamel').on('click', function(e){
		e.preventDefault();

		var v = $('#title_of_pro').val();
		var link = 'https://www.camelcamelcamel.com/search?sq='+v;
		window.open(link, '_blank');
	});

	//frequently bought togather
	$(document).on('click','.frequently-bought-together', function(e){
		e.preventDefault();

		var str = '';
		$("form#sims-fbt-form :input:hidden").not($("input[name=session-id]")).each(function(){
			console.log($(this).val())
			if(str == ''){
				str += $(this).val(); 
			}else{
				str += ','+$(this).val(); 
			}			
		});

		chrome.runtime.sendMessage({type: "notification", options: { 
		    type: "basic", 
		    iconUrl: chrome.extension.getURL("icon128.png"),
		    title: "Test",
		    message: str
		}});
    	
		// var link = chrome.extension.getURL("html/popup.html");
		// $("body").append('<a class="link" href="'+link+'" target="_blank">&nbsp;</a>');
  		//$('.link')[0].click();		
	});	

	//get varitatons
	$(document).on('click','.get-product-variations', function(e){
		e.preventDefault();
		chrome.runtime.sendMessage({type: "varitation", options: { 
		    type: "basic", 
		    iconUrl: chrome.extension.getURL("icon128.png"),
		    title: "Test",
		    message: $(document).find('#current_asin').val()
		}});
	});	

	//open product in multiple store
	$('.store-options').hide();
	$(document).on('click','.storesbutton', function(){
		$('.store-options').toggle();
	});	

	//hide popup right side
	$('.remove-onpage-analyzer-options').hide();
	$(document).on('click','.delete-this-product', function(){
		$('.remove-onpage-analyzer-options').toggle();
	});	


	function getHtml(){
		var images = chrome.extension.getURL("images");
		var v = '<div class="onpage-asinspector"> <div id="result-net-payout"> <h2 class="logo"> <img class="main-logo" src="'+images+'/main-logo.png"/> </h2> <div class="asin-line yellow" style="margin-top:-10px; margin-bottom:10px;"> &nbsp; </div><div class="hide-if-no-salesrank"> <b>Estimated Sales (month): </b> <span class="estimated-sales-per-month local-EstSales"> <img valign="middle" src="'+images+'"/loader_big.svg" height="15px"/> </span> </div><div class="hide-if-no-salesrank"> <b title="Estimated revenue (month)">Est. Rev. (month): </b> <span class="estimated-revenue-per-month local-EstRevenue"> <img valign="middle" src="'+images+'/loader_big.svg" height="15px"/> </span> </div><div class="hide-if-no-salesrank"> <b title="Category">Category:</b> <span class="product-category"> <img valign="middle" src="'+images+'/loader_big.svg" height="15px"/> </span> </div><div class="hide-if-no-salesrank"> <b title="Sales Rank" style="float:left;margin-right:5px;">Sales Rank: </b> <span class="options-SalesRank" style="float:left;margin-right:5px;"> <img valign="middle" src="'+images+'/loader_big.svg" height="15px"/> </span> </div><div style="clear:both;height:0px;">&nbsp;</div><div class="hide-if-no-salesrank" style="margin-top:5px;margin-bottom:5px;"> <div> <b>Sale Price :</b>&nbsp;&nbsp; <span class="price-currency"></span> <input type="text" id="ntp_price" style="width: 100px;"> </div><br><div> <b>Buy Cost :</b>&nbsp;&nbsp; <span class="price-currency"></span> <input type="text" id="ntp_breakEven" style="width: 100px;"> </div><br><div> <b>Net Payout :</b> &nbsp;&nbsp; <span class="price-currency"></span><span id="net_payout_id">$0.00</span> </div></div><div class="hide-if-no-salesrank actions"> <img title="Break Even Cost" class="net-payout" src="'+images+'/net-payout.png"> <img title="Open in store..." class="storesbutton" src="'+images+'/storesbutton.png"> <img title="Search on camelcamelcamel" class="camelcamelcamel" src="'+images+'/camelcamelcamel.png" rel="camelcamelcamel"> <img title="Frequently Bought Together" class="frequently-bought-together" src="'+images+'/frequently-bought-together.png" href="#frequently-bought-together" rel="frequently-bought-together" oldtitle="Frequently Bought Together" alt=""> <img title="Get Child/Variations products" class="get-product-variations" src="'+images+'/get-product-variations.png"> <img title="Hide Analyzers" class="delete-this-product" src="'+images+'/delete-this-product.png"> </div><div class="asin-line hide-if-no-salesrank" style="margin-top:12px; margin-bottom:-7px;"> &nbsp; </div><h4 class="line-separator hide-if-no-fba">FBA fees</h4> <div class="asin-line hide-if-no-fba" style="margin-top:-5px; margin-bottom:12px;"> &nbsp; </div><div class="fba-fees-description hide-if-no-fba"> <img src="'+images+'/loader_big.svg"/> </div></div><div style="display:none" class="local-SalesRank"></div><div style="display:none" class="local-Rating"></div><div style="display:none" class="price-price local-BBPrice local-LowestNewPrice local-LowestUsedPrice local-LowestRefurbishedPrice"></div><div class="asin-line yellow" style="margin-top:-10px; margin-bottom:10px;"> &nbsp; </div><div class="store-options sub-menu-dropdown"> <a href="#" rel="alibaba" class="cn-store-alibaba store">Alibaba</a> <a href="#" rel="aliexpress" class="cn-store-aliexpress store">AliExpress</a> <a href="#" rel="ebay" class="cn-store-ebay store">eBay</a> <a href="#" rel="toysrus" class="cn-store-toysrus store">Toys "R" Us</a> <a href="#" rel="walmart" class="menu-com cn-store-walmart store">Walmart</a> <a href="#" rel="target" class="menu-com cn-store-target store">Target</a> <a href="#" rel="kohls" class="menu-com cn-store-kohls store">Kohls</a> <a href="#" rel="overstock" class="menu-com cn-store-overstock store">Overstock</a> <a href="#" rel="wayfair" class="menu-com menu-uk cn-store-wayfair store">Wayfair</a> <a href="#" rel="argos" class="menu-uk cn-store-argos store">Argos</a> <a href="#" rel="asda" class="menu-uk cn-store-asda store">Asda</a> <a href="#" rel="homedepot" class="cn-store-homedepot store">Home Depot</a> </div><div class="remove-onpage-analyzer-options sub-menu-dropdown"> <a href="#" class="hide-current-analyzer">Hide Analyzer</a></div><input type="hidden" id="current_asin">';
 			return v;	
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
            //console.log('denominator', denominator);
            //$(dom+'EstSales').text('1 each '+parseInt(denominator)+' months');
            EstimatedSales = '1 each '+parseInt(denominator)+' months';
        }
        else
        {
            EstimatedSales = parseInt(EstimatedSales);
            //console.log('EstimatedSales', EstimatedSales);
            //$(dom+'EstSales').text(EstimatedSales);
        }

        var EstimatedRevenue = "";
        console.log('Price', Price)
        if(typeof(Price) != "undefined" && Price !== null) {
            
            var Price = Price.replace(",","");

            var EstimatedRevenue = EstimatedSales*Price;
            //$(dom+'EstRevenue').html(getMoneySymbol()+EstimatedRevenue.format(2));
            //console.log('EstimatedRevenue', EstimatedRevenue);
        }

        console.log('EstimatedSales', EstimatedSales, EstimatedRevenue.toFixed(2));

        return [EstimatedSales, EstimatedRevenue.toFixed(2)];
    } 
};

function IsNumeric(input) {
    console.log(input,'input')
    if($.isNumeric(input)){
        return true;
    }

    return false;
    
    //var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    //return (RE.test(input));
}

});

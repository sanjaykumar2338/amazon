let date = new Date;
var _apiUrl = "https://idex.market/eth/tfd";
//document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
$(function(){

  let itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];  
  let itemsArray1 = JSON.parse(localStorage.getItem('itemsArray1')) || [];  
  let target = document.querySelector('body');
  let config = { subtree: true, childList: true};

  // mutation observer for looking when the page loaded
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if($(mutation.removedNodes[0]).hasClass('loadingSpinner')){
        isExtEnable();
        observer.disconnect();
      };
    });    
  });

  let addStatusButton = (status) => {
    $('body').append(`<button class="amazon-extension-start"
      style="
      position: fixed;
      top: 10px;
      left: 10px;
      display: block;
      z-index: 999999;
      background: linear-gradient(to top,#f8e3ad,#eeba37);
      width: 250px;
      height: 60px;
      font-size: 24px;">
      ${status}
      </button>`);
  }

  // check if extension enable after closing and opening the new tab
  let isExtEnable = () => { 
	var category = $('.nav-searchbar').find('#searchDropdownBox').val();
	var search = $('.nav-searchbar').find('#twotabsearchtextbox').val();
	var didYouMean = $('#didYouMean').find('a:first').text();
	var categoryMatch;
	if(didYouMean)
		categoryMatch = category+'_'+didYouMean;
	else
		categoryMatch = category+'_'+search;
	
    if(localStorage.getItem('amazon-ext-status') == 'true' && localStorage.getItem('amazon-category') == categoryMatch){
      addStatusButton('Extension Working!');
       
        chrome.storage.sync.get(function(data) {
			$.ajax({
				url: _apiUrl+"index.php?type=getIsAdvancemodeEnabled&id="+data.userId,
				type: "GET",
			}).done(function(responseJson) {
				if(responseJson == 0){
					console.log('normal mode');
					checkItems();
				}
				else{
					console.log('advance mode');
					checkItemsAdvanced();
				}
			}); 
		});
      return;
    } else if(localStorage.getItem('amazon-ext-status') == 'false'){
      
      return;
    };
  };

  let isOptionCheckedAmazonStock = () => {
	    let outofStock = '';
        $("div .a-checkbox.s-ref-link-cursor").filter(function() {
			if($(this).text() === 'Include Out of Stock'){
				outofStock = $(this).attr('data-a-input-name');
			}			
		});
		localStorage.setItem('start-click', 'true');
		localStorage.setItem('amazon-outof-stock', outofStock);
		if($('input[name='+outofStock+']').prop('checked') == false){
            $('input[name='+outofStock+']').click();
		}
		if($('input[name='+outofStock+']').prop('checked') == true){
			localStorage.setItem('amazon-stock-checkbox', 'true');
		}
	}; 
  var timer = setInterval(function() {	
		if(localStorage.getItem('start-click') == 'true'){
			var runExtension = $('html body').find('.a-size-medium.a-spacing-base.a-spacing-top-base.a-color-tertiary.a-text-normal').text();
			if(!runExtension){
				$('.amazon-extension-start').remove();
				return false;
			}
			else{ 
				
				let outofStock = '';
				$("div .a-checkbox.s-ref-link-cursor").filter(function() {
					if($(this).text() === 'Include Out of Stock'){
						outofStock = $(this).attr('data-a-input-name');
					}			
				});
				if(outofStock){
					isOptionCheckedAmazonStock();
				}
				else{
					localStorage.setItem('amazon-stock-checkbox', 'true');
				}
				if( (localStorage.getItem('amazon-stock-checkbox') == 'true') ){
					let pageCounter = localStorage.getItem('pageCounter');
					if(pageCounter != 10){
						isExtEnable();
					}
					pageCounter = 0;
					clearInterval(timer);
					localStorage.setItem('amazon-stock-checkbox', false);
				}
				
			}
		} 
  }, 1); 
  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action == 'start'){		

		chrome.runtime.sendMessage({action: "store_window_id"}, function(response) {
		});

        let outofStock = '';
        $("div .a-checkbox.s-ref-link-cursor.a-spacing-none").filter(function() {
			if($(this).text() === 'Include Out of Stock'){
				outofStock = $(this).attr('data-a-input-name');
			}			

		});
		
		if(localStorage.getItem('amazon-ext-status') == 'true'){
			chrome.runtime.sendMessage({task: "start_error1"}, function(response) {
			});
			return false;
		}
		
		var runExtension = $('html body').find('.a-size-medium.a-spacing-base.a-spacing-top-base.a-color-tertiary.a-text-normal').text();
		if(!runExtension){
			localStorage.setItem('amazon-stock-checkbox', false);
		    localStorage.setItem('start-click', false);
		    localStorage.setItem('amazon-ext-status', false);
		    $('.amazon-extension-start').remove();
		    chrome.runtime.sendMessage({task: "start_error"}, function(response) {
			});
			return false;
		}
		else{
      window.localStorage.removeItem('itemsArray');
      window.localStorage.removeItem('itemsArray1');
      $('body').append(`<button class="amazon-extension-start"
      style="
      position: fixed;
      top: 10px;
      left: 10px;
      display: block;
      z-index: 999999;
      background: linear-gradient(to top,#f8e3ad,#eeba37);
      width: 250px;
      height: 60px;
      font-size: 24px;">
      Extension Started!
      </button>`);
      localStorage.setItem('amazon-ext-status', true);
      var category = $('.nav-searchbar').find('#searchDropdownBox').val();
      var search = $('.nav-searchbar').find('#twotabsearchtextbox').val();
      var didYouMean = $('#didYouMean').find('a:first').text();
      var categoryParam;
      if(didYouMean)
		categoryParam = category+'_'+didYouMean;
	  else
		categoryParam = category+'_'+search;

      localStorage.setItem('amazon-category', categoryParam);
      localStorage.setItem('start-click', true);
     // chrome.runtime.sendMessage({action: "storeTab"});
      if(localStorage.getItem('start-click') == 'true')
		location.reload();
     
		}
    } else if(request == 'end'){
	  localStorage.setItem('amazon-stock-checkbox', false);
	  localStorage.setItem('start-click', false);
      localStorage.setItem('amazon-ext-status', false);
      isExtEnable();
      $('.amazon-extension-start').remove();
      addStatusButton('Extension Stopped!');
      setTimeout(() => {
        $('.amazon-extension-start').remove();
      }, 3000);
    } else if(request == 'last'){
      let last = JSON.parse(localStorage.getItem('itemsArray'));
      let last1 = JSON.parse(localStorage.getItem('itemsArray1'));
      createExcel(last,last1)
      window.localStorage.removeItem('itemsArray');
      window.localStorage.removeItem('itemsArray1');
      localStorage.setItem('start-click', false);
	  localStorage.setItem('amazon-stock-checkbox', false);
    }
    if(request.action =='amazonscout'){     	
    	var arr = [];
    	$('.orderbook').each(function(i,obj){
		  	$(this).addClass('main_table_'+i);

		  	if($('.main_table_0').length > 0){
		  		$('.main_table_0').find('tr').each(function(){
			  			var price = 0;
       					var bax = 0;
       					var eth = 0;
       					var sum_eth = 0;

       				$(this).find('td').each(function(i,obj){
       					//console.log('i',i ,'obj',obj,'$(this)',$(this),'$(this).text()',$(this).text());       					
       					
       					if(i == 0){
       						price = $(this).text();
       					}else if(i == 1){
       						bax = $(this).text();
       					}else if(i == 2){
       						eth = $(this).text();
       					}else if(i == 3){
       						sum_eth = $(this).text();
       					}
       				});	  
					var newItems = [price,bax,eth,sum_eth];
					arr.push(newItems);
	    		});
	    		console.log('arr', arr);
	    		createCsvFile(arr);       				
		  	}
	    });

    	console.log(arr);
    	


		//$("html, body").animate({ scrollTop: $(document).height() }, 1000);
		var imgPath = chrome.extension.getURL('images')	

		console.log('imgPath', imgPath);
		$( "body" ).append( `<div id="aws-data">
			<table class="table-main-heading">
			<thead>
			  <tr>
			  	<th><img src="https://www.amazonsoldout.com/images/logo.png" alt="amazonsoldout"></th>
			  	<th>Total Result found<br> #<span id="total_records"></span></th>
			    <th style="display:none;">Avg. Sale Rank <br> 12.00</th>
			    <th style="display:none;">Avg. Price <br> 56.23</th> 
			    <th style="display:none;">Avg. Reviews <br> 12.89</th>
			    <th></th>
			    <th></th>
			    <th></th>
			    <th><a href="javascript:void(0);" style="display:none;" id="export">Click Export to csv</a></th>
			    <th><a href="javascript:void(0);" style="font-size:30px;" id="popup_amz">x</a></th>			    
			  </tr>
			</thead>
			</table>
			<table class="table-heading dataTable" id="amazonscout_data">
			  <thead>
			  	<th>#</th>
			  	<th>ASIN</th>			    
			    <th>Product Name</th>			 
		        <th>Image</th>			    
			    <th>Brand</th> 
			    <th>Price</th>			   
			    <th>Publisher</th>
			    <th>ReleaseDate</th>
			    <th>ProductGroup</th>
			    <th>Warranty</th>
			    <th>Currency</th>
			    <th>Est. Sale/Month</th>
			    <th>Est. Revenue</th>			
			    <th>Saler Rank</th>		
			    <th>Fba Fee</th>			    
			    <th>Category</th>			    
			  </thead>
			   <tbody>
			    <tr>
			     <td colspan="9">
			   		<img style="margin-left: 369%;" height="150" width="150" src="https://loading.io/spinners/typing/lg.-text-entering-comment-loader.gif">
			   	 </td>	
			   	</tr>	
			   	</div>
			  </tbody>
			</table>
		</div>`);	

		$("#aws-data").draggable({
          	cursorAt: {top: -10}
        });
		
		var asins = [];
		//var imgsrc = [];


        $('.a-carousel').find('li').each(function(){
		  	//imgsrc.push($(this).find('img').attr('src'));	       		
       		var asin = $(this).find("div").data("asin");       		
       		asins.push(asin);	
	    });
	
		$('.a-carousel').find('li').each(function(){		   
			  	var data = $(this).find('div').data('p13n-asin-metadata')	
			  	if(data){ 	  	
			  		asins.push(data.asin);	
			  		//mgsrc.push($(this).find('img').attr('src'));	       		
			 	}
		});		  	

		$('.a-carousel').find('li').each(function(){		   
			  	var data = $(this).find('div').data('p13n-asin-metadata')	
			  	if(data){ 	  	
			  		asins.push(data.asin);	
			  		//imgsrc.push($(this).find('img').attr('src'));	       		
			 	}
		});		

		if($('#ftSelectAsin').length > 0){
			asins.push($('#ftSelectAsin').val());	
			//imgsrc.push($('#imgTagWrapperId').find('img').attr('src'));
		}  	

		//console.log('imgsrc', imgsrc.length)
		//console.log('asins', asins.length)

		$('.feed-carousel-shelf').find('li').each(function(){
		  if($(this).data("asin") != '') {
       		//imgsrc.push($(this).find('img').attr('src'));	       		
       		var data = $(this).data("sgproduct");		
       		asins.push(data.asin);		
    	  }	
		}); 

       	$('#s-results-list-atf').find('li').each(function(){
       	if($(this).data("asin") != '') {
       		//imgsrc.push($(this).find('img').attr('src'));	       		
       		asins.push($(this).data("asin"));		
    	  }	 
		}); 
       	asins = $.unique(asins);
      	displayDataInTable(asins);
       }
  });  

  $(document).on('click', '#popup_amz', function(){
  	$('#aws-data').remove();
  });	
	
  function displayDataInTable(asins){   		
  		var num = 1;
		$.ajax({
	        type: "POST",
	        url: _apiUrl+"index.php?type=productInfo",
	        data: {asin: asins},  	     
	        success: function (responseJson) {
	           		productInfos = $.parseJSON(responseJson);
	           		$("#amazonscout_data tbody").html('');					
	           		$("#export").show();
					$.each(productInfos.all_products, function(k, productInfo) {
				     if(productInfo.asin != ''){		
						var tr = '';
						var tr = '<tr>';
						tr += '<td>'+num+'</td>';
						tr += '<td>'+productInfo.asin+'</td>';
						tr += '<td>'+'<a target="_blank" href="'+productInfo.link+'" title="'+productInfo.title+'"> '+productInfo.title.substring(0,15)+'</a></td>';	
						tr += '<td><img src="'+productInfo.product_image+'"></td>';
						tr += '<td>'+productInfo.brand+'</td>';
						tr += '<td>'+productInfo.formattedPrice+'</td>';						
						tr += '<td>'+productInfo.publisher+'</td>';
						tr += '<td>'+productInfo.releaseDate+'</td>';
						tr += '<td>'+productInfo.productGroup+'</td>';
						tr += '<td><a title="'+productInfo.warranty+'">'+productInfo.warranty.substring(0,10)+'</td>';
						tr += '<td>'+productInfo.currencyCode+'</td>';	
						tr += '<td>'+productInfo.sale+'</td>';						
						tr += '<td>'+productInfo.est_sale+'</td>';						
						tr += '<td>'+productInfo.sale_rank+'</td>';	
						tr += '<td>'+productInfo.fba_fees+'</td>';		
						tr += '<td>'+productInfo.category+'</td>';						
						tr += '</tr>';

						num++;						
						$("#amazonscout_data tbody").append(tr);	
						$('#total_records').html(num-1);
					} 	
				});					
	        },error: function (data) {
	           console.log(data);
	           console.log(data.Message);
	      	  }
	      });       	
  }	 

function createCsvFile(data){
	var titles = ['Price','BAX','ETH','Sum(ETH)'];
  
  /*
   * Convert our data to CSV string
   */
  var CSVString = prepCSVRow(titles, titles.length, '');
  CSVString = prepCSVRow(data, titles.length, CSVString);

  /*
   * Make CSV downloadable
   */
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", CSVString]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  var dt = new Date();
  downloadLink.download = "record_"+dt+"_data.csv";

  /*
   * Actually download CSV
   */
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}


$(document).on('click', '#export', function(){ 
  var titles = [];
  var data = [];

  /*
   * Get the table headers, this will be CSV headers
   * The count of headers will be CSV string separator
   */
  $('.dataTable th').each(function() {
    titles.push($(this).text());
  });

  /*
   * Get the actual data, this will contain all the data, in 1 array
   */
  $('.dataTable td').each(function() {
    data.push($(this).text());
  });
  
  /*
   * Convert our data to CSV string
   */
  var CSVString = prepCSVRow(titles, titles.length, '');
  CSVString = prepCSVRow(data, titles.length, CSVString);

  /*
   * Make CSV downloadable
   */
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", CSVString]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  var dt = new Date();
  downloadLink.download = "record_"+dt+"_data.csv";

  /*
   * Actually download CSV
   */
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

   /*
* Convert data array to CSV string
* @param arr {Array} - the actual data
* @param columnCount {Number} - the amount to split the data into columns
* @param initial {String} - initial string to append to CSV string
* return {String} - ready CSV string
*/
function prepCSVRow(arr, columnCount, initial) {
  var row = ''; // this will hold data
  var delimeter = ','; // data slice separator, in excel it's `;`, in usual CSv it's `,`
  var newLine = '\r\n'; // newline separator for CSV row

  /*
   * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
   * @param _arr {Array} - the actual array to split
   * @param _count {Number} - the amount to split
   * return {Array} - splitted array
   */
  function splitArray(_arr, _count) {
    var splitted = [];
    var result = [];
    _arr.forEach(function(item, idx) {
      if ((idx + 1) % _count === 0) {
        splitted.push(item);
        result.push(splitted);
        splitted = [];
      } else {
        splitted.push(item);
      }
    });
    return result;
  }
  var plainArr = splitArray(arr, columnCount);
  // don't know how to explain this
  // you just have to like follow the code
  // and you understand, it's pretty simple
  // it converts `['a', 'b', 'c']` to `a,b,c` string
  plainArr.forEach(function(arrItem) {
    arrItem.forEach(function(item, idx) {
      row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
    });
    row += newLine;
  });
  return initial + row;
}

  let checkItemsAdvanced = () => {

    let checkPromise = new Promise((resolve, reject) => {

    let items = $('.s-item-container'),
        itemsChecked = 0,
        itemsAvailable = 0,
        itemsUnavailableAndFewLeft = 0;
        
    var product_text;  
    // cycle for checking all items in the search page
    //for(i = 0; i < items.length; i++){
    var i = 0;
    var loop = setInterval(function() {
	  if( i == items.length || i > items.length){
		clearInterval(loop);  
	  }
if( $(items[i]).text() != '' ){
        let itemURL = $(items[i]).find('.a-link-normal')[0];
        itemsUnavailableAndFewLeft++;
        // GET query to the item page
         $.get(itemURL.href, item => {
			if( $(item).find('#availability span').text().indexOf('Currently unavailable') > -1 || ( $(item).find('#availability span').text().indexOf('Temporarily out of stock') > -1 ) || ( $(item).find('#outOfStock span').text().indexOf('Currently unavailable') > -1 ) || ( $(item).find('#outOfStock span').text().indexOf('Temporarily out of stock') > -1 ) ) {
				var itemObj = {};
				let title = $.trim($(item).find('#productTitle').text()),
				link = itemURL.href,
				asin,
				rank,
				category = $($('div[data-category] a span')[0]).text();
				asin = $(item).find('#ASIN').val();
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


				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Item Weight' || $.trim($(th[j]).text()) == 'Shipping Weight'){
						let weights = $.trim($(th[j]).next().text());
						weights = weights.split(' ');
						console.log('weights', weights)	
						weight = weights[0];
						
					}; 
				};	

				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Product Dimensions' || $.trim($(th[j]).text()) == 'Package Dimensions'){
						// full rank text
						console.log('$.trim($(th[j])', $.trim($(th[j])))
						let dimensions = $.trim($(th[j]).next().text());
						console.log('dimensions', dimensions)
						dimensions = dimensions.split('x');	

						console.log('after split', dimensions)					

						var length = dimensions[0];
						var width = dimensions[1];

						var height = dimensions[2].trim().split(' ');
						height = height[0];

						console.log('length', length);
						console.log('width', width);
						console.log('height', height);						
					}; 						
				};	

				let productInfo = '';
				$.ajax({
						url: _apiUrl+"index.php?type=productInfo",
						type: "POST",
						async: false,
						data: {asin: asin},  
				}).done(function(responseJson) {
						productInfo = $.parseJSON(responseJson);
				}); 	

				let fba = 0;
				if(length && width && height && weight){
					$.ajax({
						url: _apiUrl+"index.php?type=calFba",
						type: "POST",
						async: false,
						data: {length: length,width: width,height:height,weight:weight,binding:productInfo['binding']},  
					}).done(function(responseJson) {
						var json_obj = $.parseJSON(responseJson);	
						fba = json_obj.cost;	
						console.log('resposne after fba', responseJson);
					}); 	
				}

				
				
				itemObj = {
				'Title of product': title,
				'ASIN': asin || 'N/A',
				'Rank of items': rank || 'N/A',
				'Category': category,
				'Amazon Link': link,	
				'FBA Fee' : fba || 'N/A',
				'length': length || 'N/A',					
				'width': width || 'N/A',					
				'height': height || 'N/A',					
				'weight': weight || 'N/A',
				'brand': productInfo['brand'] || 'N/A',
				'binding': productInfo['binding'] || 'N/A',
				'genre': productInfo['genre'] || 'N/A',
				'listPrice': productInfo['listPrice'] || 'N/A',
				'currencyCode': productInfo['currencyCode'] || 'N/A',
				'formattedPrice': productInfo['formattedPrice'] || 'N/A',
				'manufacturer': productInfo['manufacturer'] || 'N/A',
				'packageQuantity': productInfo['packageQuantity'] || 'N/A',
				'warranty': productInfo['warranty'] || 'N/A',
				'upc': productInfo['upc'] || 'N/A',
				'releaseDate': productInfo['releaseDate'] || 'N/A',
				'publisher': productInfo['publisher'] || 'N/A',
				'productGroup': productInfo['productGroup'] || 'N/A',
				'numberOfItems': productInfo['numberOfItems'] || 'N/A',	
				};

				itemsArray.push(itemObj);
				localStorage.setItem('itemsArray', JSON.stringify(itemsArray));				
			}
			else if( ( $(item).find('#merchant-info').text().indexOf('sold by Amazon.com') != -1 && $(item).find('#availability span').text().indexOf('order soon') > -1 && $(item).find('#availability span').text().indexOf('more on the way') == -1 ) || ( $(item).find('#merchant-info').text().indexOf('sold by Amazon.com') != -1 && $(item).find('span#availability').text().indexOf('order soon') > -1 && $(item).find('span#availability span').text().indexOf('more on the way') == -1 ) ){

				console.log('here i am')

				var itemObj1 = {}; 
				let title = $.trim($(item).find('#productTitle').text()),
				link = itemURL.href,
				asin,
				rank,
				category = $($('div[data-category] a span')[0]).text();
				asin = $(item).find('#ASIN').val();
				let rankTemp = $.trim($(item).find('#SalesRank').text());
				rankTemp = rankTemp.split('in');
				rankTemp = rankTemp[0].split(':');
				// deleting the # symbol
				rank = $.trim(rankTemp[1]).slice(1);
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
				
				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Item Weight' || $.trim($(th[j]).text()) == 'Shipping Weight'){
						let weights = $.trim($(th[j]).next().text());
						weights = weights.split(' ');
						console.log('weights', weights)	
						weight = weights[0];
						
					}; 
				};	

				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Product Dimensions' || $.trim($(th[j]).text()) == 'Package Dimensions'){
						// full rank text
						console.log('$.trim($(th[j])', $.trim($(th[j])))
						let dimensions = $.trim($(th[j]).next().text());
						console.log('dimensions', dimensions)
						dimensions = dimensions.split('x');	

						console.log('after split', dimensions)					

						var length = dimensions[0];
						var width = dimensions[1];

						var height = dimensions[2].trim().split(' ');
						height = height[0];

						console.log('length', length);
						console.log('width', width);
						console.log('height', height);						
					}; 						
				};

				let productInfo = '';
				$.ajax({
						url: _apiUrl+"index.php?type=productInfo",
						type: "POST",
						async: false,
						data: {asin: asin},  
				}).done(function(responseJson) {
						productInfo = $.parseJSON(responseJson);
				}); 	
	

				let fba = 0;
				if(length && width && height && weight){
					$.ajax({
						url: _apiUrl+"index.php?type=calFba",
						type: "POST",
						async: false,
						data: {length: length,width: width,height:height,weight:weight,binding:productInfo['binding']},  
					}).done(function(responseJson) {
						var json_obj = $.parseJSON(responseJson);	
						fba = json_obj.cost;	
						console.log('resposne after fba', responseJson);
					}); 	
				}		

				
				itemObj1 = {
				'Title of product': title,
				'ASIN': asin || 'N/A',
				'Rank of items': rank || 'N/A',
				'Category': category,
				'Amazon Link': link,	
				'FBA Fee' : fba || 'N/A',
				'length': length || 'N/A',					
				'width': width || 'N/A',					
				'height': height || 'N/A',					
				'weight': weight || 'N/A',
				'brand': productInfo['brand'] || 'N/A',
				'binding': productInfo['binding'] || 'N/A',
				'genre': productInfo['genre'] || 'N/A',
				'listPrice': productInfo['listPrice'] || 'N/A',
				'currencyCode': productInfo['currencyCode'] || 'N/A',
				'formattedPrice': productInfo['formattedPrice'] || 'N/A',
				'manufacturer': productInfo['manufacturer'] || 'N/A',
				'packageQuantity': productInfo['packageQuantity'] || 'N/A',
				'warranty': productInfo['warranty'] || 'N/A',
				'upc': productInfo['upc'] || 'N/A',
				'releaseDate': productInfo['releaseDate'] || 'N/A',
				'publisher': productInfo['publisher'] || 'N/A',
				'productGroup': productInfo['productGroup'] || 'N/A',
				'numberOfItems': productInfo['numberOfItems'] || 'N/A',	
				};

				itemsArray1.push(itemObj1);
				localStorage.setItem('itemsArray1', JSON.stringify(itemsArray1));
			}else {
				console.log('else');
				return
			}
			
        })
        .then(() => {
          itemsChecked++;
          i++;
          if(itemsChecked == itemsUnavailableAndFewLeft){
            setTimeout(() => resolve('get'), 4000)
          };
        })
        .catch(() => {
          itemsChecked++;
          i++;
          if(itemsChecked == itemsUnavailableAndFewLeft){
            resolve('get')
          };
        })
      
	  } 
	  
	  } , 1000);  
    //};
  })

  checkPromise.then((data) => {
    if(data == 'all'){
	  setTimeout(() =>{
		nextPageClicker();
	  } , 4000);
    } else {
      setTimeout(() =>{
		nextPageClicker();
	  } , 4000);
    }
  })

  };
  

  let checkItems = () => {

    let checkPromise = new Promise((resolve, reject) => {

    	console.log('checkItems', checkItems)

    let items = $('.s-item-container'),
        itemsChecked = 0,
        itemsAvailable = 0,
        itemsUnavailableAndFewLeft = 0;
        
    var product_text;  
    // cycle for checking all items in the search page
    for(i = 0; i < items.length; i++){
    	  	console.log('for loo')

      if(($(items[i]).find('.a-size-small').text()).indexOf('Currently unavailable') > -1 || ($(items[i]).find('.a-size-small').text()).indexOf('Temporarily out of stock') > -1 || ($(items[i]).find('.a-size-small').text()).indexOf('order soon') > -1 ){
		//product_text = ($(items[i]).find('.a-size-small').text());  
        let itemURL = $(items[i]).find('.a-link-normal')[0];
        itemsUnavailableAndFewLeft++;

        // GET query to the item page
         $.get(itemURL.href, item => {
			if( $(item).find('#availability span').text().indexOf('Currently unavailable') > -1 || $(item).find('#availability span').text().indexOf('Temporarily out of stock') > -1 ) {
				var itemObj = {};
				let title = $.trim($(item).find('#productTitle').text()),
				link = itemURL.href,
				asin,
				rank,
				category = $($('div[data-category] a span')[0]).text();

				console.log('category', category)

				// checking all <th> tags to find ASIN line
				// if ASIN in table				
				let th = $(item).find('th');
				let li = $(item).find('li');
				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'ASIN'){
						asin = $.trim($(th[j]).next().text());
					if (asin == undefined || asin == '' || asin == null){
							for(singleLi of li){
								if(($(singleLi).find('b').text()).indexOf('ASIN') != -1){
									asin = $(singleLi).text().slice(6)
								}
							}
						}
					} 									
					else if($.trim($(th[j]).text()) == 'Best Sellers Rank'){
						// full rank text
						let rankTemp = $.trim($(th[j]).next().text());
						// splitting the first number
						rankTemp = rankTemp.split('in');
						// deleting the # symbol
						rank = rankTemp[0].slice(1);
					};
				};

				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Item Weight' || $.trim($(th[j]).text()) == 'Shipping Weight'){
						let weights = $.trim($(th[j]).next().text());
						weights = weights.split(' ');
						console.log('weights', weights)	
						weight = weights[0];
						
					}; 
				};	

				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Product Dimensions' || $.trim($(th[j]).text()) == 'Package Dimensions'){
						// full rank text
						console.log('$.trim($(th[j])', $.trim($(th[j])))
						let dimensions = $.trim($(th[j]).next().text());
						console.log('dimensions', dimensions)
						dimensions = dimensions.split('x');	

						console.log('after split', dimensions)					

						var length = dimensions[0];
						var width = dimensions[1];

						var height = dimensions[2].trim().split(' ');
						height = height[0];

						console.log('length', length);
						console.log('width', width);
						console.log('height', height);						
					}; 						
				};

				let productInfo = '';
				$.ajax({
						url: _apiUrl+"index.php?type=productInfo",
						type: "POST",
						async: false,
						data: {asin: asin},  
				}).done(function(responseJson) {
						productInfo = $.parseJSON(responseJson);	
				});	

				let fba = 0;
				if(length && width && height && weight){
					$.ajax({
						url: _apiUrl+"index.php?type=calFba",
						type: "POST",
						async: false,
						data: {length: length,width: width,height:height,weight:weight,binding:productInfo['binding']},  
					}).done(function(responseJson) {
						var json_obj = $.parseJSON(responseJson);	
						fba = json_obj.cost;	
						console.log('resposne after fba', responseJson);
					}); 	
				}				 				

				itemObj = {
				'Title of product': title,
				'ASIN': asin || 'N/A',
				'Rank of items': rank || 'N/A',
				'Category': category,
				'Amazon Link': link,	
				'FBA Fee' : fba || 'N/A',
				'length': length || 'N/A',					
				'width': width || 'N/A',					
				'height': height || 'N/A',					
				'weight': weight || 'N/A',
				'brand': productInfo['brand'] || 'N/A',
				'binding': productInfo['binding'] || 'N/A',
				'genre': productInfo['genre'] || 'N/A',
				'listPrice': productInfo['listPrice'] || 'N/A',
				'currencyCode': productInfo['currencyCode'] || 'N/A',
				'formattedPrice': productInfo['formattedPrice'] || 'N/A',
				'manufacturer': productInfo['manufacturer'] || 'N/A',
				'packageQuantity': productInfo['packageQuantity'] || 'N/A',
				'warranty': productInfo['warranty'] || 'N/A',
				'upc': productInfo['upc'] || 'N/A',
				'releaseDate': productInfo['releaseDate'] || 'N/A',
				'publisher': productInfo['publisher'] || 'N/A',
				'productGroup': productInfo['productGroup'] || 'N/A',
				'numberOfItems': productInfo['numberOfItems'] || 'N/A',	
				};

				console.log('itemObj', itemObj);


				/*if($(item).find('#merchant-info').text().indexOf('sold by Amazon.com') != -1){
					itemObj['seller'] = 'Amazon Seller';
				}*/
				itemsArray.push(itemObj);
				localStorage.setItem('itemsArray', JSON.stringify(itemsArray));				
			}
			else if( $(item).find('#merchant-info').text().indexOf('sold by Amazon.com') != -1 && $(item).find('#availability span').text().indexOf('order soon') > -1 && $(item).find('#availability span').text().indexOf('more on the way') == -1){
				var itemObj1 = {}; 
				let title = $.trim($(item).find('#productTitle').text()),
				link = itemURL.href,
				asin,
				rank,
				category = $($('div[data-category] a span')[0]).text();

				console.log('else category', category)

				// checking all <th> tags to find ASIN line
				// if ASIN in table				
				let th = $(item).find('th');
				let li = $(item).find('li');
				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'ASIN'){
							asin = $.trim($(th[j]).next().text());
							if (asin == undefined || asin == '' || asin == null){
								for(singleLi of li){
									if(($(singleLi).find('b').text()).indexOf('ASIN') != -1){
										asin = $(singleLi).text().slice(6)
								}
							}
						}
					}											
					else if($.trim($(th[j]).text()) == 'Best Sellers Rank'){
							// full rank text
							let rankTemp = $.trim($(th[j]).next().text());
							// splitting the first number
							rankTemp = rankTemp.split('in');
							// deleting the # symbol
							rank = rankTemp[0].slice(1);
						};
				};

				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Item Weight' || $.trim($(th[j]).text()) == 'Shipping Weight'){
						let weights = $.trim($(th[j]).next().text());
						weights = weights.split(' ');
						console.log('weights', weights)	
						weight = weights[0];
						
					}; 
				};	

				for(j = 0; j < th.length; j++){
					if($.trim($(th[j]).text()) == 'Product Dimensions' || $.trim($(th[j]).text()) == 'Package Dimensions'){
						// full rank text
						console.log('$.trim($(th[j])', $.trim($(th[j])))
						let dimensions = $.trim($(th[j]).next().text());
						console.log('dimensions', dimensions)
						dimensions = dimensions.split('x');	

						console.log('after split', dimensions)					

						var length = dimensions[0];
						var width = dimensions[1];

						var height = dimensions[2].trim().split(' ');
						height = height[0];

						console.log('length', length);
						console.log('width', width);
						console.log('height', height);						
					} 						
				};					

				let productInfo = '';
				$.ajax({
						url: _apiUrl+"index.php?type=productInfo",
						type: "POST",
						async: false,
						data: {asin: asin},  
				}).done(function(responseJson) {
						productInfo = $.parseJSON(responseJson);
				}); 

				let fba = 0;
				if(length && width && height && weight){
					$.ajax({
						url: _apiUrl+"index.php?type=calFba",
						type: "POST",
						async: false,
						data: {length: length,width: width,height:height,weight:weight,binding:productInfo['binding']},  
					}).done(function(responseJson) {
						var json_obj = $.parseJSON(responseJson);	
						fba = json_obj.cost;						
						console.log('resposne after fba', responseJson);
					}); 				
				}		
				

				itemObj1 = {
				'Title of product': title,
				'ASIN': asin || 'N/A',
				'Rank of items': rank || 'N/A',
				'Category': category,
				'Amazon Link': link,	
				'FBA Fee' : fba || 'N/A',
				'length': length || 'N/A',					
				'width': width || 'N/A',					
				'height': height || 'N/A',					
				'weight': weight || 'N/A',
				'brand': productInfo['brand'] || 'N/A',
				'binding': productInfo['binding'] || 'N/A',
				'genre': productInfo['genre'] || 'N/A',
				'listPrice': productInfo['listPrice'] || 'N/A',
				'currencyCode': productInfo['currencyCode'] || 'N/A',
				'formattedPrice': productInfo['formattedPrice'] || 'N/A',
				'manufacturer': productInfo['manufacturer'] || 'N/A',
				'packageQuantity': productInfo['packageQuantity'] || 'N/A',
				'warranty': productInfo['warranty'] || 'N/A',
				'upc': productInfo['upc'] || 'N/A',
				'releaseDate': productInfo['releaseDate'] || 'N/A',
				'publisher': productInfo['publisher'] || 'N/A',
				'productGroup': productInfo['productGroup'] || 'N/A',
				'numberOfItems': productInfo['numberOfItems'] || 'N/A',	
				};

				console.log('itemObj', itemObj1);
				itemsArray1.push(itemObj1);
				localStorage.setItem('itemsArray1', JSON.stringify(itemsArray1));
			}else {
				return
			}
			
        })
        .then(() => {
          itemsChecked++;
          if(itemsChecked == itemsUnavailableAndFewLeft){
            setTimeout(() => resolve('get'), 4000)
          };
        })
        .catch(() => {
          itemsChecked++;
          if(itemsChecked == itemsUnavailableAndFewLeft){
            resolve('get')
          };
        }) 

        // if all products in the page is available
      } 
      else if(($(items[i]).find('.a-size-small').text()).indexOf('Currently unavailable') == -1) {
        itemsAvailable++
        if(itemsAvailable == items.length){
          resolve('all');
        };
      };  
    };
  })

  checkPromise.then((data) => {
    if(data == 'all'){
	  setTimeout(() =>{
		nextPageClicker();
	  } , 4000);
    } else {
      nextPageClicker();
    }
  })

  };  
  
  
  
  
  
  
  
  let pageCounter = localStorage.getItem('pageCounter');

  // 30 pages to close and open a new tab (for managing memory and don't get crashes)
 console.log(pageCounter);
  if(pageCounter){
    if(pageCounter == 10){
      pageCounter = 0;
      if(localStorage.getItem('amazon-ext-status') == 'true'){
		isExtEnable();
	  }
    }; 
  }


  let nextPageClicker = () => {   
    if($('#pagnNextString').css('color') == 'rgb(153, 153, 153)' || $('#pagnNextString').css('color') == 'rgb(85, 85, 85)'){
      localStorage.setItem('pageCounter', 0);
      createExcel(itemsArray,itemsArray1);
      window.localStorage.removeItem('itemsArray');
      window.localStorage.removeItem('itemsArray1');
      localStorage.setItem('amazon-ext-status', false);      
      $('.amazon-extension-start').remove();
    } else {
	  if(localStorage.getItem('amazon-ext-status') == 'true'){
		  $('#pagnNextString').click();
		  pageCounter++;
		  console.log('pagecounter:'+pageCounter);
		  if(pageCounter == 10){
			localStorage.setItem('pageCounter', pageCounter);
			localStorage.setItem('itemsArray', JSON.stringify(itemsArray))
			localStorage.setItem('itemsArray1', JSON.stringify(itemsArray1))
			chrome.runtime.sendMessage({action: "new", url: location.href});
			
		  } else {
			observer.observe(target, config);     
		  }
	   }
    }
  }

  // alasql library
  let createExcel = (items,items1) => {
	/*var result = items1.reduce(function(memo, e1){
	  var matches = memo.filter(function(e2){
		return e1.Title == e2.Title
		//return e1.title == e2.title && e1.start == e2.start
	  })
	  if (matches.length == 0)
		memo.push(e1)
		return memo;
	}, []);  */
	if(items == '' || items == null){
		items = [{'No records found':''}];
	}
	if(items1 == '' || items1 == null){
		items1 = [{'No records found':''}];
	}
	localStorage.setItem('amazon-stock-checkbox', false);
	localStorage.setItem('start-click', false);
	let date = new Date;
	date =  date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + date.getMinutes();
	var opts = [{sheetid:'Out of stock',header:true},{sheetid:'Only few left',header:false}];
	var res = alasql(`SELECT INTO XLSX("amazon-ext ${date}.xlsx",?) FROM ?`,[opts,[items,items1]]);
	window.localStorage.removeItem('itemsArray');    
	window.localStorage.removeItem('itemsArray1');    
  }

})

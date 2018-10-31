$(document).ready(function(){	
	var _apiUrl = "https://www.amazonsoldout.com/";
	var url      = window.location.href;     // Returns full URL
	alert(url);
	var part = url.split('.com');
	
	if(part != null){
		var v = chrome.extension.getURL("html/onpage.html");
		var parts = window.location.href.split('dp/');

		if(parts[1]){
			var asins = [];
			var parts_2 = parts[1].split('/ref');
			asins.push(parts_2[0]);

			alert(parts_2[0])

			$.ajax({
		        type: "POST",
		        async: false,	        
		        url: _apiUrl+"index.php?type=productInfo",
		        data: {asin: asins},  		        
		        success: function (responseJson) {		        	
		           		productInfos = $.parseJSON(responseJson);		           			
		           		$.each(productInfos.all_products, function(k, productInfo) {					     
					     if(productInfo.asin != ''){
					     	console.log('productInfo', productInfo)
					     	$(document).find('.estimated-sales-per-month').text(parts_2[0]);
					     } 	
				    });  
		        }
		    });    
		}
	}
});
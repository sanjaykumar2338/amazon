chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

	  var url = request.url;

	  if(request.type=="getProductData"){
		var data = getProductData(url);
	  }

});

function getProductData(url){
	var numberOfSellers;
	var isAmazonSeller;
	$.ajax({
		url : url,
		type : "get",
		success : function(data) {
			numberOfSellers = $(data).find(".olpBadge").length;
			isAmazonSeller = false;
			
			$(data).find(".olpSellerName").each(function(){
				if($(this).html().indexOf('alt="Amazon.com"')>-1){
					isAmazonSeller = true
					return false;
				}
			});

			alert("isAmazonSeller:"+isAmazonSeller);
			alert("numberOfSellers:"+numberOfSellers);
		},
		error: function() {
			console.log("Error");
		}
	});

}

chrome.browserAction.onClicked.addListener(function(tab) {	
	// Get the previous status of TWFButton
	chrome.storage.local.get('isTWFOn', function(result) {
        var isTWFOn;

		if(result==null){
			isTWFOn = false;
		}else{
			isTWFOn = result.isTWFOn;
		}
        console.log(isTWFOn);

		// Set On or OFF icon 
		toggleIcon(isTWFOn);


		//Toggle the status of TWFButton
		setButtonStatus(isTWFOn);

	});

	
});


function toggleIcon(isTWFOn){

	if(isTWFOn){
			chrome.browserAction.setIcon({
				path: "images/icon_off.png"
			})
		}else{
			chrome.browserAction.setIcon({
				path: "images/icon_on.png"
			})
		}
}

function setButtonStatus(isTWFOn){
	chrome.storage.sync.set({
			'isTWFOn': !isTWFOn
		}, function() {
			console.log("Sync set")
		});
		
		chrome.storage.local.set({
			'isTWFOn': !isTWFOn
		}, function() {
			console.log("Local set")
		});
}
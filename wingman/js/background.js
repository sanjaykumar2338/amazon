chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tabId["fillEnabledefaultVal"] == "yes") {
     
    } 
});
chrome.runtime.onMessage.addListener(function(request, sender) {
   if (request.type == "varitation")
      //chrome.tabs.create({url: 'html/popup.html?varitation='+request.options.message});
});




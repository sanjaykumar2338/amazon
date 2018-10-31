var _isLoggedIn = false;
var _user;
function defaultResponse(tab, sendResponse) {

    var d = { isLoggedIn: _isLoggedIn, screenname: _user ? _user : null, avatar: _user ? _user.avatar : null };
    if (sendResponse)
        sendResponse(d);
    else
    return d;
}
function defaultResponseNew(tab, callback) {

    var result = {res_advance_mode: _res_advance_mode };
    if (callback)
        callback(result);
    else
    return d;
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message['action'] == 'store_window_id'){
        chrome.windows.getCurrent(function(currentWindow) {                
            localStorage.setItem('currentWindow', currentWindow.id);                                

            chrome.tabs.getSelected(null, function(tab) {                   
                localStorage.setItem('currentTab', tab.id);                                       
            });
        });       
    }
    
	if (message["fillEnabledefaultVal"] == "yes") {
		chrome.storage.sync.get(function(data) { 
			chrome.runtime.sendMessage({EnableButtonVal: data.isAdvanceModeEnabled}, function(response) {
			});
		});
	}
    
    if (message["action"] == "setLoginInject") {    
        console.log('fesss do')
    }

    if (message["action"] == "setLogin") {       

        _isLoggedIn = message["isLoggedIn"];
        if (_isLoggedIn) {
            _user = message["user"];

                         
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {   
                chrome.tabs.sendMessage(tabs[0].id, {'method': 'openpopup'}, function(response) {                                
                    
                });   
           }); 
           

        }
        else {
            _user = null;
        }
        defaultResponse(sender["tab"], sendResponse);
    }
    else if (message["action"] == "new") {		
		var tabId = localStorage.getItem('currentTab');         
        chrome.tabs.remove(parseInt(tabId));                
        
        var windowId = localStorage.getItem('currentWindow');                 
        chrome.tabs.create({windowId: parseInt(windowId), url: message["url"]}, function(tab){
            localStorage.setItem('currentTab', tab.id);             
        });     
	}   
});
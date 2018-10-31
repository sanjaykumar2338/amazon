var _apiUrl = "https://www.amazonsoldout.com/";
 

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.task === "start_error") {
		swal({
			title: "",
			text: "This extension will work on product listing page only",
			type: "error",
			customClass: "swal-small"
		})
	}
	if (request.task === "start_error1") {
		swal({
			title: "",
			text: "Extension already running. Please stop and start extension again.",
			type: "error",
			customClass: "swal-small"
		})
	}
});
$('#enableButton').on('click', function() {
	chrome.storage.sync.get(function(data) {
		if(data.isAdvanceModeEnabled == 1){
			//update database + local storage
			$.ajax({
				url: _apiUrl+"index.php?type=updateAdvancemodeEnabled",
				type: "POST",
				data: { userId: data.userId, val: 0 },
				complete: function(qXHR,textStatus) {
					if (textStatus === 'success') {
						chrome.storage.sync.set({isAdvanceModeEnabled: 0});
						swal({
							title: "",
							text: "Advance mode Disabled!",
							type: "success",
							customClass: "swal-small"
						})
					}
				}
			});
			
		}
		else{	
			swal({
				title: "Warning!",
				text: "Enabling advance mode will slow down the performance. ",
				type: "warning",
				customClass: "swal-small",
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: 'Ok',
				cancelButtonText: "Cancel",
				closeOnConfirm: false,
				closeOnCancel: false
			 },
			 function(isConfirm){
			   if (isConfirm){
					//update database + local storage
					$.ajax({
						url: _apiUrl+"index.php?type=updateAdvancemodeEnabled",
						type: "POST",
						data: { userId: data.userId, val: 1},
						complete: function(qXHR,textStatus) {
							if (textStatus === 'success') {
								chrome.storage.sync.set({isAdvanceModeEnabled: 1});
								swal({
									title: "",
									text: "Advance mode Enabled!",
									type: "success",
									customClass: "swal-small"
								})
							}
						}
						
					});
				} else {
					$('#enableButton').prop('checked', false);
					swal({
						title: "Cancelled",
						text: "",
						type: "error",
						customClass: "swal-small"
					})	
					e.preventDefault();				
					return false;
				}
			 });

		}
	});	
});	  
chrome.runtime.sendMessage({fillEnabledefaultVal: "yes"}, function(response) {
	chrome.runtime.onMessage.addListener(function (request, sender, callback) {
		//var imagesPath = chrome.extension.getURL('images'); 
		//$(".logout_logo").html("<img src='"+imagesPath+"/logo.png'>");
		$("#enableButton").attr('data',request.EnableButtonVal);
		//$("#welcome_content").html(request.welcomeMsg);
		if (request.EnableButtonVal == 1) {
			$('#enableButton').prop('checked', true);
		}
		else{
			if(request.action != 'store_window_id'){
				$('#enableButton').prop('checked', false);
			}
		}
	}); 
}); 
var _layoutHelper = {
    "block-ui": function () {
        document.getElementById("preloader").style.display = "block";
    },
    "unblock-ui": function () {
        document.getElementById("preloader").style.display = "none";
    },
    "to-logoff": function () {
        document.querySelector(".as-login-container").style.display = "block";
        document.querySelector(".button-on-off").style.display = "none";
        document.querySelector(".button-info").style.display = "none";
        var pane = document.querySelector(".pane>div");
        pane.innerText = "";
        pane.setAttribute("class", "pane");
    },
    "show-error": function (error) {
        document.querySelector(".footer").style.background = "#EC0404";
        var pane = document.querySelector(".pane>div");
        pane.innerText = error;
        pane.setAttribute("class", "pane button-error");
    },
    "to-login": function (username, avatar) {
        document.querySelector(".as-login-container").style.display = "none";
        document.querySelector(".button-on-off").style.display = "block";
        document.querySelector(".button-info").style.display = "block";
        var pane = document.querySelector(".pane>div");
        pane.innerText = username;
        if (!avatar)
            pane.setAttribute("class", "pane button-user-avatar");
        else {
            pane.setAttribute("class", "pane button-user");
            pane.style.background = "url('" + avatar + "') no-repeat left center / 20px 20px";
        }
    }
};

var login = function() {	
    _layoutHelper["block-ui"]();

    var login = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;
	$.ajax({
		url: _apiUrl+"index.php?type=checkExtensionLogin",
		type: "POST",
		data: { email: login, password: password }
	}).done(function(responseJson) {
		console.log(responseJson);
		var response = jQuery.parseJSON(responseJson);
		if (response.status == 1) {
			_layoutHelper["unblock-ui"]();
            var user = response.userName;
            var userId = response.user;
            chrome.storage.sync.set({'user': user, 'userId':userId}, function() {
                chrome.runtime.sendMessage({ action: "setLogin", "isLoggedIn": true, user: user }, function (state) {
					console.log(state);
                    if (state["isLoggedIn"]) {
                    	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {    	
						         //Make request to get the HTML of the current tab
    chrome.tabs.executeScript(null, {file: "js/getPagesSource.js"}, function() {
        if (chrome.extension.lastError) {
            chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
                chrome.tabs.update(tab.id, {url: 'http://www.amazon.com/'});
                var storage = localStorage.setItem('currentURL','http://www.amazon.com/');
                //window.open(chrome.extension.getURL("html/popup.html"));
                terminalError('Please make your search on Amazon, then click on ASO TOOL PRO button again')
                $('body, .error-message').css({height:'60px'});
            });
        }
    });

    //START PROGRAM
    chrome.extension.onMessage.addListener(function(request, sender) {    	
        if (request.action == "getSource") {
            chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
                var source = request.source;
                var activeTab = tabArray[0].url;

                var domain = getDomain(activeTab);

                if (domain != 'amazon')
                {

                    if (domain == 'ebay' || domain == 'walmart' || domain == 'overstock' || domain == 'wayfair' || domain == 'kohls' || domain == 'target' || domain == 'toysrus' || domain == 'homedepot' ||  domain == 'asda' ||  domain == 'argos' ||  domain == 'pcworld')
                    {
                        var storage = setLocalStorage(source, activeTab);
                        if (storage)
                            window.open(chrome.extension.getURL("html/wait.html")+'?'+storage);
                    }
                    else
                    {
                        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
                            chrome.tabs.update(tab.id, {url: 'http://www.amazon.com/'});
                            terminalError('Please make your search on Amazon, then click on ASINspector button again')
                            $('body, .error-message').css({height:'60px'});
                        });
                    }
                }
                else
                {
                    var storage = localStorage.setItem('currentURL', activeTab);
                    chrome.runtime.sendMessage({"message": "start"});	
                    //window.open(chrome.extension.getURL("html/popup.html"));
                }    
            });

        }
    });
						  });
                        _layoutHelper["to-login"](state["screenname"], state["avatar"]);
                    }
                });
            });
		} else {
            _layoutHelper["unblock-ui"]();
             swal({
					title: "",
					text: response.msg,
					type: "error",
					customClass: "swal-small"
			 })
		}
	});  
	return true;      
    
    
}


document.querySelector(".login-button").addEventListener("click", login);

document.querySelector(".button-on-off").addEventListener("click", function () {
    //_layoutHelper["block-ui"]();
    chrome.runtime.sendMessage({ action: "setLogin", "isLoggedIn": false }, function (state) {
        if (state["isLoggedIn"] === false) {
			
			chrome.storage.sync.remove(["user"],function(){
				var error = chrome.runtime.lastError;
				if (error) {
					console.error(error);
				}
			});
			
            _layoutHelper["to-logoff"]();
            _layoutHelper["unblock-ui"]();
        }
    });
    
    chrome.tabs.getSelected(null, function(tab) {
	  var code = 'window.location.reload();';
	  chrome.tabs.executeScript(tab.id, {code: code});
	});
});

// document.querySelector(".start-button").addEventListener("click", function () {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {action: "start"});
//     });
// });

// document.querySelector(".end-button").addEventListener("click", function () {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, "end");
//     });
// });

// document.querySelector(".download-button").addEventListener("click", function () {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, "last");
//     });
// });

chrome.storage.sync.get(function(user) {	
    if (chrome.runtime.lastError) {
        // do nothing, no or invalid user found
    } else {
        if (user && typeof user.user != "undefined") {
            chrome.runtime.sendMessage({ action: "setLogin", "isLoggedIn": true, user: user.user}, function (state) {
                if (state["isLoggedIn"]) {
                	   //Make request to get the HTML of the current tab
   					chrome.tabs.executeScript(null, {file: "js/getPagesSource.js"}, function() {
			        if (chrome.extension.lastError) {
			            chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
			                chrome.tabs.update(tab.id, {url: 'http://www.amazon.com/'});			                
			                terminalError('Please make your search on Amazon, then click on ASO TOOL PRO button again')
			                $('body, .error-message').css({height:'60px'});
			                var storage = localStorage.setItem('currentURL','http://www.amazon.com/');
		                    //window.open(chrome.extension.getURL("html/popup.html"));
			            });
			        }
			    });

			    //START PROGRAM
			    chrome.extension.onMessage.addListener(function(request, sender) {
			        if (request.action == "getSource") {

			            chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
			                var source = request.source;
			                var activeTab = tabArray[0].url;

			                var domain = getDomain(activeTab);

			                if (domain != 'amazon')
			                {

			                    if (domain == 'ebay' || domain == 'walmart' || domain == 'overstock' || domain == 'wayfair' || domain == 'kohls' || domain == 'target' || domain == 'toysrus' || domain == 'homedepot' ||  domain == 'asda' ||  domain == 'argos' ||  domain == 'pcworld')
			                    {
			                        var storage = setLocalStorage(source, activeTab);
			                        if (storage)
			                            window.open(chrome.extension.getURL("html/wait.html")+'?'+storage);
			                    }
			                    else
			                    {
			                        chrome.runtime.sendMessage({ action: "setLoginInject", "isLoggedIn": true, user: user.user}, function (state) {
			                            console.log('fa')
			                        });
			                    }
			                }
			                else
			                {
			                  
			                     //chrome.runtime.sendMessage({"message": "start"});							
			                 
							
			                }    
			            });

			        }
			    });	                
			       _layoutHelper["to-login"](state["screenname"], state["avatar"]);
			                }
			            });
			        }
			    }
});

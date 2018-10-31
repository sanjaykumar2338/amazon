chrome.runtime.onMessage.addListener(function (request, sender, callback) {
	if (request.type === "edt.amazon.closeTab") {
		closeTab(sender.tab.id);
        return true;
	}
	if (request.fillEnabledefaultVal == "yes") {
		chrome.storage.sync.get(function(data) { 
			chrome.runtime.sendMessage({EnableButtonVal: data.isNumberEnabled}, function(response) {
			});
		});
	}
    if (request.type === "edt.ebay.newBuy") {
        var tab = sender.tab.id;
        newBuy(request.value, tab);
        return true;
    } 
    if (request.type === "edt.ebay.addNote") {
        appendNote(request.value, sender.tab.id);
        return true;
    } 
    if (request.task === "login") {

        var login = request.login;
        var password = request.password;
        var remember_me = request.remember_me;
        $.ajax({
            url: "https://dropship4arbitrage.com/ext-login",
            type: "POST",
            data: { email: login, password: password }
        }).done(function(response) {
            if (response.status) {
				var time_now  = (new Date()).getTime();
                chrome.storage.sync.set({login: login, password: password, remember_me: remember_me, savedLogin: login, savedPassword: password, loginTime: time_now});
                chrome.browserAction.setPopup({popup: "popup.html"}); 
                chrome.browserAction.setIcon({
				  path : {
					"128": "images/icon_128.png"
				  }
				});
                callback({status: true});
            } else {
				chrome.browserAction.setIcon({
				  path : {
					"128": "images/icon_logout_128.png"
				  }
				});
                callback({message: response.message, status: false});
            }
        });  
        return true;      
    }
	if (request.task === "checkSession") {
	   chrome.storage.sync.get(["login", "password"], function(data) {
			if (!data.login && !data.password) {
				chrome.browserAction.setPopup({popup: "login.html"}); 
				chrome.browserAction.setIcon({
				  path : {
					"128": "images/icon_logout_128.png"
				  }
				});
			} else {
				chrome.browserAction.setPopup({popup: "popup.html"}); 
				chrome.browserAction.setIcon({
				  path : {
					"128": "images/icon_128.png"
				  }
				});
			}
	   });		
	}
	if (request.task === "checkSubscription") {
        chrome.storage.sync.get(["login", "password"], function(data) {
            var login = data.login;          
            var password = data.password;             
            $.ajax({
                url: "https://dropship4arbitrage.com/ext-login",
                type: "POST",
                data: { email: login, password: password }
            }).done(function(response) { 
                if (response.status) {
                    chrome.browserAction.setPopup({popup: "popup.html"}); 
                    chrome.browserAction.setIcon({
					  path : {
						"128": "images/icon_128.png"
					  }
					});
                    callback({status: true});
                } else {
                    chrome.browserAction.setPopup({popup: "message.html?message="+response.message});
                    chrome.browserAction.setIcon({
					  path : {
						"128": "images/icon_logout_128.png"
					  }
					});
                    callback({status: false});
                }
            });                         
        });
        return true;
    }
    if (request.type === "edt.ebay.newAddress") {
        var tab = sender.tab.id;
        var addressInfo = request.value;
        var domainExtension = addressInfo.ext;
        chrome.cookies.getAll({
            url: "https://www.amazon."+domainExtension,
            name: "session-id"
        }, function(resp) {
            newAddress(addressInfo, resp[0].value, tab);
        });
        return true;
    }
    if ("sd.amazon.splitItemsUsingDefaultDispatch" === request.type) z(request, callback);
    if ("sd.amazon.splitItemsInCart" === request.type) q(sender);

});
function t(e, t) {
	return e.add(t), e
}
function z(e, t) {
    return $.ajax({
        url: "https://www.amazon.co.uk/gp/buy/itemselect/handlers/continue.html/?action=ship-to-multiple&cachebuster=" + (new Date).getTime(),
        data: {
            lineitem: e.lineitem,
            quantity: e.quantity,
            address: e.address
        },
        method: "post",
        success: function(e) {
            t()
        }
    }), !0
}
var re = {
	removeEls: function(e, t, n) {
		if ("img" === t) return e.replace(/(<img(.|\s)+?)src(=(.|\s)+?>)/gim, "$1data-image$3");
		var r;
		return r = n === !0 ? new RegExp("<" + t + "(.|[\r\n])+?</" + t + ">", "gim") : new RegExp("<" + t + ".+?>", "gim"), e.replace(r, "")
	},
	removeKnownEl: function(e) {
		return re.removeEls(e, "img"), e = re.removeEls(e, "head", !0), e = re.removeEls(e, "script", !0)
	}
}
    
 
function removeEls1(e, t, n){
	if ("img" === t) return e.replace(/(<img(.|\s)+?)src(=(.|\s)+?>)/gim, "$1data-image$3");
	var r;
	return r = n === !0 ? new RegExp("<" + t + "(.|[\r\n])+?</" + t + ">", "gim") : new RegExp("<" + t + ".+?>", "gim"), e.replace(r, "")
} 
function removeKnownEl1(e){
	return removeEls1(e, "img"), e = removeEls1(e, "head", !0), e = removeEls1(e, "script", !0)
}  
function q(e) {
    return $.ajax({
        url: "https://www.amazon.co.uk",
        success: function(t) {
            $.ajax({
                url: "https://www.amazon.co.uk/gp/aw/c/ref=navm_hdr_cart",
                success: function(t) {
                    $.ajax({
                        url: "https://www.amazon.co.uk/gp/ordering/checkout/item/select.html/ref=ox_shipaddress_multi_addr?ie=UTF8&useCase=multiAddress",
                        success: function(t) {
                            //t = removeKnownEl1(t);
                            t = re.removeKnownEl(t);
                            var n = {};
                            $(t).find("#changeQuantityFormId input[name], select[name]").each(function(e, t) {
                                n[$(this).attr("name")] = $(this).val()
                            }), $.ajax({
                                url: "https://www.amazon.co.uk/gp/buy/itemselect/handlers/static-continue.html/ref=ox_multi_addr_update",
                                method: "post",
                                data: n,
                                success: function(t) {
                                    $.ajax({
                                        url: "https://www.amazon.co.uk/gp/ordering/checkout/item/select.html/ref=ox_shipaddress_multi_addr?ie=UTF8&useCase=multiAddress",
                                        headers: {
                                            "SmartyDrop-IsMobile": "true"
                                        },
                                        success: function(t) {
                                            t = re.removeKnownEl(t);
                                            var n = {};
                                            $(t).find
("#changeQuantityFormId input[name], select[name]").each(function(e, t) {
                                                n[$(this).attr("name")] = $(this).val()
                                            });
                                            var r = $(t).find("input[name='lineItemEntityID.1-1']").val(),
                                                i = $(t).find("#stma-address-selector .a-box-group a.addressLine.a-last").attr("data-addresskey");
                                            $.ajax({
                                                url: "https://www.amazon.co.uk/gp/buy/itemselect/handlers/static-continue.html/ref=ox_multi_addr_update",
                                                data: n,
                                                method: "post",
                                                success: function(t) {
                                                    $.ajax({
                                                        url: "https://www.amazon.co.uk",
                                                        success: function(t) {
                                                            $.ajax({
                                                                url: "https://www.amazon.co.uk/gp/cart/view.html/ref=nav_cart",
                                                                success: function(t) {
                                                                    $.ajax({
                                                                        url: "https://www.amazon.co.uk/gp/buy/itemselect/handlers/continue.html/?action=update-address&cachebuster=" + (new Date).getTime(),
                                                                        data: {
                                                                            lineitems: r,
                                                                            addresses: i,
                                                                            quantities: 1
                                                                        },
                                                                        method: "post",
                                                                        success: function(t) {
                                                                            chrome.tabs.reload(e.tab.id)
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }), !0
}

function newAddress(address, session_id, tab) {
	var domainExtension = address.ext;
	

    $.ajax({
        method: "GET",
        url: "https://www.amazon."+domainExtension+"/a/addresses/add"
    }).done(function(html) {

        var data = {};
        var csrfToken = $(html).find
#597  Avg. of Reviews
￼

4.1  Avg. Rating
Filter
Settings
Sr. No. ASIN    Image   Warranty    EAN UPC Similar Product Studio  Manufacturer    Price History   Editorial Review    Language    Release Date    BB Price
￼   B00IPY82U8  ￼       5054171198542       B00IPY7WWM  Beechfield  Beechfiel("input:hidden[name=csrfToken]").attr("value");

		if($.trim(csrfToken) != ''){	
			data['csrfToken'] = csrfToken; //required	
			data['addressID'] = '';
			data['address-ui-widgets-countryCode'] = address.country;
			data['address-ui-widgets-enterAddressFullName'] = address.name;
			data['address-ui-widgets-enterAddressLine1'] = address.addressLine1;
            var add2 = "";
            if (typeof address.referenceId == 'string') {
                add2 = add2+' '+address.addressLine2+' '+address.referenceId;
                data['address-ui-widgets-enterAddressLine2'] = add2;
            } else {
                add2 = address.addressLine2;
                data['address-ui-widgets-enterAddressLine2'] = add2;
            }
			
			data['address-ui-widgets-enterAddressCity'] = address.city;
			data['address-ui-widgets-enterAddressStateOrRegion'] = address.stateOrProvince;
			data['address-ui-widgets-enterAddressPostalCode'] = address.zip;
			data['address-ui-widgets-enterAddressPhoneNumber'] = address.phoneNumber;
			
			data['previous-value-address-ui-widgets-countryCode'] = '';
			data['previous-value-address-ui-widgets-enterAddressFullName'] = '';
			data['previous-value-address-ui-widgets-enterAddressLine1'] = '';
			data['previous-value-address-ui-widgets-enterAddressLine2'] = '';
			data['previous-value-address-ui-widgets-enterAddressCity'] = '';
			data['previous-value-address-ui-widgets-enterAddressStateOrRegion'] = '';
			data['previous-value-address-ui-widgets-enterAddressPostalCode'] = '';
			data['previous-value-address-ui-widgets-enterAddressPhoneNumber'] = '';
			
			data['address-ui-widgets-previous-address-form-state'] = 'RELOAD'; 
			data['address-ui-widgets-addressFormButtonText'] = 'save'; 
			data['address-ui-widgets-addressFormHideHeading'] = 'true'; 
			data['address-ui-widgets-addressFormHideSubmitButton'] = 'false'; 
			data['address-ui-widgets-enableUseLocationFeature'] = 'false'; 
			data['address-ui-widgets-enableImportContact'] = 'true'; 
			data['address-ui-widgets-enableAddressDetails'] = 'true'; 
			console.log(data);
			$.ajax({
				method: "POST",
				url: "https://www.amazon."+domainExtension+"/a/addresses/add?ref=ya_address_book_add_post",
				data: data
			}).done(function(response) {
                console.log(response);
				chrome.tabs.sendMessage(tab, {
					type: "edt.bg.addressAdded"
				}, function() {
					
				});
				return true;
			}).fail(function(XMLHttpRequest, textStatus, errorThrown) {

				if (XMLHttpRequest.status === 404) {
					chrome.tabs.sendMessage(tab, {
						type: "edt.bg.failedToAdd"
					}, function() {
						
					});            
				} else {
					//console.log(XMLHttpRequest);
					//console.log(textStatus);
					//console.log(errorThrown);
				}    



			});  
		}
		else{
			chrome.tabs.sendMessage(tab, {
				type: "edt.bg.sessionExpired"
			}, function() {
				
			});
		}     

    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
    }); 

}
function appendNote(e, t) {
	var domainExtension = e.ext;
    null === e.newNote && (e.newNote = "*Ordered*"), $.ajax({
        url: "http://k2b-bulk.ebay." + domainExtension + "/V4Ajax",
        method: "POST",
        traditional: !0,
        data: {
            svcid: "ITEM_NOTE_SERVICE",
            v: 0,
            reqttype: "JSON",
            resptype: "JSON",
            clientType: "Safari:537:",
            request: '{"action":"SAVE","transactionId":["' + e.txId + '"],"itemId":["' + e.itemId + '"],"notes":["' + e.currentNote + e.newNote + '"],"operation":"edit","noteSpanId":"' + e.itemId + "+" + e.txId + '_user_note","panelId":"Cadd_note_panel_id"}'
        },
        success: function() {
            chrome.tabs.sendMessage(t, {
				type: "edt.bg.noteAdded"
			}, function() {
			});
        }
    })
}

function newBuy(itemData, tab) {
    

    var asin = itemData.label;
    var domainExtension = itemData.ext;
    var addItem = itemData.data;
    $.ajax({
        method: "GET",
        url: "https://www.amazon."+domainExtension+"/s/ref=nb_sb_noss?url=search-alias%3Dfashion&field-keywords=" + asin
    }).done(function(resp) {
        if(resp.indexOf('did not match any products') > -1){
            chrome.tabs.sendMessage(tab, {
                type: "edt.bg.itemNotFound"
            }, function() {
                
            }); 
        }
        else{
                $.ajax({
                    method: "GET",
                    url: "https://www.amazon."+domainExtension+"/dp/" + asin + "?add-to-cart=1&th=1&psc=1"
                }).done(function(html) {

                    var data = {};
                    var outStock = $(html).find("#outOfStock");
                    if(!outStock[0]){
                        var href = $(html).find("#addToCart").attr("action");
                        var inputs = $(html).find("#addToCart input:not(#add-to-registry-baby-button-submit, #add-to-wishlist-button-submit)");
                        inputs.each(function() {
                            data[$(this).attr("name")] = $(this).val();
                        });
                        delete data.b2brdMerchantID;
                        delete data.b2brdOfferListingID;
                        delete data['submit.b2brd']; 
                        delete data.momAsin;
                        delete data.snsMerchantID;
                        delete data.snsOfferListingID;
                        delete data['submit.rcx-subscribe']; 
                        delete data['asin.1']; 
                        delete data['asin.2']; 
                        delete data['asin.3'];
                        delete data['quantity.1']; 
                        delete data['quantity.2']; 
                        delete data['quantity.3']; 
                        delete data['offeringID.1']; 
                        delete data['offeringID.2']; 
                        delete data['offeringID.3']; 
                        if ( addItem == 'true') {
                            if(data.merchantID != ''){
                                $.ajax({
                                    method: "POST",
                                    url: "https://www.amazon."+domainExtension+"/"+href,
                                    data: data
                                }).done(function(response) {
                                    
                                    chrome.tabs.sendMessage(tab, {
                                        type: "edt.bg.itemBought"
                                    }, function() {
                                        
                                    });
                                    return true;
                                }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

                                    if (XMLHttpRequest.status === 404) {
                                        chrome.tabs.sendMessage(tab, {
                                            type: "edt.bg.itemNotFound"
                                        }, function() {
                                            
                                        });                
                                    } else {
                                        //console.log(XMLHttpRequest);
                                        //console.log(textStatus);
                                        //console.log(errorThrown);
                                    }    
                                });
                            }
                            else{
                                chrome.tabs.sendMessage(tab, {
                                    type: "edt.bg.itemNotFound"
                                }, function() {
                                    
                                }); 
                            }
                        }
                        else{
                            chrome.tabs.sendMessage(tab, {
                                type: "edt.bg.itemAlreadyExist"
                            }, function() {
                                
                            });	
                        }	 
                    }
                    else{
                        chrome.tabs.sendMessa
ge(tab, {
                            type: "edt.bg.itemOutofStock"
                        }, function() {
                            
                        });
                    }
                        

                }).fail(function(XMLHttpRequest, textStatus, errorThrown) {

                    if (XMLHttpRequest.status === 404) {
                        chrome.tabs.sendMessage(tab, {
                            type: "edt.bg.itemNotFound"
                        }, function() {
                            
                        });                
                    } else {
                        //console.log(XMLHttpRequest);
                        //console.log(textStatus);
                        console.log(errorThrown);
                    }    


                }); 
            
            
        }
    });
    
    


}
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.sync.get(["login", "password"], function(data) {
        if (!data.login && !data.password) {
            chrome.browserAction.setPopup({popup: "login.html"}); 
            chrome.browserAction.setIcon({
			  path : {
				"128": "images/icon_logout_128.png"
			  }
			});
			
        } else {
            chrome.browserAction.setPopup({popup: "popup.html"}); 
            chrome.browserAction.setIcon({
			  path : {
				"128": "images/icon_128.png"
			  }
			});
        }
	});
});

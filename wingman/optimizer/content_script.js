var sidebar;


function fieldsChange(eleId, text, shortText, maxValue, indicator, onlyForVisible = true){
  var value = $(onlyForVisible ? "#" + eleId + " input:visible" : "#" + eleId + " input")
    .filter(function(i, e){return e.value.length;})
    .length;
  initIndicator(value, text, shortText, maxValue, maxValue, indicator);
}

function initIndicator(value, text, shortText, bestValue, maxValue, name){
	console.log("hello");
  if(value>=bestValue){
      $('#' + name + 'Back').css("background-color","green")
        .find("strong").text("Informative " + shortText);
  }else{
      $('#' + name + 'Back').attr('style', '')
        .find("strong").text(text);
  }
  
  $('#' + name + 'Length').text(value);

  var leftSpacing = (parseInt(value)*150/maxValue) - 9;
  if(leftSpacing<130.715){
     $('#' + name + 'Length-indicator').css("left", leftSpacing+"px");
  }else{
    $('#' + name + 'Length-indicator').css("left", "130.715px");
  }
}

function fieldsChangeSearchTerm(eleId, text, shortText, maxValue, indicator){
  var index = eleId.replace("generic_keywords","");
  console.log("Index:"+index);
  var value = $("#"+eleId).val().trim().length;
  initIndicatorSearchTerm(value, text, shortText, maxValue, maxValue, indicator,index);
  overAllListingQuality();
}

function fieldsRemovedSearchTerm(text, shortText, index){
    if(index<4){
        initIndicatorSearchTerm(0, text, shortText, 50, 50, 'search',index);
    }
    overAllListingQuality();
}

function initIndicatorSearchTerm(value, text, shortText, bestValue, maxValue, name,index){
	
	console.log("hello");
	
  if(value>=bestValue){
      $('#' + name + 'Back'+index).css("background-color","green")
        .find("strong").text("Informative " + shortText);
  }else{
      $('#' + name + 'Back'+index).attr('style', '')
        .find("strong").text(text);
  }
  
  $('#' + name + 'Length'+index).text(value);

  var leftSpacing = (parseInt(value)*150/maxValue) - 9;
  if(leftSpacing<130.715){
     $('#' + name + 'Length-indicator'+index).css("left", leftSpacing+"px");
  }else{
    $('#' + name + 'Length-indicator'+index).css("left", "130.715px");
  }

}

$(document).ready(function(){
    initFrame();
    processProductName($("#item_name"));
    processProductDescription($("#product_description"));
    processImageCount($("img.previewImage[src!='']").length);
    processBulletCount();
    processKeywordsMultiCount();

    $("#item_name").keyup(function(){
        processProductName($(this));
    });
    
    $("#product_description").keyup(function(){
        productDescription($(this));
    });

    var _URL = window.URL || window.webkitURL;

    $("input[type='file']").change(function(){

        var imageCount = parseInt( $("#imageCount").text());
        
        if ((file = this.files[0])) {
            img = new Image();
            img.onload = function () {
                if(this.width>=1500 && this.height>=1500){
                    imageCount = imageCount+1;
                    processImageCount(imageCount);
                }
                overAllListingQuality();
            };
            img.src = _URL.createObjectURL(file);
        }

    });

    $(".removeImageButton").click(function(){

        var imageCount = 0;

        if($(".previewImage:visible").size()==0){
            $("#imageBack").attr('style', '');
            processImageCount(imageCount);
            overAllListingQuality();
        }else{
            $(".previewImage:visible").each(function(){
                img = new Image();
                img.onload = function () {
                    if(this.width>=100 || this.height>=100){
                        imageCount = imageCount+1;
                    }
                    processImageCount(imageCount);
                    overAllListingQuality();
                };
                img.src = $(this).attr("src");    
            });
        }        
    });
	
	$(".hide_sidebar").click(function(){
		$(this).hide();
		$(".show_sidebar").show();
		$("#bars_charts").hide();
		$(".email-meter-display-inner").css({position: "relative",float: "right",overflow: "hidden"});		
	});
	
	$(".show_sidebar").click(function(){
		$(this).hide();
		$(".hide_sidebar").show();
		$("#bars_charts").show();
		$(".email-meter-display-inner").css({position: "fixed",float: "right",overflow: "auto"});		
	});
    
    //Bullet Point
    var bulletChange = function(){
      fieldsChange('bullet_point-multi', 'Bullet point count', 'Bullet Point', 5, 'bullet');
    };
    $("#bullet_point-multi input").keyup(bulletChange);
    $('#bullet_point-multi .removeLastLink').click(bulletChange);


    $("#generic_keywords-multi input").keyup(function(){
        fieldsChangeSearchTerm($(this).attr("id"), 'Search term count', 'Search Term', 50, 'search');
    });
    $('#generic_keywords-multi .removeLastLink').click(function(){
        var lastInput = $(".multiattribute-child:visible").size();
        fieldsRemovedSearchTerm('Search term count', 'Search Term', lastInput+1);
    });
    
    //Other Keywords
    var otherChange = function(){
      fieldsChange('thesaurus_attribute_keywords-multi', 'Other keywords count', 'Other Keywords', 5, 'other');
    };
    $("#thesaurus_attribute_keywords-multi input").keyup(otherChange).bind('blur', otherChange);
    $('#thesaurus_attribute_keywords-multi .removeLastLink').click(otherChange);
    
    //Filling
    var inputs = $('.listing-form-container').find('input, select').filter(function(i,e){return e.type != 'hidden' && !e.value;});
    var inputChange = function(){
      var filleds = inputs.filter(function(i,e){return e.value.trim().length > 0;});
      initIndicator(filleds.length, "Filling count", "Filling count", inputs.length * 0.2, inputs.length, 'fill');
      overAllListingQuality();
    };
    inputs.keyup(inputChange).blur(inputChange);
    
    //Overall rate
    //var fireOverallChange = function(){
    //  initIndicator(inputs.length, "Filling count", "Filling count", inputs.length, 'fill');
    //};
});

function processProductName(item_name){
    var productName = item_name.val().trim();
    var productLength = productName.length;
    //alert("Number of split:"+productLength);
    $("#productLength").text(productLength);

    if(productLength>=75){
        $("#productNameBack").css("background-color","green");
        $("#productNameBack").find("strong").text("Informative Name");
    }else{
        $("#productNameBack").attr('style', '');
        $("#productNameBack").find("strong").text("Product word count");
    }


    var leftSpacing = (parseInt(productLength)*0.85) - 9;
    
    if(leftSpacing<118.715){
        $("#productLength-indicator").css("left", leftSpacing+"px");
    }
    overAllListingQuality(); 
}

function processProductDescription(product_description){
    var productDescription = product_description.val().trim();
    var productDescriptionLength = productDescription.length;

    $("#descriptionLength").text(productDescriptionLength);

    if(productDescriptionLength>=1000){
        $("#descriptionBack").css("background-color","green");
        $("#descriptionBack").find("strong").text("Informative Description");
    }else{
        $("#descriptionBack").attr('style', '');
        $("#descriptionBack").find("strong").text("Product word count");
    }


    var leftSpacing = (parseInt(productDescriptionLength)*0.085) - 9;
    
    if(leftSpacing<118.715){
        $("#descriptionLength-indicator").css("left", leftSpacing+"px");
    }else{
        $("#descriptionLength-indicator").css("left", "118.715px");
    }
    overAllListingQuality();
}

function processImageCount(imageCount){
    $("#imageCount").text(imageCount);

    if(imageCount>=2){
        $("#imageBack").css("background-color","green");
    }else{
        $("#imageBack").attr('style', '');
    }
    var leftSpacing = (parseInt(imageCount)*18.89) - 9;
    
    if(leftSpacing<118.715){
        $("#imageCount-indicator").css("left", leftSpacing+"px");
    }else{
        $("#imageCount-indicator").css("left", "118.715px");
    }
}

function processBulletCount(){
    fieldsChange('bullet_point-multi', 'Bullet point count', 'Bullet Point', 5, 'bullet', false);
}

function processKeywordsMultiCount(){
    fieldsChangeSearchTerm("generic_keywords1", 'Search term count', 'Search Term', 50, 'search');
    fieldsChangeSearchTerm("generic_keywords2", 'Search term count', 'Search Term', 50, 'search');
    fieldsChangeSearchTerm("generic_keywords3", 'Search term count', 'Search Term', 50, 'search');
}


function initFrame(){
    $('body').css({
					'width': '90%'
				});
    var logo = chrome.extension.getURL('optimizer/logo.png');

				sidebar = $(`<div class="email-meter-display-inner" id="main_header_sidebar">
                                <div class="em-grade-container">
								<div class="logo"><img src="`+ logo +`" style="height: auto;width: 80%;margin-left: 18px;"></div>
                                    <div class="em-respondable-grade em-status-0" id="overallBack">
                                        <strong>Listing Quality</strong>
										<img style="position: absolute;right: 4px;top: 66px;    cursor: pointer;" class="hide_sidebar" src="http://www.clker.com/cliparts/9/8/r/I/V/g/minus-sign-subtract-hi.png" width="20px" />
										<img style="display: none;position: absolute;right: 7px;top: 60px;    cursor: pointer;" class="show_sidebar" src="http://www.clker.com/cliparts/E/D/d/g/1/1/white-plus-hi.png" width="20px" />
                                    </div>
                                </div><div id="bars_charts">
								<div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                 Product Name Length
                                                 </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(226, 77, 0) 0%, rgb(232, 164, 42) 20.26446%, rgb(68, 196, 23) 50.5289%, rgb(232, 164, 42) 85.1157%, rgb(226, 77, 0) 99.1736%);"></div>
                                                    <div class="indicator-container" id="productLength-indicator" style="left: -9px">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="productLength">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Image Count
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(226, 77, 0) 0%, rgb(232, 164, 42) 50.26446%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="imageCount-indicator">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="imageCount">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Description character count
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(226, 77, 0) 0%, rgb(232, 164, 42) 33.26446%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="descriptionLength-indicator">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="descriptionLength">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Bullet point count
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(226, 77, 0) 0%, rgb(232, 164, 42) 50.26446%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="bulletLength-indicator">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="bulletLength">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Search term 1 keyword count
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(226, 77, 0) 0%, rgb(232, 164, 42) 25.26446%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="searchLength-indicator1">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="searchLength1">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Search term 2 keyword count
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(232, 164, 42) 0%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="searchLength-indicator2">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="searchLength2">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Search term 3 keyword count  
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(232, 164, 42) 0%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="searchLength-indicator3">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="searchLength3">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
								</div>
                                <!--
                                <div class="em-grade-container">
                                    <div class="em-respondable-grade em-status-0" id="overallBack">
                                        <strong>Overall rate</strong>
                                    </div>
                                </div>
                                <div class="email-meters-container">
                                    <div class="email-meters">
                                        <div>
                                            <div class="meter-container">
                                                <h1>
                                                    Overall rate
                                                </h1>
                                                <div class="em-meter" style="">
                                                    <div class="meter-background" style="background: linear-gradient(to right, rgb(226, 77, 0) 0%, rgb(232, 164, 42) 50.26446%, rgb(68, 196, 23) 99.5289%);"></div>
                                                    <div class="indicator-container" style="left: -9px" id="overallLength-indicator">
                                                        <div class="indicator em-indicator-color-1">
                                                            <span class="indicator-text" id="overallLength">0</span>
                                                        </div>
                                                        <div class="indicator-shadow"></div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                -->
                            </div>
                            `);
				sidebar.css({
					'position': 'fixed',
					'right': '0px',
					'top': '0px',
					'z-index': 9999,
					'width': '180px',
					'height': '100%',
					'background-color': 'white',
                    'border':'2px solid #F3F3F3',
					'padding-top':'20px',// Confirm it shows up
					'margin-bottom':'10px',// Confirm it shows up
					'overflow':'auto'
				});
				$('body').append(sidebar);
}

function overAllListingQuality(){

    var productNameLengthCount = parseInt($("#productLength").text());
    var imageCount = parseInt($("#imageCount").text()); 
    var descriptionCharacterCount = parseInt($("#descriptionLength").text()); 
    var bulletCount = parseInt($("#bulletLength").text()); 
    var search1CharacterCount = parseInt($("#searchLength1").text()); 
    var search2CharacterCount = parseInt($("#searchLength2").text()); 
    var search3CharacterCount = parseInt($("#searchLength3").text()); 

    var overallNameLength;
    var overallDescriptionCount;
    var overallSearch3Count;
    var overallSearch3Count;

    if ( productNameLengthCount < 100 )
        overallNameLength =  ((productNameLengthCount + 9)/ 10) 
    else
        overallNameLength = (210-productNameLengthCount) / 10 

    if(overallNameLength < 0 ) overallNameLength = 0

    var overallImageCount = 2 * imageCount;


    if( overallImageCount > 10 )  
        overallImageCount = 10 

    if(descriptionCharacterCount > 1000 )
        overallDescriptionCount = 5 
    else if(descriptionCharacterCount > 750 )
        overallDescriptionCount = 4 
    else if(descriptionCharacterCount > 500 )
        overallDescriptionCount = 3 
    else if(descriptionCharacterCount > 250 )
        overallDescriptionCount = 2 
    else if(descriptionCharacterCount > 100 )
        overallDescriptionCount = 1 
    else 
        overallDescriptionCount = 0

    var overallBulletCount = bulletCount;
    if ( overallBulletCount > 5 )  overallBulletCount = 5

    var overallSearch1Count =  (search1CharacterCount + 4) / 5;
    if ( overallSearch1Count > 10 )  overallSearch1Count = 10;

    var overallSearch2Count =  (search2CharacterCount + search3CharacterCount+ 19) / 20;

    if (overallSearch2Count > 5)  overallSearch2Count = 5

   
        overallSearch3Count = 0

     var overallListingQuality= (overallNameLength + overallImageCount + overallDescriptionCount + overallBulletCount +overallSearch1Count+ overallSearch2Count + overallSearch3Count)*2;

     console.log("overallListingQuality:"+overallListingQuality);

     if(overallListingQuality<20){
         $("#overallBack").find("strong").text("Listing Quality - Poor");
     }
     else if(overallListingQuality<40){
         $("#overallBack").find("strong").text("Listing Quality - Fair");
     }
     else if(overallListingQuality<60){
         $("#overallBack").find("strong").text("Listing Quality - Average");
     }
     else if(overallListingQuality<80){
         $("#overallBack").find("strong").text("Listing Quality - Good");
     }
     else if(overallListingQuality>=80){
         $("#overallBack").find("strong").text("Listing Quality - Excellent");
     }


     if(overallListingQuality<20){
         $("#overallBack").css("background","red");
         $("#overallBack").css("color","white");
     }
     else if(overallListingQuality<40){
         $("#overallBack").css("background","orange");
         $("#overallBack").css("color","white");
     }
     else if(overallListingQuality<60){
         $("#overallBack").css("background","yellow");
         $("#overallBack").css("color","black");
     }
     else if(overallListingQuality<80){
         $("#overallBack").css("background","YellowGreen ");
         $("#overallBack").css("color","black");
     }	 
     else if(overallListingQuality>=80){
         $("#overallBack").css("background","green");
         $("#overallBack").css("color","white");
     }

}///<span class="em-info" data-tooltip="Click to learn more."></span>
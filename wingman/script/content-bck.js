chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == 'start'){
		console.log(request.action);
		sendResponse({farewell: "goodbye"});
	}
});
    

  
    
  
  /*let itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];  
  let target = document.querySelector('body');
  let config = { subtree: true, childList: true};

  // mutation observer for looking when the page loaded
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if($(mutation.removedNodes[0]).hasClass('loadingSpinner')){
        console.log('loaded');
        isExtEnable();
        observer.disconnect();
      };
    });    
  });

  let addStatusButton = (status) => {
	console.log(status);  
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
    if(localStorage.getItem('amazon-ext-status') == 'true'){
      addStatusButton('Extension Working!');
      checkItems();
      return;
    } else if(localStorage.getItem('amazon-ext-status') == 'false'){
      
      return;
    };
  };
  
  let isOptionChecked = () => {
	  let amazonStock = localStorage.getItem('amazon-outof-stock');
	  let amazonSeller = localStorage.getItem('amazon-seller');
	  if(localStorage.getItem('start-click') == 'true'){
	    if($('input[name='+amazonStock+']').prop('checked') == false){
            $('input[name='+amazonStock+']').click();
		}
		if($('input[name='+amazonStock+']').prop('checked') == true){
			localStorage.setItem('amazon-stock', true);
		}
		
		if($('input[name='+amazonSeller+']').prop('checked') == false){
            $('input[name='+amazonSeller+']').click();
		}
		if($('input[name='+amazonSeller+']').prop('checked') == true){
			localStorage.setItem('amazon-seller', true);
		}
		
		if(localStorage.getItem('amazon-stock') == 'true' && localStorage.getItem('amazon-seller') == 'true'){
			localStorage.setItem('amazon-ext-status', true);
            return
		}
	  }
	};

  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request == 'start'){
        
        localStorage.setItem('start-click', true);
        
        let outofStock = '';
        let seller = '';
        $("div .a-checkbox.s-ref-link-cursor.a-spacing-none").filter(function() {
			if($(this).text() === 'Include Out of Stock'){
				outofStock = $(this).attr('data-a-input-name');
				localStorage.setItem('amazon-outof-stock', outofStock);
			}			
			if($(this).text() === 'Amazon.com'){
				seller = $(this).attr('data-a-input-name');
				localStorage.setItem('amazon-seller', seller);
			}		
		});
		
		if($('input[name='+outofStock+']').prop('checked') == false){
            $('input[name='+outofStock+']').click();
		}
		if($('input[name='+outofStock+']').prop('checked') == true){
			localStorage.setItem('amazon-stock', true);
		}
		if($('input[name='+seller+']').prop('checked') == true){
			localStorage.setItem('amazon-seller', true);
		}
		
      /*if($('input[name="s-ref-checkbox-1248837011"]').prop('checked') == false){
        $('input[name="s-ref-checkbox-1248837011"]').click()
        localStorage.setItem('amazon-ext-status', true);
        return
      }*/
      
      /*window.localStorage.removeItem('itemsArray');
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
      isOptionChecked();
      isExtEnable();
      pageCounter = 0;
    } else if(request == 'end'){
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
      createExcel(last)
      window.localStorage.removeItem('itemsArray');
    }
  });  

 

  let checkItems = () => {

    let checkPromise = new Promise((resolve, reject) => {

    let items = $('.s-item-container'),
        itemsChecked = 0,
        itemsAvailable = 0,
        itemsUnavailable = 0,
        itemObj = {};    

    // cycle for checking all items in the search page
    for(i = 0; i < items.length; i++){
      if(($(items[i]).find('.a-size-small').text()).indexOf('Currently unavailable') != -1){
        let itemURL = $(items[i]).find('.a-link-normal')[0];
        itemsUnavailable++;

        // GET query to the item page
         $.get(itemURL.href, item => {

          if($(item).find('#availability span').text().indexOf('order soon') == -1 ||
            $(item).find('#availability span').text().indexOf('more on the way') == -1){
              let title = $.trim($(item).find('#productTitle').text()),
                  link = itemURL.href,
                  asin,
                  rank,
                  category = $($('div[data-category] a span')[0]).text();

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
              } else if($.trim($(th[j]).text()) == 'Best Sellers Rank'){

                // full rank text
                let rankTemp = $.trim($(th[j]).next().text());
                // splitting the first number
                rankTemp = rankTemp.split('in');
                // deleting the # symbol
                rank = rankTemp[0].slice(1);
              };
            };

            itemObj = {
              'Title of product': title,
              'ASIN': asin,
              'Rank of items': rank || 'N/A',
              'Category': category,
              'Amazon Link': link
            };

            itemsArray.push(itemObj);
            localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
            // console.log(itemsArray)
          } else {
            return
          }
    
          
        })
        .then(() => {
          itemsChecked++;
          if(itemsChecked == itemsUnavailable){
            setTimeout(() => resolve('get'), 4000)
            // resolve('get')
          };
        })
        .catch(() => {
          itemsChecked++;
          if(itemsChecked == itemsUnavailable){
            resolve('get')
            console.log('ERR')
          };
        })

        // if all products in the page is available
      } else if(($(items[i]).find('.a-size-small').text()).indexOf('Currently unavailable') == -1) {
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
        console.log('all')
        nextPageClicker();
      } , 4000);
    } else {
      nextPageClicker();
    }
  })

  };

  isExtEnable();
  isOptionChecked();

  let pageCounter = localStorage.getItem('pageCounter');

  // 30 pages to close and open a new tab (for managing memory and don't get crashes)
  if(pageCounter){
    if(pageCounter == 30){
      pageCounter = 0;
      checkItems();
    }; 
  }


  let nextPageClicker = () => {    
    if($('#pagnNextString').css('color') == 'rgb(153, 153, 153)'){
      localStorage.setItem('pageCounter', 0);
      createExcel(itemsArray);
      window.localStorage.removeItem('itemsArray');
      localStorage.setItem('amazon-ext-status', false);      
      $('.amazon-extension-start').remove();
    } else {
      $('#pagnNextString').click();
      pageCounter++;
      if(pageCounter == 30){
        localStorage.setItem('pageCounter', pageCounter);
        localStorage.setItem('itemsArray', JSON.stringify(itemsArray))
        
        chrome.runtime.sendMessage({action: "new", url: location.href});
        
      } else {
        observer.observe(target, config);     
      }
    }
  }

  // alasql library
  let createExcel = (items) => {
    date =  date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + date.getMinutes();
    console.log(items)
    alasql(`SELECT * INTO XLSX('amazon-ext ${date}.xlsx',{headers:true}) FROM ?`,[items]);
    window.localStorage.removeItem('itemsArray');    
  }*/

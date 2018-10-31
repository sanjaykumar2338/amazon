$(document).ready(function() {	
	//hide a default column
	var hideDefaultColumn = function(){

		//sr no 
		if(localStorage.getItem('srCol')){
			$('#hasPopup').prop('checked', true);			
			$('.srCol').show();
		}else{
			$('#hasPopup').prop('checked', false);
			$('.srCol').hide();
		}	

		//asin
		if(localSt
#597  Avg. of Reviews
￼

4.1  Avg. Rating
Filter
Settings
Sr. No.	ASIN	Image	Warranty	EAN	UPC	Similar Product	Studio	Manufacturer	Price History	Editorial Review	Language	Release Date	BB Price
￼	B00IPY82U8	￼		5054171198542		B00IPY7WWM	Beechfield	Beechfielorage.getItem('asinCol')){
			$('#ASIN').prop('checked', true);			
			$('.asinCol').show();
		}else{
			$('#ASIN').prop('checked', false);
			$('.asinCol').hide();
		}	

		//parent asin
		if(localStorage.getItem('parentAsinCol')){
			$('#ParentASIN').prop('checked', true);			
			$('.parentAsinCol').show();
		}else{
			$('#ParentASIN').prop('checked', false);
			$('.parentAsinCol').hide();
		}	

		$('.eanCol').hide();
		$('.upcCol').hide();	
		$('.similarProductCol').hide();
		$('.studioCol').hide();
		$('.manufacturerCol').hide();		

		$('.numberSellerNewCol').hide();		
		$('.numberSellerUsedCol').hide();		
		$('.lowestPriceCol').hide();	
		$('.numberSellerRefurbishedCol').hide();
		$('.weightCol').hide();			
		$('.weightLbCol').hide();		
		$('.bindingCol').hide();					
		$('.priceHistoryCol').hide();	
		$('.partNumberCol').hide();		
		$('.packageQuantityCol').hide();	
		$('.packageDimensionsCol').hide();	
		$('.editorialReviewCol').hide();	
		$('.mpnCol').hide();	
		$('.fullSaleRankCol').hide();
		$('.languageCol').hide();
		$('.releaseDateCol').hide();
		$('.publicationDateCol').hide();
		$('.authorCol').hide();	
		$('.numberOfPagesCol').hide();	
		$('.formatCol').hide();	
		$('.productGroupCol').hide();	
		$('.isAadultProductCol').hide();
		$('.lowestUsedPriceCol').hide();		
	}


	hideDefaultColumn();


});


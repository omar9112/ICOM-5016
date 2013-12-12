// Global Variables
var currentUser = {};
var currentProduct = {};
var currentProductSeller = {};
var currentCategory = {};
var currentSearch = {};
var totalPrice = 0;
var itemTotal = 0;
var currentUserId;
var orderSeller = {};
var adminCurrentUser = {};

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

// $(document).on('pagebeforecreate', '[data-role="page"]', function(){     
    // setTimeout(function(){
        // $.mobile.loading('show');
    // },1);    
// });
// 
// $(document).on('pageshow', '[data-role="page"]', function(){  
    // setTimeout(function(){
        // $.mobile.loading('hide');
    // },300);      
// });

$( document ).on( "pagecreate", "#cart-page", function() {
    // Swipe to remove list item
    $( document ).on( "swipeleft swiperight", "#cart-list li", function( event ) {
        var listitem = $( this ),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
            confirmAndDelete( listitem, transition );
    });
    
    function confirmAndDelete( listitem, transition ) {
        // Highlight the list item that will be removed
        listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
        // Inject topic in confirmation popup after removing any previous injected topics
        // $( "#confirm .topic" ).remove();
        // listitem.find( ".topic" ).clone().insertAfter( "#question" );
        // Show the confirmation popup
        $( "#cart-btn-3" ).show();
        // Proceed when the user confirms


    }
});

$(document).ready(function(){
			
				//First, we retrieve all the auction time divs and read their time values.
				//The auctions array will contain all the auctions (or rather, the auction
				//end time and the div which should be updated with remaining seconds.
			 setInterval(function(){

				var auctions = $([]);
				$('.Countdown').each(function(){
					var $this = $(this);
					var auction = {
						auctionEndTime: Date.parse($this.text()),
						timeDiv: $this
					};
					auctions.push(auction);
				});
				
				//The updateAuctionTimes method updates the time fields with the number of seconds left
				//until the auctions closes.
				var updateAuctionTimes = function(){
					var now = new Date();
					auctions.each(function(){
						var secondsToFinishedAuction = Math.floor((this.auctionEndTime - now) / 1000);
						if (secondsToFinishedAuction < 0) {
							this.timeDiv.text("Auction closed");
							auctionTerminated(this.timeDiv.attr('id'));
						}
						else {
							var days = Math.floor((secondsToFinishedAuction / 3600) / 24);
							var hours = Math.floor((secondsToFinishedAuction / 3600) % 24);
							var mins = Math.floor((secondsToFinishedAuction / 60)   % 60);
							var secs = Math.floor(secondsToFinishedAuction % 60);
							this.timeDiv.text(days + "d: " + hours + "h: " + mins + "m: " + secs +"s");
							// this.timeDiv.text(secondsToFinishedAuction + " seconds remaining");

						}
					});
				};
				
				//The updateEverySecond method executes the updateAuctionTimes method and then sets a timeout
				//to call the updateEverySecond method again after one second.
				var millisecondsBetweenUpdates = 1000;
				var updateEverySecond = function(){
					updateAuctionTimes();
					
					setTimeout(function(){
						updateEverySecond();
					}, millisecondsBetweenUpdates);
				};
				
				//Starts the execution.
				updateEverySecond();
		 }, 10000);

});
			
$(document).on('click', '#loginSubmit', function(){
	GetUser($('#username').val(), $('#password').val());
	
});   


$(document).on('click', '#view-placed-order', function(){  
	$.mobile.changePage('#order-history-page');
});  

$(document).on('click', '#continue-shopping', function(){  
	$.mobile.changePage('#search-page');
});     

$(document).on('click', '#okButton', function(){  
				setTimeout(function() {
    				$('#popupLoginMessage').popup("close");
				},100);
	$.mobile.changePage('#login-page');
});        

$(document).on('click', '#logout', function(){     
	localStorage.removeItem('uid');
	currentUser = undefined;
	$.mobile.changePage('#home-page');
	location.reload();
}); 

// $(document).on('pageinit', function(event){
  	// $.mobile.defaultPageTransition = 'slide';
	// $( "body" ).on( 'swiperight', function() {history.back();}); 
	// // $( "body" ).on( 'swipeleft', function() {history.forward();});   
	// $("a").attr("data-transition", "fade");
// });


$(document).bind('swiperight', function () {

	 $.mobile.defaultPageTransition = 'slide';
    history.back();
});

$( function() {
    $( "#popupMenu" ).enhanceWithin().popup();
});

$( function() {
    $( "#popupServer" ).enhanceWithin().popup();
});

$( function() {
    $( "#popupLoginMessage" ).enhanceWithin().popup();
});

$( function() {
    $( "#popupAccountDeleted" ).enhanceWithin().popup();
});

$( function() {
    $( "#popupCartDuplicate" ).enhanceWithin().popup();
});

$( function() {
    $( "#popupShoppingLogin" ).enhanceWithin().popup();
});

$( function() {
    $( "#popupBidLogin" ).enhanceWithin().popup();
});

$(document).on('click', '#submit-search', function(){     
	GetSearchResults($('#search-bar').val());
});

$(document).on('click', '#cart-edit', function(){     
	$('.cart-btn').show();
	$('#cart-edit').hide();
	$('#cart-clear').show();
	$('#cart-done').show();
});  
  
$(document).on('click', '#cart-done', function(){
	$('.cart-btn').hide();
	$('#cart-done').hide();
	$('#cart-clear').hide();
	$('#cart-edit').show();
});  

$(document).on('click', '#shipping-info-edit', function(){   
	$('.shipping-list').css("margin-bottom", 0);
	$('.shipping-info-btn').show();
	$('#shipping-info-edit').hide();
	$('#shipping-info-done').show();
});  
  
$(document).on('click', '#shipping-info-done', function(){
	$('.shipping-list').css("margin-bottom", '20px');
	$('.shipping-info-btn').hide();
	$('#shipping-info-done').hide();
	$('#shipping-info-edit').show();
});  

$(document).on('click', '#payment-info-edit', function(){   
	$('.payment-info-list').css("margin-bottom", 0);  
	$('.payment-info-btn').show();
	$('#payment-info-edit').hide();
	$('#payment-info-done').show();
});  
  
$(document).on('click', '#payment-info-done', function(){
	('.payment-info-list').css("margin-bottom", '20px');
	$('.payment-info-btn').hide();
	$('#payment-info-done').hide();
	$('#payment-info-edit').show();
});  


// Validation for add user page
 $(document).on("pageshow", "#add-user-page", function() {
	 $("#addUserForm").validate({
		 rules: {
			 zipMailingAddress: {
				 required: true,
				 digits: true,
				 minlength: 5,
				 maxlength: 5
			 },
 			
			 zipBillingAddress: {
				 required: true,
				 digits: true,
				 minlength: 5,
				 maxlength: 5
			 },
 			
			 telephone: {
				 required: true,
				 phoneUS: true,
			 }
		 }
	 });
 	
	 $("#addUserForm").validate({
		 errorPlacement: function(error, element) {
			 if ($(element).is("select")) {
				 error.insertAfter($(element).parent());
			 } else {
				 error.insertAfter(element);
			 }
		 }	
	 });	 
 });
 
$(document).on('pagebeforeshow', "#edit-user-page", function( event, ui ) {
	var adminuid = localStorage.getItem('adminuid');
	if(adminuid != null) {
		AdminGetUserById(adminuid);
		
		// currentUser has been set at this point
		$("#admin-edit-account-info-header").html("User Edit Mode");
		if(uid > 23) {
			document.getElementById("admin-edit-account-image").style.backgroundImage = "url('images/users/0.png')";
		}
		else
			document.getElementById("admin-edit-account-image").style.backgroundImage = "url('images/users/" + adminuid + ".png')";
		
	    $("#admin-edit-account-info-username").html(adminCurrentUser.username);
		$("#admin-edit-account-info-state").html("State: "+ adminCurrentUser.statema);	    
	    $("#admin-edit-account-info-phone").html("Telephone: "+ adminCurrentUser.phonenumber);
	    
	    var name = adminCurrentUser.fname + " " + adminCurrentUser.lname;
		$('#admin-edit-account-name').attr("value", name);
		$('#edit-upd-email').attr("placeholder", adminCurrentUser.email);
	    
	    $.fn.raty.defaults.path = 'images/icons';
	    $('#admin-edit-account-info-rating').raty(
	        {
	            numberMax: 5,
	            score    : currentUser.rating,
	            number   : 5,
	            cancel   : false,
	            cancelPlace: 'right',
	            cancelOff: 'cancel-off.png',
	            cancelOn : 'cancel-on.png',
	            half     : true,
	            size     : 16,
	            starHalf : 'star-half.png',
	            starOff  : 'star-off.png',
	            starOn   : 'star-on.png',
	            readOnly : 'true'
	        }
	    );
	    
	    $(document).on('click', '#logOutButton', function(){     
			localStorage.removeItem('uid');
			currentUser = undefined;
			$.mobile.changePage('#home-page');
			location.reload();
		});
	}
	else {
       $('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
    }
});

$(document).on('pagebeforeshow', "#remove-user-page", function( event, ui ) {
	var adminuid = localStorage.getItem('adminuid');
	if(adminuid != null) {
		AdminGetUserById(adminuid);
		
		// currentUser has been set at this point
		$("#admin-account-info-header").html("User Edit Mode");
		if(uid > 23) {
			document.getElementById("admin-account-image").style.backgroundImage = "url('images/users/0.png')";
		}
		else
			document.getElementById("admin-account-image").style.backgroundImage = "url('images/users/" + adminuid + ".png')";
		
	    $("#admin-account-info-username").html(adminCurrentUser.username);
		$("#admin-account-info-state").html("State: "+ adminCurrentUser.statema);	    
	    $("#admin-account-info-phone").html("Telephone: "+ adminCurrentUser.phonenumber);
	    
	    var name = adminCurrentUser.fname + " " +adminCurrentUser.lname;
		$('#admin-account-name').attr("value", name);
		$('#upd-email').attr("placeholder", adminCurrentUser.email);
	    
	    $.fn.raty.defaults.path = 'images/icons';
	    $('#admin-account-info-rating').raty(
	        {
	            numberMax: 5,
	            score    : currentUser.rating,
	            number   : 5,
	            cancel   : false,
	            cancelPlace: 'right',
	            cancelOff: 'cancel-off.png',
	            cancelOn : 'cancel-on.png',
	            half     : true,
	            size     : 16,
	            starHalf : 'star-half.png',
	            starOff  : 'star-off.png',
	            starOn   : 'star-on.png',
	            readOnly : 'true'
	        }
	    );
	    
	    $(document).on('click', '#logOutButton', function(){     
			localStorage.removeItem('uid');
			currentUser = undefined;
			$.mobile.changePage('#home-page');
			location.reload();
		});
	}
	else {
       $('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
       // $.mobile.changePage("#login-page",false, true, true);
    }
	
});

$(document).on('click', '#view-order', function(){     
	 $.ajax({
		 url : "http://localhost:3412/ProjectServer/recentOrder/" + currentUser.uid,
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
			 var orderid = data.order;
			 $.mobile.navigate("#order-view-page");
			GetOrderView(orderid);
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus: " + textStatus);
			 // alert("No recent order");
		 }
	 });
});  

// Validation for register page
 $(document).on("pageshow", "#register-page", function() {
	 $("#registerForm").validate({
		 rules: {
			 zipMailingAddress: {
				 required: true,
				 digits: true,
				 minlength: 5,
				 maxlength: 5
			 },
 			
			 zipBillingAddress: {
				 required: true,
				 digits: true,
				 minlength: 5,
				 maxlength: 5
			 },
 			
			 telephone: {
				 required: true,
				 phoneUS: true,
			 }
		 }
	 });
 	
	 $("#registerForm").validate({
		 errorPlacement: function(error, element) {
			 if ($(element).is("select")) {
				 error.insertAfter($(element).parent());
			 } else {
				 error.insertAfter(element);
			 }
		 }	
	 });	 
 });
 
/*
 * ALL GETS FROM THE SERVER
 * 
 */

$(document).on('pagebeforeshow', "#search-page", function( event, ui ) {
	$("#submit-search").hide();
});

$(document).on('pagebeforeshow', "#login-page", function( event, ui ) {
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		//currentUser has been set at this point
	 	$.mobile.changePage("#home-page",false, false, true);
	}
});

$(document).on('pagebeforeshow', "#home-page", function( event, ui ) {
	// localStorage.removeItem('uid');
	$("#administrate-li").hide();
	$.ajax({
		url : "http://localhost:3412/ProjectServer/categories",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
		var categoryList = data.categories;
		var len = categoryList.length;
		var list = $("#newCategories-list");
		list.empty();
		if(len >= 34) {
			var category;
			for (var i=34; i < len; ++i) {
			category = categoryList[i];
			list.append("<li id='alt-list'><a href='#category-page' onclick=\"GetProductByCategory('" + category.categoryname + "')\">" +
			  			"<img src='images/icons/58-bookmark.png' class='ui-li-icon ui-corner-none'/>" + category.categoryname + "</a></li>");
			 
			}
			list.listview("refresh");
		}
		 
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 17: " + textStatus);
		}
});

	var uid =  localStorage.getItem('uid');
       
       if( uid != null) {
        	// alert(localStorage.getItem('uid'));
       		GetUserById(uid);
	    	$("#signIn").hide();
	    	$("#myNavbar").show();
	    	$("#sell-item-li").show();
	    	$("#userli").show();
	    	$("#user").html(currentUser.username);
	    	$("#cartCount").html(currentUser.itemincart);
	    	$("#buyingCount").html(currentUser.buying);
	    	$("#sellingCount").html(currentUser.itemselling);

	    	if (currentUser.administrator == 'true') {
	    		$("#administrate-li").show();
	    	};
	} else {
	    	$("#signIn").show();
	    	$("#myNavbar").hide();
	    	$("#sell-item-li").hide();
	    	$("#administrate-li").hide();
	    	$("#userli").hide();
	};	
});

// Add all catagories in the database to a list.
 $(document).on('pagebeforeshow', '#search-page' ,function( event, ui ) {
 	$("#categories-error").hide();
	 console.log("TESTING SEARCH");
	 $.ajax({
		 url : "http://localhost:3412/ProjectServer/categories",
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
			 var categoryList = data.categories;
			 var len = categoryList.length;
			 var list = $("#category-list");
			 list.empty();
			 var category;
			 for (var i=0; i < len; ++i) {
				 category = categoryList[i];
				 list.append("<li id='alt-list'><a href='#category-page' onclick=\"GetProductByCategory('" + category.categoryname + "')\">" +
				  "<img src='images/icons/14-tag.png' class='ui-li-icon ui-corner-none'/>" + category.categoryname + "</a></li>"); 
			 }
			 list.listview("refresh");	
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus 17: " + textStatus);
			 $("#categories-error").show();
		 }
	 });
 });
 
 // Gets the information of the current product.
 $(document).on('pagebeforeshow', "#product-view", function( event, ui ) {

	 //currentProduct has been set at this point
	 for(var i = 0; i < 3; i++)
	 {
		if(currentProduct.pid > 17){
			$("#image" + i).html("<img src=\"images/products/0/" + i + ".png\" />");
		}
		else{
	 		$("#image" + i).html("<img src=\"images/products/" + currentProduct.pid + "/" + i + ".png\" />");
		}
	 }
	
	 $("#product-name").html(currentProduct.pname);
	 $("#product-time").html(currentProduct.penddate.substring(0, 10));
	 $("#product-location").html(currentProductSeller.statema);
	 $("#product-seller").html("Seller: " + currentProductSeller.username);
	 $("#product-header").html(currentProduct.pname);
	 $("#product-model").html("Model: " + currentProduct.pmodel);
	 $("#product-brand").html("Brand: " + currentProduct.pbrand);
	 $("#product-condition").html("Condition: " + currentProduct.pcondition);
	 $("#product-description").html(currentProduct.pdescription);
	 
	 if(currentProduct.ppricemethod.toLowerCase() =="instant")
	 {
		 $("#upd-bidButton").hide();
		 $("#upd-butItNowButton").show();
		 $("#upd-addToCartButton").show();
		 $("#upd-bidderListLink").hide();
		 $("#product-pmethod").html(currentProduct.ppricemethod + ":");
		 $("#product-price").html("$" + currentProduct.pprice);

	 }
	 else if(currentProduct.ppricemethod.toLowerCase() =="bid")
	 {
	 	if (currentUser.uid == currentProduct.sellerid) 
	 	{
	 		//TODO
	 		 $("#upd-bidButton").hide();
			 $("#upd-butItNowButton").hide();
			 $("#upd-addToCartButton").hide();
			 $("#upd-bidderListLink").show();
			 $("#product-pmethod").html(currentProduct.ppricemethod + ":");
			 $("#product-price").html("$" + currentProduct.currentbidprice);
	 	} else {
	 		 $("#upd-bidButton").show();
		 	 $("#upd-butItNowButton").hide();
			 $("#upd-addToCartButton").hide();
			 $("#upd-bidderListLink").show();
			 $("#product-pmethod").html(currentProduct.ppricemethod + ":");
			 $("#product-price").html("$" + currentProduct.currentbidprice);
	 	}
	 }
 });

$(document).on('pageshow', "#product-view", function( event, ui ) {
	//currentProduct has been set at this point
	var slider = $('#slider').data('flexslider');   
	slider.resize(); 
});

 $(document).on('pagebeforeshow', "#bidder-list-page", function( event, ui ) {
	 console.log("TESTING");
	 $('#bidderListSummary').hide();
	 $('#bidderListRecent').hide();
	 $('#loadingBiddderList').show();
	 $.ajax({
	  	// currentProduct has been set at this point
		 url : "http://localhost:3412/ProjectServer/bidderListSummary/" + currentProduct.pid,
		 contentType: "application/json",
		 complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	$('#loadingBidderList').hide();
   		},
		 success : function(data, textStatus, jqXHR){
		 	 $('#bidderListSummary').show();
	 		 $('#bidderListRecent').show();
			 var bidderListSummary = data.bidderListSummary;
			 var len = 0;
			 len = bidderListSummary.length;
			 var bidsInfo = bidderListSummary[0];
			 var list = $("#bidder-list-summary");
			 list.empty();
			 $("#bidder-list-header").html(currentProduct.pname);
			 list.append("<li>" +
						"<p style='font-size: 11px'>Bids<span style='padding: 0 29px;'></span>" + bidsInfo.numberofbids + "</p>" +
						"<p style='font-size: 11px'>Bidders<span style='padding: 0 21px;'></span>" + bidsInfo.bidders + "</p>" +
						"<p style='font-size: 11px'>High bidder<span style='padding: 0 12px;'></span>" + bidsInfo.highbidder + "</p></li>");
			 list.listview("refresh");
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus 18: " + textStatus);
			 $("#bidder-list-summary").empty();
			 // $("#bidderListMessage").html("No recent bids");
		 }
	 });
	 
	 $.ajax({
		 url : "http://localhost:3412/ProjectServer/bidderList/" + currentProduct.pid,
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
		 	$("#bidderListMessage").html("");
			 var bidderList = data.bidderList;
			 var len = 0;
			 len = bidderList.length;
			 var bidder;
			 var list = $("#upd-bidderList");
			 list.empty();
			 for(var i = 0; i < len ; i++)
			 {
				 bidder = bidderList[i];
				 list.append("<li class ='ui-li' style='height : 40px'>"+ bidder.username +"<div class = 'ui-li-aside ui-li-desc'>"+
		 					 "<p class='account-info-user'><b>US $" + bidder.userbidprice + "</b></p><p>"+ bidder.userbidtime.substring(0, 10) +"</p></div></li>" );
			 } 
			 list.listview("refresh");
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus 19: " + textStatus);
			 $("#bidderListMessage").html("No recent bids");
		 }
	 });
});
 
 $(document).on('pagebeforeshow', "#ask-question-page", function( event, ui ) {
 	if(currentUser.uid != undefined) {
		//currentUser has been set at this point
		$("#question-seller-username").html("To: " + currentProductSeller.username);
	 	$("#question-buyer-name").html("<h6>Dear " + currentUser.fname + ":</h6>");
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, true, true);
	}
 });
 
$(document).on('pagebeforeshow', "#seller-feedback-page", function( event, ui ) {
	
	// currentSeller has been set at this point
	if(uid > 23) {
			document.getElementById("seller-feedback-image").style.backgroundImage = "url(images/users/0.png)";
		}
		else
			document.getElementById("seller-feedback-image").style.backgroundImage = "url(images/users/" + currentProductSeller.uid + ".png)";
	$("#seller-feedback-username").html(currentProductSeller.username + "&nbsp;(" + currentProductSeller.totalreviews+ ")");
	$("#seller-feedback-state").html("State: "+ currentProductSeller.statema);	    
	$("#seller-feedback-phone").html("Telephone: "+ currentProductSeller.phonenumber);
	$('#seller-total-tdescribed').html(" &nbsp;(" +  currentProductSeller.tdescribed + ")");
	$('#seller-total-tcommunication').html(" &nbsp;(" + currentProductSeller.tcommunication + ")");
	$('#seller-total-tstime').html(" &nbsp;(" + currentProductSeller.tstime + ")");
	$('#seller-total-tscharges').html(" &nbsp;(" + currentProductSeller.tscharges + ")");
	
	$.fn.raty.defaults.path = 'images/icons';
    $('#seller-feedback-rating').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rating,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-feedback-described').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rdescribed,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-feedback-communication').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rcommunication,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-feedback-stime').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rstime,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-feedback-scharges').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rscharges,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-feedback-positive').html(currentProductSeller.positive);
	$('#seller-feedback-neutral').html(currentProductSeller.neutral);
	$('#seller-feedback-negative').html(currentProductSeller.negative);
});

$(document).on('pagebeforeshow', "#account-profile-page", function( event, ui ) {
	// currentSeller has been set at this point
	if(uid > 23) {
			document.getElementById("account-profile-image").style.backgroundImage = "url(images/users/0.png)";
		}
		else
			document.getElementById("account-profile-image").style.backgroundImage = "url(images/users/" + currentUser.uid + ".png)";
	$("#account-profile-header").html(currentUser.fname + " Profile");
	$("#account-profile-username").html(currentUser.username + "&nbsp;(" + currentUser.totalreviews+ ")");
	$("#account-profile-state").html("State: "+ currentUser.statema);	    
	$("#account-profile-phone").html("Telephone: "+ currentUser.phonenumber);
	$('#account-total-tdescribed').html(" &nbsp;(" +  currentUser.tdescribed + ")");
	$('#account-total-tcommunication').html(" &nbsp;(" + currentUser.tcommunication + ")");
	$('#account-total-tstime').html(" &nbsp;(" + currentUser.tstime + ")");
	$('#account-total-tscharges').html(" &nbsp;(" + currentUser.tscharges + ")");
	
	$.fn.raty.defaults.path = 'images/icons';
    $('#account-profile-rating').raty(
     	{
			numberMax: 5,
			score    : currentUser.rating,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#account-profile-described').raty(
     	{
			numberMax: 5,
			score    : currentUser.rdescribed,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#account-profile-communication').raty(
     	{
			numberMax: 5,
			score    : currentUser.rcommunication,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#account-profile-stime').raty(
     	{
			numberMax: 5,
			score    : currentUser.rstime,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#account-profile-scharges').raty(
     	{
			numberMax: 5,
			score    : currentUser.rscharges,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#account-profile-positive').html(currentUser.positive);
	$('#account-profile-neutral').html(currentUser.neutral);
	$('#account-profile-negative').html(currentUser.negative);
});
 
$(document).on('pagebeforeshow', "#recent-feedback-page", function( event, ui ) {
	//currentUser has been set at this point
	$('#recent-feedback-header').html(currentProductSeller.username);
    $.ajax({
	 url : "http://localhost:3412/ProjectServer/recentFeedback/" + currentProductSeller.uid,
	 contentType: "application/json",
	 success : function(data, textStatus, jqXHR){
		 var recentFeedbackList = data.feedbackList;
		 var len = 0;
		 len = recentFeedbackList.length;
		 var feedback;
		 var list = $("#recent-feedback-list");
		 list.empty();
		 var reviewtype;
		 for(var i = 0; i < len ; i++)
		 {
		 	feedback = recentFeedbackList[i];
		 	if (feedback.reviewtype = 'Positive') {
		 		reviewtype = 'add116';
		 	} else if(feedback.reviewtype = 'Neutral') {
		 		reviewtype = 'neutralicon';
		 	} else {
		 		reviewtype = 'redminus';
		 	}
			 
			 list.append(
			 	"<li style='margin-bottom: 5px'>" +
			 	"<img class='ui-li-icon ui-corner-none' src='images/icons/" + reviewtype + ".png'/>" +
			 	"<p class='account-info-user' style='font-weight: bold'>" + feedback.usernameg + "</p>" +
			 	"<span id='star" + i + "'></span>" +
				"<p class='account-info' style='font-size: 12px; color: #555;'>" + feedback.feedback + "</p>" +
    			"<div class='ui-li-aside' style='font-size: 10px; color: #555;'>" + feedback.ratedate.substring(0, 10) + "</div></li>"	
			 );

	  		$.fn.raty.defaults.path = 'images/icons';
			$('#star' + i).raty(
 	 		{
				 numberMax: 5,
				 score    : feedback.rating,
				 number   : 500,
				 cancel   : false,
				 half     : true,
				 size     : 13,
				 starHalf : 'rsz_star-half.png',
				 starOff  : 'rsz_star-off.png',
				 starOn   : 'rsz_star-on.png',
				 readOnly : 'true'
			});
 		}		 	
		list.listview("refresh");   
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus 20: " + textStatus);
			 // alert("Data not found!");
		 }
	});
});

$(document).on('pagebeforeshow', "#account-page", function( event, ui ) {
	var uid = localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		$("#account-logout").hide();
		$("#account-login").show();
		$("#logInButton").hide();
		$("#logOutButton").show();

		//Account info
		$(document).on('click', '#account-info', function(){     
			$.mobile.changePage('#account-info-page', {transition: "slide", changeHash: true });
		});  
		
		//Recent Feedback
		$(document).on('click', '#account-profile', function(){     
			$.mobile.changePage('#account-profile-page', {transition: "slide", changeHash: true });
		});  
				
		//Order History
		$(document).on('click', '#account-order', function(){     
			$.mobile.changePage('#order-history-page', {transition: "slide", changeHash: true });
		});
		
		//Selling Items
		$(document).on('click', '#account-selling', function(){
			$.mobile.changePage('#account-items-sale-page', {transition: "slide", changeHash: true });
		});  

		//Sale History
		$(document).on('click', '#account-history', function(){     
			$.mobile.changePage('#account-sale-history-page', {transition: "slide", changeHash: true });
		}); 
		
		//Shipping Addresses
		$(document).on('click', '#account-shipping', function(){     
			$.mobile.changePage('#shipping-info-page', {transition: "slide", changeHash: true });
		});  
		
		//Payment Info
		$(document).on('click', '#account-payment', function(){     
			$.mobile.changePage('#payment-info-page', {transition: "slide", changeHash: true });
		});  
		
		//Administrator
		$(document).on('click', '#account-admin', function(){     
			$.mobile.changePage('#administrator-page', {transition: "slide", changeHash: true });
		});   
		
		$(document).on('click', '#logOutButton', function(){     
			localStorage.removeItem('uid');
			currentUser = undefined;
			$.mobile.changePage('#home-page');
			location.reload();
		});  

		// currentUser has been set at this point
		$("#account-greeting").html("How lovely to see you, " + currentUser.fname + "!");
		$("#account-username").html(currentUser.username);
	    
	    if(currentUser.administrator == "true") {
	    	$("#account-admin").show();
	    }
	    else{
	    	$("#account-admin").hide();
	    }
	}
	else {
		$("#account-logout").show();
		$("#account-login").hide();
		$("#logOutButton").hide();
		$("#logInButton").show();
		$("#account-admin").hide();

		//Account info
		$(document).on('click', '#account-info', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		});  

		//Recent Feedback
		$(document).on('click', '#account-profile', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		});  		
		//Order History
		$(document).on('click', '#account-order', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		});
		
		//Selling Items
		$(document).on('click', '#account-selling', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		});  

		//Sale History
		$(document).on('click', '#account-history', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		}); 
		
		//Shipping Addresses
		$(document).on('click', '#account-shipping', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		});  
		
		//Payment Info
		$(document).on('click', '#account-payment', function(){     
			$.mobile.changePage('#login-page', {transition: "slide", changeHash: true });
		});  
	}
});

$(document).on('pagebeforeshow', "#account-info-page", function( event, ui ) {
	var uid = localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		
		// currentUser has been set at this point
		$("#account-info-header").html("Hello "+ currentUser.fname + "!");
		if(uid > 23) {
			document.getElementById("account-image").style.backgroundImage = "url('images/users/0.png')";
		}
		else
			document.getElementById("account-image").style.backgroundImage = "url('images/users/" + uid + ".png')";
			
	    $("#account-info-username").html(currentUser.username);
		$("#account-info-state").html("State: "+ currentUser.statema);	    
	    $("#account-info-phone").html("Telephone: "+ currentUser.phonenumber);
	    
	    var name = currentUser.fname + " " + currentUser.lname;
		$('#account-name').attr("value", name);
		$('#updemail').attr("placeholder", currentUser.email);
	    
	    $.fn.raty.defaults.path = 'images/icons';
	    $('#account-info-rating').raty(
	        {
	            numberMax: 5,
	            score    : currentUser.rating,
	            number   : 5,
	            cancel   : false,
	            cancelPlace: 'right',
	            cancelOff: 'cancel-off.png',
	            cancelOn : 'cancel-on.png',
	            half     : true,
	            size     : 16,
	            starHalf : 'star-half.png',
	            starOff  : 'star-off.png',
	            starOn   : 'star-on.png',
	            readOnly : 'true'
	        }
	    );
	    
	    $(document).on('click', '#logOutButton', function(){     
			localStorage.removeItem('uid');
			currentUser = undefined;
			$.mobile.changePage('#home-page');
			location.reload();
		});
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
    }
	
});

	
$(document).on('pagebeforeshow', "#shipping-info-page", function( event, ui ) {
	$('#shipping-info-empty').hide();
	// $('#shipping-info-delete').hide();
	$('#shipping-info-done').hide();
	$('#shipping-info-clear').hide();
	$('#shipping-info-header').hide();
	$('#shipping-info').hide();
	
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		$('#shipping-info-loading').show();
		$('#shipping-info-loading2').show();
		$.ajax({
		url : "http://localhost:3412/ProjectServer/getShippingAddresses/" + uid,
		contentType: "application/json",
		complete: function() {
			$('#shipping-info-loading').hide();
			$('#shipping-info-loading2').hide();
		},
		success : function(data, textStatus, jqXHR){
			$('#shipping-info-header').show();
			// $('#order-history-products').show();
			var shippingList = data.shippingaddress;
			var len = 0;
			len = shippingList.length;
			itemTotal = len;
			var list = $('#shipping-info-list');
			list.empty();
			var address;
			for (var i = 0; i < len; ++i) {
			address = shippingList[i];
			list.append("<li id='shipping-info-list1-" + address.maddressid + "' data-icon='false'>" +
						"<a style='padding-top: 0; padding-bottom: 0;' href='#edit-shipping-info-page' onclick='getShippingAddress(" + address.uid + ")' >" +
                		"<img src='images/icons/111-user.png' class='ui-li-icon ui-corner-none'/>" +
                    	"<h3 style='font-size: 13px; font-weight: lighter'>" + address.namema + "</h3>" +
                    	"</a></li>" +
                    	"<li id='shipping-info-list2-" + address.maddressid + "' class='shipping-list' style='margin-bottom: 20px;'>" +
						"<a href='#edit-shipping-info-page' onclick='getShippingAddress(" + address.uid + ")' >" +
                    	"<img src='images/icons/07-map-marker.png' class='ui-li-icon ui-corner-none'/>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA'>Urb. Rio Canas Calle Amazonas 2824</p>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA;'>" + address.cityma + ", " + address.statema + " " + address.zipma + "</p>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA; margin-bottom: 10px'>" + address.phonenumber + "</p>" +
                    	"</a></li><li class='shipping-info-btn' id='shipping-info-btn-" + address.maddressid + "'style='margin-bottom: 20px; background-color: #FC3D38' data-icon='false'>" +
                    	"<a onclick='deleteShippingAddress(" + address.maddressid + "," + uid + ")' data-role='bottom' style='background-color: #FC3D38; color: #FFFFFF; font-size: 14px; padding: 0' >" +
                    	"<center>Delete</center></a></li>");
			}
			$('.shipping-info-btn').hide();			
			list.listview("refresh");
			$('#shipping-info-header').show();
			$('#shipping-info--delete').show();
			$('#shipping-info--edit').show();
			$("#shipping-info").show();
			},
		error: function(data, textStatus, jqXHR) {
			if (data.status == 404){
				console.log("textStatus 21: " + textStatus);
				var list = $('#shipping-info-list');
				list.empty();
				$('#shipping-info-delete').hide();
				$('#shipping-info-edit').hide();
				$('#shipping-info-done').hide();
				$("#shipping-info-header").hide();
				$("#shipping-info-empty").show();
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
		});
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	}
});

$(document).on('pagebeforeshow', "#cart-page", function( event, ui ) {
	totalPrice = 0;
	$('#cart-empty').hide();
	$('#cart-delete').hide();
	$('#cart-done').hide();
	$('#cart-clear').hide();
	$('#cart-line').hide();
	$('#cart-info').hide();
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		$('#loadingCart').show(); // show loading image, as request is about to start;
		$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUserCart/" + uid,
		contentType: "application/json",
		complete: function() {
        // request is complete, regardless of error or success, so hide image
        $('#loadingCart').hide();
   		},
		success : function(data, textStatus, jqXHR){
			var productList = data.shoppingcart;
			var len = 0;
			len = productList.length;
			itemTotal = len;
			var list = $('#cart-list');
			list.empty();
			var product;
			for (var i=0; i < len; ++i) {
			product = productList[i];
			if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
			list.append("<li id='cart-list-" + product.pid + "'style='margin-top: 8px;'><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
			       		"<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
			            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
			             "<p>Brand: " + product.pbrand + "</p>" +
			             "<p>Model: " + product.pmodel + "</p>" +
			             "<div class=\"ui-li-aside\">" +
			             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
			             "<p>" + product.penddate.substring(0,10)+"</p>" +
			               "</div></a></li>" +
			              "<li class='cart-btn' id='cart-btn-" + product.pid + "'style='margin-bottom: 8px; background-color: #FC3D38' data-icon='false'><a onclick='deleteItemCart(" + product.pid + ")' data-role='bottom' style='background-color: #FC3D38; color: #FFFFFF; font-size: 14px; padding: 0' ><center>Delete</center></a></li>");
					totalPrice += parseFloat(product.pprice);
					$('.cart-btn').hide();
				}			
			list.listview("refresh");
			$('#cart-delete').show();
			$('#cart-edit').show();
			$("#cart-info").show();
			$("#cart-subtotal").html("Subtotal (" + len + " Items): $" + totalPrice);
			$("#cart-shipping").html("Shipping: $10");
			totalPrice = totalPrice + 10;
			$("#cart-line").show();
			$("#cart-grandtotal").html("Grand total: $" + totalPrice);
			$('#cart-checkout').show();
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus 22: " + textStatus);
			var list = $('#cart-list');
			list.empty();
			$('#cart-edit').hide();
			$("#cart-info").hide();
			$('#cart-empty').show();
			}
		});
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	}
});

$(document).on('pagebeforeshow', "#payment-info-page", function( event, ui ) {
	$('#payment-info-empty').hide();
	$('#payment-info-done').hide();
	$('#payment-info-clear').hide();
	$('#payment-info-header').hide();
	$('#payment-info').hide();
	
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		$('#payment-info-loading').show();
		$('#payment-info-loading2').show();
		$.ajax({
		url : "http://localhost:3412/ProjectServer/getCreditCard/" + uid,
		contentType: "application/json",
		complete: function() {
			$('#payment-info-loading').hide();
			$('#payment-info-loading2').hide();
		},
		success : function(data, textStatus, jqXHR){
			$('#payment-info-header').show();
			
			var cardsList = data.creditcard;
			var len = 0;
			len = cardsList.length;
			itemTotal = len;
			var list = $('#payment-info-list');
			list.empty();
			var card;
			for (var i = 0; i < len; ++i) {
			card = cardsList[i];
			list.append("<li id='payment-info-list1-" + card.cardid + "'data-icon='false' style='padding-top: 0; padding-bottom: 0;'>" +
						"<a style='padding-top: 0; padding-bottom: 0;' href='#edit-payment-info-page' onclick='getCreditCard(" + card.uid + ")' >" +
                		"<img src='images/icons/111-user.png' class='ui-li-icon ui-corner-none'/>" +
                    	"<h3 style='font-size: 13px; font-weight: lighter;'>" + card.nameba + "</h3>" +
                    	"</a></li>" +
                    	"<li id='payment-info-list2-" + card.cardid + "' data-icon='false'>" +
						"<a href='#edit-payment-info-page' onclick='getCreditCard(" + card.uid + ")' >" +
                    	"<img src='images/icons/07-map-marker.png' class='ui-li-icon ui-corner-none'/>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA'>Urb. Rio Canas Calle Amazonas 2824</p>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA;'>" + card.cityba + ", " + card.stateba + " " + card.zipba + "</p>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA;'>" + card.phonenumber + "</p>" +
                    	"</a></li>" +
                    	"<li id='payment-info-list3-" + card.cardid + "'>" +
						"<a href='#edit-payment-info-page' onclick='getCreditCard(" + card.uid + ")' >" +
                    	"<img src='images/icons/" + card.cardtype.toLowerCase() + ".png' class='ui-li-icon ui-corner-none'/>" +
                    	"<p class='account-info-user' style='font-size: 12px; font-weight: bold;'>" + card.cardtype + "</p>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA;'> **** **** **** " + card.cardnumber.substring(12, 16) + "</p>" +
                    	"<p class='account-info' style='font-size: 12px; color: #AAAAAA; margin-bottom: 10px'>" + card.expirationdate + "</p>" +
                    	"</a></li><li class='payment-info-btn' id='payment-info-btn-" + card.cardid + "'style='margin-bottom: 20px; background-color: #FC3D38' data-icon='false'>" +
                    	"<a onclick='deleteCreditCard(" + card.cardid + "," + card.baddressid + "," + uid +")' data-role='bottom' style='background-color: #FC3D38; color: #FFFFFF; font-size: 14px; padding: 0' >" +
                    	"<center>Delete</center></a></li>");
			}			
			$('.payment-info-btn').hide();			
			list.listview("refresh");
			$('#payment-info--delete').show();
			$('#payment-info--edit').show();
			$('#payment-info').show();
			},
		error: function(data, textStatus, jqXHR) {
			if (data.status == 404){
				var list = $('#payment-info-list');
				console.log("textStatus 21: " + textStatus);
				list.empty();
				$('#payment-info-delete').hide();
				$('#payment-info-edit').hide();
				$('#payment-info-done').hide();
				$("#payment-info-header").hide();
				$("#payment-info-empty").show();
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
		});
	}
	else {
			setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
			},100);
	}
	
});

$(document).on('pagebeforeshow', "#order-history-page", function( event, ui ) {
	$('#order-history-empty').hide();
	$('#order-history-complete').hide();
	$('#order-history-incomplete').hide();
	$('#order-history-loading').show();
	$('#order-history-loading2').show();
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		$.ajax({
			url : "http://localhost:3412/ProjectServer/orderHistory/" + uid,
			contentType: "application/json",
			complete: function() {
				$('#order-history-loading').hide();
				$('#order-history-loading2').hide();
			},
			success : function(data, textStatus, jqXHR){
				$('#order-history-products').show();
				var orderList = data.orderhistory;
				var len = 0;
				len = orderList.length;
				itemTotal = len;
				var list = $('#order-history-list');
				var list2 = $('#order-history-list2');
				list.empty();
				list2.empty();				
				var order;
				for (var i = 0; i < len; ++i) {
					order = orderList[i];
					if (order.status == 'incompleted') {
						$('#order-history-incomplete').show();
						list2.append("<li>" + 
			             "<p style='font-size: 11px;'><b>Order Date: </b>" + order.orderdate.substring(0, 10) + "</p>" + 
			             "<p style='font-size: 11px;' ><b>Items Ordered: </b>" + order.orderitems + "</p></li>" +
			             "<p style='font-size: 11px;'><b>Status: </b>Waiting Payment</p>" +
			              "<li><a href='#order-view-page' onclick='GetPendingOrderView(" + order.orderid + ")' data-role='bottom' style='font-size: 14px; color: #55A244; padding: 0'><center>View order</center></a></li><br />");
					} else{
						$('#order-history-complete').show();
						list.append("<li>" + 
			             "<p style='font-size: 11px;'><b>Order Date: </b>" + order.orderdate.substring(0, 10) + "</p>" + 
			             "<p style='font-size: 11px;'><b>Recipient: </b>" + order.namema + "</p>" +
			             "<p style='font-size: 11px;' ><b>Items Ordered: </b>" + order.orderitems + "</p></li>" +
			              "<li><a href='#order-view-page' onclick='GetOrderView(" + order.orderid + ")' data-role='bottom' style='font-size: 14px; color: #55A244; padding: 0'><center>View order</center></a></li><br />");
					};
				}			
				list.listview("refresh");
				list2.listview("refresh");
				},
			error: function(data, textStatus, jqXHR) {
				console.log("textStatus 21: " + textStatus);
				$('#order-history-products').hide();
				$('#order-history-complete').hide();
				$('#order-history-incomplete').hide();
				$('#order-history-empty').show();
			}
		});
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	}
	
});

$(document).on('pagebeforeshow', "#administrator-page", function( event, ui ) {
	var uid = localStorage.getItem('uid');
	
	if(uid != null) {
		GetUserById(uid);
	    if(currentUser.administrator == "true"){
	    	$("#admin").show();
	    }
	    else{
       		$.mobile.changePage("#home-page",false, true, true);
       		// alert('You are not an administrator');
	    }
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
    }
	
});

$(document).on('pagebeforeshow', "#cart-page", function( event, ui ) {
	totalPrice = 0;
	$('#cart-empty').hide();
	$('#cart-delete').hide();
	$('#cart-done').hide();
	$('#cart-clear').hide();
	$('#cart-line').hide();
	$('#cart-info').hide();
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		$('#loadingCart').show(); // show loading image, as request is about to start;
		$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUserCart/" + uid,
		contentType: "application/json",
		complete: function() {
        // request is complete, regardless of error or success, so hide image
        $('#loadingCart').hide();
   		},
		success : function(data, textStatus, jqXHR){
			var productList = data.shoppingcart;
			var len = 0;
			len = productList.length;
			itemTotal = len;
			var list = $('#cart-list');
			list.empty();
			var product;
			for (var i=0; i < len; ++i) {
			product = productList[i];
			if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
			list.append("<li id='cart-list-" + product.pid + "'style='margin-top: 8px;'><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
			       		"<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
			            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
			             "<p>Brand: " + product.pbrand + "</p>" +
			             "<p>Model: " + product.pmodel + "</p>" +
			             "<div class=\"ui-li-aside\">" +
			             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
			             "<p>" + product.penddate.substring(0,10)+"</p>" +
			               "</div></a></li>" +
			              "<li class='cart-btn' id='cart-btn-" + product.pid + "'style='margin-bottom: 8px; background-color: #FC3D38' data-icon='false'><a onclick='deleteItemCart(" + product.pid + ")' data-role='bottom' style='background-color: #FC3D38; color: #FFFFFF; font-size: 14px; padding: 0' ><center>Delete</center></a></li>");
					totalPrice += parseFloat(product.pprice);
					$('.cart-btn').hide();
				}			
			list.listview("refresh");
			$('#cart-delete').show();
			$('#cart-edit').show();
			$("#cart-info").show();
			$("#cart-subtotal").html("Subtotal (" + len + " Items): $" + totalPrice);
			$("#cart-shipping").html("Shipping: $10");
			totalPrice = totalPrice + 10;
			$("#cart-line").show();
			$("#cart-grandtotal").html("Grand total: $" + totalPrice);
			$('#cart-checkout').show();
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus 22: " + textStatus);
			var list = $('#cart-list');
			list.empty();
			$('#cart-edit').hide();
			$("#cart-info").hide();
			$('#cart-empty').show();
			}
		});
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	}
});

//TODO
$(document).on('pagebeforeshow', "#checkout-page", function( event, ui ) {
	
	// if(currentUser.uid != undefined) {
		// currentUser has been set at this point
		$("#checkout-shipping-type").html("USPS Shipping");
		$("#checkout-adrress-name").html(currentUser.namema);
		$("#checkout-address-maddress").html(currentUser.streetma + " " + currentUser.cityma + ", " + currentUser.statema + " " + currentUser.zipma);
		
		GetCreditCardCheckout();
		// $("#checkout-payment-card").html();
		// $("#checkout-payment-baddress").html();
// 		
		GetCheckoutInfo();
		
		// $("#checkout-subtotal").html("Subtotal (" + len + " Items): $" + totalPrice);
		// $("#checkout-shipping").html("Shipping: $10");
		// totalPrice = totalPrice + 10;
		// $("#checkout-line").show();
		// $("#checkout-grandtotal").html("Grand total: $" + totalPrice);
		// $('#checkout-button').show();	
	// else {
				// setTimeout(function() {
    				// $('#popupLoginMessage').popup("open");
				// },100);
	    // // $.mobile.changePage("#login-page",false, false, true);
	// }
});

$(document).on('pagebeforeshow', "#checkout-buyItNow-page", function( event, ui ) {
	
	// if(currentUser.uid != undefined) {
		// currentUser has been set at this point
		$("#checkout-buyItNow-shipping-type").html("USPS Shipping");
		$("#checkout-buyItNow-adrress-name").html(currentUser.namema);
		$("#checkout-buyItNow-address-maddress").html(currentUser.streetma + " " + currentUser.cityma + ", " + currentUser.statema + " " + currentUser.zipma);
		
		GetCreditCardBuyItNow(); 		
		GetCheckoutInfo();
		
		$("#checkout-buyItNow-subtotal").html("Subtotal (1 Item): $" + currentProduct.pprice);
		$("#checkout-buyItNow-shipping").html("Shipping: $10");
		var totalPrice = parseFloat(currentProduct.pprice) + 10.00;
		$("#checkout-buyItNow-line").show();
		$("#checkout-buyItNow-grandtotal").html("Grand total: $" + totalPrice);
		$("#checkout-buyItNow-info").show();
	// else {
				// setTimeout(function() {
    				// $('#popupLoginMessage').popup("open");
				// },100);
	    // // $.mobile.changePage("#login-page",false, false, true);
	// }
});

$(document).on('pagebeforeshow', "#product-view", function productName() {
	// currentProduct has been set at this point
	return currentProduct.name;
	
});

$(document).on('pagebeforeshow', "#items-sale-page", function( event, ui ) {
	console.log("TESTING");
	//currentProductSeller has been set at this point
	$("#items-sale-username").html(currentProductSeller.username);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/itemsforsale/" + currentProductSeller.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.itemsForSale;
			var len = productList.length;
			var list = $('#items-sale-list');
			list.empty();
			var product;
			for (var i=0; i < len; ++i) {
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus 23: " + textStatus);
			 $('#noHistoryItems').html("No items for sale.");
			 $('#items-sale-list').empty();
		}
	});
});

$(document).on('pagebeforeshow', "#account-items-sale-page", function( event, ui ) {
	console.log("TESTING");
	//currentUser has been set at this point
	$("#account-items-sale-header").html(currentUser.fname + " " + currentUser.lname);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/itemsforsale/" + currentUser.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.itemsForSale;
			var len = productList.length;
			var list = $('#account-items-sale-list');
			list.empty();
			var product;
			for (var i=0; i < len; ++i) {
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus 24: " + textStatus);
			 $('#noHistoryItems').html("No items for sale.");
			 $('#account-items-sale-list').empty();
		}
	});
});

$(document).on('pagebeforeshow', "#sale-history-page", function( event, ui ) {
	console.log("TESTING");
	//currentProductSeller has been set at this point
	$("#sale-history-username").html(currentProductSeller.username);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/saleHistory/" + currentProductSeller.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$('#noHistorySale').html("");
			var productList = data.saleHistory;
			var len = productList.length;
			var list = $('#sale-history-list');
			list.empty();
			var product;
			for (var i = 0; i < len; ++i) {
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus 25: " + textStatus);
			$('#sale-history-list').empty();
			$('#noHistorySale').html("No history sales.");			
		}
	});
});

$(document).on('pagebeforeshow', "#account-sale-history-page", function( event, ui ) {
	if(currentUser.uid != undefined) {
		//currentUser has been set at this point
		$("#account-sale-history-header").html(currentUser.fname + " " + currentUser.lname);
		$.ajax({	
		url : "http://localhost:3412/ProjectServer/saleHistory/" + currentUser.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$('#noHistoryAccountSale').html("");
			var productList = data.saleHistory;
			var len = productList.length;
			var list = $('#account-sale-history-list');
			list.empty();
			var product;
			for (var i = 0; i < len; ++i) {
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus 26: " + textStatus);
			$('#account-sale-history-list').empty();
			$('#noHistoryAccountSale').html("No history sales.");	
		}
	});
	}
	else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	}
	
});

$(document).on('pagebeforeshow', "#seller-page", function( event, ui ) {
	// currentSeller has been set at this point
	$("#seller-header").html(currentProductSeller.fname + " " + currentProductSeller.lname);
	if(uid > 23) {
			document.getElementById("seller-image").style.backgroundImage = "url(images/users/0.png)";
		}
		else
			document.getElementById("seller-image").style.backgroundImage = "url(images/users/" + currentProductSeller.uid + ".png)";
	$("#seller-username").html(currentProductSeller.username + "&nbsp;(" + currentProductSeller.totalreviews+ ")");
	$("#seller-state").html("State: "+ currentProductSeller.statema);	    
	$("#seller-phone").html("Telephone: "+ currentProductSeller.phonenumber);
	$('#seller-tdescribed').html(" &nbsp;(" +  currentProductSeller.tdescribed + ")");
	$('#seller-tcommunication').html(" &nbsp;(" + currentProductSeller.tcommunication + ")");
	$('#seller-tstime').html(" &nbsp;(" + currentProductSeller.tstime + ")");
	$('#seller-tscharges').html(" &nbsp;(" + currentProductSeller.tscharges + ")");
	
	$.fn.raty.defaults.path = 'images/icons';
    $('#seller-rating').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rating,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			cancelOff: 'cancel-off.png',
			cancelOn : 'cancel-on.png',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-described').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rdescribed,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-communication').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rcommunication,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-stime').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rstime,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-scharges').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rscharges,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			half     : true,
			size     : 16,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);
	$('#seller-positive').html(currentProductSeller.positive);
	$('#seller-neutral').html(currentProductSeller.neutral);
	$('#seller-negative').html(currentProductSeller.negative);

});

$(document).on('pagebeforeshow', '#review-page', function( event, ui ) {
	$("#review-for").html("Seller: " + currentProductSeller.username);
	
	$.fn.raty.defaults.path = 'images/icons';
    	for (var i = 0; i < 4; i++) {
        	$('#star' + i).raty({
	        	numberMax: 5,
	            number   : 500,
	            cancel   : true,
	            cancelPlace: 'right',
	            cancelOff: 'minusoff16.png',
	            cancelOn : 'minuson16.png',
	            half     : true,
	            size     : 16,
	            starHalf : 'star-half.png',
                starOff  : 'star_empty16.png',
                starOn   : 'star-on.png',
                target    : '#hint'+ i,
                targetType: 'number',
                targetKeep: true,
             });
        }
});
////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////

function ConverToJSON(formData){
	
	var o = {};
    $.each(formData, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

function SaveProduct(){
	var form = $("#product-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	newProduct.sellerid = currentUser.uid;
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	
	if (newProduct.productName == '' || newProduct.productBrand == '' || newProduct.productModel == '' ||
		newProduct.productPrice == '' || newProduct.productShipping == '' || newProduct.productDescription == ''
		|| newProduct.productCondition == '' || newProduct.productPriceMethod == '' || newProduct.productCategory == '' ||
		newProduct.productPriceMethod == undefined || newProduct.productCategory == undefined || newProduct.productCondition == undefined) {
		// alert("Missing Fields");
	} else{
		setTimeout(function() {
	    	$('#popupSaveProduct').popup("open");
		},100);
		
		if(newProduct.productPriceMethod == 'Bid') {
			$.ajax({
				url : "http://localhost:3412/ProjectServer/products",
				method: 'post',
				data : newProductJSON,
				contentType: "application/json",
				dataType:"json",
				complete: function() {
		        	// request is complete, regardless of error or success, so hide image
		        	setTimeout(function() {
		    			$('#popupSaveProduct').popup("close");
						},50);
		   		},
				success : function(data, textStatus, jqXHR){
							$.ajax({
									url : "http://localhost:3412/ProjectServer/productsAuction/" + data.pid,
									method: 'post',
									data : newProductJSON,
									contentType: "application/json",
									dataType:"json",
									complete: function() {
							        	// request is complete, regardless of error or success, so hide image
							        	setTimeout(function() {
							    			$('#popupSaveProduct').popup("close");
											},50);
							   		},
									success : function(data, textStatus, jqXHR){
										$.mobile.navigate("#home-page");
									},
									error: function(data, textStatus, jqXHR){
										if (data.status == 400){
											setTimeout(function() {
							    			$('#popupMissingFieldsProduct').popup("open");
											},10);	
										}
										else if (data.status == 500) {
											setTimeout(function() {
							    			$('#popupExist').popup("open");
											},100);		
										}
										else {
											$('#popupServer').popup();
											setTimeout(function() {
							    				$('#popupServer').popup("open");
											},100);			}
									}
								});
				},
				error: function(data, textStatus, jqXHR){
					if (data.status == 400){
						setTimeout(function() {
		    			$('#popupMissingFieldsProduct').popup("open");
						},10);	
					}
					else if (data.status == 500) {
						setTimeout(function() {
		    			$('#popupExist').popup("open");
						},100);		
					}
					else {
						$('#popupServer').popup();
						setTimeout(function() {
		    				$('#popupServer').popup("open");
						},100);			}
				}
			});
		}
		else if (newProduct.productPriceMethod == 'Instant') {
			$.ajax({
				url : "http://localhost:3412/ProjectServer/products",
				method: 'post',
				data : newProductJSON,
				contentType: "application/json",
				dataType:"json",
				complete: function() {
		        	// request is complete, regardless of error or success, so hide image
		        	setTimeout(function() {
		    			$('#popupSaveProduct').popup("close");
						},50);
		   		},
				success : function(data, textStatus, jqXHR){
						  $.ajax({
									url : "http://localhost:3412/ProjectServer/productsSale/" + data.pid,
									method: 'post',
									data : newProductJSON,
									contentType: "application/json",
									dataType:"json",
									complete: function() {
							        	// request is complete, regardless of error or success, so hide image
							        	setTimeout(function() {
							    			$('#popupSaveProduct').popup("close");
											},50);
							   		},
									success : function(data, textStatus, jqXHR){
										$.mobile.navigate("#home-page");
									},
									error: function(data, textStatus, jqXHR){
										if (data.status == 400){
											setTimeout(function() {
							    			$('#popupMissingFieldsProduct').popup("open");
											},10);	
										}
										else if (data.status == 500) {
											setTimeout(function() {
							    			$('#popupExist').popup("open");
											},100);		
										}
										else {
											$('#popupServer').popup();
											setTimeout(function() {
							    				$('#popupServer').popup("open");
											},100);			}
									}
								});
				},
				error: function(data, textStatus, jqXHR){
					if (data.status == 400){
						setTimeout(function() {
		    			$('#popupMissingFieldsProduct').popup("open");
						},10);	
					}
					else if (data.status == 500) {
						setTimeout(function() {
		    			$('#popupExist').popup("open");
						},100);		
					}
					else {
						$('#popupServer').popup();
						setTimeout(function() {
		    				$('#popupServer').popup("open");
						},100);			}
				}
			});
		}
		
	}
}

function getProductById(id){
	var product = {};
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products/" + id,
		method: 'get',
		contentType: "application/json",
		async: false,
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			product = data.product;	
			// alert(data.product.sellerid);	
			// $.mobile.loading("hide");
			// $.mobile.navigate("#product-view");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 28: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				$('#popupDialogProduct').popup('open');
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
	return product;
}

function GetProduct(id, sellerid){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			currentProduct = data.product;		
			$.mobile.loading("hide");
			$.mobile.navigate("#product-view");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 28: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				$('#popupDialogProduct').popup('open');
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
	$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUser/" + sellerid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			currentProductSeller = data.currentUser;	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 29: " + textStatus);
			// $.mobile.loading("hide");
			if (data.status == 404){
				// alert("Seller not found.");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

function GetProductBid(id, sellerid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			currentProduct = data.product;		
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 30: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				$('#popupDialogProduct').popup('open');
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
	$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUser/" + sellerid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			currentProductSeller = data.currentUser;	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 31: " + textStatus);
			// $.mobile.loading("hide");
			if (data.status == 404){
				// alert("Seller not found.");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

function auctionTerminated(pid) {
	// alert(pid);
	var product = getProductById(pid);
	if (product.currentbidprice == 0) {
		// means that the product was not sold
		// añadirlo a la pagina del vendedor como producto no vendido
		// eliminarlo de la tabla de auction
		// darle la opcion al vendedor de volver a venderlo
		// añadir un li arriba del producto diciendo Listing has ended
		console.log('No sold');
	} else if (product.currentbidprice > 0) {
		console.log('sold');
		// product was sold
		// añadirlo a la pagina del comprador como producto a pagar
		// eliminarlo de la tabla de auction, pero de alguna forma guardar el currentbidprice o usar el bid mas alto o 
		// añadir el currentbidprice como pfinalprice en tabla product
		// luego cuando el usuario lo vaya a pagar hacer un checkout con el pfinalprice
		// añadir un li arriba del producto diciendo Listing has ended (no creo q en este caso sea necesario)
			$.ajax({
				url : "http://localhost:3412/ProjectServer/higherBidder/" + product.pid,
				method: 'get',
				contentType: "application/json",
				dataType:"json",
				success : function(data, textStatus, jqXHR){
					var uid = data.higherBidderItems.uid;
					$.ajax({
						url : "http://localhost:3412/ProjectServer/customerOrderBid/" + uid + "/" + product.pid,
						method: 'post',
						contentType: "application/json",
						dataType:"json",
						success : function(data, textStatus, jqXHR){
							    location.reload();
						},
						error: function(data, textStatus, jqXHR){
							console.log("textStatus 1: " + textStatus);
							if (data.status == 500){
								setTimeout(function() {
				    			$('#popupDialogLogin').popup("open");
								},100);			}
							else if (data.status == 409) {
								//User was deleted
								setTimeout(function() {
				    			$('#popupDialogLogin').popup("open");
								},100);	
							}
							else {
								$('#popupServer').popup();
								setTimeout(function() {
				    				$('#popupServer').popup("open");
								},100);
							}
						}
					});
				},
				error: function(data, textStatus, jqXHR){
					console.log("textStatus 1: " + textStatus);
					if (data.status == 500){
						setTimeout(function() {
		    			$('#popupDialogLogin').popup("open");
						},100);			}
					else if (data.status == 409) {
						//User was deleted
						setTimeout(function() {
		    			$('#popupDialogLogin').popup("open");
						},100);	
					}
					else {
						$('#popupServer').popup();
						setTimeout(function() {
		    				$('#popupServer').popup("open");
						},100);
					}
				}
			});
	}
}

function GetUser(username, password) {
	
	if (username == '' || password == '') {
		setTimeout(function() {
		    $('#popupLoginMissing').popup("open");
		},10);	
	} else{
		setTimeout(function() {
		    	$('#popupLogin').popup("open");
				},100);
			$.ajax({
				url : "http://localhost:3412/ProjectServer/user/" + username + "/" + password,
				method: 'get',
				contentType: "application/json",
				dataType:"json",
				complete: function() {
		        	// request is complete, regardless of error or success, so hide image
		        	setTimeout(function() {
		    			$('#popupLogin').popup("close");
		    			// document.getElementById('go-back').click();
						},50);
		
		   		},
				success : function(data, textStatus, jqXHR){
						 localStorage.setItem( 'uid', data.user.uid );
						 setTimeout(function() {
								history.back();
						},70);
				},
				error: function(data, textStatus, jqXHR){
					console.log("textStatus 1: " + textStatus);
					if (data.status == 500){
						setTimeout(function() {
		    			$('#popupDialogLogin').popup("open");
						},100);			}
					else if (data.status == 409) {
						//User was deleted
						setTimeout(function() {
		    			$('#popupDialogLogin').popup("open");
						},100);	
					}
					else {
						$('#popupServer').popup();
						setTimeout(function() {
		    				$('#popupServer').popup("open");
						},100);
					}
				}
			});
	};

}

function GetUserById(uid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUser/" + uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			currentUser = data.currentUser;	
			// alert("currentUser.uid " + currentUser.uid + currentUser.username);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 32: " + textStatus);
			// $.mobile.loading("hide");
			if (data.status == 404){
				// alert("User not found.");
			}
			else if (data.status == 409) {
				localStorage.removeItem('uid');
				$.mobile.navigate("#login-page");
				setTimeout(function() {
    			$('#popupAccountDeleted').popup("open");
				},1200);	
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

function AdminGetUserById(uid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUser/" + uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			adminCurrentUser = data.currentUser;	
			// alert("currentUser.uid " + currentUser.uid + currentUser.username);
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			// $.mobile.loading("hide");
			if (data.status == 404){
				// alert("User not found.");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

function AdminGetUser() 
{
	var username=$('#searchUsername').val();
	$.ajax({
		url : "http://localhost:3412/ProjectServer/user/" + username,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	setTimeout(function() {
    			$('#popupLogin').popup("close");
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			 // alert(username + " " + password + "id = " + data.user.uid);
              localStorage.setItem( 'adminuid', data.user.uid );
			$.mobile.changePage("#edit-user-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			 console.log("textStatus: " + textStatus);
             $("#noUsers").html("No users with that username found");
		}
	});
}

function AdminGetUserToRemove() 
{
	var username=$('#searchUsernameToDelete').val();
	$.ajax({
		url : "http://localhost:3412/ProjectServer/user/" + username,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	setTimeout(function() {
    			$('#popupLogin').popup("close");
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			// alert(username + " " + password + "id = " + data.user.uid);
              localStorage.setItem( 'adminuid', data.user.uid );
			$.mobile.changePage("#remove-user-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			 console.log("textStatus: " + textStatus);
             $("#noUsers").html("No users with that username found");
		}
	});
}

function AddCategory() 
{
	var category=$('#categoryToBeAdded').val();
	$.ajax({
		url : "http://localhost:3412/ProjectServer/addCategory/" + category,
		method: 'post',
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	setTimeout(function() {
    			$('#popupLogin').popup("close");
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			// alert(username + " " + password + "id = " + data.user.uid);
			$.mobile.navigate("#addCategoryAlert");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			 console.log("textStatus: " + textStatus);
             // alert("Category could not be added");
		}
	});
}

function AdminAddUser(){
	setTimeout(function() {
    $('#popupRegister').popup("open");
	},100);
		
	var form = $("#addUserForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New User: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/users",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	setTimeout(function() {
    			$('#popupRegister').popup("close");
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			$.mobile.navigate("#administrator-page");
		},
		error: function(data, textStatus, jqXHR){
			if (data.status == 400){
				setTimeout(function() {
    			$('#popupMissingFields').popup("open");
				},10);	
			}
			else if (data.status == 500) {
				setTimeout(function() {
    			$('#popupExist').popup("open");
				},100);		
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);			}
		}
	});
}

function AdminUpdateUser(){
	var form = $("#admin-update-user-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUser = ConverToJSON(formData);
	updUser.uid = adminCurrentUser.uid;
	console.log("Updated User: " + JSON.stringify(updUser));
	var updUserJSON = JSON.stringify(updUser);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/user/" + updUser.uid,
		method: 'put',
		data : updUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			// alert("Success");
			localStorage.removeItem('adminuid');
			$.mobile.navigate("#administrator-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			if (data.status == 404){
				// alert("Data could not be updated!");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);	
			}
		}
	});
}

function AdminRemoveUser(){
	var form = $("#admin-update-user-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUser = ConverToJSON(formData);
	updUser.uid = adminCurrentUser.uid;
	console.log("Updated User: " + JSON.stringify(updUser));
	var updUserJSON = JSON.stringify(updUser);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/user/delete/" + updUser.uid,
		method: 'put',
		data : updUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			// alert("Success");
			localStorage.removeItem('adminuid');
			$.mobile.navigate("#administrator-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			if (data.status == 404){
				// alert("Data could not be updated!");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);	
			}
		}
	});
}

function verifyCurrentPassword(uid, currPassword) {
	var verify;
	$.ajax({
		url : "http://localhost:3412/ProjectServer/verifyCurrentPassword/" + uid + "/" + currPassword,
		method: 'get',
		contentType: "application/json",
		async: false,
		dataType:"json",
		success : function(data, textStatus, jqXHR){
					verify = 1;	
		},
		error: function(data, textStatus, jqXHR){
			verify = 0;
		}
	});
	return verify;
}

function GetSellerById(uid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/currentUser/" + uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			orderSeller = data.currentUser;	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 2: " + textStatus);
			// $.mobile.loading("hide");
			if (data.status == 404){
				// alert("User not found.");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

//TODO
function GetOrderView(orderId) {
	totalPrice = 0;
	 $.mobile.loading("show");
	 console.log("TESTING order view");
	 var uid =  localStorage.getItem('uid');
	 if(uid != null) {
		 $.ajax({
			 url : "http://localhost:3412/ProjectServer/orderView/" + uid + "/" + orderId,
			 method: 'get',
			 contentType: "application/json",
			 success : function(data, textStatus, jqXHR){
				 var orderList = data.orderView;
				 var len = orderList.length;
				 var list1 = $('#order-info-list');
				 var list2 = $('#order-mailing-list');
				 var list3 = $('#order-view-list');
				 var list4 = $('#order-payment-list');
				 var list5 = $('#order-total-list');
				 list1.empty();
				 list2.empty();
				 list3.empty();
				 list4.empty();
				 list5.empty();
				 var orderInfo = orderList[0];
				 var order;
							
				// Shipping address		
				list2.append("<li>" +
							"<p style='font-size: 11px:'>" + orderInfo.namema + "</p>" +
							"<p style='font-size: 11px:'>" + orderInfo.streetma + "</p>" +
							"<p style='font-size: 11px:'>" + orderInfo.cityma + ", " + orderInfo.statema + " " + orderInfo.zipma +"</p>" +
						"</li>");

				// Order products
				for (var i = 0; i < len; ++i) {
					order = orderList[i];
					GetSellerById(order.sellerid);
					list3.append("<li> " + 
				            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ order.pid + "/0.png\"/>" +
				            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + order.pname + "</h2>" + 
				             "<p class='order-page'>Brand: " + order.pbrand + "</p>" +
				             "<p class='order-page'>Model: " + order.pmodel + "</p>" +
				             "<div class=\"ui-li-aside\">" +
				             "<p class='account-info-user' style='font-weight: bold';>" + "$" + order.pfinalprice + "</p>" +
				             "<p class='order-page' style='color: #'>Sold by: " + orderSeller.username +"</p>" +
				               "</div></li>");
						totalPrice += parseFloat(order.pfinalprice);
					}
				
				// Payment Method
				list4.append("<li style='font-size: 11px;'>Credit Card: " + orderInfo.cardtype + " ***-" +orderInfo.cardnumber.substring(12, 16) + "</li>" +
							"<li style='font-size: 11px;'>Billing Address: " + orderInfo.streetba + " " +  orderInfo.cityba + ", " + orderInfo.stateba + "</li>");
				var grandTotal = totalPrice + 10;
				
				// Payment Information
				list5.append("<li data-icon='false'>" +
							"<p style='font-size: 11px;'>Item(s) Subtotal: </p>" +
							"<p style='font-size: 11px;'>Shipping & Handling: </p>" +
							"<div class='ui-li-aside'>" +
								"<p style='font-size: 11px;'>"  + "$" + totalPrice +"</p> " +
								"<p style='font-size: 11px;'>$10.00</p>" +
								"<p style='font-size: 11px; margin-top: 10px;'>"  + "$" + grandTotal +"</p>" +
							"</div>" +
							"<hr />" +
							"<p style='font-size: 11px;'>Grand Total: </p>" +	
						"</li><br />");
						
				 // Order Info
				 list1.append("<li>" +
							"<p style='font-size: 11px;'><b>Order Date: </b>" + orderInfo.penddate.substring(0,10) +"</p>" +
							"<p style='font-size: 11px;'><b>Order #: </b>" + orderInfo.orderid +"</p>" +
							"<p style='font-size: 11px;'><b>Order Total: </b>" + "$" + grandTotal + "</p></li>");
				
				list1.listview("refresh");
				$('#order-ship-header').html("Ship to");
				list2.listview("refresh");
				$('#order-shipped-header').html("Shipped on " + orderInfo.penddate.substring(0,10));
				list3.listview("refresh");
				$('#order-payment-header').html("Payment Method");
				list4.listview("refresh");
				$('#order-paymentinfo-header').html("Payment Information");
				list5.listview("refresh");
				$.mobile.loading("hide");
				$.mobile.navigate("#order-view-page");
				},
			 error: function(data, textStatus, jqXHR){
				 console.log("textStatus 33: " + textStatus);
				 $.mobile.loading("hide");
				$('#order-info-list').empty();
				$('#order-mailing-list').empty();
				$('#order-view-list').empty();
				$('#order-payment-list').empty();
				$('#order-total-list').empty();
			 }
		 });
	 }
	 else {
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	 }
 }

function GetSearchResults(searchInput) {
	 currentSearch = searchInput;
	 $.mobile.loading("show");
	 console.log("TESTING search results");
	 $.ajax({
		 url : "http://localhost:3412/ProjectServer/searchResults/" + searchInput,
		 method: 'get',
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
			 var productList = data.products;
			 var len = productList.length;
			 var list = $('#product-list');
			 list.empty();
			 var product;
			 for (var i=0; i < len; ++i) {
				 product = productList[i];
				 if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				 if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
			 $.mobile.loading("hide");
			 $.mobile.navigate("#search-results-page");
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus 4: " + textStatus);
			 $.mobile.loading("hide");
			 $("#product-list").empty();
			 // alert("Data not found!");
		 }
	 });
 }
			
function GetProductByCategory(category){
	currentCategory = category;
	$.mobile.loading("show");
	console.log("testing");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/categories/" + category,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var list = $("#category-search-list");
			list.empty();
			var productList = data.category;
			var len = productList.length;
			var product;
			var bids;
			for (var i=0; i < len; ++i){
				product = productList[i];
				var image;
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%'>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
				
				
			$.mobile.loading("hide");
			$.mobile.navigate("#category-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 5: " + textStatus);
			$.mobile.loading("hide");
			 $("#category-search-list").empty();
			// alert("Data not found!");
		}
	});
}

function GetSimilarProduct(){
	currentCategory = currentProduct.categoryname;
	$.mobile.loading("show");
	console.log("testing");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/categories/" + currentProduct.categoryname,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var list = $("#category-search-list");
			list.empty();
			var productList = data.category;
			var len = productList.length;
			// var list = $("#category-search-list");
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
			$.mobile.loading("hide");
			$.mobile.navigate("#category-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 6: " + textStatus);
			$.mobile.loading("hide");
			 $("#category-search-list").empty();
			// alert("Data not found!");
		}
	});
}

function sortCategoryBy(orderType){
	console.log("testing");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/orderCategoryBy/" + currentCategory + "/" + orderType,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.orderType;
			var len = productList.length;
			var list = $("#category-search-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
			// $.mobile.loading("hide");
			// $.mobile.navigate("#category-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 7: " + textStatus);
			$.mobile.loading("hide");
			 $("#category-search-list").empty();
			// alert("Data not found!");
		}
	});
}

function sortSearchBy(orderType){
	console.log("testing");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/orderSearchPage/" + currentSearch + "/" + orderType,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.orderType;
			var len = productList.length;
			var list = $("#product-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 8: " + textStatus);
			$.mobile.loading("hide");
			 $("#product-list").empty();
			// alert("Data not found!");
		}
	});
}

function sortItemsSalesBy(orderType){
	console.log("testing");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/itemsSalePage/" + currentProductSeller.uid + "/" + orderType,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.orderType;
			var len = productList.length;
			var list = $("#items-sale-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 9: " + textStatus);
			$.mobile.loading("hide");
			 $("#items-sale-list").empty();
		}
	});
}

function sortAccountItemsSalesBy(orderType){
	console.log("testing");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/itemsSalePage/" + currentUser.uid + "/" + orderType,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.orderType;
			var len = productList.length;
			var list = $("#account-items-sale-list");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if (product. pid > 17 ) {
					image = 0;
				}
				else {
					image = product.pid;
				}
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else if (product.numberofbids == null) {bids = "0 bids";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p class='Countdown' id='" + product.pid + "'>" + product.penddate + "</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ image + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		             "<p>Brand: " + product.pbrand + "</p>" +
		             "<p>Model: " + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.pprice + "</p>" +
		             "<p>" + product.penddate.substring(0,10)+"</p>" +
		               "</div></a></li>");
		         }
			 }
			 list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 12: " + textStatus);
			$.mobile.loading("hide");
			 $("#account-items-sale-list").empty();
		}
	});
}

function UpdateProduct(){
	$.mobile.loading("show");
	var form = $("#product-view-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updProduct = ConverToJSON(formData);
	updProduct.id = currentProduct.id;
	console.log("Updated Product: " + JSON.stringify(updProduct));
	var updProductJSON = JSON.stringify(updProduct);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products/" + updProduct.id,
		method: 'put',
		data : updProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 11: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				// alert("Data could not be updated!");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);	
			}
		}
	});
}

function DeleteProduct(){
	$.mobile.loading("show");
	var id = currentProduct.id;
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus 10: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				// alert("Product not found.");
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

/*
 * ################################## REGISTER FORM ############################################
 */

function SaveUser(){
	setTimeout(function() {
    $('#popupRegister').popup("open");
	},100);
		
	var form = $("#registerForm");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newUser = ConverToJSON(formData);
	console.log("New User: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/users",
		method: 'post',
		data : newUserJSON,
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	setTimeout(function() {
    			$('#popupRegister').popup("close");
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			localStorage.setItem( 'uid', data.uid );
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			if (data.status == 400){
				setTimeout(function() {
    			$('#popupMissingFields').popup("open");
				},10);	
			}
			else if (data.status == 500) {
				setTimeout(function() {
    			$('#popupExist').popup("open");
				},100);		
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);			}
		}
	});
}

function UpdateUser(){	
	var form = $("#update-user-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updUser = ConverToJSON(formData);
	updUser.uid = currentUser.uid;
	console.log("Updated User: " + JSON.stringify(updUser));
	if (updUser.updemail == '' && updUser.updpassword == '') {
		setTimeout(function() {
	    		$('#popupUpdateNoChanges').popup("open");
			},100);	
	}
	else {
		if (updUser.updpassword != '' && updUser.updpassword2 == '') {
			setTimeout(function() {
	    		$('#popupUpdateConfirmPwd').popup("open");
			},100);	
		} else if (updUser.updpassword2 != '' && updUser.updpassword == '') {
			setTimeout(function() {
	    		$('#popupUpdateNewPwd').popup("open");
			},100);	
		} else if (updUser.updpassword2 != updUser.updpassword) {
			setTimeout(function() {
	    		$('#popupUpdateNoMatch').popup("open");
			},100);	
		} else if (updUser.oldpassword == '') {
			setTimeout(function() {
	    		$('#popupUpdateCurPwd').popup("open");
			},100);	
		// } else if (updUser.oldpassword != currentUser.upassword) {
			// setTimeout(function() {
	    		// $('#popupUpdateCurNoMatch').popup("open");
			// },100);	
		}
		else {
			
			var verify = verifyCurrentPassword(currentUser.uid, updUser.oldpassword);
			if (verify == 1) {
				if (updUser.updemail == '') {
					updUser.updemail = currentUser.email;
				};
				if (updUser.updpassword == '') {
					updUser.updpassword = currentUser.upassword;
				};
				setTimeout(function() {
		    		$('#popupUpdateUser').popup("open");
				},100);
							
				var updUserJSON = JSON.stringify(updUser);
				$.ajax({
					url : "http://localhost:3412/ProjectServer/user/" + updUser.uid,
					method: 'put',
					data : updUserJSON,
					contentType: "application/json",
					dataType:"json",
					complete: function() {
			        	// request is complete, regardless of error or success, so hide image
			        	setTimeout(function() {
			    			$('#popupUpdateUser').popup("close");
							},20);
			   		},
					success : function(data, textStatus, jqXHR){
						form.each(function(){
						    this.reset();
						});
						setTimeout(function() {
			    			history.back();
							},50);	
					},
					error: function(data, textStatus, jqXHR){
						console.log("textStatus 14: " + textStatus);
						if (data.status == 404){
							setTimeout(function() {
						    $('#popupUpdateError').popup("open");
							},100);
						}
						else {
							$('#popupServer').popup();
							setTimeout(function() {
			    				$('#popupServer').popup("open");
							},100);	
						}
					}
				});
			}
			else {
				setTimeout(function() {
	    			$('#popupUpdateCurNoMatch').popup("open");
				},100);	
			};
		};
	};
}

function AddtoShoppingCart() {
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		$.ajax({
			url : "http://localhost:3412/ProjectServer/shoppingcart/" + currentUser.uid + "/" + currentProduct.pid,
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){
				setTimeout(function() {
    				$('#popupCartDuplicate').popup("open");
				},100);
			},
			error: function(data, textStatus, jqXHR) {
				if (data.status == 404) {
					$.ajax({
						url : "http://localhost:3412/ProjectServer/shoppingcart/" + currentUser.uid + "/" + currentProduct.pid,
						method: 'post',
						contentType: "application/json",
						dataType:"json",
						complete: function() {
				        	// request is complete, regardless of error or success, so hide image
				     		setTimeout(function() {
				   				$('#popupAddToCart').popup("close");
								}, 600);
				   		},
						success : function(data, textStatus, jqXHR){
				   				$('#popupAddToCart').popup("open");
						},
						error: function(data, textStatus, jqXHR){
							console.log("textStatus 15: " + textStatus);
							if (data.status == 404){
								// alert("Data could not be updated!");
							}
							else {
								$('#popupServer').popup();
								setTimeout(function() {
				    				$('#popupServer').popup("open");
								},100);	
							}
						}
					});
				}
			}
		});
	}
	else {
		setTimeout(function() {
    		$('#popupShoppingLogin').popup("open");
		},100);
	}
}
/********************************* BUY IT NOW FUCTION ***********************************/
function buyItNow() {
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		$.ajax({
			url : "http://localhost:3412/ProjectServer/buyItNow/" + currentUser.uid + "/" + currentProduct.pid,
			contentType: "application/json",
			success : function(data, textStatus, jqXHR){
				setTimeout(function() {
					$('#popupCartDuplicate').popup();
    				$('#popupCartDuplicate').popup("open");
				},100);
			},
			error: function(data, textStatus, jqXHR) {
				if (data.status == 404) {
					$.ajax({
						url : "http://localhost:3412/ProjectServer/shoppingcart/" + currentUser.uid + "/" + currentProduct.pid,
						method: 'post',
						contentType: "application/json",
						dataType:"json",
						complete: function() {
				        	// request is complete, regardless of error or success, so hide image
				     		setTimeout(function() {
				   				$('#popupAddToCart').popup("close");
								}, 600);
				   		},
						success : function(data, textStatus, jqXHR){
				   				$('#popupAddToCart').popup("open");
						},
						error: function(data, textStatus, jqXHR){
							console.log("textStatus 15: " + textStatus);
							if (data.status == 404){
								// alert("Data could not be updated!");
							}
							else {
								$('#popupServer').popup();
								setTimeout(function() {
				    				$('#popupServer').popup("open");
								},100);	
							}
						}
					});
				}
			}
		});
	}
	else {
		setTimeout(function() {
			$('#popupBuyItNowLogin').popup();
    		$('#popupBuyItNowLogin').popup("open");
		},100);
	}
}

/********************************* ADD MAILING ADDRESS FUCTION ***********************************/
function addMailingAddress() {
	setTimeout(function() {
    $('#popupAddressMa').popup("open");
	},100);
		
	var form = $("#add-maddress-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newAddress = ConverToJSON(formData);
	newAddress.uid = currentUser.uid;
	console.log("New Mailing Address: " + JSON.stringify(newAddress));
	
	var newAddressSON = JSON.stringify(newAddress);
	var option;
	
	if (newAddress.fistLastNameMa == '' || newAddress.phoneNumberMa == '' || newAddress.addressMa == '' ||
	newAddress.streetMa == '' || newAddress.zipBa == '' || newAddress.cityBa == '' || newAddress.stateBa == '') {
		// alert('Missing Fields');
	} else {
		if(currentUser.poptionma == null) {
			option = 1;
		} else {
			option = 0;
		}
			$.ajax({
				url : "http://localhost:3412/ProjectServer/addMailingAddress/" + option,
				method: 'post',
				data : newAddressSON,
				contentType: "application/json",
				dataType:"json",
				complete: function() {
		        	// request is complete, regardless of error or success, so hide image
		        	setTimeout(function() {
		    			$('#popupAddressMa').popup("close");
						},50);
		   		},
				success : function(data, textStatus, jqXHR){
					form.each(function(){
					    this.reset();
					});
					setTimeout(function() {
		    			history.back();
						},100);	
				},
				error: function(data, textStatus, jqXHR){
					if (data.status == 500) {
						setTimeout(function() {
		    			$('#popupAddressError').popup("open");
						},100);		
					}
					else {
						$('#popupServer').popup();
						setTimeout(function() {
		    				$('#popupServer').popup("open");
						},100);			
						}
				}
			});
	};
}

/********************************* ADD CREDIT CARD FUCTION ***********************************/
function addCreditCard() {		
	var form = $("#add-creditcard-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newCard = ConverToJSON(formData);
	newCard.uid = currentUser.uid;
	console.log("New Credit Card: " + JSON.stringify(newCard));
	
	var newCardJSON = JSON.stringify(newCard);
	var option;
	
	if (newCard.fistLastNameCD == '' || newCard.card_number == '' || newCard.cardType == '' ||
		newCard.cardExp == '' || newCard.phoneNumberCD == '' || newCard.addressBa == '' ||
		newCard.streetBa == '' || newCard.cityBa == '' || newCard.stateBa == '') {
		setTimeout(function() {
    	$('#popupPaymentMissing').popup("open");
		},100);
	} 
	else if (newCard.card_number.length < 16) {
		setTimeout(function() {
    	$('#popupPaymentCard').popup("open");
		},100);
	}
	else if(newCard.cardExp.substring(0,2) < 1 || newCard.cardExp.substring(0,2) > 12) {
		setTimeout(function() {
    	$('#popupPaymentDate').popup("open");
		},100);
	} else if (newCard.cardExp.substring(3,5) <= 13) {
		setTimeout(function() {
    	$('#popupPaymentCardExpire').popup("open");
		},100);
	}
	else if (newCard.svn.length < 3) {
		setTimeout(function() {
    	$('#popupPaymentSVN').popup("open");
		},100);
	}
	else if (newCard.phoneNumberCD.length < 10) {
		setTimeout(function() {
    	$('#popupPaymentPhone').popup("open");
		},100);
	}
	else if (newCard.zipBa.length != 5) {
		setTimeout(function() {
    	$('#popupPaymentZip').popup("open");
		},100);
	}
	else {
		if(currentUser.cardid == null) {
			option = 1;
			//Updating credit card priamry option
		} else {
			option = 0;
			//No update to credit card primary optiion
		}
		setTimeout(function() {
    		$('#popupCreditCard').popup("open");
		},100);
			$.ajax({
				url : "http://localhost:3412/ProjectServer/addCreditCard/" + option,
				method: 'post',
				data : newCardJSON,
				contentType: "application/json",
				dataType:"json",
				complete: function() {
		        	// request is complete, regardless of error or success, so hide image
		        	setTimeout(function() {
		    			$('#popupCreditCard').popup("close");
						},50);
		   		},
				success : function(data, textStatus, jqXHR){
					form.each(function(){
					    this.reset();
					});
					setTimeout(function() {
		    			history.back();
						},100);	
				},
				error: function(data, textStatus, jqXHR){
					if (data.status == 500) {
						setTimeout(function() {
		    			$('#popupPaymentError').popup("open");
						},100);		
					}
					else {
						$('#popupServer').popup();
						setTimeout(function() {
		    				$('#popupServer').popup("open");
						},100);			
						}
				}
			});
	};
}

function hasMailingAddres() {
	if (currentUser.maddressid != null) {
		hasCreditCard();
	} else {
		$.mobile.navigate("#add-shipping-info-page");
	};
}

function hasCreditCard() {
	if (currentUser.cardid != null) {
		$.mobile.navigate("#checkout-page");
	} else {
		$.mobile.navigate("#add-payment-info-page");
	};
}

function Checkout(){
	var userOrder = {"buyerid": currentUser.uid, "orderdate": "2013-12-31", "status": "pending", "shippingoption" : "standard", "cardid" : currentUser.cardid, "maddressid" : currentUser.maddressid};
	newOrderJSON = JSON.stringify(userOrder);
	var orderid;
		
		console.log("New Order: " + JSON.stringify(userOrder));
	$.ajax({
		url : "http://localhost:3412/ProjectServer/customerOrder",
		method: 'post',
		data : newOrderJSON,
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	// setTimeout(function() {
    			// $('#popupRegister').popup("close");
				// },50);
   		},
		success : function(data, textStatus, jqXHR){
				setTimeout(function() {
    				$('#popupOrderPlaced').popup("open");
				},100);	
				
			var list = $('#cart-list');
			list.empty();
			list.listview('refresh');
			$('#cart-empty').show();
			$('#cart-edit').hide();
			$("#cart-info").hide();
			
		},
		error: function(data, textStatus, jqXHR){
			// if (data.status == 400){
				// setTimeout(function() {
    			// $('#popupMissingFields').popup("open");
				// },10);	
			// }
			// else if (data.status == 500) {
				// setTimeout(function() {
    			// $('#popupExist').popup("open");
				// },100);		
			// }
			// else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);			//}
		}
	});
}

function hasMailingAddresbuyItNow() {
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		if (currentUser.maddressid != null) {
			hasCreditCardbuyItNow();
		} else {
			$.mobile.navigate("#add-shipping-info-page");
		};
	}
	else {
		setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	}
	
}

function hasCreditCardbuyItNow() {
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		if (currentUser.cardid != null) {
			$.mobile.navigate("#checkout-buyItNow-page");
		} else {
			$.mobile.navigate("#add-payment-info-page");
		};
	}
	else {
		setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	}	
}

function CheckoutbuyItNow(){
	var userOrder = {"buyerid": currentUser.uid, "pid": currentProduct.pid, "status": "pending", "shippingoption" : "standard", "cardid" : currentUser.cardid, "maddressid" : currentUser.maddressid};
	newOrderJSON = JSON.stringify(userOrder);
	var orderid;
		
	console.log("New Order: " + JSON.stringify(userOrder));
	$.ajax({
		url : "http://localhost:3412/ProjectServer/customerOrderbuyitnow",
		method: 'post',
		data : newOrderJSON,
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	// setTimeout(function() {
    			// $('#popupRegister').popup("close");
				// },50);
   		},
		success : function(data, textStatus, jqXHR){
			$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupBuyItNow').popup("open");
				},100);	
		},
		error: function(data, textStatus, jqXHR){
			// if (data.status == 400){
				// setTimeout(function() {
    			// $('#popupMissingFields').popup("open");
				// },10);	
			// }
			// else if (data.status == 500) {
				// setTimeout(function() {
    			// $('#popupExist').popup("open");
				// },100);		
			// }
			// else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);			//}
		}
	});
}

function placeBidAlert(){
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		setTimeout(function() {
			$('#placeBidAlert').popup();
    		$('#placeBidAlert').popup("open");
		},100);
	}
	else {
		$('#popupBidLogin').popup();
			setTimeout(function() {
    			$('#popupBidLogin').popup("open");
			},100);
	}
}

function bidOnProduct(){
	var uid =  localStorage.getItem('uid');
		var userbidprice = $('#userbidprice').val();	
		if (userbidprice  > currentProduct.currentbidprice) {
			$.ajax({
			url : "http://localhost:3412/ProjectServer/bidonproduct/" + currentProduct.auctionid + "/" + currentUser.uid + "/" + userbidprice,
			method: 'post',
			contentType: "application/json",
			dataType:"json",
			success : function(data, textStatus, jqXHR){
				
		        setTimeout(function(){
		          $("#placeBidAlert").popup("close");
		        }, 100);
		        setTimeout(function(){
		          $("#popupBidder").popup();
		          $("#popupBidder").popup("open");
		          	        GetProductBid(currentProduct.pid, currentProduct.sellerid);
		        $('#product-price').html(currentProduct.currentbidprice);
		        }, 300);
			},
			error: function(data, textStatus, jqXHR){
				// if (data.status == 400){
					// setTimeout(function() {
	    			// $('#popupMissingFields').popup("open");
					// },10);	
				// }
				// else if (data.status == 500) {
					// setTimeout(function() {
	    			// $('#popupExist').popup("open");
					// },100);		
				// }
				// else {
					$('#popupServer').popup();
					setTimeout(function() {
	    				$('#popupServer').popup("open");
					},100);			//}
			}
		});
		} else{
			var price = currentProduct.currentbidprice + 1;
			$('#bidPriceMessage').html("Bid must be at least $" + price + ".");
	        setTimeout(function(){
	          $("#placeBidAlert").popup("close");
	        }, 100);
	        setTimeout(function(){
	          $("#popupBidPrice").popup();
	          $("#popupBidPrice").popup("open");
	        }, 300);
		};
}

function ClearCart(){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/shoppingcart/" + currentUser.uid,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
        	// setTimeout(function() {
    			// $('#popupRegister').popup("close");
				// },50);
   		},
		success : function(data, textStatus, jqXHR){
			var list = $('#cart-list');
			list.empty();
			list.listview('refresh');
			$('#cart-empty').show();
			$("#cart-delete").hide();
			$('#cart-edit').hide();
			$("#cart-info").hide();
			$("#cart-clear").hide();
		},
		error: function(data, textStatus, jqXHR){
			// if (data.status == 400){
				// setTimeout(function() {
    			// $('#popupMissingFields').popup("open");
				// },10);	
			// }
			// else if (data.status == 500) {
				// setTimeout(function() {
    			// $('#popupExist').popup("open");
				// },100);		
			// }
			// else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);			//}
		}
	});
}
			
function deleteItemCart(pid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/deleteItemCart/" + currentUser.uid + "/" + pid,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var list = $('#cart-list');
			$('#cart-list-' + pid).remove();
		    $('#cart-btn-' + pid).remove();
			list.listview('refresh');
			$("#cart-info").hide();
			GetCartInfo();

		},
		error: function(data, textStatus, jqXHR){
			// if (data.status == 400){
				// setTimeout(function() {
    			// $('#popupMissingFields').popup("open");
				// },10);	
			// }
			// else if (data.status == 500) {
				// setTimeout(function() {
    			// $('#popupExist').popup("open");
				// },100);		
			// }
			// else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);			//}
		}
	});
}



function GetCartInfo() {
	$.ajax({
		url : "http://localhost:3412/ProjectServer/cartInfo/" + currentUser.uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var cartInfoList = data.shoppingcart;
			cartInfo = cartInfoList[0];
			
			if(cartInfo.totalitems == 0) {
				$('#cart-clear').hide();
				$('#cart-delete').hide();
				$('#cart-edit').hide();
				$('#cart-done').hide();
				$("#cart-info").hide();
				$("#cart-empty").show();
			}
			else {
				$("#cart-subtotal").html("Subtotal (" + cartInfo.totalitems + " Items): $" + cartInfo.totalprice);
				$("#cart-shipping").html("Shipping: $10");
				var totalPrice = parseFloat(cartInfo.totalprice) + 10.00;
				$("#cart-line").show();
				$("#cart-grandtotal").html("Grand total: $" + totalPrice);
				$("#cart-info").show();
			}

		},
		error: function(data, textStatus, jqXHR){
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
		}
	});
}

function GetCheckoutInfo() {
	$.ajax({
		url : "http://localhost:3412/ProjectServer/cartInfo/" + currentUser.uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var cartInfoList = data.shoppingcart;
			checkout = cartInfoList[0];
// 			
			// if(cartInfo.totalitems == 0) {
				// $('#checkout-clear').hide();
				// $('#cart-delete').hide();
				// $('#cart-edit').hide();
				// $('#cart-done').hide();
				// $("#cart-info").hide();
			// }
			// else {
				$("#checkout-subtotal").html("Subtotal (" + checkout.totalitems + " Items): $" + checkout.totalprice);
				$("#checkout-shipping").html("Shipping: $10");
				var totalPrice = parseFloat(checkout.totalprice) + 10.00;
				$("#checkout-line").show();
				$("#checkout-grandtotal").html("Grand total: $" + totalPrice);
				$("#checkout-info").show();
			// }

		},
		error: function(data, textStatus, jqXHR){
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
		}
	});
}

function GetCreditCardCheckout() {
	$.ajax({
		url : "http://localhost:3412/ProjectServer/creditCard/" + currentUser.cardid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var creditCardList = data.creditCard;
			creditCard = creditCardList[0];
// 			
			// if(cartInfo.totalitems == 0) {
				// $('#checkout-clear').hide();
				// $('#cart-delete').hide();
				// $('#cart-edit').hide();
				// $('#cart-done').hide();
				// $("#cart-info").hide();
			// }
			// else {
				$("#checkout-payment-card").html(creditCard.nameoncard + ", " + creditCard.cardtype + ", " + creditCard.cardnumber.substring(12, 16) + ", " + creditCard.expirationdate.substring(0, 7));
				$("#checkout-payment-baddress").html(creditCard.streetba + " " + creditCard.cityba + ", " + creditCard.stateba + " " + creditCard.zipba);

			// }

		},
		error: function(data, textStatus, jqXHR){
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
		}
	});
}

function GetCreditCardBuyItNow() {
	$.ajax({
		url : "http://localhost:3412/ProjectServer/creditCard/" + currentUser.cardid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var creditCardList = data.creditCard;
			creditCard = creditCardList[0];
// 			
			// if(cartInfo.totalitems == 0) {
				// $('#checkout-clear').hide();
				// $('#cart-delete').hide();
				// $('#cart-edit').hide();
				// $('#cart-done').hide();
				// $("#cart-info").hide();
			// }
			// else {
				$("#checkout-buyItNow-payment-card").html(creditCard.nameoncard + ", " + creditCard.cardtype + ", " + creditCard.cardnumber.substring(12, 16) + ", " + creditCard.expirationdate.substring(0, 7));
				$("#checkout-buyItNow-payment-baddress").html(creditCard.streetba + " " + creditCard.cityba + ", " + creditCard.stateba + " " + creditCard.zipba);

			// }

		},
		error: function(data, textStatus, jqXHR){
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
		}
	});
}

function deleteShippingAddress(maddressid, uid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/deleteShippingAddress/" + maddressid,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var list = $('#shipping-info-list');
			$('#shipping-info-list1-' + maddressid).remove();
			$('#shipping-info-list2-' + maddressid).remove();
		    $('#shipping-info-btn-' + maddressid).remove();
		    GetShippingInfo(uid);
			list.listview('refresh');
		},
		error: function(data, textStatus, jqXHR){
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
		}
	});
}

function GetShippingInfo(uid) {
	$.ajax({
		url : "http://localhost:3412/ProjectServer/getShippingAddresses/" + uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		error: function(data, textStatus, jqXHR) {
			if (data.status == 404){
				console.log("textStatus 21: " + textStatus);
				var list = $('#shipping-info-list');
				list.empty();
				
				$('#shipping-info-delete').hide();
				$('#shipping-info-edit').hide();
				$('#shipping-info-done').hide();
				$("#shipping-info-header").hide();
				$("#shipping-info-empty").show();
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

function deleteCreditCard(cardid, baddressid, uid){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/deleteCreditCard/" + cardid +"/" + baddressid,
		method: 'put',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			var list = $('#shipping-info-list');
			$('#payment-info-list1-' + cardid).remove();
			$('#payment-info-list2-' + cardid).remove();
			$('#payment-info-list3-' + cardid).remove();
		    $('#payment-info-btn-' + cardid).remove();
		    GetPaymentInfo(uid);
			list.listview('refresh');
		},
		error: function(data, textStatus, jqXHR){
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
		}
	});
}

function GetPaymentInfo(uid) {
	$.ajax({
		url : "http://localhost:3412/ProjectServer/getCreditCard/" + uid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		error: function(data, textStatus, jqXHR) {
			if (data.status == 404){
				console.log("textStatus 21: " + textStatus);
				var list = $('#payment-info-list');
				list.empty();
				
				$('#payment-info-delete').hide();
				$('#payment-info-edit').hide();
				$('#payment-info-done').hide();
				$("#payment-info-header").hide();
				$("#payment-info-empty").show();
			}
			else {
				$('#popupServer').popup();
				setTimeout(function() {
    				$('#popupServer').popup("open");
				},100);
			}
		}
	});
}

 function GetReportsbyDate() {
     var date=$('#reportDate').val();
     console.log(date);
     console.log("TESTING");
     $.ajax({
         url : "http://localhost:3412/ProjectServer/reportList/"+ date,
         contentType: "application/json",
         success : function(data, textStatus, jqXHR){
             //alert(a);
             var reportList = data.reportList;
             var len = 0;
             len = reportList.length;
             var report;
             //currentUser has been set at this point
             $("#noReports").html("");
             $("#reports-list").empty();
             for(var i = 0; i < len ; i++)
             {
                 report = reportList[i];
                 $("#reports-list").append("<li class = \"ui-li\" style= \"height : 40px\">"+ report.pname + "<p>Payment: " + report.paymentoption + "</p>" +"<div class = \"ui-li-aside ui-li-desc\">"+
         "<p><b>Status: " + report.status +"</b></p><p>S&H: "+ report.shippingoption +"</p></div></li>" );
             } 
 
             $("#reports-list").listview("refresh");
         },
         error: function(data, textStatus, jqXHR){
             console.log("textStatus 16: " + textStatus);
             $("#noReports").html("No records on this date");
             $("#reports-list").empty();
             $("#reports-list").listview("refresh");
         }
     });
    
 };

function AddCategory() 
{
	var category=$('#categoryToBeAdded').val();
	var found = findCategory(category);
	if(found==0)
	{
		$.ajax({
			url : "http://localhost:3412/ProjectServer/addCategory/" + category,
			method: 'post',
			contentType: "application/json",
			dataType:"json",
			success : function(data, textStatus, jqXHR){
				// alert(username + " " + password + "id = " + data.user.uid);
				setTimeout(function() {
	    			$('#addCategoryAlertSuccess').popup("open");
					},50);
			},
			error: function(data, textStatus, jqXHR){
				console.log("textStatus: " + textStatus);
				 console.log("textStatus: " + textStatus);
	             // alert("Category could not be added");
			}
		});	
	}
	else if(found == 1)
	{
		setTimeout(function() {
    			$('#existingCategoryAddAlert').popup("open");
				},50);
	}
}

function findCategory(category) 
{
	var found;
	$.ajax({
		url : "http://localhost:3412/ProjectServer/findCategory/" + category,
		method: 'get',
		contentType: "application/json",
		async: false,
		dataType:"json",
		success : function(data, textStatus, jqXHR){
					found = 1;	
		},
		error: function(data, textStatus, jqXHR){
			found = 0;
		}
	});
	return found;
}

function UpdateCategory()
{
	var categoryOld=$('#categoryToBeUpdated').val();
	var foundOld = findCategory(categoryOld);
	var categoryNew=$('#newCategory').val();
	var foundNew = findCategory(categoryNew);
	if(foundOld==0)
	{
		setTimeout(function() {
    			$('#nonExistingCategoryUpdateAlert').popup("open");
				},50);
	}
	if(foundNew==1)
	{
		setTimeout(function() {
    			$('#existingCategoryUpdateAlert').popup("open");
				},50);
	}
	// alert(foundOld +"   " +foundNew);
	if(foundOld==1 && foundNew ==0)
	{
		$.ajax({
		url : "http://localhost:3412/ProjectServer/updateCategory/" + categoryOld + "/" + categoryNew,
		method: 'put',
		contentType: "application/json",
		async: false,
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			setTimeout(function() {
    			$('#updateCategoryAlertSuccess').popup("open");
				},50);
		},
		error: function(data, textStatus, jqXHR){
			// alert("Category could not be updated");
		}
	});
	}
}

function RemoveCategory() 
{
	var category=$('#categoryToBeRemoved').val();
	var found = findCategory(category);
	if(found==1)
	{
		// alert(category);
		$.ajax({
			url : "http://localhost:3412/ProjectServer/removeCategory/" + category,
			method: 'put',
			contentType: "application/json",
			dataType:"json",
			success : function(data, textStatus, jqXHR){
				// alert(username + " " + password + "id = " + data.user.uid);
				setTimeout(function() {
    			$('#removeCategoryAlertSuccess').popup("open");
				},50);
			},
			error: function(data, textStatus, jqXHR){
				console.log("textStatus: " + textStatus);
	             // alert("Category could not be removed");
			}
		});	
	}
	else if(found == 0)
	{
		setTimeout(function() {
    			$('#nonExistingCategoryRemoveAlert').popup("open");
				},50);
	}
}
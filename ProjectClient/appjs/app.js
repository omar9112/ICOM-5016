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

$(document).on('click', '#loginSubmit', function(){
	GetUser($('#username').val(), $('#password').val());
	
});   

$(document).on('click', '#okButton', function(){  
			$('#popupLoginMessage').popup();
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

$(document).on('pageinit', function(event){
  	$.mobile.defaultPageTransition = 'slide';
	$( "body" ).on( 'swiperight', function() {history.back();}); 
	$( "body" ).on( 'swipeleft', function() {history.forward();});   
	$("a").attr("data-transition", "fade");
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

// $(document).on('click', '#cart-clear', function(){
	// for(var i = 0; i < 20; i++)
	// {
		// $('#cart-list-' + i).remove();
		// $('#cart-btn-' + i).remove();
	// }
	// totalPrice = 0;
	// $("#cart-subtotal").html("Subtotal (0 Items): $" + totalPrice);
	// $("#cart-shipping").html("Shipping: $0.00");
	// $("#cart-grandtotal").html("Grand total: $" + totalPrice);
	// $('#cart-done').hide();
	// $('#cart-clear').hide();
	// $('#cart-edit').hide();
// 
// }); 

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
	var uid =  localStorage.getItem('uid');
       
       if( uid != null) {
        	// alert(localStorage.getItem('uid'));
       		GetUserById(uid);
	    	$("#signIn").hide();
	    	$("#myNavbar").show();
	    	$("#seller").show();
	    	$("#userli").show();
	    	$("#user").html(currentUser.username);
	    	$("#cartCount").html(currentUser.itemincart);
	    	$("#buyingCount").html(currentUser.buying);
	    	$("#sellingCount").html(currentUser.itemselling);

	    	
	} else{
	    	$("#signIn").show();
	    	$("#myNavbar").hide();
	    	$("#seller").hide();
	    	$("#userli").hide();
	};	
});

// Add all catagories in the database to a list.
 $(document).on('pagebeforeshow', '#search-page' ,function( event, ui ) {
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
				  "<img src='images/icons/76-baby.png' class='ui-li-icon ui-corner-none'/>" + category.categoryname + "</a></li>"); 
			 }
			 list.listview("refresh");	
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus: " + textStatus);
			 alert("Categories not found!");
		 }
	 });
 });
 
 // Gets the information of the current product.
 $(document).on('pagebeforeshow', "#product-view", function( event, ui ) {

	 //currentProduct has been set at this point
	 for(var i = 0; i < 3; i++)
	 {
		 $("#image" + i).html("<img src=\"images/products/" + currentProduct.pid + "/" + i + ".png\" />");
	 }
	
	 $("#product-name").html(currentProduct.pname);
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
			 console.log("textStatus: " + textStatus);
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
			 console.log("textStatus: " + textStatus);
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
		$('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, true, true);
	}
 });
 
$(document).on('pagebeforeshow', "#seller-feedback-page", function( event, ui ) {
	
	// currentSeller has been set at this point
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
			 console.log("textStatus: " + textStatus);
			 alert("Data not found!");
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
			$.mobile.changePage('#account-info-page', false, false, true);
		});  
		
		//Recent Feedback
		$(document).on('click', '#account-profile', function(){     
			$.mobile.changePage('#account-profile-page', false, false, true);
		});  
				
		//Order History
		$(document).on('click', '#account-order', function(){     
			$.mobile.changePage('#order-history-page', false, false, true);
		});
		
		//Selling Items
		$(document).on('click', '#account-selling', function(){
			$.mobile.changePage('#account-items-sale-page', false, false, true);
		});  

		//Sale History
		$(document).on('click', '#account-history', function(){     
			$.mobile.changePage('#account-sale-history-page', false, false, true);
		}); 
		
		//Shipping Addresses
		$(document).on('click', '#account-shipping', function(){     
			$.mobile.changePage('#shipping-info-page', false, false, true);
		});  
		
		//Payment Info
		$(document).on('click', '#account-payment', function(){     
			$.mobile.changePage('#payment-info-page', false, false, true);
		});  
		
		//Administrator
		$(document).on('click', '#account-admin', function(){     
			$.mobile.changePage('#administrator-page', false, false, true);
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
			$.mobile.changePage('#login-page', false, false, true);
		});  

		//Recent Feedback
		$(document).on('click', '#account-profile', function(){     
			$.mobile.changePage('#login-page', false, false, true);
		});  		
		//Order History
		$(document).on('click', '#account-order', function(){     
			$.mobile.changePage('#login-page', false, false, true);
		});
		
		//Selling Items
		$(document).on('click', '#account-selling', function(){     
			$.mobile.changePage('#login-page', false, false, true);
		});  

		//Sale History
		$(document).on('click', '#account-history', function(){     
			$.mobile.changePage('#login-page', false, false, true);
		}); 
		
		//Shipping Addresses
		$(document).on('click', '#account-shipping', function(){     
			$.mobile.changePage('#login-page', false, false, true);
		});  
		
		//Payment Info
		$(document).on('click', '#account-payment', function(){     
			$.mobile.changePage('#login-page', false, false, true);
		});  
	}
});

$(document).on('pagebeforeshow', "#account-info-page", function( event, ui ) {
	var uid = localStorage.getItem('uid');
	if(uid != null) {
		GetUserById(uid);
		
		// currentUser has been set at this point
		$("#account-info-header").html("Hello "+ currentUser.fname + "!");
		document.getElementById("account-image").style.backgroundImage = "url('images/users/" + uid + ".png')";
	    $("#account-info-username").html(currentUser.username);
		$("#account-info-state").html("State: "+ currentUser.statema);	    
	    $("#account-info-phone").html("Telephone: "+ currentUser.phonenumber);
	    
	    var name = currentUser.fname + " " +currentUser.lname;
		$('#account-name').attr("value", name);
		$('#upd-email').attr("placeholder", currentUser.email);
	    
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
       $('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
       // $.mobile.changePage("#login-page",false, true, true);
    }
	
});

$(document).on('pagebeforeshow', "#order-history-page", function( event, ui ) {
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
		$.ajax({
		url : "http://localhost:3412/ProjectServer/orderHistory/" + uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var orderList = data.orderhistory;
			var len = 0;
			len = orderList.length;
			itemTotal = len;
			var list = $('#order-history-list');
			list.empty();
			var order;
			for (var i = 0; i < len; ++i) {
			order = orderList[i];
			list.append("<li>" + 
		             "<p style='font-size: 11px;'><b>Order Date: </b>" + order.orderdate.substring(0, 10) + "</p>" + 
		             "<p style='font-size: 11px;'><b>Recipient: </b>" + order.namema + "</p>" +
		             "<p style='font-size: 11px;' ><b>Items Ordered: </b>" + order.orderitems + "</p></li>" +
		              "<li><a href='#order-view-page' onclick=\"GetOrderView(" + order.orderid + ")\" data-role='bottom' style='font-size: 14px; color: #55A244; padding: 0'><center>View order</center></a></li><br />");
			}			
			list.listview("refresh");
			},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Order history not found!");
		}
		});
	}
	else {
		$('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
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
       		alert('You are not an administrator');
	    }
	}
	else {
       $('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
       // $.mobile.changePage("#login-page",false, true, true);
    }
	
});

$(document).on('pagebeforeshow', "#cart-page", function( event, ui ) {
	totalPrice = 0;
	$('#cart-empty').hide();
	$('#cart-delete').hide();
	$('#cart-done').hide();
	$('#cart-clear').hide();
	$('#cart-line').hide();
	$('#cart-checkout').hide();
	var uid =  localStorage.getItem('uid');
	if(uid != null) {
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
			list.append("<li id='cart-list-" + product.pid + "'style='margin-top: 8px;'><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
			       		"<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
			var list = $('#cart-list');
			list.empty();
			$('#cart-empty').show();
			$('#cart-edit').hide();
			$("#cart-info").hide();
			}
		});
	}
	else {
		$('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	}
});


$(document).on('pagebeforeshow', "#order-confirmation", function( event, ui ) {
	
	if(currentUser.uid != undefined) {
		// currentUser has been set at this point
		$("#itemNumber").html("Items ("+ itemTotal+")");
		$("#totalPrice").html("Total price: $"+ totalPrice);
		$("#order-street").html("Street Address: "+ currentUser.streetma);
		$("#order-state").html("State: "+ currentUser.statema);
		$("#order-city").html("City: "+ currentUser.cityma);
	    $("#order-zip").html("Zip Code: "+ currentUser.zipma);
	}
	else {
		$('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	}
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
			$('#account-sale-history-list').empty();
			$('#noHistoryAccountSale').html("No history sales.");	
		}
	});
	}
	else {
		$('#popupLoginMessage').popup();
				setTimeout(function() {
    				$('#popupLoginMessage').popup("open");
				},100);
	    // $.mobile.changePage("#login-page",false, false, true);
	}
	
});

$(document).on('pagebeforeshow', "#seller-page", function( event, ui ) {
	// currentSeller has been set at this point
	$("#seller-header").html(currentProductSeller.fname + " " + currentProductSeller.lname);
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
	$.mobile.loading("show");
	var form = $("#product-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newProduct = ConverToJSON(formData);
	console.log("New Product: " + JSON.stringify(newProduct));
	var newProductJSON = JSON.stringify(newProduct);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products",
		method: 'post',
		data : newProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});


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
			console.log("textStatus: " + textStatus);
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
			console.log("textStatus: " + textStatus);
			// $.mobile.loading("hide");
			if (data.status == 404){
				alert("Seller not found.");
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
			console.log("textStatus: " + textStatus);
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
			console.log("textStatus: " + textStatus);
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

function GetUser(username, password) {
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
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			// alert(username + " " + password + "id = " + data.user.uid);
              localStorage.setItem( 'uid', data.user.uid );
              // alert(localStorage.getItem('uid'));
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			if (data.status == 500){
				setTimeout(function() {
    			$('#popupDialogLogin').popup("open");
				},100);			}
			else if (data.status == 404) {
				setTimeout(function() {
    			$('#popupLoginMissing').popup("open");
				},10);	
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
				            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/orders/"+ order.pid + "/0.png\"/>" +
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
				 console.log("textStatus: " + textStatus);
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
	 	$('#popupLoginMessage').popup();
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
				 if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			 console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%'>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
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
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		         	if (product.numberofbids == 1) { bids = "1 bid";} else{ bids = product.numberofbids + " bids";};
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img width='80' height'80' style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2 style='font-size: 12px; color: #4F4F4F; font-weight: bold; width: 80%''>" + product.pname + "</h2>" + 
		            "<p>Brand: " + product.pbrand + "</p>" +
		            "<p>Model: " + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class='account-info-user' style='font-weight: bold';>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ bids + "</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a></li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img style='position:absolute; !important; top:0; !important; bottom:0; !important; margin:auto; !important;' class='listImg' src=\"images/products/"+ product.pid + "/0.png\"/>" +
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
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			 $("#account-items-sale-list").empty();
		}
	});
}

function buyItNow()
{
	// totalPrice = currentProduct.pprice;
	// itemTotal =  1;
	// $.mobile.navigate("#order-confirmation");
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
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
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
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Product not found.");
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

function GetUser(username, password) {
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
				},50);
   		},
		success : function(data, textStatus, jqXHR){
			// alert(username + " " + password + "id = " + data.user.uid);
              localStorage.setItem( 'uid', data.user.uid );
              // alert(localStorage.getItem('uid'));
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			if (data.status == 500){
				setTimeout(function() {
    			$('#popupDialogLogin').popup("open");
				},100);			}
			else if (data.status == 404) {
				setTimeout(function() {
    			$('#popupLoginMissing').popup("open");
				},10);	
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
	var updUserJSON = JSON.stringify(updUser);
	$.ajax({
		url : "http://localhost:3412/ProjectServer/user/" + updUser.uid,
		method: 'put',
		data : updUserJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			alert("Success");
			$.mobile.navigate("#home-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			if (data.status == 404){
				alert("Data could not be updated!");
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

function AddtoShoppingCart(){
	$.ajax({
		url : "http://localhost:3412/ProjectServer/shoppingcart/" + currentUser.uid + "/" + currentProduct.pid,
		method: 'post',
		contentType: "application/json",
		dataType:"json",
		complete: function() {
        	// request is complete, regardless of error or success, so hide image
     		setTimeout(function() {
   				$('#popupAddToCart').popup("close");
				},600);
   		},
		success : function(data, textStatus, jqXHR){
   				$('#popupAddToCart').popup("open");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			if (data.status == 404){
				alert("Data could not be updated!");
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

function Checkout(){
	// setTimeout(function() {
    // $('#popupRegister').popup("open");
	// },100);
// 	
		// var form = $("#registerForm");
	// var formData = form.serializeArray();
	// console.log("form Data: " + formData);
	// var newUser = ConverToJSON(formData);
	// console.log("New User: " + JSON.stringify(newUser));
	// var newUserJSON = JSON.stringify(newUser);
// 	
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

function bidOnProduct(){
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
				$("#cart-info").hide();
				$('#cart-clear').hide();
				$('#cart-delete').hide();
				$('#cart-edit').hide();
				$('#cart-done').hide();
			} else {
				$("#cart-subtotal").html("Subtotal (" + cartInfo.totalitems + " Items): $" + cartInfo.totalprice);
				$("#cart-shipping").html("Shipping: $10");
				var totalPrice = cartInfo.totalprice + 10.00;
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
             console.log("textStatus: " + textStatus);
             $("#noReports").html("No records on this date");
             $("#reports-list").empty();
             $("#reports-list").listview("refresh");
         }
     });
    
 };

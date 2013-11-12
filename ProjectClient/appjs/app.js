var currentUser = {};
var currentProduct = {};
var currentProductSeller = {};
var currentCategory = {};
var totalPrice = 0;
var itemTotal = 0;

// Validate register page
 $(document).on("pageshow", "#registerPage", function() {
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
 * PRODUCTS
 * 
 */
 $(document).on('pagebeforeshow', function( event, ui ) {
	 console.log("TESTING");
	 $.ajax({
		 url : "http://kiwi-server.herokuapp.com/ProjectServer/products",
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
			 var productList = data.products;
			 var len = productList.length;
			 var list = $('ul.products');
			 list.empty();
			 var product;
			 for (var i=0; i < len; ++i) {
				 product = productList[i];
				 if(product.ppricemethod.toLowerCase()=="bid")
		         {
		            list.append("<li class=\"ui-screen-hidden\" ><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2>" + product.pname + "</h2>" + 
		            "<p>" + product.pbrand + "</p>" +
		            "<p>" + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p class=\"item_price\">" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ product.numberofbids + " bids</p>" +
		                "<p>"+ product.penddate.substring(0, 10) + "</p>" +
		              "</div></a>" +
		                  "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		              "</li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li class=\"ui-screen-hidden\" ><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		             "<h2>" + product.pname + "</h2>" + 
		             "<p>" + product.pbrand + "</p>" +
		             "<p>" + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p class=\"item_price\">" + "$" + product.pprice + "</p>" +
		             "<p>"+product.penddate.substring(0, 10) +"</p>" +
		               "</div></a>" +
		                   "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		               "</li>");
		         }
			 }
			 list.listview("refresh");	
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus: " + textStatus);
			 alert("Products not found!");
		 }
	 });
 });

 $(document).on('pagebeforeshow', function( event, ui ) {
	 $.ajax({
		 url : "http://kiwi-server.herokuapp.com/ProjectServer/currentUser",
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
			 var userList = data.user;
			 currentUser = userList[0];
			 //alert(currentUser.fname);
 			
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus: " + textStatus);
			 $.mobile.loading("hide");
			 if (data.status == 404){
				 alert("User not found.");
			 }
			 else {
				 alert("Internal Server Error.");
			 }
		 }
	 });
 });
 
//TODO - current bid price
 $(document).on('pagebeforeshow', "#product-view", function( event, ui ) {
	  //currentProduct has been set at this point
	 for(var i = 0; i < 3; i++)
	 {
		 $("#image" + i).html("<img src=\"images/products/" + currentProduct.pid + "/" + i + ".png\" />");
	 }
	 $("#upd-name").html("<h1>" + currentProduct.pname+"</h1>");
	 $("#upd-model").html("Model: " + currentProduct.pmodel);
	 $("#upd-brand").html("Brand: " + currentProduct.pbrand);
	 $("#upd-condition").html("Condition: " + currentProduct.pcondition);
	 $("#upd-price").html(currentProduct.ppricemethod + " price: " + currentProduct.pprice);
	 $("#upd-seller").html("Seller: " + currentProductSeller.fname);
	 $("#upd-description").html("Description: " +currentProduct.pdescription);
	 if(currentProduct.ppricemethod.toLowerCase()=="instant")
	 {
		 $("#upd-bidButton").hide();
		 $("#upd-butItNowButton").show();
		 $("#upd-addToCartButton").show();
		 $("#upd-bidderListLink").hide();
		 $("#upd-price").html(currentProduct.ppricemethod + " price: "+ currentProduct.pprice);
	 }
	 else if(currentProduct.ppricemethod.toLowerCase()=="bid")
	 {
		 $("#upd-bidButton").show();
		 $("#upd-butItNowButton").hide();
		 $("#upd-addToCartButton").hide();
		 $("#upd-bidderListLink").show();
		 $("#upd-price").html(currentProduct.ppricemethod + " price: "+ currentProduct.currentbidprice);
	 }
 });

$(document).on('pageshow', "#product-view", function( event, ui ) {
	//currentProduct has been set at this point
	var slider = $('#slider').data('flexslider');   
	slider.resize(); 
});

 $(document).on('pagebeforeshow', "#bidderList-page", function( event, ui ) {
	 console.log("TESTING");
	 $.ajax({
		 url : "http://kiwi-server.herokuapp.com/ProjectServer/bidderList/" + currentProduct.pid,
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
		 	$("#bidderListMessage").html("");
			 var bidderList = data.bidderList;
			 var len = 0;
			 len = bidderList.length;
			 var bidder;
			 var list = $("#upd-bidderList");
			 list.empty();
			 //currentUser has been set at this point
			 for(var i = 0; i < len ; i++)
			 {
				 bidder = bidderList[i];
				 list.append("<li class = \"ui-li\" style= \"height : 40px\">"+ bidder.username +"<div class = \"ui-li-aside ui-li-desc\">"+
		 "<p><b>US $" + bidder.userbidprice +"</b></p><p>"+ bidder.userbidtime.substring(0, 10) +"</p></div></li>" );
			 } 
 
			 list.listview("refresh");
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus: " + textStatus);
			 $("#bidderListMessage").html("No recent bids");
			 // alert("Data not found!");
		 }
	 });
 	
 });
 
 $(document).on('pagebeforeshow', "#askAQuestion-page", function( event, ui ) {
	  //currentUser has been set at this point
	 $("#upd-sellerNameQ").html("<h2><b>Dear " + currentUser.fname +
	 ":</b></h2>");
 });
 
 $(document).on('pagebeforeshow', "#recentFeedback-page", function( event, ui ) {
	  //currentUser has been set at this point
	  
	   $.ajax({
		 url : "http://kiwi-server.herokuapp.com/ProjectServer/recentFeedback/" + currentProductSeller.uid,
		 contentType: "application/json",
		 success : function(data, textStatus, jqXHR){
			 var recentFeedbackList = data.feedbackList;
			 var len = 0;
			 len = recentFeedbackList.length;
			 var feedback;
			 var list = $("#upd-feedbackList");
			 list.empty();
			 //currentUser has been set at this point
			 for(var i = 0; i < len ; i++)
			 {
				 feedback = recentFeedbackList[i];
				 
				 list.append(
				 	"<li data-role='list-divider' data-theme='b'>" + feedback.usernameg + "<div id = 'star" + i + "'" + "class='ui-li-aside'></div></li>" +
				 	"<li data-role='list-divider'>" + feedback.ratedate + "</li>" +
				 	"<li><h2>" + feedback.fnameg + "</h2>" +
    				"<p><strong>" + feedback.subject + "</strong></p>" +
    				"<p>" + feedback.feedback + "</p>" +
        			"<p class='ui-li-aside'><strong>" + "</strong></p></li>"	
				 );

		  		$.fn.raty.defaults.path = 'images';
    			$('#star'+i).raty(
     	 		{
					 numberMax: 5,
					 score    : feedback.rating,
					 number   : 500,
					 cancel   : false,
					 cancelPlace: 'right',
					 cancelOff: 'cancel-off.png',
					 cancelOn : 'cancel-on.png',
					 half     : true,
					 size     : 15,
					 starHalf : 'star-half.png',
					 starOff  : 'star-off.png',
					 starOn   : 'star-on.png',
					 readOnly : 'true'
				}
	 			);
	 		}		 	
			list.listview("refresh");   
		 },
		 error: function(data, textStatus, jqXHR){
			 console.log("textStatus: " + textStatus);
			 alert("Data not found!");
		 }
	 });
 });


$(document).on('pagebeforeshow', "#myAccount", function( event, ui ) {
	// currentUser has been set at this point
	$("#account-image").html("<img src=\"images/users/" + currentUser.uid + ".png\"width=100% height=auto</img> ");
	$("#headerHello").html("Hello "+ currentUser.fname + "!");
	$("#account-name").html("Name: "+ currentUser.fname + " " + currentUser.lname);
	$("#account-street").html("Street Address: "+ currentUser.streetma);
	$("#account-state").html("State: "+ currentUser.statema);
	$("#account-city").html("City: "+ currentUser.cityma);
    $("#account-zip").html("Zip Code: "+ currentUser.zipma);
    $("#account-telephone").html("Telephone: "+ currentUser.phonenumber);
    $("#account-email").html("Email: "+ currentUser.email);
    
    $.fn.raty.defaults.path = 'images';
    $('#account-star').raty(
        {
            numberMax: 5,
            score    : currentUser.rating,
            number   : 500,
            cancel   : false,
            cancelPlace: 'right',
            cancelOff: 'cancel-off.png',
            cancelOn : 'cancel-on.png',
            half     : true,
            size     : 15,
            starHalf : 'star-half.png',
            starOff  : 'star-off.png',
            starOn   : 'star-on.png',
            readOnly : 'true'
        }
    );
    
    if(currentUser.administrator == "true"){
    	$("#admin").show();
    }
    else{
    	$("#admin").hide();
    }
	
});

$(document).on('pagebeforecreate', "#shoppingCart", function( event, ui ) {
	console.log("TESTING");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/currentUserCart",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.shoppingcart;
			var len = 0;
			len = productList.length;
			itemTotal = len;
			var list = $('ul.cartItems');
			list.empty();
			var product;
			for (var i=0; i < len; ++i) {
			product = productList[i];
				list.append("<li><a onclick=GetProduct(" + product.pid + ") >" + 
				"<img src=\"images/products/"+ product.pid+ "/0.png\"/>" +
				"<h2>" + product.pname + "</h2>" + 
				"<p>" + product.pbrand + "</p>" +
				"<p>" + product.pmodel + "</p>" +
				"<div class=\"ui-li-aside\">" +
				"<p class=\"item_price\">" + "$" + product.pprice + "</p></div></a>" + "<a data-theme=\"b\" data-role=\"button\" data-icon=\"delete\"</a>"
				    + "</li>");
				totalPrice += parseFloat(product.pprice);
			}
			productlist = productList;
			list.listview("refresh");
			$("#upd-total").html("<h3>Items("+len+")</h3>  "+"<h3>Total price: $"+totalPrice+"</h3>");
			},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Shopping items not found!");
		}
	});
});

function buyItNow()
{
	totalPrice = currentProduct.pprice;
	itemTotal =  1;
	$.mobile.navigate("#order-confirmation");
}

$(document).on('pagebeforeshow', "#order-confirmation", function( event, ui ) {
	// currentUser has been set at this point
	$("#itemNumber").html("Items ("+ itemTotal+")");
	$("#totalPrice").html("Total price: $"+ totalPrice);
	$("#order-street").html("Street Address: "+ currentUser.streetma);
	$("#order-state").html("State: "+ currentUser.statema);
	$("#order-city").html("City: "+ currentUser.cityma);
    $("#order-zip").html("Zip Code: "+ currentUser.zipma);
});

// $(document).on('pagebeforeshow', "#review-page", function( event, ui ) {
	// // currentUser has been set at this point
	// $("#review-username").html(currentProductSeller.username);
// });

$(document).on('pagebeforeshow', "#product-view", function productName() {
	// currentProduct has been set at this point
	return currentProduct.name;
	
});

$(document).on('pagebeforeshow', "#itemsForSalePage", function( event, ui ) {
	console.log("TESTING");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/itemsforsale/" + currentProductSeller.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.itemsForSale;
			var len = productList.length;
			var list = $('#itemsforsalepagelist');
			list.empty();
			var product;
			for (var i=0; i < len; ++i) {
				product = productList[i];
				if (product.ppricemethod.toLowerCase() == "bid")
				{
					list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
				    "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
				    "<h2>" + product.pname + "</h2>" + 
				    "<p>" + product.pbrand + "</p>" +
				    "<p>" + product.pmodel + "</p>" +
				    "<div class=\"ui-li-aside\">" +
				    "<p>" + "$" + product.currentbidprice + "</p>" +
				    "<p>"+ product.numberofbids+"</p>" +
				    "<p>"+ product.penddate.substring(0, 10) +"</p>" +
				    "</div></a>" +
				    "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
				    "</li>");
				 }
				 else if(product.ppricemethod.toLowerCase() == "instant")
				 {
				 	list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
				    "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
				    "<h2>" + product.pname + "</h2>" + 
				    "<p>" + product.pbrand + "</p>" +
				    "<p>" + product.pmodel + "</p>" +
				    "<div class=\"ui-li-aside\">" +
				    "<p>" + "$" + product.pprice + "</p>" +
				    "<p>"+product.penddate.substring(0, 10) +"</p>" +
				    "</div></a>" +
				    "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
				    "</li>");
				 }
			}
			list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			 $('#noHistoryItems').html("No items for sale.");
			 list.empty();
		}
	});
});

$(document).on('pagebeforeshow', "#saleHistoryPage", function( event, ui ) {
	console.log("TESTING");
	$.ajax({
		
		url : "http://kiwi-server.herokuapp.com/ProjectServer/saleHistory/" + currentProductSeller.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$('#noHistorySale').html("");
			var productList = data.saleHistory;
			var len = productList.length;
			var list = $('#saleHistoryList');
			list.empty();
			var product;
			for (var i = 0; i < len; ++i) {
				product = productList[i];
				if (product.ppricemethod.toLowerCase() == "bid")
				{
					list.append("<li><a >" + 
				    "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
				    "<h2>" + product.pname + "</h2>" + 
				    "<p>" + product.pbrand + "</p>" +
				    "<p>" + product.pmodel + "</p>" +
				    "<div class=\"ui-li-aside\">" +
				    "<p>" + "$" + product.currentbidprice + "</p>" +
				    "<p>"+ product.numberofbids+"</p>" +
				    "<p>"+ product.penddate.substring(0, 10)+"</p>" +
				    "</div></a>" +
				    "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
				    "</li>");
				 }
				 else if(product.ppricemethod.toLowerCase() == "instant")
				 {
				 	list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
				    "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
				    "<h2>" + product.pname + "</h2>" + 
				    "<p>" + product.pbrand + "</p>" +
				    "<p>" + product.pmodel + "</p>" +
				    "<div class=\"ui-li-aside\">" +
				    "<p>" + "$" + product.pprice + "</p>" +
				    "<p>"+product.penddate.substring(0, 10)+"</p>" +
				    "</div></a>" +
				    "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
				    "</li>");
				 }
			}
			list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$('#noHistorySale').html("No history sales.");
			list.empty();
			
		}
	});
});

$(document).on('pagebeforeshow', "#saleHistoryAccountPage", function( event, ui ) {
	console.log("TESTING");
	$.ajax({	
		url : "http://kiwi-server.herokuapp.com/ProjectServer/saleHistory/" + currentUser.uid,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			$('#noHistoryAccountSale').html("");
			var productList = data.saleHistory;
			var len = productList.length;
			var list = $('#saleHistoryAccountList');
			list.empty();
			var product;
			for (var i = 0; i < len; ++i) {
				product = productList[i];
				if (product.ppricemethod.toLowerCase() == "bid")
				{
					list.append("<li><a >" + 
				    "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
				    "<h2>" + product.pname + "</h2>" + 
				    "<p>" + product.pbrand + "</p>" +
				    "<p>" + product.pmodel + "</p>" +
				    "<div class=\"ui-li-aside\">" +
				    "<p>" + "$" + product.currentbidprice + "</p>" +
				    "<p>"+ product.numberofbids+"</p>" +
				    "<p>"+ product.penddate.substring(0,10)+"</p>" +
				    "</div></a>" +
				    "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
				    "</li>");
				 }
				 else if(product.ppricemethod.toLowerCase() == "instant")
				 {
				 	list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
				    "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
				    "<h2>" + product.pname + "</h2>" + 
				    "<p>" + product.pbrand + "</p>" +
				    "<p>" + product.pmodel + "</p>" +
				    "<div class=\"ui-li-aside\">" +
				    "<p>" + "$" + product.pprice + "</p>" +
				    "<p>"+product.penddate.substring(0,10)+"</p>" +
				    "</div></a>" +
				    "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
				    "</li>");
				 }
			}
			list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$('#noHistoryAccountSale').html("No history sales.");
			list.empty();
			
		}
	});
});


$(document).on('pagebeforeshow', "#seller-page", function( event, ui ) {
	// currentProduct has been set at this point
	$("#upd-userImage").html("<img src=\"images/users/" + currentProductSeller.uid + ".png\"width=100% height=auto</img> ");
	$("#upd-sellerName").html("<h1>" + currentProductSeller.fname + " " + currentProductSeller.lname + "</h1>");
	
	$.fn.raty.defaults.path = 'images';
    $('#star').raty(
     	{
			numberMax: 5,
			score    : currentProductSeller.rating,
			number   : 500,
			cancel   : false,
			cancelPlace: 'right',
			cancelOff: 'cancel-off.png',
			cancelOn : 'cancel-on.png',
			half     : true,
			size     : 15,
			starHalf : 'star-half.png',
			starOff  : 'star-off.png',
			starOn   : 'star-on.png',
			readOnly : 'true'
		}
	);

});

$(document).on('pagebeforeshow', "#review-page", function( event, ui ) {
	
	// currentUser has been set at this point
	$("#review-username").html(currentProductSeller.username);
	
	$.fn.raty.defaults.path = 'images';
    	for (var i = 0; i < 4; i++) {
        	$('#star' + i).raty({
	        	numberMax: 5,
	            number   : 500,
	            cancel   : true,
	            cancelPlace: 'right',
	            cancelOff: 'cancel-off-big.png',
	            cancelOn : 'cancel-on-big.png',
	            half     : true,
	            size     : 24,
	            starHalf : 'star-half-big.png',
                starOff  : 'star-off-big.png',
                starOn   : 'star-on-big.png',
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
			$.mobile.navigate("#homePage");
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
		url : "http://kiwi-server.herokuapp.com/ProjectServer/products/" + id,
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
				alert("Product not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/currentProductSeller/" + sellerid,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: false,
		success : function(data, textStatus, jqXHR){
			currentProductSeller = data.seller;	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Seller not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

function GetProductByCategory(category){
	currentCategory = category;
	$.mobile.loading("show");
	console.log("testing");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/categories/" + category,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var list = $("#categoryList");
			list.empty();
			var productList = data.category;
			var len = productList.length;
			// var list = $("#categoryList");
			// list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2>" + product.pname + "</h2>" + 
		            "<p>" + product.pbrand + "</p>" +
		            "<p>" + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ product.numberofbids+" bids</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a>" +
		                  "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		              "</li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		             "<h2>" + product.pname + "</h2>" + 
		             "<p>" + product.pbrand + "</p>" +
		             "<p>" + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p>" + "$" + product.pprice + "</p>" +
		             "<p>"+product.penddate.substring(0,10)+"</p>" +
		               "</div></a>" +
		                   "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		               "</li>");
		         }
			 }
			 list.listview("refresh");
				
				
			$.mobile.loading("hide");
			$.mobile.navigate("#categoryPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			 $("#categoryList").empty();
			// alert("Data not found!");
		}
	});
}

function GetSimilarProduct(){
	currentCategory = currentProduct.categoryname;
	$.mobile.loading("show");
	console.log("testing");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/categories/" + currentProduct.categoryname,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var list = $("#categoryList");
			list.empty();
			var productList = data.category;
			var len = productList.length;
			// var list = $("#categoryList");
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2>" + product.pname + "</h2>" + 
		            "<p>" + product.pbrand + "</p>" +
		            "<p>" + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ product.numberofbids+" bids</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a>" +
		                  "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		              "</li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		             "<h2>" + product.pname + "</h2>" + 
		             "<p>" + product.pbrand + "</p>" +
		             "<p>" + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p>" + "$" + product.pprice + "</p>" +
		             "<p>"+product.penddate.substring(0,10)+"</p>" +
		               "</div></a>" +
		                   "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		               "</li>");
		         }
			 }
			 list.listview("refresh");
			$.mobile.loading("hide");
			$.mobile.navigate("#categoryPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			 $("#categoryList").empty();
			// alert("Data not found!");
		}
	});
}

function sortCategoryBy(orderType){
	console.log("testing");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/orderCategoryBy/" + currentCategory + "/" + orderType,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.orderType;
			var len = productList.length;
			var list = $("#categoryList");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				if(product.ppricemethod.toLowerCase()=="bid")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2>" + product.pname + "</h2>" + 
		            "<p>" + product.pbrand + "</p>" +
		            "<p>" + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ product.numberofbids+" bids</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a>" +
		                  "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		              "</li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		             "<h2>" + product.pname + "</h2>" + 
		             "<p>" + product.pbrand + "</p>" +
		             "<p>" + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p>" + "$" + product.pprice + "</p>" +
		             "<p>"+product.penddate.substring(0,10)+"</p>" +
		               "</div></a>" +
		                   "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		               "</li>");
		         }
			 }
			 list.listview("refresh");
			// $.mobile.loading("hide");
			// $.mobile.navigate("#categoryPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			 $("#categoryList").empty();
			// alert("Data not found!");
		}
	});
}

function sortSearchBy(orderType){
	console.log("testing");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/orderSearchPage/" + orderType,
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
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		            "<h2>" + product.pname + "</h2>" + 
		            "<p>" + product.pbrand + "</p>" +
		            "<p>" + product.pmodel + "</p>" +
		            "<div class=\"ui-li-aside\">" +
		                "<p>" + "$" + product.currentbidprice + "</p>" +
		                "<p>"+ product.numberofbids+" bids</p>" +
		                "<p>"+ product.penddate.substring(0,10) +"</p>" +
		              "</div></a>" +
		                  "<a  href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		              "</li>");
		         }
		         else if(product.ppricemethod.toLowerCase()=="instant")
		         {
		            list.append("<li><a onclick=\"GetProduct(" + product.pid + "," + product.sellerid + ")\" >" + 
		            "<img src=\"images/products/"+ product.pid + "/0.png\"/>" +
		             "<h2>" + product.pname + "</h2>" + 
		             "<p>" + product.pbrand + "</p>" +
		             "<p>" + product.pmodel + "</p>" +
		             "<div class=\"ui-li-aside\">" +
		             "<p>" + "$" + product.pprice + "</p>" +
		             "<p>"+product.penddate.substring(0,10)+"</p>" +
		               "</div></a>" +
		                   "<a href=\"#\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
		               "</li>");
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
		url : "http://kiwi-server.herokuapp.com/ProjectServer/products/" + updProduct.id,
		method: 'put',
		data : updProductJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#homePage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
			}
			else {
				alert("Internal Error.");		
			}
		}
	});
}

function DeleteProduct(){
	$.mobile.loading("show");
	var id = currentProduct.id;
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/products/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#homePage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Product not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

/*
 * ################################## REGISTER FORM ############################################
 */

function SaveUser(){
	$.mobile.loading("show");
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
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#registerPage2");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});
}


 function GetReportsbyDate() {
     var date=$('#reportDate').val();
     console.log(date);
     console.log("TESTING");
     $.ajax({
         url : "http://kiwi-server.herokuapp.com/ProjectServer/reportList/"+date,
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

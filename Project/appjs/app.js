// $(document).on( "pageinit", function() {
    // $( document ).on( "swipeleft swiperight", function( e ) {
        // // We check if there is no open panel on the page because otherwise
        // // a swipe to close the left panel would also open the right panel (and v.v.).
        // // We do this by checking the data that the framework stores on the page element (panel: open).
        // if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            // if ( e.type === "swipeleft"  ) {
                // $( "#rightPanel" ).panel( "open" );
            // } else if ( e.type === "swiperight" ) {
                // $( "#leftPanel" ).panel( "open" );
            // }
        // }
    // });
// });



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
$(document).on('pagebeforeshow', "#homePage", function( event, ui ) {
	console.log("TESTING");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = productList.length;
			var list = $('ul.products');
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=GetProduct(" + product.id + ")>" + 
					"<img src=\"images/cd-01.jpg\">" +
					"<h2>" + product.name + "</h2>" + 
					"<p>" + product.model + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p> $" + product.instantPrice + "</p>" +
							"<p>10 bids</p>" +
							"<p>7d 10h</p>" +
						"</div></a>" +
        				"<a href=\"#purchase\" data-rel=\"popup\" data-position-to=\"window\" data-theme=\"b\" data-transition=\"pop\" data-icon=\"cart\">Add to cart</a>" +
    				"</li>");
					
				// list.append("<li class=\"ui-screen-hidden\" ><a onclick=GetProduct(" + product.id + ")>" + 
					// "<h2>" + product.name + " " + product.model +  "</h2>" + 
					// "<p><strong> Bid price: " + product.bidPrice + "</strong></p>" + 
					// "<p>" + product.description + "</p>" +
					// "<p class=\"ui-li-aside\">" + product.instantPrice + "</p>" +
					// "</a></li>");
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
	// currentProduct has been set at this point
	$("#headerHello").html("Hello "+ currentUser.firstName);
	$("#account-name").html(currentUser.firstName + currentUser.lastName);
	$("#account-street").html(currentUser.streetMailingAddress);
	$("#account-state").html(currentUser.stateMailingAddress);
	$("#account-city").html(currentUser.cityMailingAddress);
    $("#account-zip").html(currentUser.zipMailingAddress);
    $("#account-telephone").html(currentUser.telephone);
    $("#account-email").html(currentUser.email);
	
});

////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////

function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
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
			console.log("textStatus: " + textStatus);
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

function SaveReview(){
    $.mobile.loading("show");
    var form = $("#review-form");
    var formData = form.serializeArray();
    console.log("form Data: " + formData);
    var newProduct = ConverToJSON(formData);
    console.log("New Product: " + JSON.stringify(newProduct));
    var newProductJSON = JSON.stringify(newProduct);
    $.ajax({
        url : "http://localhost:3412/ProjectServer/review",
        method: 'post',
        data : newProductJSON,
        contentType: "application/json",
        dataType:"json",
        success : function(data, textStatus, jqXHR){
            console.log("textStatus: " + textStatus);
            $.mobile.loading("hide");
            $.mobile.navigate("#main");
        },
        error: function(data, textStatus, jqXHR){
            console.log("textStatus: " + textStatus);
            $.mobile.loading("hide");
            alert("Data could not be added!");
        }
    });
}

var currentProduct = {};

function GetProduct(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/ProjectServer/products/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
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
		url : "http://localhost:3412/ProjectServer/products/" + id,
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
 * 
 */

// $(document).ready(function() {
	// $.ajax({
		// type: 'GET',
		// url: 'data.json',
		// dataType: 'json',
		// success: jsonParser
	// });
// });
// 
// function jsonParser(json) {
	// $.getJSON('data.json', function(data) {
		// $.each(data.products, function(k, v) {
			// var id = v.id;
			// var name = v.name;
			// var model = v.model;
			// var instantPrice = v.instantPrice;
			// var bidPrice = v.bidPrice;
			// var description = v.description;
			// $('#').append()
		// });
	// });
// }

//Initialize simpleCartjs
simpleCart({
  checkout: {
    type: "PayPal" ,
    email: "chris.omar91@gmail.com"
  },
  cartStyle: 'table'
  });

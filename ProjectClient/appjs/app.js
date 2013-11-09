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
			for (var i=0; i < len; ++i){
				product = productList[i];
				if(currentProduct.priceMethod.toLowerCase()=="bid")
				{
					list.append("<li class=\"ui-screen-hidden simpleCart_shelfItem\" ><a onclick=GetProduct(" + product.pid + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.pid + "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.pname + "</h2>" + 
					"<p>" + product.pbrand + "</p>" +
					"<p>" + product.pmodel + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.currentbidprice + "</p>" +
							"<p>"+product.numberofbids+"</p>" +
							"<p>"+product.penddate+"</p>" +
						"</div></a>" +
        				"<a class=\"item_add\" href=\"javascript:;\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
    				"</li>");
				}
				else if(currentProduct.priceMethod.toLowerCase()=="price")
				{
					list.append("<li class=\"ui-screen-hidden simpleCart_shelfItem\" ><a onclick=GetProduct(" + product.pid + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.pid + "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.pname + "</h2>" + 
					"<p>" + product.pbrand + "</p>" +
					"<p>" + product.pmodel + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.pprice + "</p>" +
							"<p>"+product.enddate+"</p>" +
						"</div></a>" +
        				"<a class=\"item_add\" href=\"javascript:;\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
    				"</li>");
				}
				
			}
			productlist = productList;
            List = list;
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#product-view", function( event, ui ) {
	// currentProduct has been set at this point
	for(var i = 0; i < 3; i++)
	{
		$("#image"+i).html("<img src=\"images/products/" + currentProduct.id+"/"+i+".jpg\" />");
	}
	$("#upd-name").html("<h1>"+currentProduct.name+"</h1>");
	$("#upd-model").html("Model: "+currentProduct.model);
	$("#upd-brand").html("Brand: "+currentProduct.brand);
	$("#upd-condition").html("Condition: "+ currentProduct.condition);
	$("#upd-price").html(currentProduct.priceMethod +" price: "+currentProduct.price);
	$("#upd-seller").html("Seller: "+currentUser.firstName);
	$("#upd-description").html("Description: "+currentProduct.description);
	if(currentProduct.priceMethod.toLowerCase()=="instant")
	{
		$("#upd-bidButton").hide();
		$("#upd-butItNowButton").show();
		$("#upd-addToCartButton").show();
		$("#upd-bidderListLink").hide();
		$("#upd-price").html(currentProduct.priceMethod +" price: "+currentProduct.pprice);
	}
	else if(currentProduct.priceMethod.toLowerCase()=="bid")
	{
		$("#upd-bidButton").show();
		$("#upd-butItNowButton").hide();
		$("#upd-addToCartButton").hide();
		$("#upd-bidderListLink").show();
		$("#upd-price").html(currentProduct.priceMethod +" price: "+currentProduct.currentbidprice);
	}
	
});


$(document).on('pagebeforeshow', "#categories", function( event, ui ) {
	console.log("TESTING");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/products",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = productList.length;
			var list = $('ul.categories');
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li class=\"simpleCart_shelfItem\" ><a onclick=GetProduct(" + product.id + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.id+ "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.name + "</h2>" + 
					"<p>" + product.brand + "</p>" +
					"<p>" + product.model + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.price + "</p>" +
							"<p>10 bids</p>" +
							"<p>7d 10h</p>" +
						"</div></a>" +
        				"<a class=\"item_add\" href=\"javascript:;\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
    				"</li>");
			}
			productlist = productList;
            List = list;
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforecreate', "#bidderList-page", function( event, ui ) {
	
	console.log("TESTING");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/bidderList/"+currentProduct.id,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var bidderList = data.bidderList;
			var len = 0;
			len = bidderList.length;
			var bidder;
			// currentUser has been set at this point
			for(var i = 0; i < len ; i++)
			{
				bidder = bidderList[i];
				$("#upd-bidderList").append("<li class = \"ui-li\" style= \"height : 40px\">"+ bidder.username +"<div class = \"ui-li-aside ui-li-desc\">"+
		"<p><b>US $" + bidder.userbidprice +"</b></p><p>"+ bidder.userbidtime +"</p></div></li>" );
			} 

			$("#upd-bidderList").listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	
});

$(document).on('pagebeforeshow', "#askAQuestion-page", function( event, ui ) {
	// currentUser has been set at this point
	$("#upd-sellerNameQ").html("<h2><b>Dear "+currentUser.firstName+
	":</b></h2>");
});

$(document).on('pagebeforecreate', "#recentFeedback-page", function( event, ui ) {
	
	for(var i = 7; i > 0 ; i--)
	{
		$("#upd-feedbackList").append("<li class = \"ui-li\" style= \"height : 50px\">"+ currentUser.firstName +i*3+"<div class = \"ui-li-aside ui-li-desc\">"+
		"<p id = star"+i+"></p><p> 10:4"+(i+2)+"pm</p></div></li>" );
		 $.fn.raty.defaults.path = 'images';
    $('#star'+i).raty(
     	{
			numberMax: 5,
			score    : Math.floor((Math.random()*5)+1),
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
});

function SortingCategories (event) {
    
    var sort_by = function(field, reverse, primer){

       var key = function (x) {return primer ? primer(x[field]) : x[field];};
       return function (a,b) {
           var A = key(a), B = key(b);
           return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
       };
    };
        
    if(event == 'price'){
        //Sorting by the product increasing price
        console.log("Sorting by price");
        productlist.sort(sort_by('price', true, parseInt));
        
    }
    else if(event == 'brand'){
       //Sorting by the product brand
       console.log("Sorting by brand");
       productlist.sort(sort_by('brand', true, function(a){return a.toUpperCase();}));
    }
    else if(event == 'name'){
        //Sorting by the product name
        console.log("Sorting by name");
       productlist.sort(sort_by('name', true, function(a){return a.toUpperCase();}));
    }
            //Refresh the new list
            var len = productlist.length;
            List.empty();
            var product;
            for (var i=0; i < len; ++i){
                product = productlist[i];
                List.append("<li class=\"simpleCart_shelfItem\" ><a onclick=GetProduct(" + product.pid + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.pid+ "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.pname + "</h2>" + 
					"<p>" + product.pbrand + "</p>" +
					"<p>" + product.pmodel + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.pprice + "</p>" +
							"<p>10 bids</p>" +
							"<p>7d 10h</p>" +
						"</div></a>" +
        				"<a class=\"item_add\" href=\"javascript:;\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
    				"</li>");
            }
            List.listview("refresh"); 
}

$(document).on('pagebeforeshow', "#myAccount", function( event, ui ) {
	// currentUser has been set at this point
	$("#headerHello").html("Hello "+ currentUser.firstName + "!");
	$("#account-name").html("Name: "+ currentUser.firstName + " " + currentUser.lastName);
	$("#account-street").html("Street Address: "+ currentUser.streetMailingAddress);
	$("#account-state").html("State: "+ currentUser.stateMailingAddress);
	$("#account-city").html("City: "+ currentUser.cityMailingAddress);
    $("#account-zip").html("Zip Code: "+ currentUser.zipMailingAddress);
    $("#account-telephone").html("Telephone: "+ currentUser.telephone);
    $("#account-email").html("Email: "+ currentUser.email);
	
});

$(document).on('pagebeforeshow', "#order-confirmation", function( event, ui ) {
	// currentUser has been set at this point
	$("#order-street").html("Street Address: "+ currentUser.streetMailingAddress);
	$("#order-state").html("State: "+ currentUser.stateMailingAddress);
	$("#order-city").html("City: "+ currentUser.cityMailingAddress);
    $("#order-zip").html("Zip Code: "+ currentUser.zipMailingAddress);
});

$(document).on('pagebeforeshow', "#review-page", function( event, ui ) {
	// currentUser has been set at this point
	$("#review-username").html(currentUser.username);
});

$(document).on('pagebeforeshow', "#product-view", function productName() {
	// currentProduct has been set at this point
	return currentProduct.name;
	
});

$(document).on('pagebeforeshow', "#seller-page", function( event, ui ) {
	// currentProduct has been set at this point
	$("#upd-userImage").html("<img src=\"images/users/0.png\"width=100% height=auto</img> ");
	$("#upd-sellerName").html("<h1>Cristian</h1>");
	
	$.fn.raty.defaults.path = 'images';
    $('#star').raty(
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

});

$(document).on('pagebeforeshow', "#review-page", function( event, ui ) {
	
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



$(document).on('pagebeforeshow', "#shoppingCart", function( event, ui ) {
	
	
	console.log("TESTING");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/products",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var productList = data.products;
			var len = 0;
			var totalPrice = 0;
			len = productList.length;
			var list = $('ul.cartItems');
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li><a onclick=GetProduct(" + product.id + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.id+ "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.name + "</h2>" + 
					"<p>" + product.brand + "</p>" +
					"<p>" + product.model + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.price + "</p></div></a>" + "<a data-theme=\"b\" data-role=\"button\" data-icon=\"remove\"</a>"
    				+ "</li>");
					
				totalPrice += parseFloat(product.price);	
			}
			productlist = productList;
            List = list;
			list.listview("refresh");	
			$("#upd-total").html("<h3>Items("+len+")</h3>  "+"<h3>Total price: $"+totalPrice+"</h3>");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	
});
////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////

function ConverToJSON(formData){
	// var result = {};
	// $.each(formData, 
		// function(i, o){
			// result[o.name] = o.value;
	// });
	// return result;
	
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

//TODO 
function convertProduct(dbModel){
	var cliModel = {};
	cliModel.id = dbModel.pid;
	cliModel.name = dbModel.pname;
	cliModel.model = dbModel.pmodel;
	cliModel.brand = dbModel.pbrand;
	cliModel.category = dbModel.pcategory;
	cliModel.condition = dbModel.pcondition;
	cliModel.priceMethod = dbModel.ppricemethod;
	cliModel.price = dbModel.pprice;
	cliModel.description = dbModel.pdescription;
	cliModel.description = dbModel.pseller;
	return cliModel;
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

var currentProduct = {};
var currentUser = {};
var currentSeller = {};

function GetProduct(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/products/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: true,
		success : function(data, textStatus, jqXHR){
			currentProduct = convertProduct(data.product);		
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
		url : "http://kiwi-server.herokuapp.com/ProjectServer/users/" + 0,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		async: true,
		success : function(data, textStatus, jqXHR){
			currentUser = data.user;
			 // $.mobile.loading("hide");
			 // $.mobile.navigate("#myAccount");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			//$.mobile.loading("hide");
			if (data.status == 404){
				alert("User not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

//TODO
function GetProductByCategory(category){
	$.mobile.loading("show");
	console.log("testing");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/categories/" + category,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var productList = data.categories;
			var len = productList.length;
			var list = $("#categoryList");
			list.empty();
			var product;
			for (var i=0; i < len; ++i){
				product = productList[i];
				list.append("<li class=\"simpleCart_shelfItem\" ><a onclick=GetProduct(" + product.pid + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.pid+ "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.pname + "</h2>" + 
					"<p>" + product.pbrand + "</p>" +
					"<p>" + product.pmodel + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.pprice + "</p>" +
							"<p>10 bids</p>" +
							"<p>7d 10h</p>" +
						"</div></a>" +
        				"<a class=\"item_add\" href=\"javascript:;\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
    				"</li>");
			}
			
			list.listview("refresh");
			$.mobile.loading("hide");
			$.mobile.navigate("#categoryPage");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

function GetSeller(id){
	$.mobile.loading("show");
				
			$.mobile.loading("hide");
			$.mobile.navigate("#seller-page");
}

function GetUser(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/users/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentUser = data.user;
			  $.mobile.loading("hide");
			  $.mobile.navigate("#myAccount");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("User not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}

function GetSeller(id){
	$.mobile.loading("show");
	$.ajax({
		url : "http://kiwi-server.herokuapp.com/ProjectServer/users/" + id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentUser = data.user;
			  $.mobile.loading("hide");
			  $.mobile.navigate("#seller-page");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("User not found.");
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

// This function uses a give category and the name of a ul list
// to refresh and divide the products by categories.
function CategoryList(category, classList){
    console.log("Category List Testing: "+ category);
    $.ajax({
        url : "http://localhost:3412/ProjectServer/products",
        contentType: "application/json",
        success : function(data, textStatus, jqXHR){
            var productList = data.products;
            var len = productList.length;
            var list = $('ul.'+ classList);
            list.empty();
            var product;
            for (var i=0; i < len; ++i){
                product = productList[i];
                console.log("Product"+product.id+" categories:"+product.category);
                
                //Check of the cateory is in the products category list
                console.log($.inArray(category, product.category));
                console.log(product.category == category);
                if($.inArray(category, product.category) >= 0 || product.category == category){
                    list.append("<li class=\"simpleCart_shelfItem\" ><a onclick=GetProduct(" + product.id + ") >" + 
					"<img class=\"item_image\" src=\"images/products/"+ product.id+ "/0.jpg\"/>" +
					"<h2 class=\"item_name\">" + product.name + "</h2>" + 
					"<p>" + product.brand + "</p>" +
					"<p>" + product.model + "</p>" +
					"<div class=\"ui-li-aside\">" +
							"<p class=\"item_price\">" + "$" + product.price + "</p>" +
							"<p>10 bids</p>" +
							"<p>7d 10h</p>" +
						"</div></a>" +
        				"<a class=\"item_add\" href=\"javascript:;\" data-theme=\"b\" data-role=\"button\" data-icon=\"cart\" data-transition=\"pop\">Add to cart</a>" +
    				"</li>");  
                }
            }
             
            list.listview("refresh");   
        },
        error: function(data, textStatus, jqXHR){
            console.log("textStatus: " + textStatus);
            alert("Data not found!");
        }
    });
}

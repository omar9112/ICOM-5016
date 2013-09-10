$(document).on( "pageinit", function() {
    $( document ).on( "swipeleft swiperight", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft"  ) {
                $( "#rightPanel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#leftPanel" ).panel( "open" );
            }
        }
    });
});


// $(function(){
		// $("body").append('<div id="popupMenu" data-role="popup" data-theme="b" data-url="popupMenu">'
			// + '<ul data-role="listview" data-position="right" data-inset="true" style="min-width:210px;">'
			// + '<li><a href="#">Sign Out</a></li>'
			// + '<li><a href="#homePage">Home</a></li>'
			// + '<li><a href="#accountPage">My Account</a></li>'
			// + '<li><a href="#settingsPage">Settings</a></li>'
			// + '</ul>'
			// + '</div>');
// });
// 
// $(document).on('pagecreate', '[data-role="page"]', function(){                
    // $('<div>').attr({'id':'leftPanel','data-role':'panel'}).appendTo($(this));
    // $(document).on('click', '#', function(){   
         // $.mobile.activePage.find('#leftPanel').panel("open");       
    // });    
// });
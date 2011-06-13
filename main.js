//jQuery page: http://james.padolsey.com/demos/imgPreview/full/
//chrome extension wait for call back info: http://comments.gmane.org/gmane.comp.web.chromium.extensions/4367
    //<![CDATA[

function reWriteSingleUrl(iHash, elem) {
	return function(resp) {
		// Older method of assuming .jpg - this is the fallback if AJAX call fails
	//	var newURL = "http://i.imgur.com/" + iHash + ".jpg";
		//var newURL = e.getElementsByTagName("original")[0].childnodes[0].nodeValue;
		var newURL = resp.getElementsByTagName("original")[0].childNodes[0].nodeValue;
		console.log("New URL for apiCallURL [" + iHash + " - " + elem.href + "]: " + newURL);
		elem.href = newURL;
	};
}

function reWriteImgurUrls(reWriteUrl){
	//This will rewrite urls that orginally go to imgur.com to go
  //to just the jpg file.  BETA	

	if (reWriteUrl == "true"){
		//alert('TRUE dat');
		console.log("Rewriting enabled");
		for (var i = 0; i < document.links.length; i++){
			// TODO: this fails on albums (imgur.com/a/___)
//			var url = document.links[i].href.substring(7,12);
			var validRegexp = /imgur\.com\/(?!a\/)[\w\d]{5}(?!\.(jp?g|gif|png))/i
			var needsRewrite = validRegexp.test(document.links[i].href);
//			url == "imgur"
			if (needsRewrite){
				imgChar = document.links[i].href.substring(17,22);

				var apiCallURL = "http://api.imgur.com/2/image/" + imgChar + ".xml";
				
				$.ajax( {
					url: apiCallURL,
					dataType: 'xml',
					type: 'GET',
					async: true,
					success: reWriteSingleUrl(imgChar, document.links[i]),
					error: function(jqxhr, stat, e) { console.log("error: " + stat + e);}
				});
				
//				var xhr = new XMLHttpRequest();
//				var apiCallURL = "http://api.imgur.com/2/image/" + imgChar + ".xml";
//				
//				xhr.open("GET", apiCallURL, true);
//				xhr.onload = function (e) { 
//
//					// Older method of assuming .jpg - this is the fallback if AJAX call fails
//					var newURL = "http://i.imgur.com/" + imgChar + ".jpg";
//					
//					var resp = xhr.responseXML;
//					if (resp != null) {
//						newURL = resp.getElementsByTagName("original")[0].childNodes[0].nodeValue;
//						// Set the link
//						document.links[i].href = newURL;
//						console.log("New URL is " + newURL);
//					} else {
//						console.log("no response from " + apiCallURL);
//					}
//					
//					
//				};
//				xhr.onerror = function (e) { console.log("Error in rewrite: " + e); };
//				xhr.send();
//				console.log("Send API call for " + imgChar);
				
//				document.links[i].href = "http://i.imgur.com/" + imgChar + ".jpg";
//				console.log("Rewrite " + url + " to " + "http://i.imgur.com/" + imgChar + ".jpg");
			}
		}
	//} else {
		//alert('Not True');
	
	}
  //We call getValue here so that all of the async js calls are coplete and
  //we have all of the settings
  getValue('getHeight', onValue);
};

function getValue(key, callback) {
	chrome.extension.sendRequest({msg: key},
		function(response)
		{
		if (key == 'getHeight') {			
			height = response.msg;
			if (height == undefined ) {
				height = 400;
			}
		  callback(height);	
		}else if (key == 'getReWrite') {
			reWriteUrl = response.msg;
			if (reWriteUrl == undefined ) {
				reWriteUrl = false;
			}
		  callback(reWriteUrl);	
		 }	
	});
};	

function onValue(height){

		jQuery.noConflict();
		(function($){  
    //This is for the home page
		$('a').imgPreview({ //p.title 
			containerID: 'imgPreviewWithStyles',
				imgCSS: {
					// Limit preview size:
					height: parseInt(height)
				},
				// When container is shown:
				onShow: function(link){
					// Animate link:
					$(link).stop().animate({opacity:0.4});
					// Reset image:
					$('img', this).css({opacity:0});
				},
				// When image has loaded:
				onLoad: function(){
					// Animate image
					$(this).animate({opacity:1}, 300);
				},
				// When container hides: 
				onHide: function(link){
					// Animate link:
					$(link).stop().animate({opacity:1});
				}
		});
   
		})(jQuery);
};


//reWriteImgurUrls();
getValue('getReWrite', reWriteImgurUrls);





    //]]>

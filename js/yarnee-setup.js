'use strict';

// Prevent console.log errors
if(typeof(console) === 'undefined') {
	var console = {};
	console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

// Hide URL bar on iPhone
// This does not work:
// app.js: "app".run(function() {
// window.scrollTo(0, 1);
// });
if (/mobile/i.test(navigator.userAgent)) {
	jQuery(document).ready(function() {
		setTimeout(function() {window.scrollTo(0, 1)}, 1000);
	});
}

/**
 * 
 */
function parseMedia(data) {
	console.log('parseMedia() called');
	
	var uri 	= new URI(data);
	
	if (!uri.authority) {
		uri = new URI(document.location.protocol+'//'+document.location.host+'/'+ data);
	}

	if (uri.authority) {
    	var ending 	= uri.path.match(/\.([^\/]+)$/);
    	
    	if (ending !== null && ending.length > 0) {
    		ending = ending[1];
    	}
    	
    	var noOfDots = (uri.authority.split('.').length - 1);
    	
    	switch (noOfDots) {
    		case 0:
    			var domainWithoutTLD = uri.authority;
    		break;
    		
    		case 1:
    			var domainWithoutTLD = uri.authority.split('.')[0];
    		break;
    		
    		case 2:
    			var domainWithoutTLD = uri.authority.split('.')[1];
    		break;
    		
    		case 3:
    			var domainWithoutTLD = uri.authority.split('.')[1]; // Probably a TLD with extra dot like .com.uk
    		break; 
    	}

      // TODO change to array
    	switch (ending) {
    		case 'jpg':
    		case 'jpeg':
    		case 'gif':
    		case 'bmp':
    		case 'png':
    		case 'tif':
        case 'tiff':
    			var type = 'image';
    		break;
    		
    		default:
    			switch (domainWithoutTLD) {
    				case 'youtube':
    				case 'youtu':
    					var type = 'youtube';
    				break;
    				
    				default:
    					var type = 'unknown';
    				break;
    			}
    		break;
    	}
	} else {
	    // This might be simply text
	    var type               = 'paragraph';
	    var noOfDots           = 0;
	    var domainWithoutTLD   = '';
	    var ending             = '';
	}
	
	switch (type) {
		// http://www.youtube.com/embed/oHg5SJYRHA0
		// http://www.youtube.com/watch?feature=player_embedded&v=oHg5SJYRHA0
		// http://youtu.be/oHg5SJYRHA0
		// http://www.youtube.com/v/oHg5SJYRHA0?hl=en_US&amp;version=3
		case 'youtube':
			
			var youtubeId = '';

		    // http://www.youtube.com/embed/oHg5SJYRHA0
		    youtubeId = data.match(/\/embed\/(.*)$/);
		    
		    if (youtubeId != null && youtubeId.length > 0) {
		        youtubeId = youtubeId[1];
		    }
		    
		    // http://www.youtube.com/watch?feature=player_embedded&v=oHg5SJYRHA0
		    if (typeof youtubeId != 'string') {
		        youtubeId = data.match(/v=([^&]+)/);
		    
		        if (youtubeId != null && youtubeId.length > 0) {
		            youtubeId = youtubeId[1];
		        }
		    }
		    
		    // http://youtu.be/oHg5SJYRHA0
		    if (typeof youtubeId != 'string') {
		        youtubeId = data.match(/youtu\.be\/([^?\/]+)/);
		    
		        if (youtubeId != null && youtubeId.length > 0) {
		            youtubeId = youtubeId[1];
		        }
		    }
		    
		    // http://www.youtube.com/v/oHg5SJYRHA0?hl=en_US&amp;version=3
		    if (typeof youtubeId != 'string') {
		        youtubeId = data.match(/\/v\/([^?\/]+)/);
		    
		        if (youtubeId != null && youtubeId.length > 0) {
		            youtubeId = youtubeId[1];
		        }
		    }
		    
		    var url 			= 'http://www.youtube.com/embed/'+youtubeId;
		    var previewimage 	= 'http://img.youtube.com/vi/'+youtubeId+'/2.jpg';
		break;
		
		case 'paragraph':
            var url             = data;
            var previewimage    = 'default-paragraph-preview-image.png';
	    break;
		
        default:
            var url             = data;
            var previewimage    = data;
        break;
	}
	
	// Add ?dl=1 to dropbox files
	switch (domainWithoutTLD) {
		case 'dropbox':
		case 'dropboxusercontent':
			url = uri.scheme+'://'+uri.authority+uri.path+'?dl=1';
		break;
	}
	
	// Mime type
	var mimetype = null;
	try {
	    mimetype                 = $('#upload_input').eq(0)[0].files[0].type;
	} catch(e) {}
	
	// Adding a fully prepare JSON content part ready to add to the JSON structure
    var prepared                 = {};
    prepared.content             = {};
    prepared.meta                = {};
    prepared.meta.type           = type;
    prepared.meta.previewimage   = previewimage;
    prepared.meta.mimetype       = mimetype;
    
	switch(type) {
        case 'paragraph':
            prepared.content.paragraph   = data;
        break;
        
        default:
            prepared.content.url         = url;
        break;
	}
	
	var result = {'type': type, 'url': url, 'previewimage': previewimage, 'mimetype': mimetype, 'prepared': prepared, 'data': data};
	console.log(result);
	console.log('parseMedia() ended');
	return result;
}


//function validateYarn(yarn) {
//    var consolePrefix = 'JSON: ';
//    
//    // Check that there are "previewiamge" and "type" set properly
//    if (yarn.pages.length > 0) {
//        jQuery.each(yarn.pages, function (i, page) {
//            console.log(page);
//                        
//            try {
//                page.content[0].content
//                var tmp = true;
//            } catch(e) {
//                var tmp = false;
//            }
//            
//            if (tmp) {
//                if (page.content[0].content.length > 0) {
//                    if (!page.meta.previewimage) {
//                        console.warning(consolePrefix+'There seems to be no previewimage for page no '+i);
//                    }
//                    if (!page.meta.type) {
//                        console.warning(consolePrefix+'There seems to be no type for page no '+i);
//                    }
//                }
//            }
//        });
//    }
//    
//    // Check that there is no type attribute in "meta" section of a page
//}


// TODO add some checks if client supports all features


// http://stackoverflow.com/a/5639455/22470
// TODO check about can we switch to http://docs.angularjs.org/api/ngCookies.$cookies
(function(){
    var cookies;

    function readCookie(name,c,C,i){
        if(cookies){ return cookies[name]; }

        c = document.cookie.split('; ');
        cookies = {};

        for(i=c.length-1; i>=0; i--){
           C = c[i].split('=');
           cookies[C[0]] = C[1];
        }

        return cookies[name];
    }

    window.readCookie = readCookie; // or expose it however you want
})();


(function() {
    function cookieExists(name) {
        return document.cookie.indexOf(name) >= 0;
    }
    
    window.cookieExists = cookieExists;
})();


// Make an string URL save and useful for sharing
// https://gist.github.com/bentruyman/1211400
String.prototype.slug = function () {
    return this.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--/g, '-').replace(/-$/g, '');
};


// Simple wrapper for all backend API URLs
// See https://bitbucket.org/maikroeder/yarnee.mobile/wiki/Backend_API
function apiUrl(key, o) {
    var url         = '';
    var apiVersion  = '1';
    var apiPrefix   = '/'+apiVersion;
    
    switch(key) {
        case 'my-yarns-list':
            url = apiPrefix+'/yarns/'+o.userid;
        break;
        
        case 'save-yarn':
        case 'get-yarn':
            url = apiPrefix+'/'+o.userid+'/'+o.yarnid;
        break;
        
        case 's3-sign-put':
            url = apiPrefix+'/'+o.userid+'/'+o.yarnid+'/sign_s3_put';
        break;
        
        // POST 
        case 'user-follow':
            url = apiPrefix+'/'+o.userid+'/follow';
        break;
        
        // POST
        case 'yarn-favorite':
            url = apiPrefix+'/'+o.userid+'/'+o.yarnid+'/favorite';
        break;
        
        // GET
        case 'yarns-favorited':
            url = apiPrefix+'/yarns/favorited/'+o.userid;
        break;
        
        // GET
        case 'users-followed':
            url = apiPrefix+'/users/followed/'+o.userid;
        break;
    }
    
    return url;
}

// Simple wrapper for all frontend URLs (mainly AngularJS hash URLs!)
function frontendUrl(key, o) {
    var url         = '';
    var urlPrefix   = 'yarn';
    
    switch(key) {
        case 'read-yarn':
            url = urlPrefix+'/'+o.userid+'/'+o.yarnid+'/view';
        break;
        
        case 'edit-yarn':
            url = urlPrefix+'/'+o.userid+'/'+o.yarnid+'/edit';
        break;
        
        case 'edit-yarn-page':
            url = urlPrefix+'/'+o.userid+'/'+o.yarnid+'/edit/'+o.pagenumber;
        break;
        
        case 'edit-yarn-newpage':
            url = urlPrefix+'/'+o.userid+'/'+o.yarnid+'/edit/newpage';
        break;
    }
    
    return url;
}

// Simple wrapper for all kind of URL parts which are not full URLs
function urlSnippet(key, o) {
    var url = '';
    
    switch(key) {
        case 's3-filename-prefix':
            url = o.userid+'/'+o.yarnid+'/';
        break;
        
        case 'partial-media-type':
            url = './partials/media/'+o.type+'.html'; // TODO make this absolute
        break;
    }
    
    return url;
}


// Clean up $angular data. When serialising $angular variables from the frontend, 
// for example storing them as JSON Angular adds internal $$hashkey variables to the data structure. 
function cleanAngularData(data) {
    var clean_data = {};
    angular.copy(data, clean_data);
    
    try{
        
        try {
            for (var i=0; i<clean_data.pages.length; i++) {
                delete clean_data.pages[i].$$hashKey;
            }
        } catch(e) {}
        
        try {
            delete clean_data.content[0].content.$$hashKey;
            delete clean_data.content[0].$$hashKey;
            delete clean_data.$$hashKey;
        } catch(e) {}
        
        try {
            delete clean_data.meta.alias;
        } catch(e) {}
        
        try {
            delete clean_data.cover.meta.alias;
        } catch(e) {}
        
        try {
            if (clean_data.cover) {
                clean_data.pages.unshift(clean_data.cover);
                delete clean_data.cover;
            }
        } catch(e) {}
        
        
    } catch(e) {}
    
    return clean_data;
}

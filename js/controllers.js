'use strict';

/* Controllers */
var yarneeAppModule = angular.module('yarneeApp.controllers', []);


// See http://stackoverflow.com/a/15494548/22470
yarneeAppModule.controller('view-yarnCtrl',  function($scope, $routeParams, $http, $rootScope, $timeout) {
    var page_on_screen  = parseInt($routeParams.pagenumber.replace(/[^0-9]+/g, '')); // match ex. "/view/2" in the URL.
    
    console.log($routeParams);
    
    $http.get(apiUrl('get-yarn', {userid: $routeParams.userid, yarnid: $routeParams.yarnid}), {headers: {'Accept': 'application/json'}}).success(function(data) { // API        
        $scope.yarn             = data;        
        $rootScope.html_title   = 'Read Yarn "'+$scope.yarn.pages[0].meta.title+'"';
        $scope.show_page(); // or something similar to $scope.$apply();
    })
    
                
                
    $scope.init_current_page = function() {
        if (!(!isNaN(parseFloat(page_on_screen)) && isFinite(page_on_screen))) {
            page_on_screen = 0; // 0 = cover page!
        }
    }
    
    
    
    $scope.next = function() {
        console.info('next() called');
    
        if (page_on_screen < $scope.yarn.pages.length) {
            page_on_screen = page_on_screen + 1;
        } else {
            console.info('Last page reached!');
            return;
        }
        
        $scope.show_page();
    }
    
    
    
    $scope.prev = function() {
        console.info('prev() called');
    
        if (page_on_screen > 0) {
            page_on_screen = page_on_screen - 1;
        } else {
            console.info('First page reached!');
            return;
        }

        $scope.show_page();
    }   
    
    
    
    
    $scope.follow = function() {
        console.info('follow() called');
        $http({
            method: 'POST',
            url:    apiUrl('user-follow', {userid: $scope.yarn.meta.userid}),
        });
    }
    
    
    
    $scope.favorite = function() {
        console.info('favorite() called');
        $http({
            method: 'POST',
            url:    apiUrl('yarn-favorite', {userid: $scope.yarn.meta.userid, yarnid: $scope.yarn.meta.yarnid}),
        });
    }
    
    
    
    $scope.show_page = function() {
        $scope.init_current_page();
        console.log('Showing page '+page_on_screen);
        
        var page_number = page_on_screen - 1; // digital counting, starting with 0!

        if (page_number < 0) {
            page_number = 0;
        }
        var page    = $scope.yarn.pages[page_number];
        

        $scope.imageexists              = angular.isString(page.content[0].meta.type) && page.content[0].meta.type.length > 0;
        if ($scope.imageexists) {
            $scope.templateIdentifier   = './partials/media/'+page.content[0].meta.type+'.html';
        }
        
        $scope.page = page;
    }
});













yarneeAppModule.controller('my-yarnsCtrl',  function($scope, $http, $rootScope, $location) {
    $rootScope.html_title = 'My Yarns';
    
    $http.get(apiUrl('my-yarns-list', {userid: readCookie('userid')}), {headers: {'Accept': 'application/json'}}).success(function(data) { // API
        $scope.yarns = data.yarns;
    })
    
    // Click on miniyarn
    // TODO this has to be controller independently 
    $scope.openyarn = function(userid, yarnid) {
        console.log('openyarn() called with id '+userid+'/'+yarnid);
        console.log(frontendUrl('read-yarn', {userid: userid, yarnid: yarnid}));
        $location.path(frontendUrl('read-yarn', {userid: userid, yarnid: yarnid})); 
    }
});













yarneeAppModule.controller('create-yarnCtrl',  function($scope, $rootScope, $routeParams, $window, $http, $location, $timeout) {
    $rootScope.html_title       = 'Create Yarn';
    // For debugging use "angular.element('[ng-view]').children().scope()"
    $scope.page                 = {};
    $scope.imageexists          = false;
    $scope.currentpage          = null;
    $scope.pagegroup            = 'cover'; // initial page to show
    $scope.model                = {pages:[{content:[{content:{},meta:{}}], meta:{}}], meta:{}} // holds the data of the new yarn // TODO get a skeleton here
    $scope.defaults             = {};
    $scope.editMode             = angular.isString($routeParams.yarnid);
    $scope.yarnid               = $routeParams.yarnid;
    $scope.userid               = $routeParams.userid;
    $scope.myuserid             = window.readCookie('userid');
    $scope.addNewPageOnStartup  = $routeParams.newpage.replace(/[_/-]+/g, '') == 'newpage';
    $scope.startOnPage          = !$scope.addNewPageOnStartup && parseInt($routeParams.newpage.replace(/\//g, '')) > 0 ? parseInt($routeParams.newpage.replace(/\//g, '')) : false;
    
    console.log('Edit Mode? '+$scope.editMode);
    
    if ($scope.editMode && $scope.userid != $scope.myuserid) {
        console.error('Userid from URL does not match with the userid from Cookie! You sould not be able to edit other users Yarns.');
    }
    
    // Test
    //    $scope.page.content            = [];
    //    $scope.page.content[0]         = {};
    //    $scope.page.content[0].content = {};
    //    $scope.page.content[0].content.url = 'http://example.com';
    //    $scope.page.meta = {};
    //    $scope.page.meta.title = 'test';
    //    console.log($scope.page.content[0].content.url);
    $scope.page.resetMedia = function () {
        console.info('$page.resetMedia() started');
        
        console.log(this);
        
        if (typeof this.content != 'object' || typeof this.content[0] != 'object') {
            this.content            = [];
            this.content[0]         = {};
        }
        this.content[0].content     = {};
        this.content[0].meta        = {};
        
        // Do not reset the root "meta"!
        // this.meta                = {};
        
        console.info('$page.resetMedia() ended');
    }
    
    

    $scope.page.setMedia = function (media) {
        console.info('$page.setMedia() started');

        if (typeof this.content != 'object' || typeof this.content[0] != 'object') {
            this.content    = [];
            this.content[0] = {};
        }

        this.content[0] = parseMedia(media).prepared;
        
        // this.load($scope.currentpage); // reload
        
        console.info('$page.setMedia() ended');
    }
    
    
    
    
    $scope.page.load = function (pagenumber) {
        console.info('$page.load('+pagenumber+') started');
        
        if (pagenumber < 0) {
            pagenumber = 0;
        }
                
        $scope.dontSavePageChangeToModel = true;
        
        this.content    = $scope.model.pages[pagenumber].content;
        this.meta       = $scope.model.pages[pagenumber].meta;

        $scope.dontSavePageChangeToModel = false;

        $scope.imageexists              = angular.isString(this.content[0].meta.type) && this.content[0].meta.type.length > 0;
        if ($scope.imageexists) {
            $scope.templateIdentifier   = './partials/media/'+this.content[0].meta.type+'.html';
        }
        
        console.info('$page.load() ended');
    }
    
    
    
    
    // Initally load yarn.json
    if ($scope.editMode) {
        console.info('"if ($scope.editMode)" started');
        
        $http({
            method:     'GET',
            url:        apiUrl('get-yarn', {userid: $scope.userid, yarnid: $scope.yarnid}),
            headers:    {'Accept': 'application/json'},
        }).success(function(data, status, headers, config) {
            $scope.model            = data;
            $rootScope.html_title   = 'Edit Yarn "'+$scope.model.pages[0].meta.title+'"';
            $scope.currentpage      = 0;
            
            $scope.page.load($scope.currentpage);

            // Set preview images into navigation tiles
            // TODO make better, maybe in the template? Pure AngularJS?
            $timeout(function() {
                try {$('.tile.title-page').css('background', 'url("'+$scope.model.pages[0].content[0].meta.previewimage+'") no-repeat center center');} catch(e) {} 
                $('.tile.title-page').css('background-size', 'cover');
                angular.forEach($scope.model.pages, function(a, b) {
                    try {$('.tile.page-'+(b+1)).css('background', 'url("'+a.content[0].meta.previewimage+'") no-repeat center center');} catch(e) {} 
                    $('.tile.page-'+(b+1)).css('background-size', 'cover');
                });
            });
                        
            // TODO switch to specific page, or add new page according to URL
            if ($scope.addNewPageOnStartup) {
                $timeout(function() {$('.add-page.tile').trigger('click')}, 0);
            } else if ($scope.startOnPage) {
                $timeout(function() {$('.tile.page-'+$scope.startOnPage).trigger('click')}, 0);
            } else {
                // $scope.selectTitle();
                // TODO this should be even more simple and not anymore required
                // as long as a normal tile click gets captured well. 
                $timeout(function() {$('.title-page.tile').trigger('click')}, 0);
            }

        }).error(function(e) {
            console.error(e);
        })
        
        console.info('"if ($scope.editMode)" ended');
    }
    
    
    
    
    $scope.$watch('[image, coverimage]', 
        function(media, oldmedia) {
            console.info('$watch [image, coverimage] started');
            if(media[0] !== oldmedia[0]) {
                var newmedia = parseMedia(media[0]);
            }
            if(media[1] !== oldmedia[1]) {
                var newmedia = parseMedia(oldmedia[0]);
            }
            if (typeof newmedia == 'object' && newmedia.type != 'unknown') {
                console.log('Template: '+newmedia.type+'.html');
                $scope.templateIdentifier = urlSnippet({type: newmedia.type});
            } else {
                console.log('no media -> no template');
            }
            console.info('$watch [image, coverimage] ended');
        },
        true
    );
    
    
    
    
    // Hide input button
    $scope.selectmedia = function($event) {
        console.info('selectmedia() called');
        $event.stopPropagation();
        
        $scope.imageexists = false;
                
        // var somethingchanged = Object.keys($scope.page.content[0].content).length > 0
        
        // Delete the current media
        $scope.page.resetMedia();
        
        $('.tile.active').css('background', 'url("") no-repeat center center');
        
        // if (somethingchanged) {
            console.log('Something has changed, call save.');
            $scope.saveCurrentPageToModel();
        // }
        
        // See http://stackoverflow.com/a/16152254/22470
        // See http://stackoverflow.com/a/6888810/22470
        $timeout(function() {
            var input_upload = angular.element($event.target).find('input[type="file"]');
            input_upload.show().focus().click().hide(); // This works but throws an "$apply already in process" error. This happens because if the element was edited (via jQuery) form outside of Angular.
        }, 0);
        
        console.info('selectmedia() ended');
    }
    
    
    
    // Send file, see http://www.html5rocks.com/de/tutorials/file/xhr2/#toc-send-formdata
    $scope.uploadFiles = function(url, files) {
        console.info('uploadFiles() called');
                
        // S3 Upload
        // Via http://codeartists.com/post/36892733572/how-to-directly-upload-files-to-amazon-s3-from-your
        var s3upload = s3upload != null ? s3upload : new S3Upload({
            file_dom_selector:  '#upload_input',
            file_name_prefix:   urlSnippet('s3-filename-prefix', {userid: $scope.myuserid, yarnid: $scope.yarnid}),
            s3_sign_put_url:    apiUrl('s3-sign-put', {userid: $scope.myuserid, yarnid: $scope.yarnid}),
            onProgress: function(percent, message) { // Use this for live upload progress bars
                console.log('Upload progress: ', percent, message);
            },
            
            onFinishS3Put: function(public_url) { // Get the URL of the uploaded file
                
                console.log('Upload finished: ', public_url);

                $scope.page.setMedia(public_url);
                
                $('.tile.active').css('background',      'url("'+$scope.page.content[0].meta.previewimage+'") no-repeat center center');
                $('.tile.active').css('background-size', 'cover'); // TODO currently does not work when setting this in pure CSS
                
                $scope.$apply(); // TODO required?
                console.log('Saving inside the uload uploadFiles()');
                $scope.saveCurrentPageToModel();
            },
              
            onError: function(status) {
                console.log('Upload error: ', status);
            }
        });

        console.info('uploadFiles() ended');
    }

    
    // Image change event listener triggered from outside!
    // There is a issue with input type=file and ng-change, see https://github.com/angular/angular.js/issues/1375
    // Current solution: http://jsfiddle.net/ADukg/2589/
    // Take care about the scope which is manipulated by the onchange()!
    $scope.setFile = function(e) {
        console.info('setFile() called');
        console.log('Image input field has been changed');
        $scope.uploadFiles('yarn/data/', e.files);
        console.info('setFile() ended');
    }
    
    
    
    // See http://jsfiddle.net/timriley/5DMjt/ for edit forms
    $scope.editTitleStart = function(element) {
        console.info('editTitleStart() called');
        $scope.textEditor = true;
        
        // TODO set focus to form more specific
        $timeout(function() {angular.element('.model-title').focus().click()}, 500);
        console.info('editTitleStart() ended');
    }
    
    
    
    // Since there is no native blur in AngularJS yet, we use a directive on input fields
    // for the blur event see http://jsfiddle.net/cn8VF/
    $scope.editTitleEnd = function() {
        console.info('editTitleEnd() called');
        $scope.textEditor = false;
        $scope.saveCurrentPageToModel();
        console.info('editTitleEnd() ended');
    }

    
    
    // Click on "Add Page"
    $scope.addPage = function() {
        console.info('addPage() called');

        if ($scope.pagegroup   != 'page') {
            $scope.pagegroup    = 'page';
        }
        
        // Save the current page, but not initially
        if ($scope.model.pages.length > 0) {
            $scope.saveCurrentPageToModel();
        }
        
        $scope.model.pages.push({ content: [{content:{}, meta:{}}], meta:{} }); // TODO this has to be more global or in a helper
        
        console.log($scope.model.pages.length);
        
        $scope.page.load($scope.model.pages.length - 1);
        $scope.currentpage = $scope.model.pages.length - 1;

        console.info('addPage() ended');
    };
    
    // Watch $page if page has content and then
    $scope.$watch('page', function(obj) {
        console.log('Page change discovered!');
    });
    
    
    
    // Reset the current page contents
    $scope.resetPage = function() {
        console.info('resetPage() called');
        $scope.title          = null;
        $scope.image          = null;
        $scope.textEditor     = false;
        $scope.imageexists    = false;
        
        // Delete the current media
        $scope.page.resetMedia();
        $scope.page.meta      = {};
        console.info('resetPage() ended');
    }
    
    
    
    // Click on a page tile
    $scope.selectPage = function(pagenumber) {
        console.info('selectPage() called');
        
        $scope.currentpage = pagenumber;
        
        console.log('Current Page: '+$scope.currentpage);
        
        if ($scope.currentpage != 0) {
            $scope.pagegroup = 'page'; // call it at the end to trigger the observer with all required information
        } else {
            $scope.pagegroup = 'title';
        }

        $scope.page.load($scope.currentpage);
        
        try {
            console.log('Current title: '+$scope.page.meta.title);
        } catch(e) {
            console.log('Current title: NO TITLE, seems that the JSON is broken');
        }
        console.info('selectPage() ended');
    }
    
    
    
    $scope.finishYarn = function() {
        console.info('finishYarn() called');

        $scope.pagegroup = 'finish';
                
        if (!angular.isString($scope.model.pages[0].meta.title) && !$scope.model.pages.length > 0) {
            $scope.notice = 'Please add at least one page, or add an title to the cover page.';
            return;
        } else {
            $scope.notice = '';
        }
        
        $scope.urlToShare  	= $location.absUrl().replace(/edit$/, 'view');
        $scope.urlToEdit    = $location.absUrl().replace(/edit.*$/, 'view');
        
        $timeout(function() {
            $('.urltoshare').click(function() { $(this).select() });
            $('.urltoshare').click().select();
        }, 0);
        
        $scope.saveCurrentPageToModel();
        console.info('finishYarn() ended');
    };

    
    
    
    // Covertitle
    $scope.editCovertitleStart = function(element) {
        console.info('editCovertitleStart() called');

        $scope.covertitleEditor = true;
    }

    
    
    $scope.editCovertitleEnd = function (element) {
        console.info('editCovertitleEnd() called');
        
        $scope.covertitleEditor = false;
        $scope.saveCurrentPageToModel();
        
        console.info('editCovertitleEnd() ended');
    }
    
   
    
    
    $scope.selectressource = function($event) {
        console.info('selectressource() called');
        // See http://stackoverflow.com/q/15390393/22470 IMPORTANT!
        $event.stopPropagation(); // IMPORTANT!
        
        var ressource       = prompt('URL to an image or Youtube video', 'http://');
        
        var media           = parseMedia(ressource);
        
        $scope.page.content[0] = media.prepared;
        
        
        $('.tile.active').css('background',      'url("'+$scope.page.meta.previewimage+'") no-repeat center center');
        $('.tile.active').css('background-size', 'cover');
        
        // TODO this will be done by an $page observer.
        $scope.model.pages[$scope.currentpage].content[0] = media.prepared;
        
        $timeout(function() { $scope.$apply(); }, 0); // Required?
        $scope.saveCurrentPageToModel();
        
        console.info('selectressource() ended');
    }
    
    
    
    // Save the data into the client side model
    $scope.saveCurrentPageToModel = function() {
        console.info('saveCurrentPageToModel() called');
        
        console.log($scope.page);
        
        var page = cleanAngularData($scope.page);
        
        
        console.log(page);
        
        // TODO this will be done via observers
        $scope.model.pages[$scope.currentpage] = page;     
        
        $scope.saveModel(); // TODO change into a $scope.model observer?
        console.info('saveCurrentPageToModel() ended');
    }
    
    
    
    // Save data
    $scope.saveModel = function() {
        console.info('saveModel() called');
        
        var create                      = false;
        if (!angular.isNumber($scope.yarnid) && !angular.isString($scope.yarnid)) {
            var create                  = true;
            if (angular.isString($scope.model.pages[0].meta.title) && $scope.model.pages[0].meta.title.length > 0) {
                $scope.yarnid           = $scope.model.pages[0].meta.title.slug();
            } else {
                $scope.yarnid           = Math.random().toString(36).substring(7);
            }
            $scope.model.meta.yarnid    = $scope.yarnid;
            $scope.model.meta.created   = new Date().toString();
            $scope.model.meta.userid    = $scope.myuserid;
            $scope.model.meta.author    = $scope.myuserid;
        }
        
        $scope.model.meta.modified      = new Date().toString();
        
        console.log('Starting to save Yarn with id: '+$scope.myuserid+'/'+$scope.yarnid+' ...');
        
        // Get rid of angular "$$hashkey" attributes
        var model = cleanAngularData($scope.model);
        
        var saving = jQuery.post(
            apiUrl('save-yarn', {userid: $scope.myuserid, yarnid: $scope.yarnid}),
            JSON.stringify(model) // TODO Fix problem with $model serialization
        ).done(
            function() {
                console.log('Yarn was saved to server');
                if (create) {
                    $location.path(frontendUrl('edit-yarn', {userid: $scope.myuserid, yarnid: $scope.yarnid}));
                }
            }
        ).error(
            function() {
                console.error('Could not save Yarn to server');
            }
        );
        
        console.info('saveModel() ended');
    }

    
    
    // Highlighting the tiles
    $scope.$watch('{"pagegroup":pagegroup, "currentpage":currentpage}', function(obj) {
        console.info('$watch {"pagegroup":pagegroup, "currentpage":currentpage} started');
        
        angular.element('.tile.active').removeClass('active');
        
        switch (obj.pagegroup) {
            case 'title':
                $('.tile.title-page').addClass('active');
            break;
            
            case 'finish':
                $('.tile.finish').addClass('active');
            break;
                
            case 'page':
                $timeout(function() {$('.tile.page-'+obj.currentpage).addClass('active')}, 0);
            break;
        }
        console.info('$watch {"pagegroup":pagegroup, "currentpage":currentpage} ended');
    }, true);    
    
    
    // TODO onbeforeunload does not trigger on # changes! Use the native AngularJS onlocationchangestart
    // TODO catch onbeforeunload only when something was changed and is unsaved
    $window.onbeforeunload = function(e) {
        console.log('$window.onbeforeunload()');
        
        return $scope.saveCurrentPageToModel();
        // return 'Unsaved edits';
    };
});













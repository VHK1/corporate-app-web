App.controller('qudosfaveController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $timeout, tokenLogin) {

    if (!$cookieStore.get('access_token')) {
         $state.go("corporate_login");
		 return false;
    }
	if (!$cookieStore.get('web_access_token')) {
        $state.go("corporate_login");
		return false;
    }
	$rootScope.ridePage = 0;
	$scope.skip = 0;
	$scope.currentPage = 1;
	
	
    $scope.pop={};
    $scope.pop.myDate = new Date();
    $scope.pop.isOpen = false;
    // $scope.Users = [];
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    $scope.userDetails = [];
    $scope.driverDetails = [];
    // console.log("dsfsdfdsfssd");
    //$scope.userDetails.userName = driverModel.user_name;
    //$scope.userDetails.userImage = driverModel.user_image;
    if (driverModel) {
        $scope.userDetails.userName = driverModel.user_name;
        $scope.userDetails.userImage = driverModel.user_image;
        $scope.driverID=driverModel.vendor_id;
        $scope.driverDetails.driver_name = driverModel.driver_name;
        $scope.driverDetails.driver_image = driverModel.driver_image;
        $scope.driverDetails.driver_email = driverModel.email;
        $scope.driverDetails.driver_mobile = driverModel.mobile;
        $scope.driverDetails.driver_refcode = driverModel.referral_code;
    } else {
		//console.log('corporateModel not found');
        $cookieStore.remove('access_token');
       $state.go("corporate_login");
    }

    $scope.captureImage = false;
    $scope.camConfig = {
        delay: 1,
        countdown: 3,
    };

    $scope.onCameraCaptureError=function(err){
        // console.log('onCameraCaptureError',err);
    }

    $scope.onCameraCaptureComplete=function(src){
        $scope.doc.capturedImage = src[0];
        $scope.captureImage = false;
    }

    $scope.onCameraLoad = function(){
        $('#ng-webcam-counter').css('visibility','hidden');
    }

    $scope.takePicture = function() {
        $('#ng-webcam-counter').css('visibility','unset')
        $scope.doc.capturedImage = undefined;
        $scope.$broadcast('ngWebcam_capture');
    };

    $scope.cameraOn = function() {
        $scope.$broadcast('ngWebcam_on');
    };
    $scope.cameraOff = function() {
        // console.log('cameraOff')
        $scope.$broadcast('ngWebcam_off');
    };

    $scope.navigateBack = function(){
        $scope.doc={};
        $scope.captureImage=false;
        $scope.editDoc = false;
    }

    $scope.editDocument = function(doc) {
        if(!$scope.editDoc){
            $scope.editDoc = true;
            return;
        }
        $scope.addEditDocType(doc,1);
    }
    $scope.logout = function() {
        $('.modal').modal('hide');
        $cookieStore.remove('access_token');
       $state.go("corporate_login");
    };
    $scope.status = {
        isCustomHeaderOpen: false
    };
    //console.log("Sending request now");

    $scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
        // console.log('Page changed to: ' + $scope.currentPage);
		$scope.hideNext = 0;
		
		if(parseInt($scope.totalItems / 10 + 1) <= currentPage){
			$scope.hideNext = 1;
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
                // console.log('Offset changed to: ' + $scope.skip+' - '+i);
                //$scope.$apply();
				
            }
        }
        $scope.initTable();
    };
	
	
	$scope.checkClear = function() {
		// console.log('Text in Box ',$scope.searchuser);
	}
	$scope.initTable = function(searchflag) {
		
		var params = {
			web_access_token: $cookieStore.get("web_access_token"),
			limit: 10,
			offset: $scope.skip
		}
			
		if((searchflag == 1) && $scope.searchuser){
			params.offset = 0;
			
			$scope.currentPage = 1;
            params.searchFlag = 1;
            $scope.hideLoadMore = 1;
			params.searchString = $scope.searchuser;
			
		}else if((searchflag == 1) && !$scope.searchuser){
			// console.log('Text in Box ',$scope.searchuser);
			params.offset = 0;
			$scope.currentPage = 1;
		}


		$.post(MY_CONSTANT.urlC + 'get_all_driver', params)
		 .then(function successCallback(data, status) {
			// console.log(data);
			// data = JSON.parse(data);
			// console.log(data);
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			console.log(data);
			if (data.flag == 101) {
				$scope.showCredentialsAlert();
			}
			if (data.flag == 703) {
				$scope.totalItems = data.total_drivers;
				$scope.Users = data.drivers;

				$scope.$apply();
			} else {
				
				
				
                $scope.totalItems = data.total_drivers;
              
				if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
					$scope.hideLoadMore = 1;
				}else{
                    $scope.hideLoadMore = 0;
                    
				}
              $scope.Users = data.drivers;
              
             
				$scope.$apply();
					
			}
			// console.log("response",status,data);
		});
          
    }
    $scope.initTable();
    $scope.loadData = function() {
        $('.accordion-toggle').addClass('collapsed');
    };
	$scope.loadMore = function() {
		$scope.DisableLoadMore = true;
		
		
		$scope.currentPage = $scope.currentPage+1;
        // console.log('Page changed to: ' + $scope.currentPage);
		$scope.hideLoadMore = 0;
		
		if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
            $scope.hideLoadMore = 1;
            $timeout(function(){
				$scope.DisableLoadMore = false;
		
					},1500)
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);

               $scope.loadMoreNow();
            }
        }
		
		
		
    }
	
	$scope.loadMoreNow = function(){
		var params = {
			web_access_token: $cookieStore.get("web_access_token"),
			limit: 10,
			offset: $scope.skip
		}
		if($scope.searchuser){
				
			params.searchFlag = 1;
			params.searchString = $scope.searchuser;
		
		}
		
		// console.log($scope.Users);
        $.post(MY_CONSTANT.urlC + 'get_all_driver', params)
            .success(function(data, status) {
              
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
                if (data.flag == 502) {
                 
                } else {
					$scope.totalItems= data.total_drivers;
					var Users = data.drivers;
					Users.forEach(function(userData,ind) {
						$scope.Users.push(userData);		
					});
					
			
					$scope.$apply();
                }
                // console.log("response",status,data);
            });
		
	}
	
	

	
	
	
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.collapse').on('show.bs.collapse', function() {
            $('.collapse.in').collapse('hide');
            var index = $(this).attr("id");
            $scope.arrowKey = true
            $cookieStore.put('modalToOpen', index);
        });
        /*$('#datatable').dataTable({
         'destroy'   : true,
         'paging'    : true,  // Table pagination
         'ordering'  : true,  // Column ordering*!/
         oLanguage   : {
         sSearch     : 'Search trips',
         sLengthMenu : '_MENU_',
         zeroRecords : 'Nothing found - sorry',
         infoEmpty   : 'No records available',
         infoFiltered: '(filtered from _MAX_ total records)'
         },
         "pageLength": 10,
         "columnDefs": [{
         "defaultContent": "-",
         "targets": "_all"
         }]
         });*/

    });
    // $scope.formats = ['MM/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // $scope.format = $scope.formats[0];
    // $scope.popup = {
    //     opened: false
    // };
    // $scope.open = function() {
    //     $scope.popup.opened = true;
    // };
    $scope.minDate=new Date();
    // $scope.dateOptions = {
    //     // maxDate: new Date(2040, 5, 22),
    //     // minDate: moment(new Date()).format('llll'),
    //     startingDay: 1
    // };
    $scope.typeSelect = function(a) {
        $scope.doc.docType = a;
        // $scope.$apply();
    }
	
	
	$scope.openAddUser = function(){
		
		window.open(MY_CONSTANT.vendorBaseURL+'driverlogin.html', '_blank');
	};
	
	
    $scope.doc = {};

  
    $scope.closeThisDialog = function() {
        $scope.doc = {};
    }
   
    $scope.searchForUser = function() {
		// console.log('Search User '+$scope.searchuser+'.');
	}
    $scope.addtoAccount = function(user) {
		$scope.driver_toAdd = user.driver_id;
		$scope.toBeAdded = user.driver_name;
	}
	
    $scope.addtoAccountConfirmed = function(driver_id) {		
		$scope.userInProcess = driver_id;	
		
		$.post(MY_CONSTANT.urlC+ 'add_fav_driver', {
			web_access_token:  $cookieStore.get('web_access_token'),		
			driver_id: driver_id,
			referral_code: '',
		}) .then(function successCallback(data) {
			$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
				
				if(data.error){
								
					alert(data.error || data.message);
				  return;
				}else{									
					$scope.initTable();					
				
					$rootScope.openToast('success', 'Driver Added Successfully!', '');
					
					// setTimeout(function(){
					// 	window.location.reload();
                    // },500);
                    setTimeout(function(){
						
                        $state.go("corporate.myQudosfave");
                    },300);
					
				}
			})
		
		})

		
	}
	
	
	
	
    $scope.attention_doc_dialog = function(doc_id, a) {
        $scope.attention_required = a;
        $scope.doc_id = doc_id;

        ngDialog.open({
            template: 'attention_doc_dialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.attentionDoc = function(docID, flag) {
        $.post(MY_CONSTANT.urlC+ '/change_attention_doc', {
            access_token: localStorage.getItem('access_token'),
            doc_id: docID,
            attention_flag: flag
        }).then(function successCallback(data) {
            if (data.flag == 1309) {
                // $scope.attentionmsg = 'Attention Raised Successfully'
                $rootScope.openToast('success', 'Attention Raised Successfully', '');
                $timeout(function() {
                    ngDialog.close({
                        template: 'attention_doc_dialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    // $scope.attentionmsg = '';
                    $state.reload();
                }, 2500)
            }
            if (data.flag == 1310) {
                // $scope.attentionmsg = 'Attention Withdrawn Successfully'
                $rootScope.openToast('success', 'Attention Withdrawn Successfully', '');
                $timeout(function() {
                    ngDialog.close({
                        template: 'attention_doc_dialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    // $scope.attentionmsg = '';
                    $state.reload();
                }, 2500)
            }
        })
    }
    $scope.verify_doc_dialog = function(doc_id) {
        $scope.doc_id = doc_id;
        ngDialog.open({
            template: 'verify_doc_dialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.verify = function(docID) {
        $.post(MY_CONSTANT.urlC+ '/verify_doc', {
            access_token: localStorage.getItem('access_token'),
            doc_id: docID
        }).then(function successCallback(data) {
            if (data.flag == 1307) {
                // $scope.verifymsg = 'Document Verified Successfully'
                $rootScope.openToast('success', 'Document Verified Successfully', '');
                $timeout(function() {
                    ngDialog.close({
                        template: 'verify_doc_dialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    // $scope.verifymsg = '';
                    $state.reload();
                }, 2500)
            }
        })
    }
    $scope.addDocDialog = function() {
        $scope.type = 0;
        // $scope.$apply();
    };
    $scope.viewDocDialog = function(doc,edit) {
        //console.log("data from table doc",doc)
        $scope.editDoc = edit;
        $scope.doc.expiry_date = new Date(doc.expiry_date);
        $scope.doc.reminder_before = doc.reminder_before;
        $scope.doc.document_url = doc.document_url;
        $scope.doc.doc_id = doc.doc_id;
        $scope.doc.docType = $scope.docTypes.find(function (docType) {
            return docType.document_type_id == doc.document_type_id
        })
        //console.log('$scope.doc',$scope.doc);
    };

    $scope.file_to_upload = function(files) {
        processfile(files[0]);
        // $scope.doc.doc_file=files[0];
        $scope.doc.doc_file_name = files[0].name;
        $scope.$apply();
    }

    function processfile(file) {

        if (!(/image/i).test(file.type)) {
            // alert("File " + file.name + " is not an image.");
            $rootScope.openToast('error', "File " + file.name + " is not an image.", '');
            return false;
        }

        // read the files
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function(event) {
            // blob stuff
            var blob = new Blob([event.target.result]); // create blob...
            window.URL = window.URL || window.webkitURL;
            var blobURL = window.URL.createObjectURL(blob); // and get it's URL

            // helper Image object
            var image = new Image();
            image.src = blobURL;
            //preview.appendChild(image); // preview commented out, I am using the canvas instead
            image.onload = function() {
                // have to wait till it's loaded
                var resized = resizeMe(image); // send it to canvas
                // console.log(resized);
                $scope.dataURItoBlob(resized);
            }
        };
    }

    function resizeMe(img) {

        var canvas = document.createElement('canvas');

        var width = img.width;
        var height = img.height;
        var max_width = 1024;
        var max_height = 720;
        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > max_width) {
                //height *= max_width / width;
                height = Math.round(height *= max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                //width *= max_height / height;
                width = Math.round(width *= max_height / height);
                height = max_height;
            }
        }

        // resize the canvas and draw the image data into it
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // preview.appendChild(canvas); // do the actual resized preview

        return canvas.toDataURL("image/jpeg", 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

    }
    $scope.dataURItoBlob = function(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], {
            type: 'image/jpeg'
        });
        $scope.doc.doc_file = blob;
        // $scope.$apply();
    };
    $scope.viewDetails = function(modalIndex) {
        //$scope.popupDetails = $scope.userDetails.user_name;
        // var modalIndex=$cookieStore.get("modalToOpen");
        var tripDetails = $scope.myTrips[modalIndex];
        // console.log(tripDetails);
        localStorage.setItem('userTripDetails', JSON.stringify(tripDetails));
        $state.go("corporate.rideDetails");
    };
    $scope.rotateImage = function(id) {
        // console.log('rotate image of ',id);
        // $('.rideBody:nth-of-type('+id+') .displayArrow').css('height','50px');
        // console.log($('.table:nth-child('+id+') .displayArrow').hasClass('.collapse_dark_arrow'));
        if ($('.table:nth-child(' + id + ') .displayArrow').hasClass('.collapse_dark_arrow')) {
            $('.table:nth-child(' + id + ') .displayArrow').removeClass('.collapse_dark_arrow')
        } else {
            $('.table:nth-child(' + id + ') .displayArrow').addClass('.collapse_dark_arrow');
        }
    }
});

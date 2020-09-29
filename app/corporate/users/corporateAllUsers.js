App.controller('corporateAllUsersController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $timeout, tokenLogin) {

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
	$scope.buttonClicked = 0;
	 $('html, body').animate({scrollTop:0}, 'slow');
    $scope.pop={};
    $scope.pop.myDate = new Date();
    $scope.pop.isOpen = false;
    // $scope.Users = [];
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    $scope.userDetails = [];
    $scope.driverDetails = [];
  
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
	
        $cookieStore.remove('access_token');
       $state.go("corporate_login");
    }

    $scope.captureImage = false;
    $scope.camConfig = {
        delay: 1,
        countdown: 3,
    };

    $scope.onCameraCaptureError=function(err){
       
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
   

    $scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
     
		$scope.hideNext = 0;
		
		
		if(parseInt($scope.totalItems / 10 + 1) <= currentPage){
			$scope.hideNext = 1;
			
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
                
				
            }
        }
        $scope.initTable();
    };
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
            params.searchString = $scope.searchuser;
            $scope.hideLoadMore = 1;

            
			
		}else if((searchflag == 1) && !$scope.searchuser){
			params.offset = 0;
			$scope.currentPage = 1;
		}
		
		
		$.post(MY_CONSTANT.urlC + 'all_user_list',params )
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			
			if (data.flag == 101) {
				$scope.showCredentialsAlert();
			}
			if (data.flag == 807) {
			
				$scope.$apply();
			} else {
				
				
				
				$scope.totalItems= data.count;
				
				if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
                    $scope.hideLoadMore = 1;
              
                }
               
                else{
					$scope.hideLoadMore = 0;
				}
		
				$scope.Users = data.all_users;
				$scope.$apply();
					
			}
		
		});
          
    }
    $scope.initTable();
    $scope.loadData = function() {
        $('.accordion-toggle').addClass('collapsed');
    };
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.collapse').on('show.bs.collapse', function() {
            $('.collapse.in').collapse('hide');
            var index = $(this).attr("id");
            $scope.arrowKey = true
            $cookieStore.put('modalToOpen', index);
        });
        

    });
	
	
	
	
	
	
	
	
	$scope.loadMore = function() {
        $scope.DisableLoadMore = true;
	
		$scope.currentPage = $scope.currentPage+1;
       
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
                $timeout(function(){
                    $scope.DisableLoadMore = false;
            
                        },1500)
            }else{
               
                 
			}
        }
		
    }
	
	$scope.loadMoreNow = function(searchflag){
		var params = {
			web_access_token: $cookieStore.get("web_access_token"),
			limit: 10,
			offset: $scope.skip
		}
			
		if((searchflag == 1) && $scope.searchuser){
			params.searchFlag = 1;
			params.searchString = $scope.searchuser;
			
		}
        $.post(MY_CONSTANT.urlC + 'all_user_list', params)
            .success(function(data, status) {
              
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
                if (data.flag == 502) {
                 
                } else {
					$scope.totalItems= data.count;
					var Users = data.all_users;
					Users.forEach(function(userData,ind) {
                        
						$scope.Users.push(userData);		
					});
					
					$scope.$apply();
                }
                
            });
		
	}
	
	
	
    
    $scope.minDate=new Date();
  
    $scope.typeSelect = function(a) {
        $scope.doc.docType = a;
        // $scope.$apply();
    }
	
	
	$scope.openAddUser = function(){
		
		window.open('/#/corporate/riderSignup', '_blank');
	};
	
	
    $scope.doc = {};

    $scope.doc.expiry_date = new Date();
    $scope.doc.reminder_before = '';
    $scope.submitText = 'Add Document';
   
   
	$scope.searchForUser = function() {
		
	}
    // $scope.addtoAccount = function(user) {
        
	// 	$scope.otpMode = 1;
	// 	$scope.userInProcess = user;
	// 	$scope.userToAdd = user.user_id;
	// 	$scope.userMobileToAdd = user.user_mobile;
    //     $scope.otpToAdd = '';
		

		
	// 	 $.post(MY_CONSTANT.urlC+ 'associatedUser_send_otp', {
	// 			web_access_token: $cookieStore.get("web_access_token"),
	// 			mobile: user.user_mobile,
	// 			email: user.user_email,
	// 		}) .then(function successCallback(data) {
	// 			$rootScope.$apply(function () { 
	// 			if (typeof(data) == 'string') data = JSON.parse(data);
						
	// 				if(data.error || data.flag==0){
                     
                   
	// 					$rootScope.openToast('error', data.error || data.message, '');
                        
    //                     $('#add_to_account').modal('hide');
	// 					  return false;
	// 				}else{
                   
	// 					$rootScope.openToast('success', 'Please enter the OTP sent to User!', '');
	// 				}
	// 			})
				
	// 		})
		
    // }
    $scope.addtoAccount = function(user) {
		$scope.otpMode = 1;
		$scope.userInProcess = user;
		$scope.userToAdd = user.user_id;
		$scope.userMobileToAdd = user.user_mobile;
        $scope.otpToAdd = '';
        $('#add_to_account').modal('show');
        
        user.disableATA = true;
       
      
		
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_send_otp', {
				web_access_token: $cookieStore.get("web_access_token"),
				mobile: user.user_mobile,
				email: user.user_email,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error){
						
						$rootScope.openToast('error', data.error || data.message, '');
                        
                        setTimeout(function(){
								
								
                            user.disableATA = false;
                        },600);
						 $('#add_to_account').modal('hide');
						  return;
                    }
                    else if (data.flag==0){
                      
                     alert(data.message);
                     $('#add_to_account').modal('hide');
                    
					  user.disableATA = false;
                   
                    return;
                    }
                    else{
                        setTimeout(function(){
								
								
                            user.disableATA = false;
                        },600);
						$rootScope.openToast('success', 'Please enter the OTP sent to User!', '');
					}
				})
				
			})
		
	}
	
	$scope.reAddUser = function(user) {
		
		$scope.otpMode = 1;
		$scope.userInProcess = user;
		$scope.userToAdd = user.user_id;
        $scope.otpToAdd = '';
        $scope.DisableResnd = true;

		
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_resend_otp', {
				web_access_token: $cookieStore.get("web_access_token"),
				mobile: user.user_mobile,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
						
                     
						$rootScope.openToast('error', data.error || data.message, '');

                        $timeout(function(){
                            $scope.DisableResnd = false;
                        },2500)
                       
                        
						  return;
					}else{
						$rootScope.openToast('success', 'OTP sent again!', '');
						$timeout(function(){
                            $scope.DisableResnd = false;
                        },2500)
					}
				
			})
			
		})
	}
	$scope.completeUserAdd = function() {
		
		if ($scope.otpToAdd === '' || !$scope.otpToAdd) {
           
            alert( 'Please Enter OTP ');
           
            return false;
        }
        // else if ($scope.buttonClicked === 1) {           
        //     alert( 'Please Wait while we check OTP for you!');
        //     return false;
        // }
        else{
            $scope.buttonClicked = 1;
            $scope.DisonloadCUA = true
			$.post(MY_CONSTANT.urlC+ 'corporate_add_user', {
				web_access_token:  $cookieStore.get('web_access_token'),				
				user_id:$scope.userToAdd,
				role:0,
				otp:$scope.otpToAdd,
				mobile:$scope.userMobileToAdd
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
						$scope.buttonClicked = 0;	
						if(data.error || data.flag==0){
                            $rootScope.openToast('error', data.error, '');
							$timeout(function(){
                          $scope.DisonloadCUA = false

                            },1500)
							  return;
						}else{
							$timeout(function(){
                                $scope.DisonloadCUA = false
      
                                  },500)
							$rootScope.openToast('success', 'User Added Successfully', '');
							 $('html, body').animate({scrollTop:0}, 'slow');
							$('#add_to_account').modal('hide');
							
							 $('.modal-backdrop.show').fadeOut();
							
							setTimeout(function(){
								
								
								$state.go("corporate.myUsers");
							},300);
							
							
							 return;
						}
			
				});
				
			});
		}
		
		
	}
	
	
    $scope.autoFillOTP = function() {
		
		
		 
		 $.post(MY_CONSTANT.urlC+ 'associated_otp_auto_fill', {
				web_access_token:  $cookieStore.get('web_access_token'),	
				mobile : $scope.userMobileToAdd,				
				
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
						$scope.buttonClicked = 0;	
						if(data.error || data.flag==0){
                            $rootScope.openToast('error', data.error || data.message, '');

							  return;
						}else{
							
								$('#show_confirmation').modal('hide');
							if(data){
                                $scope.otpToAdd = data.otp;
                              
                             }
                            else{
								$scope.otpToAdd = '';
							}
							
							
							
							
							 return;
						}
			
				});
				
			});
		 
		 
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
        $.post(MY_CONSTANT.urlC+ 'change_attention_doc', {
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
        $.post(MY_CONSTANT.urlC+ 'verify_doc', {
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
       
        $scope.editDoc = edit;
        $scope.doc.expiry_date = new Date(doc.expiry_date);
        $scope.doc.reminder_before = doc.reminder_before;
        $scope.doc.document_url = doc.document_url;
        $scope.doc.doc_id = doc.doc_id;
        $scope.doc.docType = $scope.docTypes.find(function (docType) {
            return docType.document_type_id == doc.document_type_id
        })
       
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
        
        localStorage.setItem('userTripDetails', JSON.stringify(tripDetails));
        $state.go("corporate.rideDetails");
    };
    $scope.rotateImage = function(id) {
     
        if ($('.table:nth-child(' + id + ') .displayArrow').hasClass('.collapse_dark_arrow')) {
            $('.table:nth-child(' + id + ') .displayArrow').removeClass('.collapse_dark_arrow')
        } else {
            $('.table:nth-child(' + id + ') .displayArrow').addClass('.collapse_dark_arrow');
        }
    }
});

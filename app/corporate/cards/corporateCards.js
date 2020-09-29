App.controller('corporateCardsController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, tokenLogin) {

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
	
    $scope.pop={};
    $scope.pop.myDate = new Date();
    $scope.pop.isOpen = false;
    $scope.Users = [];
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    $scope.userDetails = [];
    $scope.driverDetails = [];
   
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
        $scope.driverDetails.subtype_id = driverModel.subtype_id;
		
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
                
                //$scope.$apply();
				
            }
        }
        $scope.initTable();
    };
	var card;
    $scope.initCard = function() {
		
			var stripe = Stripe(MY_CONSTANT.stripeKey);
			var elements = stripe.elements();
				
				
				
		var style = {
		  base: {
			// Add your base input styles here. For example:
			fontSize: '16px',
			color: "#32325d",
		  }
		};

		// Create an instance of the card Element.
		card = elements.create('card', {style: style});

		// Add an instance of the card Element into the `card-element` <div>.
		card.mount('#card-element');
		
		card.addEventListener('change', function(event) {
		  var displayError = document.getElementById('card-errors');
		  if (event.error) {
			displayError.textContent = event.error.message;
		  } else {
			displayError.textContent = '';
		  }
		});



		var form = document.getElementById('payment-form');
		
		
		form.addEventListener('submit', function(event) {
			
			
			  event.preventDefault();
				
				stripe.createToken(card)
				.then(function(result) {
					if (result.error) {
						$scope.buttonClicked = 0;
					  // Inform the customer that there was an error.
					  var errorElement = document.getElementById('card-errors');
					  errorElement.textContent = result.error.message;
					} else {
						
					  // Send the token to your server.
						$scope.stripeTokenHandler(result.token);
					}
				});
				/*.fail(function(){
				
					$('#loading').modal('hide');
					$scope.$apply();
				});*/
		});


	}
	$scope.stripeTokenHandler =  function(token) {
        $scope.OnloadDisable = true;
		if ($scope.buttonClicked === 1) { 
            setTimeout(function(){
                $scope.OnloadDisable = false;
               },1500)          
            $rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
            return false;
        }else{
			$scope.buttonClicked = 1;
			$.post(MY_CONSTANT.urlC + 'add_credit_card', {
				web_access_token: $cookieStore.get("web_access_token"),
				nounce:token.id,
				card_type:52,
				offset: new Date().getTimezoneOffset()*-1,
				
			})
			 .then(function successCallback(data, status) {
				$rootScope.$apply(function () { 
				
				setTimeout(function(){
								
					$scope.buttonClicked = 0;

				},3000);					
					if (typeof(data) == 'string')
						data = JSON.parse(data);
					else data = data;
					
					if(data.flag==301){
                        setTimeout(function(){
                            $scope.OnloadDisable = false;
                           },1500)    
						$scope.openToast('error',"Duplicate Card, Please try another",'');
					}else if (data.error) {
                        setTimeout(function(){
                            $scope.OnloadDisable = false;
                           },1500)    
						$scope.openToast('error',data.error,'');
                        
						return;
					} else {				
                        card.clear();
                        setTimeout(function(){
                            $scope.OnloadDisable = false;
                           },1500)    
						$rootScope.openToast('success', 'Card Added Successfully', '');
						
						$('#add_to_account').modal('hide');
						$scope.initTable();
					}
				
				});
			});
		}
		
	}
	
    $scope.initTable = function() {
      
		$.post(MY_CONSTANT.urlC + 'list_credit_cards', {
				web_access_token: $cookieStore.get("web_access_token"),
			
			})
		 .then(function successCallback(data, status) {
			
			// data = JSON.parse(data);
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			
			if (data.flag == 101) {
				$scope.showCredentialsAlert();
			}
			if (data.flag == 807) {
				$scope.totalItems = data.resultData.length;
				$scope.docs = data.driver_docs;

				$scope.$apply();
			} else {
				
				$scope.Users = [];
				
				$scope.totalItems= data.count;
				
				var Cards = data.list_credit_cards;
					
				Cards.forEach(function(card,ind) {
					 
					var d = card;
					if(card.card_added_on){
						d.card_added_on =  card.card_added_on;
						
						

						if(Date.parse(d.card_added_on)){
							var dt = new Date(d.card_added_on)
							
							dt.setMinutes(dt.getMinutes() - d.offset)
							var raw = dt.toISOString();
							d.card_added_on =  raw;
						}
						
						
					}	
						
					$scope.Users.push(d);	
					 
				});

				$scope.$apply();
				
			
		
					
			}
			
		});
          
    }
    $scope.initTable();
    $scope.initCard();
	
	$scope.setDefaultCard = function(card_id){
        $scope.onLoad = true;
		if(card_id){
			$.post(MY_CONSTANT.urlC + 'change_default_card', {
				web_access_token: $cookieStore.get("web_access_token"),
				card_id:card_id
			})
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			
			if (data.error) {
                setTimeout(function(){
                    $scope.onLoad = false;
                                       
                     },1500)
                $rootScope.openToast('error', data.error, '');
                
				return;
			} else {
                setTimeout(function(){
                    $scope.onLoad = false;
                                       
                     },1500)
				$rootScope.openToast('success', 'Default card updated', '');
				$scope.initTable();
                  
					
			}
			
		});
          
		}
	}
	
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
		
		window.open(MY_CONSTANT.vendorBaseURL+'riderlogin.html', '_blank');
	};
	
	
    $scope.doc = {};

    $scope.doc.expiry_date = new Date();
    $scope.doc.reminder_before = '';
    $scope.submitText = 'Add Document';
   
   
   $scope.showCardAlert = function(){
		$('#show_cardError').modal('show');
		$scope.cardAlert = 1;
	}
	
	$scope.closeCard = function(){
		$scope.showLoader = 0;
		$('#show_cardError').modal('hide');	
	}
	
  
	$scope.deleteCard = function(user){
		if(confirm("Are you sure you want to delete this Card?")){
			
				
				if(user.id){
					
					 $.post(MY_CONSTANT.urlC+ 'delete_card', {
						web_access_token:  $cookieStore.get('web_access_token'),				
						card_id:user.id				
					}) .then(function successCallback(data) {
						$rootScope.$apply(function () { 
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
								if (data.flag == 304) {
									$scope.showCardAlert();						
									$scope.showLoader = 0;
									
								}else if(data.error || data.flag==0){
									
									alert(data.error || data.message);
									  return;
								}else{
									
									$rootScope.openToast('success', 'Card Removed Successfully', '');
									
									
									$scope.initTable();
								}
					
						});
						
					});
					
					
				}
		}else{
			
		}
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
                setTimeout(function() {
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
                setTimeout(function() {
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
                setTimeout(function() {
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

App.controller('corporateStaffController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $timeout, tokenLogin) {
	
	if (!$cookieStore.get('web_access_token')) {
         $state.go("corporate_login");
    }
	$rootScope.ridePage = 0;
	$scope.skip = 0;
	$scope.currentPage = 1;
    $scope.pop={};
    $scope.pop.myDate = new Date();
    $scope.pop.isOpen = false;
    $scope.docs = [];
	
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
		  $scope.driverDetails.subtype_id = driverModel.subtype_id;
    } else {
		
        $cookieStore.remove('access_token');
         $state.go("corporate_login");
    }



    $scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
       
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
                
                //$scope.$apply();
            }
        }
        $scope.initTable();
    };
    $scope.initTable = function() {
		return false;
		$.post(MY_CONSTANT.urlV + 'get_doc_types')
		.then(function successCallback(data, status) {
			if (typeof(data) == 'string')
			data = JSON.parse(data);
			$scope.docTypes = data.doc_types;
				
			
			$.post(MY_CONSTANT.urlC + 'corporate_docs', {
				web_access_token: $cookieStore.get("web_access_token"),
			   // limit: 10,
			   // skip: $scope.skip
			})
			 .then(function successCallback(data, status) {
				// console.log(data);
				// data = JSON.parse(data);
				// console.log(data);
				if (typeof(data) == 'string')
					data = JSON.parse(data);
				else data = data;
				// console.log(data);
				if (data.flag == 101) {
					$scope.showCredentialsAlert();
				}
				if (data.flag == 808) {
					$scope.totalItems = data.driver_docs.length;
					$scope.docs = data.driver_docs;
					
					$scope.$apply();
				} else {

				}
			});
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

    $scope.minDate=new Date();
 
    $scope.typeSelect = function(a) {
        $scope.doc.docType = a;
        // $scope.$apply();
    }
    $scope.doc = {};

    $scope.doc.expiry_date = new Date();
    $scope.doc.reminder_before = '';
    $scope.submitText = 'Add Document';
    $scope.addEditDocType = function(doc, type) {
     
        if (doc.expiry_date === '') {
            // alert('Select Expiry Date');
            $rootScope.openToast('error', 'Select Expiry Date', '');
            return false;
        }
    
        if (doc.docType === undefined) {
            // alert('Select Document Type');
            $rootScope.openToast('error', 'Select Document Type', '');
            return false;
        }
        if(doc.doc_file === undefined){
            if(doc.capturedImage){
                doc.doc_file = doc.capturedImage;
            }
            else {
                $rootScope.openToast('error', 'Please select document to upload', '');
                return false;
            }
        }
        var form = new FormData();
        form.append('web_access_token',$cookieStore.get("web_access_token"));
        form.append('document_type_id', doc.docType.document_type_id);
        form.append('reminder_before', 30);
        form.append('expiry_date', moment(doc.expiry_date).format('YYYY-MM-DD'));
        form.append('doc_file', doc.doc_file);
		
        if (type == 0) {

            $scope.submitText = 'Uploading.....';
      
		   
            $http.post(MY_CONSTANT.urlC + 'upload_corporate_doc', form, {
                    headers: {
                        'Content-Type': undefined
                    }
                })
                 .then(function successCallback(data, status) {
                   // console.log(data);
                    data = data =='string' ? data = JSON.parse(data).data : data.data;
                    if (data.flag == 1303) {
                        // $scope.docmsg = 'Document Added Successfully'
                        $scope.submitText = 'Add Document';
                        $rootScope.openToast('success', 'Document Added Successfully', '');
                        $('#document_dialog').modal('hide');
                        $('.modal-backdrop').hide();
                        $scope.initTable();
                        //$state.reload();
                        // $timeout(function() {
                        //     // $scope.docmsg = '';
                        // }, 2500);
                    }
                    if (data.flag == 1302) {
                        $scope.submitText = 'Add Document';
                        $('#document_dialog').modal('hide');
                        // $scope.docmsg = 'A valid document of this type already exist for this corporate.';
                        $rootScope.openToast('error', 'A valid document of this type already exist for this affiliate.', '');
                        // $timeout(function() {
                        //    $scope.docmsg = '';
                        // }, 2500);
                    }
                })

        } else {
            

            form.append('doc_id', doc.doc_id);
     
            $http.post(MY_CONSTANT.urlC + 'edit_document', form, {
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function successCallback(data, status) {
                   
                    data = data.data;
                    if (data.flag == 1308) {
                        $rootScope.openToast('success', 'Document Updated Successfully', '');
                        $('#document_dialog_edit').modal('hide');
                        $('.modal-backdrop').hide();
                        $scope.initTable();
                        $scope.editDoc = false;
                        // $scope.docmsg = 'Document Edited Successfully'
                        //$scope.submitText = 'Submit';
                        // $rootScope.openToast('success', 'Document Edited Successfully', '');
                        // $timeout(function() {
                        //     ngDialog.close({
                        //         template: 'document_dialog',
                        //         className: 'ngdialog-theme-default',
                        //         scope: $scope
                        //     });
                        //     // $scope.docmsg = '';
                        //     $state.reload();
                        // }, 2500);
                    }
                    if (data.flag == 1302) {
                        //$scope.submitText = 'Submit';
                        // $scope.docmsg = 'A valid document of this type already exist for this affiliate.';
                        // $timeout(function() {
                        //     $scope.docmsg = '';
                        // }, 2500);
                        $('#document_dialog_edit').modal('hide');
                        $rootScope.openToast('error', 'A valid document of this type already exist for this affiliate.', '');
                    }
                })
        }
    }
    $scope.closeThisDialog = function() {
        $scope.doc = {};
    }
    $scope.validate_doc_dialog = function(doc_id, v) {
        $scope.validate = v;
        $scope.doc_id = doc_id;

        ngDialog.open({
            template: 'validate_doc_dialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.validateDoc = function(docID, flag) {
        $.post(MY_CONSTANT.url + '/valid_invalid_doc', {
            access_token: localStorage.getItem('access_token'),
            doc_id: docID,
            valid_flag: flag
        }) .then(function successCallback(data) {
            if (data.flag == 1305) {
                // $scope.validatemsg = 'Document Validated Successfully'
                $rootScope.openToast('success', 'Document Validated Successfully', '');
                $timeout(function() {
                    ngDialog.close({
                        template: 'validate_doc_dialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    // $scope.validatemsg = '';
                    $state.reload();
                }, 2500)
            }
            if (data.flag == 1306) {
                // $scope.validatemsg = 'Document Invalidated Successfully'
                $rootScope.openToast('success', 'Document Invalidated Successfully', '');
                $timeout(function() {
                    ngDialog.close({
                        template: 'validate_doc_dialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    // $scope.validatemsg = '';
                    $state.reload();
                }, 2500)
            }
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
        $.post(MY_CONSTANT.url + '/change_attention_doc', {
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
        $.post(MY_CONSTANT.url + '/verify_doc', {
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
        $state.go("affiliate.rideDetails");
    };
    $scope.rotateImage = function(id) {
      
        if ($('.table:nth-child(' + id + ') .displayArrow').hasClass('.collapse_dark_arrow')) {
            $('.table:nth-child(' + id + ') .displayArrow').removeClass('.collapse_dark_arrow')
        } else {
            $('.table:nth-child(' + id + ') .displayArrow').addClass('.collapse_dark_arrow');
        }
    }
});

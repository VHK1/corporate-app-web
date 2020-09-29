App.controller('corporateBankDetailsController', function ($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog) {


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
	$scope.accountType = 1;
	// if ($scope.accountType = 1){
       
	// }

	// $scopeAddAccount.$invalid = true;
	// $scope.CheckDisabled=false;
	$scope.bregion="New York";
	$scope.region="New York";
	// $scope.isDisabled = true;
    $scope.pop={};
    $scope.pop.myDate = new Date();
    $scope.pop.isOpen = false;
    $scope.Users = [];
	var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
	
	var newdriverModel = JSON.parse(localStorage.getItem('driverdata'));
	
    $scope.userDetails = [];
	$scope.driverDetails = [];

    if(driverModel) {
        $scope.userDetails.userName = driverModel.driver_name;
        $scope.userDetails.userImage = driverModel.driver_image;
        $scope.driverDetails.driver_image = driverModel.driver_image;
        $scope.driverDetails.driver_mobile = driverModel.driver_mobile;       ;
        $scope.driverDetails.driver_location = 'New York';
        $scope.driverDetails.referral_code = driverModel.referral_code;
        $scope.driverDetails.corporate_id = driverModel.corporate_id;
    }
    else {
        $cookieStore.remove('web_access_token');
        $state.go("corporate_login");
    }
    
    $scope.logout = function() {
        $('.modal').modal('hide');
        $cookieStore.remove('access_token');
       $state.go("corporate_login");
    };
   

      $scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
        // console.log('Page changed to: ' + $scope.currentPage);
		$scope.hideNext = 0;
		// console.log('show ',currentPage, parseInt($scope.totalItems / 10 + 1));
		
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
		var card = elements.create('card', {style: style});

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

		  stripe.createToken(card).then(function(result) {
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
		});


	}




	$scope.trimZip = function() {
		$scope.postal = $scope.postal.slice(0,6);
	}

	$scope.stripeTokenHandler =  function(token) {
		if ($scope.buttonClicked === 1) {
            $rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
            return false;
        }else{
			$scope.buttonClicked = 1;
			$.post(MY_CONSTANT.urlC + 'add_credit_card', {
				web_access_token: $cookieStore.get("web_access_token"),
				nounce:token.id,
				card_type:52
			})
			 .then(function successCallback(data, status) {
				$rootScope.$apply(function () {

				setTimeout(function(){
					$scope.buttonClicked = 0;

				},3000);
					if (typeof(data) == 'string')
						data = JSON.parse(data);
					else data = data;

					if (data.error) {
						$rootScope.openToast('error', data.error, '');

						return;
					} else {
						$rootScope.openToast('success', 'Card Added Successfully', '');
						
						$('#add_to_account').modal('hide');
						$scope.initTable();
					}

				});
			});
		}

	}

    $scope.initTable = function() {

	  $scope.Users = [];
	  
		$.post(MY_CONSTANT.urlC + 'view_sub_merchant_account_details', {
				web_access_token: $cookieStore.get("web_access_token"),

			})
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			// $scope.totalItems= data.account_details.length;
            $scope.Users = data.account_details;
		
				$scope.$apply();

			}
			
		);

    }
    $scope.initTable();
    //$scope.initCard();




	$scope.setDefaultCard = function(card_id){
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
				$rootScope.openToast('error', data.error, '');

				return;
			} else {

				$rootScope.openToast('success', 'Default card updated', '');
				$scope.initTable();


			}

		});

		}
	}



	$scope.file_to_upload = function(files) {
	
        processfile(files[0]);
        $scope.front_doc_file=files[0];
        $scope.front_doc_file_name = files[0].name;
        $scope.$apply();
	}
	$scope.file_to_uploadB = function(files) {
		
		
		processfile(files[0]);
        $scope.back_doc_file=files[0];
        $scope.back_doc_file_name = files[0].name;
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
        $scope.doc_file_name = blob;
        $scope.doc_file_nameB = blob;
        // $scope.$apply();
    };

	$scope.someFunction = function(myCheckbox){

		if(myCheckbox==true){
			$scope.term_checked = myCheckbox;
		
			
		}
		else{
			$scope.errormsg = "Please select checkbox"
			
		}
		
	}

	// console.log(newdriverModel.first_name,newdriverModel.last_name,newdriverModel.email,newdriverModel.mobile,'cm')
	 $scope.fname = newdriverModel.first_name
	 $scope.lname = newdriverModel.last_name
	 $scope.Email = newdriverModel.email
	 $scope.Phone = newdriverModel.mobile

	 $scope.sendBankDetails =  function(formCheck){

		// $scope.dob =new Date(dob);
	// 	var date = new Date(str)
    //   var datestring =d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) +"-" + ("0" + d.getDate()).slice(-2) ;
    //    $scope.dob = datestring;
	
	// 	function convert(str) {
	// 		var date = new Date(str),
	// 		  month = ("0" + (date.getMonth() + 1)).slice(-2),
	// 		  day = ("0" + date.getDate()).slice(-2);
	// 		return [date.getFullYear(), month, day].join("-");
	// 	  }
	

	//    $scope.date=convert($scope.dob)
	// console.log($scope.AddAccount.$invalid,formCheck,"23342")
	$scope.AddAccount.$invalid = true;
	 $scope.loading = true;
	   if (!formCheck){
		var form = new FormData();
        	form.append('personalInfo_firstName', $scope.fname);
			form.append('personalInfo_lastName', $scope.lname);
			form.append('personalInfo_email', $scope.Email);
			form.append('personalInfo_phone', $scope.Phone);
			form.append('personalInfo_dateOfBirth', ($scope.dob));
			form.append('personalInfo_ssn', $scope.ssn);
			form.append('personalInfo_address_streetAddress', $scope.address);
			form.append('personalInfo_address_locality', $scope.locality);
			form.append('personalInfo_address_region', $scope.region);
			form.append('personalInfo_address_postalCode', $scope.postal);
			form.append('business_type', $scope.accountType);
			form.append('business_businessUrl', $scope.bussinessWeb);
			form.append('business_phoneNumber', $scope.Mob);
			form.append('business_name', $scope.BussinessName);
			form.append('business_taxId', $scope.taxid);
			form.append('business_address_streetAddress', $scope.saddress);
			form.append('business_address_locality', $scope.city);
			form.append('business_address_region', $scope.bregion);
			form.append('business_address_postalCode', $scope.postalc);
			form.append('business_address_country', $scope.country);
			form.append('front_document', $scope.front_doc_file ? $scope.front_doc_file :'');
			form.append('back_document', $scope.back_doc_file ? $scope.back_doc_file:'');
			form.append('accountDetails_accountNumber', $scope.accNumber);
            form.append('accountDetails_routingNumber', $scope.routingNum);
			form.append('web_access_token',$cookieStore.get("web_access_token"));
            form.append('tos_accepted',$scope.term_checked);

			
		    
			
			$http.post(MY_CONSTANT.urlC + 'add_sub_merchant_account', form,{
				headers: {
					'Content-Type': undefined
				}
			})			
			 .then(function successCallback(data, status) {
				data = data =='string' ? data = JSON.parse(data).data : data.data;
				
				   $scope.AddAccount.$invalid = false;
				  
				if (data.error) {
					setTimeout(function(){
						$scope.AddAccount.$invalid = false;
					
					   },2000)
					   $scope.loading = false;
					$scope.openToast('error',data.error, '');
					
					
					return;
					
				}
				
				else if (data.flag == 3111) 
				$scope.openToast('success', 'Account is Created Successfully', '');
				$scope.loading = false;
				$scope.AddAccount.$invalid = false;
					$('#add_to_account').modal('hide');
					// $scope.$apply();
					$scope.initTable();
					
					$('.modal-backdrop.show').fadeOut();
					$('#loading').modal('hide');		
					
			});

		}
	
	else{
		
		$scope.openToast("error", 'Invalid details', "ERROR");
		$scope.loading = false;
	   setTimeout(function(){
		$scope.AddAccount.$invalid = false;
		
	   },2000)
	
		
	  
	   
	}
	
	}



	


	



});

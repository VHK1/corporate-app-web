App.controller('riderSignupController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $interval, $timeout,ngMeta) {
    $scope.OTPStarted = 0;
    $scope.otpSent = 0;
    $scope.otpVerified = 0;
    $scope.hitInProgress=0;
	
	
	$scope.loginUser = {};
	$scope.loginUser.state_id='United States';
	  
	$scope.signupData = {};
	
	$scope.step1 = 1;
	$scope.step2 = 0;

	
    $scope.showSignup1 = function() {
		$scope.step1 = 1;
		$scope.step2 = 0;
	} 
	
	$scope.showSignup3 = function() {
		if( $scope.loginUser.state_id &&  $scope.otpSent){
			$scope.signup1 = 0;	
			$scope.signup2 = 0;	
			$scope.signup3 = 1;
			$scope.signup4 = 0;
		}
	}
	
	$scope.showSignup4 = function() {
		$scope.signUp();
			$scope.success = 1;
			$scope.otpVerified = 1;
			$scope.OTPStarted = 1;
			$scope.otpSent = 1;
			$scope.signup3 = 0;
			$scope.signup4 = 1;
	}
	
	
    $scope.checkZip = function() {
		$scope.loginUser.zip_code = $scope.loginUser.zip_code.slice(0,6);
	}
	
   
	
    $scope.getCountryandMobile = function() {
			$scope.promoCountryCode = $('#extPopTwo').val()+"-";
			
			if($scope.riderUser.mobile.indexOf('+')>=0){
				//$scope.promoCountryCode = '';
				
				$scope.riderUser.mobile =  $scope.riderUser.mobile.replace($('#extPopTwo').val()+"-",'');
				$scope.riderUser.mobile =  $scope.riderUser.mobile.replace($('#extPopTwo').val(),'');
				
				return 1;
			}else{
				
				return 1;
			}
			
	}
	
   
   $scope.validateRiderOTP = function (){
		var fname1 = $('#fname1').val();
		var lname1 = $('#lname1').val();
		var mobile1 = $("#phone").val();
		$scope.promoCountryCode = $('#extPopTwo').val()+"-";
		var email1 = $('#email1').val();
		var password1 = $('#password1').val();
		var otp1 = $('#otp1').val();
		var referral = $('#referral').val();

		if(otp1.trim()==''){
		   alert('Please Enter OTP');
		   return 0;
		}else if(password1==''){
		   alert('Please Enter Password');
		   return 0;
		}
	     return 1;
   }
	
	
	$scope.validateRider = function (){
	   
		var reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;

		var fname1 = $('#fname1').val();
		var lname1 = $('#lname1').val();
		$scope.promoCountryCode = $('#extPopTwo').val()+"-";
		var mobile1 = $("#phone").val();
		var email1 = $('#email1').val();
		var referral = $('#referral').val();
		var city = $('#city').val();
		var zipcode = $('#zipcode').val();

		if(fname1.trim() == '' ){


			alert('Please enter your First Name.');
			$('#fname1').focus();

			return false;
		}else if(lname1.trim() == '' ){
			alert('Please enter your Last Name.');
			$('#lname1').focus();
			return false;
		}else if(mobile1.trim() == '' ){
			alert('Please enter your Mobile Number.');
			$('#mobile1').focus();
			return false;
		}else if(mobile1.trim() == '' ){
			alert('Please enter your Mobile Number.');
			$('#mobile1').focus();
			return false;
		}
		else if(!/^[1-9]{1}[0-9]{9}$/.test(mobile1)){
			alert('Please enter valid Mobile Number.');
			$('#mobile1').focus();
			return false;
		}else if(email1.trim() == '' ){
			alert('Please enter your Email.');
			$('#email1').focus();
			return false;
		}else if(email1.trim() != '' && !reg.test(email1)){
			alert('Please enter valid email.');
			$('#email1').focus();
			return false;
		 }else if(city.trim() == '' ){
			alert('Please enter your City.');
			$('#city').focus();
			return false;
		}else if(zipcode.trim() == '' ){
			alert('Please enter your Zip Code.');
			$('#zipcode').focus();
			return false;
		}else if(zipcode.length < 5 ){
			alert('Please Enter valid zip code.');
			$('#zipcode').focus();
			return false;
		}
	  
		return 1;
	}
   
    $scope.hitCheckMobile = function(user) {
		
		if($scope.validateRider()){
			
			
			  $scope.loading = true;
			  $scope.disableMobileHit = true;
		
			$.post(MY_CONSTANT.url+ 'check_mobile',{
			   user_mobile: $scope.promoCountryCode + $scope.riderUser.mobile,
			   user_email:  $scope.riderUser.email,
			   is_corporate:  1,
			}) 
			.then(function successCallback(data) {
				$rootScope.$apply(function () { 
					
					   if (typeof(data) == 'string') data = JSON.parse(data);
					   if (data.error) {
						// $scope.onhitCheckMobile=false;
						$scope.loading = false;
						$timeout(function(){
							
							$scope.disableMobileHit = false;
						},1500)
						
						   $rootScope.openToast('error',data.error,'');
						   return;
					   }else if (data.flag == 107) {
						   
						// $scope.onhitCheckMobile=false;
						$scope.loading = false;
						$timeout(function(){
							
							$scope.disableMobileHit = false;

						},1500)
						   $rootScope.openToast('error',data.error,'');
							 return;
					   }else if(data.flag == 108){
						// $scope.onhitCheckMobile=false;
						$scope.loading = false;
						$timeout(function(){
							
							$scope.disableMobileHit = false;

						},1500)
						//    alert('Please enter a valid phone number');
						   $rootScope.openToast('error',data.error,'');
                                 
						   return;
					   }
					   else{
						$scope.loading = false;
						$scope.disableMobileHit = false;
					   }
					//    $rootScope.openToast('success', data.log, '');
					//    $scope.onhitCheckMobile = false;
					  
					
					
						param = {
							user_mobile :   $scope.promoCountryCode + $scope.riderUser.mobile,
							user_email :   $scope.riderUser.email
						}
					   
					   $scope.addtoAccount(param);
					 //  $scope.riderSignUp();
					   
				});
			});

		}
		
	}
	
	$scope.resendRiderOtp = function() {
		$.post(MY_CONSTANT.url+ 'resend_otp', {
                user_mobile: $scope.promoCountryCode + $scope.riderUser.mobile,
				is_approved:1
            })
            .success(function(data, status) {
                if (data.flag == 0) {
                    $scope.errorMsg = data.message;
                    setTimeout(function() {
                        $scope.errorMsg = '';
                    }, 2500)
                } else {
					if(typeof data==="string"){
						data = JSON.parse(data);
					}
					if(data.error){
						$rootScope.openToast('error',data.error,'')
						
						return false;
					}
					$('#otp1').val('');
					
					$rootScope.openToast('success', 'An OTP has been sent on User\'s mobile number!', '');
                }
            })
	}
	
	$scope.verifyRiderOtp = function() {
		if($scope.validateRiderOTP()){
			
			$.post(MY_CONSTANT.url+ 'verify_otp',{
				user_mobile: $scope.promoCountryCode + $scope.riderUser.mobile,
				is_approved: 1,
				otp: $scope.otp1
			}) 
			.then(function successCallback(data) {
				$rootScope.$apply(function () { 
					   if (typeof(data) == 'string') data = JSON.parse(data);
					   if (data.error) {
						   $rootScope('error',data.error,'')
					
						   return;
					   }else if (data.flag == 123) {
						$rootScope('error','This phone number is already registered with us.','')
                          
						   return;
					   }else if(data.flag == 108){
						$rootScope('error','Please enter a valid phone number','')
						  return;
					   }
					   $scope.step1 = 0;
					   $scope.step2 = 1;
				
					
					   
				});
			});

		}
		
	}
		
	$scope.otp_first = function() {
	
	
       var fname1 = $('#fname1').val();
       var lname1 = $('#lname1').val();
       var mobile1 = $("#phone").val();
       $scope.promoCountryCode = $('#extPopTwo').val()+"-";
       var email1 = $('#email1').val();
       var password1 = $('#password1').val();
       var otp1 = $('#otp1').val();
       var referral = $('#referral').val();
	   var city = $('#city').val();
		var zipcode = $('#zipcode').val();

		/*
			if(!$scope.riderUser.email){
				$scope.riderUser.email = '';
			}*/
			
			
	
		if ($scope.otpToAdd === '' || !$scope.otpToAdd) {
           
            $rootScope.openToast('error', 'Please Enter OTP ', '');
            return false;
        }else if ($scope.buttonClicked === 1) {           
            $rootScope.openToast('error', 'Please Wait while we check OTP for you!', '');
            return false;
        }else{
			$scope.buttonClicked = 1;
			setTimeout(function(){
				$scope.buttonClicked = 0;
			},4000);
				
			var data = { 		
				user_name:  $scope.riderUser.fname+' '+ $scope.riderUser.lname,
				user_mobile:  $scope.promoCountryCode + $scope.riderUser.mobile,
				user_email:  $scope.riderUser.email,
				is_corporate: 1,
				referring_code: referral,
				zipcode: zipcode,
				city: city,
			};
			
			
			
			$.post(MY_CONSTANT.url+ 'email_registration',data)
			.then(function(data,status) {
				$rootScope.$apply(function () { 
				
					if(typeof data == 'string'){
						  data = JSON.parse(data);
					}
					if(data.error){
					 $scope.buttonClicked = 1;
					 $rootScope.openToast('error', data.error, '');
					 $scope.showSignup1();
				
                     return;
					}else{
						
						$scope.newRider = data.userInfo;
						 $scope.userToAdd = data.userInfo.user_id;
				         $scope.otpVerified = 1;
						$scope.OTPStarted = 1;
						$scope.otpSent = 1;
						$scope.success = 1;
						$scope.completeUserAdd();
					}
				});
			});
					  
					  
		}
    }
	$scope.riderSignUp = function() {
		
		// $scope.userMobileToAdd = user.user_mobile;
		$scope.loading = true;
		$scope.onriderSignUp = true;
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_verify_otp', {
				web_access_token: $cookieStore.get("web_access_token"),
			   otp: $scope.otpToAdd,
			   mobile: $scope.userMobileToAdd,
			}) .then(function successCallback(data) {
				
				$rootScope.$apply(function () { 
					
				if (typeof(data) == 'string') data = JSON.parse(data);
				    //  $scope.loading = true;
					if(data.error){
						$rootScope.openToast('error', data.error || data.message, '');
				     $scope.loading = false;
                     	$timeout(function(){
							$scope.onriderSignUp = false;
						},1500)
						  return;
					}else{
						
						$scope.otp_first();
							$scope.loading = false;
							$scope.onriderSignUp = false;
					
						
					}
					
				})
				
			})
		
	}

	
	
	
    $scope.addtoAccount = function(user) {
		
		$scope.otpMode = 1;
		$scope.userMobileToAdd = user.user_mobile;
		$scope.otpToAdd = '';
		$scope.loading = false;
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_send_otp', {
				web_access_token: $cookieStore.get("web_access_token"),
				mobile: user.user_mobile,
				email: user.user_email,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
						
						$rootScope.openToast('error',data.error || data.message,'');
						 $('#add_to_account').modal('hide');
						  return;
					}else{
						$scope.step1 = 0;
						$scope.step2 = 1;
						$rootScope.openToast('success', data.message, '');
					}
				})
				
			})
		
	}


	
	

	
	
	
	$scope.reAddUser = function() {
	
		$scope.DisableResnd = true;
		$scope.otpToAdd = '';
		$scope.otpMode = 1;
		// $scope.otpToAdd = '';
		
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_resend_otp', {
				web_access_token: $cookieStore.get("web_access_token"),
				mobile: $scope.userMobileToAdd,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
						
						$timeout(function(){
							$scope.DisableResnd = false;
	                    },1500)
						$rootScope.openToast('error', data.error || data.message, '');

						  return;
					}else{
						
						$rootScope.openToast('success', 'OTP sent again!', '');
						$timeout(function(){
							$scope.DisableResnd = false;
	   
							   },1500)
					}
				
			})
			
		})
	}
	
	$scope.completeUserAdd = function() {
		
		
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
							$rootScope.openToast('error', data.error || data.message,'')
							
							  return;
						}else{
							// $scope.otpverifyfirst();
							;
							$rootScope.openToast('success', data.log, '');
							
							$('#add_to_account').modal('hide');
							//$('#add_to_account').modal('hide');
							//$scope.initTable();
							 $('.modal-backdrop.show').fadeOut();
							
							setTimeout(function(){
								
								//window.location.assign('/#/corporate/myUsers');
								//window.location.reload();
								$state.go("corporate.myUsers");
							},300);
							
							
							 return;
						}
			
				});
				
			});
		
		
	
	}
	
	
    $scope.autofillotp = function() {
		
		
		if(!$scope.userMobileToAdd){
			alert('Please create account first by clicking  \'Create My Rider Account\'! ');
		}
		 $.post(MY_CONSTANT.urlC+ 'associated_otp_auto_fill', {
				web_access_token:  $cookieStore.get('web_access_token'),	
				mobile : $scope.userMobileToAdd,				
				
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
						$scope.buttonClicked = 0;	
						if(data.error || data.flag==0){
							$rootScope.openToast('error', data.error || data.message ,'')
							
							  return;
						}else{
							
							//$rootScope.openToast('success', 'User Added Successfully', '');
							
							$('#show_confirmation').modal('hide');
							
							if(data){
								$scope.otpToAdd = data.otp;
								$('#corporate_getCode').modal('hide');
							
								
							}
							 else{
								$scope.otpToAdd = '';
								// $rootScope.openToast('error', 'OTP couldn\'t be fetched', '');
								
							}
							// if(data){
                            //     $scope.otpToAdd = data.otp;
							// 	$('#show_confirmation').modal('hide');
                            //  }
                            // else{
							// 	$scope.otpToAdd = '';
							// 	$rootScope.openToast('error', 'OTP couldn\'t be fetched', '');
								
							// }
							
							
							
							 return;
						}
			
				});
				
			});
		 
		
	}
   
   
   
   

});

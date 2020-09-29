App.controller('CorporateSignupController', function($rootScope, $scope,$window, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $interval, $timeout) {
    $scope.OTPStarted = 0;
    $scope.otpSent = 0;
    $scope.otpVerified = 0;
    $scope.hitInProgress=0;
	$scope.loadings = false;
	
	$scope.success = 0;
	$scope.signup1 = 1;
	$scope.signup2 = 0;
	$scope.signup3 = 0;
	$scope.signup4 = 0;
	$scope.loginUser = {};
	$scope.loginUser.country='United States';
	$scope.loginUser.country_id= 1 ;
	  
	$scope.signupData = {};
	
	 $('html, body').animate({scrollTop:0}, 'slow');
	 
    $scope.showStep1 = function() {
		$('html, body').animate({scrollTop:0}, 'slow');
		if( $scope.loginUser.country_id){
			$scope.signup1 = 1;	
			$scope.signup2 = 0;
			$scope.signup3 = 0;
			$scope.signup4 = 0;
		}
	}
	
    $scope.showSignup2 = function() {
		$('html, body').animate({scrollTop:0}, 'slow');
		if( $scope.loginUser.country_id){
			$scope.signup1 = 0;	
			$scope.signup2 = 1;	
			$scope.signup3 = 0;
			$scope.signup4 = 0;
			$scope.otp = ''
		}else{
		  alert('Please Select a Country');
		  return;
		}
	} 
	
	$scope.showSignup3 = function() {
		$('html, body').animate({scrollTop:0}, 'slow');
	
		if( $scope.loginUser.country_id &&  $scope.otpSent){
			$scope.signup1 = 0;	
			$scope.signup2 = 0;	
			$scope.signup3 = 1;
			$scope.signup4 = 0;
		}
	}
	
	$scope.showSignup4 = function() {
		$('html, body').animate({scrollTop:0}, 'slow');
		$scope.signUp();
			$scope.success = 1;
			$scope.otpVerified = 1;
			$scope.OTPStarted = 1;
			$scope.otpSent = 1;
			$scope.signup3 = 0;
			$scope.signup4 = 1;
	}
	
	
    $scope.homelink = function() {
		$state.go("corporate_login");
	}
		var zipMaxLength = 5;
		
    $scope.checkZip = function() {
		zipMaxLength = (countryToSet == "PH") ? 4 : 5;
		
		$scope.loginUser.zip_code = $scope.loginUser.zip_code.slice(0,zipMaxLength);
	}
	
    $scope.validateFields = function() {
		
		var reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;	
		var fname = $('#fname').val();
		var lname = $('#lname').val();
		var mobile = $('#mobile').val();
		var email = $('#email').val();
		var password = $('#password').val();
		var passwordc = $('#passwordc').val();
		var zip = $('#zip').val();
		var country_id = $("#select-state option:selected").val();
		var state_id = $("#my-state option:selected").val();
		var how_hear_us = $("[name='hear']:checked").val();
		var refferal = $('#refferal').val();


		if(fname.trim() == '' ){
			alert('Please enter your Business Name.');
			$('#fname').focus();
			return false;
		}else if(lname.trim() == '' ){
			alert('Please enter your Business Entity.');
			$('#lname').focus();
			return false;
		}else if(mobile.trim() == '' ){
			alert('Please enter your Mobile.');
			$('#mobile').focus();
			return false;
		}
		else if(!/^[1-9]{1}[0-9]{7,9}$/.test(mobile)){
			alert('Please enter valid Mobile Number');
			$('#mobile').focus();
			return false;
		}
		else if(email.trim() == '' ){
			alert('Please enter your email.');
			$('#email').focus();
			return false;
		}else if(email.trim() != '' && !reg.test(email)){
			alert('Please enter valid email.');
			$('#email').focus();
			return false;
		}
		else if(password.trim() == '' ){
			alert('Please enter the password');
			$('#password').focus();
			return false;
		}
		//else if(!/^[0-9a-zA-z!@#$%^&*_-]{6}/.test(password)){
		else if(password.trim().length<6){
			alert('Please enter atleast 6 characters');
			$('#password').focus();
			return false;
		}
		else if(passwordc.trim() == '' ){
			alert('Please enter confirm password');
			$('#passwordc').focus();
			return false;
		}
		else if(password !== passwordc ){
			alert('Password and confirm password doesn\'t match');
			$('#password').focus();
			return false;
		}
		else if(zip.trim() == '' ){
			alert('Please enter Your Zip Code.');
			$('#zip').focus();
			return false;
		}else if(zip.length < zipMaxLength ){
			alert('Please Enter valid zip code.');
			$('#zip').focus();
			return false;
		}
		
		return true;
	}
	
    $scope.getCountryandMobile = function() {
			$scope.promoCountryCode = $('#extPopTwo').val()+"-";
			
			if($scope.loginUser.user_mobile.indexOf('+')>=0){
				//$scope.promoCountryCode = '';
			
				$scope.loginUser.user_mobile =  $scope.loginUser.user_mobile.replace($('#extPopTwo').val()+"-",'');
				$scope.loginUser.user_mobile =  $scope.loginUser.user_mobile.replace($('#extPopTwo').val(),'');
		
				return 1;
			}else{
				
				return 1;
			}
		
	}
	
    $scope.sendOtp = function() {
		// $window.scrollTo(100, 50);
		var validated = $scope.validateFields();
		
		
	
		if(validated){
			$scope.loadings = true;
			$scope.onloadotp = true;
			
			var data = {
				mobile: $scope.promoCountryCode + $scope.loginUser.user_mobile,
				email: $scope.loginUser.user_email,
			};
			$scope.error = '';
			
			$scope.signupData = $scope.loginUser;
			
					$.post(MY_CONSTANT.urlC + 'otp/send', data).success(function(data,status) {
						
						$rootScope.$apply(function () { 
						
								
							if (typeof(data) == 'string') data = JSON.parse(data);
							
							if(data.error || data.flag==0){
								$scope.loadings = false;
								$timeout(function(){
									$scope.onloadotp = false;
								},1500)
		                     	
								 
								$scope.openToast('error', data.error || data.message, '');

								  return;
							}else	if (data.flag == 123) {
								$scope.log = data.log;
								$scope.openToast('warning', 'This phone number is already registered with us.', '');
							
									$scope.loadings = false;
									$timeout(function(){
										$scope.onloadotp = false;
									},1500)

								
								$state.go("corporate_login");
								$scope.OTPStarted = 0;
								$scope.otpSent = 0;
								$scope.otpVerified = 0;
							}else if(data.flag == 108){
									$scope.loadings = false;
									$timeout(function(){
										$scope.onloadotp = false;
									},1500)

							
							  $scope.openToast('warning', 'Please enter a valid phone number', '');
							  $timeout(function(){
								$scope.hitInProgress=0;
							  },1500);
							} else {
								$scope.openToast('success', data.message, '');
								$scope.loadings = false;
								$scope.onloadotp = false;

								$scope.otpSent = 1;	
								$scope.signup1 = 0;	
								$scope.signup2 = 0;	
								$scope.signup3 = 1;
								$scope.signup4 = 0;
							
								$scope.showSignup3();
								$scope.user_mobile = $scope.promoCountryCode + $scope.loginUser.user_mobile;
								$('html, body').animate({scrollTop:0}, 'slow');
							}
						});
					})
				
		}
	}
  

    $scope.verifyOTP = function() {
       
	$scope.DisableCCA = true;
	$scope.loadings = true
	
	// $timeout(function(){
	// $scope.DisableCCA = false;
	// // $scope.loadings = false

	// },2000)
    //   var otp = $('#otp').val();

    //   if(otp.trim()==''){
	// 	  alert('Please Enter OTP');
		  
	// 	//   return;
	// 	//   $scope.DisableCCA = false;
    //   }
    //   else if(!/^[0-9]{4}$/.test(otp)){
	// 	  alert('Enter OTP sent to your Mobile.');
		  
	// 	//   return;
	// 	//   $scope.DisableCCA = false;
    //   }
	  
	//   $scope.loadings = false
        $.post(MY_CONSTANT.urlC + 'otp/verify', {
                "mobile": $scope.promoCountryCode + $scope.loginUser.user_mobile,
                "otp": $scope.otp

            })
            .success(function(data, status) {
				if(typeof data == 'string'){
                  data = JSON.parse(data);
              }
              if(data.error || data.flag==0){
				  $scope.openToast('error',data.error || data.message,'');
				  $scope.loadings = false;
				  $timeout(function(){
					$scope.DisableCCA = false;
				  },2000)
				 

                  return;
              } else{
					$scope.phoneNumber=$scope.user_mobile;
					$scope.openToast('success', 'OTP verified successfully.', '');
					
					$scope.signUp();
					$('html, body').animate({scrollTop:0}, 'slow');
					
                } 
            })
    };
    $scope.signUp = function() {
		
		$scope.validateFields()
		
		var first_name = $('#fname').val();
		var last_name = $('#lname').val();
		var mobile = $scope.promoCountryCode + $scope.loginUser.user_mobile;
		var email = $('#email').val();
		var password = $('#password').val();
		var zipcode = $('#zip').val();
		var country_id = $("#select-state option:selected").val();
		var state_id = $("#my-state option:selected").val();
		
		var data = {first_name,last_name,mobile,email,password,zipcode,country_id,state_id };
		
		$.post(MY_CONSTANT.urlC + 'register',data)
		.success(function(data,status) {
			// console.log('data after register:', data);
			if(typeof data == 'string'){
				  data = JSON.parse(data);
			}
			if(data.error){
				$rootScope.openToast('error','data.error','')
				 
				  return;
			}else{
				$scope.otpVerified = 1;
				$scope.OTPStarted = 1;
				$scope.otpSent = 1;
				$scope.success = 1;
				$scope.signup3 = 0;
				$scope.signup4 = 1;
				$('html, body').animate({scrollTop:0}, 'slow');
			}
		});
				  
				  
    };
    $scope.regenerateOTP = function() {
	// $scope.loadings = true;
		$scope.DisableResnd = true;
      
			$.post(MY_CONSTANT.urlC + 'otp/resend', {
                mobile: $scope.promoCountryCode + $scope.loginUser.user_mobile
            })
            .success(function(data, status) {
                if (data.flag == 0) {
                    $scope.errorMsg = data.message;
                    setTimeout(function() {
						$scope.errorMsg = '';
						$scope.DisableResnd = false;

                    }, 2500)
                } else {
                 
                    $scope.otpSuccess = 'An OTP has been sent to your mobile number';
                    $scope.openToast('success','An OTP has been sent on your mobile number','');
                    $timeout(function() {
						$scope.otpSuccess = '';
						$scope.DisableResnd = false;
                    }, 2000);
                    $scope.resendOTPOne = 1;
                    $("#showResend").css("display","none","important");
                    $scope.resendOTPCounter = 30;
                    $scope.firstResend = 0;
                    var resend = $interval(function() {
                        if ($scope.resendOTPCounter > 0 && $scope.firstResend == 0)
                            --$scope.resendOTPCounter;
                    }, 1000);
                    $timeout(function() {
                        if ($scope.firstResend == 0) {
                            $scope.resendOTP = 0;
                            $interval.cancel(resend);
                            $("#showResend").css("display","block","important");
                            $scope.$apply();
                        }
                    }, 30000);
                }
            })
            .error(function(data, status) {

            })

    };
    $scope.changeNum = function() {
        var resend = $interval(function() {
            if ($scope.resendOTPCounter > 0 && $scope.firstResend == 0)
                --$scope.resendOTPCounter;
        }, 1000);
        $interval.cancel(resend);
        $scope.OTPStarted = 0;
        $scope.otpSent = 0;
        $scope.otpVerified = 0;
        $state.reload();
    }
    $scope.forgotBack= function () {
    //   console.log("asdf");
      $scope.error='';
      $state.go("corporate_login");
    }
	
	
	
	
	
	/*
	$scope.getCountries = function(){
		
		$scope.loginUser.country = "United States";
		$scope.countries = [];
				$.get(MY_CONSTANT.urlC + 'countryList').success(function(data,status) {
						
						$rootScope.$apply(function () { 

							//console.log("abc: ", data, JSON.parse(data));
						
								
							// if (typeof(data) == 'string') data = JSON.parse(data);
							//console.log(data);
							if(data.error || data.flag==0){
								
								alert(data.error || data.message);
								  return;
							}else	if (data.flag == 123) {
								
							}else if(data.flag == 108){
							 
							} else {
								$scope.countries = JSON.parse(data);
								//console.log($scope.countries);
							}
						});
				});
						
						
	}
	*/
	
	
		var countryToSet = 'US';
	$scope.countryChanged = function(){
		// console.log($scope.loginUser.country_id);
		
		
		if($scope.loginUser.country_id == 2){
			 countryToSet = 'PH';
		}else{
			 countryToSet = 'US';
		}
		
		$("#mobile").intlTelInput("setCountry", countryToSet);
		
		
		$scope.getStates();
	}
	
	
	

	
	$scope.stateChanged = function(){
		
	}
	
	
	$scope.getCountries = function(){
	
		$scope.loginUser.country = "United States";
		$scope.loginUser.country_id = 1;
		$scope.countries = [];
				$.get(MY_CONSTANT.urlC + 'countryList').success(function(data,status) {
						
						$rootScope.$apply(function () { 

							//console.log("abc: ", data, JSON.parse(data));
						
								
							// if (typeof(data) == 'string') data = JSON.parse(data);
							//console.log(data);
							if(data.error || data.flag==0){
								
								$rootScope.openToast('error',data.error || data.message,'')
								  return;
							}else	if (data.flag == 123) {
								
							}else if(data.flag == 108){
							 
							} else {
								var Countries = JSON.parse(data);
								$scope.countries = Countries.countries;
								
								$scope.getStates();
								setTimeout(function(){
									$scope.loginUser.country_id = 1;  $("#select-state option:eq(1)").attr('selected',1);
									($("#select-state option:eq(0)").val() == "?") ? $("#select-state option:eq(0)").remove() : '';
								},100);
							}
						});
						// console.log($scope.getCountries);	
				});
						
					
	}
	
	$scope.getCountries();

	
	
	$scope.getStates = function(){
		
		
				$.post(MY_CONSTANT.urlC + 'states',{country_id:$scope.loginUser.country_id}).success(function(data,status) {
						
						$rootScope.$apply(function () { 
						
								
							if (typeof(data) == 'string') data = JSON.parse(data);
						
							if(data.error || data.flag==0){
								$rootScope.openToast('error',data.error || data.message,'')
								
								  return;
							}else	if (data.flag == 123) {
								
							}else if(data.flag == 108){
							 
							} else {
								$scope.states = data.cities;
								
								setTimeout(function(){
									 $("#my-state option:eq(1)").attr('selected',1);
									(($("#my-state option:eq(0)").val() == "?" || $("#my-state option:eq(0)").val() == "")) ? $("#my-state option:eq(0)").remove() : '';
									// console.log('check');
								},100);
								
							}
						});
				});
						
						
	}
	
	//$scope.getStates();
});

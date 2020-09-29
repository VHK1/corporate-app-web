App.directive('ngEnter', function () {
   
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
    
    App.controller('CorporateLoginController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $interval, $timeout, tokenLogin) {

	localStorage.removeItem('book-ride-for');
	


    $scope.loginMode = 1;
    $scope.forgotMode = 0;
    $scope.otpVerifyMode = 0;
    $scope.resetMode = 0;
    $scope.resetSuccess = 0;
    $scope.error = '';
	
	$scope.forgot = {'mobile':''};
	$scope.otp = '';
	
	
	$scope.resetComplete = function(){
		$scope.loginMode = 0;
		$scope.forgotMode = 0;
		$scope.resetSuccess = 1;
		$scope.otpVerifyMode = 0;
		$scope.resetMode = 0;
	}
	$scope.switchToLogin = function(){
		$scope.loginMode = 1;
		$scope.forgotMode = 0;
		$scope.otpVerifyMode = 0;
		$scope.resetMode = 0;
		$scope.otpVerified = 0;
		$scope.forgotStarted = 0;
		$scope.OTPStarted = 0;
		$scope.resetSuccess = 0;
	}
	
	$scope.startAgain = function(){
		$state.reload();
	}
	$scope.showLogin = function(){
		$scope.loginMode = 1;
		$scope.forgotMode = 0;
	}
	
    $scope.sendOtpEnter = function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            
            if($("#input3").val().length!=0){
                
                $scope.verifyOTP();
            }
        } else {
            // return true;
        }
    };
 
    $scope.resetForm = function(user_mobile, password) {
        document.getElementById("promoPhone").val = "";
        document.getElementById("pass").val = "";
        document.getElementById("promoPhoneOne").val = "";
        if ($("#promoPhone").css("border-color", "rgb(244,67,54)") || ($("#pass").css("border-color", "rgb(244,67,54)")) || $("#promoPhoneOne").css("border-color", "rgb(244,67,54)")) {
         
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(225, 225, 225)");
            
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(225, 225, 225)");
           
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(225, 225, 225)");
            $state.reload();
        } else {
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(244,67,54)");
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(244,67,54)");
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(244,67,54)");
        }
    };
	
	
	
    //$scope.$apply();
    // $scope.loginButtonDisabled = false;
    $scope.promoCountryCode = '';
    $scope.loginDriver = {};
    $scope.loginDriver.mobile = '';
   
    $scope.loginDriver.password = '';
    $scope.promoCountry = function(c) {
        
        $scope.promoCountryCode = '+' + c;
    };
    $scope.hitInProgress = 0;
	
	
	
    $scope.formatMobileNumber = function() {
		
		$scope.promoCountryCode = $('#extPopTwo').val()+"-";
		if($scope.loginDriver.mobile){
			if($scope.loginDriver.mobile.indexOf('+')>=0){
				//$scope.promoCountryCode = '';
			
				$scope.loginDriver.mobile =  $scope.loginDriver.mobile.replace($('#extPopTwo').val()+"-",'');
				$scope.loginDriver.mobile =  $scope.loginDriver.mobile.replace($('#extPopTwo').val(),'');
				
			}
		}
		 
	
			 
			 
	}
	
    $scope.loginDriverFn = function() {

        $scope.error = '';
    
		
		if(!$scope.loginDriver.mobile){
			alert("Please enter Mobile number.");
		}else if(!$scope.loginDriver.password){
			alert("Please enter Password.");
		}else if ($scope.loginDriver.mobile && $scope.loginDriver.password) {
			
			$scope.loadings = true;
			$scope.isDisable = true;
            var data = {
               mobile: $scope.promoCountryCode + $scope.loginDriver.mobile,
               password: $scope.loginDriver.password,
               web_access_token: 0,
               access_token_login_flag: 0,
            };
			$.post(MY_CONSTANT.urlC + 'mobile_login', data)
			 .then(function successCallback(data, status)  {

				if (typeof(data) == 'string')
					data = JSON.parse(data);
			  
				if (data.error) {
					$scope.error = data.error;
					
                    $scope.openToast('warning', data.error, '');
                    $scope.loadings = false;
                    $timeout(function() {
			       $scope.isDisable = false;
                       
                    },1500
                    )
			      
				   
					$scope.$digest();
				}else if ( data.login[0].web_access_token) {
					
                    $scope.loadings = false;
                    $scope.isDisable = false;
					var params = {
					   mobile: $scope.promoCountryCode + $scope.loginDriver.mobile,
					   password: $scope.loginDriver.password,
					   web_access_token: data.login[0].web_access_token,
					   access_token_login_flag: 0,
					};
						
			
					$.post(MY_CONSTANT.urlC + 'access_token_login', params)
					.then(function successCallback(resp, status)  {
						if (typeof(resp) == 'string')
							resp = JSON.parse(resp);
					  
						if (resp.error) {
							$scope.error = resp.error;
                            $scope.openToast('warning', data.error, '');
                            $scope.loadings = false;

                            $timeout(function() {
                                $scope.isDisable = false;
                            },1500
                            )
						   
							$scope.$digest();
						}else{
							$scope.loadings = false;
                            $scope.isDisable = false;
							 var driverModel = {
								"first_name": resp.login[0].first_name,
								"driver_name": resp.login[0].first_name+' '+resp.login[0].last_name,
								"driver_image": resp.login[0].image,
								"driver_mobile": resp.login[0].mobile,
								"driver_email": resp.login[0].email,
								"referral_code": resp.login[0].referral_code,
								"zipcode": resp.login[0].zipcode,
								"state_id": resp.login[0].state_id,
								"corporate_id": resp.login[0].corporate_id,
								"subtype_id": resp.login[0].subtype_id,
								"location": resp.login[0].city,
								"state": resp.login[0].state,
								"city": resp.login[0].city,
								"address": resp.login[0].address,
								"latitude": resp.login[0].latitude,
								"longitude": resp.login[0].longitude,
							}
							
							if(!driverModel.driver_image){
								driverModel.driver_image_approved ='images/default.png';
								driverModel.driver_image = 'images/default.png';
							}
								
							var web_access_token = resp.login[0].web_access_token;
							
							$cookieStore.put('web_access_token', web_access_token);
							
							$cookieStore.put('access_token', web_access_token);
						
							localStorage.setItem('corporateModel', JSON.stringify(driverModel));
							$cookieStore.put('driverdata', resp.login[0]);
					 
							localStorage.setItem('driverdata', JSON.stringify(resp.login[0]));
							localStorage.setItem('justLogin', 1);
						 
						   $state.go('corporate.liveTracking');
							
						}
					});
				   
				}else{
					alert('No Token Received');
				}
			 })
				 
        } else {
			alert("Invalid Mobile number or Password.");
        }
    }
    $scope.forgotStartOne = function() {
        $scope.error = '';
        $scope.otpVerified = 0;
        $scope.forgotStarted = 1;
        $scope.OTPStarted = 0;
        $scope.showPassword = 0;
        $(".grid_before").removeClass("flipInY");
        $(".gridBlock").addClass("flipInY");
        $scope.otpSent = 0;
    }
    $scope.checkPassword = function() {
        if ($scope.hitInProgress == 0) {
            $scope.hitInProgress = 1;
        } else {
            return false;
        }
        $scope.error = '';
        if ($scope.loginDriver.password.length > 5) {
            $scope.loginButtonDisabled = true;
            var is_Approved = JSON.parse(localStorage.getItem('affiliateModel'));
           
            var data = {
                driver_mobile: $('#extPop').val() + '-' + $scope.loginDriver.driver_mobile,
                password: $scope.loginDriver.password,
                is_approved: is_Approved.is_approved
            };
            $.post(MY_CONSTANT.urlC + 'mobile_login', data)
                .success(function(data, status) {
                    if (typeof(data) == 'string')
                        data = JSON.parse(data);
                  
                    if (data.error) {
                        $scope.error = data.error;
                        $scope.openToast('warning', "Your phone number and password combination doesn't match.", '');
                        $timeout(function() {
                            $scope.hitInProgress = 0;
                        }, 1500);
                        $scope.$digest();
                    } else {
                        var driverModel = {
                            "driver_name": data.login[0].driver_name,
                            "driver_image": data.login[0].driver_image,
                            "driver_mobile": data.login[0].driver_mobile,
                            "driver_email": data.login[0].driver_email,
                            "referral_code": data.login[0].referral_code,
                            "corporate_id":data.login[0].corporate_id,
							"state_id": resp.login[0].state_id,
							"subtype_id": resp.login[0].subtype_id,
							"location": resp.login[0].city,
							"state": resp.login[0].state,
							"city": resp.login[0].city,
							"address": resp.login[0].address,
                            // "driver_car_no":data.login.driver_car_no,
                            // "todays_earnings":data.login.todays_earnings,
                            // "total_earnings":data.login.total_earnings,
                            // "total_rides":data.login.total_rides
                        }
                        $timeout(function() {
                            $scope.hitInProgress = 0;
                        }, 2500);
                        $scope.resendOTPOne=1;
                        $('.resendOTP').prop('disabled','true');
                        $scope.resendOTPCounter=30;
                        $scope.firstResend=0;
                        var resend = $interval(function () {
                            if($scope.resendOTPCounter>0&&$scope.firstResend==0)
                                --$scope.resendOTPCounter;
                        },1000);
                        $timeout(function () {
                            if($scope.firstResend==0){
                                $scope.resendOTPOne=0;
                                $('.resendOTP').prop('disabled','false');
                                $interval.cancel(resend);
                            }
                        }, 30000);
                        // var Obj = {'accessToken': data.user_data.accessToken};
                        // $cookieStore.put('obj',Obj);
                        $cookieStore.put('web_access_token', data.login[0].web_access_token);
                        $cookieStore.put('access_token', data.login[0].access_token);
                        localStorage.setItem('affiliateModel', JSON.stringify(driverModel));
                        $cookieStore.put('driverdata',(data.login[0]));
                       
                        localStorage.setItem('driverdata', JSON.stringify(data.login[0]));
                       
                        //$cookieStore.put('fullName', data.user_data.user_name);
                        //$cookieStore.put('userImage', data.user_data.user_image);
                      
                        if (data.login[0].is_approved)
                            $state.go('affiliate.driver_trips');
                        else $state.go('affiliate.documents');
                    }
                })
                .error(function(data, status) {
                    $scope.loginButtonDisabled = false;

                    $scope.error = data.error;
                   
                    if (data.data) {
                        $scope.authMsg = data.data.message;
                    } else {
                        $scope.authMsg = "Unable to connect! Please try again later.";
                    }
                   
                });
        } else {

        }
    }
    $scope.forgotStarted = 0;
    $scope.OTPStarted = 0;
	
    $scope.forgotStart = function() {
        $scope.error = '';
        $scope.forgotStarted = 1;
        $scope.OTPStarted = 0;
        $scope.otpSent = 0;
		
		
		$scope.loginMode = 0;
		$scope.forgotMode = 1;
		
		
		
        $(".grid_before").removeClass("flipInY");
        $(".gridBlock").addClass("flipInY");
        $scope.otpSent = 0;
    }
	
    $scope.changeNum = function() {
       
        $scope.forgotStarted = 1;
        $scope.OTPStarted = 0;
        $scope.otpSent = 0;
		$scope.loginMode = 0;
		$scope.forgotMode = 1;
        
        $scope.otp ='';
		
    }
	
	
    $scope.regenerateOTP = function() {
        $scope.successMsg = '';
        $scope.errorMsg = '';
       $scope.DisableRegenrate = true;
        $.post(MY_CONSTANT.urlC + 'resend_otp', {
            mobile: $scope.promoCountryCode +  $scope.forgot.mobile,
            is_approved:$scope.is_approved
        })
            .success(function(data, status) {
                if (data.flag == 0) {
                    $scope.errorMsg = data.message;
                    setTimeout(function() {
                        $scope.errorMsg = '';
                       

                    }, 2500)
                    $timeout (function(){
                        $scope.DisableRegenrate = false;
                    },2500)
                } else {
                    //  $scope.otp = '';
					 
                    $scope.otpSuccess = 'An OTP has been sent to your mobile number';
                    $scope.openToast('success','An OTP has been sent on your mobile number','');
                    $timeout (function(){
                        $scope.DisableRegenrate = false;
                    },2500)
                              
                  
                }
            })
            .error(function(data, status) {

            })

    };
	
	
    $scope.resendOTPOne=1;
    $scope.otpError = '';
    $scope.otpSuccess = '';
    $scope.otp = '';
    
    $scope.otpVerified = 0;
    $scope.forgotBack = function() {
       
        $scope.error = '';
        $scope.otpSent = 0;
        $scope.forgotStarted = 0;
        $scope.OTPStarted = 0;
        $scope.otpVerified = 0;
        $(".gridBlock").removeClass("flipInY");
        $(".grid_before").addClass("flipInY");

    }
    $scope.pressLoginEnter = function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
           
            if($("#promoPhone").val().length!=0){
                
                $scope.loginDriverFn();
            }
        } else {
            // return true;
        }
    };
    $scope.success = false;
    $scope.pressForgotEnter = function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            
            if($("#promoPhoneOne").val().length!=0){
              
                $scope.requestOTP();
            }
        } else {
            // return true;
        }
    };
	
	
	
    $scope.requestOTP = function() {
       
        var mobile = $('#mobile1').val();

        if(mobile.trim()==''){
            alert('Please Enter Mobile Number');
            return;
        }
    $scope.DisableOtp = true;  
    $scope.loadings = true; 
		$scope.promoCountryCode = $('#extPopThree').val()+"-";
		
		if($scope.forgot.mobile.indexOf('+')>=0){
			//$scope.promoCountryCode = '';
		
			$scope.forgot.mobile =  $scope.forgot.mobile.replace($('#extPopThree').val()+"-",'');
			$scope.forgot.mobile =  $scope.forgot.mobile.replace($('#extPopThree').val(),'');
		
		}
		 
		
        var data = {
            mobile: $scope.promoCountryCode + $scope.forgot.mobile,
          
        };
        
        $scope.error = '';
         //$scope.$apply();
        var stop;
        $.post(MY_CONSTANT.urlC + 'mobile_forgot_password', data)
            .success(function(data, status) {
				
					$rootScope.$apply(function () { 
						if (typeof(data) == 'string') data = JSON.parse(data);
						
						if (data.error) {
							$scope.log = data.log;
							$scope.openToast('warning', data.error, '');
						    $timeout(function(){
                                $scope.DisableOtp = false;
                               
                            },1500)
                            $scope.loadings = false;
							$scope.forgotStarted = 1;
							$scope.OTPStarted = 0;
							$scope.otpSent = 0;
							$scope.otpVerified = 0;
						} else {
						    $scope.DisableOtp = false;  
                           $scope.loadings = false; 
							$scope.driver_mobile = data.mobile;
						 
							$scope.error = "";
						  
							$scope.success = true;
							$scope.otpSent = 1;
							$scope.otpVerified = 0;
							
							
							$scope.loginMode = 0;
							$scope.forgotMode = 0;
							$scope.otpVerifyMode = 1;
								
							$scope.openToast('success', data.log, '');
			
						}
					})
            })

    }
	
    $scope.show_err = 0;
    $scope.text = "RESET PASSWORD";
    $scope.set = "SET PASSWORD";
	
	
	
    $scope.showVerify = function() {
		
			 $scope.success = true;
			$scope.otpSent = 1;
			$scope.otpVerified = 0;
			$scope.loginMode = 0;
			$scope.forgotMode = 0;
			$scope.otpVerifyMode = 1;
					
	}
	  $scope.showResetScreen = function() {
		
		$scope.openToast('success', 'OTP verified successfully.', '');
		$scope.otpVerified = 1;
		$scope.OTPStarted = 0;
		$scope.forgotStarted = 0;
		$scope.otpVerifyMode = 0;
		$scope.resetMode = 1;
					
	}
	
	
    $scope.verifyOTP = function() {
        $scope.DisableVerifyOtp = true;
        $scope.successMsg = '';
        $scope.errorMsg = '';
        $scope.saveInProgress = 1;
       
	   if(!$scope.otp){
           alert('Please enter OTP');
           $timeout(function(){
        $scope.DisableVerifyOtp = false;

           },2000)
	   }else{
	   
	   
			$.post(MY_CONSTANT.urlC + 'verify_otp', {
				"mobile": $scope.promoCountryCode +  $scope.forgot.mobile,
				"otp": $scope.otp

			})
            .success(function(data, status) {
				
				$rootScope.$apply(function () { 
					if (typeof data == 'string') data = JSON.parse(data);
						if(data.error){
							$scope.otpError = 'You have entered incorrect OTP';
							$scope.otpSuccess = '';
							$scope.forgotStarted = 0;
							$scope.otpVerified = 0;
							$scope.OTPStarted = 1;
                            $scope.openToast('warning', data.error, '');
                            $timeout(function(){
                                $scope.DisableVerifyOtp = false;
                        
                                   },2000)
						}else if (data.flag == 122) {
						
							$scope.openToast('success', 'OTP verified successfully.', '');
							$scope.loginMode = 0;
							$scope.forgotMode = 0;
							$scope.resetMode = 1;
							$scope.otpVerifyMode = 0;
							$scope.otpVerified = 1;
							$scope.OTPStarted = 0;
							$scope.forgotStarted = 0;
							
							
		
		
						} else {						
							$scope.openToast('success', 'OTP verified successfully.', '');
							$scope.loginMode = 0;
							$scope.forgotMode = 0;
							$scope.resetMode = 1;
							$scope.otpVerifyMode = 0;
							$scope.otpVerified = 1;
							$scope.OTPStarted = 0;
							$scope.forgotStarted = 0;
							

						}
					
					//$scope.showResetScreen();
				})
            })
	   }
    };
	
	
  
  
    $scope.setPassword = function() {
        $scope.errorMsg = '';
		
		
		if (!$scope.resetPass.password){
		  alert('Please enter New password');			  
		  return;
		}else if ($scope.resetPass.password.length<6){
		  alert('Password should be of atleast 6 characters');			  
		  return;
		}else if(!$scope.resetPass.confirmpassword){
		  alert('please enter Confirm password');
		  return;
		}else if ($scope.resetPass.password != $scope.resetPass.confirmpassword) {
            $scope.openToast('error', 'New and Confirm password doesn\'t match.', '');
            $scope.onloadDisble = true;
            setTimeout(function() {
                $scope.errorMsg = "";
                $scope.onloadDisble = false;
                $scope.$apply();
            }, 3000);
		
        } else {
            $scope.onloadDisble = true;
            $.post(MY_CONSTANT.urlC + 'reset_password_mobile', {
                mobile: $scope.promoCountryCode + $scope.forgot.mobile,
                password: $scope.resetPass.password,
                otp: $scope.otp,
				is_approved:0
               
            }).then(function(data) {
                    data = JSON.parse(data);
                    var takeInside={
                        mobile:  $scope.forgot.mobile,
                        password: $scope.resetPass.password,
                        is_approved: parseInt($scope.is_approved)
                    };
                    localStorage.setItem('takeInside', JSON.stringify(takeInside));
					
					if(data.error && data.flag == 130){
                        $timeout(function(){
                            $scope.onloadDisble = false;
                        },1500)
						$scope.openToast('error', "old and new password must be different", '');
					}else if(data.error){
                        $timeout(function(){
                            $scope.onloadDisble = false;
                        },1500)
						$scope.openToast('warning', data.error, '');
					}else if (data.flag != 117) {
                        $scope.openToast('warning', 'Something went wrong, Please try again later.', '');
                        $scope.resetPass = {}
                        $timeout(function(){
                            $scope.onloadDisble = false;
                        },1500)
                        $scope.$apply();
                        setTimeout(function() {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                    } else if (data.flag == 117) {
                        $timeout(function(){
                            $scope.onloadDisble = false;
                        },1500)
						$scope.resetSuccess = 1;
						$scope.otpVerifyMode = 0;
						$scope.resetMode = 0;
						$scope.$apply();
                    } else {
                        $scope.errorMsg = data.message.toString();
                        $scope.$apply();
                        setTimeout(function() {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                        $timeout(function(){
                            $scope.onloadDisble = false;
                        },1500)
                    }
					
                });
        }
    };
    $scope.BackStartOne = function() {
        $scope.otpVerified = 0;
        $scope.forgotStarted = 0;
        $scope.OTPStarted = 0;
        $scope.showPassword = 0;
        document.getElementById("promoPhone").val = "";
        document.getElementById("pass").val = "";
        document.getElementById("promoPhoneOne").val = "";
        if ($("#promoPhone").css("border-color", "rgb(244,67,54)") || ($("#pass").css("border-color", "rgb(244,67,54)")) || $("#promoPhoneOne").css("border-color", "rgb(244,67,54)")) {
            
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(225, 225, 225)");
            
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(225, 225, 225)");
            
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(225, 225, 225)");
            $state.reload();
        } else {
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(244,67,54)");
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(244,67,54)");
            $("md-input-container.md-default-theme.md-input-invalid .md-input").css("border-color", "rgb(244,67,54)");
        }
    }
    $scope.changePasswordDriver = function() {
        $scope.errorMsg = '';
        var otpVerifyChangePassword = JSON.parse(localStorage.getItem('otpVerifyChangePassword'));
        $scope.otp=otpVerifyChangePassword.otp;
        var approvedModel = JSON.parse(localStorage.getItem('approvedModel'));
        $scope.is_approved=approvedModel.is_approved;
        if ($scope.resetPass.password != $scope.resetPass.confirmpassword) {
            $scope.openToast('warning', 'Passwords do not match.', '');

            setTimeout(function() {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);

        } else {

            $.post(MY_CONSTANT.urlC + 'reset_password_mobile', {
                driver_mobile: $scope.promoCountryCode + $scope.loginDriver.driver_mobile,
                password: $scope.resetPass.password,
                otp:$scope.otp,
                is_approved:$scope.is_approved
            }).then(
                function(data) {
                    data = JSON.parse(data);
                        if (data.flag == 130) {
                        $scope.openToast('warning', 'New and old password must be different.', '');
                    }
                    else if (data.flag == 117) {
                        $scope.openToast('success', 'Password reset successfully.', '');
                        $state.reload();
                        // $cookieStore.put('rememberEmail', email);
                        $scope.resetPass = {};
                        $scope.$apply();
                        setTimeout(function() {
                            $scope.successMsg = "";
                            $scope.$apply();
                        }, 3000);
                    } else {
                        $scope.errorMsg = data.message.toString();
                        $scope.$apply();
                        setTimeout(function() {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                    }
                });
        }

    };
});
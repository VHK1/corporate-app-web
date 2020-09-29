App.service('tokenLogin', function($cookieStore, MY_CONSTANT, $state) {

    this.driverTokenLogin = function () {
        var web_access_token = getParameterByName('web_access_token')
        $.ajax({
            method: 'POST',
            url: MY_CONSTANT.urlD + 'access_token_login',
            data: {access_token: web_access_token},
            async: false,
            success: function (data, status) {
                if (typeof(data) == 'string')
                    data = JSON.parse(data);
                if (data.error) {
                   alert( data.error);
				   window.location = MY_CONSTANT.vendorBaseURL+'driverlogin.html';
                } else {
                    var driverModel = {
                        "driver_name": data.login[0].driver_name,
                        "driver_image": data.login[0].driver_image,
                        "driver_mobile": data.login[0].driver_mobile,
                        "driver_email": data.login[0].driver_email,
                        "referral_code": data.login[0].referral_code,
                        "driver_id": data.login[0].driver_id,
                        "is_approved": data.login[0].is_approved,
                       
					   "nationality": data.login[0].nationality,
						
                        "language": data.login[0].language,
						
                        // "driver_car_no":data.login.driver_car_no,
                        // "todays_earnings":data.login.todays_earnings,
                        // "total_earnings":data.login.total_earnings,
                        // "total_rides":data.login.total_rides
                    }

                    // var Obj = {'accessToken': data.user_data.accessToken};
                    // $cookieStore.put('obj',Obj);
                    var notApproved = {
                        "driver_mobile": data.login[0].driver_mobile
                    };
                    localStorage.setItem('notApproved', JSON.stringify(notApproved));
                    var not_approved = {
                        is_approved: data.login[0].is_approved
                    };
                    localStorage.setItem('not_approved', JSON.stringify(not_approved));
                    $cookieStore.put('web_access_token', web_access_token);
                    $cookieStore.put('access_token', web_access_token);
                    localStorage.setItem('driverModel', JSON.stringify(driverModel));
                    $cookieStore.put('driverdata', data.login[0]);
                   // console.log(localStorage.getItem('driverdata'));
                   // console.log(data.login[0]);
                    localStorage.setItem('driverdata', JSON.stringify(data.login[0]));
                    localStorage.setItem('driver_vendor_details', JSON.stringify(data.vendor_details[0]));
                    
                   // console.log(localStorage.getItem('driverdata'));
                    //$cookieStore.put('fullName', data.user_data.user_name);
                    //$cookieStore.put('userImage', data.user_data.user_image);
                     console.log(localStorage.getItem('driverModel'));
                    if (data.login[0].is_approved)
                        $state.go('driver.driver_trips');
                    else $state.go('preDriver.documents');
                    //  window.history.replaceState({},'', data.login[0].is_approved ? '/#/driver/driverdocuments' : '/#/preDriver/documents');
                }
            },
            error: function (data, status) {
                console.log("error", data.data);
                //window.history.pushState({},'', '/#/preDriver/documents');
            }
        })
    }
	
	
	
	this.vendorTokenLogin = function () {
        var web_access_token = getParameterByName('web_access_token')
        $.ajax({
            method: 'POST',
            url: MY_CONSTANT.urlV + 'access_token_login',
            data: {access_token: web_access_token},
            async: false,
            success: function (data, status) {
                if (typeof(data) == 'string')
                    data = JSON.parse(data);
                if (data.error) {
                    alert( data.error);
					window.location = MY_CONSTANT.vendorBaseURL+'affiliatelogin.html';
                } else {
					//console.log('web_access_token_PASSED',web_access_token);
                    var driverModel = {
                        "driver_name": data.login[0].first_name+' '+data.login[0].last_name,
                        "driver_image": data.login[0].image,
                        "driver_mobile": data.login[0].mobile,
                        "driver_email": data.login[0].email,
                        "referral_code": data.login[0].referral_code,
                        "is_approved": data.login[0].is_approved,
                        "city": data.login[0].city,
                        "country": data.login[0].country,
                        "zipcode": data.login[0].zipcode,
                        "state_id": data.login[0].state_id,
                        "subtype_id": data.login[0].subtype_id,
                        "vendor_id": data.login[0].vendor_id,
                        "location": 'New York',
                        // "driver_car_no":data.login.driver_car_no,
                        // "todays_earnings":data.login.todays_earnings,
                        // "total_earnings":data.login.total_earnings,
                        // "total_rides":data.login.total_rides
                    }
					
					if(!driverModel.driver_image){
						driverModel.driver_image_approved ='images/default.png';
						driverModel.driver_image = 'images/default.png';
					}
						

                    // var Obj = {'accessToken': data.user_data.accessToken};
                    // $cookieStore.put('obj',Obj);
					
					
                    var notApproved = {
                        "driver_mobile": data.login[0].driver_mobile
                    };
                    localStorage.setItem('notApproved', JSON.stringify(notApproved));
                    var not_approved = {
                        is_approved: data.login[0].is_approved
                    };
                    localStorage.setItem('not_approved', JSON.stringify(not_approved));
                    //$cookieStore.put('web_access_token', data.login[0].web_access_token);
                    $cookieStore.put('web_access_token', web_access_token);
					
					//console.log('Web_TOKEN_RECIVED', data.login[0].web_access_token);
					//console.log('Web_TOKEN_HAVING',web_access_token);
					
					
                    $cookieStore.put('access_token', web_access_token);
				
                    localStorage.setItem('affiliateModel', JSON.stringify(driverModel));
                    $cookieStore.put('driverdata', data.login[0]);
			 
                    localStorage.setItem('driverdata', JSON.stringify(data.login[0]));
                 
				   if (data.login[0].is_approved)
                        $state.go('affiliate.trips');
                    else $state.go('affiliate.documents');
					
                    //  window.history.replaceState({},'', data.login[0].is_approved ? '/#/driver/driverdocuments' : '/#/preDriver/documents');
                }
            },
            error: function (data, status) {
                console.log("error", data.data);
                //window.history.pushState({},'', '/#/preDriver/documents');
            }
        })
    }

    this.riderTokenLogin = function () {
        var web_access_token = getParameterByName('web_access_token')
        $.ajax({
            method: 'POST',
            url: MY_CONSTANT.url + 'access_token_login',
            data: {access_token: web_access_token},
            async: false,
            success: function (data,status){
                // $scope.loginButtonDisabled = false;
                if(typeof(data)=='string')
                    data = JSON.parse(data);
                console.log("!!!!!!!!!",data);
                if (data.error) {
                    console.log('Some error occured!')
                    // $scope.error = data.error;
                    // $scope.openToast('warning','Your phone number and password combination doesnt match.','');
                    // $timeout(function(){
                    //     $scope.hitInProgress=0;
                    // },1500);
                    // $scope.$digest();
                    // $timeout(function () {
                    //     $scope.error = '';
                    // }, 2500);
                }
                else {

                    var userModel = {
                        user_name :data.user_details.user_name,
                        referral_code :data.user_details.referral_code,
                        user_mobile :data.user_details.user_mobile,
                        user_email :data.user_details.user_email,
                        user_image :data.user_details.user_image,
                        web_access_token:data.user_details.web_access_token
                    };
                    console.log(userModel);
                    var favDriver = data.fav_drivers;
                    // $timeout(function(){
                    //     $scope.hitInProgress=0;
                    // },2500);
                    $cookieStore.put('web_access_token', data.user_details.web_access_token);
                    $cookieStore.put('referralCode', data.user_details.referral_code);
                    //$cookieStore.put('fullName', data.user_data.user_name);
                    //$cookieStore.put('userImage', data.user_data.user_image);
                    localStorage.setItem('userModel', JSON.stringify(userModel));
                    localStorage.setItem('userData', JSON.stringify(data));
                    localStorage.setItem('favDriver', JSON.stringify(favDriver));
					
					localStorage.setItem('rider_vendor_details', JSON.stringify(data.vendor_details[0]));
				   
                    console.log(favDriver);
                    $state.go('customer.my_trips');
                    //window.history.replaceState({},'', '/#/customer/my_trips');
                }
            },
            error: function (data, status) {
                console.log("error", data.data);
            }
        })
    }

});

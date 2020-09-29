App.controller('corporateMyUsersController', function ($rootScope, $scope,$timeout, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog) {

	$rootScope.ridePage = 1;
	$scope.booking = {};
	$scope.skip = 0;
	
	$scope.currentPage = 1;
	$scope.corporateFareInfo = [];
	 $('html, body').animate({scrollTop:0}, 'slow');
    if (!$cookieStore.get('web_access_token')) {
        $state.go("corporate_login");
    }
    $scope.myTrips = [];
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    var newdriverModel = JSON.parse(localStorage.getItem('driverdata'));
   
    $scope.userDetails = [];
    $scope.driverDetails = [];
    // console.log("dsfsdfdsfssd");
    //$scope.userDetails.userName = driverModel.user_name;
    //$scope.userDetails.userImage = driverModel.user_image;
    if(driverModel) {
        $scope.userDetails.userName = driverModel.driver_name;
        $scope.userDetails.userImage = driverModel.driver_image;
        $scope.driverDetails.driver_image = driverModel.driver_image;
        $scope.driverDetails.driver_mobile = driverModel.driver_mobile;       ;
        $scope.driverDetails.driver_location = 'New York';
        $scope.driverDetails.referral_code = driverModel.referral_code;
    }
    else {
        $cookieStore.remove('web_access_token');
        $state.go("corporate_login");
    }
    $scope.logout = function () {
        $('.modal').modal('hide');
        $cookieStore.remove('web_access_token');
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
			
		}else if((searchflag == 1) && !$scope.searchuser){
			// console.log('Text in Box ',$scope.searchuser);
			params.offset = 0;
			$scope.currentPage = 1;
		}
		
		
        $.post(MY_CONSTANT.urlC + 'associated_user_list', params)
            .success(function(data, status) {
                // console.log(data);
                // data = JSON.parse(data);
                // console.log(data);
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
              
                if (data.flag == 502) {
                 
                } else {
					$scope.totalItems= data.count;
					
					if($scope.totalItems <= 10){
						$scope.hideLoadMore = 1;
					}else{
						$scope.hideLoadMore = 0;
					}
					
					$scope.Users = data.users;
					$scope.$apply();
                }
                // console.log("response",status,data);
            });
    }
    $scope.initTable();
    $scope.loadData = function () {
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
			
		}else{
			$scope.hideLoadMore = 0;
			$timeout(function(){
				$scope.DisableLoadMore = false;
		
					},1500)
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
                // console.log('Offset changed to: ' + $scope.skip+' - '+i);
               
				$scope.loadMoreNow();
            }else{
				// console.log('All caught up!');
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
        $.post(MY_CONSTANT.urlC + 'associated_user_list', params)
            .success(function(data, status) {
              
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
                if (data.flag == 502) {
                 
                } else {
					$scope.totalItems= data.count;
					var Users = data.users;
					Users.forEach(function(userData,ind) {
						$scope.Users.push(userData);		
					});
					
					$scope.$apply();
                }
                // console.log("response",status,data);
            });
		
	}

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $('.collapse').on('show.bs.collapse', function () {
            $('.collapse.in').collapse('hide');
            var index = $(this).attr("id");
            $scope.arrowKey = true
            $cookieStore.put('modalToOpen', index);
        });
      
    });
	
	
	$scope.showTime = function(){
		
			$scope.timendate = 1;
			$scope.driverselect = 0;
		
	}
	
	
	
	$scope.showUserEditPopup = function(){
		
		$('#emailUpdateforUser').modal('show');
	}
	
	
	
	
	
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
			// console.log('Submitted');
			
			  event.preventDefault();
				
				stripe.createToken(card)
				.then(function(result) {
					if (result.error) {
						$scope.buttonClicked = 0;
					  // Inform the customer that there was an error.
					  var errorElement = document.getElementById('card-errors');
					  errorElement.textContent = result.error.message;
					} else {
						// console.log('reponse from stripe ',result);
					  // Send the token to your server.
					  $scope.token = result.token;
						$scope.stripeTokenHandler(result.token);
					}
				});
				
		});


	}
	
	$scope.addUserPayment = function(user_token){
		$scope.cardForUser = user_token; 
		// console.log('Adding payment for user :',user_token);
	}
	
	
	$scope.initCard();
	$scope.stripeTokenHandler =  function(token) {
		if($scope.cardForUser){
			if ($scope.buttonClicked === 1) {           
				// $rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
				return false;
			}else{
				$scope.buttonClicked = 1;
				$.post(MY_CONSTANT.urlC + 'add_user_credit_card', {
					web_access_token: $cookieStore.get('web_access_token'),
					user_id: $scope.cardForUser,
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
							$scope.openToast('error',"Duplicate Card, Please try another",'');
						}else if(data.flag==101){
							alert(data.error);
							$state.go("corporate_login");
						}else if(data.flag==4000){
							alert(data.log);
							$scope.showUserEditPopup();
						}else if (data.error) {
							alert(data.error);
							return;
						} else {	
							$('html, body').animate({scrollTop:0}, 'slow');						
							card.clear();
						
							$rootScope.openToast('success', 'Card Added Successfully', '');
							// console.log(data);
							$('#add_to_account').modal('hide');
							$('#add_user_card').modal('hide');
							$('#emailUpdateforUser').modal('hide');
							
							
							setTimeout(function(){
								$('html, body').animate({scrollTop:0}, 'slow');
								$('#loading').modal('hide');
								$state.reload();
							},200);
									
									
						}
					
					});
				});
			}
		}else{
			alert('User not selected for adding payment.');
		}
	}
	
	$scope.EmailUpdating = 0;
	
	$scope.updateUser = function(){
		
		if(!$scope.EmailUpdating){
			$scope.EmailUpdating = 1;
			$.post(MY_CONSTANT.urlC + 'update_registered_user_info', {
				web_access_token: $cookieStore.get('web_access_token'),
				user_id: $scope.cardForUser,
				user_email:$scope.cardForEmail
			})
			.then(function successCallback(data, status) {
				$rootScope.$apply(function () { 
					$scope.EmailUpdating = 0;
					
					
					
					if (typeof(data) == 'string')
							data = JSON.parse(data);
						else data = data;
						
						if(data.flag==101){
							alert(data.error);
							$state.go("corporate_login");
						}else if (data.error) {
							alert(data.error);
							return;
						} else {				
							$scope.stripeTokenHandler($scope.token);
							$rootScope.openToast('success', 'User info updated Successfully', '');
							// console.log(data);
							$('#add_to_account').modal('hide');
							$('#emailUpdateforUser').modal('hide');
							$('html, body').animate({scrollTop:0}, 'slow');
						}
						
				})
			})
		}else{
			$rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
			return false;
		}
	}
	
	
	
	
	
	
	
	
	$scope.loadPickup = function(){
		var autocomplete = {};
		var autocompletesWraps = ['pickup', 'drop'];

		var test_form = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };
		var test2_form = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };

		
			$.each(autocompletesWraps, function(index, name) {
				
				if($('#'+name).length == 0) {
					return;
				}

				autocomplete[name] = new google.maps.places.Autocomplete($('#'+name+'.autocomplete')[0], { types: ['establishment'] });
					
				google.maps.event.addListener(autocomplete[name], 'place_changed', function() {
				
					
					var place = autocomplete[name].getPlace();
					
					if(name == 'pickup'){
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						$scope.booking.current_latitude = latitude;
						$scope.booking.current_longitude = longitude;
						$scope.booking.pickup_location_address = place.formatted_address;
						
						
						
					}
						$scope.booking.is_fav = 1;		
						$scope.booking.toll = 0;
						
						$scope.booking.promo_code = '';
						$scope.booking.promo_value = '0';
						$scope.booking.offset = '330';
						
					if(name == 'drop'){
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						$scope.booking.latitude = latitude;
						$scope.booking.longitude = longitude;
						
						$scope.booking.manual_destination_latitude = latitude;
						$scope.booking.manual_destination_longitude = longitude;
						$scope.booking.manual_destination_address = place.formatted_address;
						
						
					}
					$scope.booking.ride_estimate_distance = '3469';
					$scope.booking.ride_estimate_time = '417';
					$scope.booking.estimated_fare = '22.26';
				
					
				});
			});
		
	}
	
	
	$scope.showDriver = function(){
		if($scope.booking.time_hour && $scope.booking.date && $scope.booking.pickup && $scope.booking.drop){
			$scope.timendate = 0;
			$scope.driverselect = 1;
			$scope.lastStep = 0;
		}else{
			alert('Please enter details');
		}
	}
	

	
	$scope.showLast = function(){
		if($scope.booking.driver_id&&$scope.booking.car ){
			$scope.timendate = 0;
			$scope.driverselect = 0;
			$scope.lastStep = 1;
		}else{
			alert('Please Select Driver');
		}
	}
	
	
	$scope.BookRideNow = function(){
		$scope.booking.time = $scope.booking.date+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes+':00';
		// console.log($scope.booking.time);
		//$scope.booking.time = '2018-12-10 14:12:25';
	
		
		 $.post(MY_CONSTANT.urlWC+ 'schedule_request', {
						web_access_token:  $cookieStore.get('web_access_token'),				
						current_latitude:$scope.booking.current_latitude,
						current_longitude:$scope.booking.current_longitude,
						estimated_fare:$scope.booking.estimated_fare,
						ride_estimate_distance:$scope.booking.ride_estimate_distance,
						ride_estimate_time:$scope.booking.ride_estimate_time,
						pickup_location_address:$scope.booking.pickup_location_address,
						latitude:$scope.booking.latitude,
						longitude:$scope.booking.longitude,
						pickup_time:$scope.booking.time,
						car_type:$scope.booking.car,
						driver_id:$scope.booking.driver_id,
						is_fav:$scope.booking.is_fav,
						manual_destination_latitude:$scope.booking.manual_destination_latitude,
						manual_destination_longitude:$scope.booking.manual_destination_longitude,
						manual_destination_address:$scope.booking.manual_destination_address,
						toll:$scope.booking.toll,
						route:$scope.booking.route,
						promo_code:$scope.booking.promo_code,
						user_id:$scope.booking.user_id,
						offset:$scope.booking.offset,
						promo_value:$scope.booking.promo_value,
					}) .then(function successCallback(data) {
						//$rootScope.$apply(function () { 
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
								if(data.error || data.flag==0){
									
									alert(data.error || data.message);
									  return;
								}else{
										// console.log(data);								
									//$scope.corporateFareInfo = data.corporateFareInfo;
									//$scope.Drivers = data.favDriver;
						
									$scope.$apply();
						
								}
					
						//});
						
					});
					
	}

	$scope.BookUserRide = function(user_id){
		
			// console.log('Booking Ride For',user_id);
			localStorage.setItem('book-ride-for',user_id);
			$state.go("corporate.bookRide");
			return
			
			$scope.showTab('1b');
			$scope.loadPickup();
				$scope.booking.started = 1;
				$scope.booking.user_id = user_id;
				
				$scope.timendate = 1;
				$scope.driverselect = 0;
				
				
				if(user_id){
					
					 $.post(MY_CONSTANT.urlC+ 'get_ride_data', {
						web_access_token:  $cookieStore.get('web_access_token'),				
						user_id:user_id,
						region_id:24				
					}) .then(function successCallback(data) {
						//$rootScope.$apply(function () { 
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
								if(data.error || data.flag==0){
									
									alert(data.error || data.message);
									  return;
								}else{
																		
									$scope.corporateFareInfo = data.corporateFareInfo;
									$scope.Drivers = data.favDriver;
						
									$scope.$apply();
						
								}
					
						//});
						
					});
					
					
				}
		
		
	}
	
	$scope.deleteUser = function(user){
		if(confirm("Are you sure you want to delete this User from My Users?")){
			$('#loading').modal('show');
			//console.log('deleting',user);
				
				if(user.user_id){
					
					 $.post(MY_CONSTANT.urlC+ 'corporate_remove_user', {
						web_access_token:  $cookieStore.get('web_access_token'),				
						association_id:user.user_id				
					}) .then(function successCallback(data) {
						$rootScope.$apply(function () { 
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
								if(data.error || data.flag==0){
									
									alert(data.error || data.message);
									$('#loading').modal('hide');
									  return;
								}else{
									
									$rootScope.openToast('success', 'User Removed Successfully', '');
									//console.log(data);
									setTimeout(function(){
										  $('html, body').animate({scrollTop:0}, 'slow');
										$('#loading').modal('hide');
										$state.reload();
									},20);
									
								}
					
						});
						
					});
					
					
				}
		}else{
			// console.log('Not Deleting');
		}
		
	}
	
    $scope.showTab = function(div){
		$scope.currentTab = div;
	}
	
	
    $scope.openAddUser = function(){
		
		window.open('/#/corporate/riderSignup', '_blank');
		//state.go('/#/corporate/rider_signup', '_blank');
		//window.open('/#/corporate/riderSignup', '_blank');
	};
	
    $scope.viewDetails = function(modalIndex){
        //$scope.popupDetails = $scope.userDetails.user_name;
        // var modalIndex=$cookieStore.get("modalToOpen");
        var tripDetails = $scope.myTrips[modalIndex];
        //  console.log(tripDetails);
        localStorage.setItem('userTripDetails', JSON.stringify(tripDetails));
        $state.go("driver.rideDetails");
    };
    $scope.rotateImage = function(id){
        // console.log('rotate image of ',id);
        // $('.rideBody:nth-of-type('+id+') .displayArrow').css('height','50px');
        // console.log($('.table:nth-child('+id+') .displayArrow').hasClass('.collapse_dark_arrow'));
        if($('.table:nth-child('+id+') .displayArrow').hasClass('.collapse_dark_arrow')){
            $('.table:nth-child('+id+') .displayArrow').removeClass('.collapse_dark_arrow')
        }else {
            $('.table:nth-child('+id+') .displayArrow').addClass('.collapse_dark_arrow');
        }
    }
});

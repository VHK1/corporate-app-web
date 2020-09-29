App.controller('corporateTripsController', function ($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $filter) {


    if (!$cookieStore.get('web_access_token')) {
        $state.go("corporate_login");
    }
    $scope.myTrips = [];
	$scope.booking = {};

	$scope.booking.abc = 1;
	$scope.skip = 0;
	$scope.currentPage = 1;
	$rootScope.ridePage = 0;
	$scope.showLoader = 0;
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    var newdriverModel = JSON.parse(localStorage.getItem('driverdata'));
    $scope.userDetails = [];
    
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

	$scope.getRideType = function() {	
			var ridesType =  localStorage.getItem('ridesType');			
			if(!ridesType){
				
				localStorage.setItem('ridesType', '0');
				$scope.ridesType = '0';
			}else{
				$scope.ridesType = ridesType;
			}
					
	}
	$scope.getRideType();
	
	$scope.setRideType = function() {	
		localStorage.setItem('ridesType',$scope.ridesType);
			
		$scope.currentPage = 1;
		$scope.skip = 0;
		$scope.initTable();
		 
	}
	
    $scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
       
		$scope.hideNext = 0;
		
		if(parseInt($scope.totalItems / 10 + 1) <= currentPage){
			$scope.hideNext = 1;
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
				$('.collapse').removeClass('show');
                //$scope.$apply();
				
            }
        }
        $scope.initTable();
    };
    $scope.initTable = function() {
		
		var limit = 10;
		
        $.post(MY_CONSTANT.urlC + 'ride_history', {
                web_access_token: $cookieStore.get("web_access_token"),
                limit: limit,
                offset: $scope.skip,
                requestType: 3,
				is_schedule:$scope.ridesType
            })
            .success(function(data, status) {
              
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
                
                if (data.flag == 502) {
					
						$scope.myTrips = [];
						
                    $scope.totalItems= data.total_length;
					
					if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
						$scope.hideNext = 1;
					}else{
						$scope.hideNext = 0;
					}
					
		
                    var Bookings = data.my_trips;
                    
                    Bookings.forEach(function(bookingData,ind) {
						
                       						
						if((bookingData.ride_status>3)){
							
							return false;
                        }
						var d = bookingData;
                        d.payment_method = bookingData.payment_method||'Card';
						d.ride_key = bookingData.ride_status
                        switch (bookingData.ride_status) {
                                case 0:
					
									if(((bookingData.request_status == 0) || (bookingData.request_status == null)) && (bookingData.is_active == 1)){										
										 d.ride_status = "Assigning";										 
									}else if(((bookingData.request_status == 0) || (bookingData.request_status == null)) && (bookingData.is_active == 0)){										
										 d.ride_status = "Missed by driver";										 
									}else if((bookingData.request_status == 1)){
										 d.ride_status = "Accepted"
									}else if((bookingData.request_status == 10)){
										 d.ride_status = "Missed by driver"
									}else if((bookingData.request_status == 5)){
										 d.ride_status = "Cancelled by driver"
									}else{
										 d.ride_status = "Unknown "
									}
                                   
                                    break;
                                case 1:
                                    d.ride_status = "Picking Up"
                                    break;
                                case 2:
                                    d.ride_status = "Arrived"
                                    break;
                                case 3:
                                    d.ride_status = "En Route"
									
                                    break;
                                case 4:
                                    d.ride_status = "Completed"
                                    break;
                                 case 5:
                                    d.ride_status = "Cancelled by driver"
                                    break;
                                case 6:
                                    d.ride_status = "Cancelled by rider"
                                    break;
                                case 7:
                                    d.ride_status = "Cancelled by rider"
                                    break;
								case 8:
                                    d.ride_status = "Unsuccessful payment"
                                    break;
								case 9:
                                    d.ride_status = "Cancelled by admin"
                                    break;
								case 10:
                                    d.ride_status = "Missed by driver"
                                    break;
								case 11:
                                    d.ride_status = "Cancelled by corporate"
                                    break;

                            }
                       
                        d.path_string = bookingData.path_string;
                        d.ratings=[];
                        for(i=0;i<d.user_rating;i++){
                          d.ratings.push(1);
                        }
                        d.noRatings=[];
                        for(i=0;i<(5-d.user_rating);i++){
                          d.noRatings.push(1);
                        }
                        d.imgSource = 'https://maps.googleapis.com/maps/api/staticmap?size=400x400&style=feature%3Alandscape%7Cvisibility%3Aoff&style=feature%3Apoi%7Cvisibility%3Aoff&style=feature%3Atransit%7Cvisibility%3Aoff&style=feature%3Aroad.highway%7Celement%3Ageometry%7Clightness%3A39&style=feature%3Aroad.local%7Celement%3Ageometry%7Cgamma%3A1.45&style=feature%3Aroad%7Celement%3Alabels%7Cgamma%3A1.22&style=feature%3Aadministrative%7Cvisibility%3Aoff&style=feature%3Aadministrative.locality%7Cvisibility%3Aon&style=feature%3Alandscape.natural%7Cvisibility%3Aon&scale=2&markers=shadow%3Afalse%7Cscale%3A2%7Cicon%3Ahttps://s3.ap-south-1.amazonaws.com/qudosemail/pickup1.png%7C' + bookingData.pickup_latitude + '%2C' + bookingData.pickup_longitude + '&markers=shadow%3Afalse%7Cscale%3A2%7Cicon%3Ahttps://s3.ap-south-1.amazonaws.com/qudosemail/drop_off1.png%7C' + bookingData.manual_destination_latitude + '%2C' + bookingData.manual_destination_longitude + '&path=geodesic:true%7Cweight:3%7Ccolor:0x2dbae4ff%7C' + bookingData.path_string + '&key=AIzaSyADXfBi40lkKpklejdGIWNxdkqQCKz8aKI';
						
						d.total_with_tax = bookingData.total_with_tax.toFixed(2);
						//d.total_with_tax = parseFloat(d.total_with_tax);
						if(bookingData.pickup_time){
							d.pickup_time =  bookingData.pickup_time;
							
							var dt = new Date(d.pickup_time)
							dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
							var raw = dt.toISOString();
							d.pickup_time =  raw;
						}
						if(bookingData.start_time){
							d.start_time =  bookingData.start_time;
							
							
						}	
						if((d.ride_status !='Completed') && (d.ride_status !='Unknown') && (d.ride_status !='Cancelled by driver')  && (d.ride_status !='Cancelled by admin') && (d.ride_status != 'Missed by driver')){
							
							$scope.myTrips.push(d);		
							var index = $scope.myTrips.length;
							
							$scope.getRouteEnc(d.pickup_location_address,d.manual_destination_address,d,index-1);							
						}
                    });
					
					
			
					
					$('.collapse').removeClass('show');
                    $scope.$digest();
                } else {

                }
            });
    }
	
	
	$scope.sorterFunc = function(car){
		return parseFloat(car.value_regular);
	};
	
	
	$scope.getCSV = function() {
        $.post(MY_CONSTANT.urlC + 'ride_history', {
                web_access_token: $cookieStore.get("web_access_token"),
                limit: 10,
                offset: $scope.skip,
				requestType: 3
            })
            .success(function(data, status) {
               
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
               
                if (data.flag == 502) {
                    $scope.totalItems= data.total_length;
                    var Bookings = data.my_trips;
					
					var csvContent = "data:text/csv;charset=utf-8,";
					
					var header = 0;
                    Bookings.forEach(function(bookingData,ind) {
						
                       						
						if((bookingData.ride_status>3)){
							
							return false;
                        }
						var d = bookingData;
                        d.payment_method = bookingData.payment_method||'Card';
					
                        switch (bookingData.ride_status) {
                                case 0:
					
									if((bookingData.request_status == 0)){										
										 d.ride_status = "Assigning";
										 
									}else if((bookingData.request_status == 1)){
										 d.ride_status = "Accepted"
									}else if((bookingData.request_status == 10)){
										 d.ride_status = "Missed by driver"
									}
                                   
                                    break;
                                case 1:
                                    d.ride_status = "Picking Up"
                                    break;
                                case 2:
                                    d.ride_status = "Arrived"
                                    break;
                                case 3:
                                    d.ride_status = "En Route"
                                    break;
                                case 4:
                                    d.ride_status = "Completed"
                                    break;
                                 case 5:
                                    d.ride_status = "Cancelled by driver"
                                    break;
                                case 6:
                                    d.ride_status = "Cancelled by rider"
                                    break;
                                case 7:
                                    d.ride_status = "Cancelled by rider"
                                    break;
								case 8:
                                    d.ride_status = "Unsuccessful payment"
                                    break;
								case 10:
                                    d.ride_status = "Missed by driver"
                                    break;
								case 11:
                                    d.ride_status = "Cancelled by corporate"
                                    break;

                            }
                       

					   if(bookingData.pickup_time){
							d.pickup_time =  bookingData.pickup_time;
							
							var dt = new Date(d.pickup_time)
							dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
							var raw = dt.toISOString();
							d.pickup_time =  raw;
						}
						if(bookingData.start_time){
							d.start_time =  bookingData.start_time;
							
							var dt = new Date(d.start_time)
							dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
							var raw = dt.toISOString();
							d.start_time =  raw;
						}	
						
						
                        d.path_string = bookingData.path_string;
                        d.ratings=[];
                        for(i=0;i<d.user_rating;i++){
                          d.ratings.push(1);
                        }
                        d.noRatings=[];
                        for(i=0;i<(5-d.user_rating);i++){
                          d.noRatings.push(1);
                        }
                     
						
						if((d.ride_status !='Completed') && (d.ride_status != 'Missed by driver')){
							
							var obj = bookingData;
							
						
						
							
							if(!header){
								header = 1
								
								var csvKey = Object.keys(obj).filter(function (key,v) { 
								
									if((key == "session_id") || (key == "user_name") || (key == "car_name") || (key == "ride_status")){
										return obj[key]; 
									}else if( key ==  "pickup_time"){
										return obj[key];
									}else if( key ==  "total_with_tax"){
										return obj[key]+" paid via "; 
									}
								
								});
							
							
								
								csvContent += csvKey + "\r\n";
							}
							
							
							var row = [];
							var payment_method = obj['payment_method'];
							
							for (key in obj){
								
								if((key == "session_id") || (key == "user_name") || (key == "car_name") || (key == "ride_status")){
										row.push(obj[key]); 
									}else if( key ==  "pickup_time"){
										var dateData = $filter('date')(new Date(obj[key]),'MM/dd/yyyy HH:mm a');
										row.push(dateData);
									}else if( key ==  "total_with_tax"){
										row.push( obj[key]+" paid via "+payment_method); 
									}
							}
							 
  
  

							

							//let row = bookingData.join(",");
							csvContent += row + "\r\n";

							//$scope.myTrips.push(d);		
									
						}
                    });
                   
				  
					var encodedUri = encodeURI(csvContent);
					var link = document.createElement("a");
					link.setAttribute("href", encodedUri);
					link.setAttribute("download", "Trips_data.csv");
					document.body.appendChild(link); // Required for FF

					link.click();


                    $scope.$digest();
                } 
		});
    }
	
	
	
	$scope.getRouteEnc = function(o,d,bookingData,pointer){
		
		var directionsService = new google.maps.DirectionsService();			 
		var request = {
		   origin: o, 
		   destination: d,
		   travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		let polylines = '0';
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				polylines = response.routes[0].overview_polyline;
				
				
				var imgSourcePath = 'https://maps.googleapis.com/maps/api/staticmap?size=600x600&path=color:0x00000cd0|weight:5|enc:'+polylines+'&markers=shadow:false|scale:2|color:green|label:A|'+bookingData.pickup_latitude+','+bookingData.pickup_longitude+'&markers=color:red|label:B|shadow:false|scale:2|'+bookingData.manual_destination_latitude+','+bookingData.manual_destination_longitude+'&key=AIzaSyADXfBi40lkKpklejdGIWNxdkqQCKz8aKI';
				
				
				
				bookingData.imgSourcePath = imgSourcePath;
			}
				
			$scope.$digest();
			
		});
	}
	
	
    $scope.initTable();
    $scope.loadData = function () {
        $('.accordion-toggle').addClass('collapsed');
    };

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $('.collapse').on('show.bs.collapse', function () {
            $('.collapse.in').collapse('hide');
            var index = $(this).attr("id");
            $scope.arrowKey = true
            $cookieStore.put('modalToOpen', index);
        });
     

    });
	$scope.cancelRidePopup = function(modalIndex){
		var tripDetails = $scope.myTrips[modalIndex];
		$scope.triptoCancel = tripDetails;
		$scope.tripTypeCancel = tripDetails.is_schedule;
		
	};
	$scope.cancelRide = function(trip){
		
			var tripDetails = trip;
			
		
			if(tripDetails.session_id){
				
				 $.post(MY_CONSTANT.urlC+ 'cancel_ride', {
					web_access_token:  $cookieStore.get('web_access_token'),				
					session_id:tripDetails.session_id			
				}) .then(function successCallback(data) {
					$rootScope.$apply(function () { 
					
						if (typeof(data) == 'string') data = JSON.parse(data);
								
							if(data.error || data.flag==0){
								
							$rootScope.openToast('error',data.error || data.message, '');

								  return;
							}else{
								$scope.showLoader = 1;
								$rootScope.openToast('success', 'Ride Cancelled Successfully', '');
								setTimeout(function(){
									$scope.showLoader = 0;
									setTimeout(function(){
										window.location.reload();
									},500);
								},2000);
								
							
							}
				
					});
					
				});
				
				
			}
		
		
	}
	
    $scope.rescheduleNow = function(){
		if(!$scope.booking.time_hour || !$scope.booking.date || !$scope.booking.time_minutes){
			
			alert("Please enter Date and Time");	
			return;
		}
		$scope.booking.time = $scope.booking.date+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes;
		
		
		
		 $.post(MY_CONSTANT.urlC+ 'modify_schedule', {
				web_access_token:  $cookieStore.get('web_access_token'),				
				pickup_id:$scope.rTrip.pickup_id,
				pickup_time:$scope.booking.time,
				latitude:$scope.rTrip.pickup_latitude,
				longitude:$scope.rTrip.pickup_longitude,
				offset:330,
				manual_destination_latitude : $scope.rTrip.manual_destination_latitude,
				manual_destination_longitude : $scope.rTrip.manual_destination_longitude,
				manual_destination_address : $scope.rTrip.manual_destination_address,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
							
						if(data.error || data.flag==0){
							
							$rootScope.openToast('error',data.error || data.message, '');

							  return;
						}else{
							$('#add_to_account').modal('hide');
							$rootScope.openToast('success', data.log, '');
							
							
							$scope.initTable();
						}
			
				});
				
			});
					
	
	}
	
    $scope.setDate = function(stamp){
		var year = new Date(stamp).getFullYear();
		var month =  new Date(stamp).getMonth();

		var month = month+1;
		var month = (month < 10) ? "0" + month : month;

		var day =  new Date(stamp).getDate();
		var day = (day < 10) ? "0" + day : day;
		var dateOfPickup = year+'-'+month+'-'+day;
		
		$scope.booking.date = dateOfPickup;
	}
	
	$scope.setTime = function(stamp){
		var hours = new Date(stamp).getHours();
		var hours = (hours < 10) ? "0" + hours : ''+hours;
		$scope.booking.time_hour = hours;
		
		
		
		var mins =  new Date(stamp).getMinutes();
		var mins = (mins < 10) ? "0" + mins : ''+mins;
		
		$scope.booking.time_minutes = mins;
	}
	
    $scope.rescheduleRide = function(modalIndex){
		var tripDetails = $scope.myTrips[modalIndex];
		
		
		$scope.rTrip = tripDetails;
		
		
		
		$scope.setDate($scope.rTrip.pickup_time);
		$scope.setTime($scope.rTrip.pickup_time);
		
		
	}
	
	
    $scope.viewDetails = function(modalIndex){
        
        var tripDetails = $scope.myTrips[modalIndex];
        
        localStorage.setItem('userTripDetails', JSON.stringify(tripDetails));
        $state.go("corporate.rideDetails");
    };
    $scope.rotateImage = function(id){
      
        if($('.table:nth-child('+id+') .displayArrow').hasClass('.collapse_dark_arrow')){
            $('.table:nth-child('+id+') .displayArrow').removeClass('.collapse_dark_arrow')
        }else {
            $('.table:nth-child('+id+') .displayArrow').addClass('.collapse_dark_arrow');
        }
    }
});

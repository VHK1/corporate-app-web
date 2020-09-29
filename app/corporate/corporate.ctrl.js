App.controller('CorporateCtrl', ['$scope', '$http', '$cookieStore', 'MY_CONSTANT', 'CONSTANT', '$state', '$location', '$rootScope', '$interval', 'socketFactory', '$window' , function($scope, $http, $cookieStore, MY_CONSTANT, CONSTANT, $state, $location, $rootScope, $interval, socketFactory, $window) {
	if (!$cookieStore.get('web_access_token')) {
		$state.go("corporate_login");
	}

	$rootScope.ridePage = 0;


	$('.modal').modal('hide');
	$scope.loading = false;
	$scope.profile={};
	$scope.profile=$scope.driverDetail;
	$scope.user_image='';
	$scope.profile={};
	$scope.pop={};

	$('img').on('dragstart', function(event) {
       event.preventDefault();
	});
	$scope.logoutConfirm = function() {
		$('#confirmLogout').modal('show');
	};
	$('input').attr("autocomplete", "off");
	var d = new Date();
	$rootScope.bookingInProgress = 0;
	$rootScope.editing = 0;
	$scope.redirectStart = 0;
	$scope.redirectfromProfile = 0;
	d.setMinutes(0);
	d.setHours(0);
	d.setSeconds(0);
	$scope.showCredentialsAlert = function() {
		$('#alertCredModal').modal('show');
	};
	
	var access_token = $cookieStore.get('access_token');
	if (access_token === undefined) {
		$scope.showCredentialsAlert();
	}
	$('.menuItems').click(function() {
		 $('.menuItems').removeClass("active");
		 $(this).addClass("active");
	});
	$scope.initMenu = function() {
		$('.menuItems').on('click', function() {
				  $('.menuItems').removeClass('active');
				  $(this).addClass('active');
		});
		
		if ($location.path().match('schedule')) {
			$('.menuItems').removeClass('active');
			$('.schedule').addClass('active');
		}
		if ($location.path().match('documents')) {
			$('.menuItems').removeClass('active');
			$('.documents').addClass('active');
		}
		// if ($location.path().match('ride_details')) {
		//     $('.menuItems').removeClass('active');
		//     $('.rideDetails').addClass('active');
		// }
		if ($location.path().match('driver_profile')) {
			$('.menuItems').removeClass('active');
		}
		
		$rootScope.ridePage = 0;

	};
	$scope.initMenu();
	var driverModel = JSON.parse(localStorage.getItem('driverdata'));

	var driverModel = JSON.parse(localStorage.getItem('corporateModel'));




	var driverModelInfo = JSON.parse(localStorage.getItem('driverModelInfo'));

	$scope.userDetails = [];
	$scope.driverDetails = {};

	if (driverModel ){
		$scope.driverDetails = driverModel;
		
		
	} else {
		
		$cookieStore.remove('access_token');
		$state.go("corporate_login");
	}
	
	
	
	$scope.logoutClose = function() {
		$scope.logout();
	}
	$scope.logout = function() {
		
		localStorage.removeItem('driverdata');
		localStorage.removeItem('corporateModel');


		$('.modal').modal('hide');
		prms = {web_access_token : $cookieStore.get('access_token') };
		 $.post(MY_CONSTANT.urlC + 'logout',prms)
				.then(function successCallback(data, status) {
					$cookieStore.remove('access_token');
					$cookieStore.remove('web_access_token');
					$state.go("corporate_login");
				});
		/**/
	};
	$scope.closeDropDown = function() {
		$(".sub").css("transform", "rotateX(-88deg)");
	}

	
	
	
	
	/*
	$scope.notifyMe = function() {
		  if (Notification.permission !== "granted")
			Notification.requestPermission();
		  else {
			var notification = new Notification('Notification title', {
			  icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
			  body: "Hey there! You've been notified!",
			});

			notification.onclick = function () {
			  window.open("http://rideQudos.com/a/13328397/1269037");      
			};

		  }

	}
	*/
	
	$scope.initNotificationListener = function() {
		
		document.addEventListener('DOMContentLoaded', function () {
		  if (!Notification) {
			alert('Desktop notifications not available in your browser. Try Chromium.'); 
			return;
		  }

		  if (Notification.permission !== "granted")
			Notification.requestPermission();
		});

	
		Notification.requestPermission()
		.then(function(permission) {
			
		});
	}
	
	
	
	$scope.initNotification = function() {
		var token = $cookieStore.get('web_access_token');
		socketFactory.init(); 
		
		$window.socket.emit('auth', {session_id : 0 ,user_type: 'corporate', access_token: token});
	
		//socketFactory.emit('auth', {session_id : 0 ,user_type: 'corporate', access_token: token});
		
		return;

    }
   $scope.initNotification();
   //$scope.initNotificationListener();
	
	
	socketFactory.on('auth', function(data) {
		if(data[0].flag==true){ 
			
			socketFactory.emit('corporateNotification', { corporate_id:$scope.driverDetails.corporate_id});
			$interval(function(){
			   socketFactory.emit('corporateNotification', { corporate_id:$scope.driverDetails.corporate_id});  
			},10000)
			
			socketFactory.on('corporateNotification', function(data) {
				$scope.sockos=data[0].data.paginated_notification;
				//$scope.Notifications = $scope.sockos;
				$scope.totalNotifications = '';
				$scope.totalNotifications = data[0].data.count;
			});
			
	
		}else{
		
			
			setTimeout(function(){
				$state.reload();
			},2000);
			
			//alert('Socket is logged out unexpecteadly.');
		}			
	});
		
	/*
	socketFactory.on('corporateNotification', function(data) {
			$scope.totalNotifications = data[0].data.count;
			
	});
	*/
	
	
	
	$scope.editMode = 0;
	
	$scope.locationPicker = function() {
				
		var autocomplete = {};
		var autocompletesWraps = ['base_location'];

		var test_form = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };
		var test2_form = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };

		
			$.each(autocompletesWraps, function(index, name) {
				
				if($('#'+name).length == 0) {
					
					return;
				}

				autocomplete[name] = new google.maps.places.Autocomplete($('#'+name+'.autocomplete')[0],);
					
				google.maps.event.addListener(autocomplete[name], 'place_changed', function() {
				
					var place = autocomplete[name].getPlace();
					if(!place.geometry){
						alert('Something Went Wrong!!');
						return;
					}
					if(name == 'base_location'){
						
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						$scope.pop.latitude = latitude;
						$scope.pop.longitude = longitude;
						$scope.pop.address = place.formatted_address;
										
						
					}
					
				});
			});
		
		
	}
	$scope.locationPicker();
	
	
	
/*---*/
	
	$scope.closeEdit = function () {
		$scope.editMode = 0;
	}
	
	
	$scope.editProfile = function () {
		$scope.editMode = 1;
		$('#editProfile').modal('show');
		$scope.profile =  JSON.parse(localStorage.getItem('corporateModel'));

		if(!$scope.profile.is_approved ){

			$scope.pop.address = $scope.profile.address;
			$scope.pop.city = $scope.profile.city;
			$scope.pop.state = $scope.profile.state;
			$scope.pop.zipcode = $scope.profile.zipcode;
			$scope.pop.latitude = $scope.profile.latitude;
			$scope.pop.longitude = $scope.profile.longitude;
		}else{
			$scope.pop = $scope.profile;
		}
	};

    $scope.user_image='';
    $scope.file_to_upload = function (files,id) {
		if(id == 1){ //driver image
			$scope.user_image = files[0];
			$scope.pop.user_image_sent = 1;
			// $scope.pop.user_image_name = files[0].name;
			var file = files[0];
			var imageType = /image.*/;
			if (!file.type.match(imageType)) {
			}
		}
		$scope.$apply();
	};

	$scope.submitDetails = function () {
		var formData = new FormData();
		$('#loading').modal('show');
		
		formData.append('web_access_token', $cookieStore.get('access_token'));
		
		var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
	
		

		$.post(MY_CONSTANT.urlC+ 'edit_profile', {							
			web_access_token : $cookieStore.get('access_token'),
			address : $scope.pop.address,
			city : $scope.pop.city,
			state : $scope.pop.state,
			zipcode : $scope.pop.zipcode,
			latitude : $scope.pop.latitude,
			longitude : $scope.pop.longitude,

			}) .then(function successCallback(data) {
		
				if (typeof(data) == 'string') data = JSON.parse(data);
					
				if (data.flag == 101) {
					$scope.showCredentialsAlert();
					
					setTimeout(function(){
						$scope.$apply();
					},1000);
					
					
				}else if(data.error || data.flag==0){
					
					$('#loading').modal('hide');
					alert(data.error || data.message);
					
					setTimeout(function(){
						$scope.$apply();
					},1000);
					return;
					
					
				}else{
					
					var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
					
				
					
					driverModel.zipcode = $scope.pop.zipcode;
					driverModel.city = $scope.pop.city;
					driverModel.state = $scope.pop.state;
					driverModel.address = $scope.pop.address;
					driverModel.latitude = $scope.pop.latitude;
					driverModel.longitude = $scope.pop.longitude;
					
					localStorage.setItem('corporateModel', JSON.stringify(driverModel));
					
					
					$scope.editMode = 0;
					$scope.openToast('success','Profile Updated sucessfully','');
					$('#loading').modal('hide');
					setTimeout(function(){
						$state.reload();
					},1000);
					
								
					$scope.$apply();
		
				}
		
						
						
			
			}).fail(function(){
				alert('Something went Wrong!');
				$scope.$apply();
			});


	};

}]);


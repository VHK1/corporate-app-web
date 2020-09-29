App.controller('bookRideController', function ($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, socketFactory) {

	
	$rootScope.ridePage = 1;
	$scope.booking = {};
	
	$scope.showLoader = 0;
	$scope.cars_option = [];
	$scope.notFav = 0;
	
	$scope.booking.user_mobile = localStorage.getItem('book-ride-for');
	if(localStorage.getItem('book-ride-for')){
		$scope.booking.overlay = 1;
	}
	
	
	$scope.skip = 0;
	$scope.currentPage = 1;
	$scope.corporateFareInfo = [];
	
	
	$scope.carsInfo = '[{"value":"1483.99","car_type":1,"car_name":"QS","car_image":"https://s3-us-west-2.amazonaws.com/qudos-s3/car_images/qs.png"},{"value":"2172.82","car_type":2,"car_name":"QLE","car_image":"https://s3-us-west-2.amazonaws.com/qudos-s3/car_images/qle.png"},{"value":"4053.36","car_type":3,"car_name":"LUXE","car_image":"https://s3-us-west-2.amazonaws.com/qudos-s3/car_images/luxe.png"},{"value":"4885.26","car_type":4,"car_name":"GRANDE","car_image":"https://s3-us-west-2.amazonaws.com/qudos-s3/car_images/grande.png"},{"value":"2172.82","car_type":5,"car_name":"WAV","car_image":"http://qudos-s3.s3.amazonaws.com/car_images/qudos-hQlrK-wav.png"},{"value":"8089.57","car_type":6,"car_name":"ELITE","car_image":"https://s3-us-west-2.amazonaws.com/qudos-s3/car_images/default.png"}]';
	
	
	$scope.sorterFunc = function(car){
		return parseFloat(car.value_regular);
	};
		
	$scope.sortCars =  function() {					
	
	
		
		var carsData = $scope.carsInfo;
		
		carsData.forEach(function(carInfo) {
				  
			var d = carInfo;
			var c = {};
			
			if($scope.carTypes[carInfo.car_name]){
				c = $scope.carTypes[carInfo.car_name];
				d.carClass = c.className;
				d.similar = c.similar;
				d.max = c.max;
			}
			$scope.carsInfo.push(d);
		});	
		
									
									
	}
	//$scope.sortCars();
	
    if (!$cookieStore.get('web_access_token')) {
        $state.go("corporate_login");
    }
    $scope.myTrips = [];
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
    
	
	
	$scope.addZero = function(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	$scope.getDate =  function(newday) {
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		
		if(newday){
			if( (dd == 31) && ((mm == 1) || (mm == 3) || (mm == 5) || (mm == 7) || (mm == 8) || (mm == 10) || (mm == 12)) ){
				dd = 1;
				if(mm == 12){
						mm = 1;
						yyyy = yyyy + 1;
				}else{
					mm = mm + 1;
				}				
			}else if( (dd == 30) && ((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11) ) ){
				dd == 1;
				mm == mm + 1;
			}else if((dd == 29) && (mm == 2) && (yyyy%4 == 0) ){
				dd = 1;
				mm = mm + 1;
			}else if((dd == 28) && (mm == 2) && (yyyy%4 != 0) ){
				dd = 1;
				mm = mm + 1;
			}else{
				dd = dd+1;
			}
		}
		
		
		if(dd<10) {
			dd = '0'+dd
		} 

		if(mm<10) {
			mm = '0'+mm
		} 

		dateToday =  yyyy + '-' + mm + '-' + dd;

		$scope.booking.date = dateToday;
		
		
		var weekday = new Array(7);
		weekday[0] =  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";

		var n = weekday[today.getDay()];

		$scope.booking.date = $scope.booking.date+', '+n;
	}
	$scope.getHour =  function() {
	  var d = new Date();
	  var h = d.getHours();
	  var m =d.getMinutes();
	 
	 
		if (m<=5){
			m = 05;
		}else if (m<=10){
			m = 10;
		}else if (m<=15){
			m = 15;
		}else if (m<=20){
			m = 20;
		}else if (m<=25){
			m = 25;
		}else if (m<=30){
			m = 30;
		}else if (m<=35){
			m = 35;
		}else if (m<=40){
			m = 40;
		}else if (m<=45){
			m = 45;
		}else if (m<=50){
			m = 50;
		}else if (m<=55){
			m = 55;
		}else if (m<=59){
			m = 0;
		
			if(h!=23){			
				h = h+1;
			}else if(h == 23){
				h = 0;
				$scope.getDate('add');	
			}
		}
		
			
		if(h!=23){			
			h = h+1;
		}else if(h == 23){
			h = 0;
			$scope.getDate('add');	
		}
			
			
			
			
		m = $scope.addZero(m);
		h = $scope.addZero(h);
		
		h = ''+h;
		m = ''+m;
		$scope.booking.time_hour = h;	  
		$scope.booking.time_minutes = m;	  
	}
	
	$scope.getHour();	
	$scope.getDate();	


    $scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
		$scope.hideNext = 0;
		
		if(parseInt($scope.totalItems / 10 + 1) <= currentPage){
			$scope.hideNext = 1;
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
               
            }
        }
        $scope.initTable();
    };

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
	
	$scope.closeAutocomplete = 1;
	$scope.selectThisUser = function(id,num,name){
		$scope.booking.user_name = name;
		$scope.booking.user_mobile = num;
	
		
		setTimeout(function(){			
			$scope.checkPhoneCountry();
		},200);
		$scope.closeAutocomplete = 1;
	}
	$scope.closeAC = function(){		
		setTimeout(function(){
			$scope.closeAutocomplete = 1;
			$scope.$apply();
		},100);
	}
	$scope.getNewUsers = function(searchflag){
		var params = {
			web_access_token: $cookieStore.get("web_access_token"),
			limit: 10,
			offset: 0
		}
			
		if((searchflag == 1) && $scope.booking.user_name){
			params.searchFlag = 1;
			params.searchString = $scope.booking.user_name;
			$scope.closeAutocomplete = 0;
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
					
					if($scope.totalItems <= 10){
						$scope.hideLoadMore = 1;
					}
					
					$scope.Users = data.users;
				
					$scope.$apply();
                }
             
            });
	}
	$scope.getNewUsers();
	
	$scope.showTime = function(){
		
		$scope.timendate = 1;
		$scope.driverselect = 0;
		
	}
	
	$scope.donothing = function(){
	}
	$scope.showDirection = function(force){
		$scope.DirectionShow = 1
		$scope.CarShow = 0
		$scope.UserShow = 0
		
		if(force == 1){
			$scope.force = 1;
		}else{
			$scope.force = 0;
		}
		
	}
	
	$scope.showCar = function(){
		$scope.DirectionShow = 0
		$scope.CarShow = 1
		$scope.UserShow = 0
	}
	
	$scope.showUser = function(){
		$scope.force = 0;
		$scope.DirectionShow = 0
		$scope.CarShow = 0
		$scope.UserShow = 1
	}
	
	
	$scope.findPlace = function(type){
			setTimeout(function(){
				$scope.findPlaceNow(type);
				//$scope.apply();				
			},500);
	};
	$scope.findPlaceNow = function(type){
			//return;
			var existing = '';
			var	address = '';
			if(type == "pickup"){
				address = $('#pickup').val();
				
				if((!address) || (address =='')){
					
					$scope.booking.current_latitude = '';
					$scope.booking.current_longitude = '';
					$scope.booking.pickup_location_address = '';			
					$scope.booking.latitude = '';
					$scope.booking.longitude = '';
					$scope.getDirections();
				}else{				
					existing = $scope.booking.latitude;
				}
			}else if(type == 'drop'){
				address = $('#drop').val();
				
				if((!address) || (address =='')){
					
					$scope.booking.manual_destination_latitude = '';
					$scope.booking.manual_destination_longitude = '';
					$scope.booking.manual_destination_address = '';
					$scope.getDirections();
				}else{
				
					existing = $scope.booking.manual_destination_latitude;
				}
			}
			
			
			//console.log(type,address,'existing',existing);
			
			if( address!=''){
				geocoder = new google.maps.Geocoder();

					geocoder.geocode( { 'address' : address }, function( results, status ) {
					if( status == google.maps.GeocoderStatus.OK ) {
						
						var formatted_address = results[0].formatted_address;
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();
						
						if(type == 'pickup'){
							$scope.booking.current_latitude = latitude;
							$scope.booking.current_longitude = longitude;
							//$scope.booking.pickup_location_address = formatted_address;						
							$scope.booking.pickup_location_address = $('#pickup').val();						
							$scope.booking.latitude = latitude;
							$scope.booking.longitude = longitude;
							
							
						
						
							var directionsDisplay = new google.maps.DirectionsRenderer();
							directionsDisplay.setMap(null);
						}else if(type == 'drop'){
							$scope.booking.manual_destination_latitude = latitude;
							$scope.booking.manual_destination_longitude = longitude;
							$scope.booking.manual_destination_address = $('#drop').val();
							
						
						
							var directionsDisplay = new google.maps.DirectionsRenderer();
							directionsDisplay.setMap(null);
						}
						$scope.getDirections();
					} else {
						
					}
				} );
			}else if( address==''){
				var directionsDisplay = new google.maps.DirectionsRenderer();
				directionsDisplay.setMap(null);
			}else{
			
			}
			
	}
	
	$scope.getDirections = function(){
			
			var map = new google.maps.Map(document.getElementById('map'), {
				zoom:12,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: {lat: 40.715818, lng: -73.963976},
			 });
		if($scope.booking.manual_destination_latitude && $scope.booking.current_latitude){
			var directionsService = new google.maps.DirectionsService();
			 var directionsDisplay = new google.maps.DirectionsRenderer();
		
				directionsDisplay.setMap(null);
			 directionsDisplay.setMap(map);
			 directionsDisplay.setPanel(document.getElementById('panel'));
		
			 var request = {
			   origin: $scope.booking.pickup_location_address, 
			   destination: $scope.booking.manual_destination_address,
			   travelMode: google.maps.DirectionsTravelMode.DRIVING
			 };
			 $scope.booking.polylines = 'NOT FOUND YET';
			 directionsService.route(request, function(response, status) {
			   if (status == google.maps.DirectionsStatus.OK) {
				 directionsDisplay.setDirections(response);
				 
				 $scope.booking.polylines = response.routes[0].overview_polyline
			   }
			 });
			 
		}	
	}
	
	
	
	$scope.getTimeZone = function(lat,lng){	
		var timestamp = (Math.round((new Date().getTime())/1000)).toString();
		var timezone = 'https://maps.googleapis.com/maps/api/timezone/json?location='+lat+','+lng+'&timestamp='+timestamp+'&key='+MY_CONSTANT.mapKey;
		
		$.ajax({
		   url:timezone,
		})
		.done(function(response){
			
		   if(response.timeZoneId != null){
			
			 $scope.booking.timezone = response.timeZoneId;
		   }
		});
	}
	
	$scope.checkPhoneCountry = function(){
			 var countries = {
				 '+1':'US',
				 '+91':'IN',	
				 '+7': "RU",
				 '+20': "EG",
				 '+27': "ZA",
				 '+30': "GR",
				 '+31': "NL",
				 '+32': "BE",'+33': "FR",'+34': "ES",'+36': "HU",'+39': "IT",'+40': "RO",'+41': "CH",'+43': "AT",'+44': "GB",'+45': "DK",'+46': "SE",'+47': "SJ",'+48': "PL",'+49': "DE",'+51': "PE",'+52': "MX",'+53': "CU",'+54': "AR",'+55': "BR",'+56': "CL",'+57': "CO",'+58': "VE",'+60': "MY",'+61': "CC",'+62': "ID",'+63': "PH",'+64': "NZ",'+65': "SG",'+66': "TH",'+81': "JP",'+82': "KR",'+84': "VN",'+86': "CN",'+90': "TR",'+91': "IN",'+92': "PK",'+93': "AF",'+94': "LK",'+95': "MM",'+98': "IR",'+212': "MA",'+213': "DZ",'+216': "TN",'+218': "LY",'+220': "GM",'+221': "SN",'+222': "MR",'+223': "ML",'+224': "GN",'+225': "CI",'+226': "BF",'+227': "NE",'+228': "TG",'+229': "BJ",'+230': "MU",'+231': "LR",'+232': "SL",'+233': "GH",'+234': "NG",'+235': "TD",'+236': "CF",'+237': "CM",'+238': "CV",'+239': "ST",'+240': "GQ",'+241': "GA",'+242': "CG",'+243': "CD",'+244': "AO",'+245': "GW",'+246': "IO",'+248': "SC",'+249': "SD",'+250': "RW",'+251': "ET",'+252': "SO",'+253': "DJ",'+254': "KE",'+255': "TZ",'+256': "UG",'+257': "BI",'+258': "MZ",'+260': "ZM",'+261': "MG",'+262': "RE",'+263': "ZW",'+264': "NA",'+265': "MW",'+266': "LS",'+267': "BW",'+268': "SZ",'+269': "KM",'+290': "SH",'+291': "ER",'+297': "AW",'+298': "FO",'+299': "GL",'+350': "GI",'+351': "PT",'+352': "LU",'+353': "IE",'+354': "IS",'+355': "AL",'+356': "MT",'+357': "CY",'+358': "AX",'+359': "BG",'+370': "LT",'+371': "LV",'+372': "EE",'+373': "MD",'+374': "AM",'+375': "BY",'+376': "AD",'+377': "MC",'+378': "SM",'+379': "VA",'+380': "UA",'+381': "RS",'+382': "ME",'+385': "HR",'+386': "SI",'+387': "BA",'+389': "MK",'+420': "CZ",'+421': "SK",'+423': "LI",'+500': "GS",'+501': "BZ",'+502': "GT",'+503': "SV",'+504': "HN",'+505': "NI",'+506': "CR",'+507': "PA",'+508': "PM",'+509': "HT",'+590': "MF",'+591': "BO",'+593': "EC",'+594': "GF",'+595': "PY",'+596': "MQ",'+597': "SR",'+598': "UY",'+599': "AN",'+670': "TL",'+672': "NF",'+673': "BN",'+674': "NR",'+675': "PG",'+676': "TO",'+677': "SB",'+678': "VU",'+679': "FJ",'+680': "PW",'+681': "WF",'+682': "CK",'+683': "NU",'+685': "WS",'+686': "KI",'+687': "NC",'+688': "TV",'+689': "PF",'+690': "TK",'+691': "FM",'+692': "MH",'+850': "KP",'+852': "HK",'+853': "MO",'+855': "KH",'+856': "LA",'+872': "PN",'+880': "BD",'+886': "TW",'+960': "MV",'+961': "LB",'+962': "JO",'+963': "SY",'+964': "IQ",'+965': "KW",'+966': "SA",'+967': "YE",'+968': "OM",'+970': "PS",'+971': "AE",'+972': "IL",'+973': "BH",'+974': "QA",'+975': "BT",'+976': "MN",'+977': "NP",'+992': "TJ",'+993': "TM",'+994': "AZ",'+995': "GE",'+996': "KG",'+998': "UZ",'+1268': "AG",'+1664': "MS",
				 
			 };
			
			if($('#phone').val().split('-').length>1){
				var phone_parts = $('#phone').val().split('-');
				$('#phone').val(phone_parts[1]);
				var countryToSet = (countries[phone_parts[0]]) ? countries[phone_parts[0]] : 'US';
				$("#phone").intlTelInput("setCountry", countryToSet);
			}
	}
	$scope.loadPickup = function(){
		
		$scope.booking.is_fav = 1;	
		$scope.booking.offset = '330';
					
					
		$scope.checkPhoneCountry();
		
			$scope.map = new google.maps.Map(document.getElementById('map'), {
				zoom:12,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: {lat: 40.715818, lng: -73.963976},
			 });
			
		var autocomplete = {};
		var autocompletesWraps = ['pickup', 'drop'];

		var test_form = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };
		var test2_form = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };

		
			$.each(autocompletesWraps, function(index, name) {
				
				if($('#'+name).length == 0) {
					return;
				}

				autocomplete[name] = new google.maps.places.Autocomplete($('#'+name+'.autocomplete')[0], 
				
				);
					
				google.maps.event.addListener(autocomplete[name], 'place_changed', function() {
				
					var place = autocomplete[name].getPlace();
					if(!place.geometry){
						alert('Something Went Wrong!!');
						return;
					}
					if(name == 'pickup'){
						
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						$scope.booking.current_latitude = latitude;
						$scope.booking.current_longitude = longitude;
						$scope.booking.pickup_location_address = place.formatted_address;
						
						$scope.booking.latitude = latitude;
						$scope.booking.longitude = longitude;
				$scope.getTimeZone(latitude,longitude);
						
					}
						
					if(name == 'drop'){
					
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						
						
						$scope.booking.manual_destination_latitude = latitude;
						$scope.booking.manual_destination_longitude = longitude;
						$scope.booking.manual_destination_address = place.formatted_address;
						
					}
					$scope.getDirections();
						
					
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
		if(($scope.booking.driver_id&&$scope.booking.car) || ($scope.notFav==1) ){
			$scope.timendate = 0;
			$scope.driverselect = 0;
			$scope.lastStep = 1;
		}else{
			alert('Please Select Driver');
		}
	}
	
	$scope.carTypes = {
		'NaN':{'className':'Standard Class','similar':'Honda Accord, Cadillac MKS and BMW 3 series or similar','max':4,'luggage':2},
		'QS':{'className':'Standard Class','similar':'Honda Accord, Cadillac MKS and BMW 3 series or similar','max':4,'luggage':2},
		'QLE':{'className':'Standard Class','similar':'Toyota Highlander, Toyota Seina, Chevrolet Suburban or similiar','max':6,'luggage':2},
		'WAV':{'className':'Standard Class','similar':'Toyota Highlander, Toyota Seina, Chevrolet Suburban or similiar','max':6,'luggage':2},
		'LUXE':{'className':'VIP Class','similar':'Mercedes-Benz S-Class, BMW 7 Series, Audi A8 or similar','max':4,'luggage':2},
		'GRANDE':{'className':'VIP Class','similar':'Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac Escalade or similar','max':6,'luggage':2},
		'ELITE':{'className':'Elite Class','similar':'Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac Escalade or similar','max':4,'luggage':2},
		'QXL':{'className':'QXL Class','similar':'Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac Escalade or similar','max':6,'luggage':10},
		
	}
	
	$scope.selectCarClassNext = function(){
		if($scope.booking.car_type){
			$scope.getDriversData($scope.booking.user_id);
		}else{
			alert("Please select a car first.");
		}
	}
	$scope.selectCarClass = function(type,fare,sche_fare){
		$scope.booking.car_type = type;
		$scope.booking.estimated_fare = fare;
		$scope.booking.estimated_fare_later = sche_fare;
		$scope.booking.car_selected = 1;
		$scope.selectCarClassNext();
	}
	$scope.slectNext = function(){
		
		 
		if($scope.booking.driver_id || ($scope.notFav==1) ){
			$('#add_to_account').modal('show');
		}else{
			alert("Please select a Driver.");
		}
	}
	$scope.slect = function(driver,notfav){
		$scope.booking.driver_id = driver;
		$scope.booking.driver_selected = 1;
		
		if(notfav){
			$scope.notFav = 1;
			$scope.booking.driver_id = '';
			$scope.booking.select_car_type = driver;
		}else{
			$scope.notFav = 0;
		
			$scope.booking.select_car_type = '';
		}
		
		$scope.slectNext();
	}
	
	$scope.validateDateTime = function(){
		var datedata = $scope.booking.date.split(', ');
			var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd = '0'+dd
		} 

		if(mm<10) {
			mm = '0'+mm
		} 

		dateToday =  yyyy + '-' + mm + '-' + dd;
		
		
		if(datedata[0] === dateToday){
			var d = new Date();
		  var h = d.getHours();
		  var m =d.getMinutes();
		 
			var sm,sh = h;
			if (m<=5){
				sm = 05;
			}else if (m<=10){
				sm = 10;
			}else if (m<=15){
				sm = 15;
			}else if (m<=20){
				sm = 20;
			}else if (m<=25){
				sm = 25;
			}else if (m<=30){
				sm = 30;
			}else if (m<=35){
				sm = 35;
			}else if (m<=40){
				sm = 40;
			}else if (m<=45){
				sm = 45;
			}else if (m<=50){
				sm = 50;
			}else if (m<=55){
				sm = 55;
			}else if (m<=59){
				sm = 00;				
				if(h!=23){			
					sh = sh+1;
				}else if(h == 23){
					sh = 0;
				}
			}
			
			if(h!=23){			
				sh = sh+1;
			}else if(h == 23){
				sh = 0;
			}
			
			
			sm = $scope.addZero(sm);
			sh = $scope.addZero(sh);
		
			var hour_difference = 	sh - parseInt($scope.booking.time_hour);
			var min_difference = 	sm - parseInt($scope.booking.time_minutes);
			
			if(hour_difference == 0){
				
				if(min_difference<=0){
				
				}else {
					return 0;
				}
				
			}else if(hour_difference >=1){
				console.log('ERROR : Time selected is in past');
				return 0;
			}else if(hour_difference <=1){
			
			}
			
		}else{
				var date1 = new Date(datedata[0]);
			var date2 = new Date(dateToday);
			var timeDiff = Math.abs(date2.getTime() - date1.getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
			if($scope.max_schedule_ride_days_count < diffDays){
				return 8;
			}
			
			return 1;
		}
		return 1;
	}

	
	$scope.getFareEstimate = function(){
		
		if(! $scope.booking.user_mobile){			
			alert("Please enter Mobile number");
			return;
		}else if(($('#pickup').val() != '') && !$scope.booking.current_latitude){
			$('#pickup').val('');
			alert("We couldn't locate your Pickup Location, Please select another.");
			return;
		}else if(!$scope.booking.current_latitude ){
			alert("Please enter Pickup Location.");
			return;
		}else if(($('#drop').val() != '') && !$scope.booking.manual_destination_latitude){
			$('#drop').val('');
			alert("We couldn't locate your Drop off Location, Please select another.");
			return;
		}else if(!$scope.booking.manual_destination_latitude){
			alert("Please enter Destination.");
			return;
		}
		
		
		else{
		
			localStorage.removeItem('book-ride-for');
			
			$scope.showLoader = 1;
			
			
			 $scope.promoCountryCode = $('#extPopTwo').val()+"-";
			 $scope.booking.countrycode = $('#extPopTwo').val()+"-";
			 
			 if($scope.booking.user_mobile.indexOf('+')>=0){
				
				$scope.booking.user_mobile =  $scope.booking.user_mobile.replace($('#extPopTwo').val()+"-",'');
				$scope.booking.user_mobile =  $scope.booking.user_mobile.replace($('#extPopTwo').val(),'');
				
			 }
		 $.post(MY_CONSTANT.urlC+ 'fare_estimate', {
						
						is_scheduled : 0,
						pickup_latitude : $scope.booking.current_latitude,
						pickup_longitude : $scope.booking.current_longitude,
						destination_latitude : $scope.booking.manual_destination_latitude,
						destination_longitude :$scope.booking.manual_destination_longitude,
						promo_code : $scope.booking.promo_code,
						web_access_token:  $cookieStore.get('web_access_token'),	
						car_type : $scope.booking.car,
						user_mobile :  $scope.promoCountryCode +$scope.booking.user_mobile,


					}) .then(function successCallback(data) {
					
								if (typeof(data) == 'string') data = JSON.parse(data);
									
								if (data.flag == 101) {
									$scope.showCredentialsAlert();
									
									setTimeout(function(){
										$scope.showLoader = 0;
										$scope.$apply();
									},1000);
									
									
								}else if (data.flag == 1316) {
									$rootScope.openToast('warning', data.error, '');
									$scope.NoUserScreen();	
									$scope.booking.user_id = data.user_id;
									$scope.showLoader = 0;
									$scope.$apply();
									
								}else if (data.flag == 1317) {
									
									$rootScope.openToast('warning', data.error, '');
									$scope.shoUserAddScreen();		
									$scope.addtoAccount();
									
									$scope.booking.user_id = data.user_id;
									$scope.showLoader = 0;
									$scope.$apply();
								}else if(data.error || data.flag==0){
									
									$scope.showLoader = 0;
									
									$rootScope.openToast('error',data.error || data.message,'')
									
									setTimeout(function(){
										$scope.showLoader = 0;
										$scope.$apply();
									},1000);
									return;
									
									
								}else{
									
									
									$scope.min_ride_request_distance = data.min_ride_request_distance;
									$scope.max_schedule_ride_days_count = data.max_schedule_ride_days_count;
									$scope.max_schedule_ride_request_distance = data.max_schedule_ride_request_distance*1609.344;
									$scope.max_ride_request_distance = data.max_ride_request_distance*1609.344;
									$scope.ride_estimate_distance = data.ride_estimate_distance;
									
									
									if($scope.ride_estimate_distance < $scope.min_ride_request_distance){
										$('#drop').val('');
										$rootScope.openToast('error', "Ride Distance too short, Please choose another Destination", '');
										setTimeout(function(){
											$scope.showLoader = 0;
											$scope.$apply();
										},0);
										
										
										return false;
										
									}else if($scope.ride_estimate_distance > $scope.max_ride_request_distance){
										$('#drop').val('');
										$rootScope.openToast('error', "Destination too far, Please choose another Destination", '');
										setTimeout(function(){
											$scope.showLoader = 0;
											$scope.$apply();
										},0);
										
										
										return false;
										
									}
									$scope.showCar();
									
									$scope.cars_option = [];
									
									 var carsData = data.estimated_fare;
								//	 $scope.later_car_options = data.estimated_fare_schedule;
									
									carsData.forEach(function(carInfo) {
				  
										var d = carInfo;
										var c = {};
										
										if($scope.carTypes[carInfo.car_name]){
											c = $scope.carTypes[carInfo.car_name];
											d.carClass = c.className;
											d.similar = c.similar;
											d.max = c.max;
											d.luggage = c.luggage;
											d.value_regular = parseFloat(d.value_regular);
										}
										$scope.cars_option.push(d);
									});	
									
									
									$scope.booking.user_id = data.user_id;
									$scope.booking.user_name = data.user_name;
									$scope.booking.ride_estimate_time = data.ride_estimate_time;
									$scope.booking.ride_estimate_distance = data.ride_estimate_distance;
									$scope.booking.toll = data.toll;
									$scope.booking.route = data.route;
									
									$scope.booking.route_image = 'https://maps.googleapis.com/maps/api/staticmap?&path='+$scope.booking.pickup_location_address+'|'+$scope.booking.manual_destination_address+'&size=600x600&style=feature:landscape|visibility:on&style=feature:poi|visibility:on&style=feature:transit|visibility:on&style=feature:road.highway|element:geometry|lightness:39&style=feature:road.local|element:geometry|gamma:1.45&style=feature:road|element:labels|gamma:1.22&style=feature:administrative|visibility:on&style=feature:administrative.locality|visibility:on&style=feature:landscape.natural|visibility:on&scale=2&markers=shadow:false|scale:2|icon:https://s3.ap-south-1.amazonaws.com/qudosemail/pickup1.png|'+$scope.booking.current_latitude+','+$scope.booking.current_longitude+'&markers=shadow:false|scale:2|icon:https://s3.ap-south-1.amazonaws.com/qudosemail/drop_off1.png|'+$scope.booking.manual_destination_latitude+','+$scope.booking.manual_destination_longitude+'&path=geodesic:true|weight:3|color:0x2dbae4ff|enc:kn{wFf`abMCECCCCCCACCECCCCCECCCCCCAA?A?????????@@@@@@@@@@BBB@@TA@NFJHJHJHJJHHLFLb@z@GICCEG@BBB@@@@??????????????@@@@@@@@@BBDDDDDDDBDBBBB@BAPCBCDEFGJGJGJKPILILGHEFAPBDDFHHJLJLJNLPLPNRLPLNJLHJFHDFBDBBBBBBBBDFBBNRJNLNNRLNJLHJFHDFBDBB@@@@@@BB@BBBDDFHHJLNLNLNLPNPLNLPLNLNLNLNJLJLJLJLHJHJHJFHFHFHFHFHHHHJHJHJHJFHDFDFDFBD@B@@?@???????@??????????????????????????@@???????????????????@@@@@@@??BDBOFKBGBEBEBEDEBEDGDIDGBE@A&key=AIzaSyADXfBi40lkKpklejdGIWNxdkqQCKz8aKI';
									
																		
									$scope.booking.route_directions = 'https://maps.googleapis.com/maps/api/staticmap?size=600x600&path=color:0x00000cd0|weight:5|enc:'+$scope.booking.polylines+'&markers=shadow:false|scale:2|color:green|label:A|'+$scope.booking.current_latitude+','+$scope.booking.current_longitude+'&markers=color:red|label:B|shadow:false|scale:2|'+$scope.booking.manual_destination_latitude+','+$scope.booking.manual_destination_longitude+'&key=AIzaSyADXfBi40lkKpklejdGIWNxdkqQCKz8aKI'
									
									$scope.booking.driver_selected = 0;
									$scope.booking.car_selected = 0;
								
									
									setTimeout(function(){
										$scope.showLoader = 0;
										$scope.$apply();
									},1000);
									$scope.booking.promo_code = '';
									if(data.promo_data.code){
										$scope.booking.promo_code = data.promo_data.code;
									}
									$scope.booking.promo_value = data.promo_data.value;
												
									$scope.$apply();
						
								}
								
								
								
					
					}).fail(function(){
						alert('Something went Wrong!');
						$scope.showLoader = 0;
						$scope.$apply();
					});
					
		}
	}
	
	
	$scope.closeandReBook = function(redirect){
		$scope.showLoader = 0;
		$('#no_User').modal('hide');	
		setTimeout(function(){
				window.location.reload();
		},1000);
	}
	$scope.closeNoUser = function(redirect){
		$scope.showLoader = 0;
		$('#no_User').modal('hide');	
		setTimeout(function(){
			window.open('/#/corporate/riderSignup', '_blank');
		},1000);
		
	}
	
	$scope.NoUserScreen = function(){
		$('#no_User').modal('show');
	}
	
	
	
	$scope.closeandCard = function(){
		$('#add_to_account').modal('hide');
		$('#show_cardError').modal('hide');
		$scope.closeCard();
		$scope.showLoader = 0;
		$('#show_PaymentError').modal('hide');
		$('.modal-backdrop.show').fadeOut();
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		setTimeout(function(){
			$state.go('corporate.listCards');
		},1000);
		
	}
	
	$scope.closePayment = function(redirect){
		$scope.showLoader = 0;
		$('#show_PaymentError').modal('hide');	
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		
	}
	
	$scope.showPaymentAlert = function(){
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		$('#show_PaymentError').modal('show');
		$scope.paymentAlert = 1;
	}
	$scope.paymentAlert = 1;
	
	$scope.closeCard = function(redirect){
		$scope.showLoader = 0;
		//$scope.booking.confirmNow = 0;	
		$('#show_cardError').modal('hide');		
		//$scope.cardAlert = 0;		
		if(redirect){
			 $('.modal-backdrop.show').remove();
			setTimeout(function(){
				$state.go('corporate.listCards');
			},1000);
		}
	}
	
	$scope.closeConfirm = function(){
		$('#show_confirmation').modal('hide');
		$('#add_to_account').modal('hide');
		$('#show_cardError').modal('hide');
		$('#request_right_now_1').modal('hide');
		$('#request_right_now').modal('hide');
		$('#request_ride_later').modal('hide');
		$scope.showLoader = 0;
		//$scope.booking.confirmNow = 0;
		
	
		setTimeout(function(){
			//window.location.reload();
			$state.go('corporate.liveTracking');
			
		},1000);
		
	}


	$scope.shoUserAddScreen = function(){
		$('#add_myUser').modal('show');
		
	}
	
	$scope.showCardAlert = function(){
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		$('#show_cardError').modal('show');
		
		$scope.cardAlert = 1;
	}
	
	$scope.cancelAndUnselect = function(){
		$scope.booking.driver_id  = ''
		$scope.booking.car_type  = 0
		
		$scope.booking.driver_selected = 0;
		$scope.booking.car_selected = 0;
		$scope.showCar();
	}
	$scope.showConfirm = function(){
		$('#show_confirmation').modal('show',{backdrop: 'static', keyboard: false});
		$scope.booking.confirmNow = 1;
	}
	
	
	
	$scope.cancelRightNow = function(){
		
	}
	
	
	$scope.BookRideRightNow = function(){
		
		
		$scope.booking.cardId = '';
		if($scope.booking.card_user_type == 1){
			$scope.booking.cardId = $scope.booking.cardIdCorporate;
		}else{
			$scope.booking.cardId = $scope.booking.cardIdUser;
		}
		var datedata = $scope.booking.date.split(', ');
			$scope.booking.time = datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes;
		
		if($scope.notFav){
			var params = {
					web_access_token:  $cookieStore.get('web_access_token'),				
						current_latitude:$scope.booking.current_latitude,
						current_longitude:$scope.booking.current_longitude,
						estimated_fare:$scope.booking.estimated_fare,
						ride_estimate_distance:$scope.booking.ride_estimate_distance,
						ride_estimate_time:$scope.booking.ride_estimate_time,
						pickup_location_address:$scope.booking.pickup_location_address,
						latitude:$scope.booking.latitude,
						longitude:$scope.booking.longitude,
					car_type:$scope.booking.car_type,
						is_favt:0,
					select_car_type:$scope.booking.select_car_type,
						manual_destination_latitude:$scope.booking.manual_destination_latitude,
						manual_destination_longitude:$scope.booking.manual_destination_longitude,
						manual_destination_address:$scope.booking.manual_destination_address,
						toll:$scope.booking.toll,
						route:'',
						promo_code:$scope.booking.promo_code,
						user_id:$scope.booking.user_id,
						offset:$scope.booking.offset,
						card_user_type:$scope.booking.card_user_type,
						card_id:$scope.booking.cardId,
						
					//promo_value:$scope.booking.promo_value,
				};
				
			
		}else{
			var params = {
						web_access_token:  $cookieStore.get('web_access_token'),				
						current_latitude:$scope.booking.current_latitude,
						current_longitude:$scope.booking.current_longitude,
						estimated_fare:$scope.booking.estimated_fare,
						ride_estimate_distance:$scope.booking.ride_estimate_distance,
						ride_estimate_time:$scope.booking.ride_estimate_time,
						pickup_location_address:$scope.booking.pickup_location_address,
						latitude:$scope.booking.latitude,
						longitude:$scope.booking.longitude,
					
					car_type:$scope.booking.car_type,					
						is_favt:$scope.booking.driver_id,
						manual_destination_latitude:$scope.booking.manual_destination_latitude,
						manual_destination_longitude:$scope.booking.manual_destination_longitude,
						manual_destination_address:$scope.booking.manual_destination_address,
						toll:$scope.booking.toll,
						route:'',
						promo_code:$scope.booking.promo_code,
						user_id:$scope.booking.user_id,
						offset:$scope.booking.offset,
						card_user_type:$scope.booking.card_user_type,
						card_id:$scope.booking.cardId,
					
					//promo_value:$scope.booking.promo_value,
					
				};
		}	
		
		if(!$scope.booking.card_user_type){
			params.otp = $scope.booking.cardOTP;
		}
		
		if(!$scope.booking.cardId){
			alert('Please select a valid card.');
			$('#request_right_now').modal('hide');			
			$scope.showLoader = 0;
			setTimeout(function(){$('#request_right_now').modal('hide');},300);
			return false;
		}else{
			
		}
		$('#request_right_now').modal('show');
		$.post(MY_CONSTANT.urlC + 'ride_payment_process', {
				web_access_token: $cookieStore.get("web_access_token"),			
				card_user_type: $scope.booking.card_user_type,
				mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
				user_id: $scope.booking.user_id			
			})
		.then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
		
			if (data.flag == 101) {
				$('#request_right_now').modal('hide');
				$scope.showCredentialsAlert();
			}
			if(data.error || data.flag==0){
				$('#request_right_now').modal('hide');
				$('#request_right_now_1').modal('hide');				
								
				$('#show_confirmation').modal('hide');
				$('#show_cardError').modal('hide');
				$scope.showLoader = 0;	
				$scope.$apply();
				$rootScope.openToast('error',data.error || data.message,'')
				  return;
			} else {
				
						
				 $.post(MY_CONSTANT.urlC+ 'request_ride', params) .then(function successCallback(data) {
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
							if (data.flag == 101) {
								$scope.showCredentialsAlert();						
								$scope.showLoader = 0;
								$scope.$apply();
							}else if (data.flag == 303) {
								$('#request_right_now').modal('hide');
								$scope.showCardAlert();						
								$scope.showLoader = 0;
								$scope.$apply();
							}else if(data.error && data.flag==213){
								$('#request_right_now').modal('hide');
								$('#request_right_now_1').modal('hide');				
								
								$('#show_confirmation').modal('hide');
								$('#show_cardError').modal('hide');
								$scope.showLoader = 0;	
								$scope.$apply();
								
								alert('Ride has been already booked for this User, Please choose another Rider.');
								return;
							}else if (data.error && data.flag == 906) {
								$scope.showLoader = 0;	
								$scope.showPaymentAlert();
								$scope.$apply();
							
							}else if(data.error || data.flag==0){
								
								$('#request_right_now').modal('hide');
								$('#request_right_now_1').modal('hide');				
								
								$scope.showLoader = 0;	
								$scope.$apply();
								$rootScope.openToast('error',data.error || data.message,'')
								
								  return;
							}else if(data.flag == 202){
								$rootScope.openToast('success', 'Ride Booked Successfully', '');
								$scope.showLoader = 0;	
								localStorage.setItem('defaultTab', 'reg');
								
								$('#add_to_account').modal('hide');
								$('#request_right_now').modal('hide');
								$('#request_right_now_1').modal('hide');				
								$('#request_ride_later').modal('hide');
								$('#payment_step').modal('hide');
								$('#showRiderCardError').modal('hide');
								$('#show_PaymentError').modal('hide');
								$('#show_confirmation').modal('hide');
								$('#show_cardError').modal('hide');
								$scope.showLoader = 0;
								localStorage.setItem('routeOff',data.session_id);
								setTimeout(function(){
									
									$state.go('corporate.liveTracking');
									
								},1000);
								
								$scope.$apply();								
							}
					}).fail(function(){
						alert('Something went Wrong, Please check your Internet!');
						$scope.showLoader = 0;
						$scope.$apply();
					});
					
			}
		})
		
	}
	
	
	
	$scope.validateLaterDateTime = function(){
		var datedata = $scope.booking.date.split(', ');
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd = '0'+dd
		} 

		if(mm<10) {
			mm = '0'+mm
		} 

		dateToday =  yyyy + '-' + mm + '-' + dd;
		
		
		if(datedata[0] === dateToday){
			var d = new Date();
		  var h = d.getHours();
		  var m =d.getMinutes();
		 
			var sm,sh = h;
			if (m<5){
				sm = 05;
			}else if (m<10){
				sm = 10;
			}else if (m<15){
				sm = 15;
			}else if (m<20){
				sm = 20;
			}else if (m<25){
				sm = 25;
			}else if (m<30){
				sm = 30;
			}else if (m<35){
				sm = 35;
			}else if (m<40){
				sm = 40;
			}else if (m<45){
				sm = 45;
			}else if (m<50){
				sm = 50;
			}else if (m<55){
				sm = 55;
			}else if (m<=59){
				sm = 00;				
				if(h!=23){			
					sh = sh+1;
				}else if(h == 23){
					sh = 0;
				}
			}
			
			if(h!=23){			
				sh = sh;
			}else if(h == 23){
				sh = 23;
			}
			
			
			sm = $scope.addZero(sm);
			sh = $scope.addZero(sh);
			
		
			var hour_difference = 	sh - parseInt($scope.booking.time_hour);
			var min_difference = 	sm - parseInt($scope.booking.time_minutes);
			
			if(hour_difference == 0){
				
				if(min_difference<=0){
				}else {
					
					return 0;
				}
				
			}else if(hour_difference >=1){
				return 0;
			}else if(hour_difference <=1){
			
			}
			
		}else{
			
		}
		return 1;
	}
	
	
	
	$scope.timeScheduler = function(){
		$scope.stepTimeSelector = 1;
		$scope.stepPaymentSelector = 1;
		
	}
	
	$scope.timeSelected = function(when){
		$scope.Cards = [];
		$scope.RiderCards = [];
		$scope.getCards();
		
		$scope.stepTimeSelector = 1;
		$scope.stepPaymentSelector = 1;
		$scope.corporateCards = 1;
		$scope.riderCards = 0;
		$scope.booking.cardSelected == 'corporate';
		$scope.booking.card_user_type = 1;
		$scope.booking.cardOTP = '9999';
		
		
		
		if(when=='now'){
			$scope.paymentForNow = 1;
			$scope.paymentForLater = 0;
			$scope.showPaymentStep();
			
		}else{
			$scope.paymentForNow = 0;
			$scope.paymentForLater = 1;
			if(!$scope.validateBookingData()){
				return false;
			}else{
				$scope.showPaymentStep();
			
			}
		}
	}
	
	
	$scope.showPaymentStep = function(){
		$('#payment_step').modal('show');
	}
	$scope.showCardList = function(){
		
	
		if($scope.booking.cardSelected == 'corporate'){
			$scope.booking.card_user_type = 1;
			$scope.corporateCards = 1;
			$scope.riderCards = 0;
		}else if($scope.booking.cardSelected == 'rider'){
			$scope.corporateCards = 0;
			$scope.riderCards = 1;
			$scope.booking.card_user_type = 0;
		
			
			if($scope.RiderCards.length == 0){
				$scope.showRiderCardError();
			}
			
			
		}
		
	}
	
	
	$scope.showRiderCardError = function(){
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		$('#show_PaymentError').modal('hide');
		$('#showRiderCardError').modal('show');
		
	}
	
	
	$scope.getCards = function(){
		
		$.post(MY_CONSTANT.urlC + 'list_payment_cards', {
				web_access_token: $cookieStore.get("web_access_token"),			
				user_id: $scope.booking.user_id			
			})
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
		
			if (data.flag == 101) {
				$scope.showCredentialsAlert();
			}
			if (data.flag == 807) {
				
				$scope.$apply();
			} else {
				
				$scope.totalCards= data.count;
				
				$scope.Cards = data.corporateCards;
				$scope.Cards.forEach(function(cardInfo) {
					if(cardInfo.default_card == 1){
						$scope.booking.cardIdCorporate = cardInfo.id;
					}
				});	
				
				
				$scope.RiderCards = data.userCards;
				
				$scope.RiderCards.forEach(function(card) {
					if(card.default_card == 1){
						$scope.booking.cardIdUser = card.id;
					}
				});	
				
				$scope.$apply();
				
			}
		});
		
		
	}
	
	$scope.paymentProcess = function(){
		
	
		
		
		$.post(MY_CONSTANT.urlC + 'ride_payment_process', {
				web_access_token: $cookieStore.get("web_access_token"),			
				card_user_type: $scope.booking.card_user_type,
				mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
				user_id: $scope.booking.user_id			
			})
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
		
			if (data.flag == 101) {
				$scope.showCredentialsAlert();
			}
			if(data.error || data.flag==0){
							
				alert(data.error || data.message);
				  return;
			} else {
			

				$scope.$apply();
				
			}
		});
		
		
	}
	
	
	$scope.validateBookingData = function(){
		if(!$scope.booking.date){
			alert("Please enter Date of travel");
			return 0;
		}else if(!$scope.booking.time_hour || ($scope.booking.time_hour == '')){
			alert("Please select Time.");
			return 0;
		}else if(!$scope.booking.time_minutes){
			alert("Please select Time minutes.");
			return 0;
		}else if($scope.validateDateTime()==0){
			alert("Please select minimum one hour from now.");
			return 0;
		}else if($scope.validateDateTime()==8){
			alert("You are allowed to book a scheduled ride for upto next 6 days only");
			return 0;
		}else{
			return 1;
		}
		
	}
	
	$scope.BookRideLater = function(){
		
		if(!$scope.validateBookingData()){
			return false;
		}
		
		$scope.showLoader = 1;
		var datedata = $scope.booking.date.split(', ');
	
		
		$scope.booking.time = datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes;
		
		$scope.booking.selectedTime = new Date($scope.booking.time);
		
		
		var timeInThatArea = new Date($scope.booking.time).toLocaleString("en-US", {timeZone: $scope.booking.timezone});
		$scope.booking.timeInThatArea = new Date(timeInThatArea);
		$scope.booking.timeInThatAreaLocale = new Date(timeInThatArea).toLocaleString();
		
		$scope.booking.cardId = '';
		
		if($scope.booking.card_user_type == 1){
			$scope.booking.cardId = $scope.booking.cardIdCorporate;
		}else{
			$scope.booking.cardId = $scope.booking.cardIdUser;
		}
		

		if($scope.notFav){
	
			var params = {
					web_access_token:  $cookieStore.get('web_access_token'),				
					current_latitude:$scope.booking.current_latitude,
					current_longitude:$scope.booking.current_longitude,
					estimated_fare:$scope.booking.estimated_fare_later,
					ride_estimate_distance:$scope.booking.ride_estimate_distance,
					ride_estimate_time:$scope.booking.ride_estimate_time,
					pickup_location_address:$scope.booking.pickup_location_address,
					latitude:$scope.booking.latitude,
					longitude:$scope.booking.longitude,
					pickup_time:$scope.booking.time,
				car_type:$scope.booking.car_type,
					driver_id:$scope.booking.driver_id,
					is_fav:0,
					manual_destination_latitude:$scope.booking.manual_destination_latitude,
					manual_destination_longitude:$scope.booking.manual_destination_longitude,
					manual_destination_address:$scope.booking.manual_destination_address,
					toll:$scope.booking.toll,
					route:'',
					promo_code:$scope.booking.promo_code,
					user_id:$scope.booking.user_id,
					offset:$scope.booking.offset,
					promo_value:$scope.booking.promo_value,
				select_car_type:$scope.booking.select_car_type,
					favdriver:0,
					card_user_type:$scope.booking.card_user_type,
					card_id:$scope.booking.cardId,
					
				};
		}else{
			var params = {
					web_access_token:  $cookieStore.get('web_access_token'),				
					current_latitude:$scope.booking.current_latitude,
					current_longitude:$scope.booking.current_longitude,
					estimated_fare:$scope.booking.estimated_fare_later,
					ride_estimate_distance:$scope.booking.ride_estimate_distance,
					ride_estimate_time:$scope.booking.ride_estimate_time,
					pickup_location_address:$scope.booking.pickup_location_address,
					latitude:$scope.booking.latitude,
					longitude:$scope.booking.longitude,
					pickup_time:$scope.booking.time,
				car_type:$scope.booking.car_type,
					driver_id:$scope.booking.driver_id,
					is_fav:$scope.booking.is_fav,
					manual_destination_latitude:$scope.booking.manual_destination_latitude,
					manual_destination_longitude:$scope.booking.manual_destination_longitude,
					manual_destination_address:$scope.booking.manual_destination_address,
					toll:$scope.booking.toll,
					route:'',
					promo_code:$scope.booking.promo_code,
					user_id:$scope.booking.user_id,
					offset:$scope.booking.offset,
					promo_value:$scope.booking.promo_value,
					card_user_type:$scope.booking.card_user_type,
					card_id:$scope.booking.cardId,
					
					
				};
		}	
		
		if(!$scope.booking.card_user_type){
			params.otp = $scope.booking.cardOTP;
		}
		if(!$scope.booking.cardId){
			$('#request_right_now').modal('hide');
			alert('Please select a valid card.');
			$scope.showLoader = 0;
			return false;
		}else{
		
		}
		
		
		$.post(MY_CONSTANT.urlC + 'ride_payment_process', {
				web_access_token: $cookieStore.get("web_access_token"),			
				card_user_type: $scope.booking.card_user_type,
				mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
				user_id: $scope.booking.user_id			
			})
		.then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
		
			if (data.flag == 101) {
				$scope.showCredentialsAlert();
			}
			if(data.error || data.flag==0){
				$rootScope.openToast('error',data.error || data.message,'')		
				
				  return;
			} else {
				
				
				 $.post(MY_CONSTANT.urlC+ 'schedule_request', params) .then(function successCallback(data) {
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
							if (data.flag == 101) {
								$scope.showCredentialsAlert();						
								$scope.showLoader = 0;
								$scope.$apply();
							}else if (data.flag == 303) {
								$scope.showCardAlert();						
								$scope.showLoader = 0;
								$scope.$apply();
							}else if(data.error || data.flag==0){
								
								$scope.showLoader = 0;	
								$scope.$apply();
								$('#request_ride_later').modal('hide');
								$rootScope.openToast('error',data.error || data.message,'')
							
								  return;
							}else if (data.flag == 906) {
								$scope.showLoader = 0;	
								$scope.showPaymentAlert();
								$scope.$apply();
								//alert(data.error || data.message);
							}else if(data.flag == 900){
								
								localStorage.setItem('defaultTab', 'sch');
								localStorage.setItem('routeOff',data.session_id);
								$scope.showLoader = 0;	
								$('#add_to_account').modal('hide');
								$('#request_ride_later').modal('hide');
								$('#payment_step').modal('hide');
								$('#showRiderCardError').modal('hide');
								$('#show_PaymentError').modal('hide');
									
								$scope.showConfirm();
								$rootScope.openToast('success', 'Booking Scheduled Successfully', '');
								setTimeout(function(){
									$scope.showLoader = 0;							
								},500);
								
								$scope.$apply();								
							}
					}).fail(function(){
						alert('Something went Wrong!');
						$scope.showLoader = 0;
						$scope.$apply();
					});
				


			}
		})
	 
	
	}
	
	$scope.getDriversData = function(user_id){
			
			
			var datedata = $scope.booking.date.split(', ');
		
			
			$scope.booking.time =datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes;
		
		
			$scope.booking.started = 1;
			$scope.booking.user_id = user_id;
			
			$scope.myQudosMode = 1;
			$scope.UserQudosMode = 0;
			$scope.AllQudosMode = 0;
		
			
			
			//$scope.booking.selectedTime = new Date($scope.booking.time);
			$scope.booking.selectedTime = new Date();
			
			
			//var timeInThatArea = new Date($scope.booking.time).toLocaleString("en-US", {timeZone: $scope.booking.timezone});
			var timeInThatArea = new Date().toLocaleString("en-US", {timeZone: $scope.booking.timezone});
			$scope.booking.timeInThatArea = new Date(timeInThatArea);
			$scope.booking.timeInThatAreaLocale = new Date(timeInThatArea).toLocaleString();
		
		
		
			
			if(user_id){
				
				 $.post(MY_CONSTANT.urlC+ 'get_ride_data', {
					web_access_token:  $cookieStore.get('web_access_token'),				
					user_id:user_id,
					region_id:24,
					car_type:$scope.booking.car_type,
					//select_car_type:$scope.booking.car_type,
					//favdriver:0
				}) .then(function successCallback(data) {
					
						if (typeof(data) == 'string') data = JSON.parse(data);
								
							if (data.flag == 1317) {
								$rootScope.openToast('warning', data.error, '');
								$scope.shoUserAddScreen();		
								$scope.addtoAccount();
								$scope.showLoader = 0;
								$scope.$apply();
							}else if(data.error || data.flag==0){
								
								$rootScope.openToast('error',data.error || data.message,'')
								  return;
							}else{
																	
								$scope.corporateFavDriver = data.corporateFavDriver;
								$scope.userFavDriver = data.userFavDriver;
								$scope.all_drivers = data.all_drivers;
								
								if($scope.userFavDriver.length == 0){								
									//$scope.myQudosMode = 0;
									//$scope.UserQudosMode = 1;	
									//$scope.AllQudosMode = 0;
								}
								$scope.showUser();
								$scope.$apply();
							
							}
			
				
			});
			
			
		}
		
		
	}
	
	$scope.switchMode = function(mode){
		if(mode == "m"){
			$scope.myQudosMode = 1;
			$scope.UserQudosMode = 0;
			$scope.AllQudosMode = 0;
		}else if(mode == "u"){
			$scope.myQudosMode = 0;
			$scope.UserQudosMode = 1;
			$scope.AllQudosMode = 0;
		}else{
			$scope.myQudosMode = 0;
			$scope.UserQudosMode = 0;
			$scope.AllQudosMode = 1;
		}
	}
	
	$scope.addtoAccount = function() {
		$scope.otpMode = 1;
		$scope.userToAdd = $scope.booking.user_id;
		$scope.userMobileToAdd = $scope.promoCountryCode +$scope.booking.user_mobile;
		$scope.otpToAdd = '';
		
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_send_otp', {
				web_access_token:  $cookieStore.get('web_access_token'),	
				mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
				email: $scope.booking.user_id,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
						
						$rootScope.openToast('error',data.error || data.message,'')
						// $('#add_myUser').modal('hide');
						  return;
					}else if(data.flag == 7){
						
						$rootScope.openToast('success', 'Please enter the OTP sent to User!', '');
						
						alert("This user is not yet added to your list, an OTP is sent to ("+$scope.userMobileToAdd+") and need to be entered below for the new ride request to proceed");
					}
				})
				
			})
		
	}
	
	$scope.reAddUser = function() {
		
		$scope.otpMode = 1;
		$scope.userToAdd = $scope.booking.user_id;
		$scope.otpToAdd = '';
		
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_resend_otp', {
				web_access_token:  $cookieStore.get('web_access_token'),	
				mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
						
						$rootScope.openToast('error',data.error || data.message,'')
						  return;
					}else if(data.flag == 7){
						$rootScope.openToast('success', 'OTP sent again!', '');
						
					}
				
			})
			
		})
	}
	
	$scope.completeUserAdd = function() {
		
		if ($scope.otpToAdd === '' || !$scope.otpToAdd) {
            // alert('Select Expiry Date');
            $rootScope.openToast('error', 'Please Enter OTP ', '');
            return false;
        }else if (!$scope.booking.user_id) {
           alert('Unknown User');
            return false;
        }else{
			 $.post(MY_CONSTANT.urlC+ 'corporate_add_user', {
				web_access_token:  $cookieStore.get('web_access_token'),				
				user_id:$scope.booking.user_id,
				role:0,
				otp:$scope.otpToAdd,
				mobile:$scope.userMobileToAdd
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
							
						if(data.error || data.flag==0){
							
							$rootScope.openToast('error',data.error || data.message,'')
							  return;
						}else{
							
							$rootScope.openToast('success', 'User successfully added', '');
						
							$('#add_myUser').modal('hide');
							  
							  
							//$scope.getDriversData($scope.booking.user_id);
							$scope.getFareEstimate();
							
							
						}
			
				});
				
			});
		}
		
		
	}
	
	
	
	
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
	$scope.stripeTokenHandler =  function(token) {
		
		  $.post(MY_CONSTANT.urlC + 'add_credit_card', {
				web_access_token: $cookieStore.get("web_access_token"),
				nounce:token.id,
				card_type:52
			})
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			
			if (data.error) {
				$rootScope.openToast('error',data.error,'')
				return;
			} else {				
				$rootScope.openToast('success', 'Card Added Successfully', '');
				
				$('#add_card').modal('hide');
				//$scope.initTable();
			}
			
		});
		
	}
	
	$scope.loadPickup();
	$scope.showDirection(1);
	$scope.initCard();
	
	
    $scope.showTab = function(div){
		$scope.currentTab = div;
	}
	
	
   
    $scope.openAddUser = function(){
		
		window.open('/#/corporate/riderSignup', '_blank');
	};
	
    $scope.viewDetails = function(modalIndex){
        var tripDetails = $scope.myTrips[modalIndex];
      
        localStorage.setItem('userTripDetails', JSON.stringify(tripDetails));
        $state.go("driver.rideDetails");
    };
	

    $scope.rotateImage = function(id){
       
        if($('.table:nth-child('+id+') .displayArrow').hasClass('.collapse_dark_arrow')){
            $('.table:nth-child('+id+') .displayArrow').removeClass('.collapse_dark_arrow')
        }else {
            $('.table:nth-child('+id+') .displayArrow').addClass('.collapse_dark_arrow');
        }
    }
});

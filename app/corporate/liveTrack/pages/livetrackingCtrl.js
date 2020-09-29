App.controller('livetrackingCtrl', function ($rootScope, $scope, $http,$timeout, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog,$filter, socketFactory, $window, $interval,$sce) {
	

	var stop = 0;
	var mobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	var tablet=/iPad/i.test(navigator.userAgent);

	$scope.buttonNowClicked = 0;
	$scope.buttonLaterClicked = 0;
	
	$rootScope.ridePage = 1;
	$scope.tabletScreen = 0;
	if(mobile || tablet){
		$scope.tabletScreen = 1;
		$scope.classExpand = 1;
		//$rootScope.ridePage = 0;
	}
	
	$scope.booking = {};
	$scope.settings = {};

	$scope.essential = 1;
	$scope.dash = 'enabled';


	$('.terms').click(function(){
		if($(this).is(":checked")){
			$scope.essential = 0
			$scope.dash = 'disabled';

		}
		else {
			$scope.essential  = 1
			$scope.dash = 'enabled';
          
		}
});
	$('.terms1').click(function(){
		if($(this).is(":checked")){
			$scope.essential = 0
			$scope.dash = 'disabled';

		}
		else {
			$scope.essential  = 1
			$scope.dash = 'enabled';
          
		}
});
    


	// var ride_detail = [$scope.booking.user_name,booking.user_name,booking.user_name,booking.user_name,booking.user_name,booking.user_name]

  
		// localStorage.setItem('ride_detail', JSON.stringify(ride_detail));		
	
	$scope.settings.RiderCardEnabled = true;
	$scope.settings.CorpCardEnabled = true;
	
	if(($scope.settings.RiderCardEnabled == true) && ($scope.settings.CorpCardEnabled == true)){
		$scope.settings.bothEnabled = true;
	}else{
		$scope.settings.bothEnabled = false;
	}
	
	
	 $('html, body').animate({scrollTop:0}, 'slow');
	
	
	
	$scope.defaultZoom = 13;
	$scope.driverZoom = 16;
	
	$scope.showLoader = 0;
	$scope.cars_option = [];
	$scope.notFav = 0;
	
	// $scope.booking.user_name = localStorage.setItem('user_name', JSON.stringify(user_name));
	// $scope.booking.user_mobile = localStorage.setItem('user_mobile', JSON.stringify(user_mobile));
	// $scope.booking.pickup_text = localStorage.setItem('pickup_text', JSON.stringify(pickup_text));
	// $scope.booking.drop_text = localStorage.setItem('drop_text', JSON.stringify(drop_text));
	// $scope.booking.car_type = localStorage.setItem('car_type', JSON.stringify(car_type));

	$scope.booking.user_mobile = localStorage.getItem('book-ride-for');
	$scope.booking.proceed = 0;
	
	$scope.searchFlag = 0;
	$scope.searchString = '';
	
	$scope.dsearchFlag = 0;
	$scope.dsearchString = '';
	
	
	
	$scope.requestPending = 0;
	
	$scope.skip = 0;
	$scope.currentPage = 1;
	$scope.routeState = {};
	$scope.routeState.id = null;


	$scope.carsOptions = [
		{'car_type':1,'car_name':'QS 4max','car_select':'QS Select','car_text':'max 4 seats'},
		{'car_type':2,'car_name':'QLE 6max','car_select':'QLE Select','car_text':'max 4 seats'},		
		{'car_type':3,'car_name':'LUXE 4max','car_select':'LUXE Select','car_text':'max 4 seats'},
		{'car_type':4,'car_name':'GRANDE 7max','car_select':'GRANDE Select','car_text':'max 4 seats'},
		{'car_type':5,'car_name':'WAV 4max','car_select':'WAV Select','car_text':'max 4 seats'},
		{'car_type':7,'car_name':'QXL 8max','car_select':'QXL Select','car_text':'max 4 seats'},
		{'car_type':6,'car_name':'ELITE 3max','car_select':'ELITE Select','car_text':'max 4 seats'},
		
	];

	$scope.selectCarType = function() {

		$scope.booking.select_car_type = $scope.booking.car_type;
		
	
		$scope.booking.car_type = $scope.booking.car_type;
	
		$scope.booking.estimated_fare = $scope.carsOptions[$scope.booking.car_type-1].value_regular;
		$scope.booking.estimated_fare_later = $scope.carsOptions[$scope.booking.car_type-1].value_scheduled;
		
		
		$scope.booking.car_selected = 1;
		
		if($scope.booking.autoHitApi === 0){
		
			if($scope.carsOptions[$scope.booking.car_type-1].value_regular){
				$scope.selectCarClassNext();
			}
		}	
	}
	
	
	$scope.sorterFunc = function(car){
		return parseFloat(car.value_regular);
	};
	
	
	$scope.addZero = function(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	
	
	$scope.getPaymentMode =  function(){
		
		$.post(MY_CONSTANT.urlC + 'list_card_payment_option',{
			web_access_token : $cookieStore.get("web_access_token"),
			
		})
		.then(function successCallback(data, status) {
			$rootScope.$apply(function () { 
					if (typeof(data) == 'string')
						data = JSON.parse(data);
					else data = data;
					
					if (data.flag == 101) {
						$scope.showCredentialsAlert();
					}
					
					
					
					if(data.payment_type[0].card_used == true){
						$scope.settings.CorpCardEnabled = true;
						$scope.settings.RiderCardEnabled = true;
						$scope.settings.bothEnabled = true;
					}else if(data.payment_type[0].card_used == 2){
						$scope.settings.CorpCardEnabled = true;
						$scope.settings.RiderCardEnabled = false;
						$scope.settings.bothEnabled = false;
					}else if(data.payment_type[0].card_used == 3){
						$scope.settings.CorpCardEnabled = false;
						$scope.settings.RiderCardEnabled = true;
						$scope.settings.bothEnabled = false;
					}
					if(($scope.settings.RiderCardEnabled == true) && ($scope.settings.CorpCardEnabled == true)){
						$scope.settings.bothEnabled = true;
					}else{
						$scope.settings.bothEnabled = false;
					}
					
					$scope.CorpCard = $scope.settings.CorpCardEnabled;
					$scope.RiderCard = $scope.settings.RiderCardEnabled;
					
			});
		});
		
	}
	
	$scope.getPaymentMode();
	
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

	// $scope.tripDetailMode = true;
	// $scope.newRideMode = false;
	// $scope.returnRideMode = false;
	  
	  
	
	  
	$scope.newRideModeSelect = function(){
		$scope.qudos_essential = 1;
		$scope.dash = 'enabled'

		if($scope.tabletScreen){
			$scope.classExpand = 1;
		}
		$scope.booking.user_name = '';
		$scope.booking.user_mobile = '';
		$scope.booking.current_latitude = '';
		$scope.booking.manual_destination_latitude ='';
		$scope.booking.started = 1;
		$scope.booking.car_type = 1;
		$scope.booking.returnRide = 0;
		$scope.booking.select_car_type = $scope.booking.car_type;
		$scope.booking.select_car_type = '1';
		
		
		$scope.tripDetailMode = false;
		$scope.newRideMode = true;
		$scope.returnRideMode = false;
		
	}
	
	/*if(localStorage.getItem('justLogin') == 1){

		
		localStorage.removeItem('justLogin')
	}*/
	$scope.newRideModeSelect();
	
	
	$scope.cancelReturn = function(){
		$scope.tripDetailMode = true;
		$scope.newRideMode = false;
		$scope.returnRideMode = false;
	}
	$scope.showReturn = function(){
	
		$scope.tripDetailMode = false;
		$scope.newRideMode = false;
		$scope.returnRideMode = true;
		setTimeout(function(){
			$scope.loadPickup();
		},500);
	}
	$scope.showTripDetail = function(){
		$scope.tripDetailMode = true;
		$scope.newRideMode = false;
		$scope.returnRideMode = false;
	}
	
	
	$scope.MapShow = true;
	$scope.CarShow = false;
	$scope.UserShow = false;
	
	$scope.driverLimit = 200;
	
	
	$scope.showDirection = function(force){
		$scope.DirectionShow = 1
		$scope.MapShow = 1
		$scope.CarShow = 0
		$scope.UserShow = 0
		
		if(force == 1){
			$scope.force = 1;
		}else{
			$scope.force = 0;
		}
		
	}
	
	$scope.showCar = function(){
		
		$scope.MapShow = 0
		$scope.CarShow = 1
		$scope.UserShow = 0
	}
	
	$scope.showUser = function(){
		$scope.force = 0;
		$scope.DirectionShow = 0
		$scope.MapShow = 0
		$scope.CarShow = 0
		$scope.UserShow = 1
	}
	
	
	$scope.reTryRide = function(CurrentRide){
		$scope.qudos_essential = 1;
		$scope.dash = 'enabled'; 
		var datedata = $scope.booking.date.split(', ');
		
		$scope.booking.time =datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes+':00';
	
		
		
		$scope.booking.started = 1;
		$scope.booking.returnRide = 1;
		$scope.booking.retryRide = 1;
		$scope.booking.user_id = CurrentRide.user_id;
		$scope.booking.user_mobile = CurrentRide.user_mobile;
		$scope.booking.user_name = CurrentRide.user_name;
		$scope.booking.offset = CurrentRide.offset;
		$scope.booking.car_type = CurrentRide.car_type;
		
		//$scope.booking.driver_id = CurrentRide.driver_id;
		$scope.booking.toll = '';
		
		if(!$scope.booking.promo_code){
			$scope.booking.promo_code = '';
			$scope.booking.promo_value = '';
		}
		
		$scope.booking.ride_estimate_distance = '';
		$scope.booking.ride_estimate_time = '';
		
		
		$scope.booking.manual_destination_latitude =  CurrentRide.manual_destination_latitude;
		$scope.booking.manual_destination_longitude =  CurrentRide.manual_destination_longitude;
		
		
		$scope.booking.drop_text_return  = CurrentRide.manual_destination_address;
		$scope.booking.pickup_text_return =  CurrentRide.pickup_location_address;
		
		$scope.booking.pickup_location_address  = CurrentRide.pickup_location_address;
		$scope.booking.manual_destination_address =  CurrentRide.manual_destination_address;
	
		$scope.booking.latitude =  CurrentRide.pickup_latitude;
		$scope.booking.longitude =  CurrentRide.pickup_longitude;
		
		$scope.booking.current_latitude = CurrentRide.pickup_latitude;
		$scope.booking.current_longitude = CurrentRide.pickup_longitude;
		
		$scope.notFav = 1;
		$scope.booking.driver_id = '';
		$scope.booking.select_car_type = CurrentRide.car_type;
		$scope.booking.driver_selected = 1;
		
		$scope.getDirectionsForBooking();
		
	}
	
	$scope.returnscheduleRide = function(CurrentRide){
		
		
		var datedata = $scope.booking.date.split(', ');
		
		$scope.booking.time =datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes+':00';
	
	
		$scope.booking.started = 1;
		$scope.booking.returnRide = 1;
		$scope.booking.user_id = CurrentRide.user_id;
		$scope.booking.user_mobile = CurrentRide.user_mobile;
		$scope.booking.user_name = CurrentRide.user_name;
		$scope.booking.offset = CurrentRide.offset;
		$scope.booking.car_type = CurrentRide.car_type;
		
		//$scope.booking.driver_id = CurrentRide.driver_id;
		$scope.booking.toll = '';
		$scope.booking.promo_code = '';
		$scope.booking.promo_value = '';
		$scope.booking.ride_estimate_distance = '';
		$scope.booking.ride_estimate_time = '';
		
		
		$scope.booking.manual_destination_latitude =  CurrentRide.pickup_latitude;
		$scope.booking.manual_destination_longitude =  CurrentRide.pickup_longitude;
		
		
		$scope.booking.drop_text_return  = CurrentRide.pickup_location_address;
		$scope.booking.pickup_text_return =  CurrentRide.manual_destination_address;
		
		$scope.booking.pickup_location_address  = CurrentRide.manual_destination_address;
		$scope.booking.manual_destination_address =  CurrentRide.pickup_location_address;
		$scope.booking.latitude =  CurrentRide.manual_destination_latitude;
		$scope.booking.longitude =  CurrentRide.manual_destination_longitude;
		$scope.booking.current_latitude = CurrentRide.manual_destination_latitude;
		$scope.booking.current_longitude = CurrentRide.manual_destination_longitude;
		
		$scope.notFav = 1;
		$scope.booking.driver_id = '';
		$scope.booking.select_car_type = 1;
		$scope.booking.driver_selected = 1;
		$scope.getDirectionsForBooking();
	}
	
	$scope.swapLocationforReturn = function(){
		
		
		var pickup_address, pickup_text, pickup_lat, pickup_long, drop_address, drop_text, drop_lat, drop_long;
		
		
		pickup_address = $scope.booking.pickup_location_address;
		pickup_text = $scope.booking.pickup_text_return;
		
		drop_address = $scope.booking.manual_destination_address;
		drop_text = $scope.booking.drop_text_return;
		
		pickup_lat = $scope.booking.latitude;
		pickup_long = $scope.booking.longitude;
		
		drop_lat = $scope.booking.manual_destination_latitude;
		drop_long = $scope.booking.manual_destination_longitude;
		
		
		
		$scope.booking.pickup_location_address  = drop_address;
		$scope.booking.manual_destination_address =  pickup_address;
		
		//$scope.booking.pickup_text_return =  drop_text;
		//$scope.booking.drop_text_return  = pickup_text;
	
		
		$('#return-pickup').val(drop_address);
		$('#return-drop').val(pickup_address);
		
		$scope.booking.manual_destination_latitude =  pickup_lat;
		$scope.booking.manual_destination_longitude =  pickup_long;
		
		
		$scope.booking.latitude =  drop_lat;
		$scope.booking.longitude =  drop_long;
		
		$scope.booking.current_latitude = drop_lat;
		$scope.booking.current_longitude = drop_long;
		
	
		
		$scope.getDirectionsForBooking();
		
	}
	
	$scope.swapLocation = function(){
		
		
		var pickup_address, pickup_text, pickup_lat, pickup_long, drop_address, drop_text, drop_lat, drop_long;
		
		
		pickup_address = $scope.booking.pickup_location_address;
		pickup_text = $scope.booking.pickup_text;
		
		drop_address = $scope.booking.manual_destination_address;
		drop_text = $scope.booking.drop_text;
		
		pickup_lat = $scope.booking.latitude;
		pickup_long = $scope.booking.longitude;
		
		drop_lat = $scope.booking.manual_destination_latitude;
		drop_long = $scope.booking.manual_destination_longitude;
		
		
		
		$scope.booking.pickup_location_address  = drop_address;
		$scope.booking.manual_destination_address =  pickup_address;
		
	
		$('#pickup').val(drop_address);
		$('#drop').val(pickup_address);
		
		$scope.booking.manual_destination_latitude =  pickup_lat;
		$scope.booking.manual_destination_longitude =  pickup_long;
		
		
		$scope.booking.latitude =  drop_lat;
		$scope.booking.longitude =  drop_long;
		
		$scope.booking.current_latitude = drop_lat;
		$scope.booking.current_longitude = drop_long;
		
		
		$scope.getDirectionsForBooking();
		
	}
	
	
	$scope.closeAutocomplete = 1;
	$scope.selectThisUser = function(id,num,name){
		$scope.booking.user_name = name;
		$scope.booking.user_mobile = num;
		$scope.booking.user_id = id;
		
		setTimeout(function(){			
			$scope.checkPhoneCountry();
		},200);
		$scope.closeAutocomplete = 1;
	}
	$scope.closeAC = function(){		
		setTimeout(function(){
			$scope.closeAutocomplete = 1;
			$scope.$apply();
		},250);
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
					
					$scope.Users = data.users;
					$('.modal-backdrop.show').fadeOut();
					$scope.$apply();
                }
               
            });
	}
	
	$scope.checkName = function(){
		$scope.booking.proceed = 0;
		if($scope.booking.user_mobile.length >9){
			if($scope.Users){
				$scope.Users.forEach(function(user) {
					if(user.user_mobile.indexOf($scope.booking.user_mobile)>=0){
					
						$scope.booking.user_name = user.user_name;
						return false;
					}else{
					
					}
				});
			}else{
				setTimeout(function(){
					$scope.checkName();
				},400);
			}
		
		}
	}
	
	$scope.selectCarClassNext = function(){
		if($scope.booking.car_type){
			$scope.forceShowDriver = 1;
			$scope.getDriversData();
		}else{
			alert("Please select a car first.");
		}
	}
	$scope.selectCarClass = function(type,fare,sche_fare){
	
		$scope.booking.car_type = type;
		
		$scope.booking.estimated_fare = fare;
		//$scope.booking.estimated_fare_later = $scope.later_car_options[type-1].value;
		$scope.booking.estimated_fare_later = sche_fare;
		$scope.booking.car_selected = 1;
		$scope.selectCarClassNext();
	}
	
	$scope.carSelectorMode = function(){
		
		if($scope.checkInputValid()){
			
			$scope.booking.autoHitApi = 0;
			$scope.booking.carSelected = 1;
			
			$scope.hitCheckMobile(1);
			$scope.forceShowDriver = 0;
			/*$scope.getFareEstimate();
		
			$scope.MapShow = false;
			$scope.CarShow = true;
			$scope.UserShow = false;*/
		}
		
	}
	$scope.DriverSelectorMode = function(){
		
		if($scope.checkInputValid()){
			
			$scope.booking.autoHitApi = 0;
			$scope.booking.carSelected = 0;
			
			$scope.hitCheckMobile(2);
			
			
			/*$scope.getFareEstimate();
			$('#loading').modal('show');
			
			$scope.MapShow = false;
			$scope.CarShow = false;
			$scope.UserShow = true;*/
		}
	}
	

	$scope.getDataAndshowPopup = function(){
	      $scope.DisableSRR = true;
		
           
		$scope.checkPhoneCountry();
	
		if($scope.checkInputValid()){
			
			$scope.hitCheckMobile(0);
			$scope.booking.autoHitApi = 1
			
			$timeout(function(){
				$scope.DisableSRR = false;

			},2000)
			/*$('#loading').modal('show');
			$scope.getFareEstimate();*/
		}
	}
	
	
	$scope.checkPhoneCountry = function(){
			 var countries = {
				 '+1':'US','+91':'IN','+7': "RU",'+20': "EG",'+27': "ZA",'+30': "GR",'+31': "NL",'+32': "BE",'+33': "FR",'+34': "ES",'+36': "HU",'+39': "IT",'+40': "RO",'+41': "CH",'+43': "AT",'+44': "GB",'+45': "DK",'+46': "SE",'+47': "SJ",'+48': "PL",'+49': "DE",'+51': "PE",'+52': "MX",'+53': "CU",'+54': "AR",'+55': "BR",'+56': "CL",'+57': "CO",'+58': "VE",'+60': "MY",'+61': "CC",'+62': "ID",'+63': "PH",'+64': "NZ",'+65': "SG",'+66': "TH",'+81': "JP",'+82': "KR",'+84': "VN",'+86': "CN",'+90': "TR",'+91': "IN",'+92': "PK",'+93': "AF",'+94': "LK",'+95': "MM",'+98': "IR",'+212': "MA",'+213': "DZ",'+216': "TN",'+218': "LY",'+220': "GM",'+221': "SN",'+222': "MR",'+223': "ML",'+224': "GN",'+225': "CI",'+226': "BF",'+227': "NE",'+228': "TG",'+229': "BJ",'+230': "MU",'+231': "LR",'+232': "SL",'+233': "GH",'+234': "NG",'+235': "TD",'+236': "CF",'+237': "CM",'+238': "CV",'+239': "ST",'+240': "GQ",'+241': "GA",'+242': "CG",'+243': "CD",'+244': "AO",'+245': "GW",'+246': "IO",'+248': "SC",'+249': "SD",'+250': "RW",'+251': "ET",'+252': "SO",'+253': "DJ",'+254': "KE",'+255': "TZ",'+256': "UG",'+257': "BI",'+258': "MZ",'+260': "ZM",'+261': "MG",'+262': "RE",'+263': "ZW",'+264': "NA",'+265': "MW",'+266': "LS",'+267': "BW",'+268': "SZ",'+269': "KM",'+290': "SH",'+291': "ER",'+297': "AW",'+298': "FO",'+299': "GL",'+350': "GI",'+351': "PT",'+352': "LU",'+353': "IE",'+354': "IS",'+355': "AL",'+356': "MT",'+357': "CY",'+358': "AX",'+359': "BG",'+370': "LT",'+371': "LV",'+372': "EE",'+373': "MD",'+374': "AM",'+375': "BY",'+376': "AD",'+377': "MC",'+378': "SM",'+379': "VA",'+380': "UA",'+381': "RS",'+382': "ME",'+385': "HR",'+386': "SI",'+387': "BA",'+389': "MK",'+420': "CZ",'+421': "SK",'+423': "LI",'+500': "GS",'+501': "BZ",'+502': "GT",'+503': "SV",'+504': "HN",'+505': "NI",'+506': "CR",'+507': "PA",'+508': "PM",'+509': "HT",'+590': "MF",'+591': "BO",'+593': "EC",'+594': "GF",'+595': "PY",'+596': "MQ",'+597': "SR",'+598': "UY",'+599': "AN",'+670': "TL",'+672': "NF",'+673': "BN",'+674': "NR",'+675': "PG",'+676': "TO",'+677': "SB",'+678': "VU",'+679': "FJ",'+680': "PW",'+681': "WF",'+682': "CK",'+683': "NU",'+685': "WS",'+686': "KI",'+687': "NC",'+688': "TV",'+689': "PF",'+690': "TK",'+691': "FM",'+692': "MH",'+850': "KP",'+852': "HK",'+853': "MO",'+855': "KH",'+856': "LA",'+872': "PN",'+880': "BD",'+886': "TW",'+960': "MV",'+961': "LB",'+962': "JO",'+963': "SY",'+964': "IQ",'+965': "KW",'+966': "SA",'+967': "YE",'+968': "OM",'+970': "PS",'+971': "AE",'+972': "IL",'+973': "BH",'+974': "QA",'+975': "BT",'+976': "MN",'+977': "NP",'+992': "TJ",'+993': "TM",'+994': "AZ",'+995': "GE",'+996': "KG",'+998': "UZ",'+1268': "AG",'+1664': "MS",
				 
			 };
			if($('#phone').length){
				if($('#phone').val().split('-').length>1){
					var phone_parts = $('#phone').val().split('-');
					$('#phone').val(phone_parts[1]);
					var countryToSet = (countries[phone_parts[0]]) ? countries[phone_parts[0]] : 'US';
					$("#phone").intlTelInput("setCountry", countryToSet);
					$scope.DisableSRR = false;
					setTimeout(function(){
						$scope.checkName();
					},500);
					
				}
				
			}
			
	}
	
	$scope.loadPickup = function(){
		 $('html, body').animate({scrollTop:0}, 'slow');
		$scope.booking.is_fav = 1;	
		$scope.booking.offset = '330';
		$scope.booking.offset = new Date().getTimezoneOffset()*-1;
					
		$scope.checkPhoneCountry();			
		
			/*$scope.map = new google.maps.Map(document.getElementById('map'), {
				zoom:12,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: {lat: 40.715818, lng: -73.963976},
			 });*/
			
		var autocomplete = {};
		var autocompletesWraps = ['pickup', 'drop','return-pickup', 'return-drop'];

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
						alert('Address incomplete or invalid, Please select from the suggested locations!!');
						return;
					}
					if(name == 'pickup' || name == 'return-pickup'){
						
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						$scope.booking.current_latitude = latitude;
						$scope.booking.current_longitude = longitude;
					
						
						$scope.booking.pickup_location_address = place.formatted_address;
						
						$scope.booking.latitude = latitude;
						$scope.booking.longitude = longitude;
				
					}
						
					if(name == 'drop' || name == 'return-drop'){
					
						var latitude = place.geometry.location.lat();
						var longitude = place.geometry.location.lng();
						
						
						$scope.booking.manual_destination_latitude = latitude;
						$scope.booking.manual_destination_longitude = longitude;
						
						$scope.booking.manual_destination_address = place.formatted_address;
						
					}
					$scope.getDirectionsForBooking();
						
					
				});
			});
		
		
	}
	
	$scope.getNewUsers();
	
	setTimeout(function(){
		$scope.loadPickup();
	},500);
		
		
		
		
	$scope.hitCheckMobile = function(clicked) {
		$scope.booking.promo_code = undefined;
		$scope.sortPhoneNumber();
		$('#loading').modal('show');
		
		if($scope.booking.proceed ==  1){
			
			$scope.getFareEstimate();
			if(clicked == 1){
				$scope.MapShow = false;
				$scope.CarShow = true;
				$scope.UserShow = false;
			}else if(clicked == 2){
				$scope.MapShow = false;
				$scope.CarShow = false;
				$scope.UserShow = true;
			}
			return false;
		}

	

		$.post(MY_CONSTANT.urlC+ 'check_mobile',{
		   user_mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
		   user_name:  $scope.booking.user_name,
		   web_access_token:  $cookieStore.get('web_access_token'),
		}) 
		.then(function successCallback(data) {
			$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
				if(data.flag==1316){
					//$rootScope.openToast('warning', data.error, '');
					if(! $scope.booking.user_name){			
						alert("Please enter User Name.");
						return 0;
					}

					$scope.UserNotFoundScreen();		
				}else if (data.flag == 1317) {
									
					//$rootScope.openToast('warning', data.error, '');
					$scope.booking.user_id = data.user_id;
					$scope.shoUserAddScreen();	
					
					$scope.addtoAccount();
				
				}else if (data.error) {
				 
				   $rootScope.openToast('error', data.error, '')
				   return 0;
				}else{
					
					$scope.getFareEstimate();
					$('#loading').modal('hide');
				}
				setTimeout(function(){
					if(clicked == 1){
						$scope.MapShow = false;
						$scope.CarShow = true;
						$scope.UserShow = false;
					}else if(clicked == 2){
						$scope.MapShow = false;
						$scope.CarShow = false;
						$scope.UserShow = true;
					}
				},500);
			});
		});

		
	}
	
	$scope.createUser = function() {
		
		
		if($scope.booking.proceed ==  1){
			
			$scope.getFareEstimate();
			return false;
		}else{
			
		}
		
		$.post(MY_CONSTANT.urlC+ 'new_user_register',{
		   user_mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
		   user_name:  $scope.booking.user_name,
		   web_access_token:  $cookieStore.get('web_access_token'),
		}) 
		.then(function successCallback(data) {
			$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
				if (data.error) {
				   
				   $rootScope.openToast('error',data.error,'');
				   $('#no_User').modal('hide');
				   return 0;
				}else{
					$('#no_User').modal('hide');
				
					$scope.booking.user_id = data.user_id;
					$scope.shoUserAddScreen();		
					$scope.addtoAccount();
				}
				   
			});
		});

		
	}
	$scope.createUserandProceed = function() {
		
		if($scope.booking.proceed ==  1){
		
			$scope.getFareEstimate();
			return false;
		}
		$.post(MY_CONSTANT.urlC+ 'new_user_register',{
		   user_mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
		   user_name:  $scope.booking.user_name,
		   web_access_token:  $cookieStore.get('web_access_token'),
		}) 
		.then(function successCallback(data) {
			$rootScope.$apply(function () { 
				if (typeof(data) == 'string') data = JSON.parse(data);
				if (data.error) {
				  $rootScope.openToast('error',data.error,'');
				   $('#no_User').modal('hide');
				   return 0;
				}else{
					$('#no_User').modal('hide');
					
					$scope.booking.proceed = 1;
					
					$scope.booking.user_id = data.user_id;
					$scope.getFareEstimate();
				}
				   
			});
		});

		
	}
	
	
	$scope.checkInputValid = function(){
	
		if(! $scope.booking.user_mobile){			
			alert("Please enter Mobile number");
			$scope.DisableSRR = false;
			return 0;
		} else if(!/^[1-9]{1}[0-9]{9}$/.test($('#phone').val())){
			alert('Please enter valid Mobile Number');
			$scope.DisableSRR = false;

			return 0;
		}else if(($('#pickup').val() != '') && !$scope.booking.current_latitude){
			$('#pickup').val('');
			alert("We couldn't locate your Pickup Location, Please select another.");
			$scope.DisableSRR = false;

			return 0 ;
		}else if(!$scope.booking.current_latitude ){
			alert("Please enter Pickup Location.");
			$scope.DisableSRR = false;

			return 0;
		}else if(($('#drop').val() != '') && !$scope.booking.manual_destination_latitude){
			$('#drop').val('');
			alert("We couldn't locate your Drop off Location, Please select another.");
			$scope.DisableSRR = false;

			return 0;
		}else if(!$scope.booking.manual_destination_latitude){
			alert("Please enter Destination.");
			$scope.DisableSRR = false;

			return 0;
		}else{
			return 1;
			$scope.DisableSRR = false;

		}

		
		
	}
	$scope.carTypes = {
		'NaN':{'className':'Standard Class','similar':'Honda Accord, Cadillac MKS and BMW 3 series or similar','max':4,'luggage':2},
		'QS 4max':{'className':'Standard Class','similar':'Honda Accord, Cadillac MKS and BMW 3 series or similar','max':4,'luggage':2},
		'QLE 6max':{'className':'Standard Class','similar':'Toyota Highlander, Toyota Seina, Chevrolet Suburban or similiar','max':6,'luggage':2},
		'WAV 4max':{'className':'Standard Class','similar':'Toyota Highlander, Toyota Seina, Chevrolet Suburban or similiar','max':6,'luggage':2},
		'LUXE 4max':{'className':'VIP Class','similar':'Mercedes-Benz S-Class, BMW 7 Series, Audi A8 or similar','max':4,'luggage':2},
		'GRANDE 7max':{'className':'VIP Class','similar':'Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac Escalade or similar','max':6,'luggage':2},
		'ELITE 3max':{'className':'Elite Class','similar':'Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac Escalade or similar','max':4,'luggage':2},
		'QXL 8max':{'className':'QXL Class','similar':'Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac Escalade or similar','max':6,'luggage':10},
		
	}
	$scope.sortPhoneNumber = function(){
		$scope.promoCountryCode = $('#extPopTwo').val()+"-";
		$scope.booking.countrycode = $('#extPopTwo').val()+"-";
		if($scope.booking.user_mobile.indexOf('+')>=0){
			$scope.booking.user_mobile =  $scope.booking.user_mobile.replace($('#extPopTwo').val()+"-",'');
			$scope.booking.user_mobile =  $scope.booking.user_mobile.replace($('#extPopTwo').val(),'');
		}
			 
	}
	$scope.getFareEstimate = function(){
			localStorage.removeItem('book-ride-for');
			
			$scope.showLoader = 1;
			
			$scope.sortPhoneNumber();

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
										$('#loading').modal('hide');
										$scope.$apply();
									},1000);
									
									
								}else if (data.flag == 1316) {
									$rootScope.openToast('warning', data.error, '');
									//$scope.NoUserScreen();	
									$scope.booking.user_id = data.user_id;
									$('#loading').modal('hide');
									$scope.$apply();
									
								}else if (data.flag == 1317) {
									
									$rootScope.openToast('warning', data.error, '');
									$scope.shoUserAddScreen();		
									$scope.addtoAccount();
									
									$scope.booking.user_id = data.user_id;
									$('#loading').modal('hide');
									$scope.$apply();
								}else if(data.error || data.flag==0){
									
									$('#loading').modal('hide');
									$rootScope.openToast('error',data.error || data.message,'')
									
									
									setTimeout(function(){
										$('#loading').modal('hide');
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
											$('#loading').modal('hide');
											$scope.$apply();
										},0);
										
										
										return false;
										
									}else if($scope.ride_estimate_distance > $scope.max_ride_request_distance){
										$('#drop').val('');
										$rootScope.openToast('error', "Destination too far, Please choose another Destination", '');
										setTimeout(function(){
											$('#loading').modal('hide');
											$scope.$apply();
										},0);
										
										
										return false;
										
									}
									//$scope.showCar();
									
									$scope.cars_option = [];
									
									 var carsData = data.estimated_fare;
									
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
											d.value_scheduled = parseFloat(d.value_scheduled);
										}
										$scope.cars_option.push(d);
									});	
									$scope.carsOptions = $scope.cars_option;
									
									

									
									$scope.booking.user_id = data.user_id;
									$scope.booking.user_name = data.user_name;
									$scope.booking.ride_estimate_time = data.ride_estimate_time;
									$scope.booking.ride_estimate_distance = data.ride_estimate_distance;
									$scope.booking.toll = data.toll;
									$scope.booking.route = data.route;
									
									$scope.booking.route_image = 'https://maps.googleapis.com/maps/api/staticmap?&path='+$scope.booking.pickup_location_address+'|'+$scope.booking.manual_destination_address+'&size=600x600&style=feature:landscape|visibility:on&style=feature:poi|visibility:on&style=feature:transit|visibility:on&style=feature:road.highway|element:geometry|lightness:39&style=feature:road.local|element:geometry|gamma:1.45&style=feature:road|element:labels|gamma:1.22&style=feature:administrative|visibility:on&style=feature:administrative.locality|visibility:on&style=feature:landscape.natural|visibility:on&scale=2&markers=shadow:false|scale:2|icon:https://s3.ap-south-1.amazonaws.com/qudosemail/pickup1.png|'+$scope.booking.current_latitude+','+$scope.booking.current_longitude+'&markers=shadow:false|scale:2|icon:https://s3.ap-south-1.amazonaws.com/qudosemail/drop_off1.png|'+$scope.booking.manual_destination_latitude+','+$scope.booking.manual_destination_longitude+'&path=geodesic:true|weight:3|color:0x2dbae4ff|enc:kn{wFf`abMCECCCCCCACCECCCCCECCCCCCAA?A?????????@@@@@@@@@@BBB@@TA@NFJHJHJHJJHHLFLb@z@GICCEG@BBB@@@@??????????????@@@@@@@@@BBDDDDDDDBDBBBB@BAPCBCDEFGJGJGJKPILILGHEFAPBDDFHHJLJLJNLPLPNRLPLNJLHJFHDFBDBBBBBBBBDFBBNRJNLNNRLNJLHJFHDFBDBB@@@@@@BB@BBBDDFHHJLNLNLNLPNPLNLPLNLNLNLNJLJLJLJLHJHJHJFHFHFHFHFHHHHJHJHJHJFHDFDFDFBD@B@@?@???????@??????????????????????????@@???????????????????@@@@@@@??BDBOFKBGBEBEBEDEBEDGDIDGBE@A&key=AIzaSyADXfBi40lkKpklejdGIWNxdkqQCKz8aKI';
									
																		
									$scope.booking.route_directions = 'https://maps.googleapis.com/maps/api/staticmap?size=600x600&path=color:0x00000cd0|weight:5|enc:'+$scope.booking.polylines+'&markers=shadow:false|scale:2|color:green|label:A|'+$scope.booking.current_latitude+','+$scope.booking.current_longitude+'&markers=color:red|label:B|shadow:false|scale:2|'+$scope.booking.manual_destination_latitude+','+$scope.booking.manual_destination_longitude+'&key=AIzaSyADXfBi40lkKpklejdGIWNxdkqQCKz8aKI'
									
									
									if($scope.booking.autoHitApi){
										
										var fare = $scope.cars_option[$scope.booking.car_type-1].value_regular;
										var sche_fare = $scope.cars_option[$scope.booking.car_type-1].value_scheduled;
										
										
										
										$scope.booking.estimated_fare = fare;
										$scope.booking.estimated_fare_later = sche_fare;
										
										
										var fare_old = $scope.cars_option[$scope.booking.car_type-1].regular_ride_without_discount;
										var sche_fare_old = $scope.cars_option[$scope.booking.car_type-1].schedule_ride_without_discount;
										$scope.booking.estimated_fare_old = fare_old;
										$scope.booking.estimated_fare_later_old = sche_fare_old;
										
									
										if($scope.booking.driver_id){
											$scope.notFav = 0;
											$scope.booking.select_car_type = '';
											
										}else{
											$scope.booking.driver_selected = 1;
											$scope.notFav = 1;
											$scope.booking.driver_id = '';
											$scope.booking.car_selected = 1;
											$scope.booking.select_car_type = $scope.booking.car_type;
										}
										
										if($scope.booking.car_type){
											$scope.getDriversData();
										}
		
									}else{
										
										
										var fare = $scope.cars_option[$scope.booking.car_type-1].value_regular;
										var sche_fare = $scope.cars_option[$scope.booking.car_type-1].value_scheduled;
										
										$scope.booking.estimated_fare = fare;
										$scope.booking.estimated_fare_later = sche_fare;
										//$scope.booking.car_selected = 1;
										
										
										var fare_old = $scope.cars_option[$scope.booking.car_type-1].regular_ride_without_discount;
										var sche_fare_old = $scope.cars_option[$scope.booking.car_type-1].schedule_ride_without_discount;
										$scope.booking.estimated_fare_old = fare_old;
										$scope.booking.estimated_fare_later_old = sche_fare_old;
										
										
										if(!$scope.booking.driver_id || ($scope.booking.driver_id == '')){			
											$scope.booking.select_car_type = $scope.booking.car_type;
										}
									
										$scope.getDriversData();
										
										
									
		
									}
									$scope.myQudosMode = 1;
			
			
									
									setTimeout(function(){
										$('#loading').modal('hide');
										$scope.$apply();
									},1000);
									if(!$scope.booking.promo_code){
										$scope.booking.promo_code = '';
									}
									if(data.promo_data.code){
										$scope.booking.promo_code = data.promo_data.code;
									}
									$scope.booking.promo_value = data.promo_data.value;
												
									$scope.$apply();
						
								}
								
					}).fail(function(){
						alert('Something went Wrong!');
						$('#loading').modal('hide');
						$scope.$apply();
					});
					
	}
	
	
	
	$scope.getDriversData = function(){
			
			
			var datedata = $scope.booking.date.split(', ');
			
			$scope.booking.time =datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes+':00';
		
			$scope.myQudosMode = 1;
			$scope.UserQudosMode = 0;
			$scope.AllQudosMode = 0;
		
			$scope.booking.selectedTime = new Date();
			
			var timeInThatArea = new Date().toLocaleString("en-US", {timeZone: $scope.booking.timezone});
			$scope.booking.timeInThatArea = new Date(timeInThatArea);
			$scope.booking.timeInThatAreaLocale = new Date(timeInThatArea).toLocaleString();
			
			
			
			if($scope.booking.user_id){
				
				 $.post(MY_CONSTANT.urlC+ 'get_ride_data', {
					web_access_token:  $cookieStore.get('web_access_token'),				
					user_id:$scope.booking.user_id,
					region_id:24,
					car_type:$scope.booking.car_type,
					is_essential:$scope.essential 
					
				}) .then(function successCallback(data) {
					
						if (typeof(data) == 'string') data = JSON.parse(data);
								
							if (data.flag == 1317) {
								$rootScope.openToast('warning', data.error, '');
								$scope.shoUserAddScreen();		
								$scope.addtoAccount();
								$('#loading').modal('hide');
								$scope.$apply();
							}else if(data.error || data.flag==0){
								$rootScope.openToast('error',data.error || data.message,'');
								
								  return;
							}else{
																	
								$scope.corporateFavDriver = data.corporateFavDriver;
								$scope.userFavDriver = data.userFavDriver;
								$scope.all_drivers = data.all_drivers;
								
								
								if($scope.booking.autoHitApi){
									$('#loading').modal('hide');
									$('#add_to_account').modal('show');
								}else{
									$('#loading').modal('hide');
									if(($scope.booking.carSelected == 0) || ($scope.forceShowDriver)){
										$scope.showUser();
									}
								}	
									
								if($scope.userFavDriver.length == 0){								
								
								}
								//
								$scope.$apply();
							
							}
			
				
				});
				
				
			}else{
				
			}
	}
	
	
	
	
	$scope.closeandReBook = function(redirect){
		$('#loading').modal('hide');
		$('#no_User').modal('hide');	
		setTimeout(function(){
				window.location.reload();
		},1000);
	}
	
	
	$scope.closeNoUser = function(redirect){
		$('#loading').modal('hide');
		$('#no_User').modal('hide');	
		setTimeout(function(){
			window.open('/#/corporate/riderSignup', '_blank');
		},1000);
		
	}
	
	$scope.NoUserScreen = function(){
		$('#no_User').modal('show');
	}
	
	$scope.UserNotFoundScreen = function(){
		$('#no_User').modal('show');
	}
	
	
	$scope.closeandCard = function(){
		$('#add_to_account').modal('hide');
		$('#show_cardError').modal('hide');
		$scope.closeCard();
		$('#loading').modal('hide');
		$('#show_PaymentError').modal('hide');
		$('.modal-backdrop.show').fadeOut();
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		setTimeout(function(){
			$state.go('corporate.listCards');
		},1000);
		
	}
	
	$scope.closePayment = function(redirect){
		$('#loading').modal('hide');
		$('#show_PaymentError').modal('hide');	
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		
	}
	
	$scope.showPaymentAlert = function(){
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
        $('#show_PaymentError').modal('show');
       if($scope.Cards.length > 0){
		$scope.invalid_card=true;
	   }
	   else{
		$scope.invalid_card=false;

		
		
	   }
		
		$scope.paymentAlert = 1;
	}
	$scope.paymentAlert = 1;
	
	$scope.closeCard = function(redirect){
		$('#loading').modal('hide');
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
		$('#loading').modal('hide');
		//$scope.booking.confirmNow = 0;
		
	
		setTimeout(function(){
			//window.location.reload();

			$interval.cancel(stop);
			stop = undefined;
			
			$state.reload();
			
		},00);
		
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
		if(!$scope.booking.autoHitApi){
			/*$scope.booking.driver_id  = ''
			$scope.booking.car_type  = 1
			$scope.booking.select_car_type  = 1
			
			$scope.booking.driver_selected = 0;
			$scope.booking.car_selected = 0;*/
			$scope.showCar();
		}
		$scope.promo_applied = 0;
		$scope.booking.promo_code = undefined;
	}
	$scope.showConfirm = function(){
		$('#show_confirmation').modal('show',{backdrop: 'static', keyboard: false});
		$scope.booking.confirmNow = 1;
	}
	
	
	
	
	$scope.BookRideRightNow = function(){
		$scope.DisbleOnBRN = true;
	
		// $scope.booking.cardId = '';
		if($scope.booking.card_user_type == 1){
			$scope.booking.cardId = $scope.booking.cardIdCorporate;
		}else{
			$scope.booking.cardId = $scope.booking.cardIdUser;
		}
		

		if(!$scope.booking.cardId){
		
				
			if($scope.settings.bothEnabled == true ){
			
				$scope.showPaymentAlert();	
				$timeout(function(){
					$scope.DisbleOnBRN = false;
					
				},2500)
				return false;
			}
			
			else {
			// $('#show_PaymentError').modal('hide');
			
			
			alert('Please Add a new card.');
				
			// $('#loading').modal('hide');
			// setTimeout(function(){$('#request_right_now').modal('hide');},300);
			$timeout(function(){
				$scope.DisbleOnBRN = false;
				
			},2500)
			return false;
		}
		}else{
		
			$timeout(function(){
				$scope.DisbleOnBRN = false;
				
			},2500)
			
			
		}
		
		// if ($scope.buttonNowClicked === 1) {           
		// 	alert('Please Wait while we complete the request for you!');
		// 	$timeout(function(){
		// 		$scope.DisableOnload = false;
		// 	},1500)
		// 	return false;
		// }
			
		
		// $('#request_right_now').modal('show');
		
		
		// $scope.buttonNowClicked = 0;
		$timeout(function(){
			$scope.DisbleOnBRN = false;
		},2500)
		$scope.requestRideAPI();
			
		/*$.post(MY_CONSTANT.urlC + 'ride_payment_process', {
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
				$scope.buttonNowClicked = 0;
				$('#request_right_now').modal('hide');
				$scope.showCredentialsAlert();
			}
			if(data.error || data.flag==0){
				$('#request_right_now').modal('hide');
				$('#request_right_now_1').modal('hide');				
								
				$('#show_confirmation').modal('hide');
				$('#show_cardError').modal('hide');
				$('#loading').modal('hide');	
				$scope.buttonNowClicked = 0;
				$scope.$apply();
				alert(data.error || data.message);
				  return;
			} else {
				$scope.buttonNowClicked = 0;
					$scope.requestRideAPI();
					
			}
		})*/
		
	}
	
	
	
	$scope.requestRideAPI = function(){
		
		$scope.DisableOnload = true;
		$scope.DisbleOnBRN = true;
		// $scope.booking.cardId = '';
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
					is_essential:$scope.essential 
					
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
				is_essential:$scope.essential 
			
			//promo_value:$scope.booking.promo_value,
			
			};
			
		}	
		
		if(!$scope.booking.card_user_type){
			
			/*if(!$scope.booking.cardOTP){				
				$('#rider_payment_otp').modal('show');
				return false;
			}*/
			
			
			params.otp = $scope.booking.cardOTP;
		}
		
		if(!$scope.booking.cardId){
			$scope.requestPending = 0;
			$scope.resetForBookingOnError();
			alert('Please select a valid card.');
			$('#request_right_now').modal('hide');
				$timeout(function(){
		$scope.DisableOnload = false;
		$scope.DisbleOnBRN = false;


				},2000)	
			return false;
		}else{
			$timeout(function(){
				$scope.DisableOnload = false;
		$scope.DisbleOnBRN = false;

		
						},2000)	
			
		}
		
		
		if($scope.booking.card_user_type == 1){
			$scope.booking.cardId = $scope.booking.cardIdCorporate;
		}else{
			$scope.booking.cardId = $scope.booking.cardIdUser;
		}
		params.card_id = $scope.booking.cardId;
		
		
			        $scope.buttonNowClicked = 1;
					$.post(MY_CONSTANT.urlC+ 'request_ride', params) .then(function successCallback(data) {
						
							if (typeof(data) == 'string') data = JSON.parse(data);
									
							if (data.flag == 101) {
								$scope.resetForBookingOnError();
								$scope.showCredentialsAlert();						
								$('#loading').modal('hide');
								$timeout(function(){
									$scope.DisableOnload = false;
	                            	$scope.DisbleOnBRN = false;
		                  					        
											},2000)	
								$scope.$apply();
							}else if (data.flag == 303) {
								$('#request_right_now').modal('hide');
								$scope.resetForBookingOnError();
								
								$scope.showCardAlert();						
								$('#loading').modal('hide');
								$timeout(function(){
									$scope.DisableOnload = false;
	                               	$scope.DisbleOnBRN = false;
							        
											},2000)	
								$scope.$apply();
							}else if(data.error && data.flag==213){
								
								$('#request_right_now').modal('hide');
								$scope.resetForBookingOnError();
								$('#request_right_now').modal('hide');
								$('#request_right_now_1').modal('hide');				
								$('#rider_payment_otp').modal('hide');
								
								$('#show_confirmation').modal('hide');
								$('#show_cardError').modal('hide');
								$('#loading').modal('hide');	
								$scope.$apply();
								$timeout(function(){
									$scope.DisableOnload = false;
									$scope.DisbleOnBRN = false;
											},2000)	
								$rootScope.openToast('error',data.error || data.message,'');
								return;
							}else if (data.error && data.flag == 906) {
							

								$scope.resetForBookingOnError();
								$('#loading').modal('hide');	
								$scope.showPaymentAlert();
								$scope.$apply();
								// alert(data.error );
								$timeout(function(){
									$scope.DisableOnload = false;
									$scope.DisbleOnBRN = false;
											},2000)	
								// $scope.openToast('error', data.error || data.message, '');

							}else if (data.error && data.flag == 921) {
								$scope.resetForBookingOnError();
							
								$('#request_right_now').modal('hide');
								$('#loading').modal('hide');	
								// alert(data.error);
								$timeout(function(){
									$scope.DisableOnload = false;
									$scope.DisbleOnBRN = false;
											},2000)	
								$scope.openToast('error', data.error, '');
								//$scope.showPaymentAlert();
								$scope.$apply();
								
								 return;
								//alert(data.error || data.message);
							}else if(data.error || data.flag==0){
								
								$scope.resetForBookingOnError();
								$('#request_right_now').modal('hide');
								$('#request_right_now_1').modal('hide');				
								$('#request_right_now').modal('hide');
								$('#loading').modal('hide');	
								// $scope.$apply();
								/*
									if(data.error == 'Incorrect verification code'){
										$('#rider_payment_otp').modal('show');	
									}
								*/
								$timeout(function(){
									$scope.DisableOnload = false;
									$scope.DisbleOnBRN = false;
											},2000)	
								setTimeout(function(){
									
									$rootScope.openToast('error',data.error || data.message,'');
								},0);
									
								$scope.$apply();
							}else if(data.flag == 202){
								
								$('#loading').modal('hide');	
								localStorage.setItem('defaultTab', 'reg');

								
								$('#add_to_account').modal('hide');
								
								$('#request_right_now_1').modal('hide');				
								$('#request_ride_later').modal('hide');
								$('#payment_step').modal('hide');
								$('#showRiderCardError').modal('hide');
								$('#show_PaymentError').modal('hide');
								$('#show_confirmation').modal('hide');
								$('#show_cardError').modal('hide');
								$('#rider_payment_otp').modal('hide');
								$('#loading').modal('hide');
								$scope.buttonNowClicked = 0;
								$('#request_right_now').modal('show')
								setTimeout(function(){
									$('#request_right_now').modal('hide');
									$rootScope.openToast('success', 'Ride Booked Successfully', '');
								},00);
								$timeout(function(){
									$scope.DisableOnload = false;
									$scope.DisbleOnBRN = false;
											},2000)	
								localStorage.setItem('routeOff',data.session_id);
								// $('.modal-backdrop.show').fadeOut();
								setTimeout(function(){
									$interval.cancel(stop);
									stop = undefined;
									$state.reload();
								},2100);
								
								$scope.$apply();								
							}
					}).fail(function(){
						$('#request_right_now').modal('hide');
						$scope.buttonNowClicked = 0;
						alert('Something went Wrong, Please check your Internet!');
						$('#loading').modal('hide');
						$timeout(function(){
							$scope.DisableOnload = false;
							$scope.DisbleOnBRN = false;
									},2000)	
						$scope.$apply();
					});
		
		
		
				
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
		
		if($scope.booking.card_user_type === 1){
			$scope.booking.cardSelected == 'corporate';
			$scope.booking.card_user_type = 1;
			$scope.corporateCards = 1;
			$scope.riderCards = 0;
		}else if($scope.booking.card_user_type === 0){
			$scope.booking.cardSelected == 'rider';
			$scope.booking.card_user_type = 0;
			$scope.corporateCards = 0;
			$scope.riderCards = 1;
		}else{
			$scope.booking.cardSelected == 'corporate';
			$scope.booking.card_user_type = 1;
			$scope.corporateCards = 1;
			$scope.riderCards = 0;
		}	
		//$scope.booking.cardOTP = '9999';
		

		if(when=='now'){

			$scope.paymentForNow = 1;
			$scope.paymentForLater = 0;
			
		
			/*** Check if both Rider and Corporate Cards are enabled?, If Yes, then only we will show payment step ****/
			if($scope.settings.bothEnabled == true ){
				if(!$scope.booking.returnRide){
						$scope.showPaymentStep();
					
					
				}
				
				else{
					// $scope.booking.card_user_type = 1;
					$('#loading').modal('show');	
				
					setTimeout(function(){
						//$('#request_right_now_1').modal('show');	
						$scope.BookRideRightNow()
						$('#loading').modal('hide');	
						
					},1000);
				}
			}else{
				
		
				
				$scope.booking.card_user_type = ($scope.settings.CorpCardEnabled == true) ? 1 : 0;
				
			
				$('#loading').modal('show');	
			
				setTimeout(function(){
					//$('#request_right_now_1').modal('show');
					$scope.BookRideRightNow();					
					$('#loading').modal('hide');	
					
				},1000);
				
			}
		}else{
			$scope.paymentForNow = 0;
			$scope.paymentForLater = 1;
			if(!$scope.validateBookingData()){
				return false;
			}else{
				
				/*** Check if both Rider and Corporate Cards are enabled?, If Yes, then only we will show payment step ****/
				if($scope.settings.bothEnabled == true){
					if(!$scope.booking.returnRide){
						$scope.showPaymentStep();
					
					}else{
						$scope.booking.card_user_type = 1;
						$('#loading').modal('show');	
						setTimeout(function(){
							$scope.BookRideLater();
							$('#loading').modal('hide');	
							
						},1000);
					
					}
				}else{
				
				
					$scope.booking.card_user_type = ($scope.settings.CorpCardEnabled == true) ? 1 : 0;
				
					$('#loading').modal('show');	
				
					setTimeout(function(){
						$scope.BookRideLater();
						$('#loading').modal('hide');	
						
					},1000);
					
				}
				
				
				
			}
		}
		
	}
	
	
	$scope.getCardMode = function(){
	
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
		$('#promoCodeEnter').modal('hide');
		$('#showRiderCardError').modal('show');
		
	}
	
	$scope.promoPopupShow = function(){
		$('#request_right_now').modal('hide');
		$('#request_right_now_1').modal('hide');
		$('#show_PaymentError').modal('hide');
		$('#showRiderCardError').modal('hide');
		$('#promoCodeEnter').modal('show');
		
	}
	$scope.closeandApply = function(){
		// $('#promoCodeEnter').modal('hide');
		if(!$scope.booking.promo_code){
			alert('Please add Promo Code')
		}
		else{
		$scope.applyPromoCode();
		
	}
	}
	$scope.closeandCancel = function(){
		$('#promoCodeEnter').modal('hide');
		$scope.booking.promo_code = undefined;
	}
	$scope.promo_applied = 0;
	$scope.applyPromoCode = function(){
		
		$('#loading').modal('show');
		$.post(MY_CONSTANT.urlC + 'redeem_promotion', {
				web_access_token: $cookieStore.get("web_access_token"),			
				promo_code: $scope.booking.promo_code,		
				is_schedule: ''			
			})
		 .then(function successCallback(data, status) {
			
			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
		
			if (data.flag == 101) {
				
				$scope.showCredentialsAlert();

			}else if (data.flag == 1401) {
				//$scope.booking.promo_code = undefined;
				$('#loading').modal('hide');
				$scope.booking.promo_code = ''
				$scope.promo_applied = 0;
				$scope.getFareEstimate();
				$('#promoCodeEnter').modal('show');
				$scope.$apply();
				$rootScope.openToast('error',data.error || data.message,'');
				
			}else if(data.error || data.flag==0){
				$scope.booking.promo_code = ''			
				$('#promoCodeEnter').modal('show');
				
				$rootScope.openToast('error',data.error || data.message,'');

				$('#loading').modal('hide');
				return;
			}else{
				$scope.promo_applied = 1;
				$scope.getFareEstimate();
				$('#promoCodeEnter').modal('hide');
				
				$scope.$apply();
				$rootScope.openToast('success', data.log,'');
			}
			$('#loading').modal('hide');
		});
		
	}
	
	$scope.getCards = function(){
		$scope.DisableOnload = true;
		
        
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
				$timeout(function(){
					$scope.DisableOnload = false;
	             

				},1200)
			}
			if (data.flag == 807) {
				$timeout(function(){
					$scope.DisableOnload = false;
					

				},1200)
				$scope.$apply();
			} else {
				
				$timeout(function(){
					$scope.DisableOnload = false;
					

				},1200)
				$scope.totalCards= data.count;
				$scope.Cards = [];
				var corporateCards = data.corporateCards;
				
				corporateCards.forEach(function(cardInfo) {
					if(cardInfo.default_card == 1){
						$scope.booking.cardIdCorporate = cardInfo.id;
					}
					var d = cardInfo;
					if(Date.parse(d.card_added_on)){
						var dt = new Date(d.card_added_on)

						dt.setMinutes(dt.getMinutes() - d.offset)
						var raw = dt.toISOString();
						d.card_added_on =  raw;
					}
					$scope.Cards.push(d);		
						
				});	
				
				$scope.RiderCards = [];
				var riderCards = data.userCards;
				
				riderCards.forEach(function(card) {
					if(card.default_card == 1){
						$scope.booking.cardIdUser = card.id;
					}
					
					var r = card;
					if(Date.parse(r.card_added_on) && (r.offset)){
						var dt = new Date(r.card_added_on)
					
						dt.setMinutes(dt.getMinutes() - r.offset)
						var raw = dt.toISOString();
						r.card_added_on =  raw;
					}
					$scope.RiderCards.push(r);		
					
				});	
				
				$scope.$apply();
				
			}
		});
		
		
	}
	$scope.getCards();
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
							
				
				$rootScope.openToast('error',data.error || data.message,'');

				  return;
			} else {
			

				$scope.$apply();
				
			}
		});
		
		
	}
	$scope.getDriversDatas = function(){
			
			
		var datedata = $scope.booking.date.split(', ');
		
		$scope.booking.time =datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes+':00';
	
		$scope.myQudosMode = 1;
		$scope.UserQudosMode = 0;
		$scope.AllQudosMode = 0;
	
		$scope.booking.selectedTime = new Date();
		
		var timeInThatArea = new Date().toLocaleString("en-US", {timeZone: $scope.booking.timezone});
		$scope.booking.timeInThatArea = new Date(timeInThatArea);
		$scope.booking.timeInThatAreaLocale = new Date(timeInThatArea).toLocaleString();
		
		
		
		if($scope.booking.user_id){
			
			 $.post(MY_CONSTANT.urlC+ 'get_ride_data', {
				web_access_token:  $cookieStore.get('web_access_token'),				
				user_id:$scope.booking.user_id,
				region_id:24,
				car_type:$scope.booking.car_type,
				is_essential:$scope.essential 
				
			}) .then(function successCallback(data) {
				
					if (typeof(data) == 'string') data = JSON.parse(data);
							
						if (data.flag == 1317) {
							$rootScope.openToast('warning', data.error, '');
							$scope.shoUserAddScreen();		
							$scope.addtoAccount();
							$('#loading').modal('hide');
							$scope.$apply();
						}else if(data.error || data.flag==0){
							$rootScope.openToast('error',data.error || data.message,'');
							
							  return;
						}else{
																
							$scope.corporateFavDriver = data.corporateFavDriver;
							$scope.userFavDriver = data.userFavDriver;
							$scope.all_drivers = data.all_drivers;
							
							
							if($scope.booking.autoHitApi){
								$('#loading').modal('hide');
								// $('#add_to_account').modal('show');
							}else{
								$('#loading').modal('hide');
								if(($scope.booking.carSelected == 0) || ($scope.forceShowDriver)){
									$scope.showUser();
								}
							}	
								
							if($scope.userFavDriver.length == 0){								
							
							}
							//
							$scope.$apply();
						
						}
		
			
			});
			
			
		}else{
			
		}
}
	$scope.driver_refresh = function(){
		$scope.booking.driver_id = '';
		$scope.getDriversDatas();
     
		
		
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
		
		if(driver == ''){
		
			return false;
		}
		
		if(notfav){
			$scope.notFav = 1;
			$scope.booking.driver_id = '';
			$scope.booking.select_car_type = driver;
		}else{
			$scope.notFav = 0;
		  
			$scope.booking.select_car_type = '';
			
		}
		

		if(!$scope.booking.autoHitApi){
			$scope.slectNext();
		}
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
	
	$scope.checkRiderAuthorization = function(){
		
		if(!$scope.booking.returnRide){
			if($scope.booking.card_user_type == 0){
				$scope.booking.cardId = $scope.booking.cardIdUser;
			}else{
				$scope.booking.cardId = $scope.booking.cardIdCorporate;
				return true;
			}
			$('#showRiderAuthorization').modal('show');
			return false;
		}
		return true;
	}
	
	
	
	$scope.sendRiderCardAuthorization = function(when){
		
		//$('#loading').modal('hide');
		$('#showRiderAuthorization').modal('hide');
		$('#request_ride_later').modal('hide');
		$('#payment_step').modal('hide');
	
		$scope.requestPending = 1;
					
		if(when == 'Now'){
			$scope.requestRideAPI();
		}else if(when == 'Later'){
			$scope.scheduleRequestAPI();
		}
		
	}
	
	
	$scope.BookRideLater = function(){
		
	
		
		if(!$scope.validateBookingData()){
			return false;
		}
		
		$scope.showLoader = 1;
		
		
		// $scope.booking.cardId = '';
		
		if($scope.booking.card_user_type == 1){
			$scope.booking.cardId = $scope.booking.cardIdCorporate;
		}else{
			$scope.booking.cardId = $scope.booking.cardIdUser;
		}
		
	
		/*if($scope.RiderCards.length == 0){
			$scope.showRiderCardError();
		}*/
		
		// if(!$scope.booking.cardId && !$scope.booking.returnRide){
		// 	$('#request_right_now').modal('hide');
			
		// 	alert('Please select a valid card.');
		// 	$('#loading').modal('hide');
		// 	return false;
		// }
		if(!$scope.booking.cardId){
		
				
			if($scope.settings.bothEnabled == true ){
			
				$scope.showPaymentAlert();	
				
				return false;
			}
			
			else {
			
			
			
			alert('Please Add a new card.');
			
			
			return false;
		}
	
	}
	else {

	}
		
		
		// if ($scope.buttonLaterClicked === 1) {           
		// 	// $rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
		// 	return false;
		// }
			
		// $scope.buttonLaterClicked = 1;
		
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
				$scope.buttonLaterClicked = 0;
				$scope.showCredentialsAlert();
			}
			if(data.error || data.flag==0){
				$scope.buttonLaterClicked = 0;			
				alert(data.error || data.message);
				return;
			} else {
					
					$scope.buttonLaterClicked = 0;
					$scope.scheduleRequestAPI();
		
						

			}
		})
	 
	
	}
	
	$scope.scheduleRequestAPI = function() {
		
		$scope.DisbleOnPFL = true
		if(!$scope.validateBookingData()){
			
			$scope.requestPending = 0;
			$scope.resetForBookingOnError();
			$timeout(function(){
				$scope.DisbleOnPFL = false
			},1500)
			return false;
		}
		
		$scope.showLoader = 1;
		
		/*if(!$scope.checkRiderAuthorization()){
			return false;
		}*/
		
		var datedata = $scope.booking.date.split(', ');		
		$scope.booking.time = datedata[0]+' '+$scope.booking.time_hour+':'+$scope.booking.time_minutes+':00';		
		$scope.booking.selectedTime = new Date($scope.booking.time);
		
		var timeInThatArea = new Date($scope.booking.time).toLocaleString("en-US", {timeZone: $scope.booking.timezone});
		$scope.booking.timeInThatArea = new Date(timeInThatArea);
		$scope.booking.timeInThatAreaLocale = new Date(timeInThatArea).toLocaleString();
		
	
		
		
		// $scope.booking.cardId = '';
		
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
				is_essential:$scope.essential 
				
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
				is_essential:$scope.essential 
			};
		}	
		
	

		if(!$scope.booking.card_user_type){			
			/*if(!$scope.booking.cardOTP){				
				$('#rider_payment_otp').modal('show');
				return false;
			}*/
			$scope.booking.cardOTP = '1234';
			
			params.otp = $scope.booking.cardOTP;
		}
		
		
		if(!$scope.booking.cardId && !$scope.booking.returnRide){
		
			$('#request_right_now').modal('hide');
			$scope.resetForBookingOnError();
			alert('Please select a valid card.');
			$('#loading').modal('hide');
			return false;
		}
	
	

		
		
		if($scope.booking.card_user_type == 1){
			$scope.booking.cardId = $scope.booking.cardIdCorporate;
			
		}else{
			$scope.booking.cardId = $scope.booking.cardIdUser;
		
		}



		if($scope.booking.returnRide){
			params.card_id = $scope.booking.cardId;
			
		}
		
			// if ($scope.buttonLaterClicked === 1) {           
			// 	$rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
			// 	$timeout(function(){
			// 		$scope.DisbleOnPFL = false
			// 	},1500)
			// 	return false;
			// }
			
			$scope.buttonLaterClicked = 1;
			
			$.post(MY_CONSTANT.urlC+ 'schedule_request', params) .then(function successCallback(data) {
			
				if (typeof(data) == 'string') data = JSON.parse(data);
						
				if (data.flag == 101) {
					$scope.showCredentialsAlert();	
					$scope.resetForBookingOnError();
					$('#loading').modal('hide');
					$timeout(function(){
						$scope.DisbleOnPFL = false  
					},1500)
					$scope.$apply();
				}else if (data.flag == 303) {
					$scope.showCardAlert();	
					$scope.resetForBookingOnError();
					$('#loading').modal('hide');
					$timeout(function(){
						$scope.DisbleOnPFL = false
					},1500)
					$scope.$apply();
				}else if(data.error && data.flag==213){
					$scope.resetForBookingOnError();
					$('#request_right_now').modal('hide');
					$('#request_right_now_1').modal('hide');				
					$('#rider_payment_otp').modal('hide');
					
					$('#show_confirmation').modal('hide');
					$('#show_cardError').modal('hide');
					$('#loading').modal('hide');
					$timeout(function(){
						$scope.DisbleOnPFL = false
					},1500)	
					$scope.$apply();
					
				$rootScope.openToast('error','Ride has been already booked for this User, Please choose another Rider.','');
					
					return;
				}else if(data.error || data.flag==0){
					$scope.resetForBookingOnError();
					$('#loading').modal('hide');	
					$scope.$apply();
					$('#request_ride_later').modal('hide');
					
					if(data.error == 'Incorrect verification code'){
						//$('#rider_payment_otp').modal('show');	
					}
					
				$rootScope.openToast('error',data.error || data.message,'');
				$timeout(function(){
					$scope.DisbleOnPFL = false
				},1500)
					  return;
				}else if (data.flag == 906) {
					$('#loading').modal('hide');	
					$scope.resetForBookingOnError();
					$scope.showPaymentAlert();
				// $rootScope.openToast('error',data.error || data.message,'');
				$timeout(function(){
					$scope.DisbleOnPFL = false
				},1500)
					$scope.$apply();
				}else if (data.error && data.flag == 921) {
						$('#loading').modal('hide');	
						$scope.resetForBookingOnError();
						$timeout(function(){
							$scope.DisbleOnPFL = false
						},1500)
				$rootScope.openToast('error','Your sub merchant account not added yet.','');

						$scope.$apply();
						
						 return;
				}else if(data.flag == 900){
					
					localStorage.setItem('defaultTab', 'sch');
					localStorage.setItem('routeOff',data.session_id);
					$('#loading').modal('hide');	
					$('#add_to_account').modal('hide');
					$('#request_ride_later').modal('hide');
					$('#payment_step').modal('hide');
					$('#showRiderCardError').modal('hide');
					$('#rider_payment_otp').modal('hide');
					$scope.buttonLaterClicked = 0;
					$('#show_PaymentError').modal('hide');
						
					$scope.showConfirm();
					$timeout(function(){
						$scope.DisbleOnPFL = false
					},1500)
					$rootScope.openToast('success', 'Booking Scheduled Successfully', '');
				
					
					$scope.$apply();								
				}
			}).fail(function(){
				alert('Something went Wrong!');
				$scope.buttonLaterClicked = 0;
				$('#loading').modal('hide');
				$timeout(function(){
					$scope.DisbleOnPFL = false
				},1500)
				$scope.$apply();
			});
				

		
		
	}

	$scope.resetForBookingOnSuccess = function() {
		$('#loading').modal('hide');	
		$('#add_to_account').modal('hide');
		$('#request_ride_later').modal('hide');
		$('#payment_step').modal('hide');
		$('#showRiderCardError').modal('hide');
		$('#rider_payment_otp').modal('hide');
		$('#show_PaymentError').modal('hide');
		$scope.buttonLaterClicked = 0;
		$scope.buttonNowClicked = 0;
	}
	$scope.resetForBookingOnError = function() {
		$scope.requestPending = 0;
		$scope.buttonLaterClicked = 0;
		$scope.buttonNowClicked = 0;
		$('#loading').modal('hide');	
		$('#request_right_now').modal('hide');	
		//$('#request_ride_later').modal('hide');
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
						
						$rootScope.openToast('error',data.error || data.message,'');
						// $('#add_myUser').modal('hide');
						  return;
					}else if(data.flag == 7){
						
						$rootScope.openToast('success', data.message, '');
						
						//alert("This user is not yet added to your list, an OTP is sent to ("+$scope.userMobileToAdd+") and need to be entered below for the new ride request to proceed");
					}
				})
				
			})
		
	}
	
	$scope.reAddUser = function() {
		
	
		$scope.otpMode = 1;
		$scope.userToAdd = $scope.booking.user_id;
		// $scope.otpToAdd = '';
		$scope.DisableResnd = true;
		 $.post(MY_CONSTANT.urlC+ 'associatedUser_resend_otp', {
				web_access_token:  $cookieStore.get('web_access_token'),	
				mobile: $scope.promoCountryCode +$scope.booking.user_mobile,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
					$timeout(function(){
		             $scope.DisableResnd = false;

						},1500)
						$rootScope.openToast('error', data.error || data.message, '');

						  return;
					}else if(data.flag == 7){
						$rootScope.openToast('success', 'OTP sent again!', '');
						$timeout(function(){
							$scope.DisableResnd = false;
	   
							   },1500)
						
					}
				
			})
			
		})
	}
	

	$scope.completeUserAdd = function() {

			$scope.onInvalidOtp = true;

		if ($scope.otpToAdd === '' || !$scope.otpToAdd) {
            // alert('Select Expiry Date');
			alert('Please Enter OTP ');
			setTimeout(function () {
				$scope.onInvalidOtp = false;
			  }, 1000);
			
			
            return false;
        }else if (!$scope.booking.user_id) {
		   alert('Unknown User');
		   setTimeout(function () {
			$scope.onInvalidOtp = false;
		  }, 1000);
	

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
			
			setTimeout(function () {
				$scope.onInvalidOtp = false;
			  }, 1000);
			   $scope.otpToAdd = "";
				$rootScope.openToast('error',data.error || data.message,'');
			                // 

				return;
						}else{
							// $scope.onInvalidOTp = false;
							$rootScope.openToast('success', data.log || data.message , '');
						
							$('#add_myUser').modal('hide');
							  
							  
							//$scope.getDriversData($scope.booking.user_id);
							$scope.getFareEstimate();
							
							
						}
			
				});
				
			});
		}
		
		
	}
	
	
	
	var card;
	$scope.initCard = function() {
		
		var stripe = Stripe(MY_CONSTANT.stripeKey);
		var elements = stripe.elements();
			
		var style = {
			base: {
				fontSize: '16px',
				color: "#32325d",
			}
		};

		card = elements.create('card', {style: style});
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
			
                
				$scope.stripeTokenHandler(result.token);
                
			}
		  });
		});


	}
	$scope.initCard();
	$scope.stripeTokenHandler =  function(token) {
		
		if ($scope.buttonClicked === 1) {   
			// $rootScope.openToast('error', 'Please Wait while we complete the request for you!', '');
			
            return false;
		}
		else{
			$scope.buttonClicked = 1;
			
			
		  $.post(MY_CONSTANT.urlC + 'add_credit_card', {
				web_access_token: $cookieStore.get("web_access_token"),
				nounce:token.id,
				card_type:52,
				offset: new Date().getTimezoneOffset()*-1,
				
			})
		 .then(function successCallback(data, status) {
			// $rootScope.$apply(function () { 
				setTimeout(function(){
								
					$scope.buttonClicked = 0;

				},3000);

			if (typeof(data) == 'string')
				data = JSON.parse(data);
			else data = data;
			
			if (data.error) {
				$('#loading').modal('hide');
			
				
				$scope.openToast('error',data.error,'');
				return ;
			} else {		
				card.clear();
				
				$rootScope.openToast('success', data.log, '');
				
				$scope.Cards = [];
				$scope.RiderCards = [];
				$scope.getCards();
				
				
				$('#add_card').modal('hide');
				
				setTimeout(function(){
					$('#loading').modal('hide');
				},1100);
				
			}
		// })
			
		});
		
	}
}
	
	 $scope.openAddUser = function(){
		setTimeout(function(){
			window.open('/#/corporate/riderSignup', '_blank');
		},0);
	};
	
	
	
	
	
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
					$scope.getDirectionsForBooking();
				}else{				
					existing = $scope.booking.latitude;
				}
			}else if(type == 'drop'){
				address = $('#drop').val();
			
				if((!address) || (address =='')){
				
					$scope.booking.manual_destination_latitude = '';
					$scope.booking.manual_destination_longitude = '';
					$scope.booking.manual_destination_address = '';
					$scope.getDirectionsForBooking();
				}else{
				
					existing = $scope.booking.manual_destination_latitude;
				}
			}else if(type == "return-pickup"){
				address = $('#return-pickup').val();
				
				if((!address) || (address =='')){
				
					$scope.booking.current_latitude = '';
					$scope.booking.current_longitude = '';
					$scope.booking.pickup_location_address = '';			
					$scope.booking.latitude = '';
					$scope.booking.longitude = '';
					$scope.getDirectionsForBooking();
				}else{				
					existing = $scope.booking.latitude;
				}
			}else if(type == 'return-drop'){
				address = $('#return-drop').val();
				
				if((!address) || (address =='')){
				
					$scope.booking.manual_destination_latitude = '';
					$scope.booking.manual_destination_longitude = '';
					$scope.booking.manual_destination_address = '';
					$scope.getDirectionsForBooking();
				}else{
				
					existing = $scope.booking.manual_destination_latitude;
				}
			}
			
			
			
			
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
							
							
							directionsDisplay.setMap(null);
							

						}else if(type == 'drop'){
							$scope.booking.manual_destination_latitude = latitude;
							$scope.booking.manual_destination_longitude = longitude;
							//$scope.booking.manual_destination_address = formatted_address;
							$scope.booking.manual_destination_address = $('#drop').val();
							
							
							
							directionsDisplay.setMap(null);
						

						}else if(type == 'return-pickup'){
							$scope.booking.current_latitude = latitude;
							$scope.booking.current_longitude = longitude;
							//$scope.booking.pickup_location_address = formatted_address;						
							$scope.booking.pickup_location_address = $('#return-pickup').val();						
							$scope.booking.latitude = latitude;
							$scope.booking.longitude = longitude;
						
							
							directionsDisplay.setMap(null);
						}else if(type == 'return-drop'){
							$scope.booking.manual_destination_latitude = latitude;
							$scope.booking.manual_destination_longitude = longitude;
							//$scope.booking.manual_destination_address = formatted_address;
							$scope.booking.manual_destination_address = $('#return-drop').val();
							
							
							directionsDisplay.setMap(null);
						}
						$scope.getDirectionsForBooking();
					} else {
					
					}
				} );
			}else if( address==''){
			
				
				directionsDisplay.setMap(null);
			}else{
				
			}
			
	}
	
	$scope.getDirectionsForBooking = function(){
	
		
		if($scope.booking.manual_destination_latitude && $scope.booking.current_latitude){
			
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*******Live Map Code**********/
	
	
	var markers = [];							
	var ongoingDriverIds = [];
	

	var haightAshbury = {lat: 37.769, lng: -122.446};
	
	
	
	$scope.addMarker = function(location) {
	  var marker = new google.maps.Marker({
		position: location,
		map: map
	  });
	  markers.push(marker);
	  markers.setMap(null);
	}
	//$scope.addMarker(haightAshbury);
	
		
		if (!$cookieStore.get('web_access_token')) {
			$state.go("corporate_login");
		}
		
		
		var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
		var newdriverModel = JSON.parse(localStorage.getItem('driverdata'));
		
		$scope.routeOffID = false;
		if(localStorage.getItem('routeOff')){
			$scope.routeOffID = localStorage.getItem('routeOff');
		}
		$scope.defaultTab = localStorage.getItem('defaultTab');
		
		localStorage.removeItem('defaultTab');
		
		if($scope.defaultTab == 'reg'){
			$scope.completedTabActive = 0;
			$scope.scheuleTabActive = 0
			$scope.regularTabActive = 1;
			$scope.showTripDetail();
		}else if($scope.defaultTab == 'sch'){
			$scope.completedTabActive = 0;
			$scope.scheuleTabActive = 1;
			$scope.regularTabActive = 0;
			$scope.showTripDetail();
		}else{
			$scope.completedTabActive = 1;
			$scope.scheuleTabActive = 0;
			$scope.regularTabActive = 0;
		}
		
	  
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
			$scope.driverDetails.lat = driverModel.lat;
			$scope.driverDetails.lng = driverModel.lng;
			$scope.driverDetails.state = driverModel.state;
			$scope.driverDetails.city = driverModel.city;
			$scope.driverDetails.address = driverModel.address;
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
		
	
		

        $rootScope.showloader = false;
        $scope.expand = 1;
        $scope.showim = 0;
        $scope.select = {};

        //socket init
       
		var token = $cookieStore.get('web_access_token');
	
        $scope.expand1 = 1;
        var rotation = 0;
		
		
		$scope.collapseDisc = function () {
			$scope.classExpand = 0;
        }
		$scope.check = function (daa) {
			$scope.search_session_id = undefined;
			setTimeout(function(){
				if($scope.tripDetailMode){
					if($scope.hasDriver == 'YES'){
						
						
						if($scope.driverEnable){
							
						}else{
						
							$scope.search_session_id = daa.session_id;
							$scope.cleanDrivers(daa.driver_id);
						}
						
						
						socketFactory.emit('corporateDriverAvailablity', {session_id:$scope.search_session_id,limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
						
					}else{
						if(!$scope.driverEnable){
						
							$scope.disableDrivers();
						}
					}
				}
			},10);
			
			
		}
		$scope.expandDisc = function (daa) {
			$scope.driverNames = '';
			if($scope.tripDetailMode){
				socketFactory.emit('corporateRequestedDriverList', { session_id:daa.session_id});
		
				$scope.classExpand = 1;
				$scope.ride_new  = {'status': daa.ride_status,'session_id':daa.session_id,'scheduled':daa.is_schedule} ;
				
				if($scope.ride_old){
					if($scope.ride_old.session_id == $scope.ride_new.session_id){
						if($scope.ride_old.status != $scope.ride_new.status){
							
							if($scope.ride_new.status == 4){
								var rts;
								if($scope.ride_new.scheduled == 1){
									
									
									
									if($scope.scheduledrides[0].session_id != $scope.ride_old.session_id){
										rts = $scope.scheduledrides[0];
									}else{
										rts = $scope.scheduledrides[1];
									}
								}else if($scope.ride_new.scheduled == 0){
									
									if($scope.regular_rides[0].session_id != $scope.ride_old.session_id){
										rts = $scope.regular_rides[0];
									}else{
										rts = $scope.regular_rides[1];
									}
								}
								$scope.expandDisc(rts);
								
								setTimeout(function(){
									$scope.expandDisc(rts);
									setTimeout(function(){
										$scope.expandDisc(rts);
									},1000);
								},500);
								$scope.stopCompleted = 1;
							}
						}
					}
				}
				
				$scope.ride_old = {'status': daa.ride_status,'session_id':daa.session_id,'scheduled':daa.is_schedule} ;
				
			}
			
			
			$scope.rideInFocus = daa;
			$scope.is_schedule = daa.is_schedule;
			$scope.ride_status = daa.ride_status;
			
			$scope.getRideText(daa.ride_status,daa.request_status,daa.is_active);
			
			
			
			
			
			$scope.pickup_time_raw = '';
			if(daa.is_schedule == '0'){
			
				$scope.pickup_time_formatted =  $filter('date')(new Date(daa.start_time),'MM/dd/yyyy HH:mm a');
				$scope.pickup_time_used =  daa.start_time;
				$scope.pickup_time_raw =  daa.start_time;
		
			}else{
			
				$scope.pickup_time_formatted =  $filter('date')(new Date(daa.pickup_time),'MM/dd/yyyy HH:mm a');
				$scope.pickup_time_used =  daa.pickup_time;
				$scope.pickup_time_raw =  daa.pickup_time_processed;
			
			}
			
			if(daa.ride_status == 3){
			
			}
			
			
			
			
			
			
			
			
			
            if (daa.pickup_location_address) {
                $scope.pickup_location_address = daa.pickup_location_address;
            } else if (daa.address) {
                $scope.pickup_location_address = daa.address;
            }
            $scope.manual_destination_address = daa.manual_destination_address;
          
			$scope.driver_name = daa.driver_name;
         
            $scope.car_name = daa.car_name;
            $scope.driver_mobile = daa.driver_mobile;
            if (daa.total_with_tax) {
				daa.total_with_tax = parseFloat(daa.total_with_tax)
						
				daa.total_with_tax = daa.total_with_tax.toFixed(2);
				daa.total_with_tax = parseFloat(daa.total_with_tax)
						
                $scope.fare_calculated = "$" + daa.total_with_tax;
            } else {
                $scope.fare_calculated = "Unavailable";
            }
         
			$scope.showStatus = $scope.getTripStatus($scope.rideInFocus.ride_status,$scope.rideInFocus.request_status,$scope.rideInFocus.is_active,$scope.rideInFocus.is_schedule);
			
			$scope.showStatus = $sce.trustAsHtml($scope.showStatus);
			
			
		 
			
		 
		 
		 
            if (daa.hasOwnProperty("session_id")) {
                $scope.tripnumber = "Trip Number: #" + daa.session_id;
            }
            if (daa.hasOwnProperty("session_id") == false) {
                $scope.tripnumber = "Trip Number:Unavailable";
            }
			
            //Customer
            $scope.user_name = daa.user_name;
            $scope.user_id = daa.user_id;
            $scope.user_rating = daa.user_rating;
            $scope.user_mobile = daa.user_mobile;
            $scope.driver_mobile = daa.driver_mobile;
            $scope.user_email = daa.user_email;
            $scope.driver_email = daa.driver_email;
			$scope.user_image = daa.user_image;
			$scope.ride_essential = daa.ride_essential;
			$scope.session_id = daa.session_id;
			
			if(daa.user_image == null){
				$scope.user_image = 'http://qudos-s3.s3.amazonaws.com/user_profile/user.png';
			}
			
			$scope.search_session_id = undefined;
			if($scope.tripDetailMode){
				if($scope.hasDriver == 'YES'){
					if($scope.driverEnable){
					
					}else{
						
						$scope.search_session_id = daa.session_id;
					}
				
					socketFactory.emit('corporateDriverAvailablity', {session_id:$scope.search_session_id,limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
					
				}else{
					if(!$scope.driverEnable){
					
						$scope.disableDrivers();
						$scope.cleanDrivers();
					}
				}
			}
            $scope.driver_image = daa.driver_image;
			
			if(daa.driver_image == null){
				$scope.driver_image = 'http://qudos-s3.s3.amazonaws.com/user_profile/user.png';
			}
			
            $scope.start_time_trip = daa.start_time;
			$scope.start_time_formatted = '';
			if(daa.start_time!=null){
				$scope.start_time_formatted =  $filter('date')(new Date(daa.start_time),'MM/dd/yyyy HH:mm a');
			}else if(daa.pickup_time!=null){
				$scope.start_time_formatted =  $filter('date')(new Date(daa.pickup_time),'MM/dd/yyyy HH:mm a');
			}
            //History
			$scope.tzName = daa.tzName;
			
			
			$scope.accept_time = daa.accept_time;
			
			
			if(daa.is_schedule=='0'){
				$scope.schedule_calender_accept_time = daa.accept_time;
			}else{
				$scope.schedule_calender_accept_time = daa.schedule_calender_accept_time;
			}
			
			$scope.pickup_id = daa.pickup_id;
			$scope.session_id = daa.session_id;
            if (daa.pickup_id) {
                var scheduledrides_history = $scope.scheduledrides;
				if(scheduledrides_history){
					var schhistory = [];
					for (let ride_history of scheduledrides_history) {
						if (daa.user_id == ride_history.user_id) {
							ride_history = {...ride_history}
							schhistory.push(ride_history);
						} else {
							continue;
						}
					}
					$scope.rideshistory = schhistory;
				}
            } else if (daa.session_id) {
                var completedrides_history = $scope.completedRides;
                var total = 0;
                let comhistory = [];
                for (let ride_history of completedrides_history) {
                    if (daa.driver_id == ride_history.driver_id) {
                        ride_history = {...ride_history}
                        comhistory.push(ride_history);
					
                        total = total + ride_history.fare_calculated;
						total = parseFloat(total)
						
						total = total.toFixed(2);
						total = parseFloat(total)
                    } else {
                        continue;
                    }
                }
                $scope.rideshistory = comhistory;
                $scope.faretotal = total;
            } 
			
        }
       
		$scope.getRideText = function(ride_status,request_status,is_active){
			$scope.hasDriver = 'NO';
			$scope.rideText = 'NO';
			//$scope.rideRechedulable = 'NO';
			$scope.rideMissed = 'NO';
			switch(ride_status) {
				case 0:
					if(request_status ==0){
						$scope.rideText = "Yes";
					}else if(request_status ==1){
						$scope.rideText = "Yes";
						$scope.hasDriver = 'YES';
					}else if(request_status ==10){
						$scope.rideText = "Cancelled";
						$scope.rideMissed = "Yes";
					}else if(request_status == null && is_active == 0){
						$scope.rideText = "Cancelled";
						$scope.rideMissed = "Yes";
					}else{
						$scope.rideText = "Yes";
					}
					break;
				case 1:
                    $scope.rideText = "Yes";
					$scope.hasDriver = 'YES';
					break;
                case 2:
                    $scope.rideText = "Yes";
					$scope.hasDriver = 'YES';
					break;
                case 3:
                    $scope.rideText = "No-enroute"; 
					$scope.hasDriver = 'YES';
					break;
				case 4:
                    $scope.rideText =  "Completed";
					
					break;
				case 5:                  
                    $scope.rideText =  "Cancelled";
					break;
				case 6:
					$scope.rideText =  "Cancelled";
					break;
				case 8:
					$scope.rideText =  "Cancelled";
					break;
				case 9:
					$scope.rideText =  "Cancelled";
					break;
				case 11:
					$scope.rideText =  "Cancelled";
					break;
				default:
                    $scope.rideText = "Default";
					break;
			}
			$scope.rideInFocus.rideText = $scope.rideText;
		}

		var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();

			
		$scope.scheduledCurrentPage = 1;
		$scope.regularCurrentPage = 1;	
		$scope.ongoingCurrentPage = 1;	
		$scope.completedCurrentPage = 1;	
		$scope.scheduled = 1;	
		$scope.regularFrom = 1;	
		$scope.scheduledFrom = 1;	
		$scope.completedFrom = 1;	
		
		$scope.pageChanged = function(currentPage,type) {
			
			if(type == "scheduled"){
				$scope.scheduledCurrentPage = currentPage;
				
				if($scope.scheduledCurrentPage ==0){
					$scope.scheduledFrom = 1;
					$scope.scheduledTo = 15;
				}
			
				
			
				$scope.hideNextscheduled = 0;
				
				if(parseInt($scope.totalItemsScheduled / 15 + 1) <= currentPage){
					$scope.hideNextscheduled = 1;
				}
				for (var i = 1; i <= $scope.totalItemsScheduled / 15; i++) {
					if ($scope.scheduledCurrentPage == i) {
						$scope.scheduleSkip = 15 * (i - 1);
						
					}
				}
					
				if($scope.scheduledCurrentPage == 1){
					$scope.hidePrevscheduled = 1;
					$scope.hideNextscheduled = 0;
				}else if($scope.scheduledCurrentPage == $scope.scheduledPages){
					$scope.hidePrevscheduled = 0;
					$scope.hideNextscheduled = 1;
				}else{
					$scope.hidePrevscheduled = 0;
					$scope.hideNextscheduled = 0;
				}
				
			
				socketFactory.emit('corporateScheduledRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.scheduleSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});

					
			}else if(type == "regular"){
					$scope.regularCurrentPage = currentPage;
					
					
					if($scope.regularCurrentPage ==0){
						$scope.regularFrom = 1;
						$scope.regularTo = 15;
					}
					
					
					$scope.hideNext = 0;
					
					if(parseInt($scope.totalItemsRegular / 15 + 1) <= currentPage){
						$scope.hideNext = 1;
					}
					for (var i = 1; i <= $scope.totalItemsRegular / 15 + 1; i++) {
						if ($scope.regularCurrentPage == i) {
							$scope.regularSkip = 15 * (i - 1);
						
							//$scope.$apply();
							
						}
					}
					
					
					if($scope.regularCurrentPage == 1){
						$scope.hidePrev = 1;
						$scope.hideNext = 0;
					}else if($scope.regularCurrentPage == $scope.regularPages){
						$scope.hidePrev = 0;
						$scope.hideNext = 1;
					}else{
						$scope.hidePrev = 0;
						$scope.hideNext = 0;
					}
					
					if($scope.regularPages <=1){
						$scope.hidePrev = 1;
						$scope.hideNext = 1;
					}
			
					socketFactory.emit('corporateRegularRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.regularSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
					
					
			}else if(type == "completed"){
					$scope.completedCurrentPage = currentPage;
					
					if($scope.completedCurrentPage ==0){
						$scope.completedFrom = 1;
						$scope.completedTo = 15;
					}
					$scope.completedFrom = (($scope.completedCurrentPage-1) * 15) + 1;
					
					$scope.completedTo = $scope.completedFrom - 1 + 15;
					if($scope.completedTo > $scope.totalItemsCompleted){
						$scope.completedTo = $scope.totalItemsCompleted;
					}
					
					$scope.hideNextcompleted = 0;
					
					if(parseInt($scope.totalItemsCompleted / 15 + 1) <= currentPage){
						$scope.hideNextcompleted = 1;
					}
					for (var i = 1; i <= $scope.totalItemsCompleted / 15 + 1; i++) {
						if ($scope.completedCurrentPage == i) {
							$scope.completedSkip = 15 * (i - 1);
							
							//$scope.$apply();
							
						}
					}
					if($scope.completedCurrentPage == 1){
						$scope.hidePrevcompleted = 1;
						$scope.hideNextcompleted = 0;
					}else if($scope.completedCurrentPage == $scope.completedPages){
						$scope.hidePrevcompleted = 0;
						$scope.hideNextcompleted = 1;
					}else{
						$scope.hidePrevcompleted = 0;
						$scope.hideNextcompleted = 0;
					}
			
			
					socketFactory.emit('corporateCompletedRequests', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.completedSkip , sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:2});
			}else if(type == "availableDrivers"){
				
				
					$scope.availableCurrentPage = currentPage;
				
					$scope.hideNextAV = 0;
					
					
					$scope.availableFrom = (($scope.availableCurrentPage-1) * $scope.driverLimit) + 1;
					$scope.availableTo = $scope.availableFrom - 1 + $scope.driverLimit;
					
					
					
					if($scope.availableCurrentPage ==0){
						$scope.availableFrom = 1;
						$scope.availableTo = $scope.driverLimit;
					}
					
					
					if(parseInt($scope.totalAvailableCars / $scope.driverLimit + 1) <= currentPage){
						$scope.hideNextAV = 1;
					}
					
					
					
					if(($scope.availableCurrentPage == 1) && ($scope.availableCarsPages == 1)){
						$scope.hidePrevsAV = 0;
						$scope.hideNextAV = 0;
					}else if($scope.availableCurrentPage == 1){
						$scope.hidePrevsAV = 1;
						$scope.hideNextAV = 0;
					}else if($scope.availableCurrentPage == $scope.availableCarsPages){
						$scope.hidePrevsAV = 0;
						$scope.hideNextAV = 1;
					}else{
						$scope.hidePrevsAV = 0;
						$scope.hideNextAV = 0;
					}
					
					
					
					if(!$scope.dsearchFlag){
						//$scope.totalAvailableCars = $scope.totalAvailableCars/ $scope.driverLimit + 1;
					}
					
					/*if(parseInt($scope.totalAvailableCars) <= currentPage){
						$scope.hideNextAV = 1;
					}*/
					for (var i = 1; i <= $scope.totalAvailableCars; i++) {
						if ($scope.availableCurrentPage == i) {
							if(!$scope.dsearchFlag){	
								$scope.driverSkip = $scope.driverLimit * (i-1);
							
							}
						}
					}
					
					
					
					
					if($scope.dsearchFlag){		
						
					}else{
					
						
					}
					socketFactory.emit('corporateDriverAvailablity', {limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
			}

		};
	
			
		
		
		socketFactory.on('corporateRequestedDriverList', function(data) {
			$scope.driverNames = '';
			$scope.driverrec2 = 0;
			$scope.driverrec3 = 0;
			$scope.driverNames = data[0].data.paginated_list;
			
			if($scope.driverNames.length == 0){
				$scope.requestLoader = 0;
			}else{
				$scope.requestLoader = 1;
			}
			$scope.driver1 = '';
			$scope.payment_date = ' - ';
			$scope.payment_timezone = ' - ';
			if($scope.driverNames[0]){
				$scope.driver1 = ($scope.driverNames[0].names != null) ? $scope.driverNames[0].names : '';
				$scope.payment_date = $scope.driverNames[0].payment_date;
				$scope.payment_timezone = new Date($scope.driverNames[0].payment_date).toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
				if(($scope.payment_timezone == "India Standard Time") || ($scope.payment_timezone == "GMT+5:30")){
					$scope.payment_timezone = 'IST';
				}	
			}
			$scope.driver1 = $scope.driver1.replace(/,/g, '<br />');
			$scope.driver1 = $sce.trustAsHtml($scope.driver1);
			
			
			
			
			if($scope.driverNames[1]){
				$scope.driverrec2 = 1;
				$scope.driver2 = '';
				$scope.driver2 = ($scope.driverNames[1].names != null) ? $scope.driverNames[1].names : '';
				$scope.driver2 = $scope.driver2.replace(/,/g, '<br />');
				$scope.driver2 = $sce.trustAsHtml($scope.driver2);
			}
			if($scope.driverNames[2]){
				$scope.driverrec3 = 1;
				$scope.driver3 = '';
				$scope.driver3 = ($scope.driverNames[2].names != null) ? $scope.driverNames[2].names : '';
				$scope.driver3 = $scope.driver3.replace(/,/g, '<br />');
				$scope.driver3 = $sce.trustAsHtml($scope.driver3);
			}
		
		});
		
		
		socketFactory.on('corporateCompletedRequests', function(data) {
			
			$scope.sockoc=data[0].data.paginated_rides;
			//$scope.completedRides = $scope.sockoc;
			$scope.totalItemsCompleted = data[0].data.count;
			
			
				var CompletedData = data[0].data.paginated_rides;
					
				$scope.completedRides = [];
				var i = 1;
				CompletedData.forEach(function(ride) {
					var r = ride;
					
					if(ride.start_time){
						var dt = new Date(ride.start_time)
						dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
						var raw = dt.toISOString();
						r.start_time_raw =  raw;
						r.start_time_original =  ride.start_time;
						r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
					}
					if(ride.drop_time){
						var dt = new Date(ride.drop_time)
						dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
						var raw = dt.toISOString();
						r.drop_time_raw =  raw;
						r.drop_time_original =  ride.drop_time;
						r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
					}
					if(ride.pickup_time){
						var dt = new Date(ride.pickup_time)
						dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
						var raw = dt.toISOString();
						//r.pickup_time_raw =  raw;
						r.pickup_time_processed =  ride.pickup_time;
						r.pickup_time_original =  ride.pickup_time;
						
						r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
					}
					
					
					
					
					
					if((r.tzName == "India Standard Time") || (r.tzName == "GMT+5:30")){
						r.tzName = 'IST';
					}
					
					if(i == 1){
						
						
						//$scope.showonm(r);	
					}
					i++;
					$scope.completedRides.push(r);
					if(!$scope.stopCompleted){
						if($scope.classExpand == 1){
							if($scope.rideInFocus.session_id == r.session_id){
								
								$scope.expandDisc(r);
							}
						}		
					}
			
				});
			
			$scope.completedPages = parseInt($scope.totalItemsCompleted/15 + 1);
			
			$scope.completedTo = $scope.completedFrom - 1 + 15;
			if($scope.completedTo > $scope.totalItemsCompleted){
				$scope.completedTo = $scope.totalItemsCompleted;
			}
			if($scope.completedCurrentPage == 1){
				$scope.hidePrevcompleted = 1;
				$scope.hideNextcompleted = 0;
			}else if($scope.completedCurrentPage == $scope.completedPages){
				$scope.hidePrevcompleted = 0;
				$scope.hideNextcompleted = 1;
			}else{
				$scope.hidePrevcompleted = 0;
				$scope.hideNextcompleted = 0;
			}
					
		});
		
		$scope.select.selectedIndex = 3;
		
		
		socketFactory.on('corporateScheduledRides', function(data) {
			
				$scope.sockos=data[0].data.paginated_rides;
				
				$scope.totalItemsScheduled = data[0].data.count;
				
				$scope.scheduledPages = parseInt($scope.totalItemsScheduled/15 + 1);
				
				if(($scope.scheduledPages > 1) && $scope.scheduledCurrentPage == $scope.scheduledPages){
					
				}
			
				$scope.scheduledFrom = (($scope.scheduledCurrentPage-1) * 15) + 1;

				
				$scope.scheduledTo = $scope.scheduledFrom - 1 + 15;
				
				if($scope.scheduledTo >= $scope.totalItemsScheduled){
					$scope.scheduledTo = $scope.totalItemsScheduled;
					$scope.hideNextscheduled = 1;
				
				}
				
				
				
				if($scope.scheduledCurrentPage == 1){
					$scope.hidePrevscheduled = 1;
					$scope.hideNextscheduled = 0;
				}else if($scope.scheduledCurrentPage == $scope.scheduledPages){
					$scope.hidePrevscheduled = 0;
					$scope.hideNextscheduled = 1;
				}else if($scope.scheduledTo >= $scope.totalItemsScheduled){
					$scope.hidePrevscheduled = 0;
					$scope.hideNextscheduled = 1;
				}else{
					$scope.hidePrevscheduled = 0;
					$scope.hideNextscheduled = 0;
				}
				
				
				var ScheduledRides = data[0].data.paginated_rides;
				
				$scope.scheduledrides = [];
				ScheduledRides.forEach(function(ride) {

					if(ride.session_id == 10007 ){
						
						}
					
					var r = ride;
					r.tzName = '';
					if(ride.pickup_time){
						var dt = new Date(ride.pickup_time)
						dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
						var raw = dt.toISOString();
						/**** r.pickup_time =  raw; ***/
						r.pickup_time_processed =  raw;
						
						//r.pickup_time_raw =  raw;
						r.pickup_time_original =  ride.pickup_time;
						
						r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
					}
					
					if(ride.start_time){
						var dt = new Date(ride.start_time)
						dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
						var raw = dt.toISOString();
						r.start_time =  raw;
						r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
					}
					
					if((r.tzName == "India Standard Time") || (r.tzName == "GMT+5:30")){
						r.tzName = 'IST';
					}
					var bounceData = ride.sent_to.split(',');
				
					if(ride.sent_to!=''){
						r.bounce = bounceData.length;;
					}else{
						r.bounce = 0;
					}
					
					var userName = ride.user_name.split(' ');
					var firstname, lastname;
					if(userName.length > 2){
						firstname = userName[0];
						lastname = userName[1]+' '+userName[2];
						
					}else if(userName.length == 2){
						firstname = userName[0];
						lastname = userName[1];
					}else{
						firstname = ride.user_name;
						lastname = '';
					}
		
					
					r.User_firstname = firstname;
					r.User_lastname = lastname;
					
					
					
					
					
					r.estimate_pickup_time_original = ride.estimate_pickup_time;
					r.estimate_pickup_time = Math.ceil(ride.estimate_pickup_time);
					r.estimate_pickup_time = Math.abs(r.estimate_pickup_time);
					
					r.estimate_diff_original = ride.estimate_diff;
					r.estimate_diff = Math.ceil(ride.estimate_diff);
					r.estimate_diff = Math.abs(r.estimate_diff);
					
					$scope.scheduledrides.push(r);
					
					if($scope.routeOffID){
						if(r.session_id == $scope.routeOffID){
							
							$scope.expandDisc(r);
							$scope.showonm(r);	
							
							localStorage.removeItem('routeOff');
							$scope.routeOffID = null;
						}
					}
					
					if($scope.classExpand == 1){
						if($scope.rideInFocus.session_id == r.session_id){
					
							$scope.expandDisc(r);
						}
					}
				});	
		});
			
		$scope.blocked = 1;	
		$scope.blockcheck = function(){
			$scope.blocked = 0;	
		}

						

		socketFactory.on('corporateRegularRides', function(data) {
			
			$scope.sockos=data[0].data.paginated_rides;
			
			$scope.totalItemsRegular = data[0].data.count;
			$scope.regularPages = parseInt($scope.totalItemsRegular/15 + 1);
			
			/*$scope.regularTo = $scope.regularFrom - 1 + 15;
			if($scope.regularTo > $scope.totalItemsRegular){
				$scope.regularTo = $scope.totalItemsRegular;
			}*/
			
			
			
			
			$scope.regularFrom = (($scope.regularCurrentPage-1) * 15) + 1;

				
			$scope.regularTo = $scope.regularFrom - 1 + 15;
			
			if($scope.regularTo >= $scope.totalItemsRegular){
				$scope.regularTo = $scope.totalItemsRegular;
				$scope.hideNext = 1;
				
			}
			
				
				
			
			if($scope.regularCurrentPage == 1){
				$scope.hidePrev = 1;
				$scope.hideNext = 0;
			}else if($scope.regularCurrentPage == $scope.regularPages){
				$scope.hidePrev = 0;
				$scope.hideNext = 1;
			}else if($scope.regularTo >= $scope.totalItemsRegular){
				$scope.hidePrev = 0;
				$scope.hideNext = 1;
			}else{
				$scope.hidePrev = 0;
				$scope.hideNext = 0;
			}
			
			if($scope.regularPages <=1){
				$scope.hidePrev = 1;
				$scope.hideNext = 1;
			}
			
			
			var RegularRides = data[0].data.paginated_rides;
			
			$scope.regular_rides = [
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{}
			];
			var newRegularData = [];
		
			var statscroll = $('table.table-full:last').scrollTop();
			
			
			RegularRides.forEach(function(ride) {
				var r = ride;
				if(r.ride_status == 3){
					
				}
				r.tzName = '';
				if(ride.start_time){
					var dt = new Date(ride.start_time)
					dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
					var raw = dt.toISOString();
					/***Old COde***/	
					/***r.start_time =  raw;***/
					
					/***New COde***/	
					r.start_time_processed =  raw;
					r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
				}else if(ride.pickup_time){
					var dt = new Date(ride.pickup_time)
					dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
					var raw = dt.toISOString();
					/****r.pickup_time =  raw;***/
					r.pickup_time_processed =  raw;
					r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
				}else if(ride.date){
					var dt = new Date(ride.date)
					/*dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
					var raw = dt.toISOString();
					r.date =  raw;*/
					r.tzName = dt.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
				}
				
				if((r.tzName == "India Standard Time") || (r.tzName == "GMT+5:30")){
					r.tzName = 'IST';
				}
				var string = "00:00";	
				r.timer = string;
				if(ride.ride_status==0 && ride.is_active ==1){
					
					var givendate = new Date(ride.date); 
					var givenmilliseconds = givendate.getTime(); 
					
					var nowdate = new Date(); 
					var nowmilliseconds = nowdate.getTime(); 
					
					var secondsSinceBooked = nowmilliseconds - givenmilliseconds;
					secondsSinceBooked = parseInt(secondsSinceBooked/1000);
					var lapsWindow = 135;
					if(secondsSinceBooked <= lapsWindow){
						var secsLeft = lapsWindow - secondsSinceBooked;
						var totalsecs = secsLeft;
						
						var mins = totalsecs/60;
						var cleanMins = parseInt(mins);
						
						var secs = totalsecs%60;
						secs = $scope.addZero(secs);
						cleanMins = $scope.addZero(cleanMins);

						string = cleanMins+':'+secs;
					}
					
					r.timer = string;
					
				}
				
				r.estimate_pickup_time_original = ride.estimate_pickup_time;
				r.estimate_pickup_time = Math.ceil(ride.estimate_pickup_time);
				r.estimate_pickup_time = Math.abs(r.estimate_pickup_time);
					
					
				//r.estimate_diff = ride.estimate_diff.replace('-','');
				r.estimate_diff = Math.ceil(ride.estimate_diff);
				r.estimate_diff = Math.abs(r.estimate_diff);
				
				if(ride.ride_status==1 && !$scope.centering ){
					$scope.centering = 1;
					
					setTimeout(function(){
						$scope.fakeCenter(ride,1);
					},0);
				}else{
					
				}
				

				var bounceData = ride.sent_to.split(',');
					
				if(ride.sent_to!=''){
					r.bounce = bounceData.length;;
				}else{
					r.bounce = 0;
				}
				var userName = ride.user_name.split(' ');
				var firstname, lastname;
				if(userName.length > 2){
					firstname = userName[0];
					lastname = userName[1]+' '+userName[2];
					
				}else if(userName.length == 2){
					firstname = userName[0];
					lastname = userName[1];
				}else{
					firstname = ride.user_name;
					lastname = '';
				}
			
				
				r.User_firstname = firstname;
				r.User_lastname = lastname;
				
				//$scope.regular_rides.push(r);
				newRegularData.push(r);
				
				if($scope.routeOffID){
					if(r.session_id == $scope.routeOffID){
					
						$scope.expandDisc(r);
						$scope.showonm(r);	
						localStorage.removeItem('routeOff');		
						$scope.routeOffID = null;
					}
				}
				
				if($scope.classExpand == 1){
					if($scope.rideInFocus.session_id == r.session_id){
					
						$scope.expandDisc(r);
					}
				}
				
			});	
		
			$scope.regular_rides = newRegularData;
		
			
			setTimeout(function(){
				$('#loading').modal('hide');
			},1300);
		});
				
	
		$scope.driverSkip = 0;
		
		$scope.monitorLiveData = function (){
			
				
				socketFactory.emit('corporateCompletedRequests', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.completedSkip , sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:2});
				
				socketFactory.emit('corporateScheduledRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.scheduleSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
				
				socketFactory.emit('corporateRegularRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.regularSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
			
				
				//socketFactory.emit('corporateDriverAvailablity', {limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
				
				$('#loading').modal('show');
					
				stop = $interval(function(){

					socketFactory.emit('corporateCompletedRequests', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.completedSkip , sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:2});
					
					socketFactory.emit('corporateScheduledRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.scheduleSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
					
					socketFactory.emit('corporateRegularRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.regularSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
					
					//socketFactory.emit('corporateDriverAvailablity', {limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
					
                },8000)
				
		}
		
		
			var gettingDrivers;
			$scope.driverEnable = 0;
			
			$scope.enableDrivers = function(){
				$scope.search_session_id = undefined;
				$scope.driverEnable = !$scope.driverEnable;
			
				
				if($scope.driverEnable == 1){
					socketFactory.emit('corporateDriverAvailablity', {session_id:$scope.search_session_id,limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
					gettingDrivers = $interval(function(){
						socketFactory.emit('corporateDriverAvailablity', {session_id:$scope.search_session_id,limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
					},8000);
				
				}else{
					$interval.cancel(gettingDrivers);		
			
					gettingDrivers = 0;
					$scope.cleanDrivers();
				}
				
			}
			$scope.disableDrivers = function(){
				
				$interval.cancel(gettingDrivers);		
				
				$scope.availableCurrentPage = 0;
				$scope.availableCarsPages = 0;
				$scope.countAvailableCars = 0;
				
				$scope.availableFrom = 0;
				$scope.availableTo = 0;
				
				gettingDrivers = 0;
				$scope.cleanDrivers();
				setTimeout(function(){
					$scope.cleanDrivers();
				},1000);
			}
			$scope.cleanDrivers = function(id){
				if(id){
				
				}else{
					
					$scope.availableCurrentPage = 0;
					$scope.availableCarsPages = 0;
					$scope.countAvailableCars = 0;
					
					$scope.availableFrom = 0;
					$scope.availableTo = 0;
				}
			
				for(i = 0; i<markers.length;i++){
					if(markers[i].driver_id == id){
						
					}else{
						markers[i].marker.setMap(null);
					}
				}
			}
			
			$scope.availableCurrentPage = 0;
			$scope.availableFrom = 0;
			$scope.availableTo = 0;
				
			socketFactory.on('corporateDriverAvailablity', function(data) {
				
				
				
				$scope.countAvailableCars = data[0].data.total_drivers[0].total_drivers;
				$scope.totalAvailableCars = data[0].data.total_drivers[0].total_drivers;
				
				if($scope.availableCurrentPage == 0){
					$scope.availableCurrentPage = 1;
					
				}
				
				$scope.availableFrom = (($scope.availableCurrentPage-1) * $scope.driverLimit) + 1;
				$scope.availableTo = $scope.availableFrom - 1 + $scope.driverLimit;
					
				
				if($scope.availableTo >= $scope.totalAvailableCars){
					$scope.availableTo = $scope.totalAvailableCars;
					$scope.hideNextAV = 1;
				
				}
				
				if($scope.totalAvailableCars == 0){
					$scope.availableFrom = 0;
					$scope.availableTo = 0;
				}
				
				$scope.avail = data[0].data.drivers;
				
				$scope.driverToFocus = [];
				$scope.driverToFocus = $scope.avail;
								
			
				
				if(!$scope.dsearchFlag){
					//$scope.totalAvailableCars = $scope.totalAvailableCars/ $scope.driverLimit + 1;
				}
				$scope.availableCarsPages = parseInt($scope.totalAvailableCars/ $scope.driverLimit)+ 1;
									
									
				if(($scope.availableCurrentPage == 1) && ($scope.availableCarsPages == 1)){
					//$scope.hidePrevsAV = 0;
					//$scope.hideNextAV = 0;
					$scope.hidePrevsAV = 1;
					$scope.hideNextAV = 1;
				}/*else if($scope.availableCurrentPage == 1){
					$scope.hidePrevsAV = 1;
					$scope.hideNextAV = 0;
				}*/else if($scope.availableCurrentPage == $scope.availableCarsPages){
					$scope.hidePrevsAV = 0;
					$scope.hideNextAV = 1;
				}else if($scope.availableTo >= $scope.totalAvailableCars){
					$scope.hidePrevsAV = 0;
					$scope.hideNextAV = 1;
				}else{
					$scope.hidePrevsAV = 0;
					$scope.hideNextAV = 0;
				}
				
				if($scope.dsearchFlag && !($scope.routeMode)){
					if($scope.avail[0]){
						
						if((!$scope.lastBounds) || ($scope.lastBounds.searched != $scope.dsearchString)|| ($scope.lastBounds.size != $scope.avail.length)){
						$scope.cleanDrivers();
						map.setZoom(16);
							/*	var newlatlng = new google.maps.LatLng($scope.avail[0].current_location_latitude, $scope.avail[0].current_location_longitude);
									
							map.setCenter(newlatlng);
							$scope.driverZoom = map.getZoom();
						
							map.setZoom($scope.driverZoom);
							
							*/
							/** get all drivers coordinates and set map bounds **/
							
								var pointers = [];
								for(p=0; p<$scope.avail.length; p++){
									var obj = {lat:$scope.avail[p].current_location_latitude,lng:$scope.avail[p].current_location_longitude};
									
									pointers.push(obj);
								}
								
								
								$scope.setBoundsNow(pointers);
							
						}else{
							
						}
					}
				}
				
				
				 var url;
                    var urlGoing;
                    var image = {
                        url: url,
                        scaledSize: new google.maps.Size(33, 33),
                        anchor: new google.maps.Point(16.5, 16.5)
                    };
                    
                    $scope.avl = new Array();
                    _.each($scope.avail, function (key, value) {
                        $scope.avl.push(_.pick(key, 'current_location_latitude', 'current_location_longitude'));
                    });
                  
                    for (var i = 0; i < $scope.avl.length; i++) {
						
						if($scope.avail[i].is_free ==1 ){
						
							if($scope.avail[i].car_type == 2) {
								url = 'assets/carTypeImage/QLE/3_White_QLE.svg';
								urlGoing = 'assets/carTypeImage/QLE/2_Blue_QLE.svg';
							} else if($scope.avail[i].car_type == 1) {
								url = 'assets/img/driver_idle.svg';
								urlGoing = 'assets/img/driver_intransit.svg';
							} else if($scope.avail[i].car_type == 3) {
								url = 'assets/carTypeImage/LUXE/3_White_LUXE.svg';
								urlGoing = 'assets/carTypeImage/LUXE/2_Blue_LUXE.svg';
							} else if($scope.avail[i].car_type == 4) {
								url = 'assets/carTypeImage/Grande/3_White_Grande.svg';
								urlGoing = 'assets/carTypeImage/Grande/2_Blue_Grande.svg';
							}else{
								url = 'assets/carTypeImage/QLE/3_White_QLE.svg';
								urlGoing = 'assets/carTypeImage/QLE/2_Blue_QLE.svg';
							}
						}else{
							
							if($scope.avail[i].car_type == 1) {
								url = 'assets/carTypeImage/QLE/2_Blue_QLE.svg';
							}else if($scope.avail[i].car_type == 2) {
								url = 'assets/carTypeImage/LUXE/2_Blue_LUXE.svg';
							}else if($scope.avail[i].car_type == 3) {
								url = 'assets/carTypeImage/Grande/2_Blue_Grande.svg';
							}else{
								url = 'assets/carTypeImage/Grande/2_Blue_Grande.svg';
							}
						}
						
						
						
                        var infowindow = new google.maps.InfoWindow({
                            content: "<div id='" + $scope.avail[i].driver_id + "' style='font-size: 9px;'>" +
                            "<span></span>  <span>" + $scope.avail[i].driver_name + "</span><br>" +
                            "</div>",
                            disableAutoPan: true
                        });
                        image.url = `${url}#${$scope.avail[i].driver_id}`;
						
                       /* if (ongoingDriverIds.includes($scope.avail[i].driver_id)) {
                            image.url = `${urlGoing}#${$scope.avail[i].driver_id}`;
                        }*/
                        setMarker($scope.avail[i], { image, infowindow, rotation })
                      
					}
					
					
					
					
			});
				
				
				
				



		$scope.availableCurrentPage = 0;
		$scope.totalAvailableCars = 1;
		$scope.availableCarsPages = 0;
		$scope.countAvailableCars = 0;
		$scope.hidePrevsAV = 1;
		$scope.hideNextAV = 1;







			$scope.searchD = function(){
				
				$scope.dsearchString = $scope.searchDriver;
				$scope.availableCurrentPage = 1;
				if(!$scope.searchDriver || $scope.searchDriver == ''){
					
					var newlatlng = new google.maps.LatLng($scope.driverDetails.latitude, $scope.driverDetails.longitude);
						
					map.setCenter(newlatlng);
					map.setZoom($scope.defaultZoom);
					$scope.dsearchFlag = 0;				
										
				}else{
					$scope.cleanDrivers();
					
					$scope.dsearchFlag = 1;		
					$scope.routeMode = 0;
					
					/*$scope.driverSearchAPI*/
				}
				
				
				socketFactory.emit('corporateDriverAvailablity', {limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
			}
					
			
                $scope.searchL=function(data, id){
				
					$scope.searchFlag = 0;
					if(data != ''){
						$scope.searchFlag = 1;
					}
					$scope.searchString = data;
					
					
                    if(id==0){	
					
					}else if(id==1) {
                       socketFactory.emit('corporateCompletedRequests', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.completedSkip , sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:2});
                       
					}else if(id==2){
                        socketFactory.emit('corporateScheduledRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.scheduleSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
                      
					}
                }



				
    
		/*socketFactory.on('completedRequests', function(data) {
			
			$scope.sockoc=data[0].data.paginated_rides;
			$scope.completedRides=$scope.sockoc;
			
		});*/

		var bounds = new google.maps.LatLngBounds();

	
		$scope.driverDetails.latitude = driverModel.latitude;
		$scope.driverDetails.longitude = driverModel.longitude;
	
		if(!$scope.driverDetails.latitude){
			var center = {lat: 40.732210, lng: -73.919020};
			var zoom = 11;
		}else{
			var center = {lat: $scope.driverDetails.latitude, lng: $scope.driverDetails.longitude};
			var zoom = 13;
		}
        
		
		var map = new google.maps.Map(document.getElementById('map'), {
			
			zoom:zoom,
			center: center,
			
            streetViewControl: false,
            mapTypeControl: false,

            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }

        });
		
		

   		
		
	var ny = {lat: 40.732210, lng: -73.919020};

	$scope.addYourLocationButton = function(map, marker) {
			var controlDiv = document.createElement('div');

			var firstChild = document.createElement('button');
			firstChild.style.backgroundColor = '#fff';
			firstChild.style.border = 'none';
			firstChild.style.outline = 'none';
			firstChild.style.width = '28px';
			firstChild.style.height = '28px';
			firstChild.style.borderRadius = '2px';
			firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
			firstChild.style.cursor = 'pointer';
			firstChild.style.marginRight = '10px';
			firstChild.style.padding = '0px';
			firstChild.title = 'Your Location';
			controlDiv.appendChild(firstChild);

			var secondChild = document.createElement('div');
			secondChild.style.margin = '5px';
			secondChild.style.width = '18px';
			secondChild.style.height = '18px';
			secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
			secondChild.style.backgroundSize = '180px 18px';
			secondChild.style.backgroundPosition = '0px 0px';
			secondChild.style.backgroundRepeat = 'no-repeat';
			secondChild.id = 'you_location_img';
			firstChild.appendChild(secondChild);

			google.maps.event.addListener(map, 'dragend', function() {
				$('#you_location_img').css('background-position', '0px 0px');
			});

			firstChild.addEventListener('click', function() {
				var imgX = '0';
				var animationInterval = setInterval(function(){
					if(imgX == '-18') imgX = '0';
					else imgX = '-18';
					$('#you_location_img').css('background-position', imgX+'px 0px');
				}, 500);
				if(navigator.geolocation) {
					
					navigator.geolocation.getCurrentPosition(function(position) {
						var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						marker.setPosition(latlng);
						map.setCenter(latlng);
						clearInterval(animationInterval);
						$('#you_location_img').css('background-position', '-144px 0px');
					});
				}
				else{
					clearInterval(animationInterval);
					$('#you_location_img').css('background-position', '0px 0px');
				}
			});

			controlDiv.index = 1;
			map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	}
	
	
	var myMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        //position: ny
    });
    $scope.addYourLocationButton(map, myMarker);
		
		
		
	$scope.loadPlaces = function(){
		
		var autocomplete = {};
		var autocompletesWraps = ['searchLocation'];
		$.each(autocompletesWraps, function(index, name) {
			
			if($('#'+name).length == 0) {
				return;
			}
			autocomplete[name] = new google.maps.places.Autocomplete($('#'+name+'.autocomplete')[0],);
				
			google.maps.event.addListener(autocomplete[name], 'place_changed', function() {
			
				var place = autocomplete[name].getPlace();
				if(!place.geometry){
					alert('Location not found, Please select from the suggested locations!!');
					return;
				}
			
				
					var latitude = place.geometry.location.lat();
					var longitude = place.geometry.location.lng();
					
					var newlatlng = new google.maps.LatLng(latitude, longitude);
				
					map.setCenter(newlatlng);
					map.setZoom($scope.driverZoom);
				
			});
		});
	}
	
	$scope.loadPlaces();
	
	  	
	$scope.showonm = function(data) {
		
	$scope.MapShow = true;
	$scope.CarShow = false;
	$scope.UserShow = false;
	
		var routeState = {}
		if (data['session_id']) {
			routeState = {
				key: 'session_id',
				id: data.session_id
			}
			$scope.strtloca = data.pickup_latitude + ',' + data.pickup_longitude;
			
			$scope.strtlocaObj = {lat:data.pickup_latitude,lng:data.pickup_longitude};
			
		} else if (data['pickup_id']) {
			routeState = {
				key: 'pickup_id',
				id: data.pickup_id
			}
			$scope.strtloca = data.latitude + ',' + data.longitude;
			$scope.strtlocaObj = {lat:data.latitude,lng:data.longitude};
		}
		
		$scope.routeMode = 1;
		
		$scope.drvObj = {lat:data.current_location_latitude,lng:data.current_location_longitude};
		
		/*$scope.routeState = routeState;
		$scope.mdes = data.manual_destination_latitude + ','+ data.manual_destination_longitude;
		$scope.mdesObj = {lat:data.manual_destination_latitude,lng:data.manual_destination_longitude};
		$scope.getDirections();
		*/
		if ($scope.routeState && $scope.routeState.key == routeState.key && $scope.routeState.id == routeState.id) {
			
			directionsDisplay.setMap(null);
			$scope.routeState = {};
		} else {
			$scope.routeState = routeState;
			$scope.mdes = data.manual_destination_latitude + ','+ data.manual_destination_longitude;
			$scope.mdesObj = {lat:data.manual_destination_latitude,lng:data.manual_destination_longitude};
			$scope.getDirections();
			
		}
	}
		
		
     
	$scope.getDirections = function () {
		directionsDisplay.setMap(null);
		directionsDisplay.setMap(map);

		var request = {
			origin: $scope.strtloca,
			destination: $scope.mdes,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};

		directionsService.route(request, function (response, status) {

			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				

				if($scope.fakeThisId == $scope.routeState.id){
					
					$scope.search_session_id = $scope.fakeThisId;
					/**** Displayed driver marker but to show this moving need to set Interval ******/	
					socketFactory.emit('corporateDriverAvailablity', {session_id:$scope.search_session_id,limit:$scope.driverLimit,offset:$scope.driverSkip, searchFlag:$scope.dsearchFlag, searchString:$scope.dsearchString});
					setTimeout(function(){
						$scope.setCenterNow();
					},200);
				}
				
			} else {
				alert('Google route unsuccesfull!');
			}
		});
		
	}
		
	
	$scope.fakeThisId = 0;
	
	$scope.fakeCenter = function(ride,force){			
	
		if($scope.routeState.id == ride.session_id){
			$scope.strtlocaObj = {lat:ride.pickup_latitude,lng:ride.pickup_longitude};
			$scope.mdesObj = {lat:ride.manual_destination_latitude,lng:ride.manual_destination_longitude};	
			if(ride.current_location_latitude){
				$scope.drvObj = {lat:ride.current_location_latitude,lng:ride.current_location_longitude};
			}else{
				
				$scope.drvObj = {lat:40.710344,lng:-73.79898};
			}
			
			
			$scope.fakeThisId = ride.session_id;
			if(force){
				
				$scope.setCenterNow();
			}
			$scope.centering = 1;
		}else{
			
			$scope.showonm(ride);
			setTimeout(function(){
				$scope.fakeCenter(ride);
			},0);
		}
	}
			
			
	$scope.setCenterNow = function() {
		
		var pointers = [
			$scope.strtlocaObj,
			$scope.mdesObj,
			$scope.drvObj,
		];
		
		if($scope.drvObj.lat != null){
			for (i = 0; i < pointers.length; i++) {
				var data = pointers[i]
				if(data.lat==null){continue;}
				var myLatlng = new google.maps.LatLng(data.lat, data.lng);
				

				marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: '',
					icon: null,
					visible: false
				});
				
				bounds.extend(marker.position);	
			}
			map.setCenter(bounds.getCenter());
			
			zoomlevel = map.getZoom();
			map.setZoom(zoomlevel);
		}else{
			
		}
		
	}
				
	$scope.setBoundsNow = function(pointers) {
		map.setZoom(16);
		if(!pointers){
			var pointers = [
				$scope.strtlocaObj,
				$scope.mdesObj,
				$scope.drvObj,
			];
		
		}
		if(pointers.length > 0){
			
			for (i = 0; i < pointers.length; i++) {
				var data = pointers[i]
				if(data.lat==null){continue;}
				var myLatlng = new google.maps.LatLng(data.lat, data.lng);
				

				marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: '',
					icon: null,
					visible: false
				});
				
				bounds.extend(marker.position);	
			}
			map.setCenter(bounds.getCenter());
			
			map.fitBounds(bounds);
			zoomlevel = map.getZoom();
			//map.setZoom(zoomlevel);
			$scope.driverZoom = zoomlevel;
			$scope.lastBounds = {searched:$scope.dsearchString,size:pointers.length,zoom:zoomlevel}
		
		}else{
		
		}
		
	}
		
        
		
        function move (driverMarker, wait) {
            if(driverMarker.path.length > 0) {
                driverMarker.isMoving = true;
                driverMarker.marker.setPosition(driverMarker.path[0][0]);
                let url = driverMarker.marker.getIcon().url;
                var markerImg = document.querySelector(`img[src="${url}"]`);
                if (markerImg) {
                    var deg = driverMarker.path[0][1];
                    markerImg.style.transform = 'rotate(' + deg + 'deg)'
                }
                driverMarker.path.splice(0, 1);
                setTimeout(function() {
                    move(driverMarker, wait); 
                }, wait);
                let icon = driverMarker.marker.getIcon();
                driverMarker.marker.setIcon(icon);
            } else {
                driverMarker.isMoving = false;
            }
        }
		
		
		 function setMarker (driverData, { image, infowindow, rotation }){
			
            var driverMarker = _.find(markers,{'driver_id':driverData.driver_id});
            var location = new google.maps.LatLng(driverData.current_location_latitude , driverData.current_location_longitude);
            var marker;
            if(driverMarker) {
				
                let prevPos = driverMarker.marker.getPosition();
                if (driverMarker.path.length > 0) {
                    prevPos = driverMarker.path[driverMarker.path.length - 1][0];
                }
                let icon = driverMarker.marker.getIcon();
                icon.url = image.url;
                driverMarker.marker.setIcon(icon)
    driverMarker.marker.setMap(map);
                var rotation = google.maps.geometry.spherical.computeHeading(prevPos, location);
                let fromLat = prevPos.lat();
                let fromLng = prevPos.lng();
                let toLat = location.lat();
                let toLng = location.lng();
                if (fromLat != toLat || fromLng != toLng) {
                    let diff = Date.now() - driverMarker.time;
                    driverMarker.time = Date.now();
                    let frames = driverMarker.path;
                    let hasPath = false;
                    if (frames.length > 0) {
                        hasPath = true;
                    }
                    if (diff > 2000 ) {
                        diff = 1000;
                    }
                    if (frames.length >= 100) {
                        frames = []
                    }

 
                    for (var percent = 0; percent < 1; percent += 0.01) {
                        let curLat = fromLat + percent * (toLat - fromLat);
                        let curLng = fromLng + percent * (toLng - fromLng);
                        frames.push([new google.maps.LatLng(curLat, curLng), rotation]);
                    }
                    driverMarker.path = frames;
                    if (!hasPath) {
                        move(driverMarker, diff / 100);
                    } else if (!driverMarker.isMoving) {
                        move(driverMarker, diff / 100);
                    } else {
                        move(driverMarker, 0.5);
                    }
                } 
                marker = driverMarker.marker;
            }else{
			
                marker = new google.maps.Marker({
                    position: location,
                    icon: image,
                    map: map,
                    infoWindow: infowindow,
                });
                marker.addListener('click', function (e) {
                    marker.infoWindow.open(map, this);
                    setTimeout(function() {
                        var contentDiv = $('.gm-style-iw');
                        contentDiv.next('div').hide();
                        contentDiv.prev('div.custom-close').remove();
                        var closeBtn =
                            `<div class="custom-close" id="${driverData.driver_id}">
                                <img alt="" src="https://maps.gstatic.com/mapfiles/api-3/images/mapcnt6.png" draggable="false" style="position: absolute; left: -2px; top: -336px; width: 59px; height: 492px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;">
                            </div>`;
                        $(closeBtn).insertBefore(contentDiv)
                        $('div.custom-close').bind('click', function(e) {
                            $(e.target).parent().parent().css({opacity: 0, 'pointer-events': 'none'});
                        });
                    });
                });
               
                new google.maps.event.trigger( marker, 'click' );
                markers.push({
                    driver_id:driverData.driver_id,
                    marker: marker,
                    time: Date.now(),
                    path: [],
                    isMoving: false,
                });
                // setTimeout(function() {
                // });
            }
            return marker;
        }

		$scope.$on('$destroy', function (event)
        {	
			$('#loading').modal('hide');
		   $interval.cancel(stop);
		
			stop = undefined;
        });
		
		
		
	$scope.cancelRidePopup = function(session_id){
		
		$scope.triptoCancel = session_id;

	};
	$scope.cancelRide = function(trip){
			
		
	
		if(trip){
			$('#loading').modal('show');
			 $.post(MY_CONSTANT.urlC+ 'cancel_ride', {
				web_access_token:  $cookieStore.get('web_access_token'),				
				session_id:trip			
				//pickup_id:trip			
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
							
					if(data.error || data.flag==0){
						$('#loading').modal('hide');	
						$rootScope.openToast('error',data.error || data.message,'')	;
						
						  return;
					}else{
						
						$rootScope.openToast('success', 'Ride Cancelled Successfully', '');
						setTimeout(function(){
							$('#loading').modal('hide');									
						},1000);
					}
					
					socketFactory.emit('corporateCompletedRequests', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.completedSkip , sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:2});
				
					socketFactory.emit('corporateScheduledRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.scheduleSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
				
					socketFactory.emit('corporateRegularRides', {corporate_id:$scope.driverDetails.corporate_id, limit:15,offset:$scope.regularSkip, sort_by:'' , sort_order:'' , searchFlag:$scope.searchFlag, searchString:$scope.searchString, requestType:5});
		
				});
			});
		}else{
			alert('No pickup_id is found');
			$('#loading').modal('hide');
		}
	}
	
	
	
	
	
	$scope.sendRiderCardLink = function(){
		$('#loading').modal('show');
		 $.post(MY_CONSTANT.urlC+ 'ride_payment_user_card_send_link', {
			web_access_token:  $cookieStore.get('web_access_token'),				
			user_id:$scope.booking.user_id,
		}) .then(function successCallback(data) {
			$rootScope.$apply(function () { 
		
				if (typeof(data) == 'string') data = JSON.parse(data);
					
				if(data.error || data.flag==0){
					$('#loading').modal('hide');
					$rootScope.openToast('error',data.error || data.message,'')	;
					
					  return;
				}else{
					$('#loading').modal('hide');
					$('#showRiderCardError').modal('hide');
					// $('#payment_step').modal('hide');
					$scope.disableCRA = true;
					
					$rootScope.openToast('success', data.log, '');
					$timeout(function(){
						$scope.disableCRA = false;
					},9000)
				}
		
			});
			
		});
	}
	
	
	
	
	
	
	
	
	
	$scope.validateRebookingDateTime = function(){
		var datedata = $scope.rebooking.date.split(', ');
	
		
		
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
			
		
			var hour_difference = 	sh - parseInt($scope.rebooking.time_hour);
			var min_difference = 	sm - parseInt($scope.rebooking.time_minutes);
			
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
	$scope.validateReBookingData = function(){
		if(!$scope.rebooking.date){
			alert("Please enter Date of travel");
			return 0;
		}else if(!$scope.rebooking.time_hour || ($scope.rebooking.time_hour == '')){
			alert("Please select Time.");
			return 0;
		}else if(!$scope.rebooking.time_minutes){
			alert("Please select Time minutes.");
			return 0;
		}else if($scope.validateRebookingDateTime()==0){
			alert("Please select minimum one hour from now.");
			return 0;
		}else if($scope.validateRebookingDateTime()==8){
			alert("You are allowed to book a scheduled ride for upto next 6 days only");
			return 0;
		}else{
			return 1;
		}
		
	}
	
	
	
	
	
	
	
	
	$scope.rescheduleNow = function(){
		$scope.DisableOnReschd = true;
		if(!$scope.rebooking || !$scope.rebooking.time_hour || !$scope.rebooking.date || !$scope.rebooking.time_minutes){
			$scope.DisableOnReschd = false;
			alert("Please enter Date and Time");	
			return;
		}
		
		if(!$scope.validateReBookingData()){
			$scope.DisableOnReschd = false;
			return false;
		}
		
		
		var datedata = $scope.rebooking.date.split(', ');
		
		$scope.rebooking.time =datedata[0]+' '+$scope.rebooking.time_hour+':'+$scope.rebooking.time_minutes+':00';
		
		
		//$scope.rebooking.time = $scope.rebooking.date+' '+$scope.rebooking.time_hour+':'+$scope.rebooking.time_minutes;
		
		
		
		if(!$scope.rTrip.pickup_id){
			alert('Pickup ID is not found');
			$scope.DisableOnReschd = false;
			return false;
		}
		
		 $.post(MY_CONSTANT.urlC+ 'modify_schedule', {
				web_access_token:  $cookieStore.get('web_access_token'),				
				pickup_id:$scope.rTrip.pickup_id,
				pickup_time:$scope.rebooking.time,
				latitude:$scope.rTrip.pickup_latitude,
				longitude:$scope.rTrip.pickup_longitude,
				offset:new Date().getTimezoneOffset()*-1,
				manual_destination_latitude : $scope.rTrip.manual_destination_latitude,
				manual_destination_longitude : $scope.rTrip.manual_destination_longitude,
				manual_destination_address : $scope.rTrip.manual_destination_address,
			}) .then(function successCallback(data) {
				$rootScope.$apply(function () { 
				
					if (typeof(data) == 'string') data = JSON.parse(data);
							
						if(data.error || data.flag==0){
							
							setTimeout(function(){
								$scope.DisableOnReschd = false;
							},1500);
							$rootScope.openToast('error', data.error || data.message, '');

							  return;
						}else{
							$('#reschedule').modal('hide');
							setTimeout(function(){
								$scope.DisableOnReschd = false;
							},1500);
							$rootScope.openToast('success', data.log, '');
						
							
							
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
		
		$scope.rebooking.date = dateOfPickup;
	}
	
	$scope.setTime = function(stamp){
		var hours = new Date(stamp).getHours();
		var hours = (hours < 10) ? "0" + hours : ''+hours;
		$scope.rebooking.time_hour = hours;
		
		
		
		var mins =  new Date(stamp).getMinutes();
		var mins = (mins < 10) ? "0" + mins : ''+mins;
		
		$scope.rebooking.time_minutes = mins;
	}
	
	
    $scope.rescheduleRide = function(ride){
		var tripDetails = ride;
		
		
		$scope.rTrip = tripDetails;
		$scope.rebooking = {};
		
		
		  
		
		
		
		
		
		/** Now this is used**/
		$scope.rebooking.date = $scope.booking.date;
		
		$scope.rebooking.time_hour = $scope.booking.time_hour;	  
		$scope.rebooking.time_minutes = $scope.booking.time_minutes;	
		
	}
	
	
	
	
	$scope.monitorLiveData();
	
	
	
	/*******NOT IN USE********/	
				
				
				
	/*******NOT IN USE********/			
		
	$scope.getButtonText = function(index,req,is_active) {
            switch(index) {
                case 0:
					if(req ==1){
						return "Accepted";
					}else if(req ==10){
						//return "Lapsed";
						return "Missed";
					}else if(req == null && is_active == 0){
						return "Missed";  
					}else{
						return "Assigning";  
					}
				case 1:
                    return "Picking Up";
                case 2:
                    return "Arrived";
                case 3:
                    return "En Route";
                case 4:
                    return "Completed";
				case 5:
                    //return "Cancelled By Driver";
                    return "Cancelled";
				case 6:
                    //return "Cancelled By Rider";
					 return "Cancelled";
				 case 7:
                    //return "Cancelled By Rider";
					 return "Cancelled";
				case 8:
                    //return "Unsuccessful Payment";
					 return "Unsuccessful";	
				case 9:
                    //return "Cancelled by Admin";
					 return "Cancelled";
				case 11:
                    //return "Cancelled By Corporate";
					 return "Cancelled";
                default:
                    return index+' '+req;

            }
        } 
		
		$scope.getButtonClass = function(index,req,is_active) {
            switch(index) {
                case 0:
					if(req ==1){
						return "blue";
					}else if(req ==10){
						//return "Lapsed";
						return "black";
					}else if(req == null && is_active == 0){
						return "black";  
					}else{
						return "green";  
					}
				case 1:
                    return "blue";
                case 2:
                    return "blue";
                case 3:
                    return "blue";
                case 4:
                    return "blue";
				case 5:
                    //return "Cancelled By Driver";
                    return "black";
				case 6:
                    //return "Cancelled By Rider";
					 return "black";
				 case 7:
                    //return "Cancelled By Rider";
					 return "black";
				case 8:
                    //return "Unsuccessful Payment";
					 return "black";	
				case 9:
                    //return "Cancelled by Admin";
					 return "black";
				case 11:
                    //return "Cancelled By Corporate";
					 return "black";
                default:
                    return index+' '+req;

            }
        }
		
		
		$scope.getTripStatus = function(index,req,is_active,is_schedule) {
		
		if($scope.rideInFocus.driver_name == null){
			$scope.rideInFocus.driver_name = ' - ';
		}
		if($scope.rideInFocus.estimate_pickup_time == null){
			$scope.rideInFocus.estimate_pickup_time = '00:00';
		}
		if($scope.rideInFocus.estimate_diff == "NaN"){
			$scope.rideInFocus.estimate_diff = '0';
		}
							
							
			if(is_schedule == "1"){
				 switch(index) {
					case 0:
						if(req ==1){
							return "Accepted<br>Total Payment: "+$scope.fare_calculated;
						}else if(req ==10){
							//return "Lapsed";
							return "Missed";
						}else if(req == null && is_active == 0){
							return "Missed";  
						}else{
							//return "Driver Time to Accept<br>"+$scope.estimate_pickup_time+" mins";  
							return "Assigning";  
						}
					case 1:
						//return "Picking Up";
						return "Estimate to Pickup<br>"+$scope.rideInFocus.estimate_pickup_time+" mins";  
					case 2:
						return "Arrived";
					case 3:
						return "Estimate to Arrival<br>"+$scope.rideInFocus.estimate_diff+" mins";  
					case 4:
						return "Completed<br>"+$scope.fare_calculated;
					case 5:
						return "Cancelled By Driver<br>Driver: "+$scope.rideInFocus.driver_name;
						
					case 6:
						return "Cancelled By Rider";
						 
					 case 7:
						return "Cancelled By Rider";
						
					case 8:
						return "Unsuccessful Payment";						
					case 9:
						return "Cancelled by Admin";
						 
					case 11:
						return "Cancelled By Corporate";
						
					default:
						return index+' '+req;

				}
			}else if(is_schedule == "0"){
				 switch(index) {
					case 0:
						if(req ==1){
							return "Accepted<br>Total Payment: "+$scope.fare_calculated;
						}else if(req ==10){
							//return "Lapsed";
							return "Missed";
						}else if(req == null && is_active == 0){
							return "Missed";  
						}else{
							
							return "Driver Time to Accept<br>"+$scope.rideInFocus.timer+" mins";  
						}
					case 1:
						return "Estimate to Pickup<br>"+$scope.rideInFocus.estimate_pickup_time+" mins";  
					case 2:
						return "Arrived";
					case 3:
						return "Estimate to Arrival<br>"+$scope.rideInFocus.estimate_diff+" mins";  
					case 4:
					return "Completed<br>"+$scope.fare_calculated;
					case 5:
						//return "Cancelled By Driver";
						return "Cancelled";
					case 6:
						//return "Cancelled By Rider";
						 return "Cancelled";
					 case 7:
						//return "Cancelled By Rider";
						 return "Cancelled";
					case 8:
						return "Unsuccessful Payment";
						// return "Cancelled";	
					case 9:
						//return "Cancelled by Admin";
						 return "Cancelled";
					case 11:
						//return "Cancelled By Corporate";
						 return "Cancelled";
					default:
						return index+' '+req;

				}
			}
			
		}
		
		
});

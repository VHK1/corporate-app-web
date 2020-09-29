App.controller('paymentSettingsController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $timeout, tokenLogin) {

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
	$scope.settings = {};
    $scope.pop={};
    $scope.pop.myDate = new Date();
    $scope.pop.isOpen = false;
    $scope.Users = [];
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    $scope.userDetails = [];
    $scope.driverDetails = [];
  
    if (driverModel) {
        $scope.userDetails.userName = driverModel.user_name;
        $scope.userDetails.userImage = driverModel.user_image;
        $scope.driverID=driverModel.vendor_id;
        $scope.driverDetails.driver_name = driverModel.driver_name;
       
		$scope.driverDetails.driver_image = driverModel.driver_image;
        $scope.driverDetails.driver_email = driverModel.email;
        $scope.driverDetails.driver_mobile = driverModel.mobile;
        $scope.driverDetails.driver_refcode = driverModel.referral_code;
        $scope.driverDetails.subtype_id = driverModel.subtype_id;
    } else {
		
        $cookieStore.remove('access_token');
       $state.go("corporate_login");
    }

    
    $scope.logout = function() {
        $('.modal').modal('hide');
        $cookieStore.remove('access_token');
       $state.go("corporate_login");
    };
   
	  $scope.initTable = function(searchflag) {
      
	  
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
    $scope.initTable();
	
	
	$scope.changeRiderSetting = function() {
		
		if((!$scope.RiderCard) && !$scope.settings.CorpCardEnabled){
			// $scope.openToast('error', "You must enable one payment type", '');
			alert("You must enable one payment type");
			$scope.settings.RiderCardEnabled = true;
			$scope.RiderCard = true;
		}else if((!$scope.RiderCard) && $scope.settings.CorpCardEnabled){
			$scope.settings.RiderCardEnabled = false;
			$scope.RiderCard = false;
			$scope.updatePayment(2);
		}else{
			$scope.settings.RiderCardEnabled = $scope.RiderCard;
			//$scope.settings.CorpCardEnabled = !$scope.RiderCard;
			if($scope.settings.CorpCardEnabled == true){
				$scope.updatePayment(1);
			}else{
				$scope.updatePayment(3);
			}
		}
		
	}
	
	$scope.changeCorpSetting = function() {
		if((!$scope.CorpCard) && !$scope.settings.RiderCardEnabled){
			alert("You must enable one payment type");
			// $scope.openToast('error', "You must enable one payment type", '');
			$scope.settings.CorpCardEnabled = true;
			$scope.CorpCard = true;
		}else if((!$scope.CorpCard) && $scope.settings.RiderCardEnabled){
			$scope.settings.CorpCardEnabled = false;
			$scope.CorpCard = false;
			$scope.updatePayment(3);
		}else{
			$scope.settings.CorpCardEnabled = $scope.CorpCard;
			//$scope.settings.RiderCardEnabled = !$scope.CorpCard;
			
			if($scope.settings.RiderCardEnabled == true){
				$scope.updatePayment(1);
			}else{
				$scope.updatePayment(2);
			}
		}
		
	}
	
	$scope.updatePayment = function(card_used){
		
		$.post(MY_CONSTANT.urlC + 'edit_corporate_card_payment_option',{
			web_access_token : $cookieStore.get("web_access_token"),
			card_used:card_used
		})
		.then(function successCallback(data, status) {
			$rootScope.$apply(function () { 
					if (typeof(data) == 'string')
						data = JSON.parse(data);
					else data = data;
					
					if (data.flag == 101) {
						$scope.showCredentialsAlert();
					}
					$('#loading').modal('show');
					setTimeout(function(){
						$('#loading').modal('hide');
						$scope.initTable();
					},2000);
			});
		});
		
		
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
                //$scope.$apply();
				
            }
        }
        $scope.initTable();
    };

});

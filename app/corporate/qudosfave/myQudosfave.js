App.controller('myQudosfaveController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $timeout, tokenLogin) {
  
/*    if(getParameterByName('web_access_token')){
        tokenLogin.driverTokenLogin();
    }*/
	$scope.currentPage = 1;
	$scope.skip = 0;
	$rootScope.ridePage = 0;
    if (!$cookieStore.get('web_access_token')) {
        $state.go("corporate_login");
    }
    $scope.myTrips = [];
    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    var newdriverModel = JSON.parse(localStorage.getItem('driverdata'));

    $scope.userDetails = [];
    $scope.driverDetails = [];
   
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
            $scope.hideLoadMore = 1;
			params.searchString = $scope.searchuser;
			
		}else if((searchflag == 1) && !$scope.searchuser){
			params.offset = 0;
			$scope.currentPage = 1;
		}
		
		
        $.post(MY_CONSTANT.urlC + 'get_fav_driver', params)
            .success(function(data, status) {
               
                if(typeof(data)=='string')
                data = JSON.parse(data);
                
                if(data.flag==101){
                    $state.go("corporate_login");
                }
               
                if (data.flag == 502) {
                 
                } else {
                    $scope.totalItems= data.count;
                    
                   
					
					if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
						$scope.hideLoadMore = 1;
					}else{
                        $scope.hideLoadMore = 0;
					}

                    $scope.Users = data.drivers;
             

					$scope.$apply();
                }
          
            });
    }
    $scope.initTable();
    $scope.loadData = function () {
        $('.accordion-toggle').addClass('collapsed');
    };
	
	
	
	$scope.loadMore = function() {
		$scope.DisableLoadMore = true;
		
		$scope.currentPage = $scope.currentPage+1;
        
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
               
                //$scope.$apply();
				
                $scope.loadMoreNow();
                
            }else{
				
			}
        }
		
		
		
    }
	
	$scope.loadMoreNow = function(searchflag){
		
		var params = {
			web_access_token: $cookieStore.get("web_access_token"),
			limit: 10,
			offset: $scope.skip
		}
		if($scope.searchuser){				
			params.searchFlag = 1;
			params.searchString = $scope.searchuser;		
		}
		
        $.post(MY_CONSTANT.urlC + 'get_fav_driver', params)
            .success(function(data, status) {
              
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
                if (data.flag == 502) {
                 
                } else {
					$scope.totalItems= data.count;
					var Users = data.drivers;
					Users.forEach(function(userData,ind) {
						$scope.Users.push(userData);		
					});
					
				
					$scope.$apply();
                }
                
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

	
	$scope.deleteUser = function(user){
		$scope.toBeDeleted = user.driver_name;
		$scope.driver_toDelete = user.driver_id;
	}
	$scope.deleteUserConfirmed = function(driver_id){
		
		 $.post(MY_CONSTANT.urlC+ 'remove_fav_driver', {
			web_access_token:  $cookieStore.get('web_access_token'),				
			driver_id:driver_id				
		}) .then(function successCallback(data) {
			$rootScope.$apply(function () { 
			
				if (typeof(data) == 'string') data = JSON.parse(data);
						
					if(data.error || data.flag==0){
						
						alert(data.error || data.message);
						  return;
					}else{
						
						$rootScope.openToast('success', 'Driver Removed Successfully', '');
                      
                        setTimeout(function(){
                            $('html, body').animate({scrollTop:0}, 'slow');
                          $('#loading').modal('hide');
                          $state.reload();
                      },20);
						
						// $scope.initTable();
					}
		
			});
			
		});
				
	}
	
	
    $scope.openAddUser = function(){
		
		window.open(MY_CONSTANT.vendorBaseURL+'driverlogin.html', '_blank');
	};
	
    $scope.viewDetails = function(modalIndex){
        //$scope.popupDetails = $scope.userDetails.user_name;
        // var modalIndex=$cookieStore.get("modalToOpen");
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

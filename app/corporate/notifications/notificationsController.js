App.controller('notificationsController', function($rootScope, $scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, tokenLogin, socketFactory, $window, $interval) {
	
	if (!$cookieStore.get('web_access_token')) {
         $state.go("corporate_login");
    }
	
	$rootScope.ridePage = 0;

	$scope.showLoader = 0;
	
	$scope.searchFlag = 0;
	$scope.searchString = '';

	$scope.skip = 0;
	$scope.currentPage = 1;
	$scope.Notifications = [];
	$scope.UnReadNotifications = [];

    var driverModel = JSON.parse(localStorage.getItem('corporateModel'));
    $scope.userDetails = [];
    $scope.driverDetails = [];
  
    //$scope.userDetails.userName = driverModel.user_name;
    //$scope.userDetails.userImage = driverModel.user_image;
    if (driverModel) {
        $scope.userDetails.userName = driverModel.user_name;
        $scope.userDetails.userImage = driverModel.user_image;
        $scope.driverID=driverModel.vendor_id;
        $scope.driverDetails.driver_name = driverModel.driver_name;
        $scope.driverDetails.driver_image = driverModel.driver_image;
        $scope.driverDetails.driver_email = driverModel.email;
        $scope.driverDetails.driver_mobile = driverModel.mobile;
        $scope.driverDetails.driver_refcode = driverModel.referral_code;
		$scope.driverDetails.corporate_id = driverModel.corporate_id;
    } else {
		
        $cookieStore.remove('access_token');
         $state.go("corporate_login");
    }

   
    $scope.logout = function() {
        $('.modal').modal('hide');
        $cookieStore.remove('access_token');
        $state.go("corporate_login");
    };
    

    // $scope.pageChanged = function(currentPage) {
    //     $scope.currentPage = currentPage;
    
    //     for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
    //         if ($scope.currentPage == i) {
    //             $scope.skip = 10 * (i - 1);
    
    //             //$scope.$apply();
    //         }
    //     }
    //     $scope.initTable();
    // };
	
	
	
	
	
    $scope.initNotification = function() {
		var token = $cookieStore.get('web_access_token');
		socketFactory.init(); 
		
		
		return;

    }

	
	socketFactory.on('corporateNotification', function(data) {
			
			$scope.sockos=data[0].data.paginated_notification;
			//$scope.Notifications = $scope.sockos;
			$scope.totalNotifications = data[0].data.count;
			
		});
		
		
		
		
		
		
		
		
		
		
	$scope.pageChanged = function(currentPage) {
        $scope.currentPage = currentPage;
       
		$scope.hideNext = 0;
		
		
		if(parseInt($scope.totalItems / 10 + 1) <= currentPage){
			$scope.hideNext = 1;
			
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
               
                // $scope.$apply();
				
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
			params.searchFlag = 1;
			params.searchString = $scope.searchuser;
			
		}
		$.post(MY_CONSTANT.urlC + 'corporate_notification',params )
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
				
				
				
				$scope.totalItems= data.total_corporate_notificatons;
				
				$scope.Notifications = data.read_corporate_notificatons;
				$scope.UnReadNotifications = data.unread_corporate_notificatons;
				
				var Notifications = data.read_corporate_notificatons;				
				var UnReadNotifications = data.unread_corporate_notificatons;
				var alert_ids = [];
				
				UnReadNotifications.forEach(function(notification) {
					alert_ids.push(  notification.alert_id);
				  
				})
				Notifications.forEach(function(userData,ind) {
					var u = userData;
					u.subject = u.subject.charAt(0).toUpperCase() + u.subject.slice(1);
					$scope.Notifications.push(u);
				});
				if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
					$scope.hideLoadMore = 1;
					setTimeout(function(){
						$scope.DisableLoadMore = false;
					},2000)
				}
				$scope.$apply();
				var string = alert_ids.join();
				
				if(string!=''){
					$.post(MY_CONSTANT.urlC + 'read_corporate_notification',{
						web_access_token : $cookieStore.get("web_access_token"),
						alert_id : string
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
							
						}
					});
				}
			}
		
		});
          
    }
    $scope.initTable();
    $scope.loadData = function() {
        $('.accordion-toggle').addClass('collapsed');
    };
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.collapse').on('show.bs.collapse', function() {
            $('.collapse.in').collapse('hide');
            var index = $(this).attr("id");
            $scope.arrowKey = true
            $cookieStore.put('modalToOpen', index);
        });
        

    });
	
	
	
	
	
	
	
	
	$scope.loadMore = function() {
		
		$scope.currentPage = $scope.currentPage+1;
       
		$scope.hideLoadMore = 0;
		$scope.DisableLoadMore = true;
		
		if(parseInt($scope.totalItems / 10 + 1) <= $scope.currentPage){
			$scope.hideLoadMore = 1;
			setTimeout(function(){
				$scope.DisableLoadMore = false;
			},2000)
		}
        for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
            if ($scope.currentPage == i) {
                $scope.skip = 10 * (i - 1);
               
                //$scope.$apply();
				
				$scope.loadMoreNow();
            }else{
				
				setTimeout(function(){
					$scope.DisableLoadMore = false;
				},2000)
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
		
        $.post(MY_CONSTANT.urlC + 'corporate_notification', params)
            .success(function(data, status) {
              
                if(typeof(data)=='string')
                data = JSON.parse(data);
                if(data.flag==101){
                    $state.go("corporate_login");
                }
                if (data.flag == 502) {
                 
                } else {
					
					$scope.totalItems= data.total_corporate_notificatons;
				
					

					
					
					var alert_ids = [];
					//var Notifications = data.corporate_notificatons;
					var Notifications = data.read_corporate_notificatons;
					var UnReadNotifications = data.unread_corporate_notificatons;
				
					UnReadNotifications.forEach(function(userData,ind) {
						var u = userData;
						u.subject = u.subject.charAt(0).toUpperCase() + u.subject.slice(1);
						
						$scope.UnReadNotifications.push(u);	
						alert_ids.push(  userData.alert_id);						
					});
					Notifications.forEach(function(userData,ind) {
						var u = userData;
						u.subject = u.subject.charAt(0).toUpperCase() + u.subject.slice(1);
						$scope.Notifications.push(u);
					});
					
					$scope.$apply();
					
					var string = alert_ids.join();
					
					if(string!=''){
						$.post(MY_CONSTANT.urlC + 'read_corporate_notification',{
							web_access_token : $cookieStore.get("web_access_token"),
							alert_id : string
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
								
							}
						});
					}
					
					
					
					
					
					
					
					

                }
                
            });
		
	}
	
	
  
});

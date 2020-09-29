angular.module("corporatePanel").constant('CONSTANT', {
    apiURL: 'https://52.24.84.214:8000/'
});
angular.module("corporatePanel").constant('MY_CONSTANT', {

    "url": "http://18.211.241.237:6503/",
	"urlV": "http://18.211.241.237:6509/vendor/",
    "urlWC": "http://18.211.241.237:6501/",
    "urlC": "http://18.211.241.237:6501/corporate/",
    "stripeKey": "pk_test_x0nIalqvXaliqoYO9Qdcb94Q",
    "SocketURL": "18.211.241.237:6508",
    "mapKey": "AIzaSyDVxUnImtx75BtZS3yQJKhh_XgKFbWcKaE",
	"vendorBaseURL": "http://qudos.tech/",
    //"vendorBaseURL": "http://127.0.0.1:8082/",

});
angular.module('corporatePanel').config(function($stateProvider, $urlRouterProvider) {
    // console.log("asd");
   
  /* if (window.location.href.indexOf('127.0.0') !== -1) {
       // window.location.href = 'https://ridequdos.com/riderlogin.html';
    }
    else if (window.location.href.indexOf('ridequdos') !== -1) {
        //window.location.href = 'https://ridequdos.com/riderlogin.html';
    }
    else if (window.location.href.indexOf('drivequdos') !== -1) {
        //window.location.href = 'https://ridequdos.com/driverlogin.html';
    }
    else $urlRouterProvider.otherwise('/corporate_login'); 
	*/
		
		$urlRouterProvider.otherwise('/corporate_login');
		
		 $stateProvider.state('corporate_login', {
            url: '/corporate_login',
            templateUrl: 'app/corporateLogin/corporateLogin.html',
            controller: 'CorporateLoginController'
        })
		.state('corporate_register', {
            url: '/corporate_register',
            title: "Register",
            templateUrl: 'app/corporateLogin/corporateRegister.html',
            controller : 'CorporateRegisterController'
        })
		
		.state('corporate_signup', {
            url: '/corporate_signup',
            title: "Register",
            templateUrl: 'app/corporateLogin/corporateSignup.html',
            controller : 'CorporateSignupController'
        })
		
        .state('corporate', {
            url: '/corporate',
            abstract: true,
            templateUrl: 'app/corporate/corporate.view.html',
            controller: 'CorporateCtrl'
        })
		.state('corporate.ridersignup', {
            url: '/riderSignup',
            title: "Register User",
            templateUrl: 'app/corporateLogin/riderSignup.html',
            controller : 'riderSignupController',
			data: {
			  meta: {
				'title': 'Rider Signup page | Corporate',
				'description': 'Add Rider now to get discount'
			  }
			}
        })
		 .state('corporate.allUsers', {
            url: '/allUsers',
            templateUrl: 'app/corporate/users/allUsers.html',
            controller: 'corporateAllUsersController'
        })
		 .state('corporate.myUsers', {
            url: '/myUsers',
            templateUrl: 'app/corporate/users/myUsers.html',
            controller: 'corporateMyUsersController'
        })
		 .state('corporate.listCards', {
            url: '/listCards',
            templateUrl: 'app/corporate/cards/listCards.html',
            controller: 'corporateCardsController'
        })
		 .state('corporate.qudosfave', {
            url: '/qudos-fave',
            templateUrl: 'app/corporate/qudosfave/qudosfave.html',
            controller: 'qudosfaveController'
        })
		 .state('corporate.myQudosfave', {
            url: '/my-qudos-fave',
            templateUrl: 'app/corporate/qudosfave/myQudosfave.html',
            controller: 'myQudosfaveController'
        })
		
		.state('corporate.trips', {
            url: '/scheduled-trips',
            templateUrl: 'app/corporate/Trips/Trips.html',
            controller: 'corporateTripsController'
        })
		.state('corporate.referral_trips', {
            url: '/completed-trips',
            templateUrl: 'app/corporate/Trips/completedTrips.html',
            controller: 'corporateCompletedTripsController'
        })
		.state('corporate.cancelled_trips', {
            url: '/cancelled-trips',
            templateUrl: 'app/corporate/Trips/cancelledTrips.html',
            controller: 'cancelledTripsController'
        })
		 .state('corporate.documents', {
            url: '/documents',
            templateUrl: 'app/corporate/documents/documents.html',
            controller: 'corporateDocumentsController'
        }) 
		.state('corporate.staff', {
            url: '/staff',
            templateUrl: 'app/corporate/staff/staff.html',
            controller: 'corporateStaffController'
        })
		.state('corporate.settings', {
			url: '/listCards',
            templateUrl: 'app/corporate/cards/listCards.html',
            controller: 'corporateCardsController'
        })
		.state('corporate.notificationSettings', {
			url: '/notification-settings',
            templateUrl: 'app/corporate/settings/notification-settings.html',
            controller: 'notificationSettingsController'
        })
		.state('corporate.paymentSettings', {
			url: '/payment-settings',
            templateUrl: 'app/corporate/settings/payment-settings.html',
            controller: 'paymentSettingsController'
        })
		/*.state('corporate.bookRide', {
			url: '/book-a-ride',
            templateUrl: 'app/corporate/bookRide/index.html',
            controller: 'bookRideController'
        })*/
		.state('corporate.bookRide', {
			url: '/live-tracking',
            templateUrl: 'app/corporate/liveTrack/liveTrack.html',
            controller: 'livetrackingCtrl'
        })
		.state('corporate.notifications', {
			url: '/notifications',
            templateUrl: 'app/corporate/notifications/notifications.html',
            controller: 'notificationsController'
        })
		.state('corporate.liveTracking', {
			url: '/live-tracking',
            templateUrl: 'app/corporate/liveTrack/liveTrack.html',
            controller: 'livetrackingCtrl'
        })
		.state('corporate.bankDetails', {
			url: '/bankDetails',
            templateUrl: 'app/corporate/settings/bank-details.html',
            controller: 'corporateBankDetailsController'
        })
		
		
		
});

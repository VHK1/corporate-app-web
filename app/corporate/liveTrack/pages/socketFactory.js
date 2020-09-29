(function() {
  'use strict';

  angular.module('corporatePanel')

  .factory('socketFactory', socketFactory)
  .factory('InfiniteSocketFactory', InfiniteSocketFactory);

  socketFactory.$inject = ['$rootScope', '$window','MY_CONSTANT'];

  function socketFactory($rootScope, $window, MY_CONSTANT) {

    var socket;
    var services = {
      on: on,
      emit: emit,
      init: init,
      removeAllListeners: removeAllListeners
    };

    return services;

    function init() {
     
		$window.socket = io.connect(MY_CONSTANT.SocketURL);
       // console.log('Initialized',$window.socket)
    }

    function on(eventName, callback) {
     //  console.log("on:",eventName);
      $window.socket.on(eventName, function() {
        var args = arguments;
        // console.log('on '+eventName+' :',args);
        /*$rootScope.$apply(function() {
          callback.apply($window.socket, args);
        });*/
        //callback.apply($window.socket,args);
          callback(args);
      });
    }

    function emit(eventName, data, callback) {
      $window.socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply($window.socket, args);
          }
        });
      });
    }

    function removeAllListeners(eventName, callback) {
        socket.removeAllListeners(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
        });
    }



  }

  function InfiniteSocketFactory($scope){


      var InfiniteSocket = function() {
          this.items = [];
          this.busy = false;
          this.after = '';
        };

        InfiniteSocket.prototype.nextPage = function() {
          if (this.busy) return;
          this.busy = true;

               console.log(" sock working");

                socket.emit('getCompletedRides', {action: 0, region_id:0, limit:30});
                socketFactory.on('completedRides', function(data) {
                        console.log('data in Completed',data.data);
                        $scope.sockoc=data.data.paginated_rides;
                        $scope.completedRides=$scope.sockoc;
                });
/*
          var url = "https://api.InfiniteSocket.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
          $http.jsonp(url).success(function(data) {
            var items = data.data.children;
            for (var i = 0; i < items.length; i++) {
              this.items.push(items[i].data);
            }
            this.after = "t3_" + this.items[this.items.length - 1].id;
            this.busy = false;
          }.bind(this));*/



        };

        return InfiniteSocket;



  }

})();

var App = angular.module('corporatePanel', ['ngCookies', 'ngAnimate', 'ngMaterial','ui.bootstrap','ngBootstrap', 'ngDialog', 'ui.router','toastr',  'ngProgress','angular-page-loader','ng-webcam','ngMeta']);
angular.module('corporatePanel').run(appRun);
angular.module('corporatePanel').directive('autoTabTo', [function () {
    return {
          restrict: "A",
          link: function (scope, el, attrs) {
              el.bind('keyup', function(e) {
                  var theEvent = e || window.event;
                  var key = theEvent.keyCode || theEvent.which;
                  // console.log(key);
                  if(key==8){
                      var element = document.getElementById(attrs.switch);
                      console.log(element.value);
                      if (element)
                          element.focus();
                      return false;
                  }
                  else if(this.value.length === this.maxLength) {


                      var element = document.getElementById(attrs.autoTabTo);
                      if (element)
                          element.focus();
                      //element.value=e;

                  }

              });
          }
      }
  }]);
function appRun($rootScope, $http, $state, $location, toastr, toastrConfig, ngMeta) {
    var defaultConfig = angular.copy(toastrConfig);
	ngMeta.init();
    $rootScope.types = ['success', 'error', 'info', 'warning'];
    $rootScope.loader = false;
    var openedToasts = [];
    $rootScope.options = {
        autoDismiss: false,
        positionClass: 'toast-top-right',
        type: 'info',
        timeOut: '1500',
        extendedTimeOut: '1500',
        allowHtml: false,
        closeButton: false,
        tapToDismiss: true,
        progressBar: false,
        newestOnTop: true,
        maxOpened: 0,
        preventDuplicates: false,
        preventOpenDuplicates: false,
        title: "Title",
        msg: "Message"
    };

    $rootScope.clearLastToast = function() {
        var toast = openedToasts.pop();
        toastr.clear(toast);
    };

    $rootScope.clearToasts = function() {
        toastr.clear();
    };
    $rootScope.openToast = function(type, msg, title) {
        angular.extend(toastrConfig, $rootScope.options);
        openedToasts.push(toastr[type](msg, title));
        var strOptions = {};
        for (var o in $rootScope.options)
            if (o != 'msg' && o != 'title') strOptions[o] = $rootScope.options[o];
        $rootScope.optionsStr = "toastr." + type + "(\'" + msg + "\', \'" + title + "\', " + JSON.stringify(strOptions, null, 2) + ")";
    };

    $rootScope.$on('$destroy', function iVeBeenDismissed() {
        angular.extend(toastrConfig, defaultConfig);
    })
}
angular.module('corporatePanel').directive('fancybox', function ($templateRequest, $compile) {
    return {
        scope: true,
        restrict: 'A',
        controller: function($scope) {
            $scope.openFancybox = function (url,document_url) {
                $scope.document_url=document_url;
                $templateRequest(url).then(function(html){
                    var template = $compile(html)($scope);
                    // $.fancybox.center();
                    $.fancybox.open({ content: template, type: 'html','autoScale':true,'overlayShow':true,'hideOnOverlayClick':true });
                });
            };
        },
        link: function link(scope, elem, attrs) {
            elem.bind('click', function() {
                var url = attrs.fancyboxTemplate;
                var document_url = attrs.fancyboxImage;
                scope.openFancybox(url,document_url);
            });
        },
    }
});
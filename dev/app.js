/*
 * Module Init
 * */

var af = angular.module('afSchema', ['ngAnimate', 'ngMaterial', 'ui.router', 'angularAnimation']);



/*
 * Routes Config
 * */
af.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/app");

        $stateProvider
            .state('app', {
                url: '/app',
                template: '<app></app>'
            })



            .state('afClass', {
                url: '/afClass',
                template: '<af-class></af-class>'
            })

            .state('afArray', {
                url: '/afArray',
                template: '<af-array></af-array>'
            })

            .state('afObject', {
                url: '/afObject',
                template: '<af-object></af-object>'
            })

            .state('afOrder', {
                url: '/afOrder',
                template: '<af-order></af-order>'
            })


            .state('storage', {
                url: '/storage',
                abstract: true,
                template: '<ui-view></ui-view>'
            })



    }]);

/*
 * Run Config
 * */
af.run(['$rootScope', '$timeout', '$mdSidenav',
    function($rootScope, $timeout, $mdSidenav) {
        $rootScope.toggleSideNav = function(){
            if($mdSidenav('right').isOpen()){
                $mdSidenav('right').close();
            }else{
                $mdSidenav('right').open();
            }
        }


        $rootScope.$on("$stateChangeSuccess",
            function (event, toState, toParams, fromState, fromParams) {
                if($mdSidenav('right').isOpen()){
                    $mdSidenav('right').close();
                }
            });
    }]);



/*
 * Theme Config
 * */
af.config(['$mdThemingProvider', function($mdThemingProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette("deep-purple", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('purple', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('red', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('purple')
        .primaryPalette("purple", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('purple', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('red', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });

    $mdThemingProvider.theme('red')
        .primaryPalette("red", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('red', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('red', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
}]);
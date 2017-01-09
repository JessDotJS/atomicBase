/*
 * Module Init
 * */

var afSchema = angular.module('afSchema', ['ngAnimate', 'ngMaterial', 'ui.router']);



/*
 * Routes Config
 * */
afSchema.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/main");

        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'tests/tests.html',
                controller: ['$scope', '$rootScope', function($scope, $rootScope){


                    var testAF = new TestAF();




                    $scope.$afArray = new $afArray(testAF.db.ref, testAF.db.schema);



                    $scope.$afArray.$on().then(function(instanceID){
                        $scope.instanceID = instanceID;
                        document.addEventListener($scope.instanceID + '-initialLotLoaded', doSomething, false);
                    });

                    function doSomething(){
                        console.log($scope.$afArray.get.items());
                    }



                    /*function doSomething(){
                        $scope.items = $scope.$afArray.get.items();
                        console.log($scope.$afArray.get.items());
                    };

                    $scope.$watch('$afArray.get.items()', function(newValue, oldValue) {
                        if(newValue != undefined){
                            $scope.items = newValue;
                            console.log(newValue);
                        }
                    }, true);*/

                    /*$scope.$watch('testAF.db.$afArray.displayedItems', function(newValue, oldValue) {
                        if(newValue != undefined){
                            console.log(newValue);
                        }
                    }, true);*/


                    /*
                    * CRUD TESTS
                    * */

                    /*testAF.db.query.create({
                        name: 'Jess M Graterol ',
                        smallNumber: 8,
                        shortDescription: 'This is the short description'
                    }).then(function(snapshotKey){
                        testAF.db.ref.root.child('test' + '/' + snapshotKey).once("value")
                            .then(function(snapshot){
                                testAF.db.query.update(testAF.db.schema.build(snapshot, 'snapshot'))
                                    .then(function(){
                                    testAF.db.query.remove(testAF.db.schema.build(snapshot, 'snapshot'))
                                        .then(function(){
                                            console.log('Tests passed');
                                        })
                                });

                            });
                    });*/


                }]
            })
    }]);

/*
 * Run Config
 * */
afSchema.run(['$rootScope', '$timeout',
    function($rootScope, $timeout) {


    }]);



/*
 * Theme Config
 * */
afSchema.config(['$mdThemingProvider', function($mdThemingProvider){
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
        .warnPalette('deep-orange', {
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
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('deep-purple')
        .primaryPalette("deep-purple", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('deep-purple', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('deep-orange')
        .primaryPalette("deep-orange", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
}]);
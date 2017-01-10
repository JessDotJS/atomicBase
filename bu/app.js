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
            .state('read', {
                url: '/read',
                templateUrl: 'tests/tests.html',
                controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){


                    var testAF = new TestAF();

                    /*
                    * $afArray tests
                    * */

                    $scope.$afArray = testAF.db.$afArray;
                    $scope.$afArray.$on({
                        initialLotSize: 5,
                        nextLotSize: 5
                    });

                    document.addEventListener('list_changed', function (e) {
                        $timeout(function(){});
                    }, false);


                    $rootScope.$on("$stateChangeSuccess",function() {
                        $scope.$afArray.$off();
                    });


                    /*
                     * $afObject tests
                     * */


                }]
            })

            .state('write', {
                url: '/write',
                controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){


                    var testAF = new TestAF();


                    /*
                     * CRUD TESTS
                     * */

                    testAF.db.query.create({
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
                    });


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
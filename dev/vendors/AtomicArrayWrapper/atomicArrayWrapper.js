/**
 * Created by Computadora on 24-Dec-16.
 */

/**
 * Created by Computadora on 12-Dec-16.
 */

af.directive('atomicArrayWrapper',
    ['$timeout', '$http', '$q', '$rootScope', 'angularGridInstance',
        function($timeout, $http, $q, $rootScope, angularGridInstance){
            return {
                restrict: 'E',
                scope: {
                    config: '='
                },
                template: '<div ng-include="getWrapperUrl()"></div>',
                link: function(scope, element, attrs) {
                    if(scope.config != undefined){
                        scope.atomicArray = scope.config.atomicArray;
                        scope.parentScope = scope.config.parentScope || null;
                        scope.contentLoaded = false;
                        scope.deactivators = scope.config.deactivators || ['$stateChangeSuccess'];


                        /*
                         * Main Initializer
                         * */

                        scope.initialize = function(){
                            var deferred = $q.defer();
                            scope.initView();
                            scope.initAgConfig();
                            scope.initDeactivators();
                            scope.atomicArray.$on({
                                ref: scope.config.arrayRef,
                                initialLotSize: scope.config.firstLotSize || 14,
                                nextLotSize: scope.config.nextLotSize || 16
                            }).then(function(){
                                document.addEventListener(scope.atomicArray.id + '_apply_filters', function () {
                                    scope.applyFilters();
                                }, false);
                                if(scope.viewObject.delayedStart){
                                    $timeout(function(){
                                        if(scope.config.grid){
                                            $timeout(function(){
                                                if(angularGridInstance.infiniteScrollGrid != undefined){
                                                    angularGridInstance.infiniteScrollGrid.refresh();
                                                }
                                                scope.contentLoaded = true;
                                                deferred.resolve(true);
                                            }, 1500);
                                        }else{
                                            scope.contentLoaded = true;
                                            deferred.resolve(true);
                                        }
                                    }, 500);
                                }else{
                                    if(scope.config.grid){
                                        $timeout(function(){
                                            if(angularGridInstance.infiniteScrollGrid != undefined){
                                                angularGridInstance.infiniteScrollGrid.refresh();
                                            }
                                            scope.contentLoaded = true;
                                            deferred.resolve(true);
                                        }, 1500);
                                    }else{
                                        $timeout(function(){
                                            scope.contentLoaded = true;
                                            deferred.resolve(true);
                                        });
                                    }
                                }
                            }).catch(function(err){console.log(err);});
                            return deferred.promise;
                        };

                        /*
                         * Secondary Initializers
                         * */

                        scope.initView = function(){
                            scope.viewObject = {
                                parentContainer: scope.config.parentContainer || '.views-container',
                                distance : scope.config.distance || 2,
                                templateUrl: scope.config.templateUrl,
                                delayedStart: scope.config.delayedStart || false,
                                animation: scope.config.animation || ''
                            };
                        };

                        scope.initAgConfig = function(){
                            scope.agConfig = {
                                gridWidth : scope.config.gridWidth || 300,
                                gutterSize : scope.config.gutterSize || 20,
                                refreshOnImgLoad : scope.config.refreshOnImgLoad || true
                            }
                        };


                        scope.getWrapperUrl = function(){
                            var wrapperUrl = '';
                            if(scope.config.wrapper == 'infiniteScroll'){
                                wrapperUrl = '/vendors/AtomicArrayWrapper/infiniteScrollWrapper.html';
                            }else if(scope.config.wrapper == 'loadMore'){
                                wrapperUrl = '/vendors/AtomicArrayWrapper/loadMoreWrapper.html';
                            }
                            return wrapperUrl;
                        };

                        scope.initDeactivators = function(){
                            if(typeof scope.deactivators == 'string'){
                                $rootScope.$on(scope.deactivators,function() {
                                    scope.atomicArray.$off();
                                    document
                                        .removeEventListener(scope.atomicArray.id + '_apply_filters', function(){});
                                });
                            }else if(typeof scope.deactivators == 'object'){
                                for(var i = 0; i < scope.deactivators.length; i++){
                                    $rootScope.$on(scope.deactivators[i],function() {
                                        scope.atomicArray.$off();
                                        document
                                            .removeEventListener(scope.atomicArray.id + '_apply_filters', function(){});
                                    });
                                }
                            }

                        };




                        /*
                         * Items Processor
                         * */

                        scope.$watch('atomicArray.items', function(newValue, oldValue) {
                            if(newValue != undefined){
                                scope.atomicArray.items = newValue;
                                scope.applyFilters();
                            }
                        }, true);


                        scope.applyFilters = function(){
                            if(scope.atomicArray.filters){
                                $timeout(function(){
                                    for(var i = 0; i < scope.atomicArray.filters.length; i++){
                                        scope.atomicArray.items =
                                            scope.atomicArray.items
                                                .filter(scope.atomicArray.filters[scope.atomicArray.filters[i]])
                                    }
                                });
                            }else{
                                $timeout(function(){});
                            }
                        };

                        scope.initialize();
                    }else{
                        console.log('No config Provided');
                    }
                }
            }
        }]);
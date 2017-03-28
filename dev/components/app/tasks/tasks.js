/**
 * Created by Computadora on 09-Jan-17.
 */

af.component('tasks', {
    templateUrl: '/components/app/tasks/tasks.html',

    controller: [
        '$rootScope','$scope', '$mdDialog', '$timeout',
        function($rootScope, $scope, $mdDialog, $timeout){

            var task = new Task();

            $scope.config = {
                atomicArray: task.db.atomicArray,
                parentScope: $scope,
                initialLotSize: 1000,
                nextLotSize: 1000,
                templateUrl: '/components/app/tasks/tasks.tpl.html',
                wrapper: 'infiniteScroll',
                animation: {
                    type: 'entrance',
                    in: 'zoomIn',
                    out: 'zoomOut'
                }
            };

            /*
            * CRUD Related
            * */
            $scope.itemSelected = false;
            $scope.selectedItem = {};

            $scope.submitting = false;



            $scope.save = function(){
                $scope.submitting = true;
                if($scope.itemSelected){
                    task.db.query.update($scope.selectedItem).then(function(){
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }else{
                    task.db.query.create($scope.selectedItem).then(function(){
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }
            };

            $scope.remove = function(item){
                task.db.query.remove(item).then(function(){
                    $scope.cancel();
                }).catch(function(err){console.log(err)});
            };

            $scope.selectItem = function(event, item){
                $scope.itemSelected = true;
                $scope.selectedItem = item;
                $scope.showForm(event);
            };

            $scope.showForm = function(event){
                $mdDialog.show({
                    scope: $scope,
                    preserveScope: true,
                    templateUrl: 'components/app/tasks/taskForm.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:false,
                    fullscreen: true,
                    escapeToClose: false
                });
            };

            $scope.cancel = function(){
                $mdDialog.hide();
                $scope.itemSelected = false;
                $scope.selectedItem = {};
                $scope.submitting = false;
            }


        }]
});


/**
 * Created by Computadora on 09-Jan-17.
 */

af.component('tasks', {
    templateUrl: '/components/app/tasks/tasks.html',

    controller: [
        '$rootScope','$scope', '$mdDialog', '$timeout',
        function($rootScope, $scope, $mdDialog, $timeout){

            var task = new Task();

            /*
            * CRUD Related
            * */
            $scope.itemSelected = false;
            $scope.selectedItem = {};

            $scope.submitting = false;

            $scope.updateFile = false;

            /*
            * $afArray
            * */
            $scope.$afArray = task.db.$afArray;

            $scope.$afArray.$on();

            document.addEventListener('list_changed', function (e) {
                $timeout(function(){});
            }, false);


            $rootScope.$on("$stateChangeSuccess",function() {
                $scope.$afArray.$off();
            });


            $scope.save = function(){
                $scope.submitting = true;
                if($scope.itemSelected){
                    task.db.query.update($scope.selectedItem).then(function(){
                        console.log('Task Updated');
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }else{
                    task.db.query.create($scope.selectedItem).then(function(){
                        console.log('Task Created');
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }
            };

            $scope.remove = function(item){
                task.db.query.remove(item).then(function(){
                    console.log('Task Deleted');
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
                $scope.updateFile = false;
            }


        }]
});


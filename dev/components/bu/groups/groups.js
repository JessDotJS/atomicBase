/**
 * Created by Computadora on 09-Jan-17.
 */

af.component('groups', {
    templateUrl: '/components/app/groups/groups.html',

    controller: [
        '$rootScope','$scope', '$mdDialog', '$timeout',
        function($rootScope, $scope, $mdDialog, $timeout){

            var group = new Group();

            /*
            * CRUD Related
            * */
            $scope.itemSelected = false;
            $scope.selectedItem = {};

            $scope.submitting = false;

            $scope.updateFile = false;

            /*
            * AtomicArray
            * */
            $scope.atomicArray = group.db.atomicArray;

            $scope.atomicArray.$on();

            document.addEventListener('list_changed', function (e) {
                $timeout(function(){});
            }, false);


            $rootScope.$on("$stateChangeSuccess",function() {
                $scope.atomicArray.$off();
            });


            $scope.save = function(){
                $scope.submitting = true;
                if($scope.itemSelected){
                    group.db.query.update($scope.selectedItem).then(function(){
                        console.log('Group Updated');
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }else{
                    group.db.query.create($scope.selectedItem).then(function(){
                        console.log('Group Created');
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }
            };

            $scope.remove = function(item){
                group.db.query.remove(item).then(function(){
                    console.log('Group Deleted');
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
                    templateUrl: 'components/app/groups/groupForm.html',
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


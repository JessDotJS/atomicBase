/**
 * Created by Computadora on 09-Jan-17.
 */

af
    .component('users', {
    templateUrl: '/components/app/users/users.html',

    controller: [
        '$rootScope','$scope', '$mdDialog', '$timeout',
        function($rootScope, $scope, $mdDialog, $timeout){


            /*
            * CRUD Related
            * */
            $scope.itemSelected = false;
            $scope.selectedItem = {};

            $scope.submitting = false;

            $scope.updateFile = false;


            var user = new User();
            var group = new Group();


            /*
            * AtomicArray
            * */


            $scope.userArray = user.db.atomicArray;
            $scope.groupArray = group.db.atomicArray;

            $scope.userArray.$on();
            $scope.groupArray.$on();

            document.addEventListener('list_changed', function (e) {
                $timeout(function(){});
            }, false);


            $rootScope.$on("$stateChangeSuccess",function() {
                $scope.userArray.$off();
                $scope.groupArray.$off();
                if($scope.userGroupsObject != undefined){
                    $scope.userGroupsObject.$off();
                }
            });


            /*
            * CRUD & Others
            * */

            $scope.save = function(){
                $scope.submitting = true;
                if($scope.itemSelected){
                    user.db.query.update($scope.selectedItem).then(function(){
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }else{
                    user.db.query.create($scope.selectedItem).then(function(){
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }
            };

            $scope.remove = function(item){
                $scope.submitting = true;
                user.db.query.remove(item).then(function(){
                    $scope.cancel();
                }).catch(function(err){console.log(err)});
            };

            $scope.selectItem = function(event, item){
                $scope.itemSelected = true;
                $scope.selectedItem = item;
                $scope.userGroupsObject = new AtomicObject(user.db.ref, user.db.schema, user.db.ref.primary);
                $scope.showForm(event);
            };

            $scope.showForm = function(event){
                $mdDialog.show({
                    scope: $scope,
                    preserveScope: true,
                    templateUrl: 'components/app/users/userForm.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:false,
                    fullscreen: true,
                    escapeToClose: false
                });
            };

            /*
            * Assignment related
            * */

            $scope.assignToGroup = function(selectedUser, group){
                user.assignToGroup(selectedUser, group).then(function(){

                }).catch(function(err){
                    console.log(err);
                    $scope.cancel();
                });
            };

            $scope.unassignFromGroup = function(selectedUser, group){
                user.unassignFromGroup(selectedUser, group).then(function(){

                }).catch(function(err){
                    console.log(err);
                    $scope.cancel();
                });
            };


            $scope.isInUserGroups = function(user, group){
                if(user.groups != undefined && group != undefined){
                    if(group.$key in user.groups){
                        return true;
                    }else{
                        return false;
                    }
                }
            };


            /*
            * Defaulter
            * */

            $scope.cancel = function(){
                $mdDialog.hide();
                $scope.itemSelected = false;
                $scope.selectedItem = {};
                $scope.submitting = false;
                $scope.updateFile = false;


                if($scope.userGroupsObject != undefined){
                    $scope.userGroupsObject.$off();
                }


            }


        }]
});
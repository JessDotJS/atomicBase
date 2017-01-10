/**
 * Created by Computadora on 09-Jan-17.
 */

af.component('users', {
    templateUrl: '/components/app/users/users.html',

    controller: [
        '$rootScope','$scope', '$mdDialog', '$timeout',
        function($rootScope, $scope, $mdDialog, $timeout){

            var user = new User();
            var group = new Group();

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
            $scope.userArray = user.db.$afArray;
            $scope.groupArray = group.db.$afArray;

            $scope.userArray.$on();
            $scope.userArray.$on({initialLotSize: 1000});

            document.addEventListener('list_changed', function (e) {
                $timeout(function(){});
            }, false);


            $rootScope.$on("$stateChangeSuccess",function() {
                $scope.userArray.$off();
                $scope.groupArray.$off();
            });


            $scope.save = function(){
                $scope.submitting = true;
                if($scope.itemSelected){
                    user.db.query.update($scope.selectedItem).then(function(){
                        console.log('User Updated');
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }else{
                    user.db.query.create($scope.selectedItem).then(function(){
                        console.log('User Created');
                        $scope.cancel();
                    }).catch(function(err){console.log(err)});
                }
            };

            $scope.remove = function(item){
                user.db.query.remove(item).then(function(){
                    console.log('User Deleted');
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
                    templateUrl: 'components/app/users/userForm.html',
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


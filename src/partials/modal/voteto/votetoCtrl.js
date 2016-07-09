angular.module('asch').controller('votetoCtrl', function($scope, $rootScope, apiService, ipCookie, $location,$http,userService) {

    $rootScope.votetoinfo = false;
   
    $scope.Close = function () {
        $rootScope.isBodyMask = false;
        $rootScope.votetoinfo = false;
    };

    $scope.checkvoteto = function() {
        var reg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        $scope.secondpassword = $scope.secondpassword || undefined;
        if($rootScope.userpublickey){
            if(reg.test($scope.secondpassword)){
                var transaction = AschJS.vote.createVote(userService.setsecret, $rootScope.voteContent,$scope.secondpassword)
                $http({
                    method: 'POST',
                    url:'{{passwordApi}}',
                    headers: {'magic': '43194d2b','version':''},
                    data:transaction
                }).success( function(res) {
                        if(res.success='true'){
                            $rootScope.checkobj = {}
                            $rootScope.coedobj = {}
                            console.log($rootScope.checkobj);
                            $scope.Close()
                            toast('投票成功!')
                        };
                    })
                    .error( function(res) {
                        toastError(res.error);
                    });
            }else{
                toastError('支付密码输入格式不正确!');
            }
        } else {
            var transaction = AschJS.vote.createVote(userService.setsecret, $rootScope.voteContent,$scope.secondpassword)
            $http({
                method: 'POST',
                url:'{{passwordApi}}',
                headers: {'magic': '43194d2b','version':''},
                data:transaction
            }).success( function(res) {
                    if(res.success='true'){
                        $rootScope.checkobj = {}
                        $rootScope.coedobj = {}
                        console.log($rootScope.checkobj);
                        $scope.Close()
                        toast('投票成功!')
                    };
                })
                .error( function(res) {
                    toastError(res.error);
                });
        }

    };


});

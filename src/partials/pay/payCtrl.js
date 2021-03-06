angular.module('asch').controller('payCtrl', function($scope, $rootScope, $filter, apiService, ipCookie, $http,$window,userService,postSerivice) {
    $rootScope.active = 'pay';
    $rootScope.userlogin = true;
   

   $scope.userService = userService;
   $scope.sent = userService.address;
   $scope.fee = '0.1';
   // $scope.amount=;
   $scope.calculateFee = function() {
       if ($scope.amount && Number($scope.amount) > 0) {
            var amount = parseFloat(($scope.amount * 100000000).toFixed(0));
            var fee = AschJS.transaction.calculateFee(amount);
            $scope.fee = $filter('xasFilter')(fee);
       }
   }
    $scope.sentMsg = function () {
        var isAddress = /^[0-9]{1,21}$/g;
        if (!$scope.fromto) {
            toastError('必须输入接收地址');
            return false;
        }
        if (!isAddress.test($scope.fromto)) {
            toastError('接收地址格式不正确!');
            return false;
        }
        if ($scope.fromto == userService.address) {
            toastError('接受地址与发送地址不能相同');
            return false;
        }
        if (!$scope.amount || Number($scope.amount) <= 0) {
            toastError('发送金额输入不正确!');
            return false;
        }
        var amount = parseFloat(($scope.amount * 100000000).toFixed(0));
        var fee = 10000000;
        if(amount + fee > userService.balance) {
            toastError('余额不足!');
            return false;
        }
        if (userService.secondPublicKey && !$scope.secondPassword) {
            toastError('必须输入二级密码!');
            return false;
        }
        if(!userService.secondPublicKey){
            $scope.secondPassword = '';
        }
        var transaction = AschJS.transaction.createTransaction(String($scope.fromto), amount, userService.secret,  $scope.secondPassword);
        postSerivice.post(transaction).success(function(res) {
            if(res.success==true){
                $scope.passwordsure = true;
                $scope.fromto = '';
                $scope.amount = '';
                $scope.secondPassword = '';
                toast('支付成功!')
            } else {
                toastError(res.error)
            };
        }).error( function(res) {
            toastError('服务器错误!');
        });
    }
});

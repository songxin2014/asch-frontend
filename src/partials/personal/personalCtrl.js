angular.module('asch').controller('personalCtrl', function ($scope, $rootScope, apiService, checkloginservice, ipCookie, $window, $http, userService, postSerivice, $filter) {
	$rootScope.active = 'personal';
	$rootScope.userlogin = true;

	//下拉菜单隐藏
	// 账单默认显示
	$scope.accountInfo = true;
	$scope.passwordInfo = false;

	// 二级密码 $scope.secondpassword

	$scope.init = function (params) {
		apiService.account({
			address: AschJS.crypto.getAddress(userService.publicKey)
		}).success(function (res) {
			if (res.success == true) {
				$scope.account = res.account;
				$scope.latestBlock = res.latestBlock;
				$scope.version = res.version;
				userService.update(res.account);
				$scope.userService = userService;
			};

		}).error(function (res) {
			toastError(res.error);
		});
	};

	$scope.accountchange = function () {
		$scope.accountInfo = true;
		$scope.passwordInfo = !$scope.accountInfo;
	}
	$scope.passwordchange = function () {
		$scope.accountInfo = false;
		$scope.passwordInfo = !$scope.accountInfo;
	}

	$scope.setStatus = function () {
		var label = userService.secondPublicKey ? 'ALREADY_SET' : 'NOT_SET';
		return $filter('translate')(label);
	}

	$scope.userService = userService;

	$scope.setPassWord = function () {
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		if (!$scope.secondpassword || !$scope.confirmPassword) {
			return toastError('请输入二级密码');
		}
		var secondPwd = $scope.secondpassword.trim();
		var confirmPwd = $scope.confirmPassword.trim();
		if (secondPwd != confirmPwd) {
			toastError('两次输入不一致!');
		} else if (!reg.test(secondPwd)) {
			toastError('密码格式不正确!');
		} else if (reg.test(secondPwd) && reg.test(confirmPwd) && secondPwd == confirmPwd) {
			var transaction = AschJS.signature.createSignature(userService.secret, $scope.secondpassword);
			postSerivice.post(transaction).success(function (res) {
				if (res.success == true) {
					$scope.passwordsure = true;
					toast('二级密码设置成功!')
				} else {
					toastError(res.error)
				};
			}).error(function (res) {
				toastError('服务器错误!');
			});
		}


	}
	// 退出函数
	$scope.quitout = function () {
	   $window.location.href = '#/login'
	}
});


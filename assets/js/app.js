var app = angular.module('MyApp', ['ngMaterial', 'ngMessages']);

app.directive('userCard', function () {
	return {
		restrict: 'E',
		templateUrl: 'userCard.tmpl.html',
		scope: {
			name: '@',
			theme: '@'
		},
		controller: function ($scope) {
			$scope.theme = $scope.theme || 'default';
		}
	}
}).config(function ($mdThemingProvider) {

	$mdThemingProvider.theme('forest').primaryPalette('brown').accentPalette('green');
    // console.log('initializing....');

    // $mdIconProvider
    //   .defaultIconSet('img/icons/sets/social-icons.svg', 24);

}).run(function($rootScope, $mdMedia, $mdDialog) {

	var showLogin = function () {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		$mdDialog.show({
			// locals: { tweetData: item },
			controller: 'LoginController',
			templateUrl: 'loginform.tmpl.html',
			parent: angular.element(document.body),
			// targetEvent: ev,
			// clickOutsideToClose:true,
			fullscreen: useFullScreen
		})
		.then(function(answer) {
			// $scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			// $scope.status = 'You cancelled the dialog.';
		});
	}
	showLogin();
});


app.controller('DialogController', function($scope, $mdDialog, tweetData) {

	$scope.username = tweetData.who;
	$scope.meowmessage = tweetData.notes;

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
});

app.controller('LoginController', function ($scope, $rootScope, $mdDialog, $mdToast) {
	$scope.loginUser = function () {
		console.log('Logged in!');
		$rootScope.username = $scope.username;
		$scope.showSimpleToast();
		$mdDialog.hide();
	}

	var last = {
		bottom: false,
		top: true,
		left: false,
		right: true
	};
	$scope.toastPosition = angular.extend({},last);
	$scope.getToastPosition = function() {
		sanitizePosition();
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};
	function sanitizePosition() {
		var current = $scope.toastPosition;
		if ( current.bottom && last.top ) current.top = false;
		if ( current.top && last.bottom ) current.bottom = false;
		if ( current.right && last.left ) current.left = false;
		if ( current.left && last.right ) current.right = false;
		last = angular.extend({},current);
	}

	$scope.showSimpleToast = function() {
		var pinTo = $scope.getToastPosition();
		$mdToast.show(
			$mdToast.simple()
			.textContent('Logged in successfully!')
			.position(pinTo)
			.hideDelay(3000)
			);
	};
});

app.controller('DemoCtrl', function($scope, $mdMedia, $mdDialog, $rootScope, $mdToast) {

	var last = {
		bottom: false,
		top: true,
		left: false,
		right: true
	};
	$scope.toastPosition = angular.extend({},last);
	$scope.getToastPosition = function() {
		sanitizePosition();
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};
	function sanitizePosition() {
		var current = $scope.toastPosition;
		if ( current.bottom && last.top ) current.top = false;
		if ( current.top && last.bottom ) current.bottom = false;
		if ( current.right && last.left ) current.left = false;
		if ( current.left && last.right ) current.right = false;
		last = angular.extend({},current);
	}

	var showSimpleToast = function() {
		var pinTo = $scope.getToastPosition();
		$mdToast.show(
			$mdToast.simple()
			.textContent('Meow sent!')
			.position(pinTo)
			.hideDelay(3000)
			);
	};


	// $scope.showLogin = function (ev) {

	// 	var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
	// 	// console.log(item);

	// 	$mdDialog.show({
	// 		// locals: { tweetData: item },
	// 		controller: 'LoginController',
	// 		templateUrl: 'loginform.tmpl.html',
	// 		parent: angular.element(document.body),
	// 		targetEvent: ev,
	// 		clickOutsideToClose:true,
	// 		fullscreen: useFullScreen
	// 	})
	// 	.then(function(answer) {
	// 		$scope.status = 'You said the information was "' + answer + '".';
	// 	}, function() {
	// 		$scope.status = 'You cancelled the dialog.';
	// 	});

	// 	$scope.$watch(function() {
	// 		return $mdMedia('xs') || $mdMedia('sm');
	// 	}, function(wantsFullScreen) {
	// 		$scope.customFullscreen = (wantsFullScreen === true);
	// 	});
	// }

	$scope.showAdvanced = function(ev, item) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		// console.log(item);

		$mdDialog.show({
			locals: { tweetData: item },
			controller: 'DialogController',
			templateUrl: 'tweetdetails.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: useFullScreen
		})
		.then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});

		$scope.$watch(function() {
			return $mdMedia('xs') || $mdMedia('sm');
		}, function(wantsFullScreen) {
			$scope.customFullscreen = (wantsFullScreen === true);
		});
	};


	$scope.like = function (item) {
		item.isLiked = item.isLiked ? false : true;
	}

	$scope.submitTweet = function () {
		if ($scope.tweet.message != "") {
			$scope.messages.unshift({
				face : imagePath,
				what: 'Brunch this weekend?',
				who: $rootScope.username, //'Sonny',
				when: '3:08PM',
				notes: $scope.tweet.message
			});
			showSimpleToast();
			$scope.tweet.message = "";
		}
	}

	var imagePath = 'http://www.petdrugsonline.co.uk/images/page-headers/cats-master-header';
	$scope.messages = [ {
		face : imagePath,
		what: 'Brunch this weekend?',
		who: 'Min Li Chan',
		when: '3:08PM',
		notes: " I'll be in your neighborhood doing errands",
		isLiked: false
	}];
});

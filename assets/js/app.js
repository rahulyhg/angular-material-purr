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

}).run(function($rootScope, $mdMedia, $mdDialog) {

	var imagePath = 'http://static.boredpanda.com/blog/wp-content/uploads/2016/02/smiling-cat-shelter-adopted-coen-ava-rey-thumb.jpg';
	//initialize posts
	$rootScope.messages = [{
		face : imagePath,
		who: 'Min Li Chan',
		notes: "I'll be in your neighborhood doing errands",
		isLiked: false
	}];
	
	var showLogin = function () {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
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

		}, function() {
		});
	}
	showLogin();
});


app.controller('DialogController', function($scope, $mdDialog, tweetData, $rootScope) {

	$scope.username = tweetData.who;
	$scope.meowmessage = tweetData.notes;
	$scope.isLiked = tweetData.isLiked;

	$scope.showConfirm = function(ev) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	    .title('Delete your post?')
	    .textContent('This will delete your post')
	    .ariaLabel('Lucky day')
	    .targetEvent(ev)
	    .ok('YES')
	    .cancel('NO');
	    $mdDialog.show(confirm).then(function() {

	    	//todo: if confirmed deletion
	    	console.log(tweetData);

	    	var index = $rootScope.messages.indexOf(tweetData);
	    	if (index > -1) {	
				$rootScope.messages.splice(index, 1);
	    	}
	    }, function() {
	    	//todo: if cancelled
	    });
	};

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
	var imagePath = 'http://static.boredpanda.com/blog/wp-content/uploads/2016/02/smiling-cat-shelter-adopted-coen-ava-rey-thumb.jpg';

	$scope.tweet = {
		message: "\n\n\n" //workaround to make textarea rows grow by default
	};

	var last = {
		bottom: true,
		top: false,
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

	$scope.showAdvanced = function(ev, item) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

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
			$rootScope.messages.unshift({
				face : imagePath,
				who: $rootScope.username, //'Sonny',
				notes: $scope.tweet.message
			});
			showSimpleToast();
			$scope.tweet.message = "";
		}
	}

});
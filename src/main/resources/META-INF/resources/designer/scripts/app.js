/*-
 * ============LICENSE_START=======================================================
 * ONAP CLAMP
 * ================================================================================
 * Copyright (C) 2017-2018 AT&T Intellectual Property. All rights
 *                             reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END============================================
 * ===================================================================
 * 
 */
'use strict';
/* App Module */
var app = angular
.module(
'clds-app',
[ 'ngRoute', 'ngResource', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate',
    'dialogs.main', 'ngSanitize', 'ngCookies', 'ui.bootstrap.modal' ])
.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {

	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = true;
} ])
.config(function($httpProvider) {

	$httpProvider.interceptors.push('myHttpInterceptor');
	var spinnerFunction = function spinnerFunction(data, headersGetter) {

		return data;
	};
	$httpProvider.defaults.transformRequest.push(spinnerFunction);
})
.config(
[
    '$routeProvider',
    '$locationProvider',
    '$compileProvider',
    'cfpLoadingBarProvider',
    function($routeProvider, $locationProvider, cfpLoadingBarProvider,
             $timeout, dialogs, $cookies) {

	    $locationProvider.html5Mode(false);
	    $routeProvider.when('/otherwise', {
	        templateUrl : 'please_wait.html',
	        controller : 'QueryParamsHandlerCtrl'
	    }).when('/dashboard', {
	        templateUrl : 'partials/portfolios/clds_modelling.html',
	        controller : 'DashboardCtrl'
	    }).when('/activity_modelling', {
	        templateUrl : 'partials/portfolios/clds_modelling.html',
	        controller : 'DashboardCtrl'
	    }).when('/authenticate', {
	        templateUrl : 'authenticate.html',
	        controller : 'AuthenticateCtrl'
	    }).when('/invalidlogin', {
	        templateUrl : 'invalid_login.html',
	        controller : 'PageUnderConstructionCtrl'
	    }).otherwise({
		    redirectTo : '/otherwise'
	    });
    } ])
.controller(
'dialogCtrl',
function($scope, $rootScope, $timeout, dialogs) {

	// -- Variables --//
	$scope.lang = 'en-US';
	$scope.language = 'English';
	var _progress = 100;
	$scope.name = '';
	$scope.confirmed = 'No confirmation yet!';
	$scope.custom = {
		val : 'Initial Value'
	};
	// -- Listeners & Watchers --//
	$scope.$watch('lang', function(val, old) {

		switch (val) {
			case 'en-US':
				$scope.language = 'English';
				break;
			case 'es':
				$scope.language = 'Spanish';
				break;
		}
	});
	// -- Methods --//
	$rootScope.testCaseRequirements = [];
	$rootScope.validTestRequirements = [];
	$scope.setLanguage = function(lang) {

		$scope.lang = lang;
		$translate.use(lang);
	};
	$rootScope.launch = function(which) {

		switch (which) {
			case 'error':
				dialogs.error();
				break;
			case 'wait':
				break;
			case 'customwait':
				break;
			case 'notify':
				dialogs.notify();
				break;
			case 'confirm':
				var dlg = dialogs.confirm();
				dlg.result.then(function(btn) {

					$scope.confirmed = 'You confirmed "Yes."';
				}, function(btn) {

					$scope.confirmed = 'You confirmed "No."';
				});
				break;
			case 'custom':
				var dlg = dialogs.create('/dialogs/custom.html',
				'customDialogCtrl', {}, {
				    size : 'lg',
				    keyboard : true,
				    backdrop : 'static',
				    windowClass : 'my-class'
				});
				dlg.result.then(function(name) {

					$scope.name = name;
				}, function() {

					if (angular.equals($scope.name, ''))
						$scope.name = 'You did not enter in your name!';
				});
				break;
			case 'custom2':
				var dlg = dialogs.create('/dialogs/custom2.html',
				'customDialogCtrl2', $scope.custom, {
					size : 'lg'
				});
				break;
			case 'custom3':
				var dlg = dialogs
				.notify(
				'Message',
				'All is not supported, Please select interface(s)/version(s) to fetch real time federated coverage report.');
				break;
			case 'custom4':
				var dlg = dialogs
				.confirm(
				'Message',
				'You are about to fetch real time federated coverage report.This may take sometime!!!.');
				dlg.result.then(function(btn) {

					$scope.confirmed = 'You confirmed "Yes."';
				}, function(btn) {

					$scope.confirmed = 'You confirmed "No."';
				});
				break;
			case 'custom5':
				var dlg = dialogs.notify('Success',
				'Request has been successfully processed.');
				break;
			case 'custom6':
				var dlg = dialogs.notify('Message',
				'Please type Testscenario Name');
				break;
		}
	}; // end launch
	var _fakeWaitProgress = function() {

		$timeout(function() {

			if (_progress < 100) {
				_progress += 33;
				$rootScope.$broadcast('dialogs.wait.progress', {
					'progress' : _progress
				});
				_fakeWaitProgress();
			} else {
				$rootScope.$broadcast('dialogs.wait.complete');
				_progress = 0;
			}
		}, 1000);
	};
})
.controller(
'MenuCtrl',
[
    '$scope',
    '$rootScope',
    '$timeout',
    'dialogs',
    '$location',
    'MenuService',
    'Datafactory',
    'userPreferencesService',
    'cldsModelService',
    'extraUserInfoService',
    function($scope, $rootScope, $timeout, dialogs, $location, MenuService,
             Datafactory, userPreferencesService, cldsModelService,
             extraUserInfoService) {

	    console.log("MenuCtrl");
	    $rootScope.screenName = "Universal Test Modeler";
	    $rootScope.loop_logs = [];
	    $rootScope.testSet = null;
	    $rootScope.contactUs = function() {

		    console.log("contactUs");
		    var link = "mailto:onap-discuss@lists.onap.org?subject=CLAMP&body=Please send us suggestions or feature enhancements or defect. If possible, please send us the steps to replicate any defect.";
		    window.location.href = link;
	    };
	    extraUserInfoService.getUserInfo().then(function(pars) {

		    $scope.userInfo = pars;
		    if (!($scope.userInfo["permissionUpdateCl"])) {
			    readMOnly = true;
		    }
		    ;
	    });
	    $scope.emptyMenuClick = function(value, name) {

		    if ($rootScope.isNewClosed
		    && name != "Close Model" && name != "Properties CL") {
			    saveConfirmationNotificationPopUp();
		    } else {
			    isSaveCheck(name);
		    }
		    function saveConfirmationNotificationPopUp() {

			    $scope.saveConfirmationNotificationPopUp(function(data) {

				    if (data) {
					    $rootScope.isNewClosed = false;
				    } else {
					    return false;
				    }
			    });
		    }
		    function isSaveCheck(name) {

			    if (name == "User Info") {
				    $scope.extraUserInfo();
			    } else if (name == "Wiki") {
				    window.open(value);
			    } else if (name == "Contact Us") {
				    $rootScope.contactUs();
			    } else if (name == "Close Model") {
				    $scope.cldsClose();
			    } else if (name == "Open CL") {
				    $scope.cldsOpenModel();
			    } else if (name == "Submit") {
				    $scope.cldsConfirmPerformAction("SUBMIT");
			    } else if (name == "Update") {
				    $scope.cldsConfirmPerformAction("UPDATE");
			    } else if (name == "Delete") {
				    $scope.cldsConfirmPerformAction("DELETE");
			    } else if (name == "Stop") {
				    $scope.cldsConfirmPerformAction("STOP");
			    } else if (name == "Restart") {
				    $scope.cldsConfirmPerformAction("RESTART");
			    } else if (name == "Refresh Status") {
				    $scope.refreshStatus();
			    } else if (name == "Properties CL") {
				    $scope.cldsOpenModelProperties();
			    } else if (name == "Deploy") {
				    $scope.cldsAskDeployParametersPerformAction();
			    } else if (name == "UnDeploy") {
				    $scope.cldsConfirmToggleDeployPerformAction("UnDeploy");
			    } else {
				    $rootScope.screenName = name;
				    $scope.updatebreadcrumb(value);
				    $location.path(value);
			    }
		    }
	    };
	    $rootScope.impAlerts = function() {

	    };
	    $scope.tabs = {
	        "Closed Loop" : [ {
	            link : "/cldsOpenModel",
	            name : "Open CL"
	        }, {
	            link : "/cldsOpenModelProperties",
	            name : "Properties CL"
	        }, {
	            link : "/Close",
	            name : "Close Model"
	        } ],
	        "Manage" : [ {
	            link : "/cldsSubmit",
	            name : "Submit"
	        }, {
	        // disabled for Dublin since Policy doesn't support updating in this release
		    //   link : "/cldsUpdate",
	        //    name : "Update"
	        //}, {
	            link : "/cldsStop",
	            name : "Stop"
	        }, {
	            link : "/cldsRestart",
	            name : "Restart"
	        }, {
	            link : "/cldsDelete",
	            name : "Delete"
	        }, {
	            link : "/cldsDeploy",
	            name : "Deploy"
	        }, {
	            link : "/cldsUnDeploy",
	            name : "UnDeploy"
	        } ],
	        "View" : [ {
	            link : "/refreshStatus",
	            name : "Refresh Status"
	        } ],
	        "Help" : [ {
	            link : "http://wiki.onap.org",
	            name : "Wiki"
	        }, {
	            link : "/contact_us",
	            name : "Contact Us"
	        }, {
	            link : "/extraUserInfo",
	            name : "User Info"
	        } ]
	    };
	    if (!Object.keys) {
		    Object.keys = function(obj) {

			    var keys = [];
			    for ( var i in obj) {
				    if (obj.hasOwnProperty(i)) {
					    keys.push(i);
				    }
			    }
			    return keys;
		    };
		    $scope.keyList = Object.keys($scope.tabs);
	    } else {
		    $scope.keyList = Object.keys($scope.tabs);
	    }
	    $scope.updatebreadcrumb = function(path) {

		    var currentURL = $location.path();
		    if (path != undefined) {
			    currentURL = path;
		    }
		    if (currentURL == "/dashboard") {
			    $rootScope.screenName = "Universal Test Modeler";
			    $rootScope.parentMenu = "Home";
			    $rootScope.rightTabName = "UTM Build Configuration";
		    } else {
			    var found = false;
			    angular.forEach($scope.keyList, function(value, key) {

				    if (!found) {
					    $rootScope.parentMenu = value;
					    angular.forEach($scope.tabs[value],
					    function(value, key) {

						    if (currentURL == value.link) {
							    $rootScope.screenName = value.name;
							    found = true;
						    }
					    });
				    }
			    });
		    }
	    };
	    $scope.updatebreadcrumb();
	    $scope.homePage = function() {

		    $location.path('/dashboard');
	    };
	    $scope.propertyExplorerErrorMessage = function(msg) {

		    var dlg = dialogs.notify('Error', msg);
	    }
	    $scope.activityModelling = function() {

	    };
	    $scope.cldsClose = function() {

		    var dlg = dialogs.create(
		    'partials/portfolios/confirmation_window.html',
		    'CldsOpenModelCtrl', {
		        closable : true,
		        draggable : true
		    }, {
		        size : 'lg',
		        keyboard : true,
		        backdrop : 'static',
		        windowClass : 'my-class'
		    });
		    dlg.result.then(function(name) {

			    // $scope.name = name;
		    }, function() {

			    // if(angular.equals($scope.name,''))
			    // $scope.name = 'You did not enter in your
			    // name!';
		    });
	    };
	    $scope.saveConfirmationNotificationPopUp = function(callBack) {

		    var dlg = dialogs.create(
		    'partials/portfolios/save_confirmation.html',
		    'saveConfirmationModalPopUpCtrl', {
		        closable : true,
		        draggable : true
		    }, {
		        size : 'lg',
		        keyboard : true,
		        backdrop : 'static',
		        windowClass : 'my-class'
		    });
		    dlg.result.then(function(name) {

			    callBack("OK");
		    }, function() {

			    callBack(null);
		    });
	    };
	    $rootScope.cldsOpenModelProperties = function() {

		    var dlg = dialogs.create(
		    'partials/portfolios/global_properties.html',
		    'GlobalPropertiesCtrl', {}, {
		        size : 'lg',
		        keyboard : true,
		        backdrop : 'static',
		        windowClass : 'my-class'
		    });
		    dlg.result.then(function(name) {

		    }, function() {

		    });
	    };
	    $scope.cldsOpenModel = function() {

		    var dlg = dialogs.create(
		    'partials/portfolios/clds_open_model.html', 'CldsOpenModelCtrl', {
		        closable : true,
		        draggable : true
		    }, {
		        size : 'lg',
		        keyboard : true,
		        backdrop : 'static',
		        windowClass : 'my-class'
		    });
		    dlg.result.then(function(name) {
		    	
		    }, function() {
		    });
	    };
	    $rootScope.refreshLoopLog = function() {
	    	var newLogArray = [];
	    	if (getLoopLogsArray() != undefined) {
	    		newLogArray=getLoopLogsArray();
	    	}
	    	$rootScope.loop_logs.splice(0, $rootScope.loop_logs.length);
	    	for (var i=0;i<newLogArray.length;i++) {
	    		$rootScope.loop_logs.push(newLogArray[i]);
	    	}
	    }
	    $scope.extraUserInfo = function() {

		    var dlg = dialogs.create(
		    'partials/portfolios/extra_user_info.html', 'ExtraUserInfoCtrl', {
		        closable : true,
		        draggable : true
		    }, {
		        size : 'lg',
		        keyboard : true,
		        backdrop : 'static',
		        windowClass : 'my-class'
		    });
		    dlg.result.then(function(name) {

		    }, function() {

		    });
	    };
	    $scope.cldsPerformAction = function(uiAction) {
		    var modelName = selected_model;
		    console.log("cldsPerformAction: " + uiAction + " modelName="
		    + modelName);

		    cldsModelService.processAction(uiAction, modelName).then(function(pars) {
			    console.log("cldsPerformAction: pars=" + pars);
			    $rootScope.refreshLoopLog();
		    }, function(data) {

		    });
	    };
	    $scope.refreshStatus = function() {
		    var modelName = selected_model;
		    console.log("refreStatus modelName=" + modelName);
		    cldsModelService.getModel(modelName).then(function(pars) {
			    console.log("refreStatus: pars=" + pars);
			    cldsModelService.processRefresh();
		    }, function(data) {

		    });
	    };
	    $scope.cldsConfirmPerformAction = function(uiAction) {

		    var dlg = dialogs.confirm('Message', 'Do you want to '
		    + uiAction.toLowerCase() + ' the closed loop?');
		    dlg.result.then(function(btn) {

			    $scope.cldsPerformAction(uiAction);
		    }, function(btn) {

		    });
	    };
	    $scope.cldsAskDeployParametersPerformAction = function() {

		    var dlg = dialogs.create(
		    'partials/portfolios/deploy_parameters.html', 'DeploymentCtrl', {},
		    {
		        keyboard : true,
		        backdrop : true,
		        windowClass : 'deploy-parameters'
		    });
		    dlg.result.then(function() {

			    var confirm = dialogs.confirm('Deploy',
			    'Are you sure you want to deploy the closed loop?');
			    confirm.result.then(function() {

				    cldsToggleDeploy("deploy");
			    });
		    });
	    };
	    $scope.cldsConfirmToggleDeployPerformAction = function(uiAction) {

		    var dlg = dialogs.confirm('Message', 'Do you want to '
		    + uiAction.toLowerCase() + ' the closed loop?');
		    dlg.result.then(function(btn) {

			    cldsToggleDeploy(uiAction.toLowerCase());
		    }, function(btn) {

		    });
	    };
	    function cldsToggleDeploy(uiAction) {
		    console.log("cldsPerformAction: " + uiAction + " modelName="
		        + selected_model);
		    cldsModelService.toggleDeploy(uiAction, selected_model).then(
		    function(pars) {
		    }, function(data) {

		    });
	    }
	    $scope.ToscaModelWindow = function (tosca_model) {

	    	var dlg = dialogs.create('partials/portfolios/tosca_model_properties.html','ToscaModelCtrl',{closable:true,draggable:true},{size:'lg',keyboard: true,backdrop: 'static',windowClass: 'my-class'});
	    	dlg.result.then(function(name){
	    	},function(){
	    	});
	    };
	    $scope.PolicyWindow = function(policy) {

		    var dlg = dialogs.create(
		    'partials/portfolios/operational_policy_window.html',
		    'operationalPolicyCtrl', {
		        closable : true,
		        draggable : true
		    }, {
		        size : 'lg',
		        keyboard : true,
		        backdrop : 'static',
		        windowClass : 'my-class'
		    });
		    dlg.result.then(function(name) {

		    }, function() {

		    });
	    };
    } ]);
app.service('MenuService', [ '$http', '$q', function($http, $q) {

} ]);
app.directive('focus', function($timeout) {

	return {
	    scope : {
		    trigger : '@focus'
	    },
	    link : function(scope, element) {

		    scope.$watch('trigger', function(value) {

			    if (value === "true") {
				    $timeout(function() {

					    element[0].focus();
				    });
			    }
		    });
	    }
	};
});
app.directive('draggable', function($document) {

	return function(scope, element, attr) {

		var startX = 0, startY = 0, x = 0, y = 0;
		element.css({
		    position : 'relative',
		    backgroundColor : 'white',
		    cursor : 'move',
		    display : 'block',
		});
		element.on('mousedown', function(event) {

			startX = event.screenX - x;
			startY = event.screenY - y;
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});
		function mousemove(event) {

			y = event.screenY - startY;
			x = event.screenX - startX;
			element.css({
			    top : y + 'px',
			    left : x + 'px'
			});
		}
		function mouseup() {

			$document.off('mousemove', mousemove);
			$document.off('mouseup', mouseup);
		}
	};
});
app.factory('myHttpInterceptor', function($q, $window) {

	return function(promise) {

		return promise.then(function(response) {

			return response;
		}, function(response) {

			return $q.reject(response);
		});
	};
});
app.run([ '$route', function($route) {

	$route.reload();
} ]);

function F5Window() {

	angular.element(document.getElementById('navbar')).scope().F5Window();
}
function GOCWindow() {

	angular.element(document.getElementById('navbar')).scope().GOCWindow();
}
function ToscaModelWindow() {
    angular.element(document.getElementById('navbar')).scope().ToscaModelWindow();
}
function PolicyWindow(PolicyWin) {

	angular.element(document.getElementById('navbar')).scope().PolicyWindow(
	PolicyWin);
}
function pathDetails(bpmnElementID, bpmnElementName, pathIdentifiers) {

	angular.element(document.getElementById('navbar')).scope().pathDetails(
	bpmnElementID, bpmnElementName, pathIdentifiers);
}
function setdefaultvalue() {

	angular.element(document.getElementById('navbar')).scope()
	.setDefaultValue();
}
function saveProject() {

	angular.element(document.getElementById('navbar')).scope().saveProject();
}

function defineServiceAcronym() {

	angular.element(document.getElementById('navbar')).scope()
	.defineServiceAcronym();
}
function errorProperty(msg) {

	angular.element(document.getElementById('navbar')).scope()
	.propertyExplorerErrorMessage(msg);
}
function invisiblepropertyExplorer() {

	angular.element(document.getElementById('navbar')).scope()
	.invisibleproperty();
}
function updateDecisionLabel(originalLabel, newLabel) {

	angular.element(document.getElementById('navbar')).scope()
	.updateDecisionLabels(originalLabel, newLabel);
}
// Used to logout the session , when browser window was closed
window.onunload = function() {

	window.localStorage.removeItem("isAuth");
	window.localStorage.removeItem("loginuser");
	window.localStorage.removeItem("invalidUser");
};

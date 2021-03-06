/*-
 * ============LICENSE_START=======================================================
 * ONAP CLAMP
 * ================================================================================
 * Copyright (C) 2019 AT&T Intellectual Property. All rights
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
app.service('toscaModelService', ['alertService','$http', '$q', '$rootScope', function (alertService,$http, $q, $rootScope) {

	this.getHpModelJsonByPolicyType = function(policyType) {
		var sets = [];
		var svcUrl = "/restservices/clds/v1/tosca/models/policyType/" + policyType;
		return $http({
			method : "GET",
			url : svcUrl
		}).then(function successCallback(response) {
			return response.data;
		}, function errorCallback(response) {
			//Open Model Unsuccessful
			return response.data;
		});
	};
	
	this.saveMsProperties = function(form) {
		 var loopName = getLoopName();
		 var def = $q.defer();
		 var svcUrl = "/restservices/clds/v2/loop/updateMicroservicePolicy/" + loopName;
		 $http.post(svcUrl, form).success(function(data) {
			 def.resolve(data);
		 }).error(function(data) {
			 def.reject("Save Model not successful");
		 });
	    return def.promise;
	};
 }]);

/*-
 * ============LICENSE_START=======================================================
 * ONAP CLAMP
 * ================================================================================
 * Copyright (C) 2017 AT&T Intellectual Property. All rights
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

app.directive( "contextMenu", function($compile){
    
    contextMenu = {};
    contextMenu.restrict = "AE";
    contextMenu.link = function( lScope, lElem, lAttr ){
        console.log("link");
        lElem.on("contextmenu", function (e) {
            console.log("contextmenu");
            e.preventDefault(); 
            lElem.append( $compile( lScope[ lAttr.contextMenu ])(lScope) );
            $("#contextmenu-node").css("left", e.clientX);
            $("#contextmenu-node").css("top", e.clientY);            
        });
        lElem.on("mouseleave", function(e){
            console.log("mouseleave");
            if($("#contextmenu-node") )
                $("#contextmenu-node").remove();
        });
        lElem.on("click", function(e){
        console.log("click"); 
            if($("#contextmenu-node") )
                $("#contextmenu-node").remove();
        });
    };
    return contextMenu;
});

app.directive('ngRightClick', function($parse) {
   
    return function(scope, element, attrs) {
       
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            
            scope.$apply(function() {
                
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

app.directive('inputInfoClass', function ($compile) {
   
  return {
      restrict: "C",
      replace: true,
      link: function(scope,element,attrs){
       
    	  var elementHTML = '';
    	  scope.sourceExplorer = 'AM';
    	  angular.forEach(scope.infoType.schemaElements, function(value, key){
            
    		  
    		  scope.schemaElement = value;
    		  
    		  if(scope.schemaElement.complexType != null){
    			  if(scope.currentElementName == ''){
    				  scope.currentElementName = scope.schemaElement.complexType.name;
    			  }
    			  
    			  scope.ParentKey = scope.parentName + '_' + scope.currentElementName;
    			  if(scope.schemaElement.repeatableHierarchicalPrefix != null){
    				  scope.ParentKey = scope.ParentKey + scope.schemaElement.repeatableHierarchicalPrefix; 
    			  }
    			  scope.parElement = scope.schemaElement;
    			  scope.tableStyle = 'table-level' + scope.heirarchyLevel + '-tree'; 
    			  scope.tdLabelStyle = 'td-level' + scope.heirarchyLevel + '-label-tree'; 
    			  scope.heirLevel = scope.heirarchyLevel;
    			  
    			  elementHTML = elementHTML + '<div ng-show="schemaElement.complexType != null">';
    			  elementHTML = elementHTML + '<table class="{{tableStyle}}"> <tr>';
    			  elementHTML = elementHTML + '<td class="{{tdLabelStyle}}">';
    			  elementHTML = elementHTML + '<span class="pull-left" ng-click="showUTMViewMsgHeader=!showUTMViewMsgHeader">';
    			  elementHTML = elementHTML + '<i ng-class="showUTMViewMsgHeader == true ?\'fa fa-plus-circle\':\'fa fa-minus-circle\'"></i>';
    			  elementHTML = elementHTML + '</span>';
    			  elementHTML = elementHTML + '<b>{{currentElementName}}</b>';
    			  elementHTML = elementHTML + '</td>';
    			  elementHTML = elementHTML + '<td class="td-tree"></td>';
    			  elementHTML = elementHTML + '<td class="td-tree"></td>';
    			  elementHTML = elementHTML + '<td class="td-tree"></td>';
    			  elementHTML = elementHTML + '<td class="td-blank"></td>';
    			  elementHTML = elementHTML + '<td class="td-default_value-tree"> </td>';
    			  elementHTML = elementHTML + '</tr></table>';
    			  elementHTML = elementHTML + '<div style="margin-left: 10px" ng-class="{hidden:showUTMViewMsgHeader,chaldean:showUTMViewMsgHeader}">';
    			  elementHTML = elementHTML + '<div class="inputInfoClassMember" style="margin-left: 10px" ng-repeat="schemaElement in schemaElement.elements"></div>';
    			  elementHTML = elementHTML + '</div>';
    			  elementHTML = elementHTML + '</div>';
    			  var x = angular.element(elementHTML);
	                element.append(x);
	                $compile(x)(scope);
    		  }
	      });
    	  
      }
  }
});

app.directive('inputInfoClassMember', function ($compile, $timeout) {
    
  return {
      restrict: "C",

      link: function(scope,element,attrs){
        
    	  
    	  var elementHTML = '';
    	  
    	  scope.currentElementName=scope.objectName;
    	  scope.parentName=scope.ParentKey; 
    	  scope.parentElement=scope.parElement; 
    	  scope.heirarchyLevel = scope.heirLevel + 1;
    	  if(scope.schemaElement.element.name != null){
    		  
    		  scope.elementKey=scope.parentName + '_' + scope.schemaElement.element.name;
    		  if(scope.schemaElement.repeatableHierarchicalPrefix != null){
    			  scope.elementKey = scope.elementKey + scope.schemaElement.repeatableHierarchicalPrefix;
    		  }
    		  scope.tableStyle='table-level' + scope.heirarchyLevel + '-tree'; 
    		  scope.tdLabelStyle='td-level' + scope.heirarchyLevel +'-label-tree';
    		  
    		  if(scope.schemaElement.type.complexType != null){
    			  scope.showUTMViewMsgHeader = false;
    			  
    		  }else{
    			  scope.showUTMViewMsgHeader = true;
    			  if(scope.schemaElement.element.simpleType != null){
	    			  if(scope.schemaElement.element.simpleType.restriction != null){
		    			  if(scope.schemaElement.element.simpleType.restriction.minExclusivesAndMinInclusivesAndMaxExclusives != null){
		    				  angular.forEach(scope.schemaElement.element.simpleType.restriction.minExclusivesAndMinInclusivesAndMaxExclusives, function(value, key){
		    					 if(value.name!=null){
			    					 if((value.name).indexOf('enumeration') > -1){
			    						 scope.showUTMViewMsgHeader = false;
			    					 }
		    					 }
		    				  });
		    			  }
	    			  }
    			  }
    		  }
    		  
    		  elementHTML = elementHTML + '<div ng-show="schemaElement.element.name != null">';
    		  elementHTML = elementHTML + '<div id="elementKey">';
    		  elementHTML = elementHTML + '<table class="{{tableStyle}}"> ';
    		  elementHTML = elementHTML + '<tr>';
    		  elementHTML = elementHTML + '<td style="text-align: left;vertical-align: top;" class="{{tdLabelStyle}}">';
    		  elementHTML = elementHTML + '<div ng-mouseover="getContextMenu(schemaElement,elementKey)" context-menu="myContextDiv">';
    		  elementHTML = elementHTML + '<span class="pull-left" ng-click="showUTMViewMsgHeader=!showUTMViewMsgHeader" ng-style="(schemaElement.type.recursive ||schemaElement.list) && {\'color\':\'#0000FF\'} || {\'color\': \'#444444\'}">';
    		  elementHTML = elementHTML + '<i expandable ng-class="showUTMViewMsgHeader == true ?\'fa fa-minus-circle\':\'fa fa-plus-circle\'"></i>';
    		  elementHTML = elementHTML + '{{schemaElement.element.name}}  ';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '</span>';
    		  elementHTML = elementHTML + '</div>';
    		  elementHTML = elementHTML + '</td>';
    		  
    		  if(scope.repeatableHeirarchicalElementMap !=null){
    			  elementHTML = elementHTML + '<div ng-if= "repeatableHeirarchicalElementMap !=null">';
    			  elementHTML = elementHTML + '<div ng-if="repeatableHeirarchicalElementMap[elementKey] != null">';
    			  elementHTML = elementHTML + '<div ng-repeat="repeatableElement in repeatableHeirarchicalElementMap[elementKey].repeatableElements">';
    			  elementHTML = elementHTML + '<div ng-init="addRepeatableElement1(schemaElement, parentElement, elementKey, $index)"></div>';
    			  elementHTML = elementHTML + '</div>';
    			  elementHTML = elementHTML + '<div ng-repeat="heirarchicalElement in repeatableHeirarchicalElementMap[elementKey].heirarchicalElements">';
    			  elementHTML = elementHTML + '</div>';
    			  elementHTML = elementHTML + '<div ng-init="addHierarchicalElement1(schemaElement, parentElement, elementKey, $index)"></div>';
    			  elementHTML = elementHTML + '</div>';
    			  elementHTML = elementHTML + '</div>';
    		  }
    		  
    		  elementHTML = elementHTML + '<td class="td-blank"></td>';
    		  elementHTML = elementHTML + '<td style="text-align: right;" class="td-tree">';
    		  if(scope.schemaElement.type.complexType == null){
    			  elementHTML = elementHTML + '<div><input type="checkbox" id="{{elementKey + \'_checkbox\'}}" ng-model="utmModelSchemaExtension.utmSchemaExtentionMap[elementKey].checked" ng-init="requiredValues[elementKey]=schemaElement.element.minOccurs;utmModelSchemaExtension.utmSchemaExtentionMap[elementKey].checked=(utmModelSchemaExtension.radioSelection == \'Required Only\' && schemaElement.element.minOccurs !=0) || utmModelSchemaExtension.radioSelection == \'Select All\' || utmModelSchemaExtension.utmSchemaExtentionMap[elementKey].checked" ng-change="onChange()"/></div>'
    		  }
    		  
    		  elementHTML = elementHTML + '</td>';
    		  elementHTML = elementHTML + '<td style="text-align:center;word-wrap: break-word" class="td-default_value-tree"><label id="{{elementKey + \'_label\'}}"/>{{utmModelSchemaExtension.utmSchemaExtentionMap[elementKey].defaultValue}}</td>';
    		  elementHTML = elementHTML + '</tr>';
    		  elementHTML = elementHTML + '</table>';
    		  elementHTML = elementHTML + '<div style="margin-left: 10px" ng-class="{hidden:!showUTMViewMsgHeader,chaldean:!showUTMViewMsgHeader}">';
    		  
    		  if(scope.schemaElement.type != null && scope.schemaElement.type.restriction != null){
    			  elementHTML = elementHTML + '<div ng-if = "schemaElement.type != null && schemaElement.type.restriction != null">';
    			  elementHTML = elementHTML + '<div ng-repeat="object in filteredObjects = (schemaElement.type.restriction.minExclusivesAndMinInclusivesAndMaxExclusives | filter: {name : \'enumeration\'})">';
    			  elementHTML = elementHTML + '{{object.value.value}}';
    			  elementHTML = elementHTML + '</div>';
    			  elementHTML = elementHTML + '</div>';
    		  }
    		  
    		  elementHTML = elementHTML + '</div>';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '';
    		  elementHTML = elementHTML + '</div>';
    		  elementHTML = elementHTML + '</div>';
    		  
    		  var x = angular.element(elementHTML);
                element.append(x);
                $compile(x)(scope);
                
    		  
    		  if(scope.schemaElement.type.complexType != null){
    			  if(scope.schemaElement.repeatableHierarchicalPrefix!=null){
    			  }
	    		  var elementHTML2 = '<div ng-show="schemaElement.type.complexType != null">'
    			  elementHTML2 = elementHTML2 + '<div ng-init="parKey=parentName + \'_\' + schemaElement.element.name + (schemaElement.repeatableHierarchicalPrefix != null ? schemaElement.repeatableHierarchicalPrefix : \'\'); heirLevel=heirarchyLevel; parElement=schemaElement; ParentKey=ParentKey+\'_\'+schemaElement.element.name + (schemaElement.repeatableHierarchicalPrefix != null ? schemaElement.repeatableHierarchicalPrefix : \'\');">'
    			  elementHTML2 = elementHTML2 + '<div style="margin-left: 10px" ng-class="{hidden:!showUTMViewMsgHeader,chaldean:!showUTMViewMsgHeader}">'
    			  if(scope.schemaElement.repeatableHierarchicalPrefix!=null){
    				  elementHTML2 = elementHTML2 + '<div id="{{parKey}}"></div>'
    			  }else{
    				  elementHTML2 = elementHTML2 + '<div id="{{parKey}}"></div>'
    			  }
    			  elementHTML2 = elementHTML2 + '</div>'
    			  elementHTML2 = elementHTML2 + '</div>'
    			  elementHTML2 = elementHTML2 + '</div>';
	    		  var x = angular.element(elementHTML2);
	                element.append(x);
	                $compile(x)(scope);
	    	  }
    		  
    	  }
    	  
      }
  }
  
  
});

app.directive('expandable', function ($compile) {
    
  return {
      restrict: "AE",
      link: function(scope,element,attrs){
        
    	  var elementHTML = '';
    	  element.bind("click", function(){
    		 
    		 var test1 = document.getElementById(scope.parKey);
    		 
    		 if(test1 != null){
    			 if((test1.getElementsByTagName('div') != null)&&(scope.schemaElement.type.elements != null)){
    		 
		    		 var htmlCount = test1.getElementsByTagName('div').length;
		    		 var schemaElementCount = scope.schemaElement.type.elements.length;
		    		 
		    		 if(htmlCount<schemaElementCount){
		    			 var x = angular.element(test1).append('<div class="inputInfoClassMember" style="margin-left: 10px" ng-repeat="schemaElement in schemaElement.type.elements" ng-init="currentElementName=schemaElement.element.name;parentName=parKey; parentElement=parElement; heirarchyLevel=heirLevel+1 ;"></div>');
			             $compile(x)(angular.element('#'+scope.parKey).scope());
		    		 }
    			 }
    		 }
    		 
    		 var cElements = document.getElementsByClassName(scope.sourceExplorer+'_'+scope.parKey);
    		 if(cElements != null){
    			 
    			 for(var i=0; i<cElements.length; i++) {
    				 if((cElements[i].getElementsByTagName('div') != null)&&(scope.schemaElement.type.elements != null)){
    					 var htmlCount = cElements[i].getElementsByTagName('div').length;
    		    		 var schemaElementCount = scope.schemaElement.type.elements.length;

    		    		 if(htmlCount<schemaElementCount){
    		    			 var x = '';
    		    			 if(scope.sourceExplorer=='SDV'){
    		    				 x = angular.element(cElements[i]).append('<div class="inputInfoDVClassMember" style="margin-left: 10px" ng-repeat="schemaElement in schemaElement.type.elements" ng-init="currentElementName=schemaElement.element.name;parentName=parKey; parentElement=parElement; heirarchyLevel=heirLevel+1 ;"></div>');
    		    			 }else if(scope.sourceExplorer=='PE'){
    		    				 x = angular.element(cElements[i]).append('<div class="inputInfoPropertyClassMember" style="margin-left: 10px" ng-repeat="schemaElement in schemaElement.type.elements" ng-init="currentElementName=schemaElement.element.name;parentName=parKey; parentElement=parElement; heirarchyLevel=heirLevel+1 ;"></div>');
    		    			 }else if(scope.sourceExplorer=='USU'||scope.sourceExplorer=='USC'){
    		    				 x = angular.element(cElements[i]).append('<div class="inputInfoUpgradeClassMember" style="margin-left: 10px" ng-repeat="schemaElement in schemaElement.type.elements" ng-init="currentElementName=schemaElement.element.name;parentName=parKey; parentElement=parElement; heirarchyLevel=heirLevel+1 ;"></div>');
    		    			 }
    		    			 
    			             $compile(x)(angular.element('.'+scope.sourceExplorer+'_'+scope.parKey).scope());
    		    		 }
    				 }
    			 }
    		 }
    	  });
      }
  }
});


app.controller('ActivityModellingCtrl', ['$scope', '$rootScope', '$location','dialogs', '$filter','Datafactory', function($scope,$rootScope, $location,dialogs,$filter,Datafactory){
	
	
	$scope.count=0;
	$scope.depth=0;
	$scope.parentElementList=[];
	$scope.schemaElementKeyMap={};
	$scope.isVisible = false;
	$rootScope.countElementKeyMap={};
	$rootScope.depthElementKeyMap={};
	$rootScope.isHorR = true;
	$rootScope.requiredValues = {};
	
	$scope.utmModelSchemaExtension = {};
	$rootScope.repeatableHeirarchicalElementMap = {};
	
	
	

	$rootScope.initProjectExplorer = function () {
		
		if(map_model_repeatable_heirarchical_elements[selected_model] != null) {
			$rootScope.repeatableHeirarchicalElementMap = map_model_repeatable_heirarchical_elements[selected_model];
		}
			
		
		if(list_model_schema_extensions[selected_model] != null) {
			$scope.utmModelSchemaExtension = list_model_schema_extensions[selected_model];
			if($scope.utmModelSchemaExtension.radioSelection == null || $scope.utmModelSchemaExtension.radioSelection == '')
				$scope.utmModelSchemaExtension.radioSelection = 'Required Only';
		}
	};
	
	$rootScope.initProjectExplorer();
	
	$scope.onChange= function(){
        console.log("onChange");
		
		list_model_schema_extensions[selected_model] = $scope.utmModelSchemaExtension;
		
	};
	
	$rootScope.requiredOnly = function(){
        console.log("requiredOnly");
		for (var key in $scope.utmModelSchemaExtension.utmSchemaExtentionMap) {
			
			if ($scope.utmModelSchemaExtension.utmSchemaExtentionMap.hasOwnProperty(key)) {				
				$scope.utmModelSchemaExtension.utmSchemaExtentionMap[key].checked =  $rootScope.requiredValues[key] != 0;
			}
		}
		angular.forEach($scope.utmModelSchemaExtension.utmSchemaExtentionMap, function(value, key) {
            console.log("forEach");
		});
	};
	
	$rootScope.selectAll = function(){
        console.log("selectAll");
		for (var key in $scope.utmModelSchemaExtension.utmSchemaExtentionMap) {
			
			if ($scope.utmModelSchemaExtension.utmSchemaExtentionMap.hasOwnProperty(key)) {
				
				$scope.utmModelSchemaExtension.utmSchemaExtentionMap[key].checked = true;
				
			}
		}
	};
	
	
	$rootScope.unSelectAll = function(){
        console.log("unSelectAll");
		for (var key in $scope.utmModelSchemaExtension.utmSchemaExtentionMap) {
			
			if ($scope.utmModelSchemaExtension.utmSchemaExtentionMap.hasOwnProperty(key)) {
				
				$scope.utmModelSchemaExtension.utmSchemaExtentionMap[key].checked = false;
				
			}
		}
	};
	
	// Functionality for Hierarchical Elements
	$scope.addHierarchicalElement1 = function(schemaElement, parentElement, elementKey, index){
        console.log("addHeirarchicalElement1");
		if($rootScope.isHorR){

		$scope.clonedSchemaElement={};
		angular.copy(schemaElement, $scope.clonedSchemaElement);
		
		if($scope.clonedSchemaElement.repeatableHierarchicalPrefix == null)
			$scope.clonedSchemaElement.repeatableHierarchicalPrefix = "";
		
		// Remove any Heirarchical/Repeatable Elements in the
		// ClonedSchemaElement
		for(var i=0;i<schemaElement.type.elements.length;i++) {
			if(schemaElement.type.elements[i].element.name.indexOf(schemaElement.element.name) != -1) {
				$scope.clonedSchemaElement.type.elements.splice(i,(schemaElement.type.elements.length-i));
				break;
			}
		}
		$scope.clonedSchemaElement.repeatableHierarchicalPrefix = (index+1);
		
			schemaElement.type.elements.push($scope.clonedSchemaElement);
		}
		
	}
	
	// Functionality for Hierarchical Elements
	$scope.addHierarchicalElement = function(schemaElement, parentElement, elementKey){
        console.log("addHierarchicalElement");
		$rootScope.isHorR = false;
		$scope.clonedSchemaElement={};
		angular.copy(schemaElement, $scope.clonedSchemaElement);
		
		if($scope.clonedSchemaElement.repeatableHierarchicalPrefix == null)
			$scope.clonedSchemaElement.repeatableHierarchicalPrefix = "";
		
		// Remove any Heirarchical/Repeatable Elements in the
		// ClonedSchemaElement
		for(var i=0;i<schemaElement.type.elements.length;i++) {
			if(schemaElement.type.elements[i].element.name.indexOf(schemaElement.element.name) != -1) {
				$scope.clonedSchemaElement.type.elements.splice(i,(schemaElement.type.elements.length-i));
				break;
			}
		}
		
		schemaElement.type.elements.push($scope.clonedSchemaElement);
		
		if(list_model_repeatable_heirarchical_elements[selected_model] == null) {
			list_model_repeatable_heirarchical_elements[selected_model] = {};
			list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements = [];
		}
		
		if(map_model_repeatable_heirarchical_elements[selected_model] == null)
			map_model_repeatable_heirarchical_elements[selected_model] = {};
		
		if(map_model_repeatable_heirarchical_elements[selected_model][elementKey] == null) {
			$scope.repeatableHeirachicalSchemaElement = {};
			$scope.repeatableHeirachicalSchemaElement.elementKey = elementKey;
			
			var count = list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements.length;
			list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements[count] = $scope.repeatableHeirachicalSchemaElement;
			
			$scope.clonedSchemaElement.repeatableHierarchicalPrefix = "1";
			$scope.repeatableHeirachicalSchemaElementChild = {};
			$scope.repeatableHeirachicalSchemaElementChild.elementKey = elementKey+'_'+ schemaElement.element.name + $scope.clonedSchemaElement.repeatableHierarchicalPrefix;
			
			$scope.repeatableHeirachicalSchemaElement.heirarchicalElements = [];
			$scope.repeatableHeirachicalSchemaElement.heirarchicalElements[0] = $scope.repeatableHeirachicalSchemaElementChild; 
			
			map_model_repeatable_heirarchical_elements[selected_model][elementKey] = $scope.repeatableHeirachicalSchemaElement;
			map_model_repeatable_heirarchical_elements[selected_model][$scope.repeatableHeirachicalSchemaElementChild.elementKey] = $scope.repeatableHeirachicalSchemaElementChild;
		} else {
			if(map_model_repeatable_heirarchical_elements[selected_model][elementKey].heirarchicalElements == null) {
				$scope.clonedSchemaElement.repeatableHierarchicalPrefix = "1";
				$scope.repeatableHeirachicalSchemaElementChild = {};
				$scope.repeatableHeirachicalSchemaElementChild.elementKey = elementKey+'_'+schemaElement.element.name + $scope.clonedSchemaElement.repeatableHierarchicalPrefix;
				
				map_model_repeatable_heirarchical_elements[selected_model][elementKey].heirarchicalElements = [];
				map_model_repeatable_heirarchical_elements[selected_model][elementKey].heirarchicalElements[0] = $scope.repeatableHeirachicalSchemaElementChild;
				
				map_model_repeatable_heirarchical_elements[selected_model][$scope.repeatableHeirachicalSchemaElementChild.elementKey] = $scope.repeatableHeirachicalSchemaElementChild;
			} else {
				var count = map_model_repeatable_heirarchical_elements[selected_model][elementKey].heirarchicalElements.length;
				
				$scope.clonedSchemaElement.repeatableHierarchicalPrefix = ""+(count+1);
				$scope.repeatableHeirachicalSchemaElementChild = {};
				$scope.repeatableHeirachicalSchemaElementChild.elementKey = elementKey+'_'+schemaElement.element.name + $scope.clonedSchemaElement.repeatableHierarchicalPrefix;
				
				map_model_repeatable_heirarchical_elements[selected_model][elementKey].heirarchicalElements[count] = $scope.repeatableHeirachicalSchemaElementChild;
				
				map_model_repeatable_heirarchical_elements[selected_model][$scope.repeatableHeirachicalSchemaElementChild.elementKey] = $scope.repeatableHeirachicalSchemaElementChild;
			}
		}
	};
	
	$scope.addRepeatableElement1 = function(schemaElement, parentElement, elementKey, index){
        console.log("addRepeatableElement1");
		if($rootScope.isHorR == true){
		$scope.clonedSchemaElement={};
		angular.copy(schemaElement, $scope.clonedSchemaElement);
		
		if($scope.clonedSchemaElement.repeatableHierarchicalPrefix == null)
			$scope.clonedSchemaElement.repeatableHierarchicalPrefix = "";
		
		$scope.clonedSchemaElement.repeatableHierarchicalPrefix = $scope.clonedSchemaElement.repeatableHierarchicalPrefix +"-"+(index+1);		
		
		$scope.childElements = {};
		if(parentElement.type != null && parentElement.type.elements != null) {
			$scope.childElements = parentElement.type.elements;
		} else if (parentElement.elements != null) {
			$scope.childElements = parentElement.elements;
		}
		
			if(schemaElement.type.complexType != null){
				for(var i=0;i<$scope.childElements.length;i++){
					if(angular.equals($scope.childElements[i],schemaElement)){	
						$scope.childElements.splice((i+1),0,$scope.clonedSchemaElement);
						break;
					}
				}
			} else if(schemaElement.element.name !=null) {
				for(var j=0;j<$scope.childElements.length;j++){
					if(angular.equals($scope.childElements[j],schemaElement)){							   
						$scope.childElements.splice((j+1),0,$scope.clonedSchemaElement);			  
						break;
					}
				}
			}
			
		}
		
	};
	
	$scope.getContextMenu = function(schemaElement,elementKey){
    	console.log("getContextMenu");
		$scope.myContextDiv ="";
		if(schemaElement.type.recursive && schemaElement.list){
			if(schemaElement.repeatableHierarchicalPrefix != null){
				$scope.myContextDiv = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='addHierarchicalElement(schemaElement, parentElement, elementKey)'> Add Hierarchical Element </li><li  class='contextmenu-item'  ng-click='addRepeatableElement(schemaElement, parentElement, elementKey)'> Add Repeatable Element </li><li class='contextmenu-item' ng-click='removeElement(schemaElement, parentElement, elementKey)'>Remove Element</li></ul>";
			}else{
				$scope.myContextDiv = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='addHierarchicalElement(schemaElement, parentElement, elementKey)'> Add Hierarchical Element </li><li  class='contextmenu-item'  ng-click='addRepeatableElement(schemaElement, parentElement, elementKey)'> Add Repeatable Element </li></ul>";
			}			
		}else if(schemaElement.type.recursive){
			if(schemaElement.repeatableHierarchicalPrefix != null){
				$scope.myContextDiv = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='addHierarchicalElement(schemaElement, parentElement, elementKey)'> Add Hierarchical Element </li><li class='contextmenu-item' ng-click='removeElement(schemaElement, parentElement, elementKey)'>Remove Element</li></ul>";
			}else{
				$scope.myContextDiv = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='addHierarchicalElement(schemaElement, parentElement, elementKey)'> Add Hierarchical Element </li></ul>";
			}
		}else if(schemaElement.list){			
			if(schemaElement.repeatableHierarchicalPrefix != null){
				$scope.myContextDiv = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='addRepeatableElement(schemaElement, parentElement, elementKey)'> Add Repeatable Element </li><li class='contextmenu-item' ng-click='removeElement(schemaElement, parentElement, elementKey)'>Remove Element</li></ul>";
			}else{
				$scope.myContextDiv = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='addRepeatableElement(schemaElement, parentElement, elementKey)'> Add Repeatable Element </li></ul>";
			}
		}else{
			$scope.myContextDiv ="";
		}
		
	};
	
	$scope.createSubModel = function(utmModels){
       console.log("createSubModel");		
		$scope.mySubModelContext ="";
		console.log("utmModels name::"+utmModels.name);
		selected_model = utmModels.name ;
		changecolor(utmModels.name);
		isModelfrmClick = true;		
		$scope.mySubModelContext = "<ul id='contextmenu-node' ><li class='contextmenu-item'  ng-click='createModel()'> Add Sub Model</li><li class='contextmenu-item'  ng-click='renameModel()'> Rename Model</li></ul>";
			
	};
	
	function changecolor(selected_model){
		console.log("changecolor");
		var i = 0;
	    $(".models").each(function(i){
            console.log("changecolor");
	    var model_value = $(this).text().trim();
	    if(model_value == selected_model || model_value == ""){
	    	$(this).addClass("selectedcolor");
	    }else {
	        $(this).removeClass("selectedcolor"); 
	    }  
	       i++; 
	    });
	};

	$scope.addRepeatableElement = function(schemaElement, parentElement, elementKey){ 
       console.log("addRepeatableElement");		
		$rootScope.isHorR = false;
		$scope.clonedSchemaElement={};
		angular.copy(schemaElement, $scope.clonedSchemaElement);

		if($scope.clonedSchemaElement.repeatableHierarchicalPrefix == null)
			$scope.clonedSchemaElement.repeatableHierarchicalPrefix = "";
		
		// Remove any Heirarchical/Repeatable Elements in the
		// ClonedSchemaElement
		if(schemaElement.type.complexType != null){
		for(var i=0;i<schemaElement.type.elements.length;i++) {
			if(schemaElement.type.elements[i].element.name.indexOf(schemaElement.element.name) != -1) {
				$scope.clonedSchemaElement.type.elements.splice(i,(schemaElement.type.elements.length-i));
				break;
			}
		}
		}
		
		$scope.childElements = {};
		if(parentElement.type != null && parentElement.type.elements != null) {
			$scope.childElements = parentElement.type.elements;
		} else if (parentElement.elements != null) {
			$scope.childElements = parentElement.elements;
		}
		
		if(schemaElement.type.complexType != null){
			for(var i=0;i<$scope.childElements.length;i++){
				if(angular.equals($scope.childElements[i],schemaElement)){	
					// console.log("Complex Element List Match :"
					// +$scope.childElements[i]);
					$scope.childElements.splice((i+1),0,$scope.clonedSchemaElement);
					break;
				}
			}
		} else if(schemaElement.element.name !=null) {			
			for(var j=0;j<$scope.childElements.length;j++){
				if(angular.equals($scope.childElements[j],schemaElement)){				
					// console.log("Element List Match :"
					// +$scope.childElements[j]);
					$scope.childElements.splice((j+1),0,$scope.clonedSchemaElement);			  
					break;
				}
			}
		}
		
		if(list_model_repeatable_heirarchical_elements[selected_model] == null) {
			list_model_repeatable_heirarchical_elements[selected_model] = {};
			list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements = [];
		}
		
		if(map_model_repeatable_heirarchical_elements[selected_model] == null)
			map_model_repeatable_heirarchical_elements[selected_model] = {};
		
		if(map_model_repeatable_heirarchical_elements[selected_model][elementKey] == null) {
			$scope.repeatableHeirachicalSchemaElement = {};
			$scope.repeatableHeirachicalSchemaElement.elementKey = elementKey;
			
			var count = list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements.length;
			list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements[count] = $scope.repeatableHeirachicalSchemaElement;

			$scope.clonedSchemaElement.repeatableHierarchicalPrefix = $scope.clonedSchemaElement.repeatableHierarchicalPrefix +"-" + 1;
			$scope.repeatableHeirachicalSchemaElementClone = {};
			$scope.repeatableHeirachicalSchemaElementClone.elementKey = elementKey +  "-" +1;
			
			$scope.repeatableHeirachicalSchemaElement.repeatableElements = [];
			$scope.repeatableHeirachicalSchemaElement.repeatableElements[0] = $scope.repeatableHeirachicalSchemaElementClone; 
			
			map_model_repeatable_heirarchical_elements[selected_model][elementKey] = $scope.repeatableHeirachicalSchemaElement;
			map_model_repeatable_heirarchical_elements[selected_model][$scope.repeatableHeirachicalSchemaElementClone.elementKey] = $scope.repeatableHeirachicalSchemaElementClone;
		} else {
			if(map_model_repeatable_heirarchical_elements[selected_model][elementKey].repeatableElements == null) {
				$scope.clonedSchemaElement.repeatableHierarchicalPrefix = $scope.clonedSchemaElement.repeatableHierarchicalPrefix+"-"+1;
				$scope.repeatableHeirachicalSchemaElementClone = {};
				$scope.repeatableHeirachicalSchemaElementClone.elementKey = elementKey + "-" +1;
				
				map_model_repeatable_heirarchical_elements[selected_model][elementKey].repeatableElements = [];
				map_model_repeatable_heirarchical_elements[selected_model][elementKey].repeatableElements[0] = $scope.repeatableHeirachicalSchemaElementClone;
				
				map_model_repeatable_heirarchical_elements[selected_model][$scope.repeatableHeirachicalSchemaElementClone.elementKey] = $scope.repeatableHeirachicalSchemaElementClone;
			} else {
				var count = map_model_repeatable_heirarchical_elements[selected_model][elementKey].repeatableElements.length;

				$scope.clonedSchemaElement.repeatableHierarchicalPrefix = $scope.clonedSchemaElement.repeatableHierarchicalPrefix+"-"+(count+1);
				$scope.repeatableHeirachicalSchemaElementClone = {};
				$scope.repeatableHeirachicalSchemaElementClone.elementKey = elementKey + "-" + (count+1);
				
				map_model_repeatable_heirarchical_elements[selected_model][elementKey].repeatableElements[count] = $scope.repeatableHeirachicalSchemaElementClone;				
				map_model_repeatable_heirarchical_elements[selected_model][$scope.repeatableHeirachicalSchemaElementClone.elementKey] = $scope.repeatableHeirachicalSchemaElementClone;
			}
		}
	};
	$scope.removeElement = function(schemaElement, parentElement, elementKey){
        console.log("removeElement");
		$scope.index =0;		
		if(parentElement.type != null && parentElement.type.elements != null) {
			$scope.childElements = parentElement.type.elements;
		} else if (parentElement.elements != null) {
			$scope.childElements = parentElement.elements;
		}
		
		if(schemaElement.type.complexType != null){
			for(var i=0;i<$scope.childElements.length;i++){
				if(angular.equals($scope.childElements[i],schemaElement)){	
					// console.log("Complex Element List Match :"
					// +$scope.childElements[i]);
					$scope.childElements.splice(i,1);
					$scope.index =i;
					break;
				}
			}
		} else if(schemaElement.element.name !=null) {			
			for(var j=0;j<$scope.childElements.length;j++){
				if(angular.equals($scope.childElements[j],schemaElement)){				
					// console.log("Element List Match :"
					// +$scope.childElements[j]);
					$scope.childElements.splice(j,1);	
					$scope.index= j;
					break;
				}
			}
		}
	
		if(list_model_repeatable_heirarchical_elements[selected_model] != null)
		 {
			for(var i=0;i<list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements.length;i++){
				if(list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements[i].elementKey.indexOf(schemaElement.element.name) > -1){
					$scope.removeRepeatableHeirarchicalMap(selected_model,list_model_repeatable_heirarchical_elements[selected_model].repeatableHeirachicalSchemaElements[i],elementKey);
				}
			}
			
		}
			
	};	
	
	
	$scope.removeRepeatableHeirarchicalMap= function(modelName,repeatableHeirachicalSchemaElement,elementKey){		
		console.log("removeRepeatableHeirarchicalMap");
		$scope.repeatableElements = repeatableHeirachicalSchemaElement.repeatableElements;
		$scope.heirarchicalElements = repeatableHeirachicalSchemaElement.heirarchicalElements;
				
		for(var j=0;j<$scope.repeatableElements.length;j++) {
			if(angular.equals($scope.repeatableElements[j].elementKey,elementKey)){				
				map_model_repeatable_heirarchical_elements[modelName][repeatableHeirachicalSchemaElement.elementKey].repeatableElements.splice(j,1);
				break;
			}
			
			if($scope.repeatableElements[j].repeatableElements.length >0 || $scope.repeatableElements[j].heirarchicalElements.length >0 ){
				if($scope.heirarchicalElements.length == 0){
					$scope.removeRepeatableHeirarchicalMap(modelName,$scope.repeatableElements[j],elementKey);	
				}else{
					
					if($scope.repeatableElements[j].heirarchicalElements.length > 0){
						for(var i=0 ;i<$scope.repeatableElements[j].heirarchicalElements.length;i++){
							if(angular.equals($scope.repeatableElements[j].heirarchicalElements[i].elementKey,elementKey)){
								$scope.removeRepeatableHeirarchicalMap(modelName,$scope.repeatableElements[j],elementKey);
							}
						}
					}
					if($scope.repeatableElements[j].repeatableElements.length > 0){
						for(var q=0 ;q<$scope.repeatableElements[j].repeatableElements.length;q++){
							if(angular.equals($scope.repeatableElements[j].repeatableElements[q].elementKey,elementKey)){
								$scope.removeRepeatableHeirarchicalMap(modelName,$scope.repeatableElements[j],elementKey);
							}
						}
					}
				}
			}	
		}	
		
		for(var k=0;k<$scope.heirarchicalElements.length;k++) {			
			if(angular.equals($scope.heirarchicalElements[k].elementKey,elementKey)){
				var count  = $scope.heirarchicalElements[k].repeatableElements.length;
				$scope.childElements.splice($scope.index,count);
				map_model_repeatable_heirarchical_elements[modelName][repeatableHeirachicalSchemaElement.elementKey].heirarchicalElements.splice(k,1);
				break;
			}
			$scope.removeRepeatableHeirarchicalMap(modelName,$scope.heirarchicalElements[k],elementKey);
		}
		
	};


}]);
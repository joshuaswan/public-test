angular.module('hr.service').factory("deptService",['$http', function($http){
    var deptDict = {};
    var deptDicts = [];
    $http.get(Path.getUri("api/appvsemp/dept-all")).success(
        function (data) {
            data.forEach(function(item) {
                deptDicts.push(item);
                deptDict[item.deptId] = item.deptName;
            });
        }
    ).error(
        function (data, status) {
        }
    );
    return {
        getDeptName : function(deptId) {
            return (deptDict[deptId] === undefined || deptDict[deptId] === "") ? deptId : deptDict[deptId];
        },
        getDeptDicts : function() {
            return deptDicts;
        }
    };
}]);

angular.module('hr.service').factory("staffService", ['$http', function ($http) {
    var staffDict = {};
    var staffDicts = [];
    $http.get(Path.getUri("api/staff-dicts/all")).success(
        function (data) {
            data.forEach(function (item) {
                staffDicts.push(item);
                staffDict[item.empId] = item.staffName;
            });
        }
    ).error(
        function (data, status) {
        }
    );
    return {
        getStaffName: function (empId) {
            return (staffDict[empId] === undefined || staffDict[empId] === "") ? empId : staffDict[empId];
        },
        getStaffDicts : function() {
            return staffDicts;
        }
    };
}]);

//科室转码
angular.module('hr.service').filter('dept', ['deptService', function (deptService) {
    return function(input) {
        return input == null ? null : deptService.getDeptName(input);
    };
}]);

//人员转码
angular.module('hr.service').filter('staff', ['staffService', function (staffService) {
    return function (input) {
        return input == null ? null : staffService.getStaffName(input);
    };
}]);

angular.module('hr.service').factory("unitsService",['HrBaseCode', function(HrBaseCode){
    var unitsDict = {};
    var unitsDicts = [];
    HrBaseCode.getBaseCode("BILL_UNITS_DICT", function(data) {
        data.forEach(function(item) {
            unitsDicts.push(item);
            unitsDict[item.codeId] = item.codeName;
        });
    });
    return {
        getUnitsName : function(unitsCode) {
            return (unitsDict[unitsCode] === undefined || unitsDict[unitsCode] === "") ? unitsCode : unitsDict[unitsCode];
        },
        getUnitsDicts : function() {
            return unitsDicts;
        }
    };
}]);

//单位转码
angular.module('hr.service').filter('units', ['unitsService', function (unitsService) {
    return function(input) {
        return unitsService.getUnitsName(input);
    };
}]);
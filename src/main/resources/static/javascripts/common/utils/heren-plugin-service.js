angular.module('hr.service').factory('PluginManager', ['$http', function ($http) {
    var PluginEvent = function (eventId, objectIdentifier, businessObject) {

        this.eventId = eventId;     //插入点编码
        this.objectIdentifier = objectIdentifier;
        this.businessObject = businessObject;
        this.cancel = false;
        this.errorDescription = "";
        this.appendDescription = "";
    };

    var sendTransToPlugin = function (eventId, objectIdentifier, businessObject, callback) {
        var urlPost = Path.getWebstartUri("api/heren-plugin/event");
        var pluginEvent = new PluginEvent(eventId, objectIdentifier, businessObject);
        $http.post(urlPost, pluginEvent)
            .success(
            function (data) {
                callback.success(data);
            })
            .error(
            function (data) {
                callback.error(data);
            });
    };

    var pluginHeart = function (callback) {
        var url = Path.getWebstartUri("api/heren-plugin/heart");
        $http.get(url).success(
            function (data) {
                callback(true);
            })
            .error(
            function (data) {
                callback(false);
            });
    };

    return{
        "sendTransToPlugin": sendTransToPlugin
    };
}]);
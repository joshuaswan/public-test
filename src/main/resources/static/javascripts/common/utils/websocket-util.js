function WebSocketService(relativeUrl,onOpenMsgs) {
    this._relativeUrl = relativeUrl;
    this._websocket = null;
    this._onMessage = $.noop();
    this._onOpenMsgs = onOpenMsgs || [];
    this.SHUT_DOWN_MSG = "{\"type\":\"command\",\"command\":\"shutdown\"}";
    this.HEART_BEAT_MSG = "{\"type\":\"heartbeat\"}";
}

WebSocketService.prototype =
{
    init: function(){
        this._websocket = new WebSocket("ws://" + window.document.location.host + this._relativeUrl);
        this._bindEvents();
        return this;
    },
    _bindEvents: function(){
        var me = this;
        this._websocket.onopen = function (evt) {
                var length = me._onOpenMsgs.length;
                for(var i=0;i<length;i++) {
                    me.send( me._onOpenMsgs[i]);
                }
            //客户端心跳
            window.setInterval(function () {
                me._keepAlive();
            }, 30000);
        };
        this._websocket.onmessage = function (evt) {
            me._onMessage(evt);
        };
        this._websocket.onclose = function (evt) {
            me._onClose(evt);
        };
        this._websocket.onerror = function (evt) {
           me._onError(evt);
        };
    },
    _keepAlive: function(){
        this.send(this.HEART_BEAT_MSG);
    },
    _onClose: function(evt){
        console.log("websocket on close:");
        console.log(evt);
        this.send(this.SHUT_DOWN_MSG);
    },
    _onError:function(evt){
        console.log("websocket on error:");
        console.log(evt);
        this.send(this.SHUT_DOWN_MSG);
    },
    send:function(msg){
        this._websocket.send(msg);
        return this;
    },
    onMessageCallback: function(callback){
         this._onMessage = callback;
         return this;
    }
};

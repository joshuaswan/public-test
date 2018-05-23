function WebSqlDbTable(db, getDataUrl) {
    this._db = db;
    this._getDataUrl = getDataUrl;

    //need to be override
    this._createSql = '';
    this._insertSql = '';
    this._insertSqlKeys = [];
    this._tableName = '';
}
WebSqlDbTable.prototype = {
    _init: function () {
        var me = this;
        var successCallback = function (tx, result) {/*insert success callback status*/
        };
        var time = new Date().getTime();
        var webSqlStorage = new WebSqlStorage(me._db);
        webSqlStorage.initWebStorageData(me._tableName, me._createSql,function () {
            webSqlStorage.getServerVersionByName(me._tableName, function (versionServer) {
                webSqlStorage.queryVersionByName(me._tableName, function (versionClient) {
//                alert(me._tableName + "versionServer=="+versionServer+" "+"versionClient=="+versionClient);
                    if (versionClient != versionServer) {
                        //此处删除表中所有的数据，后续只删除有改变的数据并只新加有变动的数据
                        me._db.deleteTableData(me._tableName, function () {
                            me._getApiData(function (data) {
                                for (var index in data) {
                                    var keys = me._insertSqlKeys;
                                    var rowData = [];
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        if (key.indexOf('.') > 0) {
                                            var keySplit = key.split('.');
                                            var tempData = data[index];
                                            for (var m = 0; m < keySplit.length; m++) {
                                                if (tempData !== null) {
                                                    tempData = tempData[keySplit[m]];
                                                } else {
                                                    tempData = "";
                                                }
                                            }
                                            if (typeof(tempData) == "number") {
                                                tempData = tempData.toString();
                                            }
                                            rowData.push(tempData);
                                        } else {
                                            var column = data[index][key];
                                            if (typeof(column) == "number") {
                                                column = column.toString();
                                            }
                                            rowData.push(column);
                                        }

                                    }
//                                    console.log(JSON.stringify(me._insertSqlKeys));
//                                    console.log(JSON.stringify(rowData));
                                    me._db.insertTableData(me._insertSql, rowData, successCallback);
                                }
                            });
                        });
                        if(parseFloat(versionServer) > parseFloat(versionClient)){
                        webSqlStorage.updateVersionByName(me._tableName, versionServer, successCallback);
                    } else {
                        webSqlStorage.updateServerVersionByName(me._tableName, versionClient, successCallback);
                    }
                }
                });

            });
        });
        var time1 = new Date().getTime();
//        console.log("初始化websql和插入数据所用时间=="+(time1-time));
    },
    _getWebSqlData: function (querySql, queryParam, callback) {
        this._db.queryTable(querySql, queryParam, function (results) {
            callback(results);
        });
    },
    _updateWebSqlData: function (updateSql, updateParam, callback) {
        this._db.updateTableData(updateSql,updateParam,function(results){
            callback(results);
        });
    },
    _getApiData: function (callback) {
        $.ajax({
                "type": "get",
                "url": this._getDataUrl,
                "dataType": "json",
                "success": function (data) {
                    var time = new Date().getTime();
                    callback(data);
                    var time1 = new Date().getTime();
//                    console.log("websql获取数据消耗时间=="+(time1-time))
                }}
        );
    }
};


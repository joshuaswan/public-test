function WebSqlDB() {
    this._webDb = null;
    this._dbName = "doctorstationDB";
    this._version = "1.0";
    this._dbDisplayName = "doctorstationDB";
    this._dbSize = 20 * 1024 * 1024;

}
WebSqlDB.prototype = {
    init: function () {
        //打开本地数据库连接
        this._webDb = openDatabase(this._dbName, this._version, this._dbDisplayName, this._dbSize);
    },
    createTable: function (createTableSql) {
        this._webDb.transaction(function (tx) {
            tx.executeSql(createTableSql);
        });
    },
    dropTable : function(tableName){
        this._webDb.transaction(function (tx) {
            tx.executeSql("DROP table "+tableName);
        });
    },
    hasTableData: function (tableName, callback) {
        this._webDb.transaction(function (tx) {
            tx.executeSql("select count(*) as count from " + tableName, [], function (tx, results) {
                var count = results.rows.item(0).count;
                callback(count);
            }, function (tx, error) {
                console.log("select table count is failed!");
                console.log(error);
            });
        });
    },
    //插入一条数据
    insertTableData: function (insertSql, rowData, callback) {
        this._webDb.transaction(function (tx) {
            tx.executeSql(insertSql, rowData, function (result) {
                callback(result);
            }, function (tx, error) {
                console.log("insert table data is failed!");
                console.log(tx, error);
            });
            tx.commit;
        });
    },
    //修改一条数据
    updateTableData: function (updateSql, rowData, callback) {
                this._webDb.transaction(function (tx) {
                    tx.executeSql(updateSql, rowData, function (result) {
                        callback(result);
                    }, function (tx, error) {
                        console.log("update table data is failed!");
                        console.log(tx, error);
                    });
            tx.commit;
        });
    },
    //删除数据
    deleteTableData: function (tableName, callback) {
        this._webDb.transaction(function (tx) {
            tx.executeSql("delete from " + tableName, [], function () {
                callback();
            }, function (tx, error) {
                console.log("delete table data is failed!");
                console.log(tx, error);
            });
            tx.commit;
        });
    },
    queryTable: function (querySql, queryParam, callback) {
        this._webDb.transaction(function (tx) {
            tx.executeSql(querySql, queryParam, function (tx,results) {
                var length = results.rows.length;
                if(results !== undefined && length>=0)  {
                    var resultsObj = [];
                    for(var i = 0; i<length; i++){
                        resultsObj.push( results.rows.item(i));
                    }
                    callback(resultsObj);
                }
            }, function (tx, error) {
                console.log("select table rows is failed!");
                console.log(tx, error);
            });
        });
    }
};


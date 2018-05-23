function WebSqlStorage(db) {
    this._db = db;
    this._createSql = 'create table if not exists web_sql_storage (table_name varchar2(40) not null, version varchar2(30),primary key (table_name))';
    this._insertSql = 'insert into web_sql_storage values(?,?)';
    this._insertData = [
        ["administration_dict", "0.5"],
        ["diagnosis_clinic_dict", "0.2"],
//        ["drug_info", "0.1"],
        ["drug_name_dict", "0.1"],
//        ["drug_dict", "0.1"],
//        ["drug_spec_catalog", "0.1"],
//        ["drug_trade_dict", "0.1"],
        ["measures_dict", "0.1"],
        ["official_drug_catalog", "0.1"],
        ["perform_freq_dict", "0.1"],
        ["drug_info_dict", "0.1"],
        ["clinic_for_register", "0.1"],
        ["clinic_for_appointment", "2.6"],
        ["price_list", "0.1"],
        ["price_item_name_dict", "0.1"],
        ["drug_price_list", "0.1"],
        ["drug_stock", "0.1"],
        ["drug_firm_catalog", "0.1"],
        ["dept_dict", "0.1"] ,
        ["doctor_dict", "0.1"]
    ];
}
WebSqlStorage.prototype.init = function() {
    this._db.createTable(this._createSql);
}

/* WebSqlStorage初始化数据方式变更   根据传过来的表白判断是否有此数据  无此数据进行新增  有的话继续判断其version是否相等执行后续逻辑
 * @param tableName
 * @param callback
 */
WebSqlStorage.prototype.initWebStorageData = function (tableName, createSql, callback) {
    var me = this;
    me._db.queryTable("select * from web_sql_storage where table_name = ?", [tableName], function (results) {
        if (results.length == 0) {
            //首次进页面初始化数据
            me._db.createTable(createSql);
            me._db.insertTableData(me._insertSql, [tableName, "0.0"], function () {
            });
        } else {
            me.queryVersionByName(tableName, function (versionClient) {
                me._insertData.forEach(function (tableList) {
                    if (tableList[0] === tableName && tableList[1] !== versionClient) {
                        if (parseFloat(tableList[1]) > parseFloat(versionClient)) {
                            me.updateVersionByName(tableName, tableList[1], callback);
                            me._db.dropTable(tableName);
                            me._db.createTable(createSql);
                        }
                    }
                });
            })
        }
        callback();
    });
};
WebSqlStorage.prototype.queryVersionByName = function (name, callback) {
    this._db.queryTable("select version from web_sql_storage where table_name = ?", [name], function (results) {
        callback(results[0].version);
    });
};

WebSqlStorage.prototype.updateVersionByName = function (name, version, callback) {
    this._db.updateTableData("update web_sql_storage set version = ? where table_name = ?", [version, name], function (results) {
        callback();
    });
};

WebSqlStorage.prototype.updateServerVersionByName = function (tableName, version, callback) {
    $.ajax({
            "type": "put",
            "url": Path.getUri("api/indexedDb-version/table-name/" + tableName + "/" + version),
            "success": function (data) {
                callback(data);
            }}
    );
}


WebSqlStorage.prototype.getServerVersionByName = function (name, callback) {
    $.ajax({
            "type": "get",
            "url": Path.getUri("api/indexedDb-version/table-name/" + name),
            "success": function (data) {
                callback(data);
            }}
    );
};
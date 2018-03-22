angular.module('hr.service').factory('hrIndexedDB', ['$q', '$http', function ($q, $http) {
    var _dbName = "HERENDH";
    var _IDBVersionTableName = "INDEXEDDB_VERSION";
    var _indexedDB = window.indexedDB || window.webkitIndexedDB;
    var _version = 1;
    var _db = null;
    var _storeMap = {};
    var _dbStatus = "init";
    var IDBStore = function (storeName) {
        this._storeName = storeName;
    };
    IDBStore.prototype = {
        /**
         * 根据store的主键（key）获取指定的记录
         * @param key主键id
         * @param callback 回调
         */
        getStoreDataByKey: function (key, callback) {
            var me = this;
            var request = _indexedDB.open(_dbName, _version);
            request.onsuccess = function () {
                var db = request.result;
                var objectStore = db.transaction([me._storeName]).objectStore(me._storeName);
                objectStore.get(key).onsuccess = function (e) {
                    var obj = e.target.result;
                    if (obj == null) {
                        console.log("obj not found!");
                    } else {
                        callback(obj);
                    }
                };
            };
        },
        /**
         * 通过indexedDb游标获取所有数据
         * @param callback
         */
        getStoreDataByCursor: function (callback) {
            var me = this;
            var arr = [];
            var request = _indexedDB.open(_dbName, _version);
            request.onsuccess = function (event) {
                request.result.transaction([me._storeName]).objectStore(me._storeName).openCursor().onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        arr.push(cursor.value);
                        cursor.continue();
                    } else {
                        callback(arr);
                    }
                };
            };
        },
        /**
         * 通过指定的索引查询记录
         * @param indexName 索引名称
         * @param indexValue 索引值 (可选) 不传值根据indexName查询所有的记录
         * @param callback
         */
        getStoreDataByIndex: function (indexName, indexValue, callback) {
            var me = this;
            var request = _indexedDB.open(_dbName, _version);
            var arr = [];
            request.onsuccess = function (event) {
                var range = null;
                if (indexValue != undefined || indexValue != null) {
                    range = IDBKeyRange.only(indexValue);
                }
                request.result.transaction([me._storeName]).objectStore(me._storeName).index(indexName).openCursor(range).onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        arr.push(cursor.value);
                        cursor.continue();
                    } else {
                        callback(arr);
                    }
                };
            };
        },
        /**
         * 根据指定的索引模糊查询数据
         * @param indexName 索引名称
         * @param inputValue 需要模糊匹配的值
         * @param likeexper  模糊匹配规则（like%  ： inputValue开始匹配  %like ： inputValue结尾匹配  null: inputValue 包含匹配）
         * @param callback
         */
        getStoreDataByLike: function (indexName, inputValue, likeexper, callback) {
            var me = this;
            var request = _indexedDB.open(_dbName, _version);
            var reg;
            if (new RegExp("%like").test(likeexper)) {
                reg = new RegExp(inputValue + "$");
            } else if (new RegExp("like%").test(likeexper)) {
                reg = new RegExp("^" + inputValue);
            } else {
                reg = new RegExp(inputValue);
            }
            var arr = [];
            request.onsuccess = function (event) {
                request.result.transaction([me._storeName]).objectStore(me._storeName).index(indexName).openCursor(null).onsuccess = function (e) {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (reg.test(cursor.key)) {
                            arr.push(cursor.value);
                        }
                        cursor.continue();
                    } else {
                        callback(arr);
                    }
                };
            };
        },
        /**
         * 从数组中遍历匹配的数据
         * @param array 需要检索的数组
         * @param indexName 索引名次
         * @param inputValue 匹配的值
         * @param likeexper  表达式
         * @param callback
         */
        getStoreDataByArray: function (array, indexName, inputValue, likeexper, callback) {
            if (array.length) {
                var arrs = [];
                var reg;
                if (new RegExp("%like").test(likeexper)) {
                    reg = new RegExp(inputValue + "$");
                } else if (new RegExp("like%").test(likeexper)) {
                    reg = new RegExp("^" + inputValue);
                } else {
                    reg = new RegExp(inputValue);
                }
                array.forEach(function (data) {
                    if (reg.test(data.indexName)) {
                        arrs.push(data);
                    }
                });
                callback(arrs);
            }
        },
        /**
         * 通过表名查询相关的字典数据
         * @param tableName 表名
         * @param callback
         */
        getHrDictByTableNameFormIndexedDb: function (tableName, callback) {
            this.getStoreDataByIndex("codeTypeName", tableName, function (data) {
                if(data){
                    callback(data.sort(function (a, b) {
                        return a.serialNo - b.serialNo;
                    }));
                }
            });
        }
    };
    /**
     * 插入数据
     * @param db
     * @param table
     * @param deferred
     * @param store
     * @private
     */
    var _insertData = function (table, deferred, store) {
        clearStoreData(table.tableName, function () {
            _getApiData(table, function (datas) {
                var time1 = new Date().getTime();
                var request = _indexedDB.open(_dbName, _version);
                request.onsuccess = function (event) {
                    var transaction = request.result.transaction([table.tableName], "readwrite");
                    var objectStore = transaction.objectStore(table.tableName);
                    datas.forEach(function (data) {
                        var req = objectStore.add(data);
                        req.onsuccess = function (event) {
                            console.log("insert into store success!");
                        };
                    });
                    transaction.oncomplete = function (event) {
                        deferred.currentIndex++;
                        console.log("resolve---------------currentIndex:" + deferred.currentIndex + "--insertCount:" + deferred.insertCount);
                        console.log("insert into data all done！");
                        var time2 = new Date().getTime();
                        console.log("insert into indexeddb store=【" + table.tableName + "】 use time==" + (time2 - time1));
                        if (deferred && store && deferred.currentIndex === deferred.insertCount) {
                            deferred.resolve(store);
                            _dbStatus = "success";
                            console.log(_dbStatus);
                        }
                    };
                };
            });
        });
    };
    /**
     * 获取版本管理表的数据
     * @param callback
     * @private
     */
    var _getIndexedDbServerVersion = function (callback) {
        $http.get(Path.getUri("api/indexedDb-version")).success(function (data) {
            callback(data);
        });
    };
    /**
     * 根据api获取数据
     * @param table
     * @param callback
     * @private
     */
    var _getApiData = function (table, callback) {
        $http.get(Path.getUri(table.api)).success(function (data) {
            callback(data);
        });
    };
    /**
     * 根据主键删除数据
     * @param storeName
     * @param key
     */
    var deleteDataByKey = function (storeName, key) {
        var request = _indexedDB.open(_dbName, _version);
        request.onsuccess = function (event) {
            var db = request.result;
            if (db.objectStoreNames.contains(storeName)) {
                var transaction = db.transaction([storeName], "readwrite");
                var objectStore = transaction.objectStore(storeName);
                request = objectStore.delete(key);
                request.onsuccess = function (event) {
                    console.log("delete key==【" + key + "】 data success");
                };
            }
        };
    };
    /**
     * 清空数据
     * @param storeName
     * @param callback
     */
    var clearStoreData = function (storeName, callback) {
        var request = _indexedDB.open(_dbName, _version);
        request.onsuccess = function (event) {
            var db = request.result;
            if (db.objectStoreNames.contains(storeName)) {
                var transaction = db.transaction([storeName], "readwrite");
                var objectStore = transaction.objectStore(storeName);
                request = objectStore.clear();
                request.onsuccess = function (event) {
                    console.log("clear store=【" + storeName + "】 data success");
                    callback();
                };
                request.onerror = function (event) {
                    console.log(event);
                };
            }
        };
    };
    /**
     * 查询记录总数
     * @param storeName
     * @param callback
     */
    var countStoreData = function (storeName, callback) {
        var request = _indexedDB.open(_dbName, _version);
        request.onsuccess = function (event) {
            var db = request.result;
            if (db.objectStoreNames.contains(storeName)) {
                var transaction = db.transaction([storeName], "readwrite");
                var objectStore = transaction.objectStore(storeName);
                objectStore.count().onsuccess = function (e) {
                    console.log("count store=【" + storeName + "】 data success! is count ===" + event.target.result);
                    callback(e.target.result);
                };
            }
        };
    };
    /**
     * 更新记录
     * @param value
     * @param storeName
     * @param callback
     */
    var updateStoreData = function (value, storeName, callback) {
        var request = _indexedDB.open(_dbName, _version);
        request.onsuccess = function (event) {
            var db = request.result;
            if (db.objectStoreNames.contains(storeName)) {
                var transaction = db.transaction([storeName], "readwrite");
                var objectStore = transaction.objectStore(storeName);
                objectStore.put(value).onsuccess = function (e) {
                    console.log("update store=【" + storeName + "】 data success! update key===" + event.target.result);
                    callback(event.target.result);
                };
            }
        };
    };
    var deferred = $q.defer();
    return function (storeName) {
        var promise = deferred.promise;
        promise.getHrDictByTableNameFormIndexedDb = function (tableName, callback) {
            promise.then(function (store) {
                store.getHrDictByTableNameFormIndexedDb(tableName, callback);
            });
            return promise;
        };
        promise.getStoreDataByIndex = function (indexName, indexValue, callback) {
            promise.then(function (store) {
                store.getStoreDataByIndex(indexName, indexValue, callback);
            });
            return promise;
        };
        promise.getStoreDataByLike = function (indexName, inputValue, likeexper, callback) {
            promise.then(function (store) {
                store.getStoreDataByLike(indexName, inputValue, likeexper, callback);
            });
            return promise;
        };
        if (_dbStatus === "init") {
            _dbStatus = "inprogress";
            _getIndexedDbServerVersion(function (data) {
                console.log(data);
                if (data) {
                    var IDBVersion = data.filter(function (item) {
                        if (item.tableName === _IDBVersionTableName) {
                            return true;
                        }
                    });
                    if (IDBVersion) {
                        _version = IDBVersion[0].version || 1;
                        var request = _indexedDB.open(_dbName, _version);
                    } else {
                        console.error("数据库中IndexedDB配置错误！");
                    }
                }
                //数据库更新时的初始化操作
                var initObjectStore = function (db, localData) {
                    var initStoreList = [];
                    for (var i = 0; i < data.length; i++) {
                        var table = data[i];
                        var tableTemp = null;
                        var isExists = localData.some(function (item) {
                            if (item.tableName === table.tableName) {
                                tableTemp = angular.copy(item);
                                return true;
                            }
                        });
                        if (!isExists || (isExists && tableTemp.version != table.version)) {
                            initStoreList.push(angular.copy(table));
                        }
                        if (data[i].tableName !== _IDBVersionTableName) {
                            _storeMap[data[i].tableName] = new IDBStore(data[i].tableName);
                        }
                    }
                    for (var m = 0; m < initStoreList.length; m++) {
                        if (db.objectStoreNames.contains(initStoreList[m].tableName)) {
                            db.deleteObjectStore(initStoreList[m].tableName);
                        }
                        var store = db.createObjectStore(initStoreList[m].tableName, { keyPath: '_id', autoIncrement: true });
                        var indexes = initStoreList[m].indexes ? initStoreList[m].indexes.split(";") : [];
                        if (indexes) {
                            indexes.forEach(function (index) {
                                if (typeof(index.name) === "object") {
                                    store.createIndex(index.name[0], index.name, { unique: false });
                                } else {
                                    store.createIndex(index, index, { unique: false });
                                }
                            });
                        }
                        if (m === 0) {
                            deferred.currentIndex = 0;
                            deferred.insertCount = initStoreList.length;
                        }
                        _insertData(initStoreList[m], deferred, _storeMap[storeName]);
                    }
                };
                //数据库版本改变时触发更新机制
                request.onupgradeneeded = function () {
                    _dbStatus = "upgrade";
                    console.log(_dbStatus);
                    var db = request.result;
                    var localData = [];
                    if (db.objectStoreNames.contains(IDBVersion[0].tableName)) {
                        var oldIDBVersion = request.transaction.objectStore(_IDBVersionTableName);
                        oldIDBVersion.openCursor().onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                localData.push(cursor.value);
                                cursor.continue();
                            } else {
                                oldIDBVersion.clear();
                                initObjectStore(db, localData);
                            }
                        };
                    } else {
                        initObjectStore(db, localData);
                    }
                };
                //数据库创建或者连接成功回调函数
                request.onsuccess = function () {
                    _db = request.result;
                    if (_dbStatus === "inprogress") {
                        if (angular.equals(_storeMap, {})) {
                            _db.transaction(_IDBVersionTableName, "readonly").objectStore(_IDBVersionTableName).openCursor().onsuccess = function (event) {
                                var cursor = event.target.result;
                                if (cursor) {
                                    if (cursor.value.tableName !== _IDBVersionTableName) {
                                        _storeMap[cursor.value.tableName] = new IDBStore(cursor.value.tableName);
                                    }
                                    cursor.continue();
                                } else {
                                    deferred.resolve(_storeMap[storeName]);
                                    _dbStatus = "success";
                                    console.log(_dbStatus);
                                }
                            };
                        } else {
                            deferred.resolve(_storeMap[storeName]);
                            _dbStatus = "success";
                            console.log(_dbStatus);
                        }
                    } else if (_dbStatus === "success") {
                        deferred.resolve(_storeMap[storeName]);
                        console.log(_dbStatus);
                    }
                };
                request.onerror = function (event) {
                    console.error(event);
                };
            });
        }
        return promise;
    }
}]);

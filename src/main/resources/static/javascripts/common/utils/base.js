/**
 * @author taolei
 * @description 保存cookies函数
 * @param {String} name cookie名字
 * @param {String} value cookie值
 */
function setCookie(name, value) {
    var Days = 60;   //cookie 将被保存两个月
    var exp = new Date();  //获得当前时间
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);  //换成毫秒
    document.cookie = name + "=" + escape(value) + ";path=/heren;expires=" + exp.toGMTString();
}

/**
 * @author taolei
 * @description 功能：获取cookies函数
 * @param {String} name cookie名字
 * @return {String} 对应的cookie值
 */
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr !== null)
        return unescape(arr[2]);
    return null;
}

/**
 * @author maxinyue
 * @description 根据页面传递的queryString获取参数值
 * @param {String} queryString 查询字符串
 * @param {String} name key
 * @return {String} key对应的value
 */
function getQueryString(queryString, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = queryString.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2])
    }
    return null;
}

/**
 * @author maxinyue
 * @description 获取员工对象
 * @return {Object}员工的json对象，相关属性参见
 * @see com.heren.his.domain.entity.staff.StaffDict
 */
function getStaffDict() {
    return getSessionJsonObject("staffDict");
}

/**
 * @author maxinyue
 * @description 获取医生对象
 * @return {Object} 医生的json对象，相关属性参见
 * @see com.heren.his.domain.entity.staff.DoctorDict
 */
function getDoctorDict() {
    return getSessionJsonObject("doctorDict");
}

/**
 * @author maxinyue
 * @description 获取科室对象
 * @return {Object} 科室的json对象，相关属性参见
 * @see com.heren.his.domain.entity.org.DeptDict
 */
function getDeptDict() {
    return getSessionJsonObject("deptDict");
}


/**
 * @author maxinyue
 * @description 获取所有应用程序本地参数对象
 * @return {Array} 所有本地参数配置的json对象数组
 * @see com.heren.his.domain.entity.staff.AppVsLocalPara
 */
function getTempAppVsLocalParas() {
    return getSessionJsonObject("tempAppVsLocalParas");
}

/**
 * @author maxinyue
 * @description 获取应用程序系统本地参数值
 * @param {String} key 系统参数名称，对应localConfigName属性的值
 * @return {String} 系统参数值,对应localValue属性的值
 * @see com.heren.his.domain.entity.staff.AppVsLocalPara
 */
function getTempLocalParaConfig(key) {
    if (HrStr.isNull(key)) {
        return null;
    }
    var appVsLocalParas = getTempAppVsLocalParas();
    if (appVsLocalParas == null) {
        return null;
    }
    var length = appVsLocalParas.length;
    for (var i = 0; i < length; i++) {
        if (appVsLocalParas[i].localConfigName.toUpperCase() === key.toUpperCase()) {
            return appVsLocalParas[i].localValue;
        }
    }
    return null;
}

/**
 * @author maxinyue
 * @description 获取所有业务工作台本地参数对象
 * @return {Array} 所有本地参数配置的json对象数组
 * @see com.heren.his.domain.entity.staff.AppVsLocalPara
 */
function getAppVsLocalParas() {
    return getSessionJsonObject("appVsLocalParas");
}


/**
 * @author maxinyue
 * @description 获取业务工作台本地参数值
 * @param {String} key 本地参数名称，对应localConfigName属性的值
 * @return {String} 本地参数值,对应localValue属性的值
 * @see com.heren.his.domain.entity.staff.AppVsLocalPara
 */
function getLocalParaConfig(key) {
    if (HrStr.isNull(key)) {
        return null;
    }
    var appVsLocalParas = getAppVsLocalParas();
    if (appVsLocalParas == null) {
        return null;
    }
    var length = appVsLocalParas.length;
    for (var i = 0; i < length; i++) {
        if (appVsLocalParas[i].localConfigName.toUpperCase() === key.toUpperCase()) {
            return appVsLocalParas[i].localValue;
        }
    }
    return null;
}

/**
 * @author maxinyue
 * @description 获取所有系统参数对象
 * @return {Array} 所有系统参数配置的json对象数组
 * @see com.heren.his.domain.entity.staff.SysParaConfig
 */
function getSysParaConfigs() {
    return getSessionJsonObject("sysParaConfigs");
}

/**
 * @author maxinyue
 * @description 获取系统参数值
 * @param {String} key 系统参数名称，对应localConfigName属性的值
 * @return {String} 系统参数值,对应localValue属性的值
 * @see com.heren.his.domain.entity.staff.AppVsLocalPara
 */
function getSysParaConfig(key) {
    if (HrStr.isNull(key)) {
        return null;
    }
    var sysParaConfigs = getSysParaConfigs();
    if (sysParaConfigs == null) {
        return null;
    }
    var length = sysParaConfigs.length;
    for (var i = 0; i < length; i++) {
        if (sysParaConfigs[i].sysConfigName.toUpperCase() === key.toUpperCase()) {
            return sysParaConfigs[i].sysValue;
        }
    }
    return null;
}

/**
 * @author maxinyue
 * @description 获取会话储存的系统信息对象
 * @param {String} key 会话储存key
 * @return {Object} 从sessionStorage获取对应key的value对象
 */
function getSessionJsonObject(key) {
    return  JSON.parse(window.sessionStorage.getItem(key));
}

/**
 * @author maxinyue
 * @deprecated
 * @description 从sessionStorage获取系统信息
 * @param {String}sessionStorageKey 会话储存key
 * @param {String}infoObjectKey 会话储存的json对象key
 * @return {Object} 从sessionStorage获取对应key的value对象
 */
function getFrameInfo(sessionStorageKey, infoObjectKey) {
    return  getSessionJsonObject(sessionStorageKey)[infoObjectKey];
}

/**
 * @author maxinyue
 * @description 存储对象在sessionStorage中
 * @param {String}key 会话储存key
 * @param {Object}jsonObject 会话储存json对象
 */
function saveSessionJsonObject(key, jsonObject) {
    window.sessionStorage.setItem(key, JSON.stringify(jsonObject));
}

/**
 * @author maxinyue
 * @description 获取某个对象的某个属性
 * @param {Object}object
 * @param {String}property
 * @return {Object}属性值
 */
function getProperty(object, property) {
    if (object === null || object === undefined || object === "") {
        return null;
    } else {
        return object[property];
    }
}

/**
 * @author maxinyue
 * @description 存储对象在localStorage中
 * @param {String}key 本地储存key
 * @param {Object}jsonObject 本地储存json对象
 */
function saveLocalJsonObject(key, jsonObject) {
    window.localStorage.setItem(key, JSON.stringify(jsonObject));
}

/**
 * @author maxinyue
 * @description 获取本地储存的json对象
 * @param {String} key 本地储存key
 * @return {Object} 从localStorage获取对应key的value对象
 */
function getLocalJsonObject(key) {
    return  JSON.parse(window.localStorage.getItem(key));
}

/**
 * @author maxinyue
 * @description 获取所有系统参数对象
 * @return {Array} 所有系统参数配置的json对象数组
 * @see com.heren.his.domain.entity.staff.SysParaConfig
 */
function getMachineConfigs() {
    return getLocalJsonObject("machineConfigs");
}

/**
 * @author maxinyue
 * @description 删除在localStorage中的对象
 * @param {String}key 本地储存key
 */
function delLocalJsonObject(key) {
    window.localStorage.removeItem(key);
}

/**
 * @author maxinyue
 * @description 删除在机器参数中的对象
 * @param {Object}machineConfig 要删除的对象
 */
function delMachineConfig(machineConfig) {
    var machineConfigs = getMachineConfigs();
    var length = machineConfigs.length;
    for (var i = 0; i < length; i++) {
        if (machineConfigs[i].configkey === machineConfig.configkey) {
            machineConfigs.splice(i, 1);
            saveLocalJsonObject("machineConfigs", machineConfigs);
            break;
        }
    }
}

/**
 * @author maxinyue
 * @description 添加在机器参数中的对象
 * @param {Object}machineConfig 要增加的对象
 */
function addMachineConfig(machineConfig) {
    var machineConfigs = getMachineConfigs();
    machineConfigs.push(machineConfig);
    saveLocalJsonObject("machineConfigs", machineConfigs);
}

/**
 * @author maxinyue
 * @description 更新在机器参数中的对象
 * @param {Object}machineConfig 要更新的对象
 */
function updateMachineConfig(machineConfig) {
    var machineConfigs = getMachineConfigs();
    var length = machineConfigs.length;
    for (var i = 0; i < length; i++) {
        if (machineConfigs[i].configkey === machineConfig.configkey) {
            machineConfigs[i] = machineConfig;
            saveLocalJsonObject("machineConfigs", machineConfigs);
            break;
        }
    }
}

/**
 * @author maxinyue
 * @description 获取所有机器参数对象
 * @return {Array} 所有机器参数的json对象数组
 */
function getMachineConfigs() {
    return getLocalJsonObject("machineConfigs");
}

/**
 * @author maxinyue
 * @description 获取机器参数值
 * @param {String} key 机器参数key，对应configkey属性的值
 * @return {String} 机器参数值,对应configvalue属性的值
 */
function getMachineConfig(key) {
    if (HrStr.isNull(key)) {
        return null;
    }
    var machineConfigs = getMachineConfigs();
    if (machineConfigs == null) {
        return null;
    }
    var length = machineConfigs.length;
    for (var i = 0; i < length; i++) {
        if (machineConfigs[i].configkey.toUpperCase() === key.toUpperCase()) {
            return machineConfigs[i].configvalue;
        }
    }
    return null;
}

/**
 * @author maxinyue
 * @description 根据优先级获取参数配置（优先级为 机器参数>本地参数>系统参数）
 * @param {String} key 配置(键)名称
 * @return {String} 配置值
 */
function getTopLevelConfig(key) {
    var machineConig = getMachineConfig(key);
    var localParaConfig = getLocalParaConfig(key);
    var tempLocalParaConfig = getTempLocalParaConfig(key);
    var sysParaConfig = getSysParaConfig(key);
    if (machineConig !== null && machineConig !== undefined && machineConig !== "") {
        return  machineConig;
    } else if (localParaConfig !== null && localParaConfig !== undefined && localParaConfig !== "") {
        return  localParaConfig;
    } else if (tempLocalParaConfig !== null && tempLocalParaConfig !== undefined && tempLocalParaConfig !== "") {
        return  tempLocalParaConfig;
    } else if (sysParaConfig !== null && sysParaConfig !== undefined && sysParaConfig !== "") {
        return  sysParaConfig;
    }
    return null;
}

/**
 * @author zhangmiaomiao
 * @description 更新或者新增在机器参数中的对象
 * @param {Object}machineConfig 要更新的对象
 */
function saveMachineConfigOperate(machineConfig) {
    var machineConfigs = getMachineConfigs();
    if(machineConfigs === null){
        var array = [];
        array.push(machineConfig);
        saveLocalJsonObject("machineConfigs", array);
    } else{
        var length = machineConfigs.length;
        var count = 0;
        for (var i = 0; i < length; i++) {
            if (machineConfigs[i].configkey === machineConfig.configkey) {
                count ++ ;
                machineConfigs[i] = machineConfig;
                saveLocalJsonObject("machineConfigs", machineConfigs);
                break;
            }
        }
        if(count === 0){
            machineConfigs.push(machineConfig);
            saveLocalJsonObject("machineConfigs", machineConfigs);
        }
    }
}

/**
 * @author zhangmiaomiao
 * @description 获取本地所有打印机名称
 */
function getAllPrintersName(){
    if(getLocalJsonObject("local_printers_name")){
        return getLocalJsonObject("local_printers_name").printers;
    }else{
        return [];
    }
}





